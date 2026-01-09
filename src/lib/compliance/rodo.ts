import { supabaseAdmin } from '@/lib/db/supabase'
import type { Consent, AuditLog } from '@/types'

// RODO/GDPR Compliance Module
// Implements Article 9 requirements for medical data

export type ConsentType = 'data_processing' | 'medical_data' | 'marketing' | 'third_party'

export interface ConsentRequest {
  userId: string
  type: ConsentType
  granted: boolean
  ipAddress: string
  userAgent: string
}

// Record user consent
export async function recordConsent(request: ConsentRequest): Promise<Consent> {
  const { userId, type, granted, ipAddress, userAgent } = request

  // Check for existing consent
  const { data: existing } = await supabaseAdmin
    .from('consents')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .single()

  if (existing) {
    // Update existing consent
    const { data, error } = await supabaseAdmin
      .from('consents')
      .update({
        granted,
        granted_at: granted ? new Date().toISOString() : existing.granted_at,
        withdrawn_at: !granted ? new Date().toISOString() : null,
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error

    await logAudit({
      userId,
      action: granted ? 'consent_granted' : 'consent_withdrawn',
      resourceType: 'consent',
      resourceId: existing.id,
      oldValue: existing,
      newValue: data,
      ipAddress,
      userAgent,
    })

    return data as Consent
  }

  // Create new consent
  const { data, error } = await supabaseAdmin
    .from('consents')
    .insert({
      user_id: userId,
      type,
      granted,
      granted_at: granted ? new Date().toISOString() : null,
      ip_address: ipAddress,
      user_agent: userAgent,
    })
    .select()
    .single()

  if (error) throw error

  await logAudit({
    userId,
    action: 'consent_created',
    resourceType: 'consent',
    resourceId: data.id,
    newValue: data,
    ipAddress,
    userAgent,
  })

  return data as Consent
}

// Get user consents
export async function getUserConsents(userId: string): Promise<Consent[]> {
  const { data, error } = await supabaseAdmin
    .from('consents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Consent[]
}

// Check if user has valid consent
export async function hasValidConsent(userId: string, type: ConsentType): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('consents')
    .select('granted')
    .eq('user_id', userId)
    .eq('type', type)
    .is('withdrawn_at', null)
    .single()

  if (error || !data) return false
  return data.granted
}

// Audit logging
export interface AuditLogRequest {
  userId: string
  action: string
  resourceType: string
  resourceId: string
  oldValue?: Record<string, unknown>
  newValue?: Record<string, unknown>
  ipAddress: string
  userAgent: string
}

export async function logAudit(request: AuditLogRequest): Promise<void> {
  const { error } = await supabaseAdmin
    .from('audit_logs')
    .insert({
      user_id: request.userId,
      action: request.action,
      resource_type: request.resourceType,
      resource_id: request.resourceId,
      old_value: request.oldValue,
      new_value: request.newValue,
      ip_address: request.ipAddress,
      user_agent: request.userAgent,
    })

  if (error) {
    console.error('Failed to log audit:', error)
  }
}

// Get audit logs for user
export async function getAuditLogs(
  userId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<AuditLog[]> {
  const { limit = 100, offset = 0 } = options

  const { data, error } = await supabaseAdmin
    .from('audit_logs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return data as AuditLog[]
}

// Data export (RODO Article 20 - Right to data portability)
export async function exportUserData(userId: string): Promise<Record<string, unknown>> {
  const [
    { data: user },
    { data: consents },
    { data: auditLogs },
    { data: conversations },
    { data: subscriptions },
  ] = await Promise.all([
    supabaseAdmin.from('users').select('*').eq('id', userId).single(),
    supabaseAdmin.from('consents').select('*').eq('user_id', userId),
    supabaseAdmin.from('audit_logs').select('*').eq('user_id', userId),
    supabaseAdmin.from('ai_conversations').select('*').eq('user_id', userId),
    supabaseAdmin.from('subscriptions').select('*').eq('user_id', userId),
  ])

  return {
    exportDate: new Date().toISOString(),
    user,
    consents,
    auditLogs,
    conversations,
    subscriptions,
  }
}

// Data deletion (RODO Article 17 - Right to erasure)
export async function deleteUserData(
  userId: string,
  ipAddress: string,
  userAgent: string
): Promise<void> {
  // Log the deletion request first
  await logAudit({
    userId,
    action: 'data_deletion_requested',
    resourceType: 'user',
    resourceId: userId,
    ipAddress,
    userAgent,
  })

  // Delete in order to respect foreign key constraints
  await supabaseAdmin.from('fsrs_cards').delete().eq('user_id', userId)
  await supabaseAdmin.from('ai_conversations').delete().eq('user_id', userId)
  await supabaseAdmin.from('subscriptions').delete().eq('user_id', userId)

  // Keep audit logs for 20 years as required by medical regulations
  // But anonymize them
  await supabaseAdmin
    .from('audit_logs')
    .update({ user_id: 'DELETED_USER' })
    .eq('user_id', userId)

  // Keep consents record for legal compliance but mark as deleted
  await supabaseAdmin
    .from('consents')
    .update({ user_id: 'DELETED_USER' })
    .eq('user_id', userId)

  // Finally delete the user
  await supabaseAdmin.from('users').delete().eq('id', userId)

  // Delete from Supabase Auth
  await supabaseAdmin.auth.admin.deleteUser(userId)
}

// Medical data specific requirements
export const MEDICAL_DATA_RETENTION_YEARS = 20

export async function checkMedicalDataAccess(
  userId: string,
  requestingUserId: string,
  resourceType: string,
  ipAddress: string,
  userAgent: string
): Promise<boolean> {
  // Check if requesting user has medical_data consent
  const hasConsent = await hasValidConsent(userId, 'medical_data')

  // Log the access attempt
  await logAudit({
    userId: requestingUserId,
    action: 'medical_data_access_attempt',
    resourceType,
    resourceId: userId,
    newValue: { hasConsent, targetUserId: userId },
    ipAddress,
    userAgent,
  })

  return hasConsent
}

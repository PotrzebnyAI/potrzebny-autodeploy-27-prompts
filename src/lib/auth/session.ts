import { cookies } from 'next/headers'
import { createServerClient } from '@/lib/db/supabase'
import { cache } from '@/lib/db/redis'
import type { User, PanelId } from '@/types'

const SESSION_COOKIE_NAME = 'potrzebny-session'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days

export interface Session {
  userId: string
  email: string
  panels: PanelId[]
  expiresAt: number
}

// Get current session
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  // Try cache first
  const cachedSession = await cache.get<Session>(`session:${sessionToken}`)
  if (cachedSession) {
    if (cachedSession.expiresAt > Date.now()) {
      return cachedSession
    }
    // Session expired, clean up
    await cache.delete(`session:${sessionToken}`)
    return null
  }

  // Fall back to Supabase auth
  const supabase = await createServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  // Create new session in cache
  const session: Session = {
    userId: user.id,
    email: user.email!,
    panels: (user.user_metadata?.panels as PanelId[]) || [],
    expiresAt: Date.now() + SESSION_DURATION * 1000,
  }

  await cache.set(`session:${sessionToken}`, session, SESSION_DURATION)

  return session
}

// Get current user with full profile
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()
  if (!session) return null

  // Try cache first
  const cachedUser = await cache.get<User>(`user:${session.userId}`)
  if (cachedUser) {
    return cachedUser
  }

  // Fetch from database
  const supabase = await createServerClient()
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.userId)
    .single()

  if (error || !user) {
    return null
  }

  // Cache for 5 minutes
  await cache.set(`user:${session.userId}`, user, 300)

  return user as User
}

// Check if user has access to panel
export async function hasAccess(panelId: PanelId): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  return session.panels.includes(panelId)
}

// Check if user has any of the specified panels
export async function hasAnyAccess(panelIds: PanelId[]): Promise<boolean> {
  const session = await getSession()
  if (!session) return false

  return panelIds.some(id => session.panels.includes(id))
}

// Require authentication (throws if not authenticated)
export async function requireAuth(): Promise<Session> {
  const session = await getSession()
  if (!session) {
    throw new Error('Authentication required')
  }
  return session
}

// Require access to specific panel
export async function requireAccess(panelId: PanelId): Promise<Session> {
  const session = await requireAuth()
  if (!session.panels.includes(panelId)) {
    throw new Error(`Access to panel ${panelId} required`)
  }
  return session
}

// Invalidate session cache
export async function invalidateSession(userId: string): Promise<void> {
  await cache.delete(`user:${userId}`)
  // Note: Full session invalidation requires iterating through all session keys
  // This is handled by the logout flow
}

// Sign out
export async function signOut(): Promise<void> {
  const supabase = await createServerClient()
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    await cache.delete(`user:${session.user.id}`)
    await supabase.auth.signOut()
  }

  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

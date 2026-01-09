import { createClient } from '@supabase/supabase-js'
import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client-side Supabase client
export const createBrowserClient = () => {
  return createClientComponentClient()
}

// Server-side Supabase client (for Server Components)
export const createServerClient = async () => {
  const cookieStore = await cookies()
  return createServerComponentClient({ cookies: () => cookieStore })
}

// Admin client with service role (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Database types for type safety
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          avatar_url: string | null
          panels: string[]
          subscription_status: string
          accessibility_settings: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          panel_ids: string[]
          status: string
          current_period_start: string
          current_period_end: string
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['subscriptions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          panel_id: string
          messages: Record<string, unknown>[]
          context: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['ai_conversations']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['ai_conversations']['Insert']>
      }
      consents: {
        Row: {
          id: string
          user_id: string
          type: string
          granted: boolean
          granted_at: string
          withdrawn_at: string | null
          ip_address: string
          user_agent: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['consents']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['consents']['Insert']>
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          resource_type: string
          resource_id: string
          old_value: Record<string, unknown> | null
          new_value: Record<string, unknown> | null
          ip_address: string
          user_agent: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['audit_logs']['Row'], 'id' | 'created_at'>
        Update: never
      }
      fsrs_cards: {
        Row: {
          id: string
          user_id: string
          content_id: string
          difficulty: number
          stability: number
          retrievability: number
          last_review: string
          next_review: string
          reps: number
          lapses: number
          state: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['fsrs_cards']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['fsrs_cards']['Insert']>
      }
    }
  }
}

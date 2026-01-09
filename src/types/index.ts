// POTRZEBNY.AI - Core Type Definitions

// ============================================
// Panel Types (P1-P22)
// ============================================

export type PanelId =
  | 'P1' | 'P2' | 'P3' | 'P4' | 'P5' | 'P6' | 'P7' | 'P8' | 'P9' | 'P10'
  | 'P11' | 'P12' | 'P13' | 'P14' | 'P15' | 'P16' | 'P17' | 'P18' | 'P19' | 'P20'
  | 'P21' | 'P22'

export type PanelSlug =
  | 'teacher' | 'lecturer' | 'therapist' | 'doctor' | 'therapist-training'
  | 'admin-custom' | 'parent' | 'super-admin' | 'comet-assistant' | 'student'
  | 'academic-student' | 'patient' | 'medical-student' | 'training-custom'
  | 'superbrain' | 'superbrain-ultra' | 'research' | 'therapeutic-exercises'
  | 'telebim' | 'psychomedic' | 'infrastructure' | 'geminification'

export interface Panel {
  id: PanelId
  name: string
  slug: PanelSlug
  price: number
  currency: 'PLN'
  description: string
  features: string[]
  accessLevel: 'free' | 'basic' | 'premium' | 'enterprise'
  category: 'education' | 'medical' | 'therapeutic' | 'admin' | 'research' | 'special'
}

export const PANELS: Record<PanelId, Panel> = {
  P1: { id: 'P1', name: 'NAUCZYCIEL', slug: 'teacher', price: 0, currency: 'PLN', description: 'Panel dla nauczycieli', features: ['AI asystent', 'Generowanie materiałów', 'Analiza postępów'], accessLevel: 'free', category: 'education' },
  P2: { id: 'P2', name: 'WYKŁADOWCA', slug: 'lecturer', price: 0, currency: 'PLN', description: 'Panel dla wykładowców akademickich', features: ['Tworzenie wykładów', 'Zarządzanie kursami', 'Analityka'], accessLevel: 'free', category: 'education' },
  P3: { id: 'P3', name: 'TERAPEUTA', slug: 'therapist', price: 49, currency: 'PLN', description: 'Panel dla terapeutów', features: ['Sesje terapeutyczne', 'Śledzenie postępów', 'Dokumentacja'], accessLevel: 'premium', category: 'therapeutic' },
  P4: { id: 'P4', name: 'LEKARZ', slug: 'doctor', price: 49, currency: 'PLN', description: 'Panel dla lekarzy', features: ['Konsultacje AI', 'Dokumentacja medyczna', 'RODO compliance'], accessLevel: 'premium', category: 'medical' },
  P5: { id: 'P5', name: 'TERAPEUTA_SZKOLĄCY', slug: 'therapist-training', price: 49, currency: 'PLN', description: 'Panel szkoleniowy dla terapeutów', features: ['Kursy certyfikacyjne', 'Symulacje', 'Mentoring'], accessLevel: 'premium', category: 'therapeutic' },
  P6: { id: 'P6', name: 'ADMIN_PERSONALIZACJA', slug: 'admin-custom', price: 49, currency: 'PLN', description: 'Panel administracyjny z personalizacją', features: ['Konfiguracja systemu', 'Zarządzanie użytkownikami', 'Raporty'], accessLevel: 'premium', category: 'admin' },
  P7: { id: 'P7', name: 'RODZIC', slug: 'parent', price: 29, currency: 'PLN', description: 'Panel dla rodziców', features: ['Śledzenie postępów dziecka', 'Komunikacja', 'Raporty'], accessLevel: 'basic', category: 'education' },
  P8: { id: 'P8', name: 'SUPER_ADMIN', slug: 'super-admin', price: 0, currency: 'PLN', description: 'Panel super administratora', features: ['Pełna kontrola systemu', 'Zarządzanie wszystkimi panelami', 'Analityka globalna'], accessLevel: 'enterprise', category: 'admin' },
  P9: { id: 'P9', name: 'ASYSTENT_COMET', slug: 'comet-assistant', price: 29, currency: 'PLN', description: 'AI Asystent COMET', features: ['Inteligentny asystent', 'Automatyzacja zadań', 'Integracje'], accessLevel: 'basic', category: 'special' },
  P10: { id: 'P10', name: 'STUDENT', slug: 'student', price: 0, currency: 'PLN', description: 'Panel dla uczniów', features: ['Nauka z AI', 'Ćwiczenia', 'Postępy'], accessLevel: 'free', category: 'education' },
  P11: { id: 'P11', name: 'STUDENT_AKADEMICKI', slug: 'academic-student', price: 29, currency: 'PLN', description: 'Panel dla studentów akademickich', features: ['Materiały akademickie', 'Badania', 'Współpraca'], accessLevel: 'basic', category: 'education' },
  P12: { id: 'P12', name: 'PACJENT', slug: 'patient', price: 0, currency: 'PLN', description: 'Panel dla pacjentów', features: ['Historia medyczna', 'Komunikacja z lekarzem', 'Przypomnienia'], accessLevel: 'free', category: 'medical' },
  P13: { id: 'P13', name: 'STUDENT_MEDYCZNY', slug: 'medical-student', price: 29, currency: 'PLN', description: 'Panel dla studentów medycyny', features: ['Przypadki kliniczne', 'Symulacje', 'Egzaminy'], accessLevel: 'basic', category: 'medical' },
  P14: { id: 'P14', name: 'PERSONALIZACJA_TRENINGU', slug: 'training-custom', price: 49, currency: 'PLN', description: 'Panel personalizacji treningu', features: ['Spersonalizowane programy', 'Tracking', 'AI coaching'], accessLevel: 'premium', category: 'special' },
  P15: { id: 'P15', name: 'SUPERMÓZG', slug: 'superbrain', price: 79, currency: 'PLN', description: 'Panel Supermózg', features: ['Zaawansowane AI', 'Techniki pamięciowe', 'FSRS'], accessLevel: 'premium', category: 'special' },
  P16: { id: 'P16', name: 'SUPERMÓZG_ULTRA', slug: 'superbrain-ultra', price: 699, currency: 'PLN', description: 'Panel Supermózg Ultra', features: ['Pełna moc AI', 'Wszystkie funkcje', 'Priorytetowe wsparcie'], accessLevel: 'enterprise', category: 'special' },
  P17: { id: 'P17', name: 'RESEARCH_PREMIUM', slug: 'research', price: 799, currency: 'PLN', description: 'Panel badawczy premium', features: ['Dostęp do badań', 'Narzędzia analityczne', 'Publikacje'], accessLevel: 'enterprise', category: 'research' },
  P18: { id: 'P18', name: 'ĆWICZENIA_TERAPEUTYCZNE', slug: 'therapeutic-exercises', price: 49, currency: 'PLN', description: 'Panel ćwiczeń terapeutycznych', features: ['Biblioteka ćwiczeń', 'Personalizacja', 'Tracking'], accessLevel: 'premium', category: 'therapeutic' },
  P19: { id: 'P19', name: 'TELEBIM_LED', slug: 'telebim', price: 49, currency: 'PLN', description: 'Panel telebim LED', features: ['Zarządzanie wyświetlaczami', 'Treści', 'Harmonogram'], accessLevel: 'premium', category: 'special' },
  P20: { id: 'P20', name: 'PSYCHOMEDIC', slug: 'psychomedic', price: 79, currency: 'PLN', description: 'Panel psychomedyczny', features: ['Integracja psychologia-medycyna', 'Holistyczne podejście', 'AI diagnostyka'], accessLevel: 'premium', category: 'medical' },
  P21: { id: 'P21', name: 'INFRASTRUKTURA', slug: 'infrastructure', price: 0, currency: 'PLN', description: 'Panel infrastruktury', features: ['Monitoring', 'DevOps', 'Automatyzacja'], accessLevel: 'enterprise', category: 'admin' },
  P22: { id: 'P22', name: 'GEMINIFIKACJA', slug: 'geminification', price: 79, currency: 'PLN', description: 'Panel geminifikacji', features: ['Gamifikacja zaawansowana', 'Motywacja', 'Osiągnięcia'], accessLevel: 'premium', category: 'special' },
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  name: string
  avatar_url?: string
  panels: PanelId[]
  subscription_status: 'active' | 'inactive' | 'trial' | 'cancelled'
  accessibility_settings: AccessibilitySettings
  created_at: string
  updated_at: string
}

export interface AccessibilitySettings {
  mode: 'standard' | 'adhd' | 'dyslexia' | 'asd' | 'custom'
  font_size: 'small' | 'medium' | 'large' | 'xl'
  font_family: 'sans' | 'dyslexic' | 'mono'
  high_contrast: boolean
  reduce_motion: boolean
  focus_mode: boolean
  color_blind_mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'
}

// ============================================
// AI Types
// ============================================

export type AIProvider = 'anthropic' | 'openai' | 'deepseek' | 'gemini'

export interface AIMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  provider: AIProvider
  model: string
  tokens_used: number
  created_at: string
}

export interface AIConversation {
  id: string
  user_id: string
  panel_id: PanelId
  messages: AIMessage[]
  context: Record<string, unknown>
  created_at: string
  updated_at: string
}

// ============================================
// Payment Types (Stripe)
// ============================================

export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  panel_ids: PanelId[]
  status: 'active' | 'past_due' | 'cancelled' | 'incomplete'
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'blik'
  last4?: string
  brand?: string
  exp_month?: number
  exp_year?: number
}

// ============================================
// FSRS (Spaced Repetition) Types
// ============================================

export interface FSRSCard {
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
  state: 'new' | 'learning' | 'review' | 'relearning'
}

export interface FSRSReview {
  id: string
  card_id: string
  rating: 1 | 2 | 3 | 4 // Again, Hard, Good, Easy
  time_taken_ms: number
  scheduled_days: number
  created_at: string
}

// ============================================
// Compliance Types (RODO/GDPR)
// ============================================

export interface Consent {
  id: string
  user_id: string
  type: 'data_processing' | 'medical_data' | 'marketing' | 'third_party'
  granted: boolean
  granted_at: string
  withdrawn_at?: string
  ip_address: string
  user_agent: string
}

export interface AuditLog {
  id: string
  user_id: string
  action: string
  resource_type: string
  resource_id: string
  old_value?: Record<string, unknown>
  new_value?: Record<string, unknown>
  ip_address: string
  user_agent: string
  created_at: string
}

// ============================================
// Validic Types (Health Data Integration)
// ============================================

export interface ValidicUser {
  id: string
  user_id: string
  validic_user_id: string
  connected_sources: ValidicSource[]
  created_at: string
}

export interface ValidicSource {
  type: string
  name: string
  connected_at: string
  last_sync: string
}

export interface HealthMetric {
  id: string
  user_id: string
  source: string
  type: 'steps' | 'heart_rate' | 'sleep' | 'activity' | 'nutrition' | 'weight'
  value: number
  unit: string
  recorded_at: string
}

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export type ApiError = {
  code: string
  message: string
  status: number
}

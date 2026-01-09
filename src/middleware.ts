import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

// Panel routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/api/ai',
  '/api/stripe',
  '/api/user',
]

// Panel routes mapped to required panel access
const PANEL_ROUTES: Record<string, string[]> = {
  '/dashboard/teacher': ['P1'],
  '/dashboard/lecturer': ['P2'],
  '/dashboard/therapist': ['P3'],
  '/dashboard/doctor': ['P4'],
  '/dashboard/therapist-training': ['P5'],
  '/dashboard/admin-custom': ['P6'],
  '/dashboard/parent': ['P7'],
  '/dashboard/super-admin': ['P8'],
  '/dashboard/comet-assistant': ['P9'],
  '/dashboard/student': ['P10'],
  '/dashboard/academic-student': ['P11'],
  '/dashboard/patient': ['P12'],
  '/dashboard/medical-student': ['P13'],
  '/dashboard/training-custom': ['P14'],
  '/dashboard/superbrain': ['P15'],
  '/dashboard/superbrain-ultra': ['P16'],
  '/dashboard/research': ['P17'],
  '/dashboard/therapeutic-exercises': ['P18'],
  '/dashboard/telebim': ['P19'],
  '/dashboard/psychomedic': ['P20'],
  '/dashboard/infrastructure': ['P21'],
  '/dashboard/geminification': ['P22'],
}

// Free panels that don't require subscription
const FREE_PANELS = ['P1', 'P2', 'P8', 'P10', 'P12', 'P21']

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/register',
  '/forgot-password',
  '/pricing',
  '/about',
  '/api/health',
  '/api/webhooks',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route + '/'))) {
    return NextResponse.next()
  }

  // Allow static files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/icons') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Create Supabase client for middleware
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Get session
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // Check if route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && (!session || error)) {
    // Redirect to login with return URL
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Check panel-specific access
  for (const [route, requiredPanels] of Object.entries(PANEL_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!session) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('returnUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      const userPanels = (session.user.user_metadata?.panels as string[]) || []

      // Check if user has access to any of the required panels
      const hasAccess = requiredPanels.some(panel =>
        userPanels.includes(panel) || FREE_PANELS.includes(panel)
      )

      if (!hasAccess) {
        // Redirect to pricing page
        const pricingUrl = new URL('/pricing', request.url)
        pricingUrl.searchParams.set('panel', requiredPanels[0])
        return NextResponse.redirect(pricingUrl)
      }
    }
  }

  // Add security headers
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Rate limiting header (actual limiting done in API routes)
  res.headers.set('X-RateLimit-Policy', 'standard')

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

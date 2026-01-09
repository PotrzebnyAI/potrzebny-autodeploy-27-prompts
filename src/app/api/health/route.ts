import { NextResponse } from 'next/server'
import { redis } from '@/lib/db/redis'

export async function GET() {
  const checks: Record<string, { status: 'ok' | 'error'; latency?: number; message?: string }> = {}
  const startTime = Date.now()

  // Check Redis
  try {
    const redisStart = Date.now()
    await redis.ping()
    checks.redis = { status: 'ok', latency: Date.now() - redisStart }
  } catch (error) {
    checks.redis = { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' }
  }

  // Calculate overall status
  const allOk = Object.values(checks).every(check => check.status === 'ok')

  return NextResponse.json(
    {
      status: allOk ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      checks,
      totalLatency: Date.now() - startTime,
    },
    { status: allOk ? 200 : 503 }
  )
}

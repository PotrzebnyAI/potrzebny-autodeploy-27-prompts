import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

// Initialize Redis client with Upstash
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// Rate limiting configurations for different use cases
export const rateLimiters = {
  // AI API calls - 100 requests per minute
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: 'ratelimit:ai',
  }),

  // Authentication attempts - 10 per minute
  auth: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: 'ratelimit:auth',
  }),

  // General API - 1000 requests per minute
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(1000, '1 m'),
    analytics: true,
    prefix: 'ratelimit:api',
  }),

  // Payment operations - 20 per minute
  payment: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(20, '1 m'),
    analytics: true,
    prefix: 'ratelimit:payment',
  }),
}

// Cache helper functions
export const cache = {
  // Set value with expiration
  async set<T>(key: string, value: T, expirationSeconds?: number): Promise<void> {
    if (expirationSeconds) {
      await redis.setex(key, expirationSeconds, JSON.stringify(value))
    } else {
      await redis.set(key, JSON.stringify(value))
    }
  },

  // Get value
  async get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key)
    if (value === null) return null
    return typeof value === 'string' ? JSON.parse(value) : value as T
  },

  // Delete value
  async delete(key: string): Promise<void> {
    await redis.del(key)
  },

  // Check if key exists
  async exists(key: string): Promise<boolean> {
    const result = await redis.exists(key)
    return result === 1
  },

  // Set hash field
  async hset(key: string, field: string, value: unknown): Promise<void> {
    await redis.hset(key, { [field]: JSON.stringify(value) })
  },

  // Get hash field
  async hget<T>(key: string, field: string): Promise<T | null> {
    const value = await redis.hget(key, field)
    if (value === null) return null
    return typeof value === 'string' ? JSON.parse(value) : value as T
  },

  // Increment counter
  async incr(key: string): Promise<number> {
    return await redis.incr(key)
  },

  // Add to set
  async sadd(key: string, ...members: string[]): Promise<void> {
    await redis.sadd(key, ...members)
  },

  // Get set members
  async smembers(key: string): Promise<string[]> {
    return await redis.smembers(key)
  },
}

// Session management
export const sessions = {
  async create(userId: string, sessionData: Record<string, unknown>): Promise<string> {
    const sessionId = crypto.randomUUID()
    const key = `session:${sessionId}`
    await cache.set(key, { userId, ...sessionData }, 60 * 60 * 24 * 7) // 7 days
    await redis.sadd(`user:${userId}:sessions`, sessionId)
    return sessionId
  },

  async get(sessionId: string): Promise<Record<string, unknown> | null> {
    return await cache.get(`session:${sessionId}`)
  },

  async destroy(sessionId: string, userId: string): Promise<void> {
    await cache.delete(`session:${sessionId}`)
    await redis.srem(`user:${userId}:sessions`, sessionId)
  },

  async destroyAllForUser(userId: string): Promise<void> {
    const sessions = await redis.smembers(`user:${userId}:sessions`)
    for (const sessionId of sessions) {
      await cache.delete(`session:${sessionId}`)
    }
    await cache.delete(`user:${userId}:sessions`)
  },
}

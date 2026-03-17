import type { Env } from './types'

const MAX_REQUESTS_PER_HOUR = 30
const TTL_SECONDS = 3600

export async function checkRateLimit(request: Request, env: Env): Promise<boolean> {
  // Skip rate limiting if KV is not available (local dev without --kv flag)
  if (!env.RATE_LIMIT) {
    return true
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  const key = `rate:${ip}`

  try {
    const current = await env.RATE_LIMIT.get(key)
    const count = current ? parseInt(current, 10) : 0

    if (count >= MAX_REQUESTS_PER_HOUR) {
      return false
    }

    await env.RATE_LIMIT.put(key, String(count + 1), {
      expirationTtl: TTL_SECONDS,
    })

    return true
  } catch {
    // If KV fails, allow the request rather than blocking the user
    return true
  }
}

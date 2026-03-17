import type { Env } from './types'
import { validateOrigin, handlePreflight } from './cors'
import { checkRateLimit } from './rateLimit'
import { clipUrl, jsonResponse } from './clipper'
import { errors } from './errors'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    // Health check - public endpoint, no CORS required
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    const origin = validateOrigin(request, env)

    // Block requests from non-allowed origins
    if (!origin) {
      const requestOrigin = request.headers.get('Origin') || 'unknown'
      const forbiddenError = errors.forbiddenOrigin(requestOrigin, request.url)
      return new Response(JSON.stringify(forbiddenError), {
        status: forbiddenError.status,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(origin)
    }

    // Route: POST /clip
    if (url.pathname === '/clip' && request.method === 'POST') {
      // Check rate limit
      const allowed = await checkRateLimit(request, env)
      if (!allowed) {
        return jsonResponse(errors.rateLimitExceeded(request.url), 429, origin)
      }

      return clipUrl(request, origin)
    }

    return jsonResponse(errors.notFound(undefined, request.url), 404, origin)
  },
}

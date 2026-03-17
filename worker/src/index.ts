import type { Env } from './types'
import { validateOrigin, handlePreflight } from './cors'
import { checkRateLimit } from './rateLimit'
import { clipUrl, jsonResponse } from './clipper'

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = validateOrigin(request, env)

    // Block requests from non-allowed origins
    if (!origin) {
      return new Response('Forbidden', { status: 403 })
    }

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return handlePreflight(origin)
    }

    // Route: POST /clip
    const url = new URL(request.url)

    if (url.pathname === '/clip' && request.method === 'POST') {
      // Check rate limit
      const allowed = await checkRateLimit(request, env)
      if (!allowed) {
        return jsonResponse(
          { error: 'Rate limit exceeded. Maximum 30 requests per hour.' },
          429,
          origin,
        )
      }

      return clipUrl(request, origin)
    }

    // Health check
    if (url.pathname === '/health' && request.method === 'GET') {
      return new Response(JSON.stringify({ status: 'ok' }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      })
    }

    return jsonResponse({ error: 'Not Found' }, 404, origin)
  },
}

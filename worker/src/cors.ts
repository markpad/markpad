import type { Env } from './types'

const ALLOWED_ORIGINS = ['https://markpad.cc', 'https://www.markpad.cc']

const DEV_ORIGINS = ['http://localhost:3000', 'http://localhost:5173']

export function getAllowedOrigins(env: Env): string[] {
  return env.ENVIRONMENT === 'development' ? [...ALLOWED_ORIGINS, ...DEV_ORIGINS] : ALLOWED_ORIGINS
}

export function validateOrigin(request: Request, env: Env): string | null {
  const origin = request.headers.get('Origin') || ''
  const allowed = getAllowedOrigins(env)

  if (allowed.includes(origin)) {
    return origin
  }

  // In dev mode, allow requests without Origin header (curl, Postman, etc.)
  if (env.ENVIRONMENT === 'development' && !origin) {
    return DEV_ORIGINS[0]
  }

  return null
}

export function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

export function handlePreflight(origin: string): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(origin),
  })
}

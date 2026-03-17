import { describe, it, expect } from 'vitest'
import { validateOrigin, getAllowedOrigins, handlePreflight, corsHeaders } from './cors'
import type { Env } from './types'

function createRequest(origin: string): Request {
  return new Request('https://markpad-worker.workers.dev/clip', {
    headers: { Origin: origin },
  })
}

function createEnv(environment: string): Env {
  return {
    ENVIRONMENT: environment,
    RATE_LIMIT: {} as KVNamespace,
  }
}

describe('CORS', () => {
  describe('getAllowedOrigins', () => {
    it('should return production origins only in production', () => {
      const origins = getAllowedOrigins(createEnv('production'))
      expect(origins).toContain('https://markpad.cc')
      expect(origins).toContain('https://www.markpad.cc')
      expect(origins).not.toContain('http://localhost:3000')
      expect(origins).not.toContain('http://localhost:5173')
    })

    it('should include dev origins in development', () => {
      const origins = getAllowedOrigins(createEnv('development'))
      expect(origins).toContain('https://markpad.cc')
      expect(origins).toContain('https://www.markpad.cc')
      expect(origins).toContain('http://localhost:3000')
      expect(origins).toContain('http://localhost:5173')
    })
  })

  describe('validateOrigin', () => {
    it('should return origin for markpad.cc', () => {
      const result = validateOrigin(createRequest('https://markpad.cc'), createEnv('production'))
      expect(result).toBe('https://markpad.cc')
    })

    it('should return origin for www.markpad.cc', () => {
      const result = validateOrigin(
        createRequest('https://www.markpad.cc'),
        createEnv('production')
      )
      expect(result).toBe('https://www.markpad.cc')
    })

    it('should return null for unauthorized origins in production', () => {
      const result = validateOrigin(createRequest('https://evil.com'), createEnv('production'))
      expect(result).toBeNull()
    })

    it('should return null for localhost in production', () => {
      const result = validateOrigin(createRequest('http://localhost:3000'), createEnv('production'))
      expect(result).toBeNull()
    })

    it('should allow localhost in development', () => {
      const result = validateOrigin(
        createRequest('http://localhost:3000'),
        createEnv('development')
      )
      expect(result).toBe('http://localhost:3000')
    })

    it('should allow localhost:5173 in development', () => {
      const result = validateOrigin(
        createRequest('http://localhost:5173'),
        createEnv('development')
      )
      expect(result).toBe('http://localhost:5173')
    })

    it('should return null for empty origin', () => {
      const request = new Request('https://markpad-worker.workers.dev/clip')
      const result = validateOrigin(request, createEnv('production'))
      expect(result).toBeNull()
    })

    it('should allow empty origin in development (curl/Postman)', () => {
      const request = new Request('https://markpad-worker.workers.dev/clip')
      const result = validateOrigin(request, createEnv('development'))
      expect(result).toBe('http://localhost:3000')
    })
  })

  describe('corsHeaders', () => {
    it('should return correct CORS headers', () => {
      const headers = corsHeaders('https://markpad.cc')
      expect(headers['Access-Control-Allow-Origin']).toBe('https://markpad.cc')
      expect(headers['Access-Control-Allow-Methods']).toBe('POST, GET, OPTIONS')
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type')
      expect(headers['Access-Control-Max-Age']).toBe('86400')
    })
  })

  describe('handlePreflight', () => {
    it('should return 204 with CORS headers', () => {
      const response = handlePreflight('https://markpad.cc')
      expect(response.status).toBe(204)
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://markpad.cc')
      expect(response.headers.get('Access-Control-Allow-Methods')).toBe('POST, GET, OPTIONS')
    })
  })
})

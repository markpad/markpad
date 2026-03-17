import { describe, it, expect, vi } from 'vitest'
import { isValidUrl, jsonResponse } from './clipper'
import { errors, type ProblemDetail } from './errors'

describe('Clipper', () => {
  describe('isValidUrl', () => {
    it('should accept http URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true)
    })

    it('should accept https URLs', () => {
      expect(isValidUrl('https://example.com/article')).toBe(true)
    })

    it('should accept URLs with paths and query params', () => {
      expect(isValidUrl('https://example.com/path/to/article?id=123&lang=en')).toBe(true)
    })

    it('should accept URLs with fragments', () => {
      expect(isValidUrl('https://example.com/article#section')).toBe(true)
    })

    it('should accept URLs with ports', () => {
      expect(isValidUrl('http://localhost:8080/page')).toBe(true)
    })

    it('should reject ftp protocol', () => {
      expect(isValidUrl('ftp://example.com/file')).toBe(false)
    })

    it('should reject javascript protocol', () => {
      expect(isValidUrl('javascript:alert(1)')).toBe(false)
    })

    it('should reject data URLs', () => {
      expect(isValidUrl('data:text/html,<h1>Hi</h1>')).toBe(false)
    })

    it('should reject file protocol', () => {
      expect(isValidUrl('file:///etc/passwd')).toBe(false)
    })

    it('should reject empty string', () => {
      expect(isValidUrl('')).toBe(false)
    })

    it('should reject malformed URLs', () => {
      expect(isValidUrl('not a url')).toBe(false)
    })

    it('should reject URLs without protocol', () => {
      expect(isValidUrl('example.com')).toBe(false)
    })
  })

  describe('jsonResponse', () => {
    it('should return JSON with correct status for ProblemDetail', async () => {
      const error = errors.invalidUrl(undefined, 'http://localhost:8787/clip')
      const response = jsonResponse(error, 400, 'https://markpad.cc')

      expect(response.status).toBe(400)
      expect(response.headers.get('Content-Type')).toBe('application/json')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('https://markpad.cc')

      const body = (await response.json()) as ProblemDetail
      expect(body.type).toBe('https://markpad.cc/errors/INVALID_URL')
      expect(body.title).toBe('Invalid URL')
      expect(body.code).toBe('INVALID_URL')
      expect(body.status).toBe(400)
      expect(body.instance).toBe('http://localhost:8787/clip')
    })

    it('should return 200 by default with ClipResponse', async () => {
      const data = {
        markdown: '# Hello',
        metadata: {
          title: 'Hello',
          author: null,
          excerpt: null,
          siteName: null,
          source: 'https://example.com',
          clippedAt: '2026-03-17T00:00:00Z',
        },
      }

      const response = jsonResponse(data, 200, 'https://markpad.cc')
      expect(response.status).toBe(200)

      const body = await response.json()
      expect(body.markdown).toBe('# Hello')
      expect(body.metadata.title).toBe('Hello')
    })

    it('should set the correct CORS origin', async () => {
      const error = errors.notFound(undefined, 'http://localhost:8787/unknown')
      const response = jsonResponse(error, 404, 'http://localhost:3000')
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3000')
    })
  })
})

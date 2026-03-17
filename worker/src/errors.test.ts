import { describe, it, expect } from 'vitest'
import { errors, ErrorCode, createError } from './errors'

describe('Errors', () => {
  describe('createError', () => {
    it('should create error with all fields', () => {
      const error = createError(
        ErrorCode.INVALID_URL,
        400,
        'Invalid URL',
        'Custom detail message',
        'http://localhost:8787/clip'
      )

      expect(error.type).toBe('https://markpad.cc/errors/INVALID_URL')
      expect(error.title).toBe('Invalid URL')
      expect(error.status).toBe(400)
      expect(error.detail).toBe('Custom detail message')
      expect(error.instance).toBe('http://localhost:8787/clip')
      expect(error.code).toBe(ErrorCode.INVALID_URL)
      expect(error.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    })

    it('should create error without optional fields', () => {
      const error = createError(ErrorCode.INTERNAL_ERROR, 500, 'Internal Error')

      expect(error.type).toBe('https://markpad.cc/errors/INTERNAL_ERROR')
      expect(error.title).toBe('Internal Error')
      expect(error.status).toBe(500)
      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR)
      expect(error.detail).toBeUndefined()
      expect(error.instance).toBeUndefined()
    })
  })

  describe('errors.invalidUrl', () => {
    it('should create INVALID_URL error with default detail', () => {
      const error = errors.invalidUrl(undefined, 'http://localhost:8787/clip')

      expect(error.code).toBe(ErrorCode.INVALID_URL)
      expect(error.status).toBe(400)
      expect(error.title).toBe('Invalid URL')
      expect(error.detail).toBe(
        'The provided URL is not valid. Must be a valid http:// or https:// URL.'
      )
      expect(error.instance).toBe('http://localhost:8787/clip')
    })

    it('should create INVALID_URL error with custom detail', () => {
      const error = errors.invalidUrl('Custom message')

      expect(error.detail).toBe('Custom message')
    })
  })

  describe('errors.missingUrl', () => {
    it('should create MISSING_URL error', () => {
      const error = errors.missingUrl('http://localhost:8787/clip')

      expect(error.code).toBe(ErrorCode.MISSING_URL)
      expect(error.status).toBe(400)
      expect(error.title).toBe('Missing URL')
      expect(error.detail).toBe('Request body must include a "url" field.')
    })
  })

  describe('errors.invalidJson', () => {
    it('should create INVALID_JSON error', () => {
      const error = errors.invalidJson('Unexpected token')

      expect(error.code).toBe(ErrorCode.INVALID_JSON)
      expect(error.status).toBe(400)
      expect(error.title).toBe('Invalid JSON')
      expect(error.detail).toBe('Unexpected token')
    })
  })

  describe('errors.forbiddenOrigin', () => {
    it('should create FORBIDDEN_ORIGIN error', () => {
      const error = errors.forbiddenOrigin('https://evil.com', 'http://localhost:8787/clip')

      expect(error.code).toBe(ErrorCode.FORBIDDEN_ORIGIN)
      expect(error.status).toBe(403)
      expect(error.title).toBe('Forbidden Origin')
      expect(error.detail).toBe('Origin "https://evil.com" is not allowed to access this API.')
    })
  })

  describe('errors.rateLimitExceeded', () => {
    it('should create RATE_LIMIT_EXCEEDED error', () => {
      const error = errors.rateLimitExceeded('http://localhost:8787/clip')

      expect(error.code).toBe(ErrorCode.RATE_LIMIT_EXCEEDED)
      expect(error.status).toBe(429)
      expect(error.title).toBe('Rate Limit Exceeded')
      expect(error.detail).toBe('Maximum 30 requests per hour. Please try again later.')
    })
  })

  describe('errors.unsupportedContentType', () => {
    it('should create UNSUPPORTED_CONTENT_TYPE error', () => {
      const error = errors.unsupportedContentType('application/pdf')

      expect(error.code).toBe(ErrorCode.UNSUPPORTED_CONTENT_TYPE)
      expect(error.status).toBe(422)
      expect(error.title).toBe('Unsupported Content Type')
      expect(error.detail).toBe(
        'URL returned content type "application/pdf". Only HTML pages (text/html) are supported.'
      )
    })
  })

  describe('errors.extractionFailed', () => {
    it('should create EXTRACTION_FAILED error with default detail', () => {
      const error = errors.extractionFailed()

      expect(error.code).toBe(ErrorCode.EXTRACTION_FAILED)
      expect(error.status).toBe(422)
      expect(error.title).toBe('Content Extraction Failed')
      expect(error.detail).toBe(
        'Could not extract readable content from the page. It may be empty, behind a paywall, or require JavaScript.'
      )
    })

    it('should create EXTRACTION_FAILED error with custom detail', () => {
      const error = errors.extractionFailed('No article tag found')

      expect(error.detail).toBe('No article tag found')
    })
  })

  describe('errors.fetchFailed', () => {
    it('should create FETCH_FAILED error with status code', () => {
      const error = errors.fetchFailed(404, undefined, 'http://localhost:8787/clip')

      expect(error.code).toBe(ErrorCode.FETCH_FAILED)
      expect(error.status).toBe(502)
      expect(error.title).toBe('Failed to Fetch URL')
      expect(error.detail).toBe('The target server returned HTTP 404.')
    })

    it('should create FETCH_FAILED error with custom detail', () => {
      const error = errors.fetchFailed(500, 'Connection timeout')

      expect(error.detail).toBe('Connection timeout')
    })
  })

  describe('errors.parseError', () => {
    it('should create PARSE_ERROR error', () => {
      const error = errors.parseError('Invalid HTML structure')

      expect(error.code).toBe(ErrorCode.PARSE_ERROR)
      expect(error.status).toBe(500)
      expect(error.title).toBe('Parse Error')
      expect(error.detail).toBe('Invalid HTML structure')
    })
  })

  describe('errors.internalError', () => {
    it('should create INTERNAL_ERROR error', () => {
      const error = errors.internalError('Unexpected exception')

      expect(error.code).toBe(ErrorCode.INTERNAL_ERROR)
      expect(error.status).toBe(500)
      expect(error.title).toBe('Internal Server Error')
      expect(error.detail).toBe('Unexpected exception')
    })
  })

  describe('errors.notFound', () => {
    it('should create NOT_FOUND error', () => {
      const error = errors.notFound(undefined, 'http://localhost:8787/unknown')

      expect(error.code).toBe(ErrorCode.NOT_FOUND)
      expect(error.status).toBe(404)
      expect(error.title).toBe('Not Found')
      expect(error.detail).toBe('The requested endpoint does not exist.')
      expect(error.instance).toBe('http://localhost:8787/unknown')
    })
  })

  describe('Error codes enum', () => {
    it('should have all expected error codes', () => {
      expect(ErrorCode.INVALID_URL).toBe('INVALID_URL')
      expect(ErrorCode.MISSING_URL).toBe('MISSING_URL')
      expect(ErrorCode.INVALID_JSON).toBe('INVALID_JSON')
      expect(ErrorCode.FORBIDDEN_ORIGIN).toBe('FORBIDDEN_ORIGIN')
      expect(ErrorCode.RATE_LIMIT_EXCEEDED).toBe('RATE_LIMIT_EXCEEDED')
      expect(ErrorCode.UNSUPPORTED_CONTENT_TYPE).toBe('UNSUPPORTED_CONTENT_TYPE')
      expect(ErrorCode.EXTRACTION_FAILED).toBe('EXTRACTION_FAILED')
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND')
      expect(ErrorCode.FETCH_FAILED).toBe('FETCH_FAILED')
      expect(ErrorCode.PARSE_ERROR).toBe('PARSE_ERROR')
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
    })
  })
})

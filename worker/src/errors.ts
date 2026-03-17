export enum ErrorCode {
  // Client errors (4xx)
  INVALID_URL = 'INVALID_URL',
  MISSING_URL = 'MISSING_URL',
  INVALID_JSON = 'INVALID_JSON',
  FORBIDDEN_ORIGIN = 'FORBIDDEN_ORIGIN',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNSUPPORTED_CONTENT_TYPE = 'UNSUPPORTED_CONTENT_TYPE',
  EXTRACTION_FAILED = 'EXTRACTION_FAILED',
  NOT_FOUND = 'NOT_FOUND',

  // Server/External errors (5xx)
  FETCH_FAILED = 'FETCH_FAILED',
  PARSE_ERROR = 'PARSE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

export interface ProblemDetail {
  type: string // URI reference que identifica o tipo de problema
  title: string // Resumo legível
  status: number // HTTP status code
  detail?: string // Explicação específica
  instance?: string // URI da request que causou o erro
  code: ErrorCode // Código customizado do Markpad
  timestamp: string // ISO 8601
}

export function createError(
  code: ErrorCode,
  status: number,
  title: string,
  detail?: string,
  instance?: string
): ProblemDetail {
  return {
    type: `https://markpad.cc/errors/${code}`,
    title,
    status,
    detail,
    instance,
    code,
    timestamp: new Date().toISOString(),
  }
}

// Helpers para erros comuns
export const errors = {
  invalidUrl: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.INVALID_URL,
      400,
      'Invalid URL',
      detail || 'The provided URL is not valid. Must be a valid http:// or https:// URL.',
      instance
    ),

  missingUrl: (instance?: string) =>
    createError(
      ErrorCode.MISSING_URL,
      400,
      'Missing URL',
      'Request body must include a "url" field.',
      instance
    ),

  invalidJson: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.INVALID_JSON,
      400,
      'Invalid JSON',
      detail || 'Request body must be valid JSON.',
      instance
    ),

  forbiddenOrigin: (origin: string, instance?: string) =>
    createError(
      ErrorCode.FORBIDDEN_ORIGIN,
      403,
      'Forbidden Origin',
      `Origin "${origin}" is not allowed to access this API.`,
      instance
    ),

  rateLimitExceeded: (instance?: string) =>
    createError(
      ErrorCode.RATE_LIMIT_EXCEEDED,
      429,
      'Rate Limit Exceeded',
      'Maximum 30 requests per hour. Please try again later.',
      instance
    ),

  unsupportedContentType: (contentType: string, instance?: string) =>
    createError(
      ErrorCode.UNSUPPORTED_CONTENT_TYPE,
      422,
      'Unsupported Content Type',
      `URL returned content type "${contentType}". Only HTML pages (text/html) are supported.`,
      instance
    ),

  extractionFailed: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.EXTRACTION_FAILED,
      422,
      'Content Extraction Failed',
      detail ||
        'Could not extract readable content from the page. It may be empty, behind a paywall, or require JavaScript.',
      instance
    ),

  fetchFailed: (statusCode: number, detail?: string, instance?: string) =>
    createError(
      ErrorCode.FETCH_FAILED,
      502,
      'Failed to Fetch URL',
      detail || `The target server returned HTTP ${statusCode}.`,
      instance
    ),

  parseError: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.PARSE_ERROR,
      500,
      'Parse Error',
      detail || 'Failed to parse the HTML content.',
      instance
    ),

  internalError: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.INTERNAL_ERROR,
      500,
      'Internal Server Error',
      detail || 'An unexpected error occurred.',
      instance
    ),

  notFound: (detail?: string, instance?: string) =>
    createError(
      ErrorCode.NOT_FOUND,
      404,
      'Not Found',
      detail || 'The requested endpoint does not exist.',
      instance
    ),
}

export interface Env {
  ENVIRONMENT: string
  RATE_LIMIT: KVNamespace
}

export interface ClipRequest {
  url: string
}

export interface ClipMetadata {
  title: string
  author: string | null
  excerpt: string | null
  siteName: string | null
  source: string
  clippedAt: string
}

export interface ClipResponse {
  markdown: string
  metadata: ClipMetadata
}

// Deprecated: Use ProblemDetail from errors.ts instead
export interface ClipErrorResponse {
  error: string
}

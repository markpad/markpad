import { describe, it, expect, vi, beforeEach } from 'vitest'
import { checkRateLimit } from './rateLimit'
import type { Env } from './types'

function createRequest(ip: string): Request {
  return new Request('https://markpad-worker.workers.dev/clip', {
    method: 'POST',
    headers: {
      'CF-Connecting-IP': ip,
      'Content-Type': 'application/json',
    },
  })
}

function createMockKV(): KVNamespace {
  const store = new Map<string, string>()

  return {
    get: vi.fn(async (key: string) => store.get(key) || null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value)
    }),
    delete: vi.fn(),
    list: vi.fn(),
    getWithMetadata: vi.fn(),
  } as unknown as KVNamespace
}

describe('Rate Limiting', () => {
  let env: Env
  let mockKV: KVNamespace

  beforeEach(() => {
    mockKV = createMockKV()
    env = {
      ENVIRONMENT: 'production',
      RATE_LIMIT: mockKV,
    }
  })

  it('should allow a request when under the limit', async () => {
    const result = await checkRateLimit(createRequest('1.2.3.4'), env)
    expect(result).toBe(true)
    expect(mockKV.put).toHaveBeenCalledWith('rate:1.2.3.4', '1', { expirationTtl: 3600 })
  })

  it('should allow request when KV is not available (local dev)', async () => {
    const envNoKV = { ENVIRONMENT: 'development', RATE_LIMIT: undefined as unknown as KVNamespace }
    const result = await checkRateLimit(createRequest('1.2.3.4'), envNoKV)
    expect(result).toBe(true)
  })

  it('should allow request when KV throws an error', async () => {
    const brokenKV = {
      get: vi.fn().mockRejectedValue(new Error('KV unavailable')),
      put: vi.fn(),
    } as unknown as KVNamespace
    const envBrokenKV = { ENVIRONMENT: 'production', RATE_LIMIT: brokenKV }
    const result = await checkRateLimit(createRequest('1.2.3.4'), envBrokenKV)
    expect(result).toBe(true)
  })

  it('should increment the counter for subsequent requests', async () => {
    await checkRateLimit(createRequest('1.2.3.4'), env)
    await checkRateLimit(createRequest('1.2.3.4'), env)

    expect(mockKV.put).toHaveBeenLastCalledWith('rate:1.2.3.4', '2', { expirationTtl: 3600 })
  })

  it('should block requests when the limit is reached', async () => {
    // Simulate 30 previous requests
    const kvStore = new Map<string, string>([['rate:1.2.3.4', '30']])
    ;(mockKV.get as ReturnType<typeof vi.fn>).mockImplementation(
      async (key: string) => kvStore.get(key) || null
    )

    const result = await checkRateLimit(createRequest('1.2.3.4'), env)
    expect(result).toBe(false)
    expect(mockKV.put).not.toHaveBeenCalled()
  })

  it('should track different IPs separately', async () => {
    await checkRateLimit(createRequest('1.2.3.4'), env)
    await checkRateLimit(createRequest('5.6.7.8'), env)

    expect(mockKV.put).toHaveBeenCalledWith('rate:1.2.3.4', '1', { expirationTtl: 3600 })
    expect(mockKV.put).toHaveBeenCalledWith('rate:5.6.7.8', '1', { expirationTtl: 3600 })
  })

  it('should use "unknown" when CF-Connecting-IP is missing', async () => {
    const request = new Request('https://markpad-worker.workers.dev/clip', {
      method: 'POST',
    })

    await checkRateLimit(request, env)
    expect(mockKV.get).toHaveBeenCalledWith('rate:unknown')
  })
})

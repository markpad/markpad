import pako from 'pako'
import type { AppState, TailwindClasses, BehaviorConfig } from '../types'

/**
 * Service for encoding/decoding application state to/from URL using pako compression
 * Follows Single Responsibility Principle - handles only URL state serialization
 */

const BASE64_URL_SAFE_CHARS: Record<string, string> = {
  '+': '-',
  '/': '_',
  '=': '',
}

const BASE64_URL_UNSAFE_CHARS: Record<string, string> = {
  '-': '+',
  _: '/',
}

/**
 * Converts standard base64 to URL-safe base64
 */
function toUrlSafeBase64(base64: string): string {
  return base64.replace(/[+/=]/g, (char) => BASE64_URL_SAFE_CHARS[char] ?? char)
}

/**
 * Converts URL-safe base64 back to standard base64
 */
function fromUrlSafeBase64(urlSafe: string): string {
  let base64 = urlSafe.replace(/[-_]/g, (char) => BASE64_URL_UNSAFE_CHARS[char] ?? char)
  // Add padding if needed
  while (base64.length % 4 !== 0) {
    base64 += '='
  }
  return base64
}

/**
 * Compresses and encodes state to a URL-safe string
 */
export function encodeState(state: AppState): string {
  try {
    const jsonString = JSON.stringify(state)
    const compressed = pako.deflate(new TextEncoder().encode(jsonString))
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    return toUrlSafeBase64(base64)
  } catch (error) {
    console.error('Failed to encode state:', error)
    return ''
  }
}

/**
 * Decodes and decompresses URL string back to state
 */
export function decodeState(encoded: string): AppState | null {
  try {
    if (encoded === '') return null
    const base64 = fromUrlSafeBase64(encoded)
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    const decompressed = pako.inflate(bytes)
    const jsonString = new TextDecoder().decode(decompressed)
    return JSON.parse(jsonString) as AppState
  } catch (error) {
    console.error('Failed to decode state:', error)
    return null
  }
}

/**
 * Updates the URL with encoded state without page reload
 * Uses hash/anchor instead of query string to support longer content
 */
export function updateUrlWithState(state: AppState): void {
  const encoded = encodeState(state)
  if (encoded !== '') {
    const url = new URL(window.location.href)
    url.searchParams.delete('s') // Remove old query string if exists
    url.hash = encoded
    window.history.replaceState({}, '', url.toString())
  }
}

/**
 * Reads state from current URL (supports both hash and query string for backwards compatibility)
 */
export function getStateFromUrl(): AppState | null {
  const url = new URL(window.location.href)

  // First try hash (new format)
  if (url.hash && url.hash.length > 1) {
    const encoded = url.hash.slice(1) // Remove the # prefix
    const decoded = decodeState(encoded)
    if (decoded) return decoded
  }

  // Fallback to query string (old format for backwards compatibility)
  const queryEncoded = url.searchParams.get('s')
  if (queryEncoded !== null && queryEncoded !== '') {
    return decodeState(queryEncoded)
  }

  return null
}

/**
 * Generates a shareable URL with current state
 */
export function generateShareableUrl(state: AppState): string {
  const encoded = encodeState(state)
  const url = new URL(window.location.origin + window.location.pathname)
  url.hash = encoded
  return url.toString()
}

/**
 * Default tailwind classes configuration
 */
export const defaultTailwindClasses: TailwindClasses = {
  h1: 'text-3xl font-bold mb-4 text-gray-800',
  h2: 'text-2xl font-bold mb-4 text-gray-800',
  h3: 'text-xl font-bold mb-4 text-gray-800',
  h4: 'text-lg font-bold mb-4 text-gray-800',
  h5: 'text-base font-bold mb-4 text-gray-800',
  h6: 'text-sm font-bold mb-4 text-gray-800',
  p: 'mb-2 text-base text-gray-800',
  a: 'text-blue-500 hover:text-blue-700 hover:underline',
  img: 'max-w-full my-4',
  table: 'table-auto my-4',
  strong: 'font-bold',
  ul: 'list-disc list-inside',
  ol: 'list-decimal list-inside',
  li: 'mb-1',
  em: 'italic',
  tr: 'border border-gray-200 even:bg-gray-50 odd:bg-white',
  td: 'border border-gray-200 p-1',
  th: 'border border-gray-200 p-1',
  blockquote: 'border-l-4 border-gray-300 pl-4 italic my-4',
  code: 'bg-gray-100 px-1 rounded font-mono text-sm',
  pre: 'bg-gray-100 p-4 rounded overflow-x-auto',
  body: 'bg-white p-4',
  article: 'prose prose-slate max-w-none',
}

/**
 * Default behavior configuration
 */
export const defaultBehaviorConfig: BehaviorConfig = {
  shouldOpenLinksInNewTab: true,
  shouldShowLineNumbers: true,
}

/**
 * Default font configuration
 */
export const defaultFontConfig = {
  fontFamily: 'Inter',
}

/**
 * Default document title
 */
export const defaultDocumentTitle = 'Untitled Document'

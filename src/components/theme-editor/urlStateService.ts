import pako from 'pako'
import type { ThemeElement, ElementConfig } from './types'

/**
 * Theme Editor state that gets persisted to URL
 */
export interface ThemeEditorUrlState {
  themeName: string
  selectedElement: ThemeElement
  configs: Record<ThemeElement, ElementConfig>
  darkMode: boolean
}

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
export function encodeThemeEditorState(state: ThemeEditorUrlState): string {
  try {
    const jsonString = JSON.stringify(state)
    const compressed = pako.deflate(new TextEncoder().encode(jsonString))
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    return toUrlSafeBase64(base64)
  } catch (error) {
    console.error('Failed to encode theme editor state:', error)
    return ''
  }
}

/**
 * Decodes and decompresses URL string back to state
 */
export function decodeThemeEditorState(encoded: string): ThemeEditorUrlState | null {
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
    return JSON.parse(jsonString) as ThemeEditorUrlState
  } catch (error) {
    console.error('Failed to decode theme editor state:', error)
    return null
  }
}

/**
 * Updates the URL with encoded state without page reload
 */
export function updateThemeEditorUrl(state: ThemeEditorUrlState): void {
  const encoded = encodeThemeEditorState(state)
  if (encoded !== '') {
    const url = new URL(window.location.href)
    url.hash = encoded
    window.history.replaceState({}, '', url.toString())
  }
}

/**
 * Reads state from current URL hash
 */
export function getThemeEditorStateFromUrl(): ThemeEditorUrlState | null {
  const url = new URL(window.location.href)

  if (url.hash && url.hash.length > 1) {
    const encoded = url.hash.slice(1) // Remove the # prefix
    const decoded = decodeThemeEditorState(encoded)
    if (decoded) return decoded
  }

  return null
}

/**
 * Dark mode localStorage key
 */
const DARK_MODE_KEY = 'taildown-dark-mode'

/**
 * Gets dark mode preference from localStorage
 */
export function getDarkModeFromStorage(): boolean {
  try {
    const stored = localStorage.getItem(DARK_MODE_KEY)
    return stored === 'true'
  } catch {
    return false
  }
}

/**
 * Saves dark mode preference to localStorage
 */
export function saveDarkModeToStorage(darkMode: boolean): void {
  try {
    localStorage.setItem(DARK_MODE_KEY, String(darkMode))
  } catch {
    // Ignore storage errors
  }
}

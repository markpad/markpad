import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const STORAGE_KEY = 'markpad-scroll-positions'
const SCROLL_CONTAINER_ATTR = 'data-scroll-restoration-id'
const RESTORE_RETRY_INTERVAL_MS = 80
const RESTORE_RETRY_MAX_ATTEMPTS = 25

interface SavedScrollState {
  windowY: number
  containers: Record<string, number>
}

type ScrollStorage = Record<string, SavedScrollState>

function readScrollStorage(): ScrollStorage {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw === null) return {}
    const parsed = JSON.parse(raw) as unknown
    if (parsed === null || typeof parsed !== 'object') return {}
    return parsed as ScrollStorage
  } catch {
    return {}
  }
}

function getScrollContainers(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(`[${SCROLL_CONTAINER_ATTR}]`))
}

function getContainerId(container: HTMLElement): string | null {
  const id = container.getAttribute(SCROLL_CONTAINER_ATTR)
  return typeof id === 'string' && id.length > 0 ? id : null
}

function collectContainerPositions(): Record<string, number> {
  const positions: Record<string, number> = {}
  for (const container of getScrollContainers()) {
    const id = getContainerId(container)
    if (id !== null) {
      positions[id] = container.scrollTop
    }
  }
  return positions
}

function restoreContainerPositions(positions: Record<string, number> | undefined): void {
  if (positions === undefined) return
  for (const container of getScrollContainers()) {
    const id = getContainerId(container)
    if (id !== null && typeof positions[id] === 'number') {
      container.scrollTop = positions[id]
    }
  }
}

function resetContainerPositions(): void {
  for (const container of getScrollContainers()) {
    container.scrollTop = 0
  }
}

function areContainerPositionsRestored(targets: Record<string, number>): boolean {
  const containersById = new Map<string, HTMLElement>()
  for (const container of getScrollContainers()) {
    const id = getContainerId(container)
    if (id !== null) {
      containersById.set(id, container)
    }
  }

  for (const [id, target] of Object.entries(targets)) {
    const container = containersById.get(id)
    if (!container) return false
    if (Math.abs(container.scrollTop - target) > 1) return false
  }

  return true
}

function writeScrollState(locationKey: string, state: SavedScrollState): void {
  try {
    const storage = readScrollStorage()
    storage[locationKey] = state
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(storage))
  } catch {
    // Ignore storage failures (private mode, quota, etc.)
  }
}

function readScrollState(locationKey: string): SavedScrollState | undefined {
  const storage = readScrollStorage()
  const state = storage[locationKey]
  if (state === undefined || state === null || typeof state !== 'object') return undefined
  const windowY = typeof state.windowY === 'number' ? state.windowY : 0
  const containers =
    state.containers !== null && typeof state.containers === 'object'
      ? (state.containers as Record<string, number>)
      : {}
  return { windowY, containers }
}

/**
 * Restores scroll position when navigating browser history (back/forward).
 * For new navigations, resets the page to top.
 */
export function ScrollRestorationManager() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    return () => {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto'
      }
    }
  }, [])

  useLayoutEffect(() => {
    const saveState = () => {
      writeScrollState(location.key, {
        windowY: window.scrollY,
        containers: collectContainerPositions(),
      })
    }

    window.addEventListener('scroll', saveState, { passive: true })
    for (const container of getScrollContainers()) {
      container.addEventListener('scroll', saveState, { passive: true })
    }

    return () => {
      saveState()
      window.removeEventListener('scroll', saveState)
      for (const container of getScrollContainers()) {
        container.removeEventListener('scroll', saveState)
      }
    }
  }, [location.key])

  useEffect(() => {
    const savedState = readScrollState(location.key)
    const shouldRestore = navigationType === 'POP' && savedState !== undefined

    let retryAttempts = 0
    let retryTimeoutId: number | undefined

    const applyRestore = () => {
      if (shouldRestore) {
        window.scrollTo(0, savedState.windowY)
        restoreContainerPositions(savedState.containers)
      } else {
        window.scrollTo(0, 0)
        resetContainerPositions()
      }

      if (!shouldRestore) return

      const windowRestored = Math.abs(window.scrollY - savedState.windowY) <= 1
      const containersRestored = areContainerPositionsRestored(savedState.containers)

      if (windowRestored && containersRestored) return
      if (retryAttempts >= RESTORE_RETRY_MAX_ATTEMPTS) return

      retryAttempts += 1
      retryTimeoutId = window.setTimeout(applyRestore, RESTORE_RETRY_INTERVAL_MS)
    }

    requestAnimationFrame(applyRestore)

    return () => {
      if (retryTimeoutId !== undefined) {
        window.clearTimeout(retryTimeoutId)
      }
    }
  }, [location.key, navigationType])

  return null
}

export default ScrollRestorationManager

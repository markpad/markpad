import { renderHook, act } from '@testing-library/react'
import type { RefObject } from 'react'
import { useVisualLineCount } from '@/hooks/useVisualLineCount'

let resizeObserverCallback: ResizeObserverCallback | null = null

class ResizeObserverMock {
  observe = vi.fn()
  disconnect = vi.fn()
  constructor(callback: ResizeObserverCallback) {
    resizeObserverCallback = callback
  }
}

function createEditorContainer(options: {
  heightRef: { value: number }
  lineHeight?: number
  paddingTop?: number
  paddingBottom?: number
}) {
  const { heightRef, lineHeight = 24, paddingTop = 12, paddingBottom = 12 } = options
  const container = document.createElement('div')
  const pre = document.createElement('pre')

  pre.style.lineHeight = `${lineHeight}px`
  pre.style.paddingTop = `${paddingTop}px`
  pre.style.paddingBottom = `${paddingBottom}px`

  Object.defineProperty(pre, 'scrollHeight', {
    configurable: true,
    get: () => heightRef.value,
  })

  container.appendChild(pre)
  return container
}

describe('useVisualLineCount', () => {
  beforeEach(() => {
    resizeObserverCallback = null

    vi.stubGlobal('ResizeObserver', ResizeObserverMock)
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(0)
      return 1
    })
    vi.stubGlobal('cancelAnimationFrame', () => {})
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('falls back to logical line count when container is unavailable', () => {
    const ref = { current: null } as RefObject<HTMLDivElement>

    const { result } = renderHook(() =>
      useVisualLineCount({
        markdown: 'line 1\nline 2\nline 3',
        editorContainerRef: ref,
        enabled: true,
      })
    )

    expect(result.current).toBe(3)
  })

  it('computes visual line count from rendered content height', () => {
    const heightRef = { value: 264 } // (264 - 24) / 24 = 10
    const container = createEditorContainer({ heightRef })
    const ref = { current: container } as RefObject<HTMLDivElement>

    const { result } = renderHook(() =>
      useVisualLineCount({
        markdown: 'line 1\nline 2',
        editorContainerRef: ref,
        enabled: true,
      })
    )

    expect(result.current).toBe(10)
  })

  it('decreases visual line count when content shrinks', () => {
    const heightRef = { value: 264 } // 10 lines
    const container = createEditorContainer({ heightRef })
    const ref = { current: container } as RefObject<HTMLDivElement>

    const { result, rerender } = renderHook(
      ({ markdown }) =>
        useVisualLineCount({
          markdown,
          editorContainerRef: ref,
          enabled: true,
        }),
      { initialProps: { markdown: 'line 1\nline 2\nline 3\nline 4\nline 5' } }
    )

    expect(result.current).toBe(10)

    act(() => {
      heightRef.value = 120 // (120 - 24) / 24 = 4
      rerender({ markdown: 'line 1\nline 2' })
    })

    expect(result.current).toBe(4)
  })

  it('recalculates when editor width/size changes (ResizeObserver)', () => {
    const heightRef = { value: 168 } // 6 lines
    const container = createEditorContainer({ heightRef })
    const ref = { current: container } as RefObject<HTMLDivElement>

    const { result } = renderHook(() =>
      useVisualLineCount({
        markdown: 'line 1\nline 2\nline 3',
        editorContainerRef: ref,
        enabled: true,
      })
    )

    expect(result.current).toBe(6)
    expect(resizeObserverCallback).toBeTruthy()

    act(() => {
      heightRef.value = 216 // 8 lines
      resizeObserverCallback?.([], {} as ResizeObserver)
    })

    expect(result.current).toBe(8)
  })
})

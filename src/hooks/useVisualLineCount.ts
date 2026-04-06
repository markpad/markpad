import { useCallback, useEffect, useState, type RefObject } from 'react'

interface UseVisualLineCountParams {
  markdown: string
  editorContainerRef: RefObject<HTMLDivElement>
  enabled?: boolean
}

/**
 * Computes visual line count (including soft wraps) from the rendered editor content.
 * Falls back to logical markdown lines when measurement is not available.
 */
export function useVisualLineCount({
  markdown,
  editorContainerRef,
  enabled = true,
}: UseVisualLineCountParams): number {
  const [visualLineCount, setVisualLineCount] = useState(() => Math.max(1, markdown.split('\n').length))

  const updateVisualLineCount = useCallback(() => {
    const logicalLineCount = Math.max(1, markdown.split('\n').length)

    if (!enabled) {
      setVisualLineCount((prev) => (prev === logicalLineCount ? prev : logicalLineCount))
      return
    }

    const container = editorContainerRef.current
    if (!container) {
      setVisualLineCount((prev) => (prev === logicalLineCount ? prev : logicalLineCount))
      return
    }

    const pre = container.querySelector('pre') as HTMLElement | null
    const textarea = container.querySelector('textarea') as HTMLTextAreaElement | null
    const target = pre ?? textarea

    if (!target) {
      setVisualLineCount((prev) => (prev === logicalLineCount ? prev : logicalLineCount))
      return
    }

    const styles = window.getComputedStyle(target)
    const lineHeight = parseFloat(styles.lineHeight) || 24
    const paddingTop = parseFloat(styles.paddingTop) || 0
    const paddingBottom = parseFloat(styles.paddingBottom) || 0
    const contentHeight = Math.max(0, target.scrollHeight - paddingTop - paddingBottom)
    const measuredCount = Math.max(1, Math.ceil(contentHeight / lineHeight))

    setVisualLineCount((prev) => (prev === measuredCount ? prev : measuredCount))
  }, [editorContainerRef, enabled, markdown])

  useEffect(() => {
    const raf = requestAnimationFrame(updateVisualLineCount)
    return () => cancelAnimationFrame(raf)
  }, [updateVisualLineCount])

  useEffect(() => {
    if (!enabled || !editorContainerRef.current || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(() => {
      requestAnimationFrame(updateVisualLineCount)
    })

    observer.observe(editorContainerRef.current)
    return () => observer.disconnect()
  }, [editorContainerRef, enabled, updateVisualLineCount])

  return visualLineCount
}


import { useState, useCallback } from 'react'
import { exportPdf } from '../utils/htmlGenerator'
import type { TailwindClasses } from '../types'

export type PdfExportStatus = 'idle' | 'exporting' | 'done' | 'error'

export interface PdfExportOptions {
  documentTitle: string
  htmlContent: string
  tailwindClasses: TailwindClasses
  fontFamily: string
}

interface UseExportPdfReturn {
  /** Current export status */
  status: PdfExportStatus
  /** Error message if export failed */
  error: string | null
  /** Whether an export is in progress */
  isExporting: boolean
  /** Trigger a PDF export */
  handleExportPdf: (options: PdfExportOptions) => Promise<void>
  /** Reset status back to idle */
  reset: () => void
}

/**
 * Hook that wraps the PDF export logic with React state management.
 * Tracks export status (idle → exporting → done/error) and provides
 * error handling.
 */
export function useExportPdf(): UseExportPdfReturn {
  const [status, setStatus] = useState<PdfExportStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const handleExportPdf = useCallback(async (options: PdfExportOptions) => {
    setStatus('exporting')
    setError(null)

    try {
      await exportPdf(options)
      setStatus('done')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'PDF export failed'
      setError(message)
      setStatus('error')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
  }, [])

  return {
    status,
    error,
    isExporting: status === 'exporting',
    handleExportPdf,
    reset,
  }
}

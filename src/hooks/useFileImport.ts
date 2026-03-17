import { useState, useCallback, useRef } from 'react'

export type FileImportStatus = 'idle' | 'reading' | 'success' | 'error'

export interface FileImportResult {
  content: string
  fileName: string
  fileSize: number
}

export interface UseFileImportResult {
  /** Current import status */
  status: FileImportStatus
  /** Error message, if any */
  error: string | null
  /** The imported file result */
  result: FileImportResult | null
  /** Import a file from a File object (e.g. from drag-and-drop or input) */
  importFile: (file: File) => Promise<void>
  /** Open the native file picker dialog */
  openFilePicker: () => void
  /** Reset the import state */
  reset: () => void
  /** Reference to the hidden file input */
  fileInputRef: React.RefObject<HTMLInputElement | null>
  /** Handle file input change event */
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  /** Handle drag-and-drop */
  handleDrop: (e: React.DragEvent) => void
  /** Whether a file is being dragged over */
  isDragging: boolean
  /** Handle drag enter */
  handleDragEnter: (e: React.DragEvent) => void
  /** Handle drag leave */
  handleDragLeave: (e: React.DragEvent) => void
  /** Handle drag over */
  handleDragOver: (e: React.DragEvent) => void
}

const ACCEPTED_EXTENSIONS = ['.md', '.markdown', '.txt']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

function isAcceptedFile(fileName: string): boolean {
  const lower = fileName.toLowerCase()
  return ACCEPTED_EXTENSIONS.some((ext) => lower.endsWith(ext))
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Hook for importing markdown files from the local file system.
 * Handles file validation, reading, and drag-and-drop.
 */
export function useFileImport(): UseFileImportResult {
  const [status, setStatus] = useState<FileImportStatus>('idle')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FileImportResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setError(null)
    setResult(null)
    setIsDragging(false)
  }, [])

  const importFile = useCallback(async (file: File) => {
    setError(null)
    setResult(null)

    // Validate file extension
    if (!isAcceptedFile(file.name)) {
      setStatus('error')
      setError(`Unsupported file type. Accepted: ${ACCEPTED_EXTENSIONS.join(', ')}`)
      return
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setStatus('error')
      setError(
        `File too large (${formatFileSize(file.size)}). Maximum: ${formatFileSize(MAX_FILE_SIZE)}`
      )
      return
    }

    // Validate non-empty
    if (file.size === 0) {
      setStatus('error')
      setError('File is empty.')
      return
    }

    setStatus('reading')

    try {
      const content = await file.text()
      setResult({
        content,
        fileName: file.name,
        fileSize: file.size,
      })
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Failed to read file.')
    }
  }, [])

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        importFile(file)
      }
      // Reset input so the same file can be re-selected
      if (e.target) {
        e.target.value = ''
      }
    },
    [importFile]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const file = e.dataTransfer.files?.[0]
      if (file) {
        importFile(file)
      }
    },
    [importFile]
  )

  return {
    status,
    error,
    result,
    importFile,
    openFilePicker,
    reset,
    fileInputRef,
    handleFileInputChange,
    handleDrop,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
  }
}

export { ACCEPTED_EXTENSIONS, MAX_FILE_SIZE, isAcceptedFile, formatFileSize }

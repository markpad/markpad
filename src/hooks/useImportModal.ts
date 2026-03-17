import { useState, useCallback } from 'react'
import { useFileImport } from './useFileImport'
import { useUrlImport } from './useUrlImport'

export type ImportTab = 'file' | 'url'

export interface UseImportModalResult {
  /** Whether the modal is open */
  isOpen: boolean
  /** Open the modal */
  open: () => void
  /** Close the modal */
  close: () => void
  /** Active tab */
  activeTab: ImportTab
  /** Switch tab */
  setActiveTab: (tab: ImportTab) => void
  /** File import hook */
  fileImport: ReturnType<typeof useFileImport>
  /** URL import hook */
  urlImport: ReturnType<typeof useUrlImport>
  /** Reset all state */
  reset: () => void
}

/**
 * Hook that orchestrates the Import Modal, combining file import and URL import.
 */
export function useImportModal(): UseImportModalResult {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<ImportTab>('file')

  const fileImport = useFileImport()
  const urlImport = useUrlImport()

  const reset = useCallback(() => {
    fileImport.reset()
    urlImport.reset()
    setActiveTab('file')
  }, [fileImport, urlImport])

  const open = useCallback(() => {
    reset()
    setIsOpen(true)
  }, [reset])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    open,
    close,
    activeTab,
    setActiveTab,
    fileImport,
    urlImport,
    reset,
  }
}

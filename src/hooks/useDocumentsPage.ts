import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocuments } from './useDocuments'
import type { MarkpadDocument } from '../lib/repositories'

const VIEW_MODE_STORAGE_KEY = 'markpad-view-mode'

export type DocumentViewFilter = 'all' | 'starred' | 'recent' | 'trash'

export interface UseDocumentsPageReturn {
  // From useDocuments
  documents: MarkpadDocument[]
  loading: boolean
  error: Error | null
  filter: DocumentViewFilter
  searchQuery: string
  setFilter: (filter: DocumentViewFilter) => void
  setSearchQuery: (query: string) => void
  toggleStar: (id: string) => Promise<void>
  moveToTrash: (id: string) => Promise<void>
  restoreFromTrash: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>

  // View mode
  viewMode: 'grid' | 'list'
  handleViewModeChange: (mode: 'grid' | 'list') => void

  // Handlers
  handleNewDocument: () => Promise<void>
  handleOpenDocument: (doc: MarkpadDocument) => void
  handleImportFile: () => void
}

export function useDocumentsPage(): UseDocumentsPageReturn {
  const navigate = useNavigate()
  const {
    documents,
    loading,
    error,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    create,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
  } = useDocuments()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list') || 'grid'
  })

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  const handleNewDocument = useCallback(async () => {
    const doc = await create('Untitled Document', '# New Document\n\nStart writing...')
    navigate(`/editor/${doc.id}`)
  }, [create, navigate])

  const handleOpenDocument = useCallback(
    (doc: MarkpadDocument) => {
      navigate(`/editor/${doc.id}`)
    },
    [navigate]
  )

  const handleImportFile = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.md,.markdown,.txt'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const content = await file.text()
      const title = file.name.replace(/\.(md|markdown|txt)$/, '')
      const doc = await create(title, content)
      navigate(`/editor/${doc.id}`)
    }
    input.click()
  }, [create, navigate])

  return {
    // From useDocuments
    documents,
    loading,
    error,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,

    // View mode
    viewMode,
    handleViewModeChange,

    // Handlers
    handleNewDocument,
    handleOpenDocument,
    handleImportFile,
  }
}

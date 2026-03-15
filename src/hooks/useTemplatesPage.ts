import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTemplates } from './useTemplates'
import { documentRepository } from '../lib/repositories'
import type { MarkpadTemplate } from '../lib/repositories'
import { seedSystemTemplates } from '../services/seedService'

const VIEW_MODE_STORAGE_KEY = 'markpad-templates-view'

export type TemplateViewFilter = 'all' | 'system' | 'custom'

export interface UseTemplatesPageReturn {
  // From useTemplates
  templates: MarkpadTemplate[]
  loading: boolean
  error: Error | null
  filter: TemplateViewFilter
  searchQuery: string
  setFilter: (filter: TemplateViewFilter) => void
  setSearchQuery: (query: string) => void

  // View mode
  viewMode: 'grid' | 'list'
  handleViewModeChange: (mode: 'grid' | 'list') => void

  // Handlers
  handleUseTemplate: (template: MarkpadTemplate) => Promise<void>
  handleEditTemplate: (template: MarkpadTemplate) => void
  handleNewTemplate: () => void
}

export function useTemplatesPage(): UseTemplatesPageReturn {
  const navigate = useNavigate()
  const { templates, loading, error, filter, searchQuery, setFilter, setSearchQuery, refresh } =
    useTemplates()

  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    return (localStorage.getItem(VIEW_MODE_STORAGE_KEY) as 'grid' | 'list') || 'grid'
  })

  // Seed system templates on mount
  useEffect(() => {
    const result = seedSystemTemplates()
    // Handle both promise and void returns (for testing)
    if (result && typeof result.then === 'function') {
      result.then(() => refresh())
    } else {
      refresh()
    }
  }, [refresh])

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode)
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode)
  }, [])

  const handleUseTemplate = useCallback(
    async (template: MarkpadTemplate) => {
      // Create a new document from the template (snapshot)
      const doc = await documentRepository.create({
        title: `${template.title} — New`,
        content: template.content,
        themeId: template.themeId,
        variables: {},
        templateId: template.id,
        templateVersion: template.version,
      })
      navigate(`/editor/${doc.id}`)
    },
    [navigate]
  )

  const handleEditTemplate = useCallback(
    (template: MarkpadTemplate) => {
      navigate(`/template/${template.id}`)
    },
    [navigate]
  )

  const handleNewTemplate = useCallback(() => {
    navigate('/template/new')
  }, [navigate])

  return {
    // From useTemplates
    templates,
    loading,
    error,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,

    // View mode
    viewMode,
    handleViewModeChange,

    // Handlers
    handleUseTemplate,
    handleEditTemplate,
    handleNewTemplate,
  }
}

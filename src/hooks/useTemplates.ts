import { useState, useEffect, useCallback } from 'react'
import { templateRepository, type MarkpadTemplate } from '../lib/repositories'

type TemplateFilter = 'all' | 'system' | 'custom'

interface UseTemplatesReturn {
  templates: MarkpadTemplate[]
  loading: boolean
  error: Error | null
  filter: TemplateFilter
  searchQuery: string
  setFilter: (filter: TemplateFilter) => void
  setSearchQuery: (query: string) => void
  create: (
    title: string,
    content: string,
    options?: { description?: string; themeId?: string; category?: string }
  ) => Promise<MarkpadTemplate>
  update: (id: string, data: Partial<MarkpadTemplate>) => Promise<MarkpadTemplate>
  remove: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useTemplates(): UseTemplatesReturn {
  const [allTemplates, setAllTemplates] = useState<MarkpadTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<TemplateFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const templates = await templateRepository.getAll()
      setAllTemplates(templates)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const templates = allTemplates.filter((t) => {
    // Search filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      const matchesSearch =
        t.title.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.content.toLowerCase().includes(lower)
      if (!matchesSearch) return false
    }

    switch (filter) {
      case 'system':
        return t.isSystem
      case 'custom':
        return !t.isSystem
      case 'all':
      default:
        return true
    }
  })

  const create = useCallback(
    async (
      title: string,
      content: string,
      options?: { description?: string; themeId?: string; category?: string }
    ) => {
      const template = await templateRepository.create({
        title,
        content,
        description: options?.description,
        themeId: options?.themeId,
        category: options?.category,
      })
      await refresh()
      return template
    },
    [refresh]
  )

  const update = useCallback(
    async (id: string, data: Partial<MarkpadTemplate>) => {
      const template = await templateRepository.update(id, data)
      await refresh()
      return template
    },
    [refresh]
  )

  const remove = useCallback(
    async (id: string) => {
      await templateRepository.delete(id)
      await refresh()
    },
    [refresh]
  )

  return {
    templates,
    loading,
    error,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    create,
    update,
    remove,
    refresh,
  }
}

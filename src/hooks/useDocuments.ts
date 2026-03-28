import { useState, useEffect, useCallback } from 'react'
import { documentRepository, type MarkpadDocument } from '@/lib/repositories'

type ViewFilter = 'all' | 'starred' | 'recent' | 'trash'

interface UseDocumentsReturn {
  documents: MarkpadDocument[]
  loading: boolean
  error: Error | null
  filter: ViewFilter
  searchQuery: string
  setFilter: (filter: ViewFilter) => void
  setSearchQuery: (query: string) => void
  create: (title: string, content: string) => Promise<MarkpadDocument>
  update: (id: string, data: Partial<MarkpadDocument>) => Promise<MarkpadDocument>
  remove: (id: string) => Promise<void>
  toggleStar: (id: string) => Promise<void>
  moveToTrash: (id: string) => Promise<void>
  restoreFromTrash: (id: string) => Promise<void>
  permanentDelete: (id: string) => Promise<void>
  refresh: () => Promise<void>
}

export function useDocuments(): UseDocumentsReturn {
  const [allDocuments, setAllDocuments] = useState<MarkpadDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filter, setFilter] = useState<ViewFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const refresh = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const docs = await documentRepository.getAll()
      setAllDocuments(docs)
    } catch (e) {
      setError(e as Error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Filter documents based on current filter and search
  const documents = allDocuments.filter((doc) => {
    // Search filter
    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      const matchesSearch =
        doc.title.toLowerCase().includes(lower) || doc.content.toLowerCase().includes(lower)
      if (!matchesSearch) return false
    }

    switch (filter) {
      case 'starred':
        return doc.starred && !doc.trashedAt
      case 'trash':
        return !!doc.trashedAt
      case 'recent':
        // Last 7 days
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return !doc.trashedAt && new Date(doc.updatedAt) >= weekAgo
      case 'all':
      default:
        return !doc.trashedAt
    }
  })

  const create = useCallback(
    async (title: string, content: string) => {
      const doc = await documentRepository.create({ title, content })
      await refresh()
      return doc
    },
    [refresh]
  )

  const update = useCallback(
    async (id: string, data: Partial<MarkpadDocument>) => {
      const doc = await documentRepository.update(id, data)
      await refresh()
      return doc
    },
    [refresh]
  )

  const remove = useCallback(
    async (id: string) => {
      await documentRepository.delete(id)
      await refresh()
    },
    [refresh]
  )

  const toggleStar = useCallback(
    async (id: string) => {
      const doc = allDocuments.find((d) => d.id === id)
      if (doc) {
        await documentRepository.update(id, { starred: !doc.starred })
        await refresh()
      }
    },
    [allDocuments, refresh]
  )

  const moveToTrash = useCallback(
    async (id: string) => {
      await documentRepository.update(id, { trashedAt: new Date() })
      await refresh()
    },
    [refresh]
  )

  const restoreFromTrash = useCallback(
    async (id: string) => {
      await documentRepository.update(id, { trashedAt: null })
      await refresh()
    },
    [refresh]
  )

  const permanentDelete = useCallback(
    async (id: string) => {
      await documentRepository.delete(id)
      await refresh()
    },
    [refresh]
  )

  return {
    documents,
    loading,
    error,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    create,
    update,
    remove,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    refresh,
  }
}

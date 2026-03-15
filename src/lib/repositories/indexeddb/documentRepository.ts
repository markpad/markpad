import { getDB } from './db'
import type {
  MarkpadDocument,
  DocumentRepository,
  CreateDocumentInput,
  UpdateDocumentInput,
} from '../types'
import {
  defaultTailwindClasses,
  defaultBehaviorConfig,
  defaultFontConfig,
} from '../../../services/urlStateService'

export function createIndexedDBDocumentRepository(): DocumentRepository {
  return {
    async getAll(): Promise<MarkpadDocument[]> {
      const db = await getDB()
      const docs = await db.getAll('documents')
      // Return sorted by updatedAt descending (most recent first)
      return docs.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    async getById(id: string): Promise<MarkpadDocument | undefined> {
      const db = await getDB()
      return db.get('documents', id)
    },

    async create(input: CreateDocumentInput): Promise<MarkpadDocument> {
      const db = await getDB()
      const now = new Date()
      const doc: MarkpadDocument = {
        id: crypto.randomUUID(),
        title: input.title,
        content: input.content,
        themeId: input.themeId,
        tailwindClasses: input.tailwindClasses ?? defaultTailwindClasses,
        behaviorConfig: input.behaviorConfig ?? defaultBehaviorConfig,
        fontConfig: input.fontConfig ?? defaultFontConfig,
        variables: input.variables ?? {},
        templateId: input.templateId,
        templateVersion: input.templateVersion,
        starred: false,
        trashedAt: null,
        createdAt: now,
        updatedAt: now,
      }
      await db.add('documents', doc)
      return doc
    },

    async update(id: string, input: UpdateDocumentInput): Promise<MarkpadDocument> {
      const db = await getDB()
      const existing = await db.get('documents', id)
      if (!existing) throw new Error(`Document ${id} not found`)

      const updated: MarkpadDocument = {
        ...existing,
        ...input,
        updatedAt: new Date(),
      }
      await db.put('documents', updated)
      return updated
    },

    async delete(id: string): Promise<void> {
      const db = await getDB()
      await db.delete('documents', id)
    },

    async search(query: string): Promise<MarkpadDocument[]> {
      const db = await getDB()
      const all = await db.getAll('documents')
      const lower = query.toLowerCase()
      return all
        .filter(
          (doc) =>
            !doc.trashedAt &&
            (doc.title.toLowerCase().includes(lower) || doc.content.toLowerCase().includes(lower))
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },
  }
}

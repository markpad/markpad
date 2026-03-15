import { getDB } from './db'
import type {
  MarkpadTemplate,
  TemplateRepository,
  CreateTemplateInput,
  UpdateTemplateInput,
} from '../types'

export function createIndexedDBTemplateRepository(): TemplateRepository {
  return {
    async getAll(): Promise<MarkpadTemplate[]> {
      const db = await getDB()
      const templates = await db.getAll('templates')
      return templates.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    },

    async getById(id: string): Promise<MarkpadTemplate | undefined> {
      const db = await getDB()
      return db.get('templates', id)
    },

    async create(input: CreateTemplateInput): Promise<MarkpadTemplate> {
      const db = await getDB()
      const now = new Date()
      const template: MarkpadTemplate = {
        id: crypto.randomUUID(),
        title: input.title,
        description: input.description ?? '',
        content: input.content,
        themeId: input.themeId,
        variablesSchema: input.variablesSchema ?? {},
        category: input.category,
        isSystem: input.isSystem ?? false,
        version: 1,
        createdAt: now,
        updatedAt: now,
      }
      await db.add('templates', template)
      return template
    },

    async update(id: string, input: UpdateTemplateInput): Promise<MarkpadTemplate> {
      const db = await getDB()
      const existing = await db.get('templates', id)
      if (!existing) throw new Error(`Template ${id} not found`)

      const updated: MarkpadTemplate = {
        ...existing,
        ...input,
        version: existing.version + 1,
        updatedAt: new Date(),
      }
      await db.put('templates', updated)
      return updated
    },

    async delete(id: string): Promise<void> {
      const db = await getDB()
      const existing = await db.get('templates', id)
      if (existing?.isSystem) throw new Error('Cannot delete system templates')
      await db.delete('templates', id)
    },

    async search(query: string): Promise<MarkpadTemplate[]> {
      const db = await getDB()
      const all = await db.getAll('templates')
      const lower = query.toLowerCase()
      return all
        .filter(
          (t) =>
            t.title.toLowerCase().includes(lower) ||
            t.description.toLowerCase().includes(lower) ||
            t.content.toLowerCase().includes(lower)
        )
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    },

    async seedSystemTemplates(templates: CreateTemplateInput[]): Promise<void> {
      const db = await getDB()
      const existing = await db.getAll('templates')
      const existingSystemIds = new Set(existing.filter((t) => t.isSystem).map((t) => t.id))

      const tx = db.transaction('templates', 'readwrite')
      const store = tx.objectStore('templates')

      for (const input of templates) {
        // Use a deterministic ID for system templates based on title
        const id = `system-${input.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        if (existingSystemIds.has(id)) continue

        const now = new Date()
        const template: MarkpadTemplate = {
          id,
          title: input.title,
          description: input.description ?? '',
          content: input.content,
          themeId: input.themeId,
          variablesSchema: input.variablesSchema ?? {},
          category: input.category,
          isSystem: true,
          version: 1,
          createdAt: now,
          updatedAt: now,
        }
        await store.put(template)
      }

      await tx.done
    },
  }
}

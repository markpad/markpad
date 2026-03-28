import { getDB } from '@/lib/repositories/indexeddb/db'
import type {
  MarkpadCustomTheme,
  CreateCustomThemeInput,
  UpdateCustomThemeInput,
  CustomThemeRepository,
} from '@/lib/repositories/types'

function generateId(): string {
  return `theme-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function createIndexedDBCustomThemeRepository(): CustomThemeRepository {
  return {
    async getAll(): Promise<MarkpadCustomTheme[]> {
      const db = await getDB()
      const all = await db.getAllFromIndex('customThemes', 'by-updated')
      return all.reverse() // newest first
    },

    async getById(id: string): Promise<MarkpadCustomTheme | undefined> {
      const db = await getDB()
      return db.get('customThemes', id)
    },

    async create(input: CreateCustomThemeInput): Promise<MarkpadCustomTheme> {
      const db = await getDB()
      const now = new Date()
      const theme: MarkpadCustomTheme = {
        id: generateId(),
        name: input.name,
        configs: input.configs,
        selectedElement: input.selectedElement ?? 'h1',
        darkMode: input.darkMode ?? false,
        basedOnPresetId: input.basedOnPresetId,
        createdAt: now,
        updatedAt: now,
      }
      await db.put('customThemes', theme)
      return theme
    },

    async update(id: string, input: UpdateCustomThemeInput): Promise<MarkpadCustomTheme> {
      const db = await getDB()
      const existing = await db.get('customThemes', id)
      if (!existing) throw new Error(`Custom theme not found: ${id}`)
      const updated: MarkpadCustomTheme = {
        ...existing,
        ...input,
        updatedAt: new Date(),
      }
      await db.put('customThemes', updated)
      return updated
    },

    async delete(id: string): Promise<void> {
      const db = await getDB()
      await db.delete('customThemes', id)
    },
  }
}

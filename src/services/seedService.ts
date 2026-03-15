import { templateRepository } from '../lib/repositories'
import { systemTemplates } from '../data/systemTemplates'

let seeded = false

/**
 * Seeds system templates into IndexedDB on first load.
 * Idempotent — skips templates that already exist.
 */
export async function seedSystemTemplates(): Promise<void> {
  if (seeded) return
  seeded = true

  try {
    await templateRepository.seedSystemTemplates(systemTemplates)
  } catch (err) {
    console.error('Failed to seed system templates:', err)
  }
}

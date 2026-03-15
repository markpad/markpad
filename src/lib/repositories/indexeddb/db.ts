import { openDB, DBSchema, IDBPDatabase } from 'idb'
import type { MarkpadDocument, MarkpadTemplate, MarkpadCustomTheme } from '../types'
import {
  defaultTailwindClasses,
  defaultBehaviorConfig,
  defaultFontConfig,
} from '../../../services/urlStateService'

interface MarkpadDB extends DBSchema {
  documents: {
    key: string
    value: MarkpadDocument
    indexes: {
      'by-updated': Date
      'by-starred': number
    }
  }
  templates: {
    key: string
    value: MarkpadTemplate
    indexes: {
      'by-updated': Date
      'by-system': number
    }
  }
  customThemes: {
    key: string
    value: MarkpadCustomTheme
    indexes: {
      'by-updated': Date
    }
  }
}

let dbInstance: IDBPDatabase<MarkpadDB> | null = null

export async function getDB(): Promise<IDBPDatabase<MarkpadDB>> {
  if (!dbInstance) {
    dbInstance = await openDB<MarkpadDB>('markpad', 4, {
      upgrade(db, oldVersion, _newVersion, transaction) {
        if (oldVersion < 1) {
          const docStore = db.createObjectStore('documents', { keyPath: 'id' })
          docStore.createIndex('by-updated', 'updatedAt')
          docStore.createIndex('by-starred', 'starred')
        }

        if (oldVersion < 2) {
          // Migrate existing documents: add tailwindClasses, behaviorConfig, fontConfig
          const store = transaction.objectStore('documents')
          store.openCursor().then(function migrate(cursor): Promise<void> | undefined {
            if (!cursor) return
            const doc = cursor.value as any
            if (!doc.tailwindClasses) {
              const updated = {
                ...doc,
                tailwindClasses: defaultTailwindClasses,
                behaviorConfig: defaultBehaviorConfig,
                fontConfig: doc.fontFamily ? { fontFamily: doc.fontFamily } : defaultFontConfig,
              }
              delete updated.fontFamily
              cursor.update(updated)
            }
            return cursor.continue().then(migrate)
          })
        }

        if (oldVersion < 3) {
          // Add templates store
          if (!db.objectStoreNames.contains('templates')) {
            const tplStore = db.createObjectStore('templates', { keyPath: 'id' })
            tplStore.createIndex('by-updated', 'updatedAt')
            tplStore.createIndex('by-system', 'isSystem')
          }

          // Add variables field to existing documents
          const docStore = transaction.objectStore('documents')
          docStore.openCursor().then(function migrate(cursor): Promise<void> | undefined {
            if (!cursor) return
            const doc = cursor.value as any
            if (!doc.variables) {
              cursor.update({ ...doc, variables: {} })
            }
            return cursor.continue().then(migrate)
          })
        }

        if (oldVersion < 4) {
          // Add customThemes store
          if (!db.objectStoreNames.contains('customThemes')) {
            const themeStore = db.createObjectStore('customThemes', { keyPath: 'id' })
            themeStore.createIndex('by-updated', 'updatedAt')
          }
        }
      },
    })
  }
  return dbInstance
}

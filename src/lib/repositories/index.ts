import { createIndexedDBDocumentRepository } from './indexeddb/documentRepository'
import { createIndexedDBTemplateRepository } from './indexeddb/templateRepository'
import { createIndexedDBCustomThemeRepository } from './indexeddb/customThemeRepository'
import type { DocumentRepository, TemplateRepository, CustomThemeRepository } from './types'

// Switch implementations here when migrating to API
export const documentRepository: DocumentRepository = createIndexedDBDocumentRepository()
export const templateRepository: TemplateRepository = createIndexedDBTemplateRepository()
export const customThemeRepository: CustomThemeRepository = createIndexedDBCustomThemeRepository()

// Re-export types
export type {
  MarkpadDocument,
  DocumentRepository,
  CreateDocumentInput,
  UpdateDocumentInput,
  MarkpadTemplate,
  TemplateRepository,
  CreateTemplateInput,
  UpdateTemplateInput,
  VariableSchema,
  VariableFieldSchema,
  MarkpadCustomTheme,
  CustomThemeRepository,
  CreateCustomThemeInput,
  UpdateCustomThemeInput,
} from './types'

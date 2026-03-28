// Repository types - abstract interface that can be backed by IndexedDB or API

import type { TailwindClasses, BehaviorConfig, FontConfig } from '@/types'

// ─── Documents ───────────────────────────────────────────────────────────────

export interface MarkpadDocument {
  id: string
  title: string
  content: string
  themeId?: string
  tailwindClasses: TailwindClasses
  fontConfig: FontConfig
  variables: Record<string, unknown>
  templateId?: string
  templateVersion?: number
  starred: boolean
  trashedAt?: Date | null
  createdAt: Date
  updatedAt: Date
  // Legacy support for migration - will be removed soon
  behaviorConfig?: BehaviorConfig
}

export type CreateDocumentInput = Pick<MarkpadDocument, 'title' | 'content'> &
  Partial<
    Pick<
      MarkpadDocument,
      | 'themeId'
      | 'tailwindClasses'
      | 'fontConfig'
      | 'variables'
      | 'templateId'
      | 'templateVersion'
      | 'behaviorConfig'
    >
  >

export type UpdateDocumentInput = Partial<
  Pick<
    MarkpadDocument,
    | 'title'
    | 'content'
    | 'themeId'
    | 'tailwindClasses'
    | 'fontConfig'
    | 'variables'
    | 'starred'
    | 'trashedAt'
  >
>

export interface DocumentRepository {
  getAll(): Promise<MarkpadDocument[]>
  getById(id: string): Promise<MarkpadDocument | undefined>
  create(input: CreateDocumentInput): Promise<MarkpadDocument>
  update(id: string, input: UpdateDocumentInput): Promise<MarkpadDocument>
  delete(id: string): Promise<void>
  search(query: string): Promise<MarkpadDocument[]>
}

// ─── Templates ───────────────────────────────────────────────────────────────

export interface VariableFieldSchema {
  key: string
  type: 'text' | 'number' | 'boolean' | 'textarea'
  label: string
}

export interface VariableSchema {
  type: 'text' | 'number' | 'boolean' | 'list' | 'textarea' | 'object-list'
  label: string
  default: unknown
  schema?: VariableFieldSchema[]
}

export interface MarkpadTemplate {
  id: string
  title: string
  description: string
  content: string
  themeId?: string
  tailwindClasses?: TailwindClasses
  fontConfig?: FontConfig
  variablesSchema: Record<string, VariableSchema>
  category?: string
  isSystem: boolean
  version: number
  createdAt: Date
  updatedAt: Date
  // Legacy support for migration
  behaviorConfig?: BehaviorConfig
}

export type CreateTemplateInput = Pick<MarkpadTemplate, 'title' | 'content'> &
  Partial<
    Pick<
      MarkpadTemplate,
      | 'description'
      | 'themeId'
      | 'tailwindClasses'
      | 'fontConfig'
      | 'variablesSchema'
      | 'category'
      | 'isSystem'
      | 'behaviorConfig'
    >
  >

export type UpdateTemplateInput = Partial<
  Pick<
    MarkpadTemplate,
    | 'title'
    | 'content'
    | 'description'
    | 'themeId'
    | 'tailwindClasses'
    | 'fontConfig'
    | 'variablesSchema'
    | 'category'
  >
>

export interface TemplateRepository {
  getAll(): Promise<MarkpadTemplate[]>
  getById(id: string): Promise<MarkpadTemplate | undefined>
  create(input: CreateTemplateInput): Promise<MarkpadTemplate>
  update(id: string, input: UpdateTemplateInput): Promise<MarkpadTemplate>
  delete(id: string): Promise<void>
  search(query: string): Promise<MarkpadTemplate[]>
  seedSystemTemplates(templates: CreateTemplateInput[]): Promise<void>
}

// ─── Custom Themes ───────────────────────────────────────────────────────────

export interface MarkpadCustomTheme {
  id: string
  name: string
  /** The per-element config objects from the theme editor */
  configs: Record<string, Record<string, string | undefined>>
  /** Which element was last selected in the editor */
  selectedElement?: string
  darkMode: boolean
  /** Optional: the preset theme ID this was forked from */
  basedOnPresetId?: string
  createdAt: Date
  updatedAt: Date
}

export type CreateCustomThemeInput = Pick<MarkpadCustomTheme, 'name' | 'configs'> &
  Partial<Pick<MarkpadCustomTheme, 'selectedElement' | 'darkMode' | 'basedOnPresetId'>>

export type UpdateCustomThemeInput = Partial<
  Pick<MarkpadCustomTheme, 'name' | 'configs' | 'selectedElement' | 'darkMode'>
>

export interface CustomThemeRepository {
  getAll(): Promise<MarkpadCustomTheme[]>
  getById(id: string): Promise<MarkpadCustomTheme | undefined>
  create(input: CreateCustomThemeInput): Promise<MarkpadCustomTheme>
  update(id: string, input: UpdateCustomThemeInput): Promise<MarkpadCustomTheme>
  delete(id: string): Promise<void>
}

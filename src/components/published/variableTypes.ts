/**
 * Variable Wizard Types
 * Automatically detects and types variables from frontmatter
 */

export type VariableType = 'text' | 'number' | 'boolean' | 'list' | 'textarea' | 'object-list'

// Schema for object fields within object-list
export interface ObjectFieldSchema {
  key: string
  type: 'text' | 'number' | 'boolean' | 'textarea'
  label: string
}

export interface VariableDefinition {
  type: VariableType
  label: string
  default: string | number | boolean | string[] | Record<string, unknown>[]
  // For object-list type: defines the fields in each object
  schema?: ObjectFieldSchema[]
}

export type VariableDefinitions = Record<string, VariableDefinition>

export type VariableValue = string | number | boolean | string[] | Record<string, unknown>[]
export type VariableValues = Record<string, VariableValue>

// Reserved frontmatter keys that should NOT appear in the wizard
const RESERVED_KEYS = new Set([
  'classes',
  'behavior',
  'fontConfig',
  'preview',
  'id',
  'name',
  'description',
  'category',
  'fontFamily',
  'exampleContent',
  'tailwindClasses',
  'behaviorConfig',
])

/**
 * Convert snake_case or camelCase to Title Case for labels
 */
function toLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1') // camelCase -> camel Case
    .replace(/[_-]/g, ' ') // snake_case -> snake case
    .replace(/\b\w/g, (c) => c.toUpperCase()) // capitalize first letters
    .trim()
}

/**
 * Infer field type from primitive value
 */
function inferPrimitiveType(value: unknown): 'text' | 'number' | 'boolean' | 'textarea' {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (typeof value === 'string' && value.length > 100) return 'textarea'
  return 'text'
}

/**
 * Infer variable type from value
 */
function inferType(value: unknown): VariableType {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (Array.isArray(value)) {
    // Check if it's an array of objects
    if (value.length > 0 && typeof value[0] === 'object' && value[0] !== null) {
      return 'object-list'
    }
    return 'list'
  }
  if (typeof value === 'string' && value.length > 100) return 'textarea'
  return 'text'
}

/**
 * Extract schema from an array of objects
 * Analyzes the first object to determine field structure
 */
function extractObjectSchema(items: Record<string, unknown>[]): ObjectFieldSchema[] {
  if (items.length === 0) return []

  const firstItem = items[0]
  const schema: ObjectFieldSchema[] = []

  for (const [key, value] of Object.entries(firstItem)) {
    // Skip nested objects/arrays - only support primitive fields
    if (typeof value === 'object' && value !== null) continue

    schema.push({
      key,
      type: inferPrimitiveType(value),
      label: toLabel(key),
    })
  }

  return schema
}

/**
 * Parse variable definitions from frontmatter data
 * Automatically detects variables and infers their types
 *
 * Example frontmatter:
 * ---
 * name: John Developer
 * title: Senior Software Engineer
 * show_photo: true
 * years_experience: 5
 * certifications:
 *   - AWS Certified
 *   - Google Cloud
 * experiences:
 *   - company: TechCorp
 *     role: Senior Dev
 *     years: 3
 * ---
 */
export function parseVariableDefinitions(
  frontmatterData: Record<string, unknown>
): VariableDefinitions | null {
  const definitions: VariableDefinitions = {}

  for (const [key, value] of Object.entries(frontmatterData)) {
    // Skip reserved keys
    if (RESERVED_KEYS.has(key)) continue

    // Skip null/undefined values
    if (value === null || value === undefined) continue

    // Skip non-array complex objects
    if (typeof value === 'object' && !Array.isArray(value)) continue

    const type = inferType(value)

    if (type === 'object-list') {
      const items = value as Record<string, unknown>[]
      const schema = extractObjectSchema(items)

      // Only add if we could extract a schema
      if (schema.length > 0) {
        definitions[key] = {
          type,
          label: toLabel(key),
          default: items,
          schema,
        }
      }
    } else {
      definitions[key] = {
        type,
        label: toLabel(key),
        default: value as string | number | boolean | string[],
      }
    }
  }

  return Object.keys(definitions).length > 0 ? definitions : null
}

/**
 * Get default values from variable definitions
 */
export function getDefaultValues(definitions: VariableDefinitions): VariableValues {
  const values: VariableValues = {}

  for (const [key, def] of Object.entries(definitions)) {
    values[key] = def.default
  }

  return values
}

/**
 * Merge variable values with frontmatter data for interpolation
 */
export function mergeVariablesWithFrontmatter(
  frontmatterData: Record<string, unknown>,
  variableValues: VariableValues
): Record<string, unknown> {
  // Create a copy of frontmatter data
  const merged = { ...frontmatterData }

  // Override with user-provided variable values
  for (const [key, value] of Object.entries(variableValues)) {
    merged[key] = value
  }

  return merged
}

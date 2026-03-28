import nunjucks from 'nunjucks'
import { getNestedValue } from '@/lib/markdown-templating/variables'

/**
 * Check if a value is truthy in template context
 *
 * Falsy values: undefined, null, false, 0, empty string, empty array
 *
 * @param value - The value to check
 * @returns Whether the value is truthy
 */
export function isTruthy(value: unknown): boolean {
  if (value === undefined || value === null) return false
  if (typeof value === 'boolean') return value
  if (typeof value === 'number') return value !== 0
  if (typeof value === 'string') return value.length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Evaluate a condition expression against data
 *
 * Supports:
 * - Truthy check: `{% if variable %}`
 * - Negation: `{% if not variable %}`
 * - Equality: `{% if variable == "value" %}`
 * - Inequality: `{% if variable != "value" %}`
 * - Numeric comparisons: `{% if age > 18 %}`, `{% if count <= 10 %}`
 *
 * @example
 * evaluate('isAdmin', { isAdmin: true }) // true
 * evaluate('not isAdmin', { isAdmin: false }) // true
 * evaluate('role == "admin"', { role: 'admin' }) // true
 * evaluate('age >= 18', { age: 21 }) // true
 *
 * @param expression - The condition expression to evaluate
 * @param data - The data object
 * @returns Whether the condition is truthy
 */
export function evaluate(expression: string, data: Record<string, unknown>): boolean {
  const trimmed = expression.trim()

  // Handle negation: "not variable"
  if (trimmed.startsWith('not ')) {
    const varPath = trimmed.slice(4).trim()
    return !isTruthy(getNestedValue(data, varPath))
  }

  // Handle equality: "variable == value"
  const eqMatch =
    trimmed.match(/^([\w.]+)\s*==\s*"([^"]*)"$/) || trimmed.match(/^([\w.]+)\s*==\s*'([^']*)'$/)
  if (eqMatch) {
    const value = getNestedValue(data, eqMatch[1])
    return String(value) === eqMatch[2]
  }

  // Handle inequality: "variable != value"
  const neqMatch =
    trimmed.match(/^([\w.]+)\s*!=\s*"([^"]*)"$/) || trimmed.match(/^([\w.]+)\s*!=\s*'([^']*)'$/)
  if (neqMatch) {
    const value = getNestedValue(data, neqMatch[1])
    return String(value) !== neqMatch[2]
  }

  // Handle numeric comparisons: >, <, >=, <=
  const cmpMatch = trimmed.match(/^([\w.]+)\s*(>=|<=|>|<)\s*(\d+(?:\.\d+)?)$/)
  if (cmpMatch) {
    const value = Number(getNestedValue(data, cmpMatch[1]))
    const operator = cmpMatch[2]
    const comparand = Number(cmpMatch[3])
    if (isNaN(value)) return false
    switch (operator) {
      case '>':
        return value > comparand
      case '<':
        return value < comparand
      case '>=':
        return value >= comparand
      case '<=':
        return value <= comparand
    }
  }

  // Simple truthy check: "variable"
  const value = getNestedValue(data, trimmed)
  return isTruthy(value)
}

/**
 * Process conditionals in content using Nunjucks
 *
 * Supports all Nunjucks conditional syntax:
 * - `{% if condition %}...{% endif %}`
 * - `{% if condition %}...{% else %}...{% endif %}`
 * - `{% if condition %}...{% elif other %}...{% endif %}`
 *
 * @example
 * processConditionals('{% if isAdmin %}Admin{% endif %}', { isAdmin: true }) // 'Admin'
 * processConditionals('{% if isAdmin %}Admin{% else %}User{% endif %}', { isAdmin: false }) // 'User'
 *
 * @param content - The content with conditional placeholders
 * @param data - The data containing values
 * @returns The content with conditionals resolved
 */
export function processConditionals(content: string, data: Record<string, unknown>): string {
  try {
    return nunjucks.renderString(content, data)
  } catch {
    return content
  }
}

/**
 * Generate an if template string
 *
 * @param variable - The variable name to check
 * @param content - The content to show when condition is true
 * @param elseContent - Optional content to show when condition is false
 * @returns The complete if template string
 */
export function generateIfTemplate(
  variable: string,
  content: string,
  elseContent?: string
): string {
  if (elseContent) {
    return `{% if ${variable} %}\n${content}\n{% else %}\n${elseContent}\n{% endif %}`
  }
  return `{% if ${variable} %}\n${content}\n{% endif %}`
}

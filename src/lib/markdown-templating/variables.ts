/**
 * Get a nested value from an object using dot notation
 *
 * @example
 * getNestedValue({ user: { name: 'John' } }, 'user.name') // 'John'
 *
 * @param obj - The object to get the value from
 * @param path - The path to the value (e.g., "author.name")
 * @returns The value at the path, or undefined if not found
 */
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined
    }
    if (typeof current === 'object') {
      current = (current as Record<string, unknown>)[key]
    } else {
      return undefined
    }
  }

  return current
}

/**
 * Interpolate variables in content using data
 *
 * Variables are in the format {{variableName}} or {{nested.path}}
 *
 * @example
 * interpolate('Hello {{name}}!', { name: 'World' }) // 'Hello World!'
 * interpolate('{{user.email}}', { user: { email: 'a@b.com' } }) // 'a@b.com'
 *
 * @param content - The content with variable placeholders
 * @param data - The data object containing values
 * @param keepUndefined - If true, leave undefined variables as-is
 * @returns The content with variables replaced by their values
 */
export function interpolate(
  content: string,
  data: Record<string, unknown>,
  keepUndefined = true
): string {
  // Match {{variableName}} or {{nested.path.to.value}}
  const variablePattern = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*(?:\.[a-zA-Z_][a-zA-Z0-9_]*)*)\s*\}\}/g

  return content.replace(variablePattern, (match, variablePath: string) => {
    const value = getNestedValue(data, variablePath)

    if (value === undefined || value === null) {
      // Return the original placeholder if variable not found and keepUndefined is true
      return keepUndefined ? match : ''
    }

    // Convert value to string
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }

    return String(value)
  })
}

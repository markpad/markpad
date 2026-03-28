import { useState, useCallback, useMemo } from 'react'
import { parseFrontmatter, generateIfTemplate } from '@/utils/frontmatter'

export type ComparisonOperator = 'truthy' | 'not' | '==' | '!=' | '>' | '<' | '>=' | '<='

export interface IfConfig {
  /** The variable name to check (e.g., "showAdvanced" or "user.age") */
  variableName: string
  /** The comparison operator */
  operator: ComparisonOperator
  /** The value to compare against (empty for truthy/not) */
  compareValue: string
  /** The content template inside the if block */
  contentTemplate: string
}

export interface UseIfModalResult {
  /** Whether the modal is open */
  isOpen: boolean
  /** Open the modal */
  open: () => void
  /** Close the modal */
  close: () => void
  /** Available variables from frontmatter */
  availableVariables: string[]
  /** Current if configuration */
  ifConfig: IfConfig
  /** Update if configuration */
  setIfConfig: (config: Partial<IfConfig>) => void
  /** Generate the if code to insert */
  generateIfCode: () => string
  /** Reset modal state */
  reset: () => void
  /** Preview of what will be generated */
  preview: string
}

const DEFAULT_IF_CONFIG: IfConfig = {
  variableName: '',
  operator: 'truthy',
  compareValue: '',
  contentTemplate: 'Content to show when condition is true',
}

/**
 * Extract all available variables from frontmatter data
 * Returns flattened paths for nested objects (e.g., "user.name", "user.age")
 */
function extractAvailableVariables(data: Record<string, any>): string[] {
  const variables: string[] = []

  function traverse(obj: any, prefix: string = '') {
    if (obj === null || obj === undefined) return

    if (Array.isArray(obj)) {
      // Add the array itself as a variable
      if (prefix) variables.push(prefix)
    } else if (typeof obj === 'object') {
      // Add nested object properties
      for (const key in obj) {
        const path = prefix ? `${prefix}.${key}` : key
        traverse(obj[key], path)
      }
    } else {
      // Scalar value
      if (prefix) variables.push(prefix)
    }
  }

  traverse(data)
  return variables.sort()
}

/**
 * Hook to manage the IF Insert Modal state and logic
 */
export function useIfModal(markdown: string): UseIfModalResult {
  const [isOpen, setIsOpen] = useState(false)
  const [ifConfig, setIfConfigState] = useState<IfConfig>(DEFAULT_IF_CONFIG)

  // Extract available variables from frontmatter
  const availableVariables = useMemo(() => {
    const { data } = parseFrontmatter(markdown)
    return extractAvailableVariables(data)
  }, [markdown])

  // Auto-select first available variable when modal opens
  const open = useCallback(() => {
    if (availableVariables.length > 0 && !ifConfig.variableName) {
      setIfConfigState((prev) => ({
        ...prev,
        variableName: availableVariables[0],
      }))
    }
    setIsOpen(true)
  }, [availableVariables, ifConfig.variableName])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const reset = useCallback(() => {
    setIfConfigState(DEFAULT_IF_CONFIG)
  }, [])

  const setIfConfig = useCallback((config: Partial<IfConfig>) => {
    setIfConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  // Generate the if code
  const generateIfCode = useCallback(() => {
    if (!ifConfig.variableName) return ''

    // Build the condition string based on operator
    let condition = ifConfig.variableName
    if (ifConfig.operator !== 'truthy' && ifConfig.operator !== 'not') {
      condition = `${ifConfig.variableName} ${ifConfig.operator} ${ifConfig.compareValue}`
    } else if (ifConfig.operator === 'not') {
      condition = `not ${ifConfig.variableName}`
    }

    return generateIfTemplate(condition, ifConfig.contentTemplate)
  }, [ifConfig])

  // Generate preview
  const preview = useMemo(() => {
    return generateIfCode()
  }, [generateIfCode])

  return {
    isOpen,
    open,
    close,
    availableVariables,
    ifConfig,
    setIfConfig,
    generateIfCode,
    reset,
    preview,
  }
}

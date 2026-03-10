import { useState, useCallback, useMemo } from 'react'
import {
  parseFrontmatter,
  extractArrayVariables,
  generateLoopTemplate,
  addArrayToFrontmatter,
} from '../utils/frontmatter'

export interface LoopConfig {
  /** The array variable name (e.g., "skills" or "jobs") */
  arrayName: string
  /** The iterator variable name (e.g., "skill" or "job") */
  iteratorName: string
  /** The template for each item */
  itemTemplate: string
}

export interface NewArrayConfig {
  /** Name of the new array */
  name: string
  /** Items in the array (one per line) */
  items: string[]
}

export interface UseLoopModalResult {
  /** Whether the modal is open */
  isOpen: boolean
  /** Open the modal */
  open: () => void
  /** Close the modal */
  close: () => void
  /** Available array variables from frontmatter */
  availableArrays: string[]
  /** Current loop configuration */
  loopConfig: LoopConfig
  /** Update loop configuration */
  setLoopConfig: (config: Partial<LoopConfig>) => void
  /** Whether creating a new array */
  isCreatingNewArray: boolean
  /** Toggle new array mode */
  setIsCreatingNewArray: (value: boolean) => void
  /** New array configuration */
  newArrayConfig: NewArrayConfig
  /** Update new array configuration */
  setNewArrayConfig: (config: Partial<NewArrayConfig>) => void
  /** Generate the loop code to insert */
  generateLoopCode: () => string
  /** Get updated markdown with new array if needed */
  getUpdatedMarkdown: () => string
  /** Reset modal state */
  reset: () => void
  /** Preview of what will be generated */
  preview: string
}

const DEFAULT_LOOP_CONFIG: LoopConfig = {
  arrayName: '',
  iteratorName: 'item',
  itemTemplate: '- {{item}}',
}

const DEFAULT_NEW_ARRAY_CONFIG: NewArrayConfig = {
  name: '',
  items: [],
}

/**
 * Hook to manage the Loop Insert Modal state and logic
 * Follows Single Responsibility Principle - only handles loop modal logic
 */
export function useLoopModal(markdown: string): UseLoopModalResult {
  const [isOpen, setIsOpen] = useState(false)
  const [loopConfig, setLoopConfigState] = useState<LoopConfig>(DEFAULT_LOOP_CONFIG)
  const [isCreatingNewArray, setIsCreatingNewArray] = useState(false)
  const [newArrayConfig, setNewArrayConfigState] =
    useState<NewArrayConfig>(DEFAULT_NEW_ARRAY_CONFIG)

  // Extract available arrays from frontmatter
  const availableArrays = useMemo(() => {
    const { data } = parseFrontmatter(markdown)
    return extractArrayVariables(data)
  }, [markdown])

  // Auto-select first available array when modal opens
  const open = useCallback(() => {
    if (availableArrays.length > 0 && !loopConfig.arrayName) {
      setLoopConfigState((prev) => ({
        ...prev,
        arrayName: availableArrays[0],
      }))
    }
    setIsOpen(true)
  }, [availableArrays, loopConfig.arrayName])

  const close = useCallback(() => {
    setIsOpen(false)
  }, [])

  const reset = useCallback(() => {
    setLoopConfigState(DEFAULT_LOOP_CONFIG)
    setNewArrayConfigState(DEFAULT_NEW_ARRAY_CONFIG)
    setIsCreatingNewArray(false)
  }, [])

  const setLoopConfig = useCallback((config: Partial<LoopConfig>) => {
    setLoopConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  const setNewArrayConfig = useCallback((config: Partial<NewArrayConfig>) => {
    setNewArrayConfigState((prev) => ({ ...prev, ...config }))
  }, [])

  // Generate the loop code
  const generateLoopCode = useCallback(() => {
    const arrayName = isCreatingNewArray ? newArrayConfig.name : loopConfig.arrayName
    if (!arrayName) return ''

    // Update template with correct iterator name
    const template = loopConfig.itemTemplate.replace(
      /\{\{item\}\}/g,
      `{{${loopConfig.iteratorName}}}`
    )

    return generateLoopTemplate(arrayName, loopConfig.iteratorName, template)
  }, [isCreatingNewArray, newArrayConfig.name, loopConfig])

  // Get updated markdown with new array added to frontmatter if needed
  const getUpdatedMarkdown = useCallback(() => {
    if (isCreatingNewArray && newArrayConfig.name && newArrayConfig.items.length > 0) {
      return addArrayToFrontmatter(markdown, newArrayConfig.name, newArrayConfig.items)
    }
    return markdown
  }, [isCreatingNewArray, newArrayConfig, markdown])

  // Generate preview
  const preview = useMemo(() => {
    return generateLoopCode()
  }, [generateLoopCode])

  return {
    isOpen,
    open,
    close,
    availableArrays,
    loopConfig,
    setLoopConfig,
    isCreatingNewArray,
    setIsCreatingNewArray,
    newArrayConfig,
    setNewArrayConfig,
    generateLoopCode,
    getUpdatedMarkdown,
    reset,
    preview,
  }
}

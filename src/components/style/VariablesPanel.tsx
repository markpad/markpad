import { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { FaMagic, FaPlus, FaTrash, FaChevronDown, FaChevronRight } from 'react-icons/fa'
import { parseFrontmatter } from '../../utils/frontmatter'
import {
  parseVariableDefinitions,
  getDefaultValues,
  type VariableDefinitions,
  type VariableValues,
  type VariableValue,
  type ObjectFieldSchema,
} from '../published/variableTypes'
import yaml from 'js-yaml'

interface VariablesPanelProps {
  markdown: string
  onMarkdownChange: (markdown: string) => void
}

/**
 * Variables sidebar panel for the editor
 * Allows editing frontmatter variables with a friendly UI
 */
export function VariablesPanel({ markdown, onMarkdownChange }: VariablesPanelProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, Set<number>>>({})
  const isUpdatingFromMarkdown = useRef(false)

  // Parse frontmatter and variable definitions
  const { content, data } = useMemo(() => parseFrontmatter(markdown), [markdown])
  const definitions = useMemo(() => parseVariableDefinitions(data), [data])
  const [localValues, setLocalValues] = useState<VariableValues>(() =>
    definitions ? getDefaultValues(definitions) : {}
  )

  // Sync local values when markdown changes externally
  useEffect(() => {
    if (definitions && !isUpdatingFromMarkdown.current) {
      setLocalValues(getDefaultValues(definitions))
    }
    isUpdatingFromMarkdown.current = false
  }, [definitions])

  // Update frontmatter in markdown
  const updateFrontmatter = useCallback(
    (newValues: VariableValues) => {
      isUpdatingFromMarkdown.current = true

      // Merge new values with existing frontmatter data
      const updatedData = { ...data }
      for (const [key, value] of Object.entries(newValues)) {
        updatedData[key] = value
      }

      // Rebuild markdown with updated frontmatter
      const yamlString = yaml.dump(updatedData, { indent: 2, lineWidth: -1 })
      const newMarkdown = `---\n${yamlString}---\n${content}`

      onMarkdownChange(newMarkdown)
    },
    [data, content, onMarkdownChange]
  )

  // Debounced update to markdown
  useEffect(() => {
    if (!definitions) return

    const timeoutId = setTimeout(() => {
      updateFrontmatter(localValues)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [localValues]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleValueChange = useCallback((key: string, value: VariableValue) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  // List handlers
  const handleListItemChange = useCallback(
    (key: string, index: number, newValue: string) => {
      const currentList = (localValues[key] as string[]) || []
      const newList = [...currentList]
      newList[index] = newValue
      handleValueChange(key, newList)
    },
    [localValues, handleValueChange]
  )

  const handleAddListItem = useCallback(
    (key: string) => {
      const currentList = (localValues[key] as string[]) || []
      handleValueChange(key, [...currentList, ''])
    },
    [localValues, handleValueChange]
  )

  const handleRemoveListItem = useCallback(
    (key: string, index: number) => {
      const currentList = (localValues[key] as string[]) || []
      handleValueChange(
        key,
        currentList.filter((_, i) => i !== index)
      )
    },
    [localValues, handleValueChange]
  )

  // Object list handlers
  const handleObjectListFieldChange = useCallback(
    (key: string, itemIndex: number, fieldKey: string, fieldValue: string | number | boolean) => {
      const currentList = (localValues[key] as Record<string, unknown>[]) || []
      const newList = currentList.map((item, idx) =>
        idx === itemIndex ? { ...item, [fieldKey]: fieldValue } : item
      )
      handleValueChange(key, newList)
    },
    [localValues, handleValueChange]
  )

  const handleAddObjectListItem = useCallback(
    (key: string, schema: ObjectFieldSchema[]) => {
      const currentList = (localValues[key] as Record<string, unknown>[]) || []
      const newItem: Record<string, unknown> = {}
      for (const field of schema) {
        newItem[field.key] = field.type === 'number' ? 0 : field.type === 'boolean' ? false : ''
      }
      handleValueChange(key, [...currentList, newItem])
      setExpandedItems((prev) => ({
        ...prev,
        [key]: new Set([...Array.from(prev[key] || []), currentList.length]),
      }))
    },
    [localValues, handleValueChange]
  )

  const handleRemoveObjectListItem = useCallback(
    (key: string, index: number) => {
      const currentList = (localValues[key] as Record<string, unknown>[]) || []
      handleValueChange(
        key,
        currentList.filter((_, i) => i !== index)
      )
      setExpandedItems((prev) => {
        const newSet = new Set(prev[key])
        newSet.delete(index)
        return { ...prev, [key]: newSet }
      })
    },
    [localValues, handleValueChange]
  )

  const toggleItemExpanded = useCallback((key: string, index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev[key] || [])
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return { ...prev, [key]: newSet }
    })
  }, [])

  const renderField = (key: string, def: VariableDefinitions[string]) => {
    const value = localValues[key]

    const baseInputClasses =
      'w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-400'

    switch (def.type) {
      case 'text':
        return (
          <input
            type="text"
            value={String(value || '')}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className={baseInputClasses}
          />
        )

      case 'textarea':
        return (
          <textarea
            value={String(value || '')}
            onChange={(e) => handleValueChange(key, e.target.value)}
            className={`${baseInputClasses} resize-none`}
            rows={3}
          />
        )

      case 'number':
        return (
          <input
            type="number"
            value={value as number}
            onChange={(e) => handleValueChange(key, parseFloat(e.target.value) || 0)}
            className={baseInputClasses}
          />
        )

      case 'boolean':
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={Boolean(value)}
                onChange={(e) => handleValueChange(key, e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  value ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <span className="text-gray-700 dark:text-gray-300">{value ? 'Yes' : 'No'}</span>
          </label>
        )

      case 'list':
        const listValue = (value as string[]) || []
        return (
          <div className="space-y-2">
            {listValue.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleListItemChange(key, index, e.target.value)}
                  className={`${baseInputClasses} flex-1`}
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => handleRemoveListItem(key, index)}
                  className="p-2 rounded-md transition-colors text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Remove item"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddListItem(key)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaPlus className="w-3 h-3" />
              Add Item
            </button>
          </div>
        )

      case 'object-list':
        const objectListValue = (value as Record<string, unknown>[]) || []
        const schema = def.schema || []
        const expanded = expandedItems[key] || new Set()

        const getItemPreview = (item: Record<string, unknown>): string => {
          const firstTextField = schema.find((f) => f.type === 'text')
          if (firstTextField && item[firstTextField.key]) {
            return String(item[firstTextField.key])
          }
          return 'Item'
        }

        return (
          <div className="space-y-2">
            {objectListValue.map((item, index) => {
              const isExpanded = expanded.has(index)
              return (
                <div
                  key={index}
                  className="border rounded-lg overflow-hidden border-gray-300 dark:border-gray-600"
                >
                  <div
                    className="flex items-center justify-between px-3 py-2 cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-650"
                    onClick={() => toggleItemExpanded(key, index)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <FaChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <FaChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {getItemPreview(item)} <span className="text-gray-400">#{index + 1}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveObjectListItem(key, index)
                      }}
                      className="p-1.5 rounded-md transition-colors text-red-500 hover:bg-gray-200 dark:hover:bg-gray-600"
                      title="Remove item"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-3 space-y-3 bg-white dark:bg-gray-800">
                      {schema.map((field) => (
                        <div key={field.key}>
                          <label className="block text-xs font-medium mb-1 text-gray-600 dark:text-gray-300">
                            {field.label}
                          </label>
                          {field.type === 'boolean' ? (
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(item[field.key])}
                                onChange={(e) =>
                                  handleObjectListFieldChange(
                                    key,
                                    index,
                                    field.key,
                                    e.target.checked
                                  )
                                }
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              />
                              <span className="text-sm text-gray-700 dark:text-gray-300">
                                {item[field.key] ? 'Yes' : 'No'}
                              </span>
                            </label>
                          ) : field.type === 'textarea' ? (
                            <textarea
                              value={String(item[field.key] || '')}
                              onChange={(e) =>
                                handleObjectListFieldChange(key, index, field.key, e.target.value)
                              }
                              className={`${baseInputClasses} resize-none text-sm`}
                              rows={2}
                            />
                          ) : field.type === 'number' ? (
                            <input
                              type="number"
                              value={item[field.key] as number}
                              onChange={(e) =>
                                handleObjectListFieldChange(
                                  key,
                                  index,
                                  field.key,
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={`${baseInputClasses} text-sm`}
                            />
                          ) : (
                            <input
                              type="text"
                              value={String(item[field.key] || '')}
                              onChange={(e) =>
                                handleObjectListFieldChange(key, index, field.key, e.target.value)
                              }
                              className={`${baseInputClasses} text-sm`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
            <button
              onClick={() => handleAddObjectListItem(key, schema)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FaPlus className="w-3 h-3" />
              Add {def.label.replace(/s$/, '')}
            </button>
          </div>
        )

      default:
        return null
    }
  }

  if (!definitions || Object.keys(definitions).length === 0) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FaMagic className="text-purple-500" />
            Variables
          </h2>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <FaMagic className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">No variables detected</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 max-w-xs">
              Add variables to your frontmatter to enable editing here. Example:
            </p>
            <pre className="mt-3 text-xs text-left bg-gray-100 dark:bg-gray-900 p-3 rounded-md text-gray-700 dark:text-gray-300">
              {`---
name: John Doe
title: Developer
skills:
  - Python
  - TypeScript
---`}
            </pre>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <FaMagic className="text-purple-500" />
          Variables
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Edit frontmatter variables with live preview
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Object.entries(definitions).map(([key, def]) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-200">
              {def.label}
            </label>
            {renderField(key, def)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default VariablesPanel

import { useState, useCallback, useEffect, useRef } from 'react'
import {
  FaTimes,
  FaRedo,
  FaMagic,
  FaPlus,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import type {
  VariableDefinitions,
  VariableValues,
  VariableValue,
  ObjectFieldSchema,
} from './variableTypes'
import { getDefaultValues } from './variableTypes'

interface VariableWizardProps {
  definitions: VariableDefinitions
  values: VariableValues
  onChange: (values: VariableValues) => void
  onClose: () => void
  darkMode?: boolean
}

export function VariableWizard({
  definitions,
  values,
  onChange,
  onClose,
  darkMode = false,
}: VariableWizardProps) {
  const [localValues, setLocalValues] = useState<VariableValues>({ ...values })
  const [expandedItems, setExpandedItems] = useState<Record<string, Set<number>>>({})
  const isFirstRender = useRef(true)

  // Auto-apply changes with debounce
  useEffect(() => {
    // Skip first render to avoid unnecessary URL update on load
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const timeoutId = setTimeout(() => {
      onChange(localValues)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [localValues, onChange])

  const handleValueChange = useCallback((key: string, value: VariableValue) => {
    setLocalValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }, [])

  const handleReset = useCallback(() => {
    const defaults = getDefaultValues(definitions)
    setLocalValues(defaults)
    // Apply immediately on reset
    onChange(defaults)
  }, [definitions, onChange])

  // Handle list item changes
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
      // Expand the new item
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
      // Clean up expanded state
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

    const baseInputClasses = `w-full px-3 py-2 rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      darkMode
        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
    }`

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
            rows={4}
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
                  value ? 'bg-blue-500' : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    value ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
              {value ? 'Yes' : 'No'}
            </span>
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
                  className={`p-2 rounded-md transition-colors ${
                    darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'
                  }`}
                  title="Remove item"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            ))}
            <button
              onClick={() => handleAddListItem(key)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
              }`}
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

        // Get a preview label for collapsed items (first text field)
        const getItemPreview = (item: Record<string, unknown>): string => {
          const firstTextField = schema.find((f) => f.type === 'text')
          if (firstTextField && item[firstTextField.key]) {
            return String(item[firstTextField.key])
          }
          return `Item`
        }

        return (
          <div className="space-y-2">
            {objectListValue.map((item, index) => {
              const isExpanded = expanded.has(index)
              return (
                <div
                  key={index}
                  className={`border rounded-lg overflow-hidden ${
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                >
                  {/* Item Header - Collapsible */}
                  <div
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer ${
                      darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    onClick={() => toggleItemExpanded(key, index)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <FaChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <FaChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                      <span
                        className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                      >
                        {getItemPreview(item)} <span className="text-gray-400">#{index + 1}</span>
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleRemoveObjectListItem(key, index)
                      }}
                      className={`p-1.5 rounded-md transition-colors ${
                        darkMode
                          ? 'text-red-400 hover:bg-gray-600'
                          : 'text-red-500 hover:bg-gray-200'
                      }`}
                      title="Remove item"
                    >
                      <FaTrash className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Item Fields - Expandable */}
                  {isExpanded && (
                    <div className={`p-3 space-y-3 ${darkMode ? 'bg-gray-750' : 'bg-white'}`}>
                      {schema.map((field) => (
                        <div key={field.key}>
                          <label
                            className={`block text-xs font-medium mb-1 ${
                              darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                          >
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
                              <span
                                className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                              >
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
                              rows={3}
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
              className={`flex items-center gap-2 px-3 py-1.5 text-sm rounded-md transition-colors ${
                darkMode ? 'text-blue-400 hover:bg-gray-700' : 'text-blue-600 hover:bg-gray-100'
              }`}
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

  return (
    <div
      className={`flex flex-col h-full ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <FaMagic className="text-blue-500" />
          <h2 className="font-semibold">Customize Document</h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-md transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <FaTimes className="w-4 h-4" />
        </button>
      </div>

      {/* Form Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {Object.entries(definitions).map(([key, def]) => (
          <div key={key}>
            <label
              className={`block text-sm font-medium mb-1.5 ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              {def.label}
            </label>
            {renderField(key, def)}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div
        className={`flex items-center justify-end px-4 py-3 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <button
          onClick={handleReset}
          className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
            darkMode
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <FaRedo className="w-3 h-3" />
          Reset to defaults
        </button>
      </div>
    </div>
  )
}

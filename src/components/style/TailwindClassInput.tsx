import { useRef, useEffect } from 'react'
import { useTailwindAutocomplete } from '@/hooks/useTailwindAutocomplete'
import { FaTimes } from 'react-icons/fa'

interface TailwindClassInputProps {
  label: string
  value: string
  onChange: (value: string) => void
}

/**
 * Input component with Tailwind class autocomplete
 * Features fuzzy search and keyboard navigation
 */
export function TailwindClassInput({ label, value, onChange }: TailwindClassInputProps) {
  const {
    inputValue,
    setInputValue,
    suggestions,
    selectedIndex,
    isOpen,
    setIsOpen,
    handleKeyDown,
    selectSuggestion,
    removeClass,
    currentClasses,
    inputRef,
  } = useTailwindAutocomplete({ value, onChange })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll selected item into view
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex] as HTMLElement
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex, isOpen])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside the entire container (input + dropdown)
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsOpen])

  return (
    <div className="mb-3">
      <label className="block text-gray-700 dark:text-gray-300 text-sm mb-1.5">{label}</label>
      <div className="relative" ref={containerRef}>
        <div className="flex flex-wrap gap-1 p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md min-h-[42px] focus-within:border-blue-500 dark:focus-within:border-blue-400 transition-colors">
          {/* Selected classes as tags */}
          {currentClasses.map((cls, index) => (
            <span
              key={`${cls}-${index}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 text-xs rounded"
            >
              {cls}
              <button
                type="button"
                onClick={() => {
                  removeClass(cls)
                }}
                className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <FaTimes className="text-[10px]" />
              </button>
            </span>
          ))}

          {/* Input field */}
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setIsOpen(true)
            }}
            onFocus={() => {
              setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[100px] bg-transparent text-gray-800 dark:text-gray-200 text-sm outline-none placeholder-gray-400 dark:placeholder-gray-500"
            placeholder={currentClasses.length === 0 ? 'Type to search classes...' : ''}
          />
        </div>

        {/* Suggestions dropdown */}
        {isOpen && suggestions.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto z-50"
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.value}
                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-blue-600 dark:bg-blue-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onMouseDown={(e) => {
                  e.preventDefault() // Prevent input blur
                  selectSuggestion(suggestion)
                }}
              >
                <span className="font-mono">{suggestion.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TailwindClassInput

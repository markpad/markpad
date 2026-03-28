import { useState, useCallback, useMemo, useRef, useEffect, type KeyboardEvent } from 'react'
import allTailwindClassesList from '@/tailwindClasses'
import type { SelectOption } from '@/types'

interface UseTailwindAutocompleteProps {
  value: string
  onChange: (value: string) => void
}

interface UseTailwindAutocompleteReturn {
  inputValue: string
  setInputValue: (value: string) => void
  suggestions: SelectOption[]
  selectedIndex: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  selectSuggestion: (suggestion: SelectOption) => void
  removeClass: (classToRemove: string) => void
  currentClasses: string[]
  inputRef: React.RefObject<HTMLInputElement>
}

/**
 * Custom hook for Tailwind class autocomplete functionality
 * Provides fuzzy search and keyboard navigation
 */
export function useTailwindAutocomplete({
  value,
  onChange,
}: UseTailwindAutocompleteProps): UseTailwindAutocompleteReturn {
  const [inputValue, setInputValue] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Parse current classes from value string
  const currentClasses = useMemo(() => {
    return value
      .split(' ')
      .map((c) => c.trim())
      .filter(Boolean)
  }, [value])

  // Clean and normalize Tailwind classes list for searching
  const normalizedClasses = useMemo(() => {
    return allTailwindClassesList.map((cls) => {
      // Remove description suffixes like " / .ease-*"
      const cleanCls = cls.split(' / ')[0].trim()
      return {
        value: cleanCls,
        label: cleanCls,
        original: cls,
      }
    })
  }, [])

  // Filter suggestions based on input
  const suggestions = useMemo(() => {
    if (inputValue.trim() === '') {
      return normalizedClasses.slice(0, 20)
    }

    const search = inputValue.toLowerCase()

    // Score-based fuzzy matching
    const scored = normalizedClasses
      .map((option) => {
        const label = option.label.toLowerCase()
        let score = 0

        // Exact match gets highest score
        if (label === search) {
          score = 1000
        } else if (label.startsWith(search)) {
          // Starts with gets high score
          score = 500 + (100 - label.length)
        } else if (label.includes(search)) {
          // Contains gets medium score
          score = 200 + (100 - label.indexOf(search))
        } else {
          // Fuzzy match (characters in order) gets lower score
          let searchIdx = 0
          for (let i = 0; i < label.length && searchIdx < search.length; i++) {
            if (label[i] === search[searchIdx]) {
              searchIdx++
              score += 10
            }
          }
          if (searchIdx < search.length) {
            score = 0 // Not all characters matched
          }
        }

        return { ...option, score }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)

    return scored
  }, [inputValue, normalizedClasses])

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0)
  }, [suggestions])

  const selectSuggestion = useCallback(
    (suggestion: SelectOption) => {
      const newClasses = [...currentClasses, suggestion.value].join(' ')
      onChange(newClasses)
      setInputValue('')
      setIsOpen(false)
      inputRef.current?.focus()
    },
    [currentClasses, onChange]
  )

  const removeClass = useCallback(
    (classToRemove: string) => {
      const newClasses = currentClasses.filter((c) => c !== classToRemove).join(' ')
      onChange(newClasses)
    },
    [currentClasses, onChange]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1))
          setIsOpen(true)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (isOpen && suggestions.length > 0 && suggestions[selectedIndex] !== undefined) {
            selectSuggestion(suggestions[selectedIndex])
          } else if (inputValue.trim() !== '') {
            // Allow custom class input
            selectSuggestion({ value: inputValue.trim(), label: inputValue.trim() })
          }
          break
        case 'Escape':
          setIsOpen(false)
          setInputValue('')
          break
        case 'Backspace':
          if (inputValue === '' && currentClasses.length > 0) {
            removeClass(currentClasses[currentClasses.length - 1])
          }
          break
        case 'Tab':
          if (isOpen && suggestions.length > 0 && suggestions[selectedIndex] !== undefined) {
            e.preventDefault()
            selectSuggestion(suggestions[selectedIndex])
          }
          break
      }
    },
    [suggestions, selectedIndex, isOpen, inputValue, currentClasses, selectSuggestion, removeClass]
  )

  return {
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
  }
}

import { useCallback, useRef, useState, useEffect, type ChangeEvent, type RefObject } from 'react'

interface UseMarkdownEditorProps {
  markdown: string
  setMarkdown: (markdown: string) => void
}

interface UseMarkdownEditorReturn {
  textareaRef: RefObject<HTMLTextAreaElement>
  handleChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
  insertText: (text: string, options?: InsertOptions) => void
  wrapSelection: (prefix: string, suffix: string) => void
  setCursorPosition: (position: number) => void
  getCursorPosition: () => number
}

interface InsertOptions {
  /** Position cursor inside the inserted text at this offset from start */
  cursorOffset?: number
  /** Replace current selection with wrapper */
  replaceSelection?: boolean
}

/**
 * Custom hook for managing markdown editor with proper cursor handling
 * Fixes: https://github.com/teles/marklab/issues/5
 * The cursor now correctly positions after text insertion
 */
export function useMarkdownEditor({
  markdown,
  setMarkdown,
}: UseMarkdownEditorProps): UseMarkdownEditorReturn {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [pendingCursorPosition, setPendingCursorPosition] = useState<number | null>(null)

  // Handle pending cursor position after state update
  useEffect(() => {
    if (pendingCursorPosition !== null && textareaRef.current !== null) {
      const textarea = textareaRef.current
      // Use requestAnimationFrame to ensure DOM is updated
      requestAnimationFrame(() => {
        textarea.focus()
        textarea.setSelectionRange(pendingCursorPosition, pendingCursorPosition)
        setPendingCursorPosition(null)
      })
    }
  }, [markdown, pendingCursorPosition])

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value)
    },
    [setMarkdown]
  )

  /**
   * Insert text at cursor position with proper cursor handling
   */
  const insertText = useCallback(
    (textToInsert: string, options: InsertOptions = {}) => {
      const textarea = textareaRef.current
      if (textarea === null) return

      const { selectionStart, selectionEnd } = textarea
      const { cursorOffset, replaceSelection = false } = options

      // Build new text
      const before = markdown.substring(0, selectionStart)
      const after = markdown.substring(replaceSelection ? selectionEnd : selectionStart)
      const newText = before + textToInsert + after

      // Calculate new cursor position
      let newCursorPosition: number
      if (cursorOffset !== undefined) {
        newCursorPosition = selectionStart + cursorOffset
      } else {
        newCursorPosition = selectionStart + textToInsert.length
      }

      // Update markdown and schedule cursor position update
      setMarkdown(newText)
      setPendingCursorPosition(newCursorPosition)
    },
    [markdown, setMarkdown]
  )

  /**
   * Wrap selected text with prefix and suffix
   */
  const wrapSelection = useCallback(
    (prefix: string, suffix: string) => {
      const textarea = textareaRef.current
      if (textarea === null) return

      const { selectionStart, selectionEnd } = textarea
      const selectedText = markdown.substring(selectionStart, selectionEnd)

      const wrappedText = prefix + selectedText + suffix
      const before = markdown.substring(0, selectionStart)
      const after = markdown.substring(selectionEnd)
      const newText = before + wrappedText + after

      // Position cursor after the wrapped text (or at start of suffix if no selection)
      const newCursorPosition =
        selectionStart === selectionEnd
          ? selectionStart + prefix.length // No selection: cursor after prefix
          : selectionEnd + prefix.length + suffix.length // Selection: cursor at end

      setMarkdown(newText)
      setPendingCursorPosition(newCursorPosition)
    },
    [markdown, setMarkdown]
  )

  const setCursorPosition = useCallback((position: number) => {
    setPendingCursorPosition(position)
  }, [])

  const getCursorPosition = useCallback(() => {
    return textareaRef.current?.selectionStart ?? 0
  }, [])

  return {
    textareaRef,
    handleChange,
    insertText,
    wrapSelection,
    setCursorPosition,
    getCursorPosition,
  }
}

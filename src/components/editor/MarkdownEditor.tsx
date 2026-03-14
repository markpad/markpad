import { useCallback, useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import Editor from 'react-simple-code-editor'
import { highlightMarkdown } from '../../utils/markdownHighlight'

export interface MarkdownEditorHandle {
  insertHeading: (level: 1 | 2 | 3) => void
  insertBold: () => void
  insertItalic: () => void
  insertLink: () => void
  insertImage: () => void
  insertUnorderedList: () => void
  insertOrderedList: () => void
  insertQuote: () => void
  insertTable: () => void
  insertText: (text: string) => void
  setCursorPosition: (position: number) => void
  getCursorPosition: () => number
}

interface MarkdownEditorProps {
  markdown: string
  setMarkdown: (markdown: string) => void
  showLineNumbers?: boolean
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void
}

/**
 * Markdown editor component with syntax highlighting
 * Uses react-simple-code-editor for colorful syntax highlighting
 */
export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  function MarkdownEditor({ markdown, setMarkdown, showLineNumbers = true, onScroll }, ref) {
    const editorRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Find and store the textarea reference inside the editor
    useEffect(() => {
      if (editorRef.current) {
        const textarea = editorRef.current.querySelector('textarea')
        if (textarea) {
          textareaRef.current = textarea
        }
      }
    }, [])

    // Insert text at cursor position
    const insertText = useCallback(
      (text: string, options: { cursorOffset?: number } = {}) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const { selectionStart, selectionEnd } = textarea
        const before = markdown.substring(0, selectionStart)
        const after = markdown.substring(selectionEnd)
        const newText = before + text + after

        setMarkdown(newText)

        // Set cursor position after state update
        requestAnimationFrame(() => {
          const newPos =
            options.cursorOffset !== undefined
              ? selectionStart + options.cursorOffset
              : selectionStart + text.length
          textarea.focus()
          textarea.setSelectionRange(newPos, newPos)
        })
      },
      [markdown, setMarkdown]
    )

    // Wrap selected text
    const wrapSelection = useCallback(
      (prefix: string, suffix: string) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const { selectionStart, selectionEnd } = textarea
        const selectedText = markdown.substring(selectionStart, selectionEnd)
        const wrappedText = prefix + selectedText + suffix
        const before = markdown.substring(0, selectionStart)
        const after = markdown.substring(selectionEnd)

        setMarkdown(before + wrappedText + after)

        requestAnimationFrame(() => {
          const newPos = selectionStart + prefix.length + selectedText.length + suffix.length
          textarea.focus()
          textarea.setSelectionRange(newPos, newPos)
        })
      },
      [markdown, setMarkdown]
    )

    // Expose formatting methods to parent via ref
    useImperativeHandle(ref, () => ({
      insertHeading: (level: 1 | 2 | 3) => {
        const prefix = '#'.repeat(level) + ' '
        insertText(`\n${prefix}`)
      },
      insertBold: () => wrapSelection('**', '**'),
      insertItalic: () => wrapSelection('*', '*'),
      insertLink: () => insertText('[text](url)', { cursorOffset: 1 }),
      insertImage: () => insertText('![alt](url)', { cursorOffset: 2 }),
      insertUnorderedList: () => insertText('\n- '),
      insertOrderedList: () => insertText('\n1. '),
      insertQuote: () => insertText('\n> '),
      insertTable: () =>
        insertText('\n| Column 1 | Column 2 |\n|----------|----------|\n| Value 1  | Value 2  |\n'),
      insertText: (text: string) => insertText(text),
      setCursorPosition: (position: number) => {
        const textarea = textareaRef.current
        if (textarea) {
          textarea.focus()
          textarea.setSelectionRange(position, position)
        }
      },
      getCursorPosition: () => {
        return textareaRef.current?.selectionStart ?? 0
      },
    }))

    // Calculate line numbers
    const lineCount = markdown.split('\n').length

    // Handle scroll to notify parent
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        if (onScroll) {
          onScroll(target.scrollTop, target.scrollHeight, target.clientHeight)
        }
      },
      [onScroll]
    )

    return (
      <div className="flex flex-col h-full bg-white dark:bg-gray-900">
        {/* Inject highlighting styles */}
        {/* Editor Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
            Editor
          </span>
        </div>

        {/* Editor Content */}
        <div className="flex flex-1 overflow-hidden">
          {showLineNumbers && (
            <div className="py-3 px-2 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-sm font-mono select-none border-r border-gray-200 dark:border-gray-700 min-w-[3rem] text-right overflow-hidden">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="leading-6 h-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <div
            ref={editorRef}
            className="flex-1 overflow-auto markdown-editor-container"
            onScroll={handleScroll}
          >
            <Editor
              value={markdown}
              onValueChange={setMarkdown}
              highlight={highlightMarkdown}
              padding={12}
              placeholder="Type your markdown here..."
              className="min-h-full"
              textareaClassName="outline-none"
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                fontSize: '14px',
                lineHeight: '24px',
                minHeight: '100%',
              }}
            />
          </div>
        </div>
      </div>
    )
  }
)

export default MarkdownEditor

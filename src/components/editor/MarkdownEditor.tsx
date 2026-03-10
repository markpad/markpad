import { useRef, useCallback, useImperativeHandle, forwardRef } from 'react'
import { useMarkdownEditor } from '../../hooks/useMarkdownEditor'

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
}

interface MarkdownEditorProps {
  markdown: string
  setMarkdown: (markdown: string) => void
  showLineNumbers?: boolean
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void
  scrollRef?: React.RefObject<HTMLDivElement>
}

/**
 * Markdown editor component with formatting capabilities
 * Follows Single Responsibility - handles only markdown editing
 */
export const MarkdownEditor = forwardRef<MarkdownEditorHandle, MarkdownEditorProps>(
  function MarkdownEditor(
    { markdown, setMarkdown, showLineNumbers = true, onScroll, scrollRef },
    ref
  ) {
    const { textareaRef, handleChange, insertText, wrapSelection } = useMarkdownEditor({
      markdown,
      setMarkdown,
    })

    const lineNumbersRef = useRef<HTMLDivElement>(null)
    const internalScrollRef = useRef<HTMLDivElement>(null)
    const activeScrollRef = scrollRef || internalScrollRef

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
    }))

    // Calculate line numbers
    const lineCount = markdown.split('\n').length

    // Handle scroll to sync line numbers and notify parent
    const handleScroll = useCallback(() => {
      const scrollContainer = activeScrollRef.current
      if (!scrollContainer) return

      // Sync line numbers with textarea scroll
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollContainer.scrollTop
      }

      // Notify parent for cross-panel sync
      if (onScroll) {
        onScroll(
          scrollContainer.scrollTop,
          scrollContainer.scrollHeight,
          scrollContainer.clientHeight
        )
      }
    }, [onScroll, activeScrollRef])

    return (
      <div className="flex flex-col h-full bg-white">
        {/* Editor Header */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-b border-gray-200">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Editor</span>
        </div>

        {/* Editor Content */}
        <div className="flex flex-1 overflow-hidden">
          {showLineNumbers && (
            <div
              ref={lineNumbersRef}
              className="flex flex-col items-end py-3 px-2 bg-gray-50 text-gray-400 text-sm font-mono select-none border-r border-gray-200 min-w-[3rem] overflow-hidden"
            >
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i} className="leading-6 h-6">
                  {i + 1}
                </div>
              ))}
            </div>
          )}
          <div ref={activeScrollRef} className="flex-1 overflow-auto" onScroll={handleScroll}>
            <textarea
              ref={textareaRef}
              value={markdown}
              onChange={handleChange}
              className="w-full h-full min-h-full bg-white text-gray-800 p-3 resize-none outline-none font-mono text-sm leading-6"
              placeholder="Type your markdown here..."
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    )
  }
)

export default MarkdownEditor

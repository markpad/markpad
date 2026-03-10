import { useState, useMemo, useRef, useCallback } from 'react'
import { Helmet } from 'react-helmet'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { useAppState } from '../hooks/useAppState'
import { useLoopModal } from '../hooks/useLoopModal'
import { Header } from './Header'
import { MarkdownEditor, MarkdownEditorHandle } from './editor/MarkdownEditor'
import { MarkdownPreview } from './preview/MarkdownPreview'
import { StylePanel } from './style/StylePanel'
import { LoopModal } from './LoopModal'
import type { EditionMode, TailwindClasses } from '../types'

interface EditorProps {
  initialMode?: EditionMode
  showStylePanelByDefault?: boolean
}

/**
 * Main editor layout component
 * Orchestrates all sub-components and manages layout state
 */
export function Editor({ initialMode = 'split', showStylePanelByDefault = true }: EditorProps) {
  const {
    state,
    setMarkdown,
    setDocumentTitle,
    updateTailwindClass,
    updateBehaviorConfig,
    updateFontConfig,
  } = useAppState()

  const [editionMode, setEditionMode] = useState<EditionMode>(initialMode)
  const [showStylePanel, setShowStylePanel] = useState(showStylePanelByDefault)

  // Loop modal hook
  const loopModal = useLoopModal(state.markdown)

  // Ref for editor formatting methods
  const editorRef = useRef<MarkdownEditorHandle>(null)

  // Refs for scroll synchronization
  const editorScrollRef = useRef<HTMLDivElement>(null)
  const previewScrollRef = useRef<HTMLDivElement>(null)
  const isScrolling = useRef<'editor' | 'preview' | null>(null)

  // Handle scroll sync between editor and preview
  const handleEditorScroll = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      if (isScrolling.current === 'preview') return
      isScrolling.current = 'editor'

      if (previewScrollRef.current) {
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
        const previewScrollHeight =
          previewScrollRef.current.scrollHeight - previewScrollRef.current.clientHeight
        previewScrollRef.current.scrollTop = scrollPercentage * previewScrollHeight
      }

      requestAnimationFrame(() => {
        isScrolling.current = null
      })
    },
    []
  )

  const handlePreviewScroll = useCallback(
    (scrollTop: number, scrollHeight: number, clientHeight: number) => {
      if (isScrolling.current === 'editor') return
      isScrolling.current = 'preview'

      if (editorScrollRef.current) {
        const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
        const editorScrollHeight =
          editorScrollRef.current.scrollHeight - editorScrollRef.current.clientHeight
        editorScrollRef.current.scrollTop = scrollPercentage * editorScrollHeight
      }

      requestAnimationFrame(() => {
        isScrolling.current = null
      })
    },
    []
  )

  // Generate HTML content for export
  const htmlContent = useMemo(() => {
    const components = {
      h1: ({ node, ...props }: any) => <h1 {...props} className={state.tailwindClasses.h1} />,
      h2: ({ node, ...props }: any) => <h2 {...props} className={state.tailwindClasses.h2} />,
      h3: ({ node, ...props }: any) => <h3 {...props} className={state.tailwindClasses.h3} />,
      h4: ({ node, ...props }: any) => <h4 {...props} className={state.tailwindClasses.h4} />,
      h5: ({ node, ...props }: any) => <h5 {...props} className={state.tailwindClasses.h5} />,
      h6: ({ node, ...props }: any) => <h6 {...props} className={state.tailwindClasses.h6} />,
      p: ({ node, ...props }: any) => <p className={state.tailwindClasses.p} {...props} />,
      a: ({ node, ...props }: any) => (
        <a
          className={state.tailwindClasses.a}
          {...props}
          target={state.behaviorConfig.shouldOpenLinksInNewTab ? '_blank' : undefined}
        />
      ),
      img: ({ node, ...props }: any) => (
        <img alt="" className={state.tailwindClasses.img} {...props} />
      ),
      table: ({ node, ...props }: any) => (
        <table className={state.tailwindClasses.table} {...props} />
      ),
      ul: ({ node, ...props }: any) => <ul className={state.tailwindClasses.ul} {...props} />,
      ol: ({ node, ...props }: any) => <ol className={state.tailwindClasses.ol} {...props} />,
      li: ({ node, ...props }: any) => <li className={state.tailwindClasses.li} {...props} />,
      strong: ({ node, ...props }: any) => (
        <strong className={state.tailwindClasses.strong} {...props} />
      ),
      em: ({ node, ...props }: any) => <em className={state.tailwindClasses.em} {...props} />,
      tr: ({ node, ...props }: any) => <tr className={state.tailwindClasses.tr} {...props} />,
      td: ({ node, ...props }: any) => <td className={state.tailwindClasses.td} {...props} />,
      th: ({ node, ...props }: any) => <th className={state.tailwindClasses.th} {...props} />,
      blockquote: ({ node, ...props }: any) => (
        <blockquote className={state.tailwindClasses.blockquote} {...props} />
      ),
      code: ({ node, ...props }: any) => <code className={state.tailwindClasses.code} {...props} />,
      pre: ({ node, ...props }: any) => <pre className={state.tailwindClasses.pre} {...props} />,
    }

    return renderToStaticMarkup(
      <article className={state.tailwindClasses.article}>
        <Markdown components={components} remarkPlugins={[gfm]}>
          {state.markdown}
        </Markdown>
      </article>
    )
  }, [state.markdown, state.tailwindClasses, state.behaviorConfig.shouldOpenLinksInNewTab])

  const handleTailwindClassChange = (element: keyof TailwindClasses, value: string) => {
    updateTailwindClass(element, value)
  }

  // Handle loop insertion
  const handleInsertLoop = useCallback(
    (loopCode: string, updatedMarkdown: string) => {
      // If markdown was updated (new array added), update it first
      if (updatedMarkdown !== state.markdown) {
        setMarkdown(updatedMarkdown)
      }
      // Insert the loop code at cursor position (or end if no editor ref)
      editorRef.current?.insertText?.('\n' + loopCode + '\n')
    },
    [state.markdown, setMarkdown]
  )

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Helmet>
        <title>Marklab - Markdown Editor with Tailwind CSS</title>
        <meta
          name="description"
          content="Markdown editor with customizable Tailwind CSS classes."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <Header
        state={state}
        editionMode={editionMode}
        onEditionModeChange={setEditionMode}
        htmlContent={htmlContent}
        onDocumentTitleChange={setDocumentTitle}
        onInsertHeading={(level) => editorRef.current?.insertHeading(level)}
        onInsertBold={() => editorRef.current?.insertBold()}
        onInsertItalic={() => editorRef.current?.insertItalic()}
        onInsertLink={() => editorRef.current?.insertLink()}
        onInsertImage={() => editorRef.current?.insertImage()}
        onInsertUnorderedList={() => editorRef.current?.insertUnorderedList()}
        onInsertOrderedList={() => editorRef.current?.insertOrderedList()}
        onInsertQuote={() => editorRef.current?.insertQuote()}
        onInsertTable={() => editorRef.current?.insertTable()}
        onInsertLoop={() => loopModal.open()}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Editor Panel */}
          {(editionMode === 'edit' || editionMode === 'split') && (
            <div
              className={`${editionMode === 'split' ? 'w-1/2' : 'flex-1'} border-r border-gray-300`}
            >
              <MarkdownEditor
                ref={editorRef}
                markdown={state.markdown}
                setMarkdown={setMarkdown}
                showLineNumbers={state.behaviorConfig.shouldShowLineNumbers}
                onScroll={editionMode === 'split' ? handleEditorScroll : undefined}
                scrollRef={editorScrollRef}
              />
            </div>
          )}

          {/* Preview Panel */}
          {(editionMode === 'preview' || editionMode === 'split') && (
            <div className={`${editionMode === 'split' ? 'w-1/2' : 'flex-1'}`}>
              <MarkdownPreview
                markdown={state.markdown}
                tailwindClasses={state.tailwindClasses}
                behaviorConfig={state.behaviorConfig}
                fontConfig={state.fontConfig}
                onScroll={editionMode === 'split' ? handlePreviewScroll : undefined}
                scrollRef={previewScrollRef}
              />
            </div>
          )}
        </div>

        {/* Style Panel Toggle Button */}
        <button
          className={`absolute right-0 top-1/2 transform -translate-y-1/2 z-10 px-1 py-4 bg-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-300 rounded-l-md transition-all ${
            showStylePanel ? 'right-[320px]' : 'right-0'
          }`}
          onClick={() => {
            setShowStylePanel(!showStylePanel)
          }}
          style={{ right: showStylePanel ? '320px' : '0' }}
        >
          {showStylePanel ? '›' : '‹'}
        </button>

        {/* Style Panel */}
        {showStylePanel && (
          <div className="w-80 border-l border-gray-300 flex-shrink-0">
            <StylePanel
              tailwindClasses={state.tailwindClasses}
              behaviorConfig={state.behaviorConfig}
              fontConfig={state.fontConfig}
              onTailwindClassChange={handleTailwindClassChange}
              onBehaviorConfigChange={updateBehaviorConfig}
              onFontConfigChange={updateFontConfig}
            />
          </div>
        )}
      </div>

      {/* Loop Modal */}
      <LoopModal loopModal={loopModal} onInsertLoop={handleInsertLoop} />
    </div>
  )
}

export default Editor

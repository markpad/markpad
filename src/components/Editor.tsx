import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Tooltip } from 'react-tooltip'
import { FaPalette, FaTimes, FaDownload } from 'react-icons/fa'
import { useAppState } from '../hooks/useAppState'
import { processMarkdownWithFrontmatter } from '../utils/frontmatter'
import { useLoopModal } from '../hooks/useLoopModal'
import { Header } from './Header'
import { MarkdownEditor, MarkdownEditorHandle } from './editor/MarkdownEditor'
import { MarkdownPreview } from './preview/MarkdownPreview'
import { StylePanel } from './style/StylePanel'
import { ExportPanel } from './style/ExportPanel'
import { LoopModal } from './LoopModal'
import type { EditionMode, TailwindClasses } from '../types'
import type { ThemePreset } from '../data/themes.generated'

type SidebarPanel = 'themes' | 'export'

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
    setTailwindClasses,
    setBehaviorConfig,
    setFontConfig,
  } = useAppState()

  const [editionMode, setEditionMode] = useState<EditionMode>(initialMode)
  const [showStylePanel, setShowStylePanel] = useState(showStylePanelByDefault)
  const [activeSidebarPanel, setActiveSidebarPanel] = useState<SidebarPanel>('themes')
  const [currentThemeId, setCurrentThemeId] = useState<string | undefined>()
  const [syncScroll, setSyncScroll] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })

  // Loop modal hook
  const loopModal = useLoopModal(state.markdown)

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

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

    // Process markdown to remove frontmatter before rendering HTML
    const { processedContent } = processMarkdownWithFrontmatter(state.markdown)

    return renderToStaticMarkup(
      <article className={state.tailwindClasses.article}>
        <Markdown components={components} remarkPlugins={[gfm]}>
          {processedContent}
        </Markdown>
      </article>
    )
  }, [state.markdown, state.tailwindClasses, state.behaviorConfig.shouldOpenLinksInNewTab])

  const handleTailwindClassChange = (element: keyof TailwindClasses, value: string) => {
    updateTailwindClass(element, value)
    setCurrentThemeId(undefined) // Clear theme when manually edited
  }

  // Handle applying a theme
  const handleApplyTheme = useCallback(
    (theme: ThemePreset) => {
      setTailwindClasses(theme.tailwindClasses)
      // Preserve user's shouldShowLineNumbers preference when applying theme
      setBehaviorConfig({
        ...theme.behaviorConfig,
        shouldShowLineNumbers: state.behaviorConfig.shouldShowLineNumbers,
      })
      setFontConfig(theme.fontConfig)
      setCurrentThemeId(theme.id)
    },
    [
      setTailwindClasses,
      setBehaviorConfig,
      setFontConfig,
      state.behaviorConfig.shouldShowLineNumbers,
    ]
  )

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
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900">
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
          showLineNumbers={state.behaviorConfig.shouldShowLineNumbers}
          onToggleLineNumbers={() =>
            updateBehaviorConfig(
              'shouldShowLineNumbers',
              !state.behaviorConfig.shouldShowLineNumbers
            )
          }
          syncScroll={syncScroll}
          onToggleSyncScroll={() => setSyncScroll(!syncScroll)}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          tailwindClasses={state.tailwindClasses}
          fontFamily={state.fontConfig.fontFamily}
          onUndo={() => document.execCommand('undo')}
          onRedo={() => document.execCommand('redo')}
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
                className={`${editionMode === 'split' ? 'w-1/2' : 'flex-1'} border-r border-gray-300 dark:border-gray-700`}
              >
                <MarkdownEditor
                  ref={editorRef}
                  markdown={state.markdown}
                  setMarkdown={setMarkdown}
                  showLineNumbers={state.behaviorConfig.shouldShowLineNumbers}
                  onScroll={syncScroll && editionMode === 'split' ? handleEditorScroll : undefined}
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
                  onScroll={syncScroll && editionMode === 'split' ? handlePreviewScroll : undefined}
                  scrollRef={previewScrollRef}
                />
              </div>
            )}
          </div>

          {/* Style Panel Toggle - Google Docs style icon bar */}
          <div
            className={`flex flex-col items-center bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 transition-all ${
              showStylePanel ? 'w-0 overflow-hidden' : 'w-12 py-2'
            }`}
          >
            {!showStylePanel && (
              <>
                <Tooltip id="sidebar-tooltip" />
                <button
                  onClick={() => {
                    setActiveSidebarPanel('themes')
                    setShowStylePanel(true)
                  }}
                  className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Themes"
                >
                  <FaPalette className="text-lg" />
                </button>
                <button
                  onClick={() => {
                    setActiveSidebarPanel('export')
                    setShowStylePanel(true)
                  }}
                  className="p-2 mt-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Export"
                >
                  <FaDownload className="text-lg" />
                </button>
              </>
            )}
          </div>

          {/* Side Panel */}
          {showStylePanel && (
            <div className="w-80 border-l border-gray-300 dark:border-gray-700 flex-shrink-0 relative">
              {/* Close button */}
              <button
                onClick={() => setShowStylePanel(false)}
                className="absolute top-1 right-1 z-10 p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                title="Close panel"
              >
                <FaTimes className="text-sm" />
              </button>
              {activeSidebarPanel === 'themes' ? (
                <StylePanel
                  tailwindClasses={state.tailwindClasses}
                  behaviorConfig={state.behaviorConfig}
                  fontConfig={state.fontConfig}
                  currentThemeId={currentThemeId}
                  onTailwindClassChange={handleTailwindClassChange}
                  onBehaviorConfigChange={updateBehaviorConfig}
                  onFontConfigChange={updateFontConfig}
                  onApplyTheme={handleApplyTheme}
                />
              ) : (
                <ExportPanel
                  documentTitle={state.documentTitle}
                  markdown={state.markdown}
                  htmlContent={htmlContent}
                  tailwindClasses={state.tailwindClasses}
                  fontFamily={state.fontConfig.fontFamily}
                />
              )}
            </div>
          )}
        </div>

        {/* Loop Modal */}
        <LoopModal loopModal={loopModal} onInsertLoop={handleInsertLoop} />
      </div>
    </div>
  )
}

export default Editor

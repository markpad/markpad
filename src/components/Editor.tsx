import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { renderToStaticMarkup } from 'react-dom/server'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Tooltip } from 'react-tooltip'
import {
  FaPalette,
  FaTimes,
  FaDownload,
  FaMagic,
  FaEdit,
  FaEye,
  FaBold,
  FaItalic,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaTable,
  FaSync,
  FaCodeBranch,
} from 'react-icons/fa'
import { useAppState } from '@/hooks/useAppState'
import { useParams, useNavigate } from 'react-router-dom'
import { processMarkdownWithFrontmatter } from '@/utils/frontmatter'
import { defaultTailwindClasses, defaultFontConfig } from '@/services/urlStateService'
import { documentRepository, templateRepository } from '@/lib/repositories'
import debounce from '@/utils/debounce'
import { useLoopModal } from '@/hooks/useLoopModal'
import { useIfModal } from '@/hooks/useIfModal'
import { useImageModal } from '@/hooks/useImageModal'
import { useLinkModal } from '@/hooks/useLinkModal'
import { useImportModal } from '@/hooks/useImportModal'
import { useUserSettings } from '@/hooks/useUserSettings'
import { Header } from '@/components/Header'
import { MarkdownEditor, MarkdownEditorHandle } from '@/components/editor/MarkdownEditor'
import { MarkdownPreview } from '@/components/preview/MarkdownPreview'
import { StylePanel } from '@/components/style/StylePanel'
import { ExportPanel } from '@/components/style/ExportPanel'
import { VariablesPanel } from '@/components/style/VariablesPanel'
import { LoopModal } from '@/components/LoopModal'
import { IfModal } from '@/components/IfModal'
import { ImageModal } from '@/components/ImageModal'
import { LinkModal } from '@/components/LinkModal'
import { ImportModal, ImportAction } from '@/components/ImportModal'
import type { EditionMode, AppState } from '@/types'
import type { ThemePreset } from '@/data/themes.generated'
import { getThemeById } from '@/data/themes.generated'

type SidebarPanel = 'themes' | 'export' | 'variables'
type EntityType = 'document' | 'template'

interface EditorProps {
  initialMode?: EditionMode
  showStylePanelByDefault?: boolean
  entityType?: EntityType
  /** When provided, the editor renders a "Save" button that converts the pako session to a persisted document */
  onSaveToDocument?: (state: AppState) => void
  isSavingToDocument?: boolean
}

/**
 * Main editor layout component
 * Orchestrates all sub-components and manages layout state
 */
export function Editor({
  initialMode: _initialMode = 'split',
  showStylePanelByDefault = false,
  entityType = 'document',
  onSaveToDocument,
  isSavingToDocument = false,
}: EditorProps) {
  const { id: docId } = useParams<{ id: string }>()
  const isTemplate = entityType === 'template'
  const isNewEntity = docId === 'new'
  const entityId = isNewEntity ? undefined : docId

  const { state, setMarkdown, setDocumentTitle, setTailwindClasses, setFontConfig, loadState } =
    useAppState({ docId: entityId })

  const { settings, updateEditorSetting } = useUserSettings()

  const [docLoaded, setDocLoaded] = useState(false)
  const [currentThemeId, setCurrentThemeId] = useState<string | undefined>()
  const [saveStatus, setSaveStatus] = useState<'idle' | 'unsaved' | 'saving' | 'saved'>('idle')

  // Load full entity state from IndexedDB if :id param present
  useEffect(() => {
    if (!entityId) {
      setDocLoaded(true)
      return
    }

    if (isTemplate) {
      templateRepository.getById(entityId).then((tpl) => {
        if (tpl) {
          // Merge behaviorConfig into user settings if present (migration)
          if (tpl.behaviorConfig) {
            updateEditorSetting('showLineNumbers', tpl.behaviorConfig.shouldShowLineNumbers)
            updateEditorSetting('openLinksInNewTab', tpl.behaviorConfig.shouldOpenLinksInNewTab)
          }

          // Resolve theme: prefer themeId, fallback to legacy tailwindClasses
          const resolvedTheme = tpl.themeId ? getThemeById(tpl.themeId) : null
          loadState({
            markdown: tpl.content,
            documentTitle: tpl.title,
            tailwindClasses:
              resolvedTheme?.tailwindClasses ?? tpl.tailwindClasses ?? defaultTailwindClasses,
            fontConfig: resolvedTheme?.fontConfig ?? tpl.fontConfig ?? defaultFontConfig,
          })
          if (resolvedTheme) {
            setCurrentThemeId(resolvedTheme.id)
          }
        }
        setDocLoaded(true)
      })
    } else {
      documentRepository.getById(entityId).then((doc) => {
        if (doc) {
          // Merge behaviorConfig into user settings if present (migration)
          if (doc.behaviorConfig) {
            updateEditorSetting('showLineNumbers', doc.behaviorConfig.shouldShowLineNumbers)
            updateEditorSetting('openLinksInNewTab', doc.behaviorConfig.shouldOpenLinksInNewTab)
          }

          // Resolve theme: prefer themeId (source of truth), fallback to legacy tailwindClasses
          const resolvedTheme = doc.themeId ? getThemeById(doc.themeId) : null
          loadState({
            markdown: doc.content,
            documentTitle: doc.title,
            tailwindClasses:
              resolvedTheme?.tailwindClasses ?? doc.tailwindClasses ?? defaultTailwindClasses,
            fontConfig: resolvedTheme?.fontConfig ?? doc.fontConfig ?? defaultFontConfig,
          })
          if (resolvedTheme) {
            setCurrentThemeId(resolvedTheme.id)
          }
          // If no valid themeId (legacy doc with only tailwindClasses), currentThemeId stays
          // undefined → shown as custom in StylePanel
        }
        setDocLoaded(true)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, isTemplate, loadState])

  // Auto-save to IndexedDB (debounced)
  // Only persists content, title, and themeId — styling is derived from themeId at load time.
  // Legacy tailwindClasses/fontConfig stored in old documents are never overwritten here.
  const debouncedSave = useRef(
    debounce(async (id: string, content: string, title: string, themeId?: string) => {
      setSaveStatus('saving')
      try {
        if (isTemplate) {
          await templateRepository.update(id, { content, title, themeId })
        } else {
          await documentRepository.update(id, { content, title, themeId })
        }
        setSaveStatus('saved')
      } catch (err) {
        console.error(err)
        setSaveStatus('unsaved')
      }
    }, 1500)
  ).current

  // Track content changes → unsaved
  const hasLoadedOnce = useRef(false)
  useEffect(() => {
    if (!docLoaded) return
    // Skip the first change right after loading
    if (!hasLoadedOnce.current) {
      hasLoadedOnce.current = true
      return
    }
    if (entityId) {
      setSaveStatus('unsaved')
    }
  }, [state.markdown, state.documentTitle, currentThemeId, docLoaded, entityId])

  useEffect(() => {
    if (entityId && docLoaded) {
      debouncedSave(entityId, state.markdown, state.documentTitle, currentThemeId)
    }
  }, [entityId, docLoaded, state.markdown, state.documentTitle, currentThemeId, debouncedSave])

  const [editionMode, setEditionMode] = useState<EditionMode>(settings.editor.defaultView)
  const [showStylePanel, setShowStylePanel] = useState(showStylePanelByDefault)
  const [activeSidebarPanel, setActiveSidebarPanel] = useState<SidebarPanel>('themes')
  const [customThemeName, setCustomThemeName] = useState('Custom Theme')

  // Check if current theme is custom (modified from preset or default)
  const isCustomTheme = !currentThemeId

  // Modal hooks
  const loopModal = useLoopModal(state.markdown)
  const ifModal = useIfModal(state.markdown)
  const imageModal = useImageModal()
  const linkModal = useLinkModal()
  const importModal = useImportModal()

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
          target={settings.editor.openLinksInNewTab ? '_blank' : undefined}
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
      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''
        const content = String(children)
        const isInline =
          inline === true || (inline !== false && !className && !content.includes('\n'))

        if (isInline) {
          return (
            <code className={state.tailwindClasses.code} {...props}>
              {children}
            </code>
          )
        }

        return (
          <SyntaxHighlighter
            style={oneLight}
            language={language}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              fontSize: '0.875rem',
            }}
            {...props}
          >
            {content.replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      },
      pre: ({ node, ...props }: any) => (
        <pre className={`not-prose ${state.tailwindClasses.pre}`} {...props} />
      ),
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
  }, [state.markdown, state.tailwindClasses, settings.editor.openLinksInNewTab])

  // Handle applying a theme
  const handleApplyTheme = useCallback(
    (theme: ThemePreset) => {
      setTailwindClasses(theme.tailwindClasses)
      setFontConfig(theme.fontConfig)
      setCurrentThemeId(theme.id)
      // Reset custom theme name when applying a preset
      setCustomThemeName('Custom Theme')
    },
    [setTailwindClasses, setFontConfig]
  )

  // Handle resetting to default theme
  const handleResetToDefault = useCallback(() => {
    setTailwindClasses(defaultTailwindClasses)
    setFontConfig(defaultFontConfig)
    setCurrentThemeId('standard-blue')
    setCustomThemeName('Custom Theme')
  }, [setTailwindClasses, setFontConfig])

  // Handle saving custom theme as a preset
  const handleSaveCustomTheme = useCallback(
    (themeName: string) => {
      // Return the saved theme configuration for the StylePanel to handle
      return {
        name: themeName,
        tailwindClasses: state.tailwindClasses,
        fontConfig: state.fontConfig,
        fontFamily: state.fontConfig.fontFamily,
      }
    },
    [state.tailwindClasses, state.fontConfig]
  )

  // Handle loop insertion
  const handleInsertLoop = useCallback(
    (loopCode: string, updatedMarkdown: string) => {
      // Get cursor position from editor ref
      const cursorPosition = editorRef.current?.getCursorPosition?.() ?? 0

      // If markdown was updated (new array added), we need to adjust cursor position
      // because the frontmatter might have grown
      let adjustedCursorPosition = cursorPosition
      if (updatedMarkdown !== state.markdown) {
        // Calculate the difference in length due to frontmatter changes
        const lengthDiff = updatedMarkdown.length - state.markdown.length
        adjustedCursorPosition = cursorPosition + lengthDiff
      }

      // Insert the loop code at the cursor position in the updated markdown
      const before = updatedMarkdown.substring(0, adjustedCursorPosition)
      const after = updatedMarkdown.substring(adjustedCursorPosition)
      const insertedText = '\n' + loopCode + '\n'
      const finalMarkdown = before + insertedText + after

      // Calculate new cursor position (after the inserted loop)
      const newCursorPosition = adjustedCursorPosition + insertedText.length

      setMarkdown(finalMarkdown)

      // Position cursor after the inserted loop
      // Use setTimeout to ensure state is updated first
      setTimeout(() => {
        editorRef.current?.setCursorPosition?.(newCursorPosition)
      }, 0)
    },
    [state.markdown, setMarkdown]
  )

  // Handle if insertion
  const handleInsertIf = useCallback(
    (ifCode: string) => {
      const cursorPosition = editorRef.current?.getCursorPosition?.() ?? 0

      // Insert the if code at the cursor position
      const before = state.markdown.substring(0, cursorPosition)
      const after = state.markdown.substring(cursorPosition)
      const insertedText = '\n' + ifCode + '\n'
      const finalMarkdown = before + insertedText + after

      // Calculate new cursor position (after the inserted if)
      const newCursorPosition = cursorPosition + insertedText.length

      setMarkdown(finalMarkdown)

      // Position cursor after the inserted if
      setTimeout(() => {
        editorRef.current?.setCursorPosition?.(newCursorPosition)
      }, 0)
    },
    [state.markdown, setMarkdown]
  )

  // Handle image insertion
  const handleInsertImage = useCallback(
    (imageCode: string) => {
      const cursorPosition = editorRef.current?.getCursorPosition?.() ?? 0

      // Insert the image code at the cursor position
      const before = state.markdown.substring(0, cursorPosition)
      const after = state.markdown.substring(cursorPosition)
      const finalMarkdown = before + imageCode + after

      // Calculate new cursor position (after the inserted image)
      const newCursorPosition = cursorPosition + imageCode.length

      setMarkdown(finalMarkdown)

      // Position cursor after the inserted image
      setTimeout(() => {
        editorRef.current?.setCursorPosition?.(newCursorPosition)
      }, 0)
    },
    [state.markdown, setMarkdown]
  )

  const navigate = useNavigate()

  // In try mode: save pako state as a persisted document
  const handleSaveToDocument = useCallback(() => {
    onSaveToDocument?.(state)
  }, [state, onSaveToDocument])

  // Handle import (file or URL)
  const handleImport = useCallback(
    async (content: string, title: string | undefined, action: ImportAction) => {
      if (action === 'replace') {
        // Overwrite current document
        setMarkdown(content)
        if (title) {
          setDocumentTitle(title)
        }
      } else {
        // Create new document (createNew or createAndOpen)
        const docTitle = title || 'Imported Document'
        const repo = entityType === 'template' ? templateRepository : documentRepository
        const newDoc = await repo.create({ title: docTitle, content })
        navigate(`/editor/${newDoc.id}`)
      }
      importModal.close()
    },
    [setMarkdown, setDocumentTitle, entityType, navigate, importModal]
  )

  // Handle link insertion
  const handleInsertLink = useCallback(
    (linkCode: string) => {
      const cursorPosition = editorRef.current?.getCursorPosition?.() ?? 0

      // Insert the link code at the cursor position
      const before = state.markdown.substring(0, cursorPosition)
      const after = state.markdown.substring(cursorPosition)
      const finalMarkdown = before + linkCode + after

      // Calculate new cursor position (after the inserted link)
      const newCursorPosition = cursorPosition + linkCode.length

      setMarkdown(finalMarkdown)

      // Position cursor after the inserted link
      setTimeout(() => {
        editorRef.current?.setCursorPosition?.(newCursorPosition)
      }, 0)
    },
    [state.markdown, setMarkdown]
  )

  return (
    <div className={`flex flex-col h-dvh min-h-dvh ${settings.editor.darkMode ? 'dark' : ''}`}>
      <div className="flex flex-col h-full min-h-0 bg-gray-100 dark:bg-gray-900">
        <Helmet>
          <title>
            {state.documentTitle} - {isTemplate ? 'Template' : 'Markpad'}
          </title>
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
          entityType={entityType}
          saveStatus={entityId ? saveStatus : 'idle'}
          showLineNumbers={settings.editor.showLineNumbers}
          onToggleLineNumbers={() =>
            updateEditorSetting('showLineNumbers', !settings.editor.showLineNumbers)
          }
          syncScroll={settings.editor.syncScroll}
          onToggleSyncScroll={() => updateEditorSetting('syncScroll', !settings.editor.syncScroll)}
          darkMode={settings.editor.darkMode}
          onToggleDarkMode={() => updateEditorSetting('darkMode', !settings.editor.darkMode)}
          tailwindClasses={state.tailwindClasses}
          fontFamily={state.fontConfig.fontFamily}
          onUndo={() => document.execCommand('undo')}
          onRedo={() => document.execCommand('redo')}
          onInsertHeading={(level) => editorRef.current?.insertHeading(level)}
          onInsertBold={() => editorRef.current?.insertBold()}
          onInsertItalic={() => editorRef.current?.insertItalic()}
          onInsertLink={() => linkModal.open()}
          onInsertImage={() => imageModal.open()}
          onInsertUnorderedList={() => editorRef.current?.insertUnorderedList()}
          onInsertOrderedList={() => editorRef.current?.insertOrderedList()}
          onInsertQuote={() => editorRef.current?.insertQuote()}
          onInsertTable={() => editorRef.current?.insertTable()}
          onInsertLoop={() => loopModal.open()}
          onInsertIf={() => ifModal.open()}
          onImport={() => importModal.open()}
          onShowThemes={() => {
            setActiveSidebarPanel('themes')
            setShowStylePanel(true)
          }}
          onSaveToDocument={onSaveToDocument ? handleSaveToDocument : undefined}
          isSavingToDocument={isSavingToDocument}
        />

        {/* ===== DESKTOP CONTENT (hidden on mobile) ===== */}
        <div className="hidden md:flex flex-1 overflow-hidden">
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
                  showLineNumbers={settings.editor.showLineNumbers}
                  onScroll={
                    settings.editor.syncScroll && editionMode === 'split'
                      ? handleEditorScroll
                      : undefined
                  }
                />
              </div>
            )}

            {/* Preview Panel */}
            {(editionMode === 'preview' || editionMode === 'split') && (
              <div className={`${editionMode === 'split' ? 'w-1/2' : 'flex-1'}`}>
                <MarkdownPreview
                  markdown={state.markdown}
                  tailwindClasses={state.tailwindClasses}
                  fontConfig={state.fontConfig}
                  onScroll={
                    settings.editor.syncScroll && editionMode === 'split'
                      ? handlePreviewScroll
                      : undefined
                  }
                  scrollRef={previewScrollRef}
                />
              </div>
            )}
          </div>

          {/* Style Panel Toggle - Google Docs style icon bar */}
          <div
            className={`flex flex-col items-center bg-gray-50 dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-out ${
              showStylePanel ? 'w-0 py-0 opacity-0' : 'w-12 py-2 opacity-100'
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
                    setActiveSidebarPanel('variables')
                    setShowStylePanel(true)
                  }}
                  className="p-2 mt-1 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
                  data-tooltip-id="sidebar-tooltip"
                  data-tooltip-content="Variables"
                >
                  <FaMagic className="text-lg" />
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
          <div
            className={`border-l border-gray-300 dark:border-gray-700 flex-shrink-0 relative overflow-hidden transition-all duration-300 ease-out ${
              showStylePanel ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 translate-x-2'
            }`}
            aria-hidden={!showStylePanel}
          >
            {/* Close button */}
            <button
              onClick={() => setShowStylePanel(false)}
              className={`absolute top-1 right-1 z-10 p-1.5 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors duration-200 ${
                showStylePanel ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              title="Close panel"
            >
              <FaTimes className="text-sm" />
            </button>
            <div
              className={`h-full transition-opacity duration-200 ${
                showStylePanel ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {activeSidebarPanel === 'themes' && (
                <StylePanel
                  currentThemeId={currentThemeId}
                  isCustomTheme={isCustomTheme}
                  customThemeName={customThemeName}
                  onCustomThemeNameChange={setCustomThemeName}
                  onApplyTheme={handleApplyTheme}
                  onResetToDefault={handleResetToDefault}
                  onSaveCustomTheme={handleSaveCustomTheme}
                />
              )}
              {activeSidebarPanel === 'variables' && (
                <VariablesPanel markdown={state.markdown} onMarkdownChange={setMarkdown} />
              )}
              {activeSidebarPanel === 'export' && (
                <ExportPanel
                  documentTitle={state.documentTitle}
                  markdown={state.markdown}
                  htmlContent={htmlContent}
                  tailwindClasses={state.tailwindClasses}
                  fontFamily={state.fontConfig.fontFamily}
                  headingFontFamily={state.fontConfig.headingFontFamily}
                />
              )}
            </div>
          </div>
        </div>

        {/* ===== MOBILE CONTENT (hidden on desktop) ===== */}
        <div className="md:hidden flex-1 min-h-0 overflow-hidden relative">
          {/* Mobile Themes Overlay */}
          {showStylePanel && (
            <div className="absolute inset-0 z-40 bg-white dark:bg-gray-800 flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                <span className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                  Themes
                </span>
                <button
                  onClick={() => setShowStylePanel(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-md"
                >
                  <FaTimes className="text-sm" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <StylePanel
                  currentThemeId={currentThemeId}
                  isCustomTheme={isCustomTheme}
                  customThemeName={customThemeName}
                  onCustomThemeNameChange={setCustomThemeName}
                  onApplyTheme={handleApplyTheme}
                  onResetToDefault={handleResetToDefault}
                  onSaveCustomTheme={handleSaveCustomTheme}
                />
              </div>
            </div>
          )}
          {/* Mobile Editor */}
          {(editionMode === 'edit' || editionMode === 'split') && (
            <MarkdownEditor
              ref={editorRef}
              markdown={state.markdown}
              setMarkdown={setMarkdown}
              showLineNumbers={settings.editor.showLineNumbers}
            />
          )}
          {/* Mobile Preview */}
          {editionMode === 'preview' && (
            <MarkdownPreview
              markdown={state.markdown}
              tailwindClasses={state.tailwindClasses}
              fontConfig={state.fontConfig}
              scrollRef={previewScrollRef}
            />
          )}
        </div>

        {/* ===== MOBILE FORMATTING TOOLBAR (hidden on desktop) ===== */}
        {(editionMode === 'edit' || editionMode === 'split') && (
          <div className="md:hidden flex items-center overflow-x-auto bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-2 py-1 gap-0.5 flex-shrink-0">
            <button
              className="flex-shrink-0 px-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-bold text-xs"
              onClick={() => editorRef.current?.insertHeading(1)}
            >
              H1
            </button>
            <button
              className="flex-shrink-0 px-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-bold text-xs"
              onClick={() => editorRef.current?.insertHeading(2)}
            >
              H2
            </button>
            <button
              className="flex-shrink-0 px-2 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded font-bold text-xs"
              onClick={() => editorRef.current?.insertHeading(3)}
            >
              H3
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1 flex-shrink-0" />
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertBold()}
            >
              <FaBold className="text-sm" />
            </button>
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertItalic()}
            >
              <FaItalic className="text-sm" />
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1 flex-shrink-0" />
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => linkModal.open()}
            >
              <FaLink className="text-sm" />
            </button>
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => imageModal.open()}
            >
              <FaImage className="text-sm" />
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1 flex-shrink-0" />
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertUnorderedList()}
            >
              <FaListUl className="text-sm" />
            </button>
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertOrderedList()}
            >
              <FaListOl className="text-sm" />
            </button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1 flex-shrink-0" />
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertQuote()}
            >
              <FaQuoteLeft className="text-sm" />
            </button>
            <button
              className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              onClick={() => editorRef.current?.insertTable()}
            >
              <FaTable className="text-sm" />
            </button>
            {!isTemplate && (
              <>
                <div className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1 flex-shrink-0" />
                <button
                  className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 rounded"
                  onClick={() => loopModal.open()}
                >
                  <FaSync className="text-sm" />
                </button>
                <button
                  className="flex-shrink-0 p-2 text-gray-600 dark:text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                  onClick={() => ifModal.open()}
                >
                  <FaCodeBranch className="text-sm" />
                </button>
              </>
            )}
          </div>
        )}

        {/* ===== MOBILE FOOTER TAB BAR (hidden on desktop) ===== */}
        <div
          className="md:hidden flex-shrink-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
        >
          <div className="flex bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setEditionMode('edit')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide transition-colors ${
                editionMode === 'edit' || editionMode === 'split'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <FaEdit className="text-base" />
              <span>EDIT</span>
            </button>
            <button
              onClick={() => setEditionMode('preview')}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-wide transition-colors ${
                editionMode === 'preview'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <FaEye className="text-base" />
              <span>PREVIEW</span>
            </button>
          </div>
          <div className="bg-white dark:bg-gray-800 py-0.5 text-center text-[10px] text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-700">
            {(saveStatus === 'saved' || saveStatus === 'idle') && (
              <span className="inline-flex items-center gap-1">
                <svg
                  className="w-2.5 h-2.5 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Saved offline
              </span>
            )}
            {saveStatus === 'saving' && <span>Saving…</span>}
            {saveStatus === 'unsaved' && <span>&#9679; Unsaved</span>}
          </div>
        </div>

        {/* Loop Modal */}
        <LoopModal loopModal={loopModal} onInsertLoop={handleInsertLoop} />

        {/* If Modal */}
        <IfModal ifModal={ifModal} onInsertIf={handleInsertIf} />

        {/* Image Modal */}
        <ImageModal imageModal={imageModal} onInsertImage={handleInsertImage} />

        {/* Link Modal */}
        <LinkModal linkModal={linkModal} onInsertLink={handleInsertLink} />

        {/* Import Modal */}
        <ImportModal
          importModal={importModal}
          context="editor"
          onImport={handleImport}
          currentDocumentTitle={state.documentTitle}
        />
      </div>
    </div>
  )
}

export default Editor

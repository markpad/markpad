import { useState, useRef, useEffect } from 'react'
import {
  FaEye,
  FaColumns,
  FaEdit,
  FaFileAlt,
  FaCopy,
  FaFileExport,
  FaBold,
  FaItalic,
  FaLink,
  FaImage,
  FaListUl,
  FaListOl,
  FaQuoteLeft,
  FaTable,
  FaShareAlt,
  FaSync,
  FaCodeBranch,
  FaListAlt,
  FaCheck,
  FaMoon,
  FaChevronRight,
  FaUndo,
  FaRedo,
  FaMarkdown,
  FaFileCode,
  FaFilePdf,
} from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import type { EditionMode, AppState, TailwindClasses } from '../types'
import { generateShareUrl } from '../services/urlStateService'
import { documentRepository, templateRepository } from '../lib/repositories'
import { ShareModal } from './ShareModal'
import { processMarkdownWithFrontmatter } from '../utils/frontmatter'
import {
  generateStyledHtml,
  downloadFile,
  copyToClipboard,
  copyHtmlToClipboard,
  exportPdf,
} from '../utils/htmlGenerator'
import { Toast } from './Toast'

type EntityType = 'document' | 'template'

interface HeaderProps {
  state: AppState
  editionMode: EditionMode
  onEditionModeChange: (mode: EditionMode) => void
  htmlContent: string
  onDocumentTitleChange: (title: string) => void
  showLineNumbers: boolean
  onToggleLineNumbers: () => void
  syncScroll: boolean
  onToggleSyncScroll: () => void
  darkMode: boolean
  onToggleDarkMode: () => void
  tailwindClasses: TailwindClasses
  fontFamily: string
  entityType?: EntityType
  onUndo?: () => void
  onRedo?: () => void
  onInsertHeading?: (level: 1 | 2 | 3) => void
  onInsertBold?: () => void
  onInsertItalic?: () => void
  onInsertLink?: () => void
  onInsertImage?: () => void
  onInsertUnorderedList?: () => void
  onInsertOrderedList?: () => void
  onInsertQuote?: () => void
  onInsertTable?: () => void
  onInsertLoop?: () => void
  onInsertIf?: () => void
  saveStatus?: 'idle' | 'unsaved' | 'saving' | 'saved'
}

interface MenuItem {
  label: string
  icon?: React.ReactNode
  shortcut?: string
  onClick?: () => void
  divider?: boolean
  checked?: boolean
  submenu?: MenuItem[]
}

interface MenuItemProps {
  label: string
  items: MenuItem[]
  anyMenuOpen: boolean
  isActive: boolean
  onMenuOpenChange: (label: string, isOpen: boolean) => void
}

function MenuDropdown({ label, items, anyMenuOpen, isActive, onMenuOpenChange }: MenuItemProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenSubmenu(null)
        onMenuOpenChange(label, false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [label, onMenuOpenChange])

  // Clear submenu when menu closes
  useEffect(() => {
    if (!isActive) {
      setOpenSubmenu(null)
    }
  }, [isActive])

  const renderMenuItem = (item: MenuItem, index: number, isSubmenu = false) => {
    // Divider-only item
    if (item.label === 'divider' && item.divider) {
      return <div key={index} className="border-t border-gray-200 dark:border-gray-700 my-1" />
    }

    // Item with submenu
    if (item.submenu) {
      return (
        <div
          key={index}
          className="relative"
          onMouseEnter={() => setOpenSubmenu(item.label)}
          onMouseLeave={() => setOpenSubmenu(null)}
        >
          {item.divider && <div className="border-t border-gray-200 dark:border-gray-700 my-1" />}
          <button className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-between">
            <span className="flex items-center gap-3">
              {item.icon && (
                <span className="text-gray-500 dark:text-gray-400 w-4">{item.icon}</span>
              )}
              {item.label}
            </span>
            <FaChevronRight className="text-gray-400 dark:text-gray-500 text-xs" />
          </button>
          {openSubmenu === item.label && (
            <div className="absolute left-full top-0 ml-0.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl min-w-[180px] py-1">
              {item.submenu.map((subitem, subindex) => renderMenuItem(subitem, subindex, true))}
            </div>
          )}
        </div>
      )
    }

    // Regular item
    return (
      <div key={index}>
        {item.divider && <div className="border-t border-gray-200 dark:border-gray-700 my-1" />}
        <button
          className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 flex items-center justify-between"
          onClick={() => {
            item.onClick?.()
            onMenuOpenChange(label, false)
            setOpenSubmenu(null)
          }}
        >
          <span className="flex items-center gap-3">
            {item.icon && (
              <span className="text-gray-500 dark:text-gray-400 w-4">
                {item.checked !== undefined ? (
                  item.checked ? (
                    <FaCheck className="text-blue-600 dark:text-blue-400" />
                  ) : (
                    <span className="opacity-30">{item.icon}</span>
                  )
                ) : (
                  item.icon
                )}
              </span>
            )}
            {item.label}
          </span>
          {item.shortcut && (
            <span className="text-gray-400 dark:text-gray-500 text-xs">{item.shortcut}</span>
          )}
        </button>
      </div>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        className={`px-3 py-1 text-sm rounded transition-colors ${
          isActive
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        onClick={() => onMenuOpenChange(label, !isActive)}
        onMouseEnter={() => {
          if (anyMenuOpen && !isActive) {
            onMenuOpenChange(label, true)
          }
        }}
      >
        {label}
      </button>
      {isActive && (
        <div className="absolute left-0 top-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[200px] py-1">
          {items.map((item, index) => renderMenuItem(item, index))}
        </div>
      )}
    </div>
  )
}

/**
 * Header component with Google Docs-style toolbar
 * Features document title, menu bar, and action buttons
 */
export function Header({
  state,
  editionMode,
  onEditionModeChange,
  htmlContent,
  onDocumentTitleChange,
  showLineNumbers,
  onToggleLineNumbers,
  syncScroll,
  onToggleSyncScroll,
  darkMode,
  onToggleDarkMode,
  tailwindClasses,
  fontFamily,
  entityType = 'document',
  onUndo,
  onRedo,
  onInsertHeading,
  onInsertBold,
  onInsertItalic,
  onInsertLink,
  onInsertImage,
  onInsertUnorderedList,
  onInsertOrderedList,
  onInsertQuote,
  onInsertTable,
  onInsertLoop,
  onInsertIf,
  saveStatus = 'idle',
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [shareUrl, setShareUrl] = useState('')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [anyMenuOpen, setAnyMenuOpen] = useState(false)
  const [openMenuLabel, setOpenMenuLabel] = useState<string | null>(null)
  const isTemplate = entityType === 'template'

  const showToastMessage = (message: string) => {
    setToastMessage(message)
    setShowToast(true)
  }

  const handleMenuOpenChange = (label: string, isOpen: boolean) => {
    if (isOpen) {
      setAnyMenuOpen(true)
      setOpenMenuLabel(label)
    } else {
      // Check if the closing menu is the currently open one
      if (openMenuLabel === label) {
        setAnyMenuOpen(false)
        setOpenMenuLabel(null)
      }
    }
  }

  // HTML generation options
  const htmlOptions = {
    documentTitle: state.documentTitle,
    htmlContent,
    tailwindClasses,
    fontFamily,
  }

  // Export handlers
  const handleExportMarkdownOriginal = () => {
    downloadFile(state.markdown, `${state.documentTitle}.md`, 'text/markdown')
  }

  const handleExportMarkdownProcessed = () => {
    const { processedContent } = processMarkdownWithFrontmatter(state.markdown)
    downloadFile(processedContent, `${state.documentTitle}-processed.md`, 'text/markdown')
  }

  const handleExportHtmlStyled = () => {
    downloadFile(generateStyledHtml(htmlOptions), `${state.documentTitle}-styled.html`, 'text/html')
  }

  const handleExportPdf = () => {
    exportPdf(htmlOptions)
  }

  // Copy handlers
  const handleCopyMarkdownOriginal = async () => {
    await copyToClipboard(state.markdown)
    showToastMessage('Original markdown copied!')
  }

  const handleCopyMarkdownProcessed = async () => {
    const { processedContent } = processMarkdownWithFrontmatter(state.markdown)
    await copyToClipboard(processedContent)
    showToastMessage('Processed markdown copied!')
  }

  const handleCopyHtmlStyled = async () => {
    await copyHtmlToClipboard(generateStyledHtml(htmlOptions))
    showToastMessage('Styled HTML copied!')
  }

  // Share handler
  const handleGenerateShareLink = () => {
    const url = generateShareUrl(state)
    setShareUrl(url)
    setShareModalOpen(true)
  }

  // New entity handler
  const handleNewEntity = async () => {
    if (isTemplate) {
      const tmpl = await templateRepository.create({
        title: 'Untitled Template',
        content: '# New Template\n\nStart writing...',
      })
      window.open(`/template/${tmpl.id}`, '_blank')
    } else {
      const doc = await documentRepository.create({
        title: 'Untitled Document',
        content: '# New Document\n\nStart writing...',
      })
      window.open(`/editor/${doc.id}`, '_blank')
    }
  }

  // Duplicate entity handler
  const handleDuplicateEntity = async () => {
    if (isTemplate) {
      const tmpl = await templateRepository.create({
        title: `${state.documentTitle} (copy)`,
        content: state.markdown,
      })
      window.open(`/template/${tmpl.id}`, '_blank')
    } else {
      const doc = await documentRepository.create({
        title: `${state.documentTitle} (copy)`,
        content: state.markdown,
        tailwindClasses: state.tailwindClasses,
        behaviorConfig: state.behaviorConfig,
        fontConfig: state.fontConfig,
      })
      window.open(`/editor/${doc.id}`, '_blank')
    }
  }

  const fileMenuItems: MenuItem[] = [
    {
      label: isTemplate ? 'New Template' : 'New Document',
      icon: <FaFileAlt />,
      shortcut: '⌘N',
      onClick: handleNewEntity,
    },
    {
      label: 'Duplicate',
      icon: <FaCopy />,
      shortcut: '⌘D',
      onClick: handleDuplicateEntity,
    },
    { label: 'divider', divider: true },
    {
      label: 'Export',
      icon: <FaFileExport />,
      submenu: [
        {
          label: 'Markdown (Original)',
          icon: <FaMarkdown />,
          onClick: handleExportMarkdownOriginal,
        },
        {
          label: 'Markdown (Processed)',
          icon: <FaCheck />,
          onClick: handleExportMarkdownProcessed,
        },
        { label: 'divider', divider: true },
        { label: 'HTML (Styled)', icon: <FaFileCode />, onClick: handleExportHtmlStyled },
        { label: 'divider', divider: true },
        { label: 'PDF', icon: <FaFilePdf />, onClick: handleExportPdf },
      ],
    },
    {
      label: 'Copy',
      icon: <FaCopy />,
      submenu: [
        { label: 'Markdown (Original)', icon: <FaMarkdown />, onClick: handleCopyMarkdownOriginal },
        { label: 'Markdown (Processed)', icon: <FaCheck />, onClick: handleCopyMarkdownProcessed },
        { label: 'divider', divider: true },
        { label: 'HTML (Styled)', icon: <FaFileCode />, onClick: handleCopyHtmlStyled },
      ],
    },
    { label: 'divider', divider: true },
    {
      label: 'Generate Share Link...',
      icon: <FaShareAlt />,
      onClick: handleGenerateShareLink,
    },
  ]

  const editMenuItems: MenuItem[] = [
    {
      label: 'Undo',
      icon: <FaUndo />,
      shortcut: '⌘Z',
      onClick: onUndo,
    },
    {
      label: 'Redo',
      icon: <FaRedo />,
      shortcut: '⌘⇧Z',
      onClick: onRedo,
    },
  ]

  const viewMenuItems: MenuItem[] = [
    {
      label: 'Layout',
      icon: <FaColumns />,
      submenu: [
        {
          label: 'Editor Only',
          icon: <FaEdit />,
          onClick: () => onEditionModeChange('edit'),
          checked: editionMode === 'edit',
        },
        {
          label: 'Split View',
          icon: <FaColumns />,
          onClick: () => onEditionModeChange('split'),
          checked: editionMode === 'split',
        },
        {
          label: 'Preview Only',
          icon: <FaEye />,
          onClick: () => onEditionModeChange('preview'),
          checked: editionMode === 'preview',
        },
      ],
    },
    { label: 'divider', divider: true },
    {
      label: 'Show Line Numbers',
      icon: <FaListAlt />,
      onClick: onToggleLineNumbers,
      checked: showLineNumbers,
    },
    {
      label: 'Sync Scroll',
      icon: <FaSync />,
      onClick: onToggleSyncScroll,
      checked: syncScroll,
    },
    { label: 'divider', divider: true },
    {
      label: 'Dark Mode',
      icon: <FaMoon />,
      onClick: onToggleDarkMode,
      checked: darkMode,
    },
  ]

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Top Row - Logo, Title, Share */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-3">
          {/* App Icon - links to list page */}
          <a
            href={isTemplate ? '/templates' : '/documents'}
            className={`flex items-center justify-center w-10 h-10 bg-gradient-to-br rounded-lg hover:shadow-lg transition-all ${
              isTemplate
                ? 'from-purple-500 to-purple-600 hover:shadow-purple-500/20'
                : 'from-blue-500 to-blue-600 hover:shadow-blue-500/20'
            }`}
            title={isTemplate ? 'My Templates' : 'My Documents'}
          >
            <FaFileAlt className="text-white text-lg" />
          </a>

          {/* Entity Title */}
          <div className="flex flex-col">
            {isEditingTitle ? (
              <input
                type="text"
                value={state.documentTitle}
                onChange={(e) => onDocumentTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setIsEditingTitle(false)
                  }
                }}
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-gray-900 dark:text-gray-100 text-lg font-medium focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 min-w-[200px]"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-900 dark:text-gray-100 text-lg font-medium hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-1 rounded transition-colors text-left"
              >
                {state.documentTitle}
              </button>
            )}
            <div className="flex items-center gap-2 px-2 -mt-0.5">
              {isTemplate && (
                <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-500 dark:text-purple-400">
                  Template
                </span>
              )}
              {saveStatus !== 'idle' && (
                <span
                  className={`text-[9px] font-medium inline-flex items-center gap-1 px-1.5 py-px rounded-full border transition-all duration-300 ${
                    saveStatus === 'saved'
                      ? 'text-green-500/70 dark:text-green-500/50 bg-green-50/50 dark:bg-green-900/20 border-green-200/60 dark:border-green-800/40'
                      : saveStatus === 'saving'
                        ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                        : 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/40 border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {saveStatus === 'saved' && (
                    <>
                      <svg
                        className="w-2 h-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Saved offline
                    </>
                  )}
                  {saveStatus === 'saving' && (
                    <>
                      <svg className="w-2 h-2 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth={4}
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Saving…
                    </>
                  )}
                  {saveStatus === 'unsaved' && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-current" />
                      Unsaved
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - Menu Bar & Toolbar */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Left - Menu Bar + Formatting Toolbar */}
        <div className="flex items-center gap-1">
          <MenuDropdown
            label="File"
            items={fileMenuItems}
            anyMenuOpen={anyMenuOpen}
            isActive={openMenuLabel === 'File'}
            onMenuOpenChange={handleMenuOpenChange}
          />
          <MenuDropdown
            label="Edit"
            items={editMenuItems}
            anyMenuOpen={anyMenuOpen}
            isActive={openMenuLabel === 'Edit'}
            onMenuOpenChange={handleMenuOpenChange}
          />
          <MenuDropdown
            label="View"
            items={viewMenuItems}
            anyMenuOpen={anyMenuOpen}
            isActive={openMenuLabel === 'View'}
            onMenuOpenChange={handleMenuOpenChange}
          />

          <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2" />

          {/* Formatting Toolbar */}
          <Tooltip id="h1-tooltip" />
          <button
            data-tooltip-id="h1-tooltip"
            data-tooltip-content="Heading 1"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(1)}
          >
            H1
          </button>
          <Tooltip id="h2-tooltip" />
          <button
            data-tooltip-id="h2-tooltip"
            data-tooltip-content="Heading 2"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(2)}
          >
            H2
          </button>
          <Tooltip id="h3-tooltip" />
          <button
            data-tooltip-id="h3-tooltip"
            data-tooltip-content="Heading 3"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(3)}
          >
            H3
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="bold-tooltip" />
          <button
            data-tooltip-id="bold-tooltip"
            data-tooltip-content="Bold"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertBold}
          >
            <FaBold className="text-sm" />
          </button>
          <Tooltip id="italic-tooltip" />
          <button
            data-tooltip-id="italic-tooltip"
            data-tooltip-content="Italic"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertItalic}
          >
            <FaItalic className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="link-tooltip" />
          <button
            data-tooltip-id="link-tooltip"
            data-tooltip-content="Insert Link"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertLink}
          >
            <FaLink className="text-sm" />
          </button>
          <Tooltip id="image-tooltip" />
          <button
            data-tooltip-id="image-tooltip"
            data-tooltip-content="Insert Image"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertImage}
          >
            <FaImage className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="ul-tooltip" />
          <button
            data-tooltip-id="ul-tooltip"
            data-tooltip-content="Bulleted List"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertUnorderedList}
          >
            <FaListUl className="text-sm" />
          </button>
          <Tooltip id="ol-tooltip" />
          <button
            data-tooltip-id="ol-tooltip"
            data-tooltip-content="Numbered List"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertOrderedList}
          >
            <FaListOl className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="quote-tooltip" />
          <button
            data-tooltip-id="quote-tooltip"
            data-tooltip-content="Insert Quote"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertQuote}
          >
            <FaQuoteLeft className="text-sm" />
          </button>
          <Tooltip id="table-tooltip" />
          <button
            data-tooltip-id="table-tooltip"
            data-tooltip-content="Insert Table"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            onClick={onInsertTable}
          >
            <FaTable className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="loop-tooltip" />
          <button
            data-tooltip-id="loop-tooltip"
            data-tooltip-content="Insert Loop"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 rounded-md transition-colors"
            onClick={onInsertLoop}
          >
            <FaSync className="text-sm" />
          </button>

          <Tooltip id="if-tooltip" />
          <button
            data-tooltip-id="if-tooltip"
            data-tooltip-content="Insert Conditional"
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md transition-colors"
            onClick={onInsertIf}
          >
            <FaCodeBranch className="text-sm" />
          </button>
        </div>

        {/* Right - View Mode Toggle */}
        <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'edit'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => onEditionModeChange('edit')}
          >
            <FaEdit className="text-xs" />
            <span>Edit</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'split'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => onEditionModeChange('split')}
          >
            <FaColumns className="text-xs" />
            <span>Split</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'preview'
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => onEditionModeChange('preview')}
          >
            <FaEye className="text-xs" />
            <span>Preview</span>
          </button>
        </div>
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareUrl={shareUrl}
        documentTitle={state.documentTitle}
      />

      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </header>
  )
}

export default Header

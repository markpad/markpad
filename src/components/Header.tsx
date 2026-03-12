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
  FaListAlt,
  FaCheck,
  FaMoon,
  FaChevronRight,
  FaUndo,
  FaRedo,
  FaMarkdown,
  FaCode,
  FaFileCode,
} from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import type { EditionMode, AppState, TailwindClasses } from '../types'
import { generatePublishUrl } from '../services/urlStateService'
import { PublishModal } from './PublishModal'
import { processMarkdownWithFrontmatter } from '../utils/frontmatter'
import {
  generateStyledHtml,
  downloadFile,
  copyToClipboard,
} from '../utils/htmlGenerator'

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
}

function MenuDropdown({ label, items }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setOpenSubmenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            setIsOpen(false)
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
          isOpen
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>
      {isOpen && (
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
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [publishUrl, setPublishUrl] = useState('')

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

  // Copy handlers
  const handleCopyMarkdownOriginal = async () => {
    await copyToClipboard(state.markdown)
    alert('Original markdown copied!')
  }

  const handleCopyMarkdownProcessed = async () => {
    const { processedContent } = processMarkdownWithFrontmatter(state.markdown)
    await copyToClipboard(processedContent)
    alert('Processed markdown copied!')
  }

  const handleCopyHtmlStyled = async () => {
    await copyToClipboard(generateStyledHtml(htmlOptions))
    alert('Styled HTML copied!')
  }

  // Share handler
  const handleGenerateShareLink = () => {
    const url = generatePublishUrl(state)
    setPublishUrl(url)
    setPublishModalOpen(true)
  }

  // New document handler
  const handleNewDocument = () => {
    window.location.href = '/editor'
  }

  const fileMenuItems: MenuItem[] = [
    {
      label: 'New Document',
      icon: <FaFileAlt />,
      shortcut: '⌘N',
      onClick: handleNewDocument,
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
          {/* App Icon */}
          <a
            href="/themes"
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            <FaFileAlt className="text-white text-lg" />
          </a>

          {/* Document Title */}
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
          </div>
        </div>
      </div>

      {/* Bottom Row - Menu Bar & Toolbar */}
      <div className="flex items-center justify-between px-2 py-1">
        {/* Left - Menu Bar + Formatting Toolbar */}
        <div className="flex items-center gap-1">
          <MenuDropdown label="File" items={fileMenuItems} />
          <MenuDropdown label="Edit" items={editMenuItems} />
          <MenuDropdown label="View" items={viewMenuItems} />

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

      <PublishModal
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        publishUrl={publishUrl}
        documentTitle={state.documentTitle}
      />
    </header>
  )
}

export default Header

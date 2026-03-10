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
  FaGlobe,
} from 'react-icons/fa'
import { Tooltip } from 'react-tooltip'
import type { EditionMode, AppState } from '../types'
import { generatePublishUrl } from '../services/urlStateService'
import { PublishModal } from './PublishModal'

interface HeaderProps {
  state: AppState
  editionMode: EditionMode
  onEditionModeChange: (mode: EditionMode) => void
  htmlContent: string
  onDocumentTitleChange: (title: string) => void
  onInsertHeading?: (level: 1 | 2 | 3) => void
  onInsertBold?: () => void
  onInsertItalic?: () => void
  onInsertLink?: () => void
  onInsertImage?: () => void
  onInsertUnorderedList?: () => void
  onInsertOrderedList?: () => void
  onInsertQuote?: () => void
  onInsertTable?: () => void
}

interface MenuItemProps {
  label: string
  items: {
    label: string
    icon?: React.ReactNode
    shortcut?: string
    onClick: () => void
    divider?: boolean
  }[]
}

function MenuDropdown({ label, items }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={menuRef} className="relative">
      <button
        className={`px-3 py-1 text-sm rounded transition-colors ${
          isOpen
            ? 'bg-gray-200 text-gray-900'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {label}
      </button>
      {isOpen && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[200px] py-1">
          {items.map((item, index) =>
            item.divider ? (
              <div key={index} className="border-t border-gray-200 my-1" />
            ) : (
              <button
                key={index}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 flex items-center justify-between"
                onClick={() => {
                  item.onClick()
                  setIsOpen(false)
                }}
              >
                <span className="flex items-center gap-3">
                  {item.icon && <span className="text-gray-500 w-4">{item.icon}</span>}
                  {item.label}
                </span>
                {item.shortcut && <span className="text-gray-400 text-xs">{item.shortcut}</span>}
              </button>
            )
          )}
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
  onInsertHeading,
  onInsertBold,
  onInsertItalic,
  onInsertLink,
  onInsertImage,
  onInsertUnorderedList,
  onInsertOrderedList,
  onInsertQuote,
  onInsertTable,
}: HeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [publishUrl, setPublishUrl] = useState('')

  const handleExport = (format: 'html' | 'markdown') => {
    const content = format === 'markdown' ? state.markdown : htmlContent
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = format === 'markdown' ? `${state.documentTitle}.md` : `${state.documentTitle}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(state.markdown)
    alert('Content copied to clipboard!')
  }

  const handlePublishToWeb = () => {
    const url = generatePublishUrl(state)
    setPublishUrl(url)
    setPublishModalOpen(true)
  }

  const fileMenuItems = [
    {
      label: 'New document',
      icon: <FaFileAlt />,
      shortcut: '⌘N',
      onClick: () => window.open('/editor', '_blank'),
    },
    { label: 'divider', divider: true, onClick: () => {} },
    { label: 'Export as HTML', icon: <FaFileExport />, onClick: () => handleExport('html') },
    {
      label: 'Export as Markdown',
      icon: <FaFileExport />,
      onClick: () => handleExport('markdown'),
    },
    { label: 'divider', divider: true, onClick: () => {} },
    {
      label: 'Copy to clipboard',
      icon: <FaCopy />,
      shortcut: '⌘C',
      onClick: handleCopyToClipboard,
    },
    { label: 'divider', divider: true, onClick: () => {} },
    {
      label: 'Publish to Web',
      icon: <FaGlobe />,
      onClick: handlePublishToWeb,
    },
  ]

  const editMenuItems = [
    {
      label: 'Copy to clipboard',
      icon: <FaCopy />,
      shortcut: '⌘C',
      onClick: handleCopyToClipboard,
    },
  ]

  const viewMenuItems = [
    {
      label: 'Editor only',
      icon: <FaEdit />,
      onClick: () => onEditionModeChange('edit'),
    },
    {
      label: 'Split view',
      icon: <FaColumns />,
      onClick: () => onEditionModeChange('split'),
    },
    {
      label: 'Preview only',
      icon: <FaEye />,
      onClick: () => onEditionModeChange('preview'),
    },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Row - Logo, Title, Share */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
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
                className="bg-gray-100 border border-gray-300 rounded px-2 py-1 text-gray-900 text-lg font-medium focus:outline-none focus:border-blue-500 min-w-[200px]"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-gray-900 text-lg font-medium hover:bg-gray-100 px-2 py-1 rounded transition-colors text-left"
              >
                {state.documentTitle}
              </button>
            )}
            <div className="flex items-center gap-3 px-2">
              <span className="text-gray-500 text-xs">Tailwind Markdown Editor</span>
              <a
                href="/themes"
                className="text-blue-500 hover:text-blue-700 text-xs font-medium transition-colors"
              >
                Themes
              </a>
            </div>
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

          <div className="h-4 w-px bg-gray-300 mx-2" />

          {/* Formatting Toolbar */}
          <Tooltip id="h1-tooltip" />
          <button
            data-tooltip-id="h1-tooltip"
            data-tooltip-content="Heading 1"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(1)}
          >
            H1
          </button>
          <Tooltip id="h2-tooltip" />
          <button
            data-tooltip-id="h2-tooltip"
            data-tooltip-content="Heading 2"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(2)}
          >
            H2
          </button>
          <Tooltip id="h3-tooltip" />
          <button
            data-tooltip-id="h3-tooltip"
            data-tooltip-content="Heading 3"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors font-bold text-sm"
            onClick={() => onInsertHeading?.(3)}
          >
            H3
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="bold-tooltip" />
          <button
            data-tooltip-id="bold-tooltip"
            data-tooltip-content="Bold"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertBold}
          >
            <FaBold className="text-sm" />
          </button>
          <Tooltip id="italic-tooltip" />
          <button
            data-tooltip-id="italic-tooltip"
            data-tooltip-content="Italic"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertItalic}
          >
            <FaItalic className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="link-tooltip" />
          <button
            data-tooltip-id="link-tooltip"
            data-tooltip-content="Insert Link"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertLink}
          >
            <FaLink className="text-sm" />
          </button>
          <Tooltip id="image-tooltip" />
          <button
            data-tooltip-id="image-tooltip"
            data-tooltip-content="Insert Image"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertImage}
          >
            <FaImage className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="ul-tooltip" />
          <button
            data-tooltip-id="ul-tooltip"
            data-tooltip-content="Bulleted List"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertUnorderedList}
          >
            <FaListUl className="text-sm" />
          </button>
          <Tooltip id="ol-tooltip" />
          <button
            data-tooltip-id="ol-tooltip"
            data-tooltip-content="Numbered List"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertOrderedList}
          >
            <FaListOl className="text-sm" />
          </button>

          <div className="h-4 w-px bg-gray-300 mx-1" />

          <Tooltip id="quote-tooltip" />
          <button
            data-tooltip-id="quote-tooltip"
            data-tooltip-content="Insert Quote"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertQuote}
          >
            <FaQuoteLeft className="text-sm" />
          </button>
          <Tooltip id="table-tooltip" />
          <button
            data-tooltip-id="table-tooltip"
            data-tooltip-content="Insert Table"
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            onClick={onInsertTable}
          >
            <FaTable className="text-sm" />
          </button>
        </div>

        {/* Right - View Mode Toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-1">
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'edit'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onEditionModeChange('edit')}
          >
            <FaEdit className="text-xs" />
            <span>Edit</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'split'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => onEditionModeChange('split')}
          >
            <FaColumns className="text-xs" />
            <span>Split</span>
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all ${
              editionMode === 'preview'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
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

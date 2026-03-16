import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FaFileAlt,
  FaPlus,
  FaStar,
  FaClock,
  FaTrash,
  FaFolder,
  FaTh,
  FaList,
  FaSearch,
  FaFileImport,
  FaChevronDown,
} from 'react-icons/fa'
import { useDocumentsPage, DocumentViewFilter } from '../../hooks/useDocumentsPage'
import { DocumentCard } from './DocumentCard'
import { PageNavLinks } from '../shared'

const FILTER_LABELS: Record<DocumentViewFilter, string> = {
  all: 'My Documents',
  starred: 'Starred',
  recent: 'Recent',
  trash: 'Trash',
}

const FILTER_ICONS: Record<DocumentViewFilter, React.ReactNode> = {
  all: <FaFolder className="text-sm" />,
  starred: <FaStar className="text-sm" />,
  recent: <FaClock className="text-sm" />,
  trash: <FaTrash className="text-sm" />,
}

function NewDocumentDropdown({
  onNewDocument,
  onImportFile,
}: {
  onNewDocument: () => void
  onImportFile: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="p-3 relative" ref={ref}>
      <div className="flex">
        <button
          onClick={onNewDocument}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-l-lg transition-colors"
        >
          <FaPlus className="text-xs" />
          New Document
        </button>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center justify-center px-2 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-r-lg border-l border-blue-400 transition-colors"
          aria-label="More options"
        >
          <FaChevronDown className="text-[10px]" />
        </button>
      </div>

      {open && (
        <div className="absolute left-3 right-3 top-full mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 overflow-hidden">
          <button
            onClick={() => {
              setOpen(false)
              onNewDocument()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <FaPlus className="text-xs text-gray-500 dark:text-gray-400" />
            New Document
          </button>
          <button
            onClick={() => {
              setOpen(false)
              onImportFile()
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          >
            <FaFileImport className="text-xs text-gray-500 dark:text-gray-400" />
            Import from computer
          </button>
        </div>
      )}
    </div>
  )
}

export function DocumentsPage() {
  const {
    documents,
    loading,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    toggleStar,
    moveToTrash,
    restoreFromTrash,
    permanentDelete,
    viewMode,
    handleViewModeChange,
    handleNewDocument,
    handleOpenDocument,
    handleImportFile,
  } = useDocumentsPage()

  const sidebarItems: { key: DocumentViewFilter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'My Documents', icon: <FaFolder className="text-sm" /> },
    { key: 'recent', label: 'Recent', icon: <FaClock className="text-sm" /> },
    { key: 'starred', label: 'Starred', icon: <FaStar className="text-sm" /> },
    { key: 'trash', label: 'Trash', icon: <FaTrash className="text-sm" /> },
  ]

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Helmet>
        <title>My Documents - Markpad</title>
      </Helmet>

      {/* Top bar */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <FaFileAlt className="text-white text-sm" />
              </div>
              <span className="text-white font-semibold text-lg">Markpad</span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
              <input
                type="text"
                placeholder="Search in documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <PageNavLinks />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto">
          <NewDocumentDropdown onNewDocument={handleNewDocument} onImportFile={handleImportFile} />

          <nav className="flex-1 px-2 py-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors mb-0.5 ${
                  filter === item.key
                    ? 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-gray-500 dark:text-gray-400">{FILTER_ICONS[filter]}</span>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {FILTER_LABELS[filter]}
                </h1>
                {!loading && <span className="text-sm text-gray-500">({documents.length})</span>}
              </div>
              <div className="flex items-center gap-1 bg-gray-200 dark:bg-gray-800 rounded-lg p-0.5">
                <button
                  onClick={() => handleViewModeChange('grid')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="Grid view"
                >
                  <FaTh className="text-sm" />
                </button>
                <button
                  onClick={() => handleViewModeChange('list')}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                  title="List view"
                >
                  <FaList className="text-sm" />
                </button>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && documents.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  {filter === 'trash' ? (
                    <FaTrash className="text-2xl text-gray-400 dark:text-gray-600" />
                  ) : filter === 'starred' ? (
                    <FaStar className="text-2xl text-gray-400 dark:text-gray-600" />
                  ) : (
                    <FaFileAlt className="text-2xl text-gray-400 dark:text-gray-600" />
                  )}
                </div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {filter === 'trash'
                    ? 'Trash is empty'
                    : filter === 'starred'
                      ? 'No starred documents'
                      : searchQuery
                        ? 'No results found'
                        : 'No documents yet'}
                </h2>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  {filter === 'trash'
                    ? 'Documents you delete will appear here.'
                    : filter === 'starred'
                      ? 'Star documents to find them quickly.'
                      : searchQuery
                        ? `No documents match "${searchQuery}".`
                        : 'Create your first document to get started.'}
                </p>
                {filter === 'all' && !searchQuery && (
                  <button
                    onClick={handleNewDocument}
                    className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FaPlus className="text-xs" />
                    Create Document
                  </button>
                )}
              </div>
            )}

            {/* Document cards */}
            {!loading && documents.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-2'
                }
              >
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    viewMode={viewMode}
                    onOpen={handleOpenDocument}
                    onToggleStar={toggleStar}
                    onTrash={moveToTrash}
                    onRestore={filter === 'trash' ? restoreFromTrash : undefined}
                    onPermanentDelete={filter === 'trash' ? permanentDelete : undefined}
                    isTrashed={filter === 'trash'}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

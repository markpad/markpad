import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FaFileAlt,
  FaPlus,
  FaTh,
  FaList,
  FaSearch,
  FaLock,
  FaUser,
  FaLayerGroup,
} from 'react-icons/fa'
import { useTemplatesPage, TemplateViewFilter } from '../../hooks/useTemplatesPage'
import { TemplateCard } from './TemplateCard'
import { PageNavLinks } from '../shared'

const FILTER_LABELS: Record<TemplateViewFilter, string> = {
  all: 'All Templates',
  system: 'System Templates',
  custom: 'My Templates',
}

const FILTER_ICONS: Record<TemplateViewFilter, React.ReactNode> = {
  all: <FaLayerGroup className="text-sm" />,
  system: <FaLock className="text-sm" />,
  custom: <FaUser className="text-sm" />,
}

export function TemplatesPage() {
  const {
    templates,
    loading,
    filter,
    searchQuery,
    setFilter,
    setSearchQuery,
    viewMode,
    handleViewModeChange,
    handleUseTemplate,
    handleEditTemplate,
    handleNewTemplate,
  } = useTemplatesPage()

  const sidebarItems: { key: TemplateViewFilter; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All Templates', icon: <FaLayerGroup className="text-sm" /> },
    { key: 'system', label: 'System', icon: <FaLock className="text-sm" /> },
    { key: 'custom', label: 'My Templates', icon: <FaUser className="text-sm" /> },
  ]

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Helmet>
        <title>Templates - Markpad</title>
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
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500 dark:focus:border-purple-400 transition-colors"
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
          <div className="p-3">
            <button
              onClick={handleNewTemplate}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FaPlus className="text-xs" />
              New Template
            </button>
          </div>

          <nav className="flex-1 px-2 py-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setFilter(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors mb-0.5 ${
                  filter === item.key
                    ? 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400'
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
                {!loading && <span className="text-sm text-gray-500">({templates.length})</span>}
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
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && templates.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4">
                  <FaLayerGroup className="text-2xl text-gray-400 dark:text-gray-600" />
                </div>
                <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {searchQuery ? 'No results found' : 'No templates yet'}
                </h2>
                <p className="text-sm text-gray-500 mb-6 max-w-sm">
                  {searchQuery
                    ? `No templates match "${searchQuery}".`
                    : 'Create your first template to get started.'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleNewTemplate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    <FaPlus className="text-xs" />
                    Create Template
                  </button>
                )}
              </div>
            )}

            {/* Template cards */}
            {!loading && templates.length > 0 && (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                    : 'flex flex-col gap-2'
                }
              >
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    viewMode={viewMode}
                    onUseTemplate={handleUseTemplate}
                    onEditTemplate={handleEditTemplate}
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

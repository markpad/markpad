import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import {
  FaFileAlt,
  FaTh,
  FaList,
  FaSearch,
  FaPalette,
  FaHeart,
  FaRegHeart,
  FaEdit,
  FaStar,
  FaUser,
  FaLayerGroup,
  FaTrash,
} from 'react-icons/fa'
import type { ThemePreset } from '@/data/themes.generated'
import type { MarkpadCustomTheme } from '@/lib/repositories/types'
import { useThemesPage, SidebarFilter } from '@/hooks/useThemesPage'
import { getTextColorClass } from '@/components/themes/themeUtils'
import { CompactPreview } from '@/components/themes/ThemeCardCompact'
import {
  PageNavLinks,
  EmptyState,
  ThemesIllustration,
  SearchIllustration,
  StarredThemesIllustration,
} from '@/components/shared'

export function ThemesPage() {
  const navigate = useNavigate()
  const {
    searchQuery,
    setSearchQuery,
    sidebarFilter,
    categoryTab,
    setCategoryTab,
    viewMode,
    handleViewModeChange,
    displayThemes,
    filteredCustomThemes,
    showCategoryTabs,
    headerCount,
    headerTitle,
    sidebarItems,
    categoryTabs,
    isFavorite,
    toggleFavorite,
    handleSidebarFilterClick,
    handleApplyTheme,
    handleEditTheme,
    handleDeleteCustomTheme,
  } = useThemesPage()

  // Build sidebar items with icons (icons can't be in the hook due to JSX)
  const sidebarItemsWithIcons: {
    key: SidebarFilter
    label: string
    icon: React.ReactNode
    count?: number
  }[] = [
    { key: 'all', label: 'All Themes', icon: <FaPalette className="text-sm" /> },
    { key: 'system', label: 'System', icon: <FaLayerGroup className="text-sm" /> },
    {
      key: 'starred',
      label: 'Starred',
      icon: <FaStar className="text-sm" />,
      count: sidebarItems.find((i) => i.key === 'starred')?.count,
    },
    {
      key: 'my-themes',
      label: 'My Themes',
      icon: <FaUser className="text-sm" />,
      count: sidebarItems.find((i) => i.key === 'my-themes')?.count,
    },
  ]

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Helmet>
        <title>Themes - Markpad</title>
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
                placeholder="Search themes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-900 dark:text-gray-200 placeholder-gray-500 focus:outline-none focus:border-fuchsia-500 dark:focus:border-fuchsia-400 transition-colors"
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
            <Link
              to="/theme-editor/new"
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-fuchsia-500 hover:bg-fuchsia-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <FaEdit className="text-xs" />
              New Custom Theme
            </Link>
          </div>

          <nav className="flex-1 px-2 py-1">
            {sidebarItemsWithIcons.map((item) => (
              <button
                key={item.key}
                onClick={() => handleSidebarFilterClick(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors mb-0.5 ${
                  sidebarFilter === item.key && !searchQuery
                    ? 'bg-fuchsia-100 dark:bg-fuchsia-500/15 text-fuchsia-600 dark:text-fuchsia-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="text-[10px] bg-gray-200 dark:bg-gray-700 text-gray-500 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-6 py-6">
            {/* Header row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FaPalette className="text-gray-500 dark:text-gray-400" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {headerTitle}
                </h1>
                <span className="text-sm text-gray-500">({headerCount})</span>
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

            {/* Category tabs - shown for all/system/starred */}
            {showCategoryTabs && (
              <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-700 pb-px overflow-x-auto">
                <button
                  onClick={() => setCategoryTab('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 -mb-px ${
                    categoryTab === 'all'
                      ? 'border-fuchsia-500 dark:border-fuchsia-400 text-fuchsia-600 dark:text-fuchsia-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  All
                </button>
                {categoryTabs.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setCategoryTab(cat.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap border-b-2 -mb-px ${
                      categoryTab === cat.value
                        ? 'border-fuchsia-500 dark:border-fuchsia-400 text-fuchsia-600 dark:text-fuchsia-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* ── My Themes (custom themes from IndexedDB) ── */}
            {sidebarFilter === 'my-themes' && (
              <>
                {filteredCustomThemes.length === 0 ? (
                  searchQuery ? (
                    <EmptyState
                      illustration={<SearchIllustration className="w-full h-full" />}
                      title="No results found"
                      description={`No custom themes match "${searchQuery}". Try a different search term.`}
                      secondaryAction={{ label: 'Clear search', onClick: () => setSearchQuery('') }}
                    />
                  ) : (
                    <EmptyState
                      illustration={<ThemesIllustration className="w-full h-full" />}
                      title="No custom themes yet"
                      description="Create your own themes by customizing colors, fonts, and spacing. Start from scratch or base it on an existing theme."
                      action={{
                        label: 'Create your first theme',
                        onClick: () => navigate('/theme-editor/new'),
                        color: 'bg-fuchsia-500 hover:bg-fuchsia-600',
                      }}
                    />
                  )
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredCustomThemes.map((theme) => (
                      <CustomThemeGridCard
                        key={theme.id}
                        theme={theme}
                        onEdit={() => navigate(`/theme-editor/${theme.id}`)}
                        onDelete={() => handleDeleteCustomTheme(theme.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {filteredCustomThemes.map((theme) => (
                      <CustomThemeListCard
                        key={theme.id}
                        theme={theme}
                        onEdit={() => navigate(`/theme-editor/${theme.id}`)}
                        onDelete={() => handleDeleteCustomTheme(theme.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── System / All / Starred themes ── */}
            {sidebarFilter !== 'my-themes' && (
              <>
                {displayThemes.length === 0 ? (
                  searchQuery ? (
                    <EmptyState
                      illustration={<SearchIllustration className="w-full h-full" />}
                      title="No results found"
                      description={`No themes match "${searchQuery}". Try a different search term.`}
                      secondaryAction={{ label: 'Clear search', onClick: () => setSearchQuery('') }}
                    />
                  ) : sidebarFilter === 'starred' ? (
                    <EmptyState
                      illustration={<StarredThemesIllustration className="w-full h-full" />}
                      title="No starred themes"
                      description="Star your favorite themes to find them quickly. Click the heart icon on any theme card."
                      secondaryAction={{
                        label: 'Browse all themes',
                        onClick: () => handleSidebarFilterClick('all'),
                      }}
                    />
                  ) : (
                    <EmptyState
                      illustration={<ThemesIllustration className="w-full h-full" />}
                      title="No themes in this category"
                      description="Try a different category or browse all themes."
                      secondaryAction={{
                        label: 'View all themes',
                        onClick: () => handleSidebarFilterClick('all'),
                      }}
                    />
                  )
                ) : viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {displayThemes.map((theme) => (
                      <ThemeGridCard
                        key={theme.id}
                        theme={theme}
                        isFavorite={isFavorite(theme.id)}
                        onApply={handleApplyTheme}
                        onEdit={handleEditTheme}
                        onToggleFavorite={() => toggleFavorite(theme.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {displayThemes.map((theme) => (
                      <ThemeListCard
                        key={theme.id}
                        theme={theme}
                        isFavorite={isFavorite(theme.id)}
                        onApply={handleApplyTheme}
                        onEdit={handleEditTheme}
                        onToggleFavorite={() => toggleFavorite(theme.id)}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// ── System Theme Grid Card ─────────────────────────────────────────

interface ThemeCardActionProps {
  theme: ThemePreset
  isFavorite: boolean
  onApply: (theme: ThemePreset) => void
  onEdit: (theme: ThemePreset) => void
  onToggleFavorite: () => void
}

function ThemeGridCard({
  theme,
  isFavorite,
  onApply,
  onEdit,
  onToggleFavorite,
}: ThemeCardActionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all group relative shadow-sm">
      {/* Favorite button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onToggleFavorite()
        }}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full transition-all ${
          isFavorite
            ? 'bg-red-100 dark:bg-red-500/20 text-red-500 dark:text-red-400'
            : 'bg-white/80 dark:bg-gray-900/60 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400'
        }`}
        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorite ? <FaHeart className="w-3 h-3" /> : <FaRegHeart className="w-3 h-3" />}
      </button>

      {/* Preview Area */}
      <CompactPreview theme={theme} />

      {/* Info */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white font-medium text-sm mb-0.5 truncate">
          {theme.name}
        </h3>
        <p className="text-gray-500 text-xs line-clamp-1 mb-3">{theme.description}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onApply(theme)}
            className="flex-1 py-1.5 px-3 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-fuchsia-500 hover:text-white transition-colors"
          >
            Use Theme
          </button>
          <button
            onClick={() => onEdit(theme)}
            className="py-1.5 px-3 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-white transition-colors"
            title="Edit in Theme Editor"
          >
            <FaEdit className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── System Theme List Card ─────────────────────────────────────────

function ThemeListCard({
  theme,
  isFavorite,
  onApply,
  onEdit,
  onToggleFavorite,
}: ThemeCardActionProps) {
  const { tailwindClasses, fontFamily } = theme

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all group shadow-sm">
      {/* Mini preview swatch */}
      <div
        className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${tailwindClasses.body}`}
        style={{ fontFamily }}
      >
        <span className={`text-lg font-bold ${getTextColorClass(tailwindClasses.h1)}`}>Aa</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-900 dark:text-white text-sm font-medium truncate">{theme.name}</h3>
        <p className="text-gray-500 text-xs truncate">{theme.description}</p>
      </div>

      {/* Category badge */}
      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex-shrink-0">
        {theme.category}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onToggleFavorite}
          className={`p-1.5 rounded-md transition-colors ${
            isFavorite
              ? 'text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300'
              : 'text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 hover:text-red-500 dark:hover:text-red-400'
          }`}
        >
          {isFavorite ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
        </button>
        <button
          onClick={() => onApply(theme)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-fuchsia-500 hover:text-white transition-colors"
        >
          Use
        </button>
        <button
          onClick={() => onEdit(theme)}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-white transition-colors"
          title="Edit in Theme Editor"
        >
          <FaEdit className="text-xs" />
        </button>
      </div>
    </div>
  )
}

// ── Custom Theme Grid Card ─────────────────────────────────────────

interface CustomThemeCardProps {
  theme: MarkpadCustomTheme
  onEdit: () => void
  onDelete: () => void
}

function CustomThemeGridCard({ theme, onEdit, onDelete }: CustomThemeCardProps) {
  const bodyBg = theme.configs?.body?.bgColor || 'bg-gray-100'
  const h1Color = theme.configs?.h1?.textColor || 'text-gray-900'

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all group relative shadow-sm">
      {/* Preview swatch */}
      <div className={`h-28 p-3 flex flex-col justify-end overflow-hidden ${bodyBg}`}>
        <span className={`text-sm font-semibold truncate ${h1Color}`}>{theme.name}</span>
        <span className="text-[10px] text-gray-500 mt-1">
          {theme.basedOnPresetId ? `Based on ${theme.basedOnPresetId}` : 'Custom theme'}
        </span>
      </div>

      {/* Info */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-gray-900 dark:text-white font-medium text-sm mb-0.5 truncate">
          {theme.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3">Updated {theme.updatedAt.toLocaleDateString()}</p>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 py-1.5 px-3 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-fuchsia-500 hover:text-white transition-colors"
          >
            Edit Theme
          </button>
          <button
            onClick={onDelete}
            className="py-1.5 px-3 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
            title="Delete theme"
          >
            <FaTrash className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Custom Theme List Card ─────────────────────────────────────────

function CustomThemeListCard({ theme, onEdit, onDelete }: CustomThemeCardProps) {
  const bodyBg = theme.configs?.body?.bgColor || 'bg-gray-100'
  const h1Color = theme.configs?.h1?.textColor || 'text-gray-900'

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all group shadow-sm">
      {/* Mini preview swatch */}
      <div
        className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center ${bodyBg}`}
      >
        <span className={`text-lg font-bold ${h1Color}`}>Aa</span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-gray-900 dark:text-white text-sm font-medium truncate">{theme.name}</h3>
        <p className="text-gray-500 text-xs truncate">
          {theme.basedOnPresetId ? `Based on ${theme.basedOnPresetId}` : 'Custom theme'} · Updated{' '}
          {theme.updatedAt.toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onEdit}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-fuchsia-500 hover:text-white transition-colors"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-red-500 hover:text-white transition-colors"
          title="Delete theme"
        >
          <FaTrash className="text-xs" />
        </button>
      </div>
    </div>
  )
}

export default ThemesPage

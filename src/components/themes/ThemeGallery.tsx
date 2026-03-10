import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { FaSearch, FaPalette, FaFileAlt, FaShare } from 'react-icons/fa'
import { ThemeCard } from './ThemeCard'
import { filterThemesByCategory, searchThemes, THEME_CATEGORIES } from '../../data/themes.generated'
import type { ThemePreset, ThemeCategory } from '../../data/themes.generated'
import { encodeState, defaultDocumentTitle } from '../../services/urlStateService'

/**
 * Theme Gallery page - displays pre-configured theme presets
 * Users can browse, search, filter, and apply themes
 */
export function ThemeGallery() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('all')
  const [appliedThemeId, setAppliedThemeId] = useState<string | null>(null)

  const filteredThemes = useMemo(() => {
    let themes: ThemePreset[]
    if (searchQuery.trim()) {
      themes = searchThemes(searchQuery)
    } else {
      themes = filterThemesByCategory(activeCategory)
    }
    return themes
  }, [searchQuery, activeCategory])

  const handleApplyTheme = (theme: ThemePreset) => {
    setAppliedThemeId(theme.id)

    // Encode the theme's state with its example content and navigate to editor
    const state = {
      markdown: theme.exampleContent,
      documentTitle: defaultDocumentTitle,
      tailwindClasses: theme.tailwindClasses,
      behaviorConfig: theme.behaviorConfig,
      fontConfig: theme.fontConfig,
    }
    const encoded = encodeState(state)
    navigate(`/editor#${encoded}`)
  }

  const handleCreateCustomTheme = () => {
    navigate('/editor')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Helmet>
        <title>Theme Gallery - Marklab</title>
        <meta
          name="description"
          content="Browse and apply pre-configured Tailwind CSS themes for your markdown."
        />
      </Helmet>

      {/* Header / Navbar */}
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <FaFileAlt className="text-white text-sm" />
              </div>
              <span className="text-white font-semibold text-lg">Marklab</span>
            </a>

            {/* Nav Links */}
            <nav className="hidden sm:flex items-center gap-1">
              <a
                href="/editor"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
              >
                Editor
              </a>
              <a
                href="/themes"
                className="px-3 py-1.5 text-sm text-blue-400 font-medium rounded-md bg-gray-800/50"
              >
                Themes
              </a>
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3"></div>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Page Title */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">Theme Gallery</h1>
            <p className="text-gray-400 text-lg max-w-xl">
              Personalize your writing experience with professionally crafted Tailwind CSS presets.
              Each theme is optimized for readability and aesthetic precision.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search themes by name or style (e.g. Modern, Dark, Minimalist)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-11 pr-4 py-3.5 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {THEME_CATEGORIES.map((category) => (
            <button
              key={category.value}
              onClick={() => {
                setActiveCategory(category.value)
                setSearchQuery('')
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === category.value && !searchQuery
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Theme Grid */}
        {filteredThemes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map((theme) => (
              <ThemeCard
                key={theme.id}
                theme={theme}
                isActive={appliedThemeId === theme.id}
                onApply={handleApplyTheme}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No themes found matching "{searchQuery}".</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('all')
              }}
              className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
            >
              Clear search
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between text-sm text-gray-500">
          <p>© 2026 Marklab</p>
          <div className="flex items-center gap-6">
            <a href="#docs" className="hover:text-gray-300 transition-colors">
              Documentation
            </a>
            <a href="#api" className="hover:text-gray-300 transition-colors">
              API Reference
            </a>
            <a href="#community" className="hover:text-gray-300 transition-colors">
              Community Themes
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ThemeGallery

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowLeft,
  FaDownload,
  FaCopy,
  FaCheck,
  FaSun,
  FaMoon,
  FaPalette,
  FaChevronDown,
  FaChevronRight,
  FaFolderOpen,
  FaMousePointer,
  FaFileCode,
  FaFileAlt,
  FaExchangeAlt,
  FaSave,
} from 'react-icons/fa'
import {
  type ThemeElement,
  type ElementConfig,
  ELEMENT_CATEGORIES,
  ELEMENT_SCHEMAS,
  configToClasses,
  classesToConfig,
} from './types'
import { ElementConfigPanel } from './ElementConfigPanel'
import { LivePreview } from './LivePreview'
import { ThemeSelectorModal } from './ThemeSelectorModal'
import { ReplaceColorsModal } from './ReplaceColorsModal'
import {
  getThemeEditorStateFromUrl,
  updateThemeEditorUrl,
  getDarkModeFromStorage,
  saveDarkModeToStorage,
} from './urlStateService'
import debounce from '../../utils/debounce'
import type { ThemePreset } from '../../data/themes.generated'

// Initialize configs with defaults
function getInitialConfigs(): Record<ThemeElement, ElementConfig> {
  const configs: Partial<Record<ThemeElement, ElementConfig>> = {}
  for (const [element, schema] of Object.entries(ELEMENT_SCHEMAS)) {
    configs[element as ThemeElement] = { ...schema.defaults }
  }
  return configs as Record<ThemeElement, ElementConfig>
}

// Get initial state from URL or defaults
function getInitialState() {
  const urlState = getThemeEditorStateFromUrl()
  if (urlState) {
    return {
      themeName: urlState.themeName,
      selectedElement: urlState.selectedElement,
      configs: urlState.configs,
      darkMode: urlState.darkMode,
    }
  }
  return {
    themeName: 'My Custom Theme',
    selectedElement: 'h1' as ThemeElement,
    configs: getInitialConfigs(),
    darkMode: getDarkModeFromStorage(),
  }
}

export function ThemeEditorPage() {
  const initialState = useRef(getInitialState()).current
  const [isInitialized, setIsInitialized] = useState(false)

  const [themeName, setThemeName] = useState(initialState.themeName)
  const [selectedElement, setSelectedElement] = useState<ThemeElement>(initialState.selectedElement)
  const [configs, setConfigs] = useState<Record<ThemeElement, ElementConfig>>(initialState.configs)
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    Container: true,
    Headings: true,
    Text: true,
    Links: true,
    Lists: false,
    Quote: false,
    Code: false,
    Table: false,
    Media: false,
  })
  const [copied, setCopied] = useState(false)
  const [darkMode, setDarkMode] = useState(initialState.darkMode)
  const [showThemeSelector, setShowThemeSelector] = useState(false)
  const [showReplaceColors, setShowReplaceColors] = useState(false)
  const [inspectMode, setInspectMode] = useState(false)
  const [savedNotification, setSavedNotification] = useState(false)

  // Debounced URL update to prevent too many history changes
  const debouncedUpdateUrl = useRef(
    debounce(
      (state: {
        themeName: string
        selectedElement: ThemeElement
        configs: Record<ThemeElement, ElementConfig>
        darkMode: boolean
      }) => {
        updateThemeEditorUrl(state)
      },
      500
    )
  ).current

  // Update URL when state changes
  useEffect(() => {
    if (isInitialized) {
      debouncedUpdateUrl({ themeName, selectedElement, configs, darkMode })
    }
  }, [themeName, selectedElement, configs, darkMode, isInitialized, debouncedUpdateUrl])

  // Save dark mode to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      saveDarkModeToStorage(darkMode)
    }
  }, [darkMode, isInitialized])

  // Mark as initialized after first render
  useEffect(() => {
    setIsInitialized(true)
  }, [])

  // Update a single element's config
  const updateConfig = useCallback((element: ThemeElement, config: ElementConfig) => {
    setConfigs((prev) => ({
      ...prev,
      [element]: config,
    }))
  }, [])

  // Load theme from preset
  const loadThemePreset = useCallback((theme: ThemePreset) => {
    const newConfigs = getInitialConfigs()
    // Parse theme tailwindClasses and apply to configs
    if (theme.tailwindClasses) {
      for (const [element, classString] of Object.entries(theme.tailwindClasses)) {
        if (element in newConfigs) {
          // Parse the class string into individual config fields
          // This properly extracts fontSize, textColor, etc. from the classes
          newConfigs[element as ThemeElement] = classesToConfig(
            classString as string,
            element as ThemeElement
          )
        }
      }
    }
    setConfigs(newConfigs)
    // Only update theme name if current name is the default
    setThemeName((prev) => (prev === 'My Custom Theme' ? theme.name : prev))
  }, [])

  // Toggle category expansion
  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  // Generate theme JSON
  const themeJSON = useMemo(() => {
    const classes: Record<string, string> = {}
    for (const [element, config] of Object.entries(configs)) {
      const classString = configToClasses(config, element as ThemeElement)
      if (classString) {
        classes[element] = classString
      }
    }

    return {
      id: themeName.toLowerCase().replace(/\s+/g, '-'),
      name: themeName,
      description: 'Custom theme created with Theme Editor',
      category: 'custom',
      fontFamily: 'Inter',
      classes,
    }
  }, [configs, themeName])

  // Generate YAML format (compatible with theme files)
  const generateYAML = useCallback(() => {
    const lines: string[] = [
      '---',
      `id: ${themeJSON.id}`,
      `name: ${themeJSON.name}`,
      `description: ${themeJSON.description}`,
      `category: ${themeJSON.category}`,
      `fontFamily: ${themeJSON.fontFamily}`,
      '',
      'preview:',
      "  bgColor: '#ffffff'",
      "  textColor: '#1f2937'",
      "  accentColor: '#3b82f6'",
      `  headingFont: ${themeJSON.fontFamily}`,
      `  bodyFont: ${themeJSON.fontFamily}`,
      `  sampleHeading: ${themeJSON.name}`,
      '  sampleText: Custom theme created with Theme Editor.',
      '  style: clean',
      '',
      'behavior:',
      '  shouldOpenLinksInNewTab: true',
      '  shouldShowLineNumbers: true',
      '',
      'classes:',
    ]

    for (const [element, classString] of Object.entries(themeJSON.classes)) {
      lines.push(`  ${element}: ${classString}`)
    }

    lines.push('---', '', `# ${themeJSON.name}`, '', 'Your content goes here.')

    return lines.join('\n')
  }, [themeJSON])

  // Copy theme to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(themeJSON, null, 2))
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy')
    }
  }

  // Download theme as JSON (compatible with /editor)
  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(themeJSON, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeJSON.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Download theme as YAML (markdown file, compatible with default themes)
  const downloadYAML = () => {
    const yaml = generateYAML()
    const blob = new Blob([yaml], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${themeJSON.id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // State for download dropdown
  const [showDownloadMenu, setShowDownloadMenu] = useState(false)

  // Save theme to localStorage (shared with /editor)
  const LOCAL_THEMES_KEY = 'marklab-local-themes'

  const saveToLocalThemes = useCallback(() => {
    try {
      // Load existing local themes
      const stored = localStorage.getItem(LOCAL_THEMES_KEY)
      const existingThemes = stored ? JSON.parse(stored) : []

      // Create the new local theme
      const newTheme = {
        id: `local-${Date.now()}`,
        name: themeName,
        description: 'Theme created with Theme Editor',
        category: 'experimental',
        fontFamily: themeJSON.fontFamily,
        tailwindClasses: themeJSON.classes,
        behaviorConfig: {
          shouldOpenLinksInNewTab: true,
          shouldShowLineNumbers: true,
        },
        fontConfig: {
          headingFont: themeJSON.fontFamily,
          bodyFont: themeJSON.fontFamily,
          codeFont: 'Fira Code',
        },
        preview: {
          bgColor: '#ffffff',
          textColor: '#374151',
          accentColor: '#3b82f6',
          headingFont: themeJSON.fontFamily,
          bodyFont: themeJSON.fontFamily,
          sampleHeading: themeName,
          sampleText: 'Theme created with Theme Editor',
          style: 'default' as const,
        },
        exampleContent: '',
        isLocal: true,
        createdAt: Date.now(),
      }

      // Add to existing themes
      const updatedThemes = [...existingThemes, newTheme]
      localStorage.setItem(LOCAL_THEMES_KEY, JSON.stringify(updatedThemes))

      // Show notification
      setSavedNotification(true)
      setTimeout(() => setSavedNotification(false), 2000)
    } catch (e) {
      console.error('Failed to save local theme:', e)
    }
  }, [themeName, themeJSON])

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${darkMode ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
            >
              <FaArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back</span>
            </Link>
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-700" />
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FaPalette className="w-4 h-4 text-blue-500" />
              Theme Editor
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Name Input */}
            <input
              type="text"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Theme name..."
            />

            {/* Load Theme Button */}
            <button
              onClick={() => setShowThemeSelector(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <FaFolderOpen className="w-3 h-3" />
              Load Theme
            </button>

            {/* Replace Colors Button */}
            <button
              onClick={() => setShowReplaceColors(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Find and replace colors across all elements"
            >
              <FaExchangeAlt className="w-3 h-3" />
              Replace Colors
            </button>

            {/* Save to Local Themes */}
            <button
              onClick={saveToLocalThemes}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              title="Save theme to local storage (usable in /editor)"
            >
              {savedNotification ? (
                <>
                  <FaCheck className="w-3 h-3 text-green-500" />
                  Saved!
                </>
              ) : (
                <>
                  <FaSave className="w-3 h-3" />
                  Save Local
                </>
              )}
            </button>

            {/* Inspect Mode Toggle */}
            <button
              onClick={() => setInspectMode(!inspectMode)}
              className={`p-2 rounded-md transition-colors ${
                inspectMode
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
              title={inspectMode ? 'Disable inspect mode' : 'Enable inspect mode'}
            >
              <FaMousePointer className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title={darkMode ? 'Switch to light mode preview' : 'Switch to dark mode preview'}
            >
              {darkMode ? <FaSun className="w-4 h-4" /> : <FaMoon className="w-4 h-4" />}
            </button>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? (
                <>
                  <FaCheck className="w-3 h-3 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <FaCopy className="w-3 h-3" />
                  Copy JSON
                </>
              )}
            </button>

            {/* Download Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <FaDownload className="w-3 h-3" />
                Download
                <FaChevronDown className="w-3 h-3" />
              </button>
              {showDownloadMenu && (
                <>
                  {/* Backdrop to close menu */}
                  <div className="fixed inset-0 z-10" onClick={() => setShowDownloadMenu(false)} />
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                    <button
                      onClick={() => {
                        downloadJSON()
                        setShowDownloadMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
                    >
                      <FaFileCode className="w-4 h-4" />
                      Download JSON
                    </button>
                    <button
                      onClick={() => {
                        downloadYAML()
                        setShowDownloadMenu(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md"
                    >
                      <FaFileAlt className="w-4 h-4" />
                      Download markdown
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden bg-gray-100 dark:bg-gray-950">
        {/* Left Sidebar - Element List */}
        <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <div className="p-3">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Elements
            </h2>
            <nav className="space-y-1">
              {ELEMENT_CATEGORIES.map((category) => {
                const CategoryIcon = category.icon
                return (
                  <div key={category.name}>
                    {/* Category Header */}
                    <button
                      onClick={() => toggleCategory(category.name)}
                      className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
                    >
                      {expandedCategories[category.name] ? (
                        <FaChevronDown className="w-3 h-3 text-gray-400" />
                      ) : (
                        <FaChevronRight className="w-3 h-3 text-gray-400" />
                      )}
                      <CategoryIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                      <span>{category.name}</span>
                    </button>

                    {/* Category Elements */}
                    {expandedCategories[category.name] && (
                      <div className="ml-4 mt-1 space-y-0.5">
                        {category.elements.map((element) => (
                          <button
                            key={element}
                            onClick={() => setSelectedElement(element)}
                            className={`w-full text-left px-2 py-1 text-sm rounded-md transition-colors ${
                              selectedElement === element
                                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            }`}
                          >
                            {element}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Center - Element Configuration */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          <ElementConfigPanel
            element={selectedElement}
            config={configs[selectedElement]}
            onChange={(config) => updateConfig(selectedElement, config)}
          />
        </div>

        {/* Right - Live Preview */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2 flex-shrink-0 flex items-center justify-between">
            <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Preview</h2>
            {inspectMode && (
              <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <FaMousePointer className="w-3 h-3" />
                Click an element to edit
              </span>
            )}
          </div>
          <div className={`flex-1 overflow-auto ${inspectMode ? 'cursor-crosshair' : ''}`}>
            <LivePreview
              configs={configs}
              highlightElement={selectedElement}
              inspectMode={inspectMode}
              onSelectElement={(element) => {
                setSelectedElement(element)
              }}
            />
          </div>
        </div>
      </div>

      {/* Theme Selector Modal */}
      <ThemeSelectorModal
        isOpen={showThemeSelector}
        onClose={() => setShowThemeSelector(false)}
        onSelectTheme={loadThemePreset}
        currentThemeId={themeJSON.id}
      />

      {/* Replace Colors Modal */}
      <ReplaceColorsModal
        isOpen={showReplaceColors}
        onClose={() => setShowReplaceColors(false)}
        configs={configs}
        onReplace={setConfigs}
      />
    </div>
  )
}

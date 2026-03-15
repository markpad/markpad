/**
 * Pre-build script to generate themes.ts from theme folders
 * Each theme has: config.json (metadata + classes) and example.md (sample content)
 * Run with: node scripts/generateThemes.js
 */

const fs = require('fs')
const path = require('path')

const THEMES_DIR = path.join(__dirname, '../src/themes')
const OUTPUT_FILE = path.join(__dirname, '../src/data/themes.generated.ts')

function generateThemes() {
  // Get all theme folders (directories that contain config.json)
  const themeFolders = fs.readdirSync(THEMES_DIR).filter((item) => {
    const itemPath = path.join(THEMES_DIR, item)
    return fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, 'config.json'))
  })

  const themes = themeFolders.map((folder) => {
    const themeDir = path.join(THEMES_DIR, folder)

    // Read config.json
    const config = JSON.parse(fs.readFileSync(path.join(themeDir, 'config.json'), 'utf-8'))

    // Read example.md
    const exampleContent = fs.readFileSync(path.join(themeDir, 'example.md'), 'utf-8').trim()

    return {
      id: config.id,
      name: config.name,
      description: config.description,
      category: config.category,
      fontFamily: config.fontFamily,
      tailwindClasses: config.classes,
      fontConfig: { fontFamily: config.fontFamily },
      preview: config.preview,
      exampleContent,
    }
  })

  const output = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from src/themes/*/config.json + example.md files
// Run 'npm run generate:themes' to regenerate

import type { TailwindClasses, FontConfig } from '../types'

export interface ThemePreset {
  id: string
  name: string
  description: string
  category: ThemeCategory
  fontFamily: string
  tailwindClasses: TailwindClasses
  fontConfig: FontConfig
  preview: ThemePreview
  exampleContent: string
}

export interface ThemePreview {
  bgColor: string
  textColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  sampleHeading: string
  sampleText: string
  style?: 'serif' | 'sans' | 'mono' | 'brutalist' | 'minimal' | 'default'
}

export type ThemeCategory =
  | 'all'
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'accessibility'
  | 'experimental'

export const THEME_CATEGORIES: { value: ThemeCategory; label: string }[] = [
  { value: 'all', label: 'All Themes' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-Serif' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'experimental', label: 'Experimental' },
]

export const themePresets: ThemePreset[] = ${JSON.stringify(themes, null, 2)}

/**
 * Get a theme by ID
 */
export function getThemeById(id: string): ThemePreset | undefined {
  return themePresets.find((theme) => theme.id === id)
}

/**
 * Filter themes by category
 */
export function filterThemesByCategory(category: ThemeCategory): ThemePreset[] {
  if (category === 'all') return themePresets
  return themePresets.filter((theme) => theme.category === category)
}

/**
 * Search themes by name or description
 */
export function searchThemes(query: string): ThemePreset[] {
  const lowerQuery = query.toLowerCase()
  return themePresets.filter(
    (theme) =>
      theme.name.toLowerCase().includes(lowerQuery) ||
      theme.description.toLowerCase().includes(lowerQuery) ||
      theme.category.toLowerCase().includes(lowerQuery)
  )
}
`

  fs.writeFileSync(OUTPUT_FILE, output)
  console.log(`Generated ${themes.length} themes to ${OUTPUT_FILE}`)
}

generateThemes()

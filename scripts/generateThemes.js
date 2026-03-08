/**
 * Pre-build script to generate themes.ts from markdown theme files
 * Run with: node scripts/generateThemes.js
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const THEMES_DIR = path.join(__dirname, '../src/themes')
const OUTPUT_FILE = path.join(__dirname, '../src/data/themes.generated.ts')

function generateThemes() {
  const themeFiles = fs.readdirSync(THEMES_DIR).filter((f) => f.endsWith('.md'))

  const themes = themeFiles.map((file) => {
    const content = fs.readFileSync(path.join(THEMES_DIR, file), 'utf-8')
    const { data, content: markdownContent } = matter(content)

    return {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      fontFamily: data.fontFamily,
      tailwindClasses: data.classes,
      behaviorConfig: data.behavior,
      fontConfig: { fontFamily: data.fontFamily },
      preview: data.preview,
      exampleContent: markdownContent.trim(),
    }
  })

  const output = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from src/themes/*.md files
// Run 'npm run generate:themes' to regenerate

import type { TailwindClasses, BehaviorConfig, FontConfig } from '../types'

export interface ThemePreset {
  id: string
  name: string
  description: string
  category: ThemeCategory
  fontFamily: string
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
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

/**
 * Migration script to convert theme .md files to new folder structure
 * Run with: node scripts/migrateThemes.js
 */

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const THEMES_DIR = path.join(__dirname, '../src/themes')

function migrateThemes() {
  const themeFiles = fs.readdirSync(THEMES_DIR).filter((f) => f.endsWith('.md'))

  console.log(`Found ${themeFiles.length} themes to migrate`)

  themeFiles.forEach((file) => {
    const themeName = file.replace('.md', '')
    const content = fs.readFileSync(path.join(THEMES_DIR, file), 'utf-8')
    const { data, content: markdownContent } = matter(content)

    // Create theme folder
    const themeFolder = path.join(THEMES_DIR, themeName)
    if (!fs.existsSync(themeFolder)) {
      fs.mkdirSync(themeFolder, { recursive: true })
    }

    // Create config.json with theme metadata
    const config = {
      id: data.id,
      name: data.name,
      description: data.description,
      category: data.category,
      fontFamily: data.fontFamily,
      preview: data.preview,
      behavior: data.behavior,
      classes: data.classes,
    }

    fs.writeFileSync(path.join(themeFolder, 'config.json'), JSON.stringify(config, null, 2))

    // Create example.md with markdown content
    fs.writeFileSync(path.join(themeFolder, 'example.md'), markdownContent.trim())

    console.log(`✓ Migrated: ${themeName}`)
  })

  console.log('\nMigration complete!')
  console.log('You can now delete the old .md files with:')
  console.log('  rm src/themes/*.md')
}

migrateThemes()

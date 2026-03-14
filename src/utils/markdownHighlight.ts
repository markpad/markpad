/**
 * Markdown syntax highlighting using custom patterns with Tailwind classes
 * Provides colorful highlighting similar to markdownlivepreview.com
 */

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Tailwind classes for each syntax element
const tw = {
  // Headers - red/coral
  header: 'text-red-700 dark:text-red-400 font-bold',
  // Bold - orange
  bold: 'text-orange-700 dark:text-orange-400 font-bold',
  // Italic - purple
  italic: 'text-purple-700 dark:text-purple-400 italic',
  // Inline code - green with background
  inlineCode: 'text-green-700 dark:text-green-400 bg-green-500/10 rounded px-1',
  // Code fence markers
  codeFence: 'text-gray-500 dark:text-gray-500',
  // Code block content
  codeBlock: 'text-green-700 dark:text-green-400',
  // Link brackets
  linkBracket: 'text-gray-500 dark:text-gray-500',
  // Link text
  linkText: 'text-blue-700 dark:text-blue-400',
  // Link URL
  linkUrl: 'text-green-700 dark:text-green-400 underline',
  // Blockquote
  blockquote: 'text-gray-500 dark:text-gray-500 italic',
  // List markers
  listMarker: 'text-red-700 dark:text-red-400 font-bold',
  // Horizontal rule
  hr: 'text-gray-500 dark:text-gray-500',
  // Table
  table: 'text-cyan-700 dark:text-cyan-400',
  // Template brackets {{ }} {% %}
  templateBracket: 'text-purple-700 dark:text-purple-400 font-bold',
  // Template variables
  templateVar: 'text-amber-600 dark:text-yellow-400',
  // Template keywords (for, if, else, endif, endfor)
  templateKeyword: 'text-purple-700 dark:text-purple-400 font-bold',
  // Frontmatter delimiter ---
  frontmatterDelimiter: 'text-gray-400 dark:text-gray-500',
  // YAML key
  yamlKey: 'text-cyan-600 dark:text-cyan-400',
  // YAML value (string)
  yamlValue: 'text-amber-600 dark:text-amber-400',
  // YAML value (number)
  yamlNumber: 'text-green-600 dark:text-green-400',
  // YAML list marker
  yamlListMarker: 'text-pink-600 dark:text-pink-400',
}

// Helper to create span with Tailwind classes
const span = (className: string, content: string) => `<span class="${className}">${content}</span>`

// Check if we're inside frontmatter (between first --- and second ---)
function highlightFrontmatter(code: string): { highlighted: string; endIndex: number } | null {
  // Check if starts with ---
  if (!code.startsWith('---')) {
    return null
  }

  // Find the closing ---
  const lines = code.split('\n')
  let endLineIndex = -1

  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endLineIndex = i
      break
    }
  }

  if (endLineIndex === -1) {
    return null
  }

  // Highlight the frontmatter
  const frontmatterLines = lines.slice(0, endLineIndex + 1)
  const highlightedLines = frontmatterLines.map((line, idx) => {
    // First and last lines are delimiters
    if (idx === 0 || idx === endLineIndex) {
      return span(tw.frontmatterDelimiter, escapeHtml(line))
    }

    // Empty line
    if (line.trim() === '') {
      return line
    }

    // List item (indented with -)
    const listMatch = line.match(/^(\s*)(-)(\s+)(.*)$/)
    if (listMatch) {
      const [, indent, dash, space, value] = listMatch
      return `${indent}${span(tw.yamlListMarker, escapeHtml(dash))}${space}${span(tw.yamlValue, escapeHtml(value))}`
    }

    // Key-value pair
    const kvMatch = line.match(/^(\s*)([a-zA-Z_][a-zA-Z0-9_]*)(:)(\s*)(.*)$/)
    if (kvMatch) {
      const [, indent, key, colon, space, value] = kvMatch
      const escapedKey = escapeHtml(key)
      const escapedColon = escapeHtml(colon)
      const escapedValue = escapeHtml(value)

      // Check if value is a number
      const isNumber = /^-?\d+(\.\d+)?$/.test(value.trim())
      // Check if value is boolean
      const isBoolOrNull = /^(true|false|null|yes|no)$/i.test(value.trim())

      let valueClass = tw.yamlValue
      if (isNumber) {
        valueClass = tw.yamlNumber
      } else if (isBoolOrNull) {
        valueClass = tw.yamlNumber // Use same color for booleans
      }

      return `${indent}${span(tw.yamlKey, escapedKey)}${span(tw.frontmatterDelimiter, escapedColon)}${space}${value ? span(valueClass, escapedValue) : ''}`
    }

    // Fallback - just escape
    return escapeHtml(line)
  })

  // Calculate the end index in the original string
  const endIndex = frontmatterLines.join('\n').length

  return {
    highlighted: highlightedLines.join('\n'),
    endIndex,
  }
}

// Highlight markdown syntax with Tailwind classes
export function highlightMarkdown(code: string): string {
  // First check for frontmatter
  const frontmatter = highlightFrontmatter(code)
  let result: string
  let contentToHighlight: string

  if (frontmatter) {
    // Highlight the rest of the content after frontmatter
    contentToHighlight = code.substring(frontmatter.endIndex)
    result = frontmatter.highlighted
  } else {
    contentToHighlight = code
    result = ''
  }

  // Escape HTML for the rest
  let escapedContent = escapeHtml(contentToHighlight)

  // Process line by line to handle block-level syntax
  const lines = escapedContent.split('\n')
  const highlightedLines = lines.map((line) => {
    // Headers (must be at start of line)
    if (/^#{1,6}\s/.test(line)) {
      const match = line.match(/^(#{1,6})(\s.*)$/)
      if (match) {
        return span(tw.header, match[1]) + span(tw.header, match[2])
      }
    }

    // Blockquotes
    if (/^&gt;\s/.test(line)) {
      return span(tw.blockquote, line)
    }

    // Unordered list items
    if (/^(\s*)([-*+])\s/.test(line)) {
      const match = line.match(/^(\s*)([-*+])(\s.*)$/)
      if (match) {
        return `${match[1]}${span(tw.listMarker, match[2])}${match[3]}`
      }
    }

    // Ordered list items
    if (/^(\s*)(\d+\.)\s/.test(line)) {
      const match = line.match(/^(\s*)(\d+\.)(\s.*)$/)
      if (match) {
        return `${match[1]}${span(tw.listMarker, match[2])}${match[3]}`
      }
    }

    // Horizontal rules
    if (/^([-*_])\1{2,}$/.test(line.trim())) {
      return span(tw.hr, line)
    }

    // Table separator
    if (/^\|?[\s\-:|]+\|/.test(line)) {
      return span(tw.table, line)
    }

    // Table row
    if (/^\|/.test(line)) {
      return span(tw.table, line)
    }

    return line
  })

  result += highlightedLines.join('\n')

  // Inline patterns (applied after line processing)

  // Code blocks (fenced) - must be before inline code
  result = result.replace(
    /^(```)([\w]*)?$([\s\S]*?)^(```)$/gm,
    `${span(tw.codeFence, '$1$2')}${span(tw.codeBlock, '$3')}${span(tw.codeFence, '$4')}`
  )

  // Inline code (backticks)
  result = result.replace(/`([^`\n]+)`/g, span(tw.inlineCode, '`$1`'))

  // Bold with double asterisks **text**
  result = result.replace(/(\*\*)([^*\n]+)(\*\*)/g, span(tw.bold, '$1$2$3'))

  // Bold with double underscores __text__
  result = result.replace(/(__)([^_\n]+)(__)/g, span(tw.bold, '$1$2$3'))

  // Italic with single asterisk *text* (not inside bold)
  result = result.replace(/(?<!\*)(\*)(?!\*)([^*\n]+)(\*)(?!\*)/g, span(tw.italic, '$1$2$3'))

  // Italic with single underscore _text_ (not inside bold)
  result = result.replace(/(?<!_)(_)(?!_)([^_\n]+)(_)(?!_)/g, span(tw.italic, '$1$2$3'))

  // Links [text](url)
  result = result.replace(
    /(\[)([^\]]+)(\])(\()([^)]+)(\))/g,
    `${span(tw.linkBracket, '$1')}${span(tw.linkText, '$2')}${span(tw.linkBracket, '$3')}${span(tw.linkBracket, '$4')}${span(tw.linkUrl, '$5')}${span(tw.linkBracket, '$6')}`
  )

  // Images ![alt](url)
  result = result.replace(
    /(!?\[)([^\]]*?)(\])(\()([^)]+)(\))/g,
    `${span(tw.linkBracket, '$1')}${span(tw.linkText, '$2')}${span(tw.linkBracket, '$3')}${span(tw.linkBracket, '$4')}${span(tw.linkUrl, '$5')}${span(tw.linkBracket, '$6')}`
  )

  // Template syntax - Variables {{ variable }}
  result = result.replace(
    /(\{\{)([^}]+)(\}\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateVar, '$2')}${span(tw.templateBracket, '$3')}`
  )

  // Template syntax - For loops {% for ... %} and {% endfor %}
  result = result.replace(
    /(\{%)(\s*for\s+)([^%]+)(%\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateKeyword, '$2')}${span(tw.templateVar, '$3')}${span(tw.templateBracket, '$4')}`
  )
  result = result.replace(
    /(\{%)(\s*endfor\s*)(%\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateKeyword, '$2')}${span(tw.templateBracket, '$3')}`
  )

  // Template syntax - If statements {% if ... %}, {% else %}, {% endif %}
  result = result.replace(
    /(\{%)(\s*if\s+)([^%]+)(%\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateKeyword, '$2')}${span(tw.templateVar, '$3')}${span(tw.templateBracket, '$4')}`
  )
  result = result.replace(
    /(\{%)(\s*else\s*)(%\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateKeyword, '$2')}${span(tw.templateBracket, '$3')}`
  )
  result = result.replace(
    /(\{%)(\s*endif\s*)(%\})/g,
    `${span(tw.templateBracket, '$1')}${span(tw.templateKeyword, '$2')}${span(tw.templateBracket, '$3')}`
  )

  return result
}

// Export Tailwind classes for safelist (to prevent purging)
export const markdownHighlightClasses = Object.values(tw).flatMap((c) => c.split(' '))

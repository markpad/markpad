/**
 * Types for the Advanced Theme Editor
 */

import type { IconType } from 'react-icons'
import {
  FaBox,
  FaHeading,
  FaFont,
  FaLink,
  FaListUl,
  FaQuoteLeft,
  FaCode,
  FaTable,
  FaImage,
} from 'react-icons/fa'

// All elements that can be configured in a theme
export type ThemeElement =
  | 'body'
  | 'article'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'a'
  | 'blockquote'
  | 'ul'
  | 'ol'
  | 'li'
  | 'code'
  | 'pre'
  | 'table'
  | 'th'
  | 'td'
  | 'tr'
  | 'img'
  | 'hr'
  | 'strong'
  | 'em'

// Element categories for sidebar grouping
export interface ElementCategory {
  name: string
  elements: ThemeElement[]
  icon: IconType
}

export const ELEMENT_CATEGORIES: ElementCategory[] = [
  { name: 'Container', elements: ['body', 'article'], icon: FaBox },
  { name: 'Headings', elements: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'], icon: FaHeading },
  { name: 'Text', elements: ['p', 'strong', 'em'], icon: FaFont },
  { name: 'Links', elements: ['a'], icon: FaLink },
  { name: 'Lists', elements: ['ul', 'ol', 'li'], icon: FaListUl },
  { name: 'Quote', elements: ['blockquote'], icon: FaQuoteLeft },
  { name: 'Code', elements: ['code', 'pre'], icon: FaCode },
  { name: 'Table', elements: ['table', 'th', 'td', 'tr'], icon: FaTable },
  { name: 'Media', elements: ['img', 'hr'], icon: FaImage },
]

// Tailwind options for dropdowns
export const FONT_SIZES = [
  { value: 'text-xs', label: 'XS' },
  { value: 'text-sm', label: 'SM' },
  { value: 'text-base', label: 'Base' },
  { value: 'text-lg', label: 'LG' },
  { value: 'text-xl', label: 'XL' },
  { value: 'text-2xl', label: '2XL' },
  { value: 'text-3xl', label: '3XL' },
  { value: 'text-4xl', label: '4XL' },
  { value: 'text-5xl', label: '5XL' },
  { value: 'text-6xl', label: '6XL' },
]

export const FONT_WEIGHTS = [
  { value: 'font-thin', label: 'Thin' },
  { value: 'font-extralight', label: 'Extra Light' },
  { value: 'font-light', label: 'Light' },
  { value: 'font-normal', label: 'Normal' },
  { value: 'font-medium', label: 'Medium' },
  { value: 'font-semibold', label: 'Semibold' },
  { value: 'font-bold', label: 'Bold' },
  { value: 'font-extrabold', label: 'Extra Bold' },
  { value: 'font-black', label: 'Black' },
]

export const FONT_FAMILIES = [
  // Tailwind defaults
  { value: 'font-sans', label: 'Sans Serif (System)' },
  { value: 'font-serif', label: 'Serif (System)' },
  { value: 'font-mono', label: 'Monospace (System)' },
  // Google Fonts (using Tailwind arbitrary values)
  { value: "font-['Inter']", label: 'Inter' },
  { value: "font-['Roboto']", label: 'Roboto' },
  { value: "font-['Open_Sans']", label: 'Open Sans' },
  { value: "font-['Lato']", label: 'Lato' },
  { value: "font-['Montserrat']", label: 'Montserrat' },
  { value: "font-['Poppins']", label: 'Poppins' },
  { value: "font-['Source_Sans_Pro']", label: 'Source Sans Pro' },
  { value: "font-['Nunito']", label: 'Nunito' },
  { value: "font-['Raleway']", label: 'Raleway' },
  { value: "font-['Playfair_Display']", label: 'Playfair Display' },
  { value: "font-['Merriweather']", label: 'Merriweather' },
  { value: "font-['PT_Sans']", label: 'PT Sans' },
  { value: "font-['Ubuntu']", label: 'Ubuntu' },
  { value: "font-['Oswald']", label: 'Oswald' },
  { value: "font-['Fira_Sans']", label: 'Fira Sans' },
  { value: "font-['Bangers']", label: 'Bangers' },
  { value: "font-['Comic_Neue']", label: 'Comic Neue' },
]

export const TEXT_COLORS = [
  { value: 'text-gray-50', label: 'Gray 50' },
  { value: 'text-gray-100', label: 'Gray 100' },
  { value: 'text-gray-200', label: 'Gray 200' },
  { value: 'text-gray-300', label: 'Gray 300' },
  { value: 'text-gray-400', label: 'Gray 400' },
  { value: 'text-gray-500', label: 'Gray 500' },
  { value: 'text-gray-600', label: 'Gray 600' },
  { value: 'text-gray-700', label: 'Gray 700' },
  { value: 'text-gray-800', label: 'Gray 800' },
  { value: 'text-gray-900', label: 'Gray 900' },
  { value: 'text-black', label: 'Black' },
  { value: 'text-white', label: 'White' },
  { value: 'text-red-500', label: 'Red' },
  { value: 'text-red-600', label: 'Red Dark' },
  { value: 'text-orange-500', label: 'Orange' },
  { value: 'text-amber-500', label: 'Amber' },
  { value: 'text-yellow-500', label: 'Yellow' },
  { value: 'text-lime-500', label: 'Lime' },
  { value: 'text-green-500', label: 'Green' },
  { value: 'text-green-600', label: 'Green Dark' },
  { value: 'text-emerald-500', label: 'Emerald' },
  { value: 'text-teal-500', label: 'Teal' },
  { value: 'text-cyan-500', label: 'Cyan' },
  { value: 'text-sky-500', label: 'Sky' },
  { value: 'text-blue-500', label: 'Blue' },
  { value: 'text-blue-600', label: 'Blue Dark' },
  { value: 'text-indigo-500', label: 'Indigo' },
  { value: 'text-violet-500', label: 'Violet' },
  { value: 'text-purple-500', label: 'Purple' },
  { value: 'text-fuchsia-500', label: 'Fuchsia' },
  { value: 'text-pink-500', label: 'Pink' },
  { value: 'text-rose-500', label: 'Rose' },
]

export const BG_COLORS = [
  { value: '', label: 'None' },
  { value: 'bg-white', label: 'White' },
  { value: 'bg-gray-50', label: 'Gray 50' },
  { value: 'bg-gray-100', label: 'Gray 100' },
  { value: 'bg-gray-200', label: 'Gray 200' },
  { value: 'bg-gray-800', label: 'Gray 800' },
  { value: 'bg-gray-900', label: 'Gray 900' },
  { value: 'bg-black', label: 'Black' },
  { value: 'bg-red-50', label: 'Red Light' },
  { value: 'bg-red-100', label: 'Red 100' },
  { value: 'bg-orange-50', label: 'Orange Light' },
  { value: 'bg-amber-50', label: 'Amber Light' },
  { value: 'bg-yellow-50', label: 'Yellow Light' },
  { value: 'bg-lime-50', label: 'Lime Light' },
  { value: 'bg-green-50', label: 'Green Light' },
  { value: 'bg-emerald-50', label: 'Emerald Light' },
  { value: 'bg-teal-50', label: 'Teal Light' },
  { value: 'bg-cyan-50', label: 'Cyan Light' },
  { value: 'bg-sky-50', label: 'Sky Light' },
  { value: 'bg-blue-50', label: 'Blue Light' },
  { value: 'bg-indigo-50', label: 'Indigo Light' },
  { value: 'bg-violet-50', label: 'Violet Light' },
  { value: 'bg-purple-50', label: 'Purple Light' },
  { value: 'bg-fuchsia-50', label: 'Fuchsia Light' },
  { value: 'bg-pink-50', label: 'Pink Light' },
  { value: 'bg-rose-50', label: 'Rose Light' },
]

// New color system with base + intensity
export const COLOR_BASES = [
  { value: '', label: 'None' },
  { value: 'white', label: 'White', hasIntensity: false },
  { value: 'black', label: 'Black', hasIntensity: false },
  { value: 'slate', label: 'Slate' },
  { value: 'gray', label: 'Gray' },
  { value: 'zinc', label: 'Zinc' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'stone', label: 'Stone' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'amber', label: 'Amber' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'lime', label: 'Lime' },
  { value: 'green', label: 'Green' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'teal', label: 'Teal' },
  { value: 'cyan', label: 'Cyan' },
  { value: 'sky', label: 'Sky' },
  { value: 'blue', label: 'Blue' },
  { value: 'indigo', label: 'Indigo' },
  { value: 'violet', label: 'Violet' },
  { value: 'purple', label: 'Purple' },
  { value: 'fuchsia', label: 'Fuchsia' },
  { value: 'pink', label: 'Pink' },
  { value: 'rose', label: 'Rose' },
]

export const COLOR_INTENSITIES = [
  { value: '50', label: '50 (lightest)' },
  { value: '100', label: '100' },
  { value: '200', label: '200' },
  { value: '300', label: '300' },
  { value: '400', label: '400' },
  { value: '500', label: '500 (default)' },
  { value: '600', label: '600' },
  { value: '700', label: '700' },
  { value: '800', label: '800' },
  { value: '900', label: '900' },
  { value: '950', label: '950 (darkest)' },
]

// Helper to build color class from base + intensity
export function buildColorClass(
  prefix: 'text' | 'bg' | 'border',
  base: string,
  intensity: string
): string {
  if (!base) return ''
  if (base === 'white') return `${prefix}-white`
  if (base === 'black') return `${prefix}-black`
  return `${prefix}-${base}-${intensity || '500'}`
}

// Helper to parse color class into base + intensity
export function parseColorClass(
  colorClass: string,
  prefix: 'text' | 'bg' | 'border'
): { base: string; intensity: string } {
  if (!colorClass) return { base: '', intensity: '500' }

  const prefixPattern = `${prefix}-`
  if (!colorClass.startsWith(prefixPattern)) return { base: '', intensity: '500' }

  const rest = colorClass.slice(prefixPattern.length)

  if (rest === 'white') return { base: 'white', intensity: '' }
  if (rest === 'black') return { base: 'black', intensity: '' }

  // Match pattern like "gray-500" or "emerald-300"
  const match = rest.match(/^([a-z]+)-(\d+)$/)
  if (match) {
    return { base: match[1], intensity: match[2] }
  }

  return { base: '', intensity: '500' }
}

export const MARGIN_OPTIONS = [
  { value: '', label: 'None' },
  { value: '1', label: '1 (4px)' },
  { value: '2', label: '2 (8px)' },
  { value: '3', label: '3 (12px)' },
  { value: '4', label: '4 (16px)' },
  { value: '5', label: '5 (20px)' },
  { value: '6', label: '6 (24px)' },
  { value: '8', label: '8 (32px)' },
  { value: '10', label: '10 (40px)' },
  { value: '12', label: '12 (48px)' },
  { value: '16', label: '16 (64px)' },
]

export const PADDING_OPTIONS = MARGIN_OPTIONS

export const BORDER_WIDTHS = [
  { value: '', label: 'None' },
  { value: 'border', label: '1px' },
  { value: 'border-2', label: '2px' },
  { value: 'border-4', label: '4px' },
  { value: 'border-8', label: '8px' },
]

export const BORDER_SIDES = [
  { value: '', label: 'All' },
  { value: '-t', label: 'Top' },
  { value: '-r', label: 'Right' },
  { value: '-b', label: 'Bottom' },
  { value: '-l', label: 'Left' },
]

export const BORDER_COLORS = [
  { value: 'border-gray-200', label: 'Gray Light' },
  { value: 'border-gray-300', label: 'Gray' },
  { value: 'border-gray-400', label: 'Gray Dark' },
  { value: 'border-gray-500', label: 'Gray 500' },
  { value: 'border-blue-200', label: 'Blue Light' },
  { value: 'border-blue-500', label: 'Blue' },
  { value: 'border-green-500', label: 'Green' },
  { value: 'border-red-500', label: 'Red' },
  { value: 'border-purple-500', label: 'Purple' },
  { value: 'border-yellow-500', label: 'Yellow' },
]

export const BORDER_RADIUS = [
  { value: '', label: 'None' },
  { value: 'rounded-sm', label: 'Small' },
  { value: 'rounded', label: 'Default' },
  { value: 'rounded-md', label: 'Medium' },
  { value: 'rounded-lg', label: 'Large' },
  { value: 'rounded-xl', label: 'XL' },
  { value: 'rounded-2xl', label: '2XL' },
  { value: 'rounded-full', label: 'Full' },
]

export const LETTER_SPACING = [
  { value: 'tracking-tighter', label: 'Tighter' },
  { value: 'tracking-tight', label: 'Tight' },
  { value: 'tracking-normal', label: 'Normal' },
  { value: 'tracking-wide', label: 'Wide' },
  { value: 'tracking-wider', label: 'Wider' },
  { value: 'tracking-widest', label: 'Widest' },
]

export const LINE_HEIGHT = [
  { value: 'leading-none', label: 'None (1)' },
  { value: 'leading-tight', label: 'Tight (1.25)' },
  { value: 'leading-snug', label: 'Snug (1.375)' },
  { value: 'leading-normal', label: 'Normal (1.5)' },
  { value: 'leading-relaxed', label: 'Relaxed (1.625)' },
  { value: 'leading-loose', label: 'Loose (2)' },
]

export const TEXT_TRANSFORM = [
  { value: '', label: 'None' },
  { value: 'uppercase', label: 'UPPERCASE' },
  { value: 'lowercase', label: 'lowercase' },
  { value: 'capitalize', label: 'Capitalize' },
]

export const TEXT_DECORATION = [
  { value: '', label: 'None' },
  { value: 'underline', label: 'Underline' },
  { value: 'line-through', label: 'Strikethrough' },
]

export const LIST_STYLE = [
  { value: 'list-none', label: 'None' },
  { value: 'list-disc', label: 'Disc' },
  { value: 'list-decimal', label: 'Decimal' },
]

export const SHADOWS = [
  { value: '', label: 'None' },
  { value: 'shadow-sm', label: 'Small' },
  { value: 'shadow', label: 'Default' },
  { value: 'shadow-md', label: 'Medium' },
  { value: 'shadow-lg', label: 'Large' },
  { value: 'shadow-xl', label: 'XL' },
  { value: 'shadow-2xl', label: '2XL' },
]

// Configuration for each element type
export interface ElementConfig {
  // Typography
  fontSize?: string
  fontWeight?: string
  fontFamily?: string
  letterSpacing?: string
  lineHeight?: string
  textTransform?: string
  textDecoration?: string
  fontStyle?: string

  // Colors (Light mode)
  textColor?: string
  bgColor?: string
  borderColor?: string

  // Colors (Dark mode)
  darkTextColor?: string
  darkBgColor?: string
  darkBorderColor?: string

  // Table row alternating colors
  evenBgColor?: string
  oddBgColor?: string

  // Spacing
  marginTop?: string
  marginBottom?: string
  paddingX?: string
  paddingY?: string

  // Borders
  borderWidth?: string
  borderSide?: string
  borderRadius?: string

  // Effects
  shadow?: string

  // Lists
  listStyle?: string

  // Custom
  customClasses?: string
}

// Element-specific defaults and available options
export interface ElementSchema {
  availableOptions: (keyof ElementConfig)[]
  defaults: ElementConfig
}

// Which options are available for each element type
export const ELEMENT_SCHEMAS: Record<ThemeElement, ElementSchema> = {
  body: {
    availableOptions: ['bgColor', 'textColor', 'fontFamily', 'paddingX', 'paddingY'],
    defaults: {
      bgColor: 'bg-white',
      textColor: 'text-gray-900',
      fontFamily: 'font-sans',
      paddingX: '8',
      paddingY: '8',
    },
  },
  article: {
    availableOptions: [
      'bgColor',
      'paddingX',
      'paddingY',
      'borderRadius',
      'shadow',
      'customClasses',
    ],
    defaults: {
      customClasses: 'prose max-w-none',
    },
  },
  h1: {
    availableOptions: [
      'fontSize',
      'fontWeight',
      'textColor',
      'letterSpacing',
      'textTransform',
      'marginTop',
      'marginBottom',
      'borderWidth',
      'borderSide',
      'borderColor',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-4xl',
      fontWeight: 'font-bold',
      textColor: 'text-gray-900',
      marginBottom: '6',
    },
  },
  h2: {
    availableOptions: [
      'fontSize',
      'fontWeight',
      'textColor',
      'letterSpacing',
      'textTransform',
      'marginTop',
      'marginBottom',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-3xl',
      fontWeight: 'font-bold',
      textColor: 'text-gray-800',
      marginTop: '8',
      marginBottom: '4',
    },
  },
  h3: {
    availableOptions: [
      'fontSize',
      'fontWeight',
      'textColor',
      'letterSpacing',
      'textTransform',
      'marginTop',
      'marginBottom',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-2xl',
      fontWeight: 'font-semibold',
      textColor: 'text-gray-800',
      marginTop: '6',
      marginBottom: '3',
    },
  },
  h4: {
    availableOptions: [
      'fontSize',
      'fontWeight',
      'textColor',
      'marginTop',
      'marginBottom',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-xl',
      fontWeight: 'font-semibold',
      textColor: 'text-gray-700',
      marginBottom: '3',
    },
  },
  h5: {
    availableOptions: ['fontSize', 'fontWeight', 'textColor', 'marginBottom', 'customClasses'],
    defaults: {
      fontSize: 'text-lg',
      fontWeight: 'font-medium',
      textColor: 'text-gray-700',
      marginBottom: '2',
    },
  },
  h6: {
    availableOptions: ['fontSize', 'fontWeight', 'textColor', 'marginBottom', 'customClasses'],
    defaults: {
      fontSize: 'text-base',
      fontWeight: 'font-medium',
      textColor: 'text-gray-600',
      marginBottom: '2',
    },
  },
  p: {
    availableOptions: ['fontSize', 'textColor', 'lineHeight', 'marginBottom', 'customClasses'],
    defaults: {
      fontSize: 'text-base',
      textColor: 'text-gray-700',
      lineHeight: 'leading-relaxed',
      marginBottom: '4',
    },
  },
  a: {
    availableOptions: ['textColor', 'fontWeight', 'textDecoration', 'customClasses'],
    defaults: {
      textColor: 'text-blue-600',
      textDecoration: 'underline',
    },
  },
  blockquote: {
    availableOptions: [
      'textColor',
      'bgColor',
      'fontStyle',
      'borderWidth',
      'borderSide',
      'borderColor',
      'paddingX',
      'paddingY',
      'marginTop',
      'marginBottom',
      'customClasses',
    ],
    defaults: {
      textColor: 'text-gray-600',
      fontStyle: 'italic',
      borderWidth: 'border-4',
      borderSide: '-l',
      borderColor: 'border-gray-300',
      paddingX: '4',
      marginTop: '4',
      marginBottom: '4',
    },
  },
  ul: {
    availableOptions: ['listStyle', 'paddingX', 'marginBottom', 'customClasses'],
    defaults: {
      listStyle: 'list-disc',
      paddingX: '6',
      marginBottom: '4',
    },
  },
  ol: {
    availableOptions: ['listStyle', 'paddingX', 'marginBottom', 'customClasses'],
    defaults: {
      listStyle: 'list-decimal',
      paddingX: '6',
      marginBottom: '4',
    },
  },
  li: {
    availableOptions: ['textColor', 'marginBottom', 'customClasses'],
    defaults: {
      textColor: 'text-gray-700',
      marginBottom: '2',
    },
  },
  code: {
    availableOptions: [
      'fontSize',
      'fontFamily',
      'textColor',
      'bgColor',
      'paddingX',
      'paddingY',
      'borderRadius',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-sm',
      fontFamily: 'font-mono',
      textColor: 'text-pink-600',
      bgColor: 'bg-gray-100',
      paddingX: '1',
      borderRadius: 'rounded',
    },
  },
  pre: {
    availableOptions: [
      'fontSize',
      'textColor',
      'bgColor',
      'paddingX',
      'paddingY',
      'borderRadius',
      'marginBottom',
      'customClasses',
    ],
    defaults: {
      fontSize: 'text-sm',
      textColor: 'text-gray-800',
      bgColor: 'bg-gray-100',
      paddingX: '4',
      paddingY: '4',
      borderRadius: 'rounded-lg',
      marginBottom: '4',
    },
  },
  table: {
    availableOptions: ['borderWidth', 'borderColor', 'marginBottom', 'customClasses'],
    defaults: {
      borderWidth: 'border',
      borderColor: 'border-gray-300',
      marginBottom: '4',
    },
  },
  th: {
    availableOptions: [
      'fontSize',
      'fontWeight',
      'textColor',
      'bgColor',
      'paddingX',
      'paddingY',
      'borderWidth',
      'borderColor',
      'customClasses',
    ],
    defaults: {
      fontWeight: 'font-semibold',
      textColor: 'text-gray-900',
      bgColor: 'bg-gray-50',
      paddingX: '4',
      paddingY: '3',
      borderWidth: 'border',
      borderColor: 'border-gray-300',
    },
  },
  td: {
    availableOptions: [
      'textColor',
      'paddingX',
      'paddingY',
      'borderWidth',
      'borderColor',
      'customClasses',
    ],
    defaults: {
      textColor: 'text-gray-700',
      paddingX: '4',
      paddingY: '3',
      borderWidth: 'border',
      borderColor: 'border-gray-300',
    },
  },
  tr: {
    availableOptions: ['borderWidth', 'borderColor', 'evenBgColor', 'oddBgColor', 'customClasses'],
    defaults: {
      evenBgColor: 'bg-gray-50',
      oddBgColor: 'bg-white',
    },
  },
  img: {
    availableOptions: ['borderRadius', 'shadow', 'marginTop', 'marginBottom', 'customClasses'],
    defaults: {
      borderRadius: 'rounded-lg',
      marginTop: '4',
      marginBottom: '4',
    },
  },
  hr: {
    availableOptions: ['borderColor', 'marginTop', 'marginBottom', 'customClasses'],
    defaults: {
      borderColor: 'border-gray-200',
      marginTop: '8',
      marginBottom: '8',
    },
  },
  strong: {
    availableOptions: ['fontWeight', 'textColor', 'customClasses'],
    defaults: {
      fontWeight: 'font-bold',
    },
  },
  em: {
    availableOptions: ['fontStyle', 'textColor', 'customClasses'],
    defaults: {
      fontStyle: 'italic',
    },
  },
}

// Convert ElementConfig to Tailwind class string
export function configToClasses(config: ElementConfig, element: ThemeElement): string {
  const classes: string[] = []
  const schema = ELEMENT_SCHEMAS[element]

  // Typography
  if (config.fontSize && schema.availableOptions.includes('fontSize')) {
    classes.push(config.fontSize)
  }
  if (config.fontWeight && schema.availableOptions.includes('fontWeight')) {
    classes.push(config.fontWeight)
  }
  if (config.fontFamily && schema.availableOptions.includes('fontFamily')) {
    classes.push(config.fontFamily)
  }
  if (config.letterSpacing && schema.availableOptions.includes('letterSpacing')) {
    classes.push(config.letterSpacing)
  }
  if (config.lineHeight && schema.availableOptions.includes('lineHeight')) {
    classes.push(config.lineHeight)
  }
  if (config.textTransform && schema.availableOptions.includes('textTransform')) {
    classes.push(config.textTransform)
  }
  if (config.textDecoration && schema.availableOptions.includes('textDecoration')) {
    classes.push(config.textDecoration)
  }
  if (config.fontStyle && schema.availableOptions.includes('fontStyle')) {
    classes.push(config.fontStyle)
  }

  // Colors
  if (config.textColor && schema.availableOptions.includes('textColor')) {
    classes.push(config.textColor)
  }
  if (config.bgColor && schema.availableOptions.includes('bgColor')) {
    classes.push(config.bgColor)
  }

  // Dark mode colors
  if (config.darkTextColor && schema.availableOptions.includes('textColor')) {
    // Convert text-gray-900 to dark:text-gray-100
    classes.push(`dark:${config.darkTextColor}`)
  }
  if (config.darkBgColor && schema.availableOptions.includes('bgColor')) {
    classes.push(`dark:${config.darkBgColor}`)
  }
  if (config.darkBorderColor && schema.availableOptions.includes('borderColor')) {
    classes.push(`dark:${config.darkBorderColor}`)
  }

  // Spacing
  if (config.marginTop && schema.availableOptions.includes('marginTop')) {
    classes.push(`mt-${config.marginTop}`)
  }
  if (config.marginBottom && schema.availableOptions.includes('marginBottom')) {
    classes.push(`mb-${config.marginBottom}`)
  }
  if (config.paddingX && schema.availableOptions.includes('paddingX')) {
    classes.push(`px-${config.paddingX}`)
  }
  if (config.paddingY && schema.availableOptions.includes('paddingY')) {
    classes.push(`py-${config.paddingY}`)
  }

  // Borders
  if (config.borderWidth && schema.availableOptions.includes('borderWidth')) {
    const side = config.borderSide || ''
    const width = config.borderWidth.replace('border', '')
    classes.push(`border${side}${width}`)
  }
  if (config.borderColor && schema.availableOptions.includes('borderColor')) {
    classes.push(config.borderColor)
  }
  if (config.borderRadius && schema.availableOptions.includes('borderRadius')) {
    classes.push(config.borderRadius)
  }

  // Effects
  if (config.shadow && schema.availableOptions.includes('shadow')) {
    classes.push(config.shadow)
  }

  // Lists
  if (config.listStyle && schema.availableOptions.includes('listStyle')) {
    classes.push(config.listStyle)
  }

  // Table row alternating colors (even/odd)
  if (config.evenBgColor && schema.availableOptions.includes('evenBgColor')) {
    classes.push(`even:${config.evenBgColor}`)
  }
  if (config.oddBgColor && schema.availableOptions.includes('oddBgColor')) {
    classes.push(`odd:${config.oddBgColor}`)
  }

  // Custom classes (always append at end)
  if (config.customClasses) {
    classes.push(config.customClasses)
  }

  return classes.filter(Boolean).join(' ')
}

// Parse Tailwind class string back to ElementConfig
export function classesToConfig(classString: string, _element: ThemeElement): ElementConfig {
  const classes = classString.split(' ').filter(Boolean)
  const config: ElementConfig = {}
  const recognized: string[] = []

  // Color pattern regex for detecting Tailwind color classes
  const colorPattern =
    /^(text|bg|border)-(white|black|slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(-\d{2,3})?$/

  for (const cls of classes) {
    // Dark mode colors (must check before regular colors)
    if (cls.startsWith('dark:')) {
      const darkClass = cls.slice(5) // Remove 'dark:' prefix
      if (darkClass.startsWith('text-') && colorPattern.test(darkClass)) {
        config.darkTextColor = darkClass
        recognized.push(cls)
        continue
      }
      if (darkClass.startsWith('bg-') && colorPattern.test(darkClass)) {
        config.darkBgColor = darkClass
        recognized.push(cls)
        continue
      }
      if (darkClass.startsWith('border-') && colorPattern.test(darkClass)) {
        config.darkBorderColor = darkClass
        recognized.push(cls)
        continue
      }
    }
    // Even row background (for table rows)
    if (cls.startsWith('even:bg-')) {
      const bgClass = cls.slice(5) // Remove 'even:' prefix
      if (colorPattern.test(bgClass)) {
        config.evenBgColor = bgClass
        recognized.push(cls)
        continue
      }
    }
    // Odd row background (for table rows)
    if (cls.startsWith('odd:bg-')) {
      const bgClass = cls.slice(4) // Remove 'odd:' prefix
      if (colorPattern.test(bgClass)) {
        config.oddBgColor = bgClass
        recognized.push(cls)
        continue
      }
    }
    // Font size
    if (cls.startsWith('text-') && FONT_SIZES.some((s) => s.value === cls)) {
      config.fontSize = cls
      recognized.push(cls)
      continue
    }
    // Font weight
    if (cls.startsWith('font-') && FONT_WEIGHTS.some((w) => w.value === cls)) {
      config.fontWeight = cls
      recognized.push(cls)
      continue
    }
    // Font family
    if (FONT_FAMILIES.some((f) => f.value === cls)) {
      config.fontFamily = cls
      recognized.push(cls)
      continue
    }
    // Text color (using regex pattern)
    if (cls.startsWith('text-') && colorPattern.test(cls)) {
      config.textColor = cls
      recognized.push(cls)
      continue
    }
    // Background color (using regex pattern)
    if (cls.startsWith('bg-') && colorPattern.test(cls)) {
      config.bgColor = cls
      recognized.push(cls)
      continue
    }
    // Margin top
    if (cls.startsWith('mt-')) {
      config.marginTop = cls.replace('mt-', '')
      recognized.push(cls)
      continue
    }
    // Margin bottom
    if (cls.startsWith('mb-')) {
      config.marginBottom = cls.replace('mb-', '')
      recognized.push(cls)
      continue
    }
    // Padding X
    if (cls.startsWith('px-')) {
      config.paddingX = cls.replace('px-', '')
      recognized.push(cls)
      continue
    }
    // Padding Y
    if (cls.startsWith('py-')) {
      config.paddingY = cls.replace('py-', '')
      recognized.push(cls)
      continue
    }
    // Border radius
    if (cls.startsWith('rounded')) {
      config.borderRadius = cls
      recognized.push(cls)
      continue
    }
    // Border color (using regex pattern)
    if (cls.startsWith('border-') && colorPattern.test(cls)) {
      config.borderColor = cls
      recognized.push(cls)
      continue
    }
    // Border width
    if (cls.match(/^border(-[lrtb])?(-\d)?$/)) {
      if (cls.includes('-l') || cls.includes('-r') || cls.includes('-t') || cls.includes('-b')) {
        const side = cls.match(/-[lrtb]/)?.[0] || ''
        config.borderSide = side
        config.borderWidth = cls.replace(side, '')
      } else {
        config.borderWidth = cls
      }
      recognized.push(cls)
      continue
    }
    // Letter spacing
    if (LETTER_SPACING.some((s) => s.value === cls)) {
      config.letterSpacing = cls
      recognized.push(cls)
      continue
    }
    // Line height
    if (LINE_HEIGHT.some((l) => l.value === cls)) {
      config.lineHeight = cls
      recognized.push(cls)
      continue
    }
    // Text transform
    if (TEXT_TRANSFORM.some((t) => t.value === cls)) {
      config.textTransform = cls
      recognized.push(cls)
      continue
    }
    // Text decoration
    if (TEXT_DECORATION.some((t) => t.value === cls)) {
      config.textDecoration = cls
      recognized.push(cls)
      continue
    }
    // Font style (italic)
    if (cls === 'italic' || cls === 'not-italic') {
      config.fontStyle = cls
      recognized.push(cls)
      continue
    }
    // Shadow
    if (SHADOWS.some((s) => s.value === cls)) {
      config.shadow = cls
      recognized.push(cls)
      continue
    }
    // List style
    if (LIST_STYLE.some((s) => s.value === cls)) {
      config.listStyle = cls
      recognized.push(cls)
      continue
    }
  }

  // Anything not recognized goes to customClasses
  const unrecognized = classes.filter((c) => !recognized.includes(c))
  if (unrecognized.length > 0) {
    config.customClasses = unrecognized.join(' ')
  }

  return config
}

// Sample markdown for preview
export const SAMPLE_MARKDOWN = `# Heading 1

This is a paragraph with **bold text** and *italic text*. Here's a [link to somewhere](https://example.com).

## Heading 2

> This is a blockquote. It can contain multiple lines and is often used for quotes or callouts.

### Heading 3

- First item in unordered list
- Second item
- Third item

1. First ordered item
2. Second ordered item
3. Third ordered item

#### Heading 4

Here's some \`inline code\` in a sentence.

\`\`\`
// Code block
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

##### Heading 5

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

###### Heading 6

---

That's all for the preview!
`

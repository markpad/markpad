// Types for the Markpad application

export interface TailwindClasses {
  h1: string
  h2: string
  h3: string
  h4: string
  h5: string
  h6: string
  p: string
  a: string
  img: string
  table: string
  strong: string
  ul: string
  ol: string
  li: string
  em: string
  tr: string
  td: string
  th: string
  blockquote: string
  code: string
  pre: string
  body: string
  article: string
}

export interface BehaviorConfig {
  shouldOpenLinksInNewTab: boolean
  shouldShowLineNumbers: boolean
}

export interface FontConfig {
  fontFamily: string
}

export const GOOGLE_FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Merriweather', label: 'Merriweather' },
  { value: 'PT Sans', label: 'PT Sans' },
  { value: 'Ubuntu', label: 'Ubuntu' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Fira Sans', label: 'Fira Sans' },
  { value: 'Bangers', label: 'Bangers' },
  { value: 'Comic Neue', label: 'Comic Neue' },
  { value: 'system-ui', label: 'System Default' },
] as const

export interface AppState {
  markdown: string
  documentTitle: string
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
  fontConfig: FontConfig
}

export type EditionMode = 'split' | 'preview' | 'edit'

export type TabMode = 'editor' | 'style'

export interface ExportFormat {
  type: 'html' | 'markdown'
  filename: string
}

export interface SelectOption {
  value: string
  label: string
}

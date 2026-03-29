// Shared utilities for theme components

/**
 * Extract only text color classes from Tailwind class string
 * Filters out size classes (text-xl, text-2xl) and alignment (text-center)
 */
const SIZE_ALIGN_RE =
  /^(dark:)?text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|center|left|right|justify|wrap|nowrap|ellipsis|clip)$/

export function getTextColorClass(classes: string): string {
  if (!classes) return ''

  const parts = classes.split(' ')

  const light = parts.find((c) => c.startsWith('text-') && !SIZE_ALIGN_RE.test(c))
  const dark = parts.find((c) => c.startsWith('dark:text-') && !SIZE_ALIGN_RE.test(c))

  return [light, dark].filter(Boolean).join(' ')
}

/**
 * Extract font family class from Tailwind class string
 */
export function getFontClass(classes: string): string {
  return classes.split(' ').find((c) => c.startsWith('font-')) || ''
}

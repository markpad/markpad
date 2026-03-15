// Shared utilities for theme components

/**
 * Extract only text color classes from Tailwind class string
 * Filters out size classes (text-xl, text-2xl) and alignment (text-center)
 */
export function getTextColorClass(classes: string): string {
  const textClasses = classes.split(' ').filter((c) => c.startsWith('text-'))
  // Filter out size classes and alignment - keep only color classes
  const colorClass = textClasses.find(
    (c) =>
      !c.match(
        /^text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl|center|left|right|justify|wrap|nowrap|ellipsis|clip)$/
      )
  )
  return colorClass || 'text-gray-700'
}

/**
 * Extract font family class from Tailwind class string
 */
export function getFontClass(classes: string): string {
  return classes.split(' ').find((c) => c.startsWith('font-')) || ''
}

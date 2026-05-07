import type { CSSProperties } from 'react'

interface MarkpadBrandIconProps {
  className?: string
  alt?: string
  offsetY?: number
  variant?: 'default' | 'flat'
}

export function MarkpadBrandIcon({
  className = 'w-8 h-8 rounded-lg object-cover',
  alt = '',
  offsetY,
  variant = 'default',
}: MarkpadBrandIconProps) {
  const resolvedOffsetY = offsetY ?? 2
  const src = variant === 'flat' ? '/logo-flat-512.png?v=20260418d' : '/favicon-512.png?v=20260418d'
  const style: CSSProperties | undefined =
    resolvedOffsetY === 0 ? undefined : { position: 'relative', top: `${resolvedOffsetY}px` }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      draggable={false}
      decoding="async"
      style={style}
    />
  )
}

import { FaCheck, FaHeart, FaRegHeart } from 'react-icons/fa'
import type { ThemePreset } from '@/data/themes.generated'
import type { TailwindClasses } from '@/types'
import { getTextColorClass, getFontClass } from '@/components/themes/themeUtils'

interface ThemeCardProps {
  theme: ThemePreset
  isActive: boolean
  isFavorite?: boolean
  onApply: (theme: ThemePreset) => void
  onToggleFavorite?: () => void
}

/**
 * Individual theme card with preview and apply functionality
 */
export function ThemeCard({
  theme,
  isActive,
  isFavorite,
  onApply,
  onToggleFavorite,
}: ThemeCardProps) {
  const { preview, tailwindClasses, fontFamily } = theme

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition-all group hover:shadow-xl hover:shadow-black/20 relative">
      {/* Favorite Button */}
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all ${
            isFavorite
              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
              : 'bg-gray-900/60 text-gray-400 hover:text-red-400 hover:bg-gray-900/80'
          }`}
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <FaHeart className="w-4 h-4" /> : <FaRegHeart className="w-4 h-4" />}
        </button>
      )}

      {/* Preview Area - Uses actual theme classes */}
      <div
        className={`h-44 p-5 flex flex-col justify-end relative overflow-hidden ${tailwindClasses.body}`}
        style={{ fontFamily }}
      >
        {preview.style === 'brutalist' ? (
          <BrutalistPreview preview={preview} classes={tailwindClasses} />
        ) : preview.style === 'minimal' ? (
          <MinimalistPreview preview={preview} classes={tailwindClasses} />
        ) : preview.style === 'mono' ? (
          <MonoPreview preview={preview} classes={tailwindClasses} />
        ) : preview.style === 'serif' ? (
          <SerifPreview preview={preview} classes={tailwindClasses} />
        ) : (
          <DefaultPreview preview={preview} classes={tailwindClasses} />
        )}
      </div>

      {/* Card Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-base mb-1">{theme.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
          {theme.description}
        </p>

        <button
          onClick={() => onApply(theme)}
          className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
            isActive
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700'
              : 'bg-gray-700 text-gray-300 hover:bg-blue-600 hover:text-white'
          }`}
        >
          {isActive && <FaCheck className="text-xs" />}
          {isActive ? 'Applied' : 'Apply Theme'}
        </button>
      </div>
    </div>
  )
}

function DefaultPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const headingColor = getTextColorClass(classes.h1)
  const headingFont = getFontClass(classes.h1)
  const accentBg = getTextColorClass(classes.a).replace('text-', 'bg-')

  return (
    <div className="space-y-2">
      <h4 className={`text-xl ${headingColor} ${headingFont}`}>{preview.sampleHeading}</h4>
      <p className={classes.p}>{preview.sampleText}</p>
      <div className="flex gap-1.5 pt-1">
        <div className={`h-1 w-16 rounded-full ${accentBg}`} />
        <div className={`h-1 w-10 rounded-full opacity-50 ${accentBg}`} />
      </div>
    </div>
  )
}

function SerifPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const headingColor = getTextColorClass(classes.h1)
  const headingFont = getFontClass(classes.h1)

  return (
    <div className="space-y-2">
      <h4 className={`text-2xl italic ${headingColor} ${headingFont}`}>{preview.sampleHeading}</h4>
      <p className={`${classes.p} opacity-70`}>{preview.sampleText}</p>
    </div>
  )
}

function BrutalistPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const headingColor = getTextColorClass(classes.h1)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="space-y-3">
      <div className="border-4 border-black px-3 py-1.5 inline-block">
        <span className={`font-black text-xl tracking-wider ${headingColor}`}>
          {preview.sampleHeading}
        </span>
      </div>
      <p className={`font-bold text-sm tracking-wide ${textColor}`}>{preview.sampleText}</p>
      <div className="flex gap-1">
        <div className="h-3 flex-1 bg-yellow-400" />
        <div className="h-3 flex-1 bg-blue-600" />
      </div>
    </div>
  )
}

function MinimalistPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const headingColor = getTextColorClass(classes.h1)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
      <h4 className={`text-lg font-light tracking-[0.3em] uppercase ${headingColor}`}>
        {preview.sampleHeading}
      </h4>
      <p className={`text-xs tracking-[0.2em] uppercase opacity-60 ${textColor}`}>
        {preview.sampleText}
      </p>
    </div>
  )
}

function MonoPreview({
  preview,
  classes,
}: {
  preview: ThemePreset['preview']
  classes: TailwindClasses
}) {
  const accentColor = getTextColorClass(classes.a)
  const textColor = getTextColorClass(classes.p)

  return (
    <div className="space-y-3 font-mono">
      <div className="bg-gray-800 rounded px-3 py-2 inline-block border border-gray-700">
        <code className={`text-sm ${accentColor}`}>{preview.sampleHeading}</code>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs ${textColor}`}>{'<'}</span>
        <span className={`text-xs ${accentColor}`}>{'>'}</span>
      </div>
    </div>
  )
}

export default ThemeCard

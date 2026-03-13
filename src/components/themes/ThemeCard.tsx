import { FaCheck, FaHeart, FaRegHeart } from 'react-icons/fa'
import type { ThemePreset } from '../../data/themes.generated'

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
  const { preview } = theme

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

      {/* Preview Area */}
      <div
        className="h-44 p-5 flex flex-col justify-end relative overflow-hidden"
        style={{
          backgroundColor: preview.bgColor,
          fontFamily: preview.headingFont,
        }}
      >
        {preview.style === 'brutalist' ? (
          <BrutalistPreview preview={preview} />
        ) : preview.style === 'minimal' ? (
          <MinimalistPreview preview={preview} />
        ) : preview.style === 'mono' ? (
          <MonoPreview preview={preview} />
        ) : preview.style === 'serif' ? (
          <SerifPreview preview={preview} />
        ) : (
          <DefaultPreview preview={preview} />
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

function DefaultPreview({ preview }: { preview: ThemePreset['preview'] }) {
  return (
    <div className="space-y-2">
      <h4
        className="text-xl font-bold leading-tight"
        style={{ color: preview.textColor, fontFamily: preview.headingFont }}
      >
        {preview.sampleHeading}
      </h4>
      <p
        className="text-sm leading-relaxed opacity-80"
        style={{ color: preview.textColor, fontFamily: preview.bodyFont }}
      >
        {preview.sampleText}
      </p>
      <div className="flex gap-1.5 pt-1">
        <div className="h-1 w-16 rounded-full" style={{ backgroundColor: preview.accentColor }} />
        <div
          className="h-1 w-10 rounded-full opacity-50"
          style={{ backgroundColor: preview.accentColor }}
        />
      </div>
    </div>
  )
}

function SerifPreview({ preview }: { preview: ThemePreset['preview'] }) {
  return (
    <div className="space-y-2">
      <h4
        className="text-2xl font-bold leading-tight italic"
        style={{ color: preview.textColor, fontFamily: preview.headingFont }}
      >
        {preview.sampleHeading}
      </h4>
      <p
        className="text-sm leading-relaxed opacity-70"
        style={{ color: preview.textColor, fontFamily: preview.bodyFont }}
      >
        {preview.sampleText}
      </p>
    </div>
  )
}

function BrutalistPreview({ preview }: { preview: ThemePreset['preview'] }) {
  return (
    <div className="space-y-3">
      <div
        className="border-4 border-black px-3 py-1.5 inline-block"
        style={{ fontFamily: preview.headingFont }}
      >
        <span className="font-black text-xl tracking-wider" style={{ color: preview.textColor }}>
          {preview.sampleHeading}
        </span>
      </div>
      <p className="font-bold text-sm tracking-wide" style={{ color: preview.textColor }}>
        {preview.sampleText}
      </p>
      <div className="flex gap-1">
        <div className="h-3 flex-1 bg-yellow-400" />
        <div className="h-3 flex-1 bg-blue-600" />
      </div>
    </div>
  )
}

function MinimalistPreview({ preview }: { preview: ThemePreset['preview'] }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-2">
      <h4
        className="text-lg font-light tracking-[0.3em] uppercase"
        style={{ color: preview.textColor, fontFamily: preview.headingFont }}
      >
        {preview.sampleHeading}
      </h4>
      <p
        className="text-xs tracking-[0.2em] uppercase opacity-60"
        style={{ color: preview.textColor, fontFamily: preview.bodyFont }}
      >
        {preview.sampleText}
      </p>
    </div>
  )
}

function MonoPreview({ preview }: { preview: ThemePreset['preview'] }) {
  return (
    <div className="space-y-3 font-mono">
      <div className="bg-gray-800 rounded px-3 py-2 inline-block border border-gray-700">
        <code className="text-sm" style={{ color: preview.accentColor }}>
          {preview.sampleHeading}
        </code>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs" style={{ color: preview.textColor }}>
          {'<'}
        </span>
        <span className="text-xs" style={{ color: preview.accentColor }}>
          {'>'}
        </span>
      </div>
    </div>
  )
}

export default ThemeCard

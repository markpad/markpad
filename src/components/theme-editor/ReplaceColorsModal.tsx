import { useState, useMemo } from 'react'
import { FaTimes, FaExchangeAlt, FaArrowRight } from 'react-icons/fa'
import {
  type ThemeElement,
  type ElementConfig,
  COLOR_BASES,
  COLOR_INTENSITIES,
  parseColorClass,
  buildColorClass,
} from './types'

// Tailwind color values for swatches
const TAILWIND_COLORS: Record<string, Record<string, string>> = {
  white: { '500': '#ffffff' },
  black: { '500': '#000000' },
  slate: {
    '50': '#f8fafc',
    '100': '#f1f5f9',
    '200': '#e2e8f0',
    '300': '#cbd5e1',
    '400': '#94a3b8',
    '500': '#64748b',
    '600': '#475569',
    '700': '#334155',
    '800': '#1e293b',
    '900': '#0f172a',
    '950': '#020617',
  },
  gray: {
    '50': '#f9fafb',
    '100': '#f3f4f6',
    '200': '#e5e7eb',
    '300': '#d1d5db',
    '400': '#9ca3af',
    '500': '#6b7280',
    '600': '#4b5563',
    '700': '#374151',
    '800': '#1f2937',
    '900': '#111827',
    '950': '#030712',
  },
  zinc: {
    '50': '#fafafa',
    '100': '#f4f4f5',
    '200': '#e4e4e7',
    '300': '#d4d4d8',
    '400': '#a1a1aa',
    '500': '#71717a',
    '600': '#52525b',
    '700': '#3f3f46',
    '800': '#27272a',
    '900': '#18181b',
    '950': '#09090b',
  },
  neutral: {
    '50': '#fafafa',
    '100': '#f5f5f5',
    '200': '#e5e5e5',
    '300': '#d4d4d4',
    '400': '#a3a3a3',
    '500': '#737373',
    '600': '#525252',
    '700': '#404040',
    '800': '#262626',
    '900': '#171717',
    '950': '#0a0a0a',
  },
  stone: {
    '50': '#fafaf9',
    '100': '#f5f5f4',
    '200': '#e7e5e4',
    '300': '#d6d3d1',
    '400': '#a8a29e',
    '500': '#78716c',
    '600': '#57534e',
    '700': '#44403c',
    '800': '#292524',
    '900': '#1c1917',
    '950': '#0c0a09',
  },
  red: {
    '50': '#fef2f2',
    '100': '#fee2e2',
    '200': '#fecaca',
    '300': '#fca5a5',
    '400': '#f87171',
    '500': '#ef4444',
    '600': '#dc2626',
    '700': '#b91c1c',
    '800': '#991b1b',
    '900': '#7f1d1d',
    '950': '#450a0a',
  },
  orange: {
    '50': '#fff7ed',
    '100': '#ffedd5',
    '200': '#fed7aa',
    '300': '#fdba74',
    '400': '#fb923c',
    '500': '#f97316',
    '600': '#ea580c',
    '700': '#c2410c',
    '800': '#9a3412',
    '900': '#7c2d12',
    '950': '#431407',
  },
  amber: {
    '50': '#fffbeb',
    '100': '#fef3c7',
    '200': '#fde68a',
    '300': '#fcd34d',
    '400': '#fbbf24',
    '500': '#f59e0b',
    '600': '#d97706',
    '700': '#b45309',
    '800': '#92400e',
    '900': '#78350f',
    '950': '#451a03',
  },
  yellow: {
    '50': '#fefce8',
    '100': '#fef9c3',
    '200': '#fef08a',
    '300': '#fde047',
    '400': '#facc15',
    '500': '#eab308',
    '600': '#ca8a04',
    '700': '#a16207',
    '800': '#854d0e',
    '900': '#713f12',
    '950': '#422006',
  },
  lime: {
    '50': '#f7fee7',
    '100': '#ecfccb',
    '200': '#d9f99d',
    '300': '#bef264',
    '400': '#a3e635',
    '500': '#84cc16',
    '600': '#65a30d',
    '700': '#4d7c0f',
    '800': '#3f6212',
    '900': '#365314',
    '950': '#1a2e05',
  },
  green: {
    '50': '#f0fdf4',
    '100': '#dcfce7',
    '200': '#bbf7d0',
    '300': '#86efac',
    '400': '#4ade80',
    '500': '#22c55e',
    '600': '#16a34a',
    '700': '#15803d',
    '800': '#166534',
    '900': '#14532d',
    '950': '#052e16',
  },
  emerald: {
    '50': '#ecfdf5',
    '100': '#d1fae5',
    '200': '#a7f3d0',
    '300': '#6ee7b7',
    '400': '#34d399',
    '500': '#10b981',
    '600': '#059669',
    '700': '#047857',
    '800': '#065f46',
    '900': '#064e3b',
    '950': '#022c22',
  },
  teal: {
    '50': '#f0fdfa',
    '100': '#ccfbf1',
    '200': '#99f6e4',
    '300': '#5eead4',
    '400': '#2dd4bf',
    '500': '#14b8a6',
    '600': '#0d9488',
    '700': '#0f766e',
    '800': '#115e59',
    '900': '#134e4a',
    '950': '#042f2e',
  },
  cyan: {
    '50': '#ecfeff',
    '100': '#cffafe',
    '200': '#a5f3fc',
    '300': '#67e8f9',
    '400': '#22d3ee',
    '500': '#06b6d4',
    '600': '#0891b2',
    '700': '#0e7490',
    '800': '#155e75',
    '900': '#164e63',
    '950': '#083344',
  },
  sky: {
    '50': '#f0f9ff',
    '100': '#e0f2fe',
    '200': '#bae6fd',
    '300': '#7dd3fc',
    '400': '#38bdf8',
    '500': '#0ea5e9',
    '600': '#0284c7',
    '700': '#0369a1',
    '800': '#075985',
    '900': '#0c4a6e',
    '950': '#082f49',
  },
  blue: {
    '50': '#eff6ff',
    '100': '#dbeafe',
    '200': '#bfdbfe',
    '300': '#93c5fd',
    '400': '#60a5fa',
    '500': '#3b82f6',
    '600': '#2563eb',
    '700': '#1d4ed8',
    '800': '#1e40af',
    '900': '#1e3a8a',
    '950': '#172554',
  },
  indigo: {
    '50': '#eef2ff',
    '100': '#e0e7ff',
    '200': '#c7d2fe',
    '300': '#a5b4fc',
    '400': '#818cf8',
    '500': '#6366f1',
    '600': '#4f46e5',
    '700': '#4338ca',
    '800': '#3730a3',
    '900': '#312e81',
    '950': '#1e1b4b',
  },
  violet: {
    '50': '#f5f3ff',
    '100': '#ede9fe',
    '200': '#ddd6fe',
    '300': '#c4b5fd',
    '400': '#a78bfa',
    '500': '#8b5cf6',
    '600': '#7c3aed',
    '700': '#6d28d9',
    '800': '#5b21b6',
    '900': '#4c1d95',
    '950': '#2e1065',
  },
  purple: {
    '50': '#faf5ff',
    '100': '#f3e8ff',
    '200': '#e9d5ff',
    '300': '#d8b4fe',
    '400': '#c084fc',
    '500': '#a855f7',
    '600': '#9333ea',
    '700': '#7e22ce',
    '800': '#6b21a8',
    '900': '#581c87',
    '950': '#3b0764',
  },
  fuchsia: {
    '50': '#fdf4ff',
    '100': '#fae8ff',
    '200': '#f5d0fe',
    '300': '#f0abfc',
    '400': '#e879f9',
    '500': '#d946ef',
    '600': '#c026d3',
    '700': '#a21caf',
    '800': '#86198f',
    '900': '#701a75',
    '950': '#4a044e',
  },
  pink: {
    '50': '#fdf2f8',
    '100': '#fce7f3',
    '200': '#fbcfe8',
    '300': '#f9a8d4',
    '400': '#f472b6',
    '500': '#ec4899',
    '600': '#db2777',
    '700': '#be185d',
    '800': '#9d174d',
    '900': '#831843',
    '950': '#500724',
  },
  rose: {
    '50': '#fff1f2',
    '100': '#ffe4e6',
    '200': '#fecdd3',
    '300': '#fda4af',
    '400': '#fb7185',
    '500': '#f43f5e',
    '600': '#e11d48',
    '700': '#be123c',
    '800': '#9f1239',
    '900': '#881337',
    '950': '#4c0519',
  },
}

function getColorHex(base: string, intensity: string): string {
  if (!base) return '#e5e7eb'
  if (base === 'white') return '#ffffff'
  if (base === 'black') return '#000000'
  return TAILWIND_COLORS[base]?.[intensity || '500'] || '#e5e7eb'
}

// Extract unique colors from configs
interface ColorUsage {
  color: string // e.g., "pink-500"
  base: string
  intensity: string
  count: number
  usedIn: string[] // e.g., ["h1 text", "h2 text", "body bg"]
}

function extractColorsFromConfigs(configs: Record<ThemeElement, ElementConfig>): ColorUsage[] {
  const colorMap = new Map<string, ColorUsage>()

  const colorFields: {
    field: keyof ElementConfig
    prefix: 'text' | 'bg' | 'border'
    label: string
  }[] = [
    { field: 'textColor', prefix: 'text', label: 'text' },
    { field: 'bgColor', prefix: 'bg', label: 'bg' },
    { field: 'borderColor', prefix: 'border', label: 'border' },
    { field: 'darkTextColor', prefix: 'text', label: 'dark text' },
    { field: 'darkBgColor', prefix: 'bg', label: 'dark bg' },
    { field: 'darkBorderColor', prefix: 'border', label: 'dark border' },
    { field: 'evenBgColor', prefix: 'bg', label: 'even bg' },
    { field: 'oddBgColor', prefix: 'bg', label: 'odd bg' },
  ]

  for (const [element, config] of Object.entries(configs)) {
    for (const { field, prefix, label } of colorFields) {
      const value = config[field]
      if (!value) continue

      const parsed = parseColorClass(value, prefix)
      if (!parsed.base) continue

      const colorKey =
        parsed.base === 'white' || parsed.base === 'black'
          ? parsed.base
          : `${parsed.base}-${parsed.intensity}`

      const existing = colorMap.get(colorKey)
      if (existing) {
        existing.count++
        existing.usedIn.push(`${element} ${label}`)
      } else {
        colorMap.set(colorKey, {
          color: colorKey,
          base: parsed.base,
          intensity: parsed.intensity,
          count: 1,
          usedIn: [`${element} ${label}`],
        })
      }
    }
  }

  return Array.from(colorMap.values()).sort((a, b) => b.count - a.count)
}

// Replace a color in all configs
function replaceColorInConfigs(
  configs: Record<ThemeElement, ElementConfig>,
  sourceBase: string,
  sourceIntensity: string,
  targetBase: string,
  targetIntensity: string
): Record<ThemeElement, ElementConfig> {
  const newConfigs = { ...configs }

  const colorFields: { field: keyof ElementConfig; prefix: 'text' | 'bg' | 'border' }[] = [
    { field: 'textColor', prefix: 'text' },
    { field: 'bgColor', prefix: 'bg' },
    { field: 'borderColor', prefix: 'border' },
    { field: 'darkTextColor', prefix: 'text' },
    { field: 'darkBgColor', prefix: 'bg' },
    { field: 'darkBorderColor', prefix: 'border' },
    { field: 'evenBgColor', prefix: 'bg' },
    { field: 'oddBgColor', prefix: 'bg' },
  ]

  for (const [element, config] of Object.entries(configs)) {
    const newConfig = { ...config }
    let changed = false

    for (const { field, prefix } of colorFields) {
      const value = config[field]
      if (!value) continue

      const parsed = parseColorClass(value, prefix)

      // Check if this color matches the source
      const isMatch =
        parsed.base === sourceBase &&
        (sourceBase === 'white' || sourceBase === 'black' || parsed.intensity === sourceIntensity)

      if (isMatch) {
        newConfig[field] = buildColorClass(prefix, targetBase, targetIntensity)
        changed = true
      }
    }

    if (changed) {
      newConfigs[element as ThemeElement] = newConfig
    }
  }

  return newConfigs
}

interface ReplaceColorsModalProps {
  isOpen: boolean
  onClose: () => void
  configs: Record<ThemeElement, ElementConfig>
  onReplace: (newConfigs: Record<ThemeElement, ElementConfig>) => void
}

export function ReplaceColorsModal({
  isOpen,
  onClose,
  configs,
  onReplace,
}: ReplaceColorsModalProps) {
  const [sourceColor, setSourceColor] = useState<ColorUsage | null>(null)
  const [targetBase, setTargetBase] = useState('')
  const [targetIntensity, setTargetIntensity] = useState('500')

  // Extract colors used in current theme
  const usedColors = useMemo(() => extractColorsFromConfigs(configs), [configs])

  const handleReplace = () => {
    if (!sourceColor || !targetBase) return

    const newConfigs = replaceColorInConfigs(
      configs,
      sourceColor.base,
      sourceColor.intensity,
      targetBase,
      targetIntensity
    )

    onReplace(newConfigs)
    setSourceColor(null)
    setTargetBase('')
    setTargetIntensity('500')
    onClose()
  }

  const showTargetIntensity = targetBase && targetBase !== 'white' && targetBase !== 'black'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <FaExchangeAlt className="w-4 h-4 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Replace Colors
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {usedColors.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No colors found in the current theme configuration.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Source Color Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select a color to replace
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {usedColors.map((colorUsage) => (
                    <button
                      key={colorUsage.color}
                      onClick={() => setSourceColor(colorUsage)}
                      className={`group relative flex flex-col items-center p-2 rounded-lg border-2 transition-all ${
                        sourceColor?.color === colorUsage.color
                          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                      title={colorUsage.usedIn.join(', ')}
                    >
                      <div
                        className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 shadow-sm mb-1"
                        style={{
                          backgroundColor: getColorHex(colorUsage.base, colorUsage.intensity),
                        }}
                      />
                      <span className="text-[10px] text-gray-600 dark:text-gray-400 truncate w-full text-center">
                        {colorUsage.color}
                      </span>
                      <span className="text-[9px] text-gray-400 dark:text-gray-500">
                        {colorUsage.count}×
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Arrow */}
              {sourceColor && (
                <div className="flex items-center justify-center">
                  <FaArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              )}

              {/* Target Color Selection */}
              {sourceColor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Replace with
                  </label>
                  <div className="flex gap-4">
                    {/* Color Base */}
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0"
                          style={{ backgroundColor: getColorHex(targetBase, targetIntensity) }}
                        />
                        <select
                          value={targetBase}
                          onChange={(e) => setTargetBase(e.target.value)}
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select color...</option>
                          {COLOR_BASES.filter((c) => c.value !== '').map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Intensity */}
                    <div className="w-32">
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Intensity
                      </label>
                      <select
                        value={targetIntensity}
                        onChange={(e) => setTargetIntensity(e.target.value)}
                        disabled={!showTargetIntensity}
                        className={`w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 ${
                          !showTargetIntensity ? 'opacity-40 cursor-not-allowed' : ''
                        }`}
                      >
                        {COLOR_INTENSITIES.map((intensity) => (
                          <option key={intensity.value} value={intensity.value}>
                            {intensity.value}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Preview */}
              {sourceColor && targetBase && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preview
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{
                          backgroundColor: getColorHex(sourceColor.base, sourceColor.intensity),
                        }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {sourceColor.color}
                      </span>
                    </div>
                    <FaArrowRight className="w-4 h-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: getColorHex(targetBase, targetIntensity) }}
                      />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {targetBase === 'white' || targetBase === 'black'
                          ? targetBase
                          : `${targetBase}-${targetIntensity}`}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                    This will replace {sourceColor.count} occurrence
                    {sourceColor.count > 1 ? 's' : ''} across:{' '}
                    <span className="text-gray-600 dark:text-gray-300">
                      {sourceColor.usedIn.slice(0, 5).join(', ')}
                      {sourceColor.usedIn.length > 5 &&
                        ` and ${sourceColor.usedIn.length - 5} more`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleReplace}
            disabled={!sourceColor || !targetBase}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Replace Color
          </button>
        </div>
      </div>
    </div>
  )
}

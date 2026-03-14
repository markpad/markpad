import { useState } from 'react'
import {
  FaChevronDown,
  FaChevronRight,
  FaFont,
  FaPalette,
  FaRulerCombined,
  FaBorderStyle,
  FaMagic,
  FaListUl,
  FaCode,
  FaMoon,
  FaTable,
} from 'react-icons/fa'
import type { IconType } from 'react-icons'
import {
  type ThemeElement,
  type ElementConfig,
  ELEMENT_SCHEMAS,
  FONT_SIZES,
  FONT_WEIGHTS,
  FONT_FAMILIES,
  MARGIN_OPTIONS,
  PADDING_OPTIONS,
  BORDER_WIDTHS,
  BORDER_SIDES,
  BORDER_RADIUS,
  LETTER_SPACING,
  LINE_HEIGHT,
  TEXT_TRANSFORM,
  TEXT_DECORATION,
  LIST_STYLE,
  SHADOWS,
  configToClasses,
  COLOR_BASES,
  COLOR_INTENSITIES,
  buildColorClass,
  parseColorClass,
} from './types'

interface ElementConfigPanelProps {
  element: ThemeElement
  config: ElementConfig
  onChange: (config: ElementConfig) => void
}

interface SelectFieldProps {
  label: string
  value: string | undefined
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ColorPickerFieldProps {
  label: string
  value: string | undefined
  prefix: 'text' | 'bg' | 'border'
  onChange: (value: string) => void
  allowNone?: boolean
}

function ColorPickerField({
  label,
  value,
  prefix,
  onChange,
  allowNone = false,
}: ColorPickerFieldProps) {
  const parsed = parseColorClass(value || '', prefix)
  const baseColor = COLOR_BASES.find((c) => c.value === parsed.base)
  const showIntensity =
    baseColor &&
    !('hasIntensity' in baseColor && baseColor.hasIntensity === false) &&
    parsed.base !== '' &&
    parsed.base !== 'white' &&
    parsed.base !== 'black'

  const handleBaseChange = (newBase: string) => {
    if (!newBase) {
      onChange('')
    } else if (newBase === 'white' || newBase === 'black') {
      onChange(buildColorClass(prefix, newBase, ''))
    } else {
      onChange(buildColorClass(prefix, newBase, parsed.intensity || '500'))
    }
  }

  const handleIntensityChange = (newIntensity: string) => {
    onChange(buildColorClass(prefix, parsed.base, newIntensity))
  }

  // Preview color swatch
  const previewClass = value || ''

  return (
    <div className="col-span-2 flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</label>
      <div className="flex gap-2 items-center">
        {/* Color preview swatch */}
        <div
          className={`w-6 h-6 rounded border border-gray-300 dark:border-gray-600 flex-shrink-0 ${!value ? 'bg-gray-100 dark:bg-gray-700' : prefix === 'text' ? '' : previewClass}`}
          style={
            value && prefix === 'text'
              ? { backgroundColor: getTextColorAsBackground(value) }
              : undefined
          }
        />
        {/* Base color select */}
        <select
          value={parsed.base}
          onChange={(e) => handleBaseChange(e.target.value)}
          className="flex-1 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {allowNone && <option value="">None</option>}
          {COLOR_BASES.filter((c) => allowNone || c.value !== '').map((color) => (
            <option key={color.value} value={color.value}>
              {color.label}
            </option>
          ))}
        </select>
        {/* Intensity select - always show but disable when not applicable */}
        <select
          value={parsed.intensity || '500'}
          onChange={(e) => handleIntensityChange(e.target.value)}
          disabled={!showIntensity}
          className={`w-24 px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${!showIntensity ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {COLOR_INTENSITIES.map((intensity) => (
            <option key={intensity.value} value={intensity.value}>
              {intensity.value}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

// Helper to convert text-color class to background for preview swatch
function getTextColorAsBackground(textClass: string): string {
  const colorMap: Record<string, string> = {
    'text-white': '#ffffff',
    'text-black': '#000000',
  }
  if (colorMap[textClass]) return colorMap[textClass]

  // Extract color from text-{color}-{intensity}
  const match = textClass.match(/text-([a-z]+)-(\d+)/)
  if (match) {
    const [, color, intensity] = match
    // Return CSS variable or approximate color
    return `var(--tw-${color}-${intensity}, ${getTailwindColor(color, intensity)})`
  }
  return '#gray'
}

// Approximate Tailwind colors (subset for preview)
function getTailwindColor(color: string, intensity: string): string {
  const colors: Record<string, Record<string, string>> = {
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
  }
  return colors[color]?.[intensity] || '#888'
}

interface CollapsibleSectionProps {
  title: string
  icon: IconType
  defaultOpen?: boolean
  children: React.ReactNode
}

function CollapsibleSection({
  title,
  icon: Icon,
  defaultOpen = true,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        {isOpen ? (
          <FaChevronDown className="w-3 h-3 text-gray-400" />
        ) : (
          <FaChevronRight className="w-3 h-3 text-gray-400" />
        )}
        <Icon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
        <span className="text-sm font-medium">{title}</span>
      </button>
      {isOpen && <div className="px-3 pb-3 grid grid-cols-2 gap-3">{children}</div>}
    </div>
  )
}

export function ElementConfigPanel({ element, config, onChange }: ElementConfigPanelProps) {
  const schema = ELEMENT_SCHEMAS[element]
  const { availableOptions } = schema

  const updateConfig = (key: keyof ElementConfig, value: string) => {
    onChange({ ...config, [key]: value || undefined })
  }

  // Group options into sections
  const hasTypography =
    availableOptions.includes('fontSize') ||
    availableOptions.includes('fontWeight') ||
    availableOptions.includes('fontFamily') ||
    availableOptions.includes('letterSpacing') ||
    availableOptions.includes('lineHeight') ||
    availableOptions.includes('textTransform') ||
    availableOptions.includes('textDecoration') ||
    availableOptions.includes('fontStyle')

  const hasColors = availableOptions.includes('textColor') || availableOptions.includes('bgColor')

  const hasTableRowColors =
    availableOptions.includes('evenBgColor') || availableOptions.includes('oddBgColor')

  const hasSpacing =
    availableOptions.includes('marginTop') ||
    availableOptions.includes('marginBottom') ||
    availableOptions.includes('paddingX') ||
    availableOptions.includes('paddingY')

  const hasBorders =
    availableOptions.includes('borderWidth') ||
    availableOptions.includes('borderColor') ||
    availableOptions.includes('borderRadius')

  const hasEffects = availableOptions.includes('shadow')

  const hasLists = availableOptions.includes('listStyle')

  // Generate current classes for display
  const currentClasses = configToClasses(config, element)

  return (
    <div className="flex flex-col">
      {/* Element name header */}
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase">
          {element}
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {availableOptions.length} options
        </span>
      </div>

      {/* Typography Section */}
      {hasTypography && (
        <CollapsibleSection title="Typography" icon={FaFont}>
          {availableOptions.includes('fontSize') && (
            <SelectField
              label="Font Size"
              value={config.fontSize}
              options={FONT_SIZES}
              onChange={(v) => updateConfig('fontSize', v)}
            />
          )}
          {availableOptions.includes('fontWeight') && (
            <SelectField
              label="Font Weight"
              value={config.fontWeight}
              options={FONT_WEIGHTS}
              onChange={(v) => updateConfig('fontWeight', v)}
            />
          )}
          {availableOptions.includes('fontFamily') && (
            <SelectField
              label="Font Family"
              value={config.fontFamily}
              options={FONT_FAMILIES}
              onChange={(v) => updateConfig('fontFamily', v)}
            />
          )}
          {availableOptions.includes('letterSpacing') && (
            <SelectField
              label="Letter Spacing"
              value={config.letterSpacing}
              options={[{ value: '', label: 'Default' }, ...LETTER_SPACING]}
              onChange={(v) => updateConfig('letterSpacing', v)}
            />
          )}
          {availableOptions.includes('lineHeight') && (
            <SelectField
              label="Line Height"
              value={config.lineHeight}
              options={[{ value: '', label: 'Default' }, ...LINE_HEIGHT]}
              onChange={(v) => updateConfig('lineHeight', v)}
            />
          )}
          {availableOptions.includes('textTransform') && (
            <SelectField
              label="Text Transform"
              value={config.textTransform}
              options={TEXT_TRANSFORM}
              onChange={(v) => updateConfig('textTransform', v)}
            />
          )}
          {availableOptions.includes('textDecoration') && (
            <SelectField
              label="Text Decoration"
              value={config.textDecoration}
              options={TEXT_DECORATION}
              onChange={(v) => updateConfig('textDecoration', v)}
            />
          )}
          {availableOptions.includes('fontStyle') && (
            <SelectField
              label="Font Style"
              value={config.fontStyle}
              options={[
                { value: '', label: 'Normal' },
                { value: 'italic', label: 'Italic' },
              ]}
              onChange={(v) => updateConfig('fontStyle', v)}
            />
          )}
        </CollapsibleSection>
      )}

      {/* Colors Section (Light Mode) */}
      {hasColors && (
        <CollapsibleSection title="Colors (Light)" icon={FaPalette}>
          {availableOptions.includes('textColor') && (
            <ColorPickerField
              label="Text Color"
              value={config.textColor}
              prefix="text"
              onChange={(v) => updateConfig('textColor', v)}
            />
          )}
          {availableOptions.includes('bgColor') && (
            <ColorPickerField
              label="Background"
              value={config.bgColor}
              prefix="bg"
              onChange={(v) => updateConfig('bgColor', v)}
              allowNone
            />
          )}
        </CollapsibleSection>
      )}

      {/* Colors Section (Dark Mode) */}
      {hasColors && (
        <CollapsibleSection title="Colors (Dark)" icon={FaMoon} defaultOpen={false}>
          {availableOptions.includes('textColor') && (
            <ColorPickerField
              label="Text Color"
              value={config.darkTextColor}
              prefix="text"
              onChange={(v) => updateConfig('darkTextColor', v)}
              allowNone
            />
          )}
          {availableOptions.includes('bgColor') && (
            <ColorPickerField
              label="Background"
              value={config.darkBgColor}
              prefix="bg"
              onChange={(v) => updateConfig('darkBgColor', v)}
              allowNone
            />
          )}
          {availableOptions.includes('borderColor') && (
            <ColorPickerField
              label="Border Color"
              value={config.darkBorderColor}
              prefix="border"
              onChange={(v) => updateConfig('darkBorderColor', v)}
              allowNone
            />
          )}
        </CollapsibleSection>
      )}

      {/* Table Row Colors Section */}
      {hasTableRowColors && (
        <CollapsibleSection title="Row Colors" icon={FaTable}>
          {availableOptions.includes('evenBgColor') && (
            <ColorPickerField
              label="Even Row Background"
              value={config.evenBgColor}
              prefix="bg"
              onChange={(v) => updateConfig('evenBgColor', v)}
              allowNone
            />
          )}
          {availableOptions.includes('oddBgColor') && (
            <ColorPickerField
              label="Odd Row Background"
              value={config.oddBgColor}
              prefix="bg"
              onChange={(v) => updateConfig('oddBgColor', v)}
              allowNone
            />
          )}
        </CollapsibleSection>
      )}

      {/* Spacing Section */}
      {hasSpacing && (
        <CollapsibleSection title="Spacing" icon={FaRulerCombined} defaultOpen={false}>
          {availableOptions.includes('marginTop') && (
            <SelectField
              label="Margin Top"
              value={config.marginTop}
              options={MARGIN_OPTIONS}
              onChange={(v) => updateConfig('marginTop', v)}
            />
          )}
          {availableOptions.includes('marginBottom') && (
            <SelectField
              label="Margin Bottom"
              value={config.marginBottom}
              options={MARGIN_OPTIONS}
              onChange={(v) => updateConfig('marginBottom', v)}
            />
          )}
          {availableOptions.includes('paddingX') && (
            <SelectField
              label="Padding X"
              value={config.paddingX}
              options={PADDING_OPTIONS}
              onChange={(v) => updateConfig('paddingX', v)}
            />
          )}
          {availableOptions.includes('paddingY') && (
            <SelectField
              label="Padding Y"
              value={config.paddingY}
              options={PADDING_OPTIONS}
              onChange={(v) => updateConfig('paddingY', v)}
            />
          )}
        </CollapsibleSection>
      )}

      {/* Borders Section */}
      {hasBorders && (
        <CollapsibleSection title="Borders" icon={FaBorderStyle} defaultOpen={false}>
          {availableOptions.includes('borderWidth') && (
            <SelectField
              label="Border Width"
              value={config.borderWidth}
              options={BORDER_WIDTHS}
              onChange={(v) => updateConfig('borderWidth', v)}
            />
          )}
          {availableOptions.includes('borderWidth') && availableOptions.includes('borderSide') && (
            <SelectField
              label="Border Side"
              value={config.borderSide}
              options={BORDER_SIDES}
              onChange={(v) => updateConfig('borderSide', v)}
            />
          )}
          {availableOptions.includes('borderColor') && (
            <ColorPickerField
              label="Border Color"
              value={config.borderColor}
              prefix="border"
              onChange={(v) => updateConfig('borderColor', v)}
              allowNone
            />
          )}
          {availableOptions.includes('borderRadius') && (
            <SelectField
              label="Border Radius"
              value={config.borderRadius}
              options={BORDER_RADIUS}
              onChange={(v) => updateConfig('borderRadius', v)}
            />
          )}
        </CollapsibleSection>
      )}

      {/* Effects Section */}
      {hasEffects && (
        <CollapsibleSection title="Effects" icon={FaMagic} defaultOpen={false}>
          {availableOptions.includes('shadow') && (
            <SelectField
              label="Shadow"
              value={config.shadow}
              options={SHADOWS}
              onChange={(v) => updateConfig('shadow', v)}
            />
          )}
        </CollapsibleSection>
      )}

      {/* Lists Section */}
      {hasLists && (
        <CollapsibleSection title="List Style" icon={FaListUl} defaultOpen={true}>
          {availableOptions.includes('listStyle') && (
            <SelectField
              label="List Style"
              value={config.listStyle}
              options={LIST_STYLE}
              onChange={(v) => updateConfig('listStyle', v)}
            />
          )}
        </CollapsibleSection>
      )}

      {/* Custom Classes */}
      {availableOptions.includes('customClasses') && (
        <CollapsibleSection title="Custom Classes" icon={FaCode} defaultOpen={false}>
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
              Additional Tailwind Classes
            </label>
            <input
              type="text"
              value={config.customClasses || ''}
              onChange={(e) => updateConfig('customClasses', e.target.value)}
              placeholder="e.g., hover:text-blue-700 transition-colors"
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CollapsibleSection>
      )}

      {/* Generated Classes Display */}
      <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
          Generated Classes
        </label>
        <code className="text-xs text-gray-700 dark:text-gray-300 break-all block">
          {currentClasses || '(none)'}
        </code>
      </div>
    </div>
  )
}

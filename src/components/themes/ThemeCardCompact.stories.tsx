import type { Meta, StoryObj } from '@storybook/react'
import { ThemeCardCompact } from './ThemeCardCompact'
import { themePresets, THEME_CATEGORIES } from '@/data/themes.generated'

const themeMapping = Object.fromEntries(themePresets.map((t) => [t.id, t]))
const themeLabels = Object.fromEntries(themePresets.map((t) => [t.id, `${t.name} — ${t.category}`]))
const categoryLabels = Object.fromEntries(THEME_CATEGORIES.map((c) => [c.value, c.label]))

const meta: Meta<typeof ThemeCardCompact> = {
  title: 'Themes/ThemeCardCompact',
  component: ThemeCardCompact,
  parameters: { layout: 'padded' },
  argTypes: {
    theme: {
      options: themePresets.map((t) => t.id),
      mapping: themeMapping,
      control: { type: 'select', labels: themeLabels },
    },
  },
  args: {
    theme: themePresets[0].id as any,
    onApply: () => {},
    onToggleFavorite: () => {},
  },
}
export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { isActive: false, isFavorite: false },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Active: Story = {
  args: { isActive: true },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Favorite: Story = {
  args: { isFavorite: true },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Sidebar: Story = {
  argTypes: {
    category: {
      control: 'select',
      options: ['all', ...THEME_CATEGORIES.filter((c) => c.value !== 'all').map((c) => c.value)],
      labels: categoryLabels,
    },
    isActive: { table: { disable: true } },
    isFavorite: { table: { disable: true } },
  } as any,
  args: { category: 'all' } as any,
  render: (args: any) => {
    const { theme, category } = args
    const cats = THEME_CATEGORIES.filter((c) => c.value !== 'all')
    const filtered =
      !category || category === 'all' ? cats : cats.filter((c) => c.value === category)
    return (
      <div className="w-64 bg-gray-900 rounded-lg p-2 space-y-3">
        {filtered.map((cat) => {
          const themes = themePresets.filter((t) => t.category === cat.value)
          if (themes.length === 0) return null
          return (
            <div key={cat.value}>
              <p className="text-[10px] uppercase tracking-widest text-gray-500 px-2 py-1">
                {cat.label}
              </p>
              <div className="space-y-0.5">
                {themes.map((t) => (
                  <ThemeCardCompact
                    key={t.id}
                    theme={t}
                    isActive={t.id === theme?.id}
                    isFavorite={false}
                    onApply={args.onApply}
                    onToggleFavorite={args.onToggleFavorite}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  },
  parameters: { backgrounds: { default: 'dark' } },
}

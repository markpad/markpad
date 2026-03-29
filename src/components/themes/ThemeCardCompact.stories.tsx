import type { Meta, StoryObj } from '@storybook/react'
import { ThemeCardCompact } from './ThemeCardCompact'
import { themePresets, THEME_CATEGORIES } from '@/data/themes.generated'

const meta: Meta<typeof ThemeCardCompact> = {
  title: 'Themes/ThemeCardCompact',
  component: ThemeCardCompact,
  parameters: { layout: 'padded' },
  args: {
    onApply: () => {},
    onToggleFavorite: () => {},
  },
}
export default meta

type Story = StoryObj<typeof ThemeCardCompact>

export const Default: Story = {
  args: {
    theme: themePresets[0],
    isActive: false,
    isFavorite: false,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Active: Story = {
  args: {
    theme: themePresets[0],
    isActive: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Favorite: Story = {
  args: {
    theme: themePresets[0],
    isActive: false,
    isFavorite: true,
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
}

export const Sidebar: Story = {
  render: () => (
    <div className="w-64 bg-gray-900 rounded-lg p-2 space-y-3">
      {THEME_CATEGORIES.filter((c) => c.value !== 'all').map((cat) => {
        const themes = themePresets.filter((t) => t.category === cat.value)
        if (themes.length === 0) return null
        return (
          <div key={cat.value}>
            <p className="text-[10px] uppercase tracking-widest text-gray-500 px-2 py-1">
              {cat.label}
            </p>
            <div className="space-y-0.5">
              {themes.map((theme, i) => (
                <ThemeCardCompact
                  key={theme.id}
                  theme={theme}
                  isActive={i === 0}
                  isFavorite={false}
                  onApply={() => {}}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
}

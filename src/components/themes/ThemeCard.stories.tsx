import type { Meta, StoryObj } from '@storybook/react'
import { ThemeCard } from './ThemeCard'
import { ThemeCardCompact } from './ThemeCardCompact'
import { themePresets, THEME_CATEGORIES } from '@/data/themes.generated'

// ─── ThemeCard ───────────────────────────────────────────────────────────────

const metaCard: Meta<typeof ThemeCard> = {
  title: 'Themes/ThemeCard',
  component: ThemeCard,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
  args: {
    onApply: () => {},
    onToggleFavorite: () => {},
  },
}
export default metaCard

type CardStory = StoryObj<typeof ThemeCard>

export const Default: CardStory = {
  args: {
    theme: themePresets[0],
    isActive: false,
    isFavorite: false,
  },
}

export const Active: CardStory = {
  args: {
    theme: themePresets[0],
    isActive: true,
    isFavorite: false,
  },
}

export const Favorite: CardStory = {
  args: {
    theme: themePresets[0],
    isActive: false,
    isFavorite: true,
  },
}

export const AllThemes: CardStory = {
  render: () => (
    <div className="space-y-10 max-w-4xl">
      {THEME_CATEGORIES.filter((c) => c.value !== 'all').map((cat) => {
        const themes = themePresets.filter((t) => t.category === cat.value)
        if (themes.length === 0) return null
        return (
          <section key={cat.value}>
            <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {cat.label}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => (
                <ThemeCard
                  key={theme.id}
                  theme={theme}
                  isActive={false}
                  isFavorite={false}
                  onApply={() => {}}
                  onToggleFavorite={() => {}}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
}

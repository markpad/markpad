import type { Meta, StoryObj } from '@storybook/react'
import { ThemeCard } from './ThemeCard'
import { themePresets, THEME_CATEGORIES } from '@/data/themes.generated'

const themeMapping = Object.fromEntries(themePresets.map((t) => [t.id, t]))
const themeLabels = Object.fromEntries(themePresets.map((t) => [t.id, `${t.name} — ${t.category}`]))
const categoryLabels = Object.fromEntries(THEME_CATEGORIES.map((c) => [c.value, c.label]))

const meta: Meta<typeof ThemeCard> = {
  title: 'Themes/ThemeCard',
  component: ThemeCard,
  parameters: { layout: 'padded', backgrounds: { default: 'dark' } },
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
}

export const Active: Story = {
  args: { isActive: true },
}

export const Favorite: Story = {
  args: { isFavorite: true },
}

export const AllThemes: Story = {
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
      <div className="space-y-10 max-w-4xl">
        {filtered.map((cat) => {
          const themes = themePresets.filter((t) => t.category === cat.value)
          if (themes.length === 0) return null
          return (
            <section key={cat.value}>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
                {cat.label}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {themes.map((t) => (
                  <ThemeCard
                    key={t.id}
                    theme={t}
                    isActive={t.id === theme?.id}
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
    )
  },
  parameters: { backgrounds: { default: 'dark' } },
}

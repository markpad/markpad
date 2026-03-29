import type { Meta, StoryObj } from '@storybook/react'
import { MarkdownPreview } from './MarkdownPreview'
import { themePresets } from '@/data/themes.generated'

const SAMPLE_MARKDOWN = `# Welcome to Markpad

This is a **Markdown** preview rendered with different themes.

## Features

- Syntax highlighting for code blocks
- Support for *italic* and **bold** text
- [Links](https://example.com) and images
- Tables and blockquotes

### Code Example

\`\`\`javascript
function hello(name) {
  return \`Hello, \${name}!\`
}
\`\`\`

### Blockquote

> "The art of writing is the art of discovering what you believe."
> — Gustave Flaubert

### Table

| Feature      | Supported |
|-------------|-----------|
| Bold/Italic  | ✓         |
| Code blocks  | ✓         |
| Tables       | ✓         |
| Images       | ✓         |

Some \`inline code\` appears here too.
`

const meta: Meta<typeof MarkdownPreview> = {
  title: 'Preview/MarkdownPreview',
  component: MarkdownPreview,
  parameters: { layout: 'padded' },
  args: {
    markdown: SAMPLE_MARKDOWN,
  },
}
export default meta

type Story = StoryObj<typeof MarkdownPreview>

// Generate a story per theme preset
export const AcademicPaper: Story = {
  args: {
    tailwindClasses: themePresets.find((t) => t.id === 'academic-paper')!.tailwindClasses,
    fontConfig: themePresets.find((t) => t.id === 'academic-paper')!.fontConfig,
  },
}

export const BlogPost: Story = {
  args: {
    tailwindClasses: themePresets.find((t) => t.id === 'blog-post')!.tailwindClasses,
    fontConfig: themePresets.find((t) => t.id === 'blog-post')!.fontConfig,
  },
}

export const Dracula: Story = {
  args: {
    tailwindClasses: themePresets.find((t) => t.id === 'dracula')!.tailwindClasses,
    fontConfig: themePresets.find((t) => t.id === 'dracula')!.fontConfig,
  },
  parameters: { backgrounds: { default: 'dark' } },
}

export const Cyberpunk: Story = {
  args: {
    tailwindClasses:
      themePresets.find((t) => t.id === 'cyberpunk')?.tailwindClasses ??
      themePresets[0].tailwindClasses,
    fontConfig:
      themePresets.find((t) => t.id === 'cyberpunk')?.fontConfig ?? themePresets[0].fontConfig,
  },
}

export const DarkModePro: Story = {
  args: {
    tailwindClasses:
      themePresets.find((t) => t.id === 'dark-mode-pro')?.tailwindClasses ??
      themePresets[0].tailwindClasses,
    fontConfig:
      themePresets.find((t) => t.id === 'dark-mode-pro')?.fontConfig ?? themePresets[0].fontConfig,
  },
  parameters: { backgrounds: { default: 'dark' } },
}

export const ThemeGallery: Story = {
  render: () => (
    <div className="space-y-8">
      {themePresets.slice(0, 6).map((theme) => (
        <section key={theme.id} className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">{theme.name}</span>
            <span className="text-xs text-gray-500">{theme.description}</span>
          </div>
          <MarkdownPreview
            markdown={SAMPLE_MARKDOWN}
            tailwindClasses={theme.tailwindClasses}
            fontConfig={theme.fontConfig}
          />
        </section>
      ))}
    </div>
  ),
  parameters: { layout: 'fullscreen' },
}

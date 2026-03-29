import type { Meta, StoryObj } from '@storybook/react'
import { TemplateCard } from './TemplateCard'
import type { MarkpadTemplate } from '@/lib/repositories'

const meta: Meta<typeof TemplateCard> = {
  title: 'Templates/TemplateCard',
  component: TemplateCard,
  parameters: { layout: 'padded' },
  args: {
    onUseTemplate: () => {},
    onEditTemplate: () => {},
  },
}
export default meta

type Story = StoryObj<typeof TemplateCard>

const baseTemplate: MarkpadTemplate = {
  id: '1',
  title: 'Blog Post',
  description: 'A structured template for blog posts with frontmatter.',
  content:
    '# {{title}}\n\n*By {{author}} — {{date}}*\n\n## Introduction\n\n{{intro}}\n\n## Body\n\n{{body}}',
  variablesSchema: {
    title: { type: 'text', label: 'Title', default: '' },
    author: { type: 'text', label: 'Author', default: '' },
    date: { type: 'text', label: 'Date', default: '' },
    intro: { type: 'textarea', label: 'Introduction', default: '' },
    body: { type: 'textarea', label: 'Body', default: '' },
  },
  category: 'writing',
  isSystem: false,
  version: 1,
  createdAt: new Date(Date.now() - 86400000 * 10),
  updatedAt: new Date(Date.now() - 3600000),
}

export const GridView: Story = {
  args: {
    template: baseTemplate,
    viewMode: 'grid',
  },
}

export const ListView: Story = {
  args: {
    template: baseTemplate,
    viewMode: 'list',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
}

export const SystemTemplate: Story = {
  args: {
    template: { ...baseTemplate, isSystem: true, title: 'Meeting Notes', category: 'professional' },
    viewMode: 'grid',
  },
}

export const NoVariables: Story = {
  args: {
    template: {
      ...baseTemplate,
      title: 'Simple Note',
      variablesSchema: {},
      category: 'general',
    },
    viewMode: 'grid',
  },
}

export const CategoryColors: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      {(['writing', 'professional', 'academic', 'technical', 'general'] as const).map(
        (category) => (
          <TemplateCard
            key={category}
            template={{ ...baseTemplate, id: category, title: `${category} template`, category }}
            viewMode="grid"
            onUseTemplate={() => {}}
            onEditTemplate={() => {}}
          />
        )
      )}
    </div>
  ),
}

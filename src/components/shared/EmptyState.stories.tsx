import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'
import {
  DocumentsIllustration,
  TemplatesIllustration,
  ThemesIllustration,
} from './EmptyStateIllustrations'

const meta: Meta<typeof EmptyState> = {
  title: 'Shared/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
}
export default meta

type Story = StoryObj<typeof EmptyState>

export const Documents: Story = {
  args: {
    illustration: <DocumentsIllustration />,
    title: 'No documents yet',
    description: 'Create your first document to start writing in Markdown.',
    action: {
      label: 'New Document',
      onClick: () => {},
    },
  },
}

export const Templates: Story = {
  args: {
    illustration: <TemplatesIllustration />,
    title: 'No templates yet',
    description: 'Create reusable templates for your recurring document structures.',
    action: {
      label: 'Create Template',
      onClick: () => {},
      color: 'bg-purple-500 hover:bg-purple-600',
    },
    secondaryAction: {
      label: 'Browse system templates',
      onClick: () => {},
    },
  },
}

export const Themes: Story = {
  args: {
    illustration: <ThemesIllustration />,
    title: 'No custom themes',
    description: 'Design your own themes and apply them to any document.',
    action: {
      label: 'Create Theme',
      onClick: () => {},
      color: 'bg-fuchsia-500 hover:bg-fuchsia-600',
    },
  },
}

export const NoAction: Story = {
  args: {
    illustration: <DocumentsIllustration />,
    title: 'Nothing found',
    description: 'Try a different search query.',
  },
}

import type { Meta, StoryObj } from '@storybook/react'
import { DocumentCard } from './DocumentCard'
import type { MarkpadDocument } from '@/lib/repositories'

const meta: Meta<typeof DocumentCard> = {
  title: 'Documents/DocumentCard',
  component: DocumentCard,
  parameters: { layout: 'padded' },
  args: {
    onOpen: () => {},
    onToggleStar: () => {},
    onTrash: () => {},
    onRestore: () => {},
    onPermanentDelete: () => {},
  },
}
export default meta

type Story = StoryObj<typeof DocumentCard>

const baseDoc: MarkpadDocument = {
  id: '1',
  title: 'Getting Started with Markdown',
  content:
    '# Getting Started\n\nMarkdown is a lightweight markup language.\n\nYou can use it to **format** text easily.',
  starred: false,
  variables: {},
  createdAt: new Date(Date.now() - 86400000 * 3),
  updatedAt: new Date(Date.now() - 3600000),
  trashedAt: null,
}

export const GridView: Story = {
  args: {
    document: baseDoc,
    viewMode: 'grid',
  },
}

export const ListView: Story = {
  args: {
    document: baseDoc,
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

export const Starred: Story = {
  args: {
    document: { ...baseDoc, starred: true },
    viewMode: 'grid',
  },
}

export const Trashed: Story = {
  args: {
    document: { ...baseDoc, trashedAt: new Date() },
    viewMode: 'grid',
    isTrashed: true,
  },
}

export const TrashedList: Story = {
  args: {
    document: { ...baseDoc, trashedAt: new Date() },
    viewMode: 'list',
    isTrashed: true,
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
}

export const LongTitle: Story = {
  args: {
    document: {
      ...baseDoc,
      title: 'A Very Long Document Title That Will Truncate in the Card View',
    },
    viewMode: 'grid',
  },
}

export const GridGallery: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4 max-w-3xl">
      <DocumentCard
        document={baseDoc}
        viewMode="grid"
        onOpen={() => {}}
        onToggleStar={() => {}}
        onTrash={() => {}}
      />
      <DocumentCard
        document={{ ...baseDoc, id: '2', starred: true, title: 'Starred Document' }}
        viewMode="grid"
        onOpen={() => {}}
        onToggleStar={() => {}}
        onTrash={() => {}}
      />
      <DocumentCard
        document={{
          ...baseDoc,
          id: '3',
          title: 'Old Document',
          updatedAt: new Date(Date.now() - 86400000 * 30),
        }}
        viewMode="grid"
        onOpen={() => {}}
        onToggleStar={() => {}}
        onTrash={() => {}}
      />
    </div>
  ),
}

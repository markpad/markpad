import type { Meta, StoryObj } from '@storybook/react'
import { FaFileAlt } from 'react-icons/fa'
import Modal from './Modal'

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: true,
    onClose: () => {},
  },
}
export default meta

type Story = StoryObj<typeof Modal>

export const Default: Story = {
  args: {
    title: 'Modal Title',
    children: <p className="text-gray-700">This is the modal body content.</p>,
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Create Document',
    subtitle: 'Start with a blank page',
    icon: <FaFileAlt className="text-white" />,
    children: <p className="text-gray-700">Fill in the form below to create a new document.</p>,
  },
}

export const WithFooter: Story = {
  args: {
    title: 'Confirm Delete',
    children: <p className="text-gray-700">Are you sure you want to delete this document?</p>,
    footer: (
      <div className="flex justify-end gap-2">
        <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          Cancel
        </button>
        <button className="px-4 py-2 text-sm text-white bg-red-500 hover:bg-red-600 rounded-lg">
          Delete
        </button>
      </div>
    ),
  },
}

export const Small: Story = {
  args: {
    title: 'Small Modal',
    size: 'sm',
    children: <p className="text-gray-700">A compact modal for simple confirmations.</p>,
  },
}

export const Large: Story = {
  args: {
    title: 'Large Modal',
    size: 'lg',
    children: (
      <div className="space-y-3">
        <p className="text-gray-700">A large modal with more content space.</p>
        <p className="text-gray-500 text-sm">Use this for complex forms or previews.</p>
      </div>
    ),
  },
}

export const NoHeader: Story = {
  args: {
    children: (
      <div className="text-center space-y-4 py-4">
        <p className="text-gray-700 text-lg font-medium">No header modal</p>
        <p className="text-gray-500 text-sm">Content-only layout without title or close button.</p>
        <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
          Got it
        </button>
      </div>
    ),
  },
}

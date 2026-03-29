import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { Toast } from './Toast'

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj<typeof Toast>

export const Visible: Story = {
  args: {
    message: 'Document saved successfully',
    isVisible: true,
    onClose: () => {},
  },
}

export const Hidden: Story = {
  args: {
    message: 'Document saved successfully',
    isVisible: false,
    onClose: () => {},
  },
}

export const Interactive: Story = {
  render: () => {
    const [visible, setVisible] = useState(false)
    return (
      <div className="p-8">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setVisible(true)}
        >
          Show Toast
        </button>
        <Toast
          message="Copied to clipboard!"
          isVisible={visible}
          onClose={() => setVisible(false)}
          duration={2500}
        />
      </div>
    )
  },
}

export const LongMessage: Story = {
  args: {
    message: 'Theme applied successfully and document has been updated',
    isVisible: true,
    onClose: () => {},
  },
}

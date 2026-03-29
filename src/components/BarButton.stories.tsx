import type { Meta, StoryObj } from '@storybook/react'
import { FaBold, FaItalic, FaLink, FaImage, FaListUl } from 'react-icons/fa'
import BarButton from './BarButton'

const meta: Meta<typeof BarButton> = {
  title: 'Components/BarButton',
  component: BarButton,
  parameters: { layout: 'centered' },
  args: {
    onClick: () => {},
  },
}
export default meta

type Story = StoryObj<typeof BarButton>

export const Default: Story = {
  args: {
    label: <FaBold />,
  },
}

export const Active: Story = {
  args: {
    label: <FaBold />,
    active: true,
  },
}

export const Disabled: Story = {
  args: {
    label: <FaBold />,
    disabled: true,
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex items-center gap-1 p-2 bg-white rounded border border-gray-200">
      <BarButton label={<FaBold />} onClick={() => {}} />
      <BarButton label={<FaItalic />} onClick={() => {}} active />
      <BarButton label={<FaLink />} onClick={() => {}} />
      <BarButton label={<FaImage />} onClick={() => {}} disabled />
      <BarButton label={<FaListUl />} onClick={() => {}} />
    </div>
  ),
}

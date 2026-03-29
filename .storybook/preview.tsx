import type { Preview, Decorator } from '@storybook/react'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import '../src/index.css'

const withRouter: Decorator = (Story) => (
  <MemoryRouter>
    <Story />
  </MemoryRouter>
)

const withDarkMode: Decorator = (Story, context) => {
  const isDark = context.globals?.backgrounds?.value === '#333333'
  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])
  return <Story />
}

const preview: Preview = {
  decorators: [withRouter, withDarkMode],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
        { name: 'gray', value: '#f3f4f6' },
      ],
    },
  },
}

export default preview

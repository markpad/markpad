import React from 'react'
import { render } from '@testing-library/react'

// Mock heavy components that depend on ESM-only modules (react-markdown, react-syntax-highlighter)
jest.mock('./components/Editor', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Editor'),
}))

jest.mock('./components/HomePage', () => ({
  __esModule: true,
  HomePage: () => require('react').createElement('div', null, 'HomePage'),
}))

jest.mock('./components/themes/ThemesPage', () => ({
  __esModule: true,
  ThemesPage: () => require('react').createElement('div', null, 'ThemesPage'),
}))

jest.mock('./components/published', () => ({
  __esModule: true,
  PublishedPage: () => require('react').createElement('div', null, 'PublishedPage'),
}))

jest.mock('./components/theme-editor', () => ({
  __esModule: true,
  ThemeEditorPage: () => require('react').createElement('div', null, 'ThemeEditorPage'),
}))

jest.mock('./components/documents', () => ({
  __esModule: true,
  DocumentsPage: () => require('react').createElement('div', null, 'DocumentsPage'),
}))

jest.mock('./components/templates', () => ({
  __esModule: true,
  TemplatesPage: () => require('react').createElement('div', null, 'TemplatesPage'),
}))

// eslint-disable-next-line import/first
import App from '@/App'

test('renders without crashing', () => {
  const { container } = render(<App />)
  expect(container).toBeTruthy()
})

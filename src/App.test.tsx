import { render } from '@testing-library/react'

// Mock heavy components that depend on ESM-only modules (react-markdown, react-syntax-highlighter)
vi.mock('./components/Editor', () => ({
  __esModule: true,
  default: () => require('react').createElement('div', null, 'Editor'),
}))

vi.mock('./components/HomePage', () => ({
  __esModule: true,
  HomePage: () => require('react').createElement('div', null, 'HomePage'),
}))

vi.mock('./components/themes/ThemesPage', () => ({
  __esModule: true,
  ThemesPage: () => require('react').createElement('div', null, 'ThemesPage'),
}))

vi.mock('./components/published', () => ({
  __esModule: true,
  PublishedPage: () => require('react').createElement('div', null, 'PublishedPage'),
}))

vi.mock('./components/theme-editor', () => ({
  __esModule: true,
  ThemeEditorPage: () => require('react').createElement('div', null, 'ThemeEditorPage'),
}))

vi.mock('./components/documents', () => ({
  __esModule: true,
  DocumentsPage: () => require('react').createElement('div', null, 'DocumentsPage'),
}))

vi.mock('./components/templates', () => ({
  __esModule: true,
  TemplatesPage: () => require('react').createElement('div', null, 'TemplatesPage'),
}))

// eslint-disable-next-line import/first
import App from '@/App'

test('renders without crashing', () => {
  const { container } = render(<App />)
  expect(container).toBeTruthy()
})

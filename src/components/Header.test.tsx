/* eslint-disable testing-library/no-node-access, testing-library/no-wait-for-multiple-assertions */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './Header'
import type { AppState, TailwindClasses, FontConfig } from '../types'

// Mock ResizeObserver for react-tooltip
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock the dependencies
jest.mock('../services/urlStateService', () => ({
  generateShareUrl: jest.fn(() => 'https://example.com/share/abc123'),
}))

jest.mock('./ShareModal', () => ({
  ShareModal: ({ isOpen, shareUrl }: { isOpen: boolean; shareUrl: string }) =>
    isOpen ? <div data-testid="share-modal">{shareUrl}</div> : null,
}))

// Mock clipboard API
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
}
Object.assign(navigator, { clipboard: mockClipboard })

// Mock window.alert
const mockAlert = jest.fn()
window.alert = mockAlert

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = jest.fn(() => 'blob:test')
const mockRevokeObjectURL = jest.fn()
URL.createObjectURL = mockCreateObjectURL
URL.revokeObjectURL = mockRevokeObjectURL

describe('Header Component', () => {
  const mockTailwindClasses: TailwindClasses = {
    h1: 'text-4xl font-bold',
    h2: 'text-3xl font-semibold',
    h3: 'text-2xl font-medium',
    h4: 'text-xl',
    h5: 'text-lg',
    h6: 'text-base',
    p: 'text-base leading-relaxed',
    a: 'text-blue-600 hover:underline',
    img: 'max-w-full',
    table: 'w-full border-collapse',
    ul: 'list-disc pl-5',
    ol: 'list-decimal pl-5',
    li: 'mb-1',
    strong: 'font-bold',
    em: 'italic',
    tr: 'border-b',
    td: 'p-2',
    th: 'p-2 font-bold',
    blockquote: 'border-l-4 pl-4 italic',
    code: 'bg-gray-100 px-1 rounded',
    pre: 'bg-gray-100 p-4 rounded',
    body: 'bg-white text-gray-900',
    article: 'max-w-4xl mx-auto p-8',
  }

  const mockFontConfig: FontConfig = {
    fontFamily: 'Inter',
  }

  const mockState: AppState = {
    markdown: '# Hello World\n\nThis is a test document.',
    documentTitle: 'Test Document',
    tailwindClasses: mockTailwindClasses,
    fontConfig: mockFontConfig,
  }

  const defaultProps = {
    state: mockState,
    editionMode: 'split' as const,
    onEditionModeChange: jest.fn(),
    htmlContent: '<h1>Hello World</h1><p>This is a test document.</p>',
    onDocumentTitleChange: jest.fn(),
    showLineNumbers: true,
    onToggleLineNumbers: jest.fn(),
    syncScroll: false,
    onToggleSyncScroll: jest.fn(),
    darkMode: false,
    onToggleDarkMode: jest.fn(),
    tailwindClasses: mockTailwindClasses,
    fontFamily: 'Inter',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Menu Structure', () => {
    it('should render File, Edit, and View menus', () => {
      render(<Header {...defaultProps} />)

      // Get menu buttons specifically (first occurrence of each)
      const fileMenu = screen.getAllByText('File')[0]
      const editMenus = screen.getAllByText('Edit')
      const viewMenu = screen.getAllByText('View')[0]

      expect(fileMenu).toBeInTheDocument()
      expect(editMenus.length).toBeGreaterThan(0)
      expect(viewMenu).toBeInTheDocument()
    })

    it('should open File menu when clicked', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])

      expect(screen.getByText('New Document')).toBeInTheDocument()
      expect(screen.getByText('Duplicate')).toBeInTheDocument()
      expect(screen.getByText('Export')).toBeInTheDocument()
      expect(screen.getByText('Copy')).toBeInTheDocument()
      expect(screen.getByText('Generate Share Link...')).toBeInTheDocument()
    })

    it('should open Edit menu with Undo and Redo options', async () => {
      render(<Header {...defaultProps} />)

      // Click the Edit menu button (first one, the menu)
      const editMenuButtons = screen.getAllByText('Edit')
      await userEvent.click(editMenuButtons[0])

      expect(screen.getByText('Undo')).toBeInTheDocument()
      expect(screen.getByText('Redo')).toBeInTheDocument()
    })

    it('should open View menu with Layout submenu', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('View')[0])

      expect(screen.getByText('Layout')).toBeInTheDocument()
      expect(screen.getByText('Show Line Numbers')).toBeInTheDocument()
      expect(screen.getByText('Sync Scroll')).toBeInTheDocument()
      expect(screen.getByText('Dark Mode')).toBeInTheDocument()
    })
  })

  describe('Document Title', () => {
    it('should display the document title', () => {
      render(<Header {...defaultProps} />)

      expect(screen.getByText('Test Document')).toBeInTheDocument()
    })

    it('should allow editing the title when clicked', async () => {
      render(<Header {...defaultProps} />)

      const titleButton = screen.getByText('Test Document')
      await userEvent.click(titleButton)

      const input = screen.getByDisplayValue('Test Document')
      expect(input).toBeInTheDocument()
      expect(input).toHaveFocus()
    })

    it('should call onDocumentTitleChange when title is edited', async () => {
      render(<Header {...defaultProps} />)

      const titleButton = screen.getByText('Test Document')
      await userEvent.click(titleButton)

      const input = screen.getByDisplayValue('Test Document')
      // Since input is controlled, just verify typing triggers the handler
      await userEvent.type(input, 'X')

      expect(defaultProps.onDocumentTitleChange).toHaveBeenCalled()
      // The handler receives the original value + typed character
      expect(defaultProps.onDocumentTitleChange).toHaveBeenCalledWith('Test DocumentX')
    })
  })

  describe('View Mode Toggle', () => {
    it('should render Edit, Split, and Preview buttons', () => {
      render(<Header {...defaultProps} />)

      // These are in the view mode toggle at the right
      const editButtons = screen.getAllByText('Edit')
      const splitButtons = screen.getAllByText('Split')
      const previewButtons = screen.getAllByText('Preview')

      expect(editButtons.length).toBeGreaterThan(0)
      expect(splitButtons.length).toBeGreaterThan(0)
      expect(previewButtons.length).toBeGreaterThan(0)
    })

    it('should call onEditionModeChange when a view mode is selected', async () => {
      render(<Header {...defaultProps} />)

      // Get the toggle buttons (not the menu items)
      const editButtons = screen.getAllByText('Edit')
      // The last one should be the toggle button
      await userEvent.click(editButtons[editButtons.length - 1])

      expect(defaultProps.onEditionModeChange).toHaveBeenCalledWith('edit')
    })
  })

  describe('Export Submenu', () => {
    it('should show export options when hovering over Export', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])

      const exportItem = screen.getByText('Export')
      fireEvent.mouseEnter(exportItem.closest('div')!)

      await waitFor(() => {
        expect(screen.getByText('Markdown (Original)')).toBeInTheDocument()
        expect(screen.getByText('Markdown (Processed)')).toBeInTheDocument()
        expect(screen.getByText('HTML (Styled)')).toBeInTheDocument()
      })
    })
  })

  describe('Copy Submenu', () => {
    it('should show copy options when hovering over Copy', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])

      const copyItem = screen.getByText('Copy')
      fireEvent.mouseEnter(copyItem.closest('div')!)

      await waitFor(() => {
        // Look for the copy submenu items
        const markdownOriginalItems = screen.getAllByText('Markdown (Original)')
        expect(markdownOriginalItems.length).toBeGreaterThan(0)
      })
    })
  })

  describe('Share Link', () => {
    it('should open ShareModal when Generate Share Link is clicked', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])
      await userEvent.click(screen.getByText('Generate Share Link...'))

      expect(screen.getByTestId('share-modal')).toBeInTheDocument()
    })
  })

  describe('Toggle Options', () => {
    it('should call onToggleLineNumbers when clicking Show Line Numbers', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('View')[0])
      await userEvent.click(screen.getByText('Show Line Numbers'))

      expect(defaultProps.onToggleLineNumbers).toHaveBeenCalled()
    })

    it('should call onToggleSyncScroll when clicking Sync Scroll', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('View')[0])
      await userEvent.click(screen.getByText('Sync Scroll'))

      expect(defaultProps.onToggleSyncScroll).toHaveBeenCalled()
    })

    it('should call onToggleDarkMode when clicking Dark Mode', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('View')[0])
      await userEvent.click(screen.getByText('Dark Mode'))

      expect(defaultProps.onToggleDarkMode).toHaveBeenCalled()
    })
  })

  describe('Formatting Toolbar', () => {
    it('should render heading buttons', () => {
      render(<Header {...defaultProps} />)

      expect(screen.getByText('H1')).toBeInTheDocument()
      expect(screen.getByText('H2')).toBeInTheDocument()
      expect(screen.getByText('H3')).toBeInTheDocument()
    })

    it('should call onInsertHeading when heading button is clicked', async () => {
      const onInsertHeading = jest.fn()
      render(<Header {...defaultProps} onInsertHeading={onInsertHeading} />)

      await userEvent.click(screen.getByText('H1'))

      expect(onInsertHeading).toHaveBeenCalledWith(1)
    })

    it('should call onInsertBold when bold button is clicked', async () => {
      const onInsertBold = jest.fn()
      render(<Header {...defaultProps} onInsertBold={onInsertBold} />)

      // Find bold button by its data-tooltip-id attribute
      const boldButton = document.querySelector('[data-tooltip-id="bold-tooltip"]')
      expect(boldButton).toBeInTheDocument()
      await userEvent.click(boldButton!)

      expect(onInsertBold).toHaveBeenCalled()
    })
  })

  describe('Keyboard Shortcuts Display', () => {
    it('should display keyboard shortcut for New Document', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])

      expect(screen.getByText('⌘N')).toBeInTheDocument()
    })

    it('should display keyboard shortcut for Duplicate', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('File')[0])

      expect(screen.getByText('⌘D')).toBeInTheDocument()
    })

    it('should display keyboard shortcuts for Undo and Redo', async () => {
      render(<Header {...defaultProps} />)

      await userEvent.click(screen.getAllByText('Edit')[0])

      expect(screen.getByText('⌘Z')).toBeInTheDocument()
      expect(screen.getByText('⌘⇧Z')).toBeInTheDocument()
    })
  })
})

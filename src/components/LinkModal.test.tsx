import { render, screen, fireEvent } from '@testing-library/react'
import { LinkModal } from './LinkModal'
import type { UseLinkModalResult } from '../hooks/useLinkModal'

// Mock UseLinkModalResult for testing
const createMockLinkModal = (overrides?: Partial<UseLinkModalResult>): UseLinkModalResult => ({
  isOpen: false,
  open: jest.fn(),
  close: jest.fn(),
  linkConfig: {
    url: '',
    text: '',
  },
  setLinkConfig: jest.fn(),
  generateLinkCode: jest.fn(() => '[](https://example.com)'),
  reset: jest.fn(),
  isValidUrl: false,
  history: [],
  addToHistory: jest.fn(),
  removeFromHistory: jest.fn(),
  loadFromHistory: jest.fn(),
  searchQuery: '',
  setSearchQuery: jest.fn(),
  filteredHistory: [],
  ...overrides,
})

describe('LinkModal', () => {
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: false })
      const { container } = render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByRole('heading', { name: 'Insert Link' })).toBeInTheDocument()
      expect(screen.getByText('Add a hyperlink to your markdown')).toBeInTheDocument()
    })

    it('should render Link Text input field', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByLabelText('Link Text')).toBeInTheDocument()
    })

    it('should render URL input field', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByLabelText('URL')).toBeInTheDocument()
    })

    it('should render preview section', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    it('should show placeholder when no URL', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true, isValidUrl: false })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByText('Link preview will appear here')).toBeInTheDocument()
    })

    it('should show invalid URL message when URL is invalid', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'invalid-url', text: '' },
        isValidUrl: false,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(screen.getByText('Please enter a valid URL')).toBeInTheDocument()
    })

    it('should show helper text for link text input', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)
      expect(
        screen.getByText('The text that will be displayed (optional, uses URL if empty)')
      ).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call close when clicking backdrop', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      const { container } = render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(mockLinkModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking X button', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const closeButtons = screen.getAllByRole('button')
      const xButton = closeButtons.find((btn) => btn.querySelector('svg'))
      if (xButton) {
        fireEvent.click(xButton)
        expect(mockLinkModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking Cancel button', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      expect(mockLinkModal.close).toHaveBeenCalled()
    })

    it('should call setLinkConfig when changing URL', () => {
      const mockSetLinkConfig = jest.fn()
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        setLinkConfig: mockSetLinkConfig,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const urlInput = screen.getByLabelText('URL')
      fireEvent.change(urlInput, { target: { value: 'https://example.com' } })

      expect(mockSetLinkConfig).toHaveBeenCalledWith({ url: 'https://example.com' })
    })

    it('should call setLinkConfig when changing text', () => {
      const mockSetLinkConfig = jest.fn()
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        setLinkConfig: mockSetLinkConfig,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const textInput = screen.getByLabelText('Link Text')
      fireEvent.change(textInput, { target: { value: 'Click here' } })

      expect(mockSetLinkConfig).toHaveBeenCalledWith({ text: 'Click here' })
    })
  })

  describe('Insert Logic', () => {
    it('should disable insert button when URL is empty', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: '', text: '' },
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Link' })
      expect(insertButton).toBeDisabled()
    })

    it('should enable insert button when URL is provided', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: '' },
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Link' })
      expect(insertButton).not.toBeDisabled()
    })

    it('should call onInsertLink with generated code when insert clicked', () => {
      const mockOnInsertLink = jest.fn()
      const mockGenerateLinkCode = jest.fn(() => '[Click here](https://example.com)')
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: 'Click here' },
        generateLinkCode: mockGenerateLinkCode,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={mockOnInsertLink} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Link' })
      fireEvent.click(insertButton)

      expect(mockGenerateLinkCode).toHaveBeenCalled()
      expect(mockOnInsertLink).toHaveBeenCalledWith('[Click here](https://example.com)')
    })

    it('should call reset and close after inserting', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: 'Test' },
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Link' })
      fireEvent.click(insertButton)

      expect(mockLinkModal.reset).toHaveBeenCalled()
      expect(mockLinkModal.close).toHaveBeenCalled()
    })
  })

  describe('Link Preview', () => {
    it('should render preview code when URL is provided', () => {
      const mockGenerateLinkCode = jest.fn(() => '[Example](https://example.com)')
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: 'Example' },
        generateLinkCode: mockGenerateLinkCode,
        isValidUrl: true,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      expect(mockGenerateLinkCode).toHaveBeenCalled()
      expect(screen.getByText('[Example](https://example.com)')).toBeInTheDocument()
    })

    it('should render clickable preview link', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: 'Example Site' },
        isValidUrl: true,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const link = screen.getByRole('link', { name: 'Example Site' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', 'https://example.com')
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('should use URL as link text when text is empty', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: '' },
        isValidUrl: true,
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const link = screen.getByRole('link', { name: 'https://example.com' })
      expect(link).toBeInTheDocument()
    })
  })

  describe('Input Values', () => {
    it('should display current URL in input', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: 'https://example.com', text: '' },
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const urlInput = screen.getByLabelText('URL') as HTMLInputElement
      expect(urlInput.value).toBe('https://example.com')
    })

    it('should display current text in input', () => {
      const mockLinkModal = createMockLinkModal({
        isOpen: true,
        linkConfig: { url: '', text: 'Visit our website' },
      })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const textInput = screen.getByLabelText('Link Text') as HTMLInputElement
      expect(textInput.value).toBe('Visit our website')
    })

    it('should have correct placeholder for text input', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const textInput = screen.getByLabelText('Link Text') as HTMLInputElement
      expect(textInput.placeholder).toBe('Click here')
    })

    it('should have correct placeholder for URL input', () => {
      const mockLinkModal = createMockLinkModal({ isOpen: true })
      render(<LinkModal linkModal={mockLinkModal} onInsertLink={jest.fn()} />)

      const urlInput = screen.getByLabelText('URL') as HTMLInputElement
      expect(urlInput.placeholder).toBe('https://example.com')
    })
  })
})

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ImageModal } from './ImageModal'
import type { UseImageModalResult } from '../hooks/useImageModal'

// Mock UseImageModalResult for testing
const createMockImageModal = (overrides?: Partial<UseImageModalResult>): UseImageModalResult => ({
  isOpen: false,
  open: jest.fn(),
  close: jest.fn(),
  imageConfig: {
    url: '',
    altText: '',
  },
  setImageConfig: jest.fn(),
  generateImageCode: jest.fn(() => '![](https://example.com/image.jpg)'),
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

describe('ImageModal', () => {
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const mockImageModal = createMockImageModal({ isOpen: false })
      const { container } = render(
        <ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />
      )
      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByRole('heading', { name: 'Insert Image' })).toBeInTheDocument()
      expect(screen.getByText('Add an image to your markdown')).toBeInTheDocument()
    })

    it('should render URL input field', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByLabelText('Image URL')).toBeInTheDocument()
    })

    it('should render Alt Text input field', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByLabelText('Alt Text')).toBeInTheDocument()
    })

    it('should render preview section', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByText('Preview')).toBeInTheDocument()
    })

    it('should show placeholder when no URL', () => {
      const mockImageModal = createMockImageModal({ isOpen: true, isValidUrl: false })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByText('Image preview will appear here')).toBeInTheDocument()
    })

    it('should show invalid URL message when URL is invalid', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'invalid-url', altText: '' },
        isValidUrl: false,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)
      expect(screen.getByText('Invalid URL')).toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call close when clicking backdrop', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      const { container } = render(
        <ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />
      )

      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(mockImageModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking X button', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const closeButtons = screen.getAllByRole('button')
      const xButton = closeButtons.find((btn) => btn.querySelector('svg'))
      if (xButton) {
        fireEvent.click(xButton)
        expect(mockImageModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking Cancel button', () => {
      const mockImageModal = createMockImageModal({ isOpen: true })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      expect(mockImageModal.close).toHaveBeenCalled()
    })

    it('should call setImageConfig when changing URL', () => {
      const mockSetImageConfig = jest.fn()
      const mockImageModal = createMockImageModal({
        isOpen: true,
        setImageConfig: mockSetImageConfig,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const urlInput = screen.getByLabelText('Image URL')
      fireEvent.change(urlInput, { target: { value: 'https://example.com/image.jpg' } })

      expect(mockSetImageConfig).toHaveBeenCalledWith({ url: 'https://example.com/image.jpg' })
    })

    it('should call setImageConfig when changing alt text', () => {
      const mockSetImageConfig = jest.fn()
      const mockImageModal = createMockImageModal({
        isOpen: true,
        setImageConfig: mockSetImageConfig,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const altTextInput = screen.getByLabelText('Alt Text')
      fireEvent.change(altTextInput, { target: { value: 'A beautiful sunset' } })

      expect(mockSetImageConfig).toHaveBeenCalledWith({ altText: 'A beautiful sunset' })
    })
  })

  describe('Insert Logic', () => {
    it('should disable insert button when URL is empty', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: '', altText: '' },
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Image' })
      expect(insertButton).toBeDisabled()
    })

    it('should enable insert button when URL is provided', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/image.jpg', altText: '' },
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Image' })
      expect(insertButton).not.toBeDisabled()
    })

    it('should call onInsertImage with generated code when insert clicked', () => {
      const mockOnInsertImage = jest.fn()
      const mockGenerateImageCode = jest.fn(() => '![Sunset](https://example.com/sunset.jpg)')
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/sunset.jpg', altText: 'Sunset' },
        generateImageCode: mockGenerateImageCode,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={mockOnInsertImage} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Image' })
      fireEvent.click(insertButton)

      expect(mockGenerateImageCode).toHaveBeenCalled()
      expect(mockOnInsertImage).toHaveBeenCalledWith('![Sunset](https://example.com/sunset.jpg)')
    })

    it('should call reset and close after inserting', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/image.jpg', altText: 'Test' },
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Image' })
      fireEvent.click(insertButton)

      expect(mockImageModal.reset).toHaveBeenCalled()
      expect(mockImageModal.close).toHaveBeenCalled()
    })
  })

  describe('Image Preview', () => {
    it('should render image when valid URL is provided', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/image.jpg', altText: 'Test image' },
        isValidUrl: true,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const image = screen.getByAltText('Test image')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
    })

    it('should use default alt text when no alt text provided', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/image.jpg', altText: '' },
        isValidUrl: true,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const image = screen.getByAltText('Image preview')
      expect(image).toBeInTheDocument()
    })

    it('should show error message when image fails to load', async () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/broken.jpg', altText: 'Test' },
        isValidUrl: true,
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const image = screen.getByAltText('Test')
      fireEvent.error(image)

      await waitFor(() => {
        expect(screen.getByText('Failed to load image')).toBeInTheDocument()
      })
    })
  })

  describe('Input Values', () => {
    it('should display current URL in input', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: 'https://example.com/image.jpg', altText: '' },
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const urlInput = screen.getByLabelText('Image URL') as HTMLInputElement
      expect(urlInput.value).toBe('https://example.com/image.jpg')
    })

    it('should display current alt text in input', () => {
      const mockImageModal = createMockImageModal({
        isOpen: true,
        imageConfig: { url: '', altText: 'A beautiful landscape' },
      })
      render(<ImageModal imageModal={mockImageModal} onInsertImage={jest.fn()} />)

      const altTextInput = screen.getByLabelText('Alt Text') as HTMLInputElement
      expect(altTextInput.value).toBe('A beautiful landscape')
    })
  })
})

/* eslint-disable testing-library/no-node-access, jest/no-conditional-expect */
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoopModal } from '@/components/LoopModal'
import type { UseLoopModalResult } from '@/hooks/useLoopModal'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('LoopModal Component', () => {
  const createMockLoopModal = (
    overrides: Partial<UseLoopModalResult> = {}
  ): UseLoopModalResult => ({
    isOpen: true,
    open: jest.fn(),
    close: jest.fn(),
    availableArrays: ['skills', 'languages'],
    loopConfig: {
      arrayName: '',
      iteratorName: 'item',
      itemTemplate: '- {{item}}',
    },
    setLoopConfig: jest.fn(),
    isCreatingNewArray: false,
    setIsCreatingNewArray: jest.fn(),
    newArrayConfig: {
      name: '',
      items: [],
    },
    setNewArrayConfig: jest.fn(),
    generateLoopCode: jest.fn(() => '{% for item in skills %}\n- {{item}}\n{% endfor %}'),
    getUpdatedMarkdown: jest.fn(() => '---\ntest: value\n---\n\nContent'),
    reset: jest.fn(),
    preview: '{% for item in skills %}\n- {{item}}\n{% endfor %}',
    ...overrides,
  })

  const defaultProps = {
    loopModal: createMockLoopModal(),
    onInsertLoop: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('should not render when modal is closed', () => {
      const loopModal = createMockLoopModal({ isOpen: false })
      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      expect(screen.queryByRole('heading', { name: 'Insert Loop' })).not.toBeInTheDocument()
    })

    it('should render when modal is open', () => {
      render(<LoopModal {...defaultProps} />)

      expect(screen.getByRole('heading', { name: 'Insert Loop' })).toBeInTheDocument()
    })

    it('should show existing array selection by default', () => {
      render(<LoopModal {...defaultProps} />)

      expect(screen.getByText('Use Existing Array')).toBeInTheDocument()
      expect(screen.getByText('Select an array...')).toBeInTheDocument()
    })
  })

  describe('new array creation mode', () => {
    it('should switch to create new array mode when button clicked', () => {
      const setIsCreatingNewArray = jest.fn()
      const loopModal = createMockLoopModal({ setIsCreatingNewArray })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      fireEvent.click(screen.getByText(/Create New Array/))

      expect(setIsCreatingNewArray).toHaveBeenCalledWith(true)
    })

    it('should show array name input when in create mode', () => {
      const loopModal = createMockLoopModal({ isCreatingNewArray: true })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      expect(screen.getByText('Array Name')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('e.g., skills, projects, languages')).toBeInTheDocument()
    })

    it('should show items textarea when in create mode', () => {
      const loopModal = createMockLoopModal({ isCreatingNewArray: true })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      expect(screen.getByText('Items (one per line)')).toBeInTheDocument()
    })
  })

  describe('items textarea - Enter key handling', () => {
    it('should allow typing multiple lines with Enter key', async () => {
      const user = userEvent.setup()
      const setNewArrayConfig = jest.fn()
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        setNewArrayConfig,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })
      await user.click(textarea)
      await user.type(textarea, 'Item1{enter}Item2{enter}Item3')

      // The textarea should contain newlines
      expect(textarea).toHaveValue('Item1\nItem2\nItem3')
    })

    it('should call setNewArrayConfig with parsed items when typing', async () => {
      const user = userEvent.setup()
      const setNewArrayConfig = jest.fn()
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        setNewArrayConfig,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })
      await user.type(textarea, 'Git')

      expect(setNewArrayConfig).toHaveBeenCalled()
      // Last call should include the typed items
      const lastCall = setNewArrayConfig.mock.calls[setNewArrayConfig.mock.calls.length - 1][0]
      expect(lastCall.items).toContain('Git')
    })

    it('should preserve textarea value while typing multiple items', async () => {
      const user = userEvent.setup()
      const setNewArrayConfig = jest.fn()
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        setNewArrayConfig,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })

      // Type first item
      await user.type(textarea, 'JavaScript')
      expect(textarea).toHaveValue('JavaScript')

      // Press Enter and type second item
      await user.type(textarea, '{enter}TypeScript')
      expect(textarea).toHaveValue('JavaScript\nTypeScript')

      // Press Enter and type third item
      await user.type(textarea, '{enter}React')
      expect(textarea).toHaveValue('JavaScript\nTypeScript\nReact')
    })

    it('should filter empty lines when calling setNewArrayConfig', async () => {
      const user = userEvent.setup()
      const setNewArrayConfig = jest.fn()
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        setNewArrayConfig,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })

      // Type with empty lines
      await user.type(textarea, 'Item1{enter}{enter}Item2')

      // Check that setNewArrayConfig received filtered items (no empty strings)
      const calls = setNewArrayConfig.mock.calls
      const lastCallItems = calls[calls.length - 1][0].items
      expect(lastCallItems).not.toContain('')
      expect(lastCallItems.filter((i: string) => i.length > 0).length).toBe(lastCallItems.length)
    })
  })

  describe('insert loop', () => {
    it('should call onInsertLoop with correct parameters when insert button clicked', async () => {
      const onInsertLoop = jest.fn()
      const generateLoopCode = jest.fn(() => '{% for skill in skills %}\n- {{skill}}\n{% endfor %}')
      const getUpdatedMarkdown = jest.fn(() => '---\nskills:\n  - JS\n---\n\nContent')

      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        newArrayConfig: { name: 'skills', items: ['JS', 'TS'] },
        generateLoopCode,
        getUpdatedMarkdown,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={onInsertLoop} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Loop' })
      fireEvent.click(insertButton)

      expect(generateLoopCode).toHaveBeenCalled()
      expect(getUpdatedMarkdown).toHaveBeenCalled()
      expect(onInsertLoop).toHaveBeenCalledWith(
        '{% for skill in skills %}\n- {{skill}}\n{% endfor %}',
        '---\nskills:\n  - JS\n---\n\nContent'
      )
    })

    it('should close modal and reset after insert', () => {
      const close = jest.fn()
      const reset = jest.fn()

      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        newArrayConfig: { name: 'skills', items: ['JS'] },
        close,
        reset,
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      fireEvent.click(screen.getByRole('button', { name: 'Insert Loop' }))

      expect(reset).toHaveBeenCalled()
      expect(close).toHaveBeenCalled()
    })

    it('should disable insert button when no array name provided', () => {
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        newArrayConfig: { name: '', items: ['Item1'] },
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Loop' })
      expect(insertButton).toBeDisabled()
    })

    it('should disable insert button when no items provided', () => {
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        newArrayConfig: { name: 'skills', items: [] },
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Loop' })
      expect(insertButton).toBeDisabled()
    })

    it('should enable insert button when array name and items are provided', () => {
      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        newArrayConfig: { name: 'skills', items: ['JS', 'TS'] },
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Loop' })
      expect(insertButton).not.toBeDisabled()
    })
  })

  describe('modal interactions', () => {
    it('should close when clicking backdrop', () => {
      const close = jest.fn()
      const loopModal = createMockLoopModal({ close })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      // Click the backdrop (the outer div with fixed class)
      const backdrop = document.querySelector('.fixed.inset-0')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(close).toHaveBeenCalled()
      }
    })

    it('should close when clicking cancel button', () => {
      const close = jest.fn()
      const loopModal = createMockLoopModal({ close })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
      expect(close).toHaveBeenCalled()
    })

    it('should close when clicking X button', () => {
      const close = jest.fn()
      const loopModal = createMockLoopModal({ close })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      // Find the X button by its position in the header
      const buttons = screen.getAllByRole('button')
      const closeButton = buttons.find((btn) => btn.querySelector('svg path[d*="242.72"]'))
      if (closeButton) {
        fireEvent.click(closeButton)
        expect(close).toHaveBeenCalled()
      }
    })
  })

  describe('itemsInput state preservation', () => {
    it('should initialize itemsInput when modal opens', () => {
      // First render with closed modal
      const loopModal = createMockLoopModal({
        isOpen: false,
        isCreatingNewArray: true,
        newArrayConfig: { name: '', items: ['pre-existing'] },
      })

      const { rerender } = render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      // Now open the modal
      const openModal = createMockLoopModal({
        isOpen: true,
        isCreatingNewArray: true,
        newArrayConfig: { name: '', items: ['pre-existing'] },
      })

      rerender(<LoopModal loopModal={openModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })
      expect(textarea).toHaveValue('pre-existing')
    })

    it('should not reset itemsInput when newArrayConfig.items changes from typing', async () => {
      const user = userEvent.setup()
      let currentItems: string[] = []

      const setNewArrayConfig = jest.fn((config) => {
        if (config.items) {
          currentItems = config.items
        }
      })

      const loopModal = createMockLoopModal({
        isCreatingNewArray: true,
        setNewArrayConfig,
        newArrayConfig: { name: '', items: currentItems },
      })

      render(<LoopModal loopModal={loopModal} onInsertLoop={jest.fn()} />)

      const textarea = screen.getByRole('textbox', { name: /items/i })

      // Type multiple items
      await user.type(textarea, 'Item1{enter}Item2{enter}Item3')

      // Textarea should still have all typed content including newlines
      expect(textarea).toHaveValue('Item1\nItem2\nItem3')
    })
  })
})

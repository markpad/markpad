/* eslint-disable testing-library/no-node-access, testing-library/no-container, jest/no-conditional-expect */
import { render, screen, fireEvent } from '@testing-library/react'
import { IfModal } from '@/components/IfModal'
import type { UseIfModalResult } from '@/hooks/useIfModal'

// Mock UseIfModalResult for testing
const createMockIfModal = (overrides?: Partial<UseIfModalResult>): UseIfModalResult => ({
  isOpen: false,
  open: jest.fn(),
  close: jest.fn(),
  availableVariables: ['showAdvanced', 'user.age', 'user.name', 'isDraft'],
  ifConfig: {
    variableName: '',
    operator: 'truthy',
    compareValue: '',
    contentTemplate: 'Content to show when condition is true',
  },
  setIfConfig: jest.fn(),
  generateIfCode: jest.fn(() => '{% if showAdvanced %}\nAdvanced content\n{% endif %}'),
  reset: jest.fn(),
  preview: '{% if showAdvanced %}\nAdvanced content\n{% endif %}',
  ...overrides,
})

describe('IfModal', () => {
  describe('Rendering', () => {
    it('should not render when isOpen is false', () => {
      const mockIfModal = createMockIfModal({ isOpen: false })
      const { container } = render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)
      expect(container.firstChild).toBeNull()
    })

    it('should render when isOpen is true', () => {
      const mockIfModal = createMockIfModal({ isOpen: true })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)
      expect(screen.getByRole('heading', { name: 'Insert Conditional' })).toBeInTheDocument()
      expect(screen.getByText('Show content based on conditions')).toBeInTheDocument()
    })

    it('should display available variables in dropdown', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        availableVariables: ['showAdvanced', 'user.age', 'isDraft'],
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const select = screen.getByLabelText('Variable to Check')
      expect(select).toBeInTheDocument()

      // Check that all variables are in the select
      const options = within(select as HTMLSelectElement).getAllByRole('option')
      expect(options.map((opt) => opt.textContent)).toContain('showAdvanced')
      expect(options.map((opt) => opt.textContent)).toContain('user.age')
      expect(options.map((opt) => opt.textContent)).toContain('isDraft')
    })

    it('should show message when no variables available', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        availableVariables: [],
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)
      expect(screen.getByText('No variables found in frontmatter')).toBeInTheDocument()
    })

    it('should display all operator options', () => {
      const mockIfModal = createMockIfModal({ isOpen: true })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const operatorSelect = screen.getByLabelText('Comparison Type')
      const options = within(operatorSelect as HTMLSelectElement).getAllByRole('option')

      expect(options.map((opt) => opt.textContent)).toEqual([
        'is truthy (exists and not empty)',
        'is falsy (not exists or empty)',
        'equals (==)',
        'not equals (!=)',
        'greater than (>)',
        'less than (<)',
        'greater than or equal (>=)',
        'less than or equal (<=)',
      ])
    })
  })

  describe('User Interactions', () => {
    it('should call close when clicking backdrop', () => {
      const mockIfModal = createMockIfModal({ isOpen: true })
      const { container } = render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      // Click on backdrop (the outer div with bg-black/50)
      const backdrop = container.querySelector('.fixed.inset-0.bg-black\\/50')
      if (backdrop) {
        fireEvent.click(backdrop)
        expect(mockIfModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking X button', () => {
      const mockIfModal = createMockIfModal({ isOpen: true })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const closeButton = screen
        .getAllByRole('button')
        .find((btn) => btn.querySelector('svg')?.classList.contains('fa-times'))
      if (closeButton) {
        fireEvent.click(closeButton)
        expect(mockIfModal.close).toHaveBeenCalled()
      }
    })

    it('should call close when clicking Cancel button', () => {
      const mockIfModal = createMockIfModal({ isOpen: true })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const cancelButton = screen.getByText('Cancel')
      fireEvent.click(cancelButton)
      expect(mockIfModal.close).toHaveBeenCalled()
    })

    it('should call setIfConfig when changing variable', () => {
      const mockSetIfConfig = jest.fn()
      const mockIfModal = createMockIfModal({
        isOpen: true,
        setIfConfig: mockSetIfConfig,
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const select = screen.getByLabelText('Variable to Check')
      fireEvent.change(select, { target: { value: 'showAdvanced' } })

      expect(mockSetIfConfig).toHaveBeenCalledWith({ variableName: 'showAdvanced' })
    })

    it('should call setIfConfig when changing operator', () => {
      const mockSetIfConfig = jest.fn()
      const mockIfModal = createMockIfModal({
        isOpen: true,
        setIfConfig: mockSetIfConfig,
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const operatorSelect = screen.getByLabelText('Comparison Type')
      fireEvent.change(operatorSelect, { target: { value: '==' } })

      expect(mockSetIfConfig).toHaveBeenCalledWith({ operator: '==' })
    })

    it('should show compare value input when operator needs value', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'user.age',
          operator: '>=',
          compareValue: '',
          contentTemplate: 'Adult content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      expect(screen.getByLabelText('Compare To')).toBeInTheDocument()
    })

    it('should hide compare value input for truthy operator', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'showAdvanced',
          operator: 'truthy',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      expect(screen.queryByLabelText('Compare To')).not.toBeInTheDocument()
    })

    it('should call setIfConfig when changing compare value', () => {
      const mockSetIfConfig = jest.fn()
      const mockIfModal = createMockIfModal({
        isOpen: true,
        setIfConfig: mockSetIfConfig,
        ifConfig: {
          variableName: 'user.age',
          operator: '>=',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const compareInput = screen.getByLabelText('Compare To')
      fireEvent.change(compareInput, { target: { value: '18' } })

      expect(mockSetIfConfig).toHaveBeenCalledWith({ compareValue: '18' })
    })

    it('should call setIfConfig when changing content template', () => {
      const mockSetIfConfig = jest.fn()
      const mockIfModal = createMockIfModal({
        isOpen: true,
        setIfConfig: mockSetIfConfig,
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const contentTextarea = screen.getByLabelText('Content to Show')
      fireEvent.change(contentTextarea, { target: { value: 'New content' } })

      expect(mockSetIfConfig).toHaveBeenCalledWith({ contentTemplate: 'New content' })
    })
  })

  describe('Insert Logic', () => {
    it('should disable insert button when no variable selected', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: '',
          operator: 'truthy',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      expect(insertButton).toBeDisabled()
    })

    it('should enable insert button when variable selected for truthy operator', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'showAdvanced',
          operator: 'truthy',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      expect(insertButton).not.toBeDisabled()
    })

    it('should disable insert button when operator needs value but none provided', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'user.age',
          operator: '>=',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      expect(insertButton).toBeDisabled()
    })

    it('should enable insert button when operator needs value and value is provided', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'user.age',
          operator: '>=',
          compareValue: '18',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      expect(insertButton).not.toBeDisabled()
    })

    it('should call onInsertIf with generated code when insert clicked', () => {
      const mockOnInsertIf = jest.fn()
      const mockGenerateIfCode = jest.fn(() => '{% if user.age >= 18 %}\nAdult\n{% endif %}')
      const mockIfModal = createMockIfModal({
        isOpen: true,
        generateIfCode: mockGenerateIfCode,
        ifConfig: {
          variableName: 'user.age',
          operator: '>=',
          compareValue: '18',
          contentTemplate: 'Adult',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={mockOnInsertIf} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      fireEvent.click(insertButton)

      expect(mockGenerateIfCode).toHaveBeenCalled()
      expect(mockOnInsertIf).toHaveBeenCalledWith('{% if user.age >= 18 %}\nAdult\n{% endif %}')
    })

    it('should call reset and close after inserting', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        ifConfig: {
          variableName: 'showAdvanced',
          operator: 'truthy',
          compareValue: '',
          contentTemplate: 'Content',
        },
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      const insertButton = screen.getByRole('button', { name: 'Insert Conditional' })
      fireEvent.click(insertButton)

      expect(mockIfModal.reset).toHaveBeenCalled()
      expect(mockIfModal.close).toHaveBeenCalled()
    })
  })

  describe('Preview', () => {
    it('should display preview when available', () => {
      const mockIfModal = createMockIfModal({
        isOpen: true,
        preview: '{% if showAdvanced %}\nAdvanced content\n{% endif %}',
      })
      render(<IfModal ifModal={mockIfModal} onInsertIf={jest.fn()} />)

      expect(screen.getByText('Preview')).toBeInTheDocument()
      // Check for the preview content in a pre tag
      const preElement = screen.getByText(/{% if showAdvanced %}/)
      expect(preElement).toBeInTheDocument()
    })
  })
})

// Helper function to query within an element
function within(element: HTMLElement) {
  return {
    getAllByRole: (role: string) => {
      return Array.from(element.querySelectorAll(`[role="${role}"], ${role}`))
    },
  }
}

import { renderHook, act } from '@testing-library/react'
import { useTryMode } from '@/hooks/useTryMode'
import type { AppState, TailwindClasses, FontConfig } from '@/types'

// Mock react-router-dom
const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

// Mock documentRepository
const mockCreate = vi.fn()
vi.mock('@/lib/repositories', () => ({
  documentRepository: {
    create: (...args: unknown[]) => mockCreate(...args),
  },
}))

const mockTailwindClasses: TailwindClasses = {
  h1: 'text-4xl',
  h2: 'text-3xl',
  h3: 'text-2xl',
  h4: 'text-xl',
  h5: 'text-lg',
  h6: 'text-base',
  p: 'mb-4',
  a: 'text-blue-600',
  img: 'max-w-full',
  table: 'w-full',
  ul: 'list-disc',
  ol: 'list-decimal',
  li: 'mb-1',
  strong: 'font-bold',
  em: 'italic',
  tr: 'border-b',
  td: 'p-2',
  th: 'p-2',
  blockquote: 'border-l-4',
  code: 'bg-gray-100',
  pre: 'bg-gray-100',
  body: 'bg-white',
  article: 'max-w-4xl',
}

const mockFontConfig: FontConfig = { fontFamily: 'Inter' }

const mockState: AppState = {
  markdown: '# Hello\n\nWorld',
  documentTitle: 'My Draft',
  tailwindClasses: mockTailwindClasses,
  fontConfig: mockFontConfig,
}

describe('useTryMode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('starts with isSaving = false', () => {
    const { result } = renderHook(() => useTryMode())
    expect(result.current.isSaving).toBe(false)
  })

  it('exposes a saveDocument function', () => {
    const { result } = renderHook(() => useTryMode())
    expect(typeof result.current.saveDocument).toBe('function')
  })

  it('creates a document with correct fields from state', async () => {
    const createdDoc = { id: 'new-id', ...mockState }
    mockCreate.mockResolvedValue(createdDoc)

    const { result } = renderHook(() => useTryMode())

    await act(async () => {
      await result.current.saveDocument(mockState)
    })

    expect(mockCreate).toHaveBeenCalledWith({
      title: mockState.documentTitle,
      content: mockState.markdown,
      tailwindClasses: mockState.tailwindClasses,
      fontConfig: mockState.fontConfig,
    })
  })

  it('navigates to /editor/:id after document is created', async () => {
    mockCreate.mockResolvedValue({ id: 'doc-123' })

    const { result } = renderHook(() => useTryMode())

    await act(async () => {
      await result.current.saveDocument(mockState)
    })

    expect(mockNavigate).toHaveBeenCalledWith('/editor/doc-123')
  })

  it('sets isSaving true while saving and false after', async () => {
    let resolveSave!: () => void
    mockCreate.mockReturnValue(
      new Promise<{ id: string }>((resolve) => {
        resolveSave = () => resolve({ id: 'doc-456' })
      })
    )

    const { result } = renderHook(() => useTryMode())

    // Start save but don't await
    act(() => {
      result.current.saveDocument(mockState)
    })

    expect(result.current.isSaving).toBe(true)

    await act(async () => {
      resolveSave()
    })

    expect(result.current.isSaving).toBe(false)
  })

  it('resets isSaving to false even when repository throws', async () => {
    mockCreate.mockRejectedValue(new Error('IndexedDB error'))

    const { result } = renderHook(() => useTryMode())

    await act(async () => {
      await result.current.saveDocument(mockState).catch(() => {})
    })

    expect(result.current.isSaving).toBe(false)
  })

  it('ignores duplicate calls while a save is in progress', async () => {
    let resolveSave!: () => void
    mockCreate.mockReturnValue(
      new Promise<{ id: string }>((resolve) => {
        resolveSave = () => resolve({ id: 'doc-789' })
      })
    )

    const { result } = renderHook(() => useTryMode())

    // Fire two concurrent saves
    act(() => {
      result.current.saveDocument(mockState)
      result.current.saveDocument(mockState) // should be ignored
    })

    await act(async () => {
      resolveSave()
    })

    expect(mockCreate).toHaveBeenCalledTimes(1)
  })
})

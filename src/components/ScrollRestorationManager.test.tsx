import { render } from '@testing-library/react'
import { ScrollRestorationManager } from '@/components/ScrollRestorationManager'

type MockNavigationType = 'POP' | 'PUSH' | 'REPLACE'

let mockLocation = {
  key: 'initial-key',
  pathname: '/',
  search: '',
  hash: '',
  state: null,
}
let mockNavigationType: MockNavigationType = 'PUSH'

vi.mock('react-router-dom', () => ({
  useLocation: () => mockLocation,
  useNavigationType: () => mockNavigationType,
}))

describe('ScrollRestorationManager', () => {
  const originalRequestAnimationFrame = window.requestAnimationFrame
  let container: HTMLDivElement

  beforeAll(() => {
    window.requestAnimationFrame = ((callback: FrameRequestCallback) => {
      callback(0)
      return 0
    }) as typeof window.requestAnimationFrame
  })

  afterAll(() => {
    window.requestAnimationFrame = originalRequestAnimationFrame
  })

  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
    document.body.innerHTML = ''
    window.scrollTo = vi.fn()
    Object.defineProperty(window, 'scrollY', {
      value: 0,
      writable: true,
      configurable: true,
    })
    container = document.createElement('div')
    container.setAttribute('data-scroll-restoration-id', 'themes-main')
    document.body.appendChild(container)

    mockNavigationType = 'PUSH'
    mockLocation = {
      key: 'themes-entry',
      pathname: '/themes',
      search: '',
      hash: '',
      state: null,
    }
  })

  it('scrolls to top on standard navigation', () => {
    container.scrollTop = 120
    render(<ScrollRestorationManager />)

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0)
    expect(container.scrollTop).toBe(0)
  })

  it('restores saved scroll position when navigation is POP', () => {
    const { rerender } = render(<ScrollRestorationManager />)

    Object.defineProperty(window, 'scrollY', {
      value: 420,
      writable: true,
      configurable: true,
    })
    container.scrollTop = 260

    mockNavigationType = 'PUSH'
    mockLocation = {
      key: 'theme-editor-entry',
      pathname: '/theme-editor/new',
      search: '',
      hash: '',
      state: null,
    }
    rerender(<ScrollRestorationManager />)

    mockNavigationType = 'POP'
    mockLocation = {
      key: 'themes-entry',
      pathname: '/themes',
      search: '',
      hash: '',
      state: null,
    }
    rerender(<ScrollRestorationManager />)

    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 420)
    expect(container.scrollTop).toBe(260)
  })

  it('falls back to top when POP has no saved position', () => {
    const { rerender } = render(<ScrollRestorationManager />)

    mockNavigationType = 'POP'
    mockLocation = {
      key: 'unknown-entry',
      pathname: '/templates',
      search: '',
      hash: '',
      state: null,
    }

    rerender(<ScrollRestorationManager />)

    expect(window.scrollTo).toHaveBeenLastCalledWith(0, 0)
  })
})

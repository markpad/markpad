import { renderHook, act } from '@testing-library/react'
import {
  useFileImport,
  isAcceptedFile,
  formatFileSize,
  ACCEPTED_EXTENSIONS,
  MAX_FILE_SIZE,
} from '@/hooks/useFileImport'

describe('useFileImport', () => {
  describe('utility functions', () => {
    describe('isAcceptedFile', () => {
      it('should accept .md files', () => {
        expect(isAcceptedFile('readme.md')).toBe(true)
      })

      it('should accept .markdown files', () => {
        expect(isAcceptedFile('readme.markdown')).toBe(true)
      })

      it('should accept .txt files', () => {
        expect(isAcceptedFile('notes.txt')).toBe(true)
      })

      it('should be case-insensitive', () => {
        expect(isAcceptedFile('README.MD')).toBe(true)
        expect(isAcceptedFile('File.Markdown')).toBe(true)
        expect(isAcceptedFile('FILE.TXT')).toBe(true)
      })

      it('should reject unsupported extensions', () => {
        expect(isAcceptedFile('image.png')).toBe(false)
        expect(isAcceptedFile('data.json')).toBe(false)
        expect(isAcceptedFile('script.js')).toBe(false)
        expect(isAcceptedFile('document.pdf')).toBe(false)
      })

      it('should reject files with no extension', () => {
        expect(isAcceptedFile('Makefile')).toBe(false)
      })
    })

    describe('formatFileSize', () => {
      it('should format bytes', () => {
        expect(formatFileSize(500)).toBe('500 B')
      })

      it('should format kilobytes', () => {
        expect(formatFileSize(2048)).toBe('2.0 KB')
      })

      it('should format megabytes', () => {
        expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB')
      })

      it('should handle zero bytes', () => {
        expect(formatFileSize(0)).toBe('0 B')
      })
    })

    describe('constants', () => {
      it('should have accepted extensions', () => {
        expect(ACCEPTED_EXTENSIONS).toEqual(['.md', '.markdown', '.txt'])
      })

      it('should have max file size of 10MB', () => {
        expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024)
      })
    })
  })

  describe('hook', () => {
    function createMockFile(name: string, content: string, size?: number): File {
      const file = new File([content], name, { type: 'text/plain' })
      if (size !== undefined) {
        Object.defineProperty(file, 'size', { value: size })
      }
      // jsdom's File.text() may not work correctly, so we override it
      file.text = () => Promise.resolve(content)
      return file
    }

    describe('initial state', () => {
      it('should start with idle status', () => {
        const { result } = renderHook(() => useFileImport())
        expect(result.current.status).toBe('idle')
      })

      it('should have no error', () => {
        const { result } = renderHook(() => useFileImport())
        expect(result.current.error).toBeNull()
      })

      it('should have no result', () => {
        const { result } = renderHook(() => useFileImport())
        expect(result.current.result).toBeNull()
      })

      it('should not be dragging', () => {
        const { result } = renderHook(() => useFileImport())
        expect(result.current.isDragging).toBe(false)
      })
    })

    describe('importFile', () => {
      it('should successfully import a .md file', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('test.md', '# Hello World')

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('success')
        expect(result.current.error).toBeNull()
        expect(result.current.result).toEqual({
          content: '# Hello World',
          fileName: 'test.md',
          fileSize: file.size,
        })
      })

      it('should successfully import a .txt file', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('notes.txt', 'Some notes')

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('success')
        expect(result.current.result?.content).toBe('Some notes')
      })

      it('should successfully import a .markdown file', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('doc.markdown', '## Section')

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('success')
      })

      it('should reject unsupported file types', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('image.png', 'data')

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('error')
        expect(result.current.error).toContain('Unsupported file type')
        expect(result.current.result).toBeNull()
      })

      it('should reject files exceeding max size', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('big.md', 'x', 11 * 1024 * 1024)

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('error')
        expect(result.current.error).toContain('File too large')
        expect(result.current.result).toBeNull()
      })

      it('should reject empty files', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('empty.md', '', 0)

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('error')
        expect(result.current.error).toBe('File is empty.')
      })

      it('should handle file read errors', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('test.md', 'content')
        // Override text() to throw
        file.text = () => Promise.reject(new Error('Read failed'))

        await act(async () => {
          await result.current.importFile(file)
        })

        expect(result.current.status).toBe('error')
        expect(result.current.error).toBe('Read failed')
      })
    })

    describe('reset', () => {
      it('should reset to initial state after successful import', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('test.md', '# Hello')

        await act(async () => {
          await result.current.importFile(file)
        })
        expect(result.current.status).toBe('success')

        act(() => {
          result.current.reset()
        })

        expect(result.current.status).toBe('idle')
        expect(result.current.error).toBeNull()
        expect(result.current.result).toBeNull()
        expect(result.current.isDragging).toBe(false)
      })

      it('should reset to initial state after error', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('bad.png', 'data')

        await act(async () => {
          await result.current.importFile(file)
        })
        expect(result.current.status).toBe('error')

        act(() => {
          result.current.reset()
        })

        expect(result.current.status).toBe('idle')
        expect(result.current.error).toBeNull()
      })
    })

    describe('drag-and-drop handlers', () => {
      function createDragEvent(files: File[] = []) {
        return {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
          dataTransfer: { files },
        } as unknown as React.DragEvent
      }

      it('should set isDragging on dragEnter', () => {
        const { result } = renderHook(() => useFileImport())
        const event = createDragEvent()

        act(() => {
          result.current.handleDragEnter(event)
        })

        expect(result.current.isDragging).toBe(true)
        expect(event.preventDefault).toHaveBeenCalled()
        expect(event.stopPropagation).toHaveBeenCalled()
      })

      it('should unset isDragging on dragLeave', () => {
        const { result } = renderHook(() => useFileImport())
        const enterEvent = createDragEvent()
        const leaveEvent = createDragEvent()

        act(() => {
          result.current.handleDragEnter(enterEvent)
        })
        expect(result.current.isDragging).toBe(true)

        act(() => {
          result.current.handleDragLeave(leaveEvent)
        })
        expect(result.current.isDragging).toBe(false)
      })

      it('should prevent default on dragOver', () => {
        const { result } = renderHook(() => useFileImport())
        const event = createDragEvent()

        act(() => {
          result.current.handleDragOver(event)
        })

        expect(event.preventDefault).toHaveBeenCalled()
        expect(event.stopPropagation).toHaveBeenCalled()
      })

      it('should handle file drop and import', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('dropped.md', '# Dropped content')
        const event = createDragEvent([file])

        await act(async () => {
          result.current.handleDrop(event)
        })

        expect(result.current.isDragging).toBe(false)
        expect(result.current.status).toBe('success')
        expect(result.current.result?.content).toBe('# Dropped content')
        expect(event.preventDefault).toHaveBeenCalled()
      })

      it('should handle drop with no files', async () => {
        const { result } = renderHook(() => useFileImport())
        const event = createDragEvent([])

        await act(async () => {
          result.current.handleDrop(event)
        })

        expect(result.current.isDragging).toBe(false)
        expect(result.current.status).toBe('idle')
      })
    })

    describe('handleFileInputChange', () => {
      it('should import file from input change event', async () => {
        const { result } = renderHook(() => useFileImport())
        const file = createMockFile('input.md', '# From input')

        const event = {
          target: {
            files: [file],
            value: 'input.md',
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        await act(async () => {
          result.current.handleFileInputChange(event)
        })

        expect(result.current.status).toBe('success')
        expect(result.current.result?.content).toBe('# From input')
        // input value should be reset for re-selection
        expect(event.target.value).toBe('')
      })

      it('should handle empty file input', async () => {
        const { result } = renderHook(() => useFileImport())

        const event = {
          target: {
            files: [],
            value: '',
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        await act(async () => {
          result.current.handleFileInputChange(event)
        })

        expect(result.current.status).toBe('idle')
      })
    })
  })
})

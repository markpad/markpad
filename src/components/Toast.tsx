import { useEffect } from 'react'
import { FaCheck } from 'react-icons/fa'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

/**
 * Toast notification component
 * Shows a temporary success message
 */
export function Toast({ message, isVisible, onClose, duration = 2500 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose, duration])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-900 text-white rounded-lg shadow-xl">
        <div className="flex items-center justify-center w-6 h-6 bg-green-500 rounded-full">
          <FaCheck className="text-xs" />
        </div>
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Toast

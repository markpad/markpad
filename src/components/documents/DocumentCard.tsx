import { FaFileAlt, FaStar, FaRegStar, FaTrash, FaUndo } from 'react-icons/fa'
import type { MarkpadDocument } from '../../lib/repositories'

function formatRelativeDate(date: Date): string {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return d.toLocaleDateString()
}

function getContentPreviewLines(content: string): string[] {
  const lines = content.split('\n').filter((line) => line.trim())
  return lines.slice(0, 6)
}

interface DocumentCardProps {
  document: MarkpadDocument
  viewMode: 'grid' | 'list'
  onOpen: (doc: MarkpadDocument) => void
  onToggleStar: (id: string) => void
  onTrash: (id: string) => void
  onRestore?: (id: string) => void
  onPermanentDelete?: (id: string) => void
  isTrashed?: boolean
}

export function DocumentCard({
  document: doc,
  viewMode,
  onOpen,
  onToggleStar,
  onTrash,
  onRestore,
  onPermanentDelete,
  isTrashed,
}: DocumentCardProps) {
  const previewLines = getContentPreviewLines(doc.content)

  if (viewMode === 'list') {
    return (
      <div
        className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-lg cursor-pointer transition-colors group shadow-sm"
        onClick={() => onOpen(doc)}
      >
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
          <FaFileAlt className="text-blue-500 dark:text-blue-400 text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {doc.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 truncate">{doc.content.slice(0, 80)}</p>
        </div>
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatRelativeDate(doc.updatedAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isTrashed ? (
            <>
              {onRestore && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRestore(doc.id)
                  }}
                  className="p-1.5 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                  title="Restore"
                >
                  <FaUndo className="text-xs" />
                </button>
              )}
              {onPermanentDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onPermanentDelete(doc.id)
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                  title="Delete permanently"
                >
                  <FaTrash className="text-xs" />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleStar(doc.id)
                }}
                className="p-1.5 text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
                title={doc.starred ? 'Remove star' : 'Star'}
              >
                {doc.starred ? (
                  <FaStar className="text-xs text-yellow-500 dark:text-yellow-400" />
                ) : (
                  <FaRegStar className="text-xs" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onTrash(doc.id)
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Move to trash"
              >
                <FaTrash className="text-xs" />
              </button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div
      className="group bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer shadow-sm"
      onClick={() => onOpen(doc)}
    >
      {/* Preview area */}
      <div className="h-36 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/50 p-4 overflow-hidden relative">
        <div className="space-y-1">
          {previewLines.map((line, i) => {
            const isHeading = line.startsWith('#')
            const headingLevel = line.match(/^#+/)?.[0].length || 0
            const text = line.replace(/^#+\s*/, '').replace(/[*_`[\]]/g, '')
            return (
              <p
                key={i}
                className={`truncate ${
                  isHeading
                    ? headingLevel === 1
                      ? 'text-xs font-bold text-gray-700 dark:text-gray-300'
                      : 'text-[11px] font-semibold text-gray-600 dark:text-gray-400'
                    : 'text-[10px] text-gray-500 leading-relaxed'
                }`}
              >
                {text}
              </p>
            )
          })}
        </div>

        {/* Gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent" />
      </div>

      {/* Card info */}
      <div className="p-3 flex items-start gap-2.5">
        <div className="flex-shrink-0 w-7 h-7 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center mt-0.5">
          <FaFileAlt className="text-blue-500 dark:text-blue-400 text-xs" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {doc.title || 'Untitled'}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{formatRelativeDate(doc.updatedAt)}</p>
        </div>

        {isTrashed ? (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {onRestore && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRestore(doc.id)
                }}
                className="p-1.5 text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors"
                title="Restore"
              >
                <FaUndo className="text-sm" />
              </button>
            )}
            {onPermanentDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onPermanentDelete(doc.id)
                }}
                className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                title="Delete permanently"
              >
                <FaTrash className="text-sm" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleStar(doc.id)
            }}
            className="p-1 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors opacity-0 group-hover:opacity-100"
            title={doc.starred ? 'Remove star' : 'Star'}
          >
            {doc.starred ? (
              <FaStar className="text-sm text-yellow-500 dark:text-yellow-400" />
            ) : (
              <FaRegStar className="text-sm" />
            )}
          </button>
        )}
      </div>
    </div>
  )
}

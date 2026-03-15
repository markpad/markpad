import { FaFileAlt, FaCopy, FaEdit, FaLock } from 'react-icons/fa'
import type { MarkpadTemplate } from '../../lib/repositories'

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
  return content
    .split('\n')
    .filter((line) => line.trim() && !line.startsWith('---'))
    .slice(0, 5)
}

const CATEGORY_COLORS: Record<string, string> = {
  writing: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400',
  professional: 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
  academic: 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400',
  technical: 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400',
  general: 'bg-gray-100 dark:bg-gray-500/20 text-gray-600 dark:text-gray-400',
}

interface TemplateCardProps {
  template: MarkpadTemplate
  viewMode: 'grid' | 'list'
  onUseTemplate: (template: MarkpadTemplate) => void
  onEditTemplate: (template: MarkpadTemplate) => void
}

export function TemplateCard({
  template,
  viewMode,
  onUseTemplate,
  onEditTemplate,
}: TemplateCardProps) {
  const previewLines = getContentPreviewLines(template.content)
  const categoryColor = CATEGORY_COLORS[template.category ?? 'general'] ?? CATEGORY_COLORS.general
  const variableCount = Object.keys(template.variablesSchema).length

  if (viewMode === 'list') {
    return (
      <div className="flex items-center gap-4 px-4 py-3 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700/50 rounded-lg transition-colors group shadow-sm">
        <div className="flex-shrink-0 w-8 h-8 bg-purple-100 dark:bg-purple-500/20 rounded-lg flex items-center justify-center">
          <FaFileAlt className="text-purple-500 dark:text-purple-400 text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {template.title}
            </h3>
            {template.isSystem && (
              <FaLock className="text-gray-400 dark:text-gray-600 text-[10px] flex-shrink-0" />
            )}
            {template.category && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColor}`}>
                {template.category}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">{template.description}</p>
        </div>
        {variableCount > 0 && (
          <span className="text-xs text-gray-500 flex-shrink-0">
            {variableCount} variable{variableCount !== 1 ? 's' : ''}
          </span>
        )}
        <span className="text-xs text-gray-500 flex-shrink-0">
          {formatRelativeDate(template.updatedAt)}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUseTemplate(template)
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 rounded-md transition-colors"
            title="Create document from template"
          >
            <FaCopy className="text-[10px]" />
            Use
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEditTemplate(template)
            }}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
            title="Edit template"
          >
            <FaEdit className="text-[10px]" />
            Edit
          </button>
        </div>
      </div>
    )
  }

  // Grid view
  return (
    <div className="group bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 rounded-xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-sm">
      {/* Preview area */}
      <div className="h-32 p-3 overflow-hidden border-b border-gray-200 dark:border-gray-700/50">
        <div className="space-y-0.5">
          {previewLines.map((line, i) => {
            const isHeading = line.startsWith('#')
            const headingLevel = line.match(/^#+/)?.[0]?.length ?? 0
            const text = line.replace(/^#+\s*/, '').replace(/\{\{.*?\}\}/g, '___')
            return (
              <p
                key={i}
                className={`truncate ${
                  isHeading
                    ? headingLevel <= 1
                      ? 'text-xs font-bold text-gray-700 dark:text-gray-300'
                      : 'text-[11px] font-semibold text-gray-600 dark:text-gray-400'
                    : 'text-[10px] text-gray-500 leading-tight'
                }`}
              >
                {text}
              </p>
            )
          })}
        </div>
      </div>

      {/* Info area */}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1">
            {template.title}
          </h3>
          {template.isSystem && (
            <FaLock className="text-gray-400 dark:text-gray-600 text-[10px] flex-shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 truncate mb-2">{template.description}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {template.category && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${categoryColor}`}>
                {template.category}
              </span>
            )}
            {variableCount > 0 && (
              <span className="text-[10px] text-gray-500">
                {variableCount} var{variableCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-200 dark:border-gray-700/50">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onUseTemplate(template)
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-500/30 rounded-md transition-colors"
          >
            <FaCopy className="text-[10px]" />
            Use Template
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEditTemplate(template)
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
          >
            <FaEdit className="text-[10px]" />
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}

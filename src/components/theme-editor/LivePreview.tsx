import { useMemo, useCallback, type MouseEvent } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { type ThemeElement, type ElementConfig, configToClasses, SAMPLE_MARKDOWN } from '@/components/theme-editor/types'

interface LivePreviewProps {
  configs: Record<ThemeElement, ElementConfig>
  highlightElement?: ThemeElement | null
  inspectMode?: boolean
  onSelectElement?: (element: ThemeElement) => void
}

export function LivePreview({
  configs,
  highlightElement,
  inspectMode,
  onSelectElement,
}: LivePreviewProps) {
  // Generate class strings for all elements
  const classes = useMemo(() => {
    const result: Record<string, string> = {}
    for (const [element, config] of Object.entries(configs)) {
      result[element] = configToClasses(config, element as ThemeElement)
    }
    return result
  }, [configs])

  // Get highlight ring classes
  const getHighlightClasses = (element: ThemeElement) => {
    if (highlightElement === element) {
      return ' ring-2 ring-blue-500 ring-offset-2'
    }
    return ''
  }

  // Get inspect mode classes (hover effect)
  const getInspectClasses = () => {
    if (inspectMode) {
      return ' hover:ring-2 hover:ring-blue-400 hover:ring-offset-1 transition-shadow cursor-pointer'
    }
    return ''
  }

  // Handle element click in inspect mode
  const handleInspectClick = useCallback(
    (element: ThemeElement) => (e: MouseEvent) => {
      if (inspectMode && onSelectElement) {
        e.preventDefault()
        e.stopPropagation()
        onSelectElement(element)
      }
    },
    [inspectMode, onSelectElement]
  )

  return (
    <div className={`${classes.body} min-h-full`} onClick={handleInspectClick('body')}>
      <article
        className={`${classes.article}${getHighlightClasses('article')}${getInspectClasses()}`}
        onClick={handleInspectClick('article')}
      >
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1
                className={`${classes.h1}${getHighlightClasses('h1')}${getInspectClasses()}`}
                onClick={handleInspectClick('h1')}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                className={`${classes.h2}${getHighlightClasses('h2')}${getInspectClasses()}`}
                onClick={handleInspectClick('h2')}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                className={`${classes.h3}${getHighlightClasses('h3')}${getInspectClasses()}`}
                onClick={handleInspectClick('h3')}
              >
                {children}
              </h3>
            ),
            h4: ({ children }) => (
              <h4
                className={`${classes.h4}${getHighlightClasses('h4')}${getInspectClasses()}`}
                onClick={handleInspectClick('h4')}
              >
                {children}
              </h4>
            ),
            h5: ({ children }) => (
              <h5
                className={`${classes.h5}${getHighlightClasses('h5')}${getInspectClasses()}`}
                onClick={handleInspectClick('h5')}
              >
                {children}
              </h5>
            ),
            h6: ({ children }) => (
              <h6
                className={`${classes.h6}${getHighlightClasses('h6')}${getInspectClasses()}`}
                onClick={handleInspectClick('h6')}
              >
                {children}
              </h6>
            ),
            p: ({ children }) => (
              <p
                className={`${classes.p}${getHighlightClasses('p')}${getInspectClasses()}`}
                onClick={handleInspectClick('p')}
              >
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a
                href={href || '#'}
                className={`${classes.a}${getHighlightClasses('a')}${getInspectClasses()}`}
                target={inspectMode ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={handleInspectClick('a')}
              >
                {children}
              </a>
            ),
            blockquote: ({ children }) => (
              <blockquote
                className={`${classes.blockquote}${getHighlightClasses('blockquote')}${getInspectClasses()}`}
                onClick={handleInspectClick('blockquote')}
              >
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul
                className={`${classes.ul}${getHighlightClasses('ul')}${getInspectClasses()}`}
                onClick={handleInspectClick('ul')}
              >
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol
                className={`${classes.ol}${getHighlightClasses('ol')}${getInspectClasses()}`}
                onClick={handleInspectClick('ol')}
              >
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li
                className={`${classes.li}${getHighlightClasses('li')}${getInspectClasses()}`}
                onClick={handleInspectClick('li')}
              >
                {children}
              </li>
            ),
            code: ({ className, children, ...props }) => {
              const isInline = !className
              if (isInline) {
                return (
                  <code
                    className={`${classes.code}${getHighlightClasses('code')}${getInspectClasses()}`}
                    onClick={handleInspectClick('code')}
                    {...props}
                  >
                    {children}
                  </code>
                )
              }
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            },
            pre: ({ children }) => (
              <pre
                className={`${classes.pre}${getHighlightClasses('pre')}${getInspectClasses()}`}
                onClick={handleInspectClick('pre')}
              >
                {children}
              </pre>
            ),
            table: ({ children }) => (
              <table
                className={`${classes.table} w-full${getHighlightClasses('table')}${getInspectClasses()}`}
                onClick={handleInspectClick('table')}
              >
                {children}
              </table>
            ),
            thead: ({ children }) => <thead>{children}</thead>,
            tbody: ({ children }) => <tbody>{children}</tbody>,
            tr: ({ children }) => (
              <tr
                className={`${classes.tr}${getHighlightClasses('tr')}${getInspectClasses()}`}
                onClick={handleInspectClick('tr')}
              >
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th
                className={`${classes.th}${getHighlightClasses('th')}${getInspectClasses()}`}
                onClick={handleInspectClick('th')}
              >
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td
                className={`${classes.td}${getHighlightClasses('td')}${getInspectClasses()}`}
                onClick={handleInspectClick('td')}
              >
                {children}
              </td>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className={`${classes.img} max-w-full h-auto${getHighlightClasses('img')}${getInspectClasses()}`}
                onClick={handleInspectClick('img')}
              />
            ),
            hr: () => (
              <hr
                className={`${classes.hr}${getHighlightClasses('hr')}${getInspectClasses()}`}
                onClick={handleInspectClick('hr')}
              />
            ),
            strong: ({ children }) => (
              <strong
                className={`${classes.strong}${getHighlightClasses('strong')}${getInspectClasses()}`}
                onClick={handleInspectClick('strong')}
              >
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em
                className={`${classes.em}${getHighlightClasses('em')}${getInspectClasses()}`}
                onClick={handleInspectClick('em')}
              >
                {children}
              </em>
            ),
          }}
        >
          {SAMPLE_MARKDOWN}
        </Markdown>
      </article>
    </div>
  )
}

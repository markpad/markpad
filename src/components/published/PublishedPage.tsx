import { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import { useParams, Navigate, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import pako from 'pako'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { decodeState } from '../../services/urlStateService'
import { PublishedHeader } from './PublishedHeader'
import { VariableWizard } from './VariableWizard'
import {
  parseFrontmatter,
  interpolateVariables,
  processConditionals,
  processLoops,
} from '../../utils/frontmatter'
import {
  parseVariableDefinitions,
  getDefaultValues,
  mergeVariablesWithFrontmatter,
} from './variableTypes'
import type { VariableDefinitions, VariableValues } from './variableTypes'
import type { AppState } from '../../types'

// Encode variable values to URL-safe string
function encodeVariableValues(values: VariableValues): string {
  try {
    const jsonString = JSON.stringify(values)
    const compressed = pako.deflate(new TextEncoder().encode(jsonString))
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    return base64.replace(/[+/=]/g, (c) => ({ '+': '-', '/': '_', '=': '' })[c] || c)
  } catch {
    return ''
  }
}

// Decode variable values from URL-safe string
function decodeVariableValues(encoded: string): VariableValues | null {
  try {
    if (!encoded) return null
    let base64 = encoded.replace(/[-_]/g, (c) => ({ '-': '+', _: '/' })[c] || c)
    while (base64.length % 4 !== 0) base64 += '='
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i)
    const decompressed = pako.inflate(bytes)
    return JSON.parse(new TextDecoder().decode(decompressed))
  } catch {
    return null
  }
}

/**
 * Published page - displays a read-only preview of a document
 * Similar to Google Docs "Published to Web" feature
 */
export function PublishedPage() {
  const { pako: pakoParam } = useParams<{ pako: string }>()
  const [searchParams, setSearchParams] = useSearchParams()
  const [state, setState] = useState<AppState | null>(null)
  const [error, setError] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved === 'true'
  })
  const [showWizard, setShowWizard] = useState(false)
  const [variableDefinitions, setVariableDefinitions] = useState<VariableDefinitions | null>(null)
  const [variableValues, setVariableValues] = useState<VariableValues>({})
  const articleRef = useRef<HTMLElement>(null)

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString())
  }, [darkMode])

  // Decode main state from pako param
  useEffect(() => {
    if (pakoParam) {
      const decoded = decodeState(pakoParam)
      if (decoded) {
        setState(decoded)

        // Parse variable definitions from frontmatter
        const { data } = parseFrontmatter(decoded.markdown)
        const definitions = parseVariableDefinitions(data)
        setVariableDefinitions(definitions)

        // Get variable values from URL or use defaults
        const varsParam = searchParams.get('vars')
        if (varsParam && definitions) {
          const urlValues = decodeVariableValues(varsParam)
          if (urlValues) {
            setVariableValues(urlValues)
          } else {
            setVariableValues(getDefaultValues(definitions))
          }
        } else if (definitions) {
          setVariableValues(getDefaultValues(definitions))
        }
      } else {
        setError(true)
      }
    } else {
      setError(true)
    }
  }, [pakoParam, searchParams])

  // Handle variable value changes
  const handleVariableChange = useCallback(
    (newValues: VariableValues) => {
      setVariableValues(newValues)
      // Update URL with new values
      const encoded = encodeVariableValues(newValues)
      if (encoded) {
        setSearchParams({ vars: encoded }, { replace: true })
      }
    },
    [setSearchParams]
  )

  // Process frontmatter and interpolate variables with current values
  const processedMarkdown = useMemo(() => {
    if (!state) return ''

    const { content, data } = parseFrontmatter(state.markdown)

    // Merge frontmatter data with user-provided variable values
    const mergedData = mergeVariablesWithFrontmatter(data, variableValues)

    // Process loops FIRST (handles conditionals inside loops with loop context),
    // then remaining top-level conditionals, then interpolate variables
    const loopsProcessed = processLoops(content, mergedData)
    const conditionalsProcessed = processConditionals(loopsProcessed, mergedData)
    const interpolated = interpolateVariables(conditionalsProcessed, mergedData)

    return interpolated
  }, [state, variableValues])

  if (error) {
    return <Navigate to="/" replace />
  }

  if (!state) {
    return (
      <div
        className={`flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900 ${darkMode ? 'dark' : ''}`}
      >
        <div className="animate-pulse text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    )
  }

  // Generate editor URL with the same state
  const editorUrl = `/editor#${pakoParam}`

  const components = {
    h1: ({ node, ...props }: any) => <h1 {...props} className={state.tailwindClasses.h1} />,
    h2: ({ node, ...props }: any) => <h2 {...props} className={state.tailwindClasses.h2} />,
    h3: ({ node, ...props }: any) => <h3 {...props} className={state.tailwindClasses.h3} />,
    h4: ({ node, ...props }: any) => <h4 {...props} className={state.tailwindClasses.h4} />,
    h5: ({ node, ...props }: any) => <h5 {...props} className={state.tailwindClasses.h5} />,
    h6: ({ node, ...props }: any) => <h6 {...props} className={state.tailwindClasses.h6} />,
    p: ({ node, ...props }: any) => <p className={state.tailwindClasses.p} {...props} />,
    a: ({ node, ...props }: any) => (
      <a
        aria-label="Link"
        className={state.tailwindClasses.a}
        {...props}
        target={state.behaviorConfig.shouldOpenLinksInNewTab ? '_blank' : undefined}
        rel={state.behaviorConfig.shouldOpenLinksInNewTab ? 'noopener noreferrer' : undefined}
      />
    ),
    img: ({ node, ...props }: any) => (
      <img alt="" className={state.tailwindClasses.img} {...props} />
    ),
    table: ({ node, ...props }: any) => (
      <table className={state.tailwindClasses.table} {...props} />
    ),
    ul: ({ node, ...props }: any) => <ul className={state.tailwindClasses.ul} {...props} />,
    ol: ({ node, ...props }: any) => <ol className={state.tailwindClasses.ol} {...props} />,
    li: ({ node, ...props }: any) => <li className={state.tailwindClasses.li} {...props} />,
    strong: ({ node, ...props }: any) => (
      <strong className={state.tailwindClasses.strong} {...props} />
    ),
    em: ({ node, ...props }: any) => <em className={state.tailwindClasses.em} {...props} />,
    tr: ({ node, ...props }: any) => <tr className={state.tailwindClasses.tr} {...props} />,
    td: ({ node, ...props }: any) => <td className={state.tailwindClasses.td} {...props} />,
    th: ({ node, ...props }: any) => <th className={state.tailwindClasses.th} {...props} />,
    blockquote: ({ node, ...props }: any) => (
      <blockquote className={state.tailwindClasses.blockquote} {...props} />
    ),
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '')
      const language = match ? match[1] : ''

      if (inline) {
        return (
          <code className={state.tailwindClasses.code} {...props}>
            {children}
          </code>
        )
      }

      return (
        <SyntaxHighlighter
          style={oneLight}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: '0.375rem',
            fontSize: '0.875rem',
          }}
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      )
    },
    pre: ({ node, children, ...props }: any) => (
      <pre className={state.tailwindClasses.pre} {...props}>
        {children}
      </pre>
    ),
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'dark' : ''}`}>
      <div className="h-screen flex flex-col bg-white dark:bg-gray-900">
        <Helmet>
          <title>{state.documentTitle} - Marklab</title>
          <meta name="description" content={`${state.documentTitle} - Published with Marklab`} />
          <style>{`
          @media print {
            header, footer, .no-print {
              display: none !important;
            }
            body {
              background: white !important;
            }
            .print-title {
              display: block !important;
              font-size: 0.75rem;
              font-weight: 500;
              margin-bottom: 1rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #e5e7eb;
              color: #6b7280;
            }
          }
          .print-title {
            display: none;
          }
        `}</style>
        </Helmet>

        <PublishedHeader
          documentTitle={state.documentTitle}
          editorUrl={editorUrl}
          markdown={state.markdown}
          articleRef={articleRef}
          tailwindClasses={state.tailwindClasses}
          fontFamily={state.fontConfig.fontFamily}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          hasVariables={variableDefinitions !== null}
          showWizard={showWizard}
          onToggleWizard={() => setShowWizard(!showWizard)}
        />

        <div className="flex flex-1 overflow-hidden">
          {/* Variable Wizard Sidebar */}
          {showWizard && variableDefinitions && (
            <aside
              className={`w-80 flex-shrink-0 border-r overflow-hidden ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}
            >
              <VariableWizard
                definitions={variableDefinitions}
                values={variableValues}
                onChange={handleVariableChange}
                onClose={() => setShowWizard(false)}
                darkMode={darkMode}
              />
            </aside>
          )}

          {/* Content Area with body styles */}
          <div
            className={`flex-1 overflow-y-auto ${state.tailwindClasses.body}`}
            style={{ fontFamily: state.fontConfig.fontFamily }}
          >
            <main className="max-w-6xl mx-auto py-8 px-4">
              <h1 className="print-title">{state.documentTitle}</h1>
              <article ref={articleRef} className={state.tailwindClasses.article}>
                <Markdown components={components} remarkPlugins={[gfm]}>
                  {processedMarkdown}
                </Markdown>
              </article>
            </main>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm no-print">
              Published with{' '}
              <a
                href="/"
                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
              >
                Marklab
              </a>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishedPage

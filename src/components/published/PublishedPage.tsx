import { useEffect, useState, useRef, useMemo } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { decodeState } from '../../services/urlStateService'
import { PublishedHeader } from './PublishedHeader'
import { processMarkdownWithFrontmatter } from '../../utils/frontmatter'
import type { AppState } from '../../types'

/**
 * Published page - displays a read-only preview of a document
 * Similar to Google Docs "Published to Web" feature
 */
export function PublishedPage() {
  const { pako } = useParams<{ pako: string }>()
  const [state, setState] = useState<AppState | null>(null)
  const [error, setError] = useState(false)
  const articleRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (pako) {
      const decoded = decodeState(pako)
      if (decoded) {
        setState(decoded)
      } else {
        setError(true)
      }
    } else {
      setError(true)
    }
  }, [pako])

  // Process frontmatter and interpolate variables
  const processedMarkdown = useMemo(() => {
    if (!state) return ''
    const { processedContent } = processMarkdownWithFrontmatter(state.markdown)
    return processedContent
  }, [state])

  if (error) {
    return <Navigate to="/" replace />
  }

  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    )
  }

  // Generate editor URL with the same state
  const editorUrl = `/editor#${pako}`

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
    <div className="min-h-screen flex flex-col">
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
      />

      {/* Content Area with body styles */}
      <div
        className={`flex-1 ${state.tailwindClasses.body}`}
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
        <footer className="text-center py-6 text-gray-400 text-sm no-print">
          Published with{' '}
          <a href="/" className="text-blue-500 hover:text-blue-600 transition-colors">
            Marklab
          </a>
        </footer>
      </div>
    </div>
  )
}

export default PublishedPage

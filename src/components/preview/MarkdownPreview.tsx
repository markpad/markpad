import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { TailwindClasses, BehaviorConfig, FontConfig } from '../../types'
import { useMemo, useCallback } from 'react'

interface MarkdownPreviewProps {
  markdown: string
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
  fontConfig: FontConfig
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void
  scrollRef?: React.RefObject<HTMLDivElement>
}

/**
 * Markdown preview component with customizable Tailwind styling
 * Follows Single Responsibility - handles only markdown rendering
 */
export function MarkdownPreview({
  markdown,
  tailwindClasses,
  behaviorConfig,
  fontConfig,
  onScroll,
  scrollRef,
}: MarkdownPreviewProps) {
  // Handle scroll for sync
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      if (onScroll) {
        const target = e.currentTarget
        onScroll(target.scrollTop, target.scrollHeight, target.clientHeight)
      }
    },
    [onScroll]
  )

  // Memoize components to prevent unnecessary re-renders
  const components = useMemo(
    () => ({
      h1: ({ node, ...props }: any) => <h1 {...props} className={tailwindClasses.h1} />,
      h2: ({ node, ...props }: any) => <h2 {...props} className={tailwindClasses.h2} />,
      h3: ({ node, ...props }: any) => <h3 {...props} className={tailwindClasses.h3} />,
      h4: ({ node, ...props }: any) => <h4 {...props} className={tailwindClasses.h4} />,
      h5: ({ node, ...props }: any) => <h5 {...props} className={tailwindClasses.h5} />,
      h6: ({ node, ...props }: any) => <h6 {...props} className={tailwindClasses.h6} />,
      p: ({ node, ...props }: any) => <p className={tailwindClasses.p} {...props} />,
      a: ({ node, ...props }: any) => (
        <a
          aria-label="Link"
          className={tailwindClasses.a}
          {...props}
          target={behaviorConfig.shouldOpenLinksInNewTab ? '_blank' : undefined}
          rel={behaviorConfig.shouldOpenLinksInNewTab ? 'noopener noreferrer' : undefined}
        />
      ),
      img: ({ node, ...props }: any) => <img alt="" className={tailwindClasses.img} {...props} />,
      table: ({ node, ...props }: any) => <table className={tailwindClasses.table} {...props} />,
      ul: ({ node, ...props }: any) => <ul className={tailwindClasses.ul} {...props} />,
      ol: ({ node, ...props }: any) => <ol className={tailwindClasses.ol} {...props} />,
      li: ({ node, ...props }: any) => <li className={tailwindClasses.li} {...props} />,
      strong: ({ node, ...props }: any) => <strong className={tailwindClasses.strong} {...props} />,
      em: ({ node, ...props }: any) => <em className={tailwindClasses.em} {...props} />,
      tr: ({ node, ...props }: any) => <tr className={tailwindClasses.tr} {...props} />,
      td: ({ node, ...props }: any) => <td className={tailwindClasses.td} {...props} />,
      th: ({ node, ...props }: any) => <th className={tailwindClasses.th} {...props} />,
      blockquote: ({ node, ...props }: any) => (
        <blockquote className={tailwindClasses.blockquote} {...props} />
      ),
      code: ({ node, inline, className, children, ...props }: any) => {
        const match = /language-(\w+)/.exec(className || '')
        const language = match ? match[1] : ''

        if (inline) {
          return (
            <code className={tailwindClasses.code} {...props}>
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
        <pre className={tailwindClasses.pre} {...props}>
          {children}
        </pre>
      ),
    }),
    [tailwindClasses, behaviorConfig.shouldOpenLinksInNewTab]
  )

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border-b border-gray-200">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Live Preview</span>
      </div>
      <div
        ref={scrollRef}
        className={`flex-1 overflow-auto p-6 ${tailwindClasses.body}`}
        style={{ fontFamily: fontConfig.fontFamily }}
        onScroll={handleScroll}
      >
        <article className={tailwindClasses.article}>
          <Markdown components={components} remarkPlugins={[gfm]}>
            {markdown}
          </Markdown>
        </article>
      </div>
    </div>
  )
}

export default MarkdownPreview

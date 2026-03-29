import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import type { TailwindClasses, FontConfig } from '@/types'
import { useMemo, useCallback } from 'react'
import { processMarkdownWithFrontmatter } from '@/utils/frontmatter'
import { useUserSettings } from '@/hooks/useUserSettings'

interface MarkdownPreviewProps {
  markdown: string
  tailwindClasses: TailwindClasses
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
  fontConfig,
  onScroll,
  scrollRef,
}: MarkdownPreviewProps) {
  const { settings } = useUserSettings()

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
  const components = useMemo(() => {
    const headingStyle = fontConfig.headingFontFamily
      ? { fontFamily: fontConfig.headingFontFamily }
      : undefined
    return {
      h1: ({ node, ...props }: any) => (
        <h1 {...props} className={tailwindClasses.h1} style={headingStyle} />
      ),
      h2: ({ node, ...props }: any) => (
        <h2 {...props} className={tailwindClasses.h2} style={headingStyle} />
      ),
      h3: ({ node, ...props }: any) => (
        <h3 {...props} className={tailwindClasses.h3} style={headingStyle} />
      ),
      h4: ({ node, ...props }: any) => (
        <h4 {...props} className={tailwindClasses.h4} style={headingStyle} />
      ),
      h5: ({ node, ...props }: any) => (
        <h5 {...props} className={tailwindClasses.h5} style={headingStyle} />
      ),
      h6: ({ node, ...props }: any) => (
        <h6 {...props} className={tailwindClasses.h6} style={headingStyle} />
      ),
      p: ({ node, ...props }: any) => <p className={tailwindClasses.p} {...props} />,
      a: ({ node, ...props }: any) => (
        <a
          aria-label="Link"
          className={tailwindClasses.a}
          {...props}
          target={settings.editor.openLinksInNewTab ? '_blank' : undefined}
          rel={settings.editor.openLinksInNewTab ? 'noopener noreferrer' : undefined}
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

        // Detect inline code: either explicit inline prop, or no language class and single line content
        const content = String(children)
        const isInline =
          inline === true || (inline !== false && !className && !content.includes('\n'))

        if (isInline) {
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
            {content.replace(/\n$/, '')}
          </SyntaxHighlighter>
        )
      },
      pre: ({ node, children, ...props }: any) => (
        <pre className={tailwindClasses.pre} {...props}>
          {children}
        </pre>
      ),
    }
  }, [tailwindClasses, fontConfig.headingFontFamily, settings.editor.openLinksInNewTab])

  // Process frontmatter and interpolate variables
  const processedMarkdown = useMemo(() => {
    const { processedContent } = processMarkdownWithFrontmatter(markdown)
    return processedContent
  }, [markdown])

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
          Live Preview
        </span>
      </div>
      <div
        ref={scrollRef}
        className={`flex-1 overflow-auto p-6 ${tailwindClasses.body}`}
        style={{ fontFamily: fontConfig.fontFamily }}
        onScroll={handleScroll}
      >
        <article className={tailwindClasses.article}>
          <Markdown components={components} remarkPlugins={[gfm]}>
            {processedMarkdown}
          </Markdown>
        </article>
      </div>
    </div>
  )
}

export default MarkdownPreview

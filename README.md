# Markpad

A Markdown editor with live preview, a theme gallery, document management, frontmatter variables, and Nunjucks-powered templating — all running in the browser.

**Live at:** [markpad.cc](https://markpad.cc)

---

## Features

### Editor

- **Live split-view preview** — changes render instantly as you type
- **Syntax-highlighted editor** powered by [react-simple-code-editor](https://github.com/react-simple/react-simple-code-editor) and [Prism.js](https://prismjs.com)
- **GitHub Flavored Markdown** (GFM) — tables, strikethrough, task lists, autolinks
- **Toolbar** for headings, bold, italic, links, images, blockquotes, and code blocks
- **Dark mode** toggle

### Themes

- **25+ built-in themes** — Standard Blue, Dracula, Nord, GitHub Readme, Monokai, Cyberpunk, and many more
- Theme gallery with search, favorites, and category filters
- Per-theme dark mode support via `dark:` Tailwind variants

### Document Management

- **IndexedDB persistence** — documents survive page refreshes without a backend
- Create, rename, star, trash, and permanently delete documents
- Template library with system templates and custom user templates

### Frontmatter & Variable Interpolation

- Define variables in YAML frontmatter, use them anywhere with `{{variableName}}` syntax
- Nested variables: `{{company.name}}`
- Rendered in the live preview and on published pages; the frontmatter block itself is hidden

### Nunjucks Templating

- **`{% if condition %}…{% endif %}`** — conditional blocks
- **`{% for item in list %}…{% endfor %}`** — loop blocks
- Visual modals guide you through building conditions and loops

### Import & Export

- **URL import** — paste a URL and fetch its content via the [markclipper](https://github.com/markpad/markclipper) web service
- **File import** — drag & drop or pick a `.md` file
- **Export to Markdown** — source with frontmatter preserved
- **Export to styled HTML** — self-contained HTML with Tailwind classes inlined
- **Export to PDF** — rendered via html2pdf.js

### Publish & Share

- **Publish to web** — document is encoded in the URL; anyone with the link can read the styled page, no login required

---

## Tech Stack

| Layer               | Library                                    |
| ------------------- | ------------------------------------------ |
| Framework           | React 18 + TypeScript                      |
| Build               | Vite 6                                     |
| Styling             | Tailwind CSS 3 + `@tailwindcss/typography` |
| Markdown            | react-markdown + remark-gfm                |
| Templating          | Nunjucks                                   |
| Frontmatter         | gray-matter + js-yaml                      |
| Persistence         | IndexedDB via idb                          |
| Syntax highlighting | Prism.js + react-syntax-highlighter        |
| Testing             | Vitest + Testing Library                   |
| Package manager     | pnpm 10                                    |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 10

### Installation

```bash
git clone https://github.com/markpad/markpad.git
cd markpad
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file in the project root (all variables are optional):

```env
# URL of the web clipper API (defaults to the hosted markclipper instance)
VITE_CLIPPER_URL=https://markpad-worker.josetelesmaciel.workers.dev
```

---

## Development

```bash
# Start dev server (also regenerates themes from src/themes/)
pnpm dev

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui

# Type-check
tsc --noEmit

# Lint
pnpm lint

# Format
pnpm format

# Regenerate src/data/themes.generated.ts from src/themes/*/config.json
pnpm generate:themes

# Production build
pnpm build
```

### Adding a Theme

1. Create `src/themes/<your-theme-name>/config.json` following the schema of any existing theme
2. Run `pnpm generate:themes` — this rebuilds `src/data/themes.generated.ts`
3. The new theme will appear in the gallery immediately

---

## Frontmatter Example

```markdown
---
title: My Report
author: Jane Doe
date: 2026-03-28
company:
  name: Acme Corp
  role: Lead Engineer
---

# {{title}}

By **{{author}}** · {{date}}

Working at {{company.name}} as {{company.role}}.
```

---

## Contributing

Pull requests and issues are welcome.

1. Fork the repo and create a branch (`git checkout -b feat/my-feature`)
2. Make your changes with tests where appropriate
3. Open a pull request — commits follow [Conventional Commits](https://www.conventionalcommits.org) for automatic versioning via semantic-release

---

## License

[MIT](LICENSE) © [teles](https://github.com/teles)

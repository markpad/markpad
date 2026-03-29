# Markpad

Markpad is an offline-first Markdown workspace with live preview, reusable templates, frontmatter variables, theme presets, and URL-based publishing.

Live app: [markpad.cc](https://markpad.cc)

## Table of Contents

- [Why Markpad](#why-markpad)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Development Commands](#development-commands)
- [Project Structure](#project-structure)
- [How Themes Work](#how-themes-work)
- [Template and Variable System](#template-and-variable-system)
- [Publishing Model](#publishing-model)
- [Contributing](#contributing)
- [License](#license)

## Why Markpad

Markpad is designed for people who write structured Markdown repeatedly, such as reports, invoices, notes, docs, and content drafts.

It combines:

- A fast editor with split preview
- Data-driven writing with frontmatter and variables
- Reusable templates and visual themes
- Local persistence without requiring an account

## Core Features

### Writing Experience

- Live split preview while typing
- Markdown editing with syntax highlighting
- GitHub Flavored Markdown support via `remark-gfm`
- Toolbar actions for common formatting
- Light and dark mode support

### Themes

- 25+ built-in themes (serif, sans-serif, monospace, accessibility, experimental)
- Gallery with category filters, search, and favorites
- Custom theme editor for creating and saving local themes

### Documents and Templates

- IndexedDB persistence (documents survive refreshes)
- Document states: starred, recent, trash
- System templates + user templates
- Variable schemas for template-driven documents

### Frontmatter and Templating

- YAML frontmatter parsing
- Variable interpolation with `{{variable}}` and nested paths (`{{company.name}}`)
- Nunjucks blocks:
  - Conditionals: `{% if %} ... {% endif %}`
  - Loops: `{% for %} ... {% endfor %}`

### Import, Export, Share

- Import from local `.md` files
- Import from URL (via markclipper service)
- Export to Markdown, styled HTML, and PDF
- Publish as a shareable URL-encoded page

## Tech Stack

| Layer           | Tools                                      |
| --------------- | ------------------------------------------ |
| Framework       | React 18 + TypeScript                      |
| Build           | Vite 6                                     |
| Styling         | Tailwind CSS 3 + `@tailwindcss/typography` |
| Markdown        | `react-markdown` + `remark-gfm`            |
| Templating      | Nunjucks                                   |
| Frontmatter     | `gray-matter` + `js-yaml`                  |
| Persistence     | IndexedDB (`idb`)                          |
| Testing         | Vitest + Testing Library                   |
| Component Dev   | Storybook 8 (`@storybook/react-vite`)      |
| Package Manager | pnpm 10                                    |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install and Run

```bash
git clone https://github.com/markpad/markpad.git
cd markpad
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create `.env.local` in the project root (all optional):

```env
# URL of the web clipper API
# Falls back to hosted markclipper if omitted
VITE_CLIPPER_URL=https://<worker-url>
```

## Development Commands

| Command                | Description                                                |
| ---------------------- | ---------------------------------------------------------- |
| `pnpm dev`             | Start app locally (runs theme generation first)            |
| `pnpm build`           | Type-check and build production bundle                     |
| `pnpm preview`         | Preview production build locally                           |
| `pnpm test`            | Run unit/integration tests                                 |
| `pnpm test:ui`         | Run Vitest in UI mode                                      |
| `pnpm lint`            | Run ESLint                                                 |
| `pnpm lint:fix`        | Auto-fix lint issues                                       |
| `pnpm format`          | Format source files with Prettier                          |
| `pnpm format:check`    | Check formatting without writing                           |
| `pnpm generate:themes` | Rebuild `src/data/themes.generated.ts` from `src/themes/*` |
| `pnpm storybook`       | Run Storybook on port `6006`                               |
| `pnpm build-storybook` | Build static Storybook site                                |

## Project Structure

```text
src/
  components/          UI pages and reusable components
    documents/         Documents listing and cards
    templates/         Template listing and cards
    themes/            Theme gallery and theme cards
    theme-editor/      Custom theme creation UI
    preview/           Markdown preview renderer
  data/
    themes.generated.ts  Auto-generated theme presets and helpers
    systemTemplates.ts   Built-in template seeds
  lib/
    repositories/      Data layer interfaces + IndexedDB implementations
    markdown-templating/ Frontmatter + Nunjucks processing
  themes/              Source theme folders (config.json + example.md)
scripts/
  generateThemes.js    Builds src/data/themes.generated.ts
```

## How Themes Work

Themes are defined under `src/themes/<theme-id>/` with:

- `config.json` (metadata + Tailwind classes)
- `example.md` (sample content shown in previews)

Running:

```bash
pnpm generate:themes
```

generates `src/data/themes.generated.ts`, which exports:

- `themePresets`
- `ThemeCategory` and `THEME_CATEGORIES`
- helper functions such as `getThemeById`, `filterThemesByCategory`, `searchThemes`

### Add a New Theme

1. Create `src/themes/<your-theme-id>/config.json`
2. Add `src/themes/<your-theme-id>/example.md`
3. Run `pnpm generate:themes`
4. Open `/themes` or Storybook to validate visuals

## Template and Variable System

Templates can include frontmatter defaults and placeholders:

```markdown
---
title: My Report
author: Jane Doe
company:
  name: Acme Corp
---

# {{title}}

By **{{author}}**

Company: {{company.name}}
```

You can also use Nunjucks control flow:

- `{% if condition %} ... {% endif %}`
- `{% for item in items %} ... {% endfor %}`

## Publishing Model

Published pages are rendered as read-only views where document content is encoded in the URL (`/s/:pako` route). This enables easy sharing without user accounts or server-side document storage.

## Contributing

Issues and pull requests are welcome.

1. Create a branch from `main`
2. Implement your change with tests when relevant
3. Run lint/tests/build locally
4. Open a PR using [Conventional Commits](https://www.conventionalcommits.org)

## License

[MIT](LICENSE) © [teles](https://github.com/teles)

# Markpad

A powerful Markdown editor with Tailwind CSS styling, frontmatter support, and variable interpolation.

## Demo

Check out the live demo at [marklab.pages.dev](https://marklab.pages.dev).

## Features

- **Live Preview:** See your changes in real-time as you type with split view
- **Tailwind CSS Styling:** Customize every element with Tailwind CSS classes and full autocomplete support
- **Theme Gallery:** Choose from 25+ professionally designed themes
- **Frontmatter & Variables:** Use YAML frontmatter with `{{variable}}` interpolation
- **Multiple Exports:** Export to Markdown, HTML, or PDF with embedded styles
- **Publish & Share:** Generate shareable links to your documents
- **URL State:** Your entire document state is encoded in the URL for easy bookmarking

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/teles/markpad.git

# Install dependencies
pnpm install

# Start the development server
pnpm start
```

## Frontmatter & Variables

Markpad supports YAML frontmatter with variable interpolation. Define variables in the frontmatter and use them anywhere in your document with `{{variableName}}` syntax.

### Example

```markdown
---
title: My Document
author: John Doe
date: 2026-03-10
company:
  name: Acme Corp
  role: Senior Developer
---

# {{title}}

Written by **{{author}}** on {{date}}.

Currently working at {{company.name}} as {{company.role}}.
```

### How it works

1. Add YAML frontmatter at the beginning of your markdown (between `---` delimiters)
2. Define your variables as key-value pairs
3. Use `{{variableName}}` syntax anywhere in your content
4. Variables are replaced in the Live Preview and published pages
5. Nested variables like `{{author.name}}` are supported
6. Undefined variables are displayed as-is

### Tips

- Frontmatter is preserved when downloading markdown files
- The frontmatter block itself is hidden in the preview
- Great for templates, resumes, blog posts, and reusable documents

## Usage

### Markdown Editing

Use the toolbar buttons or keyboard shortcuts:

- **H1-H3:** Click buttons or type `#`, `##`, `###`
- **Bold:** Click B or `**text**`
- **Italic:** Click I or `_text_`
- **Link:** Click link icon or `[text](url)`
- **Image:** Click image icon or `![alt](url)`

### Style Customization

1. Open the Styles panel on the right
2. Select any markdown element (h1, p, blockquote, etc.)
3. Add or remove Tailwind CSS classes
4. See changes instantly in the preview

### Exporting

Click the download button to export:

- **Markdown:** Original source with frontmatter
- **Simple HTML:** Plain HTML without styles
- **Styled HTML:** Complete HTML with Tailwind CSS

### Publishing

1. Click File → Publish to Web
2. Copy the generated shareable link
3. Anyone with the link can view your styled document

## Contributing

We welcome contributions! Feel free to open issues or create pull requests.

```bash
# Run linting
pnpm lint

# Run tests
pnpm test

# Build for production
pnpm build
```

## License

This project is licensed under the [MIT License](LICENSE).

---

**Markpad** — Markdown Editor with Tailwind CSS  
A project by [@teles](https://github.com/teles)

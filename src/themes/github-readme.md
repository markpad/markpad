---
id: github-readme
name: GitHub README
description: Mimics the style of GitHub repository README files.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#ffffff'
  textColor: '#1f2328'
  accentColor: '#0969da'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: GitHub README
  sampleText: The familiar, trusted style of GitHub repository documentation.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-gray-900 pb-2 border-b border-gray-300
  h2: text-2xl font-bold mb-3 text-gray-900 pb-2 border-b border-gray-300
  h3: text-xl font-semibold mb-3 text-gray-900
  h4: text-lg font-semibold mb-2 text-gray-900
  h5: text-base font-semibold mb-2 text-gray-900
  h6: text-sm font-semibold mb-2 text-gray-500
  p: mb-4 text-base text-gray-700 leading-7
  a: text-blue-600 hover:underline
  img: max-w-full my-4
  table: table-auto my-4 w-full
  strong: font-semibold text-gray-900
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-gray-700 leading-7
  em: italic
  tr: border border-gray-200 even:bg-gray-50 odd:bg-white
  td: border border-gray-200 p-2
  th: border border-gray-200 p-2 bg-gray-50 font-semibold text-gray-900
  blockquote: border-l-4 border-gray-300 pl-4 my-4 text-gray-600
  code: bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-gray-800
  pre: bg-gray-100 p-4 rounded-lg overflow-x-auto
  body: bg-white p-6 text-gray-800
  article: prose max-w-none
---

# taildown

A markdown editor with live preview and Tailwind CSS styling.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Live markdown preview with **Tailwind CSS** classes
- Theme gallery with 25+ presets
- URL-based state sharing
- Custom style panel with autocomplete

> **Note:** This project is under active development. Contributions welcome!

## Quick Start

### Prerequisites

1. Node.js 18+
2. npm or yarn
3. A modern browser

### Installation

```bash
git clone https://github.com/teles/taildown.git
cd taildown
npm install
npm start
```

## Usage

| Feature | Shortcut | Description         |
| ------- | -------- | ------------------- |
| Bold    | `Ctrl+B` | Toggle bold text    |
| Preview | `Ctrl+P` | Toggle preview mode |
| Save    | `Ctrl+S` | Save to URL         |
| Theme   | `Ctrl+T` | Open theme selector |

## Contributing

```bash
# Fork the repository
git checkout -b feature/my-feature
npm test
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Project Structure

- `src/components/` — React components
- `src/themes/` — Theme definitions
- `src/hooks/` — Custom React hooks
- `src/services/` — _Business logic_

## License

MIT — see [LICENSE](https://opensource.org/licenses/MIT) for details.

![Screenshot](https://picsum.photos/600/300?random=34)

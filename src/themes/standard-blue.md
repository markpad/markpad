---
id: standard-blue
name: Standard Blue
description: The classic Tailwind CSS utility-first aesthetic for developer docs.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#ffffff'
  textColor: '#1f2937'
  accentColor: '#3b82f6'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: Tailwind Default
  sampleText: The classic Tailwind CSS utility-first aesthetic for developer docs.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-gray-800
  h2: text-2xl font-bold mb-4 text-gray-800
  h3: text-xl font-bold mb-4 text-gray-800
  h4: text-lg font-bold mb-4 text-gray-800
  h5: text-base font-bold mb-4 text-gray-800
  h6: text-sm font-bold mb-4 text-gray-800
  p: mb-2 text-base text-gray-800
  a: text-blue-500 hover:text-blue-700 hover:underline
  img: max-w-full my-4
  table: table-auto my-4
  strong: font-bold
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic
  tr: border border-gray-200 even:bg-gray-50 odd:bg-white
  td: border border-gray-200 p-1
  th: border border-gray-200 p-1
  blockquote: border-l-4 border-gray-300 pl-4 italic my-4
  code: bg-gray-100 px-1 rounded font-mono text-sm
  pre: bg-gray-100 p-4 rounded overflow-x-auto
  body: bg-white p-4
  article: prose prose-slate max-w-none
---

# Welcome to Tailwind Default

A clean, professional theme based on the Tailwind CSS design system.

## Getting Started

This theme provides a **solid foundation** for technical documentation, blog posts, and general-purpose content.

### Features

- Clean typography
- Readable color palette
- Consistent spacing
- Mobile-friendly

> Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.

## Installation

```bash
npm install tailwindcss
npx tailwindcss init
```

## Configuration

| Property  | Default | Description    |
| --------- | ------- | -------------- |
| `content` | `[]`    | Files to scan  |
| `theme`   | `{}`    | Customizations |
| `plugins` | `[]`    | Extensions     |

### Example Usage

1. Install dependencies
2. Configure your template paths
3. Add Tailwind directives
4. Start the build process

```javascript
module.exports = {
  content: ['./src/**/*.{html,js}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## Resources

- [Official Documentation](https://tailwindcss.com)
- [GitHub Repository](https://github.com/tailwindlabs/tailwindcss)
- [Community Discord](https://discord.gg/tailwind)

![Tailwind CSS](https://picsum.photos/600/300?random=3)

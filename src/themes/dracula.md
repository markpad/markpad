---
id: dracula
name: Dracula
description: Popular dark purple theme with vibrant accent colors.
category: experimental
fontFamily: Fira Sans

preview:
  bgColor: '#282a36'
  textColor: '#f8f8f2'
  accentColor: '#bd93f9'
  headingFont: Fira Sans
  bodyFont: Fira Sans
  sampleHeading: Dracula
  sampleText: A dark theme with vibrant purples, pinks, and cyans.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-purple-400
  h2: text-2xl font-bold mb-4 text-purple-300
  h3: text-xl font-semibold mb-3 text-pink-400
  h4: text-lg font-semibold mb-3 text-pink-300
  h5: text-base font-semibold mb-2 text-pink-300
  h6: text-sm font-semibold mb-2 text-pink-300
  p: mb-3 text-base leading-relaxed
  a: text-cyan-400 hover:text-cyan-300 hover:underline
  img: max-w-full my-4 rounded-lg border border-purple-800
  table: table-auto my-4 w-full
  strong: font-bold text-pink-300
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic text-yellow-300
  tr: border border-purple-800 even:bg-purple-900 odd:bg-gray-900
  td: border border-purple-800 p-2
  th: border border-purple-800 p-2 bg-purple-900 font-semibold text-purple-300
  blockquote: border-l-4 border-purple-500 pl-4 italic my-4 text-purple-200 bg-purple-900 py-2 rounded-r
  code: bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400
  pre: bg-gray-900 p-4 rounded-lg overflow-x-auto border border-purple-800
  body: bg-gray-900 p-6 text-gray-100
  article: prose prose-invert max-w-none
---

# Dracula Theme

Welcome to the dark side — elegant, vibrant, and easy on the eyes.

## What is Dracula?

Dracula is a **dark theme** created by Zeno Rocha. It has been adopted by hundreds of applications including editors, terminals, and now — your markdown.

### Color Philosophy

1. High contrast against a dark background
2. Vibrant yet non-fatiguing accent colors
3. Carefully balanced warm and cool tones
4. Consistent across applications

> "One theme to rule them all."
> — The Dracula community

## Palette

| Color      | Hex       | Usage        |
| ---------- | --------- | ------------ |
| Background | `#282a36` | Base canvas  |
| Foreground | `#f8f8f2` | Primary text |
| Purple     | `#bd93f9` | Keywords     |
| Pink       | `#ff79c6` | Functions    |
| Cyan       | `#8be9fd` | Constants    |
| Green      | `#50fa7b` | Strings      |

## Code Example

```javascript
const dracula = {
  background: '#282a36',
  currentLine: '#44475a',
  foreground: '#f8f8f2',
  comment: '#6272a4',
  cyan: '#8be9fd',
  green: '#50fa7b',
  orange: '#ffb86c',
  pink: '#ff79c6',
  purple: '#bd93f9',
  red: '#ff5555',
  yellow: '#f1fa8c',
}
```

### Resources

- [Dracula Theme](https://draculatheme.com)
- Available for _300+_ apps and tools
- Open-source and community-driven

![Dracula theme](https://picsum.photos/600/300?random=21)

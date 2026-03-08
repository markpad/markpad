---
id: nord
name: Nord
description: Arctic, north-bluish color palette inspired by Nordic aesthetics.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#2e3440'
  textColor: '#d8dee9'
  accentColor: '#88c0d0'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: Nord
  sampleText: An arctic, north-bluish color palette for clean, elegant interfaces.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-blue-300
  h2: text-2xl font-bold mb-4 text-blue-300
  h3: text-xl font-semibold mb-3 text-blue-200
  h4: text-lg font-semibold mb-3 text-blue-200
  h5: text-base font-semibold mb-2 text-blue-200
  h6: text-sm font-semibold mb-2 text-blue-200
  p: mb-3 text-base leading-relaxed
  a: text-cyan-400 hover:text-cyan-300 hover:underline
  img: max-w-full my-4 rounded-lg
  table: table-auto my-4 w-full
  strong: font-bold text-white
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic text-blue-200
  tr: border border-gray-600 even:bg-gray-800 odd:bg-gray-700
  td: border border-gray-600 p-2
  th: border border-gray-600 p-2 bg-gray-700 font-semibold text-blue-300
  blockquote: border-l-4 border-cyan-500 pl-4 italic my-4 text-blue-200 bg-gray-800 py-2 rounded-r
  code: bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm text-cyan-300
  pre: bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-600
  body: bg-gray-800 p-6 text-gray-200
  article: prose prose-invert max-w-none
---

# Nord Theme

An arctic, north-bluish palette for the modern developer.

## Philosophy

Nord's design is inspired by the beauty and calmness of the **arctic**. Clean lines, subdued colors, and a focus on readability define this color scheme.

### Principles

1. Inspired by arctic landscapes
2. Four distinct palette groups
3. Smooth color transitions
4. Universal adaptability

> "Clean, beautiful, and designed with care — just like Scandinavian architecture."

## Palette Groups

| Group       | Purpose          | Colors |
| ----------- | ---------------- | ------ |
| Polar Night | Background tones | 4      |
| Snow Storm  | Text and UI      | 3      |
| Frost       | Primary accents  | 4      |
| Aurora      | Status colors    | 5      |

## Code Example

```javascript
const nordPalette = {
  // Polar Night
  nord0: '#2e3440',
  nord1: '#3b4252',
  nord2: '#434c5e',
  nord3: '#4c566a',
  // Snow Storm
  nord4: '#d8dee9',
  nord5: '#e5e9f0',
  nord6: '#eceff4',
  // Frost
  nord7: '#8fbcbb',
  nord8: '#88c0d0',
  nord9: '#81a1c1',
  nord10: '#5e81ac',
}
```

### Resources

- [Nord Website](https://www.nordtheme.com)
- Available for _editors, terminals, and UI_
- Community-maintained ports

![Nordic landscape](https://picsum.photos/600/300?random=22)

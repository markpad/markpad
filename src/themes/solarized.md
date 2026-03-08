---
id: solarized
name: Solarized
description: Ethan Schoonover's precision-engineered color scheme for comfortable reading.
category: sans-serif
fontFamily: Source Sans Pro

preview:
  bgColor: '#fdf6e3'
  textColor: '#657b83'
  accentColor: '#268bd2'
  headingFont: Source Sans Pro
  bodyFont: Source Sans Pro
  sampleHeading: Solarized Light
  sampleText: Precision colors designed for optimal readability and reduced eye strain.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-yellow-900
  h2: text-2xl font-bold mb-4 text-yellow-900
  h3: text-xl font-semibold mb-3 text-yellow-800
  h4: text-lg font-semibold mb-3 text-yellow-800
  h5: text-base font-semibold mb-2 text-yellow-800
  h6: text-sm font-semibold mb-2 text-yellow-800
  p: mb-3 text-base leading-relaxed
  a: text-blue-600 hover:text-blue-500 hover:underline
  img: max-w-full my-4 rounded
  table: table-auto my-4 w-full
  strong: font-bold text-yellow-900
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic text-yellow-700
  tr: border border-yellow-200 even:bg-yellow-50 odd:bg-yellow-100
  td: border border-yellow-200 p-2
  th: border border-yellow-200 p-2 bg-yellow-200 font-semibold text-yellow-900
  blockquote: border-l-4 border-blue-400 pl-4 italic my-4 text-yellow-700 bg-yellow-50 py-2 rounded-r
  code: bg-yellow-100 px-1.5 py-0.5 rounded font-mono text-sm text-red-600
  pre: bg-yellow-100 p-4 rounded overflow-x-auto border border-yellow-200
  body: p-6
  article: prose max-w-none
---

# Solarized Theme

A carefully crafted color scheme built for readability and precision.

## About Solarized

Solarized is a sixteen-color palette designed by Ethan Schoonover for use with **terminal** and **GUI** applications. It offers carefully chosen colors with precise CIELAB lightness relationships.

### Design Principles

1. Selective contrast reduction
2. Balanced warm/cool tones
3. Dual-mode support (light and dark)
4. Precise color relationships

> "Solarized reduces brightness contrast but retains contrasting hues for syntax highlighting."
> — Ethan Schoonover

## Color Palette

| Color  | Hex       | Role           |
| ------ | --------- | -------------- |
| Base03 | `#002b36` | Dark bg        |
| Base3  | `#fdf6e3` | Light bg       |
| Yellow | `#b58900` | Warning/accent |
| Blue   | `#268bd2` | Links/info     |
| Cyan   | `#2aa198` | Constants      |

## Code Example

```javascript
const solarized = {
  base03: '#002b36',
  base3: '#fdf6e3',
  yellow: '#b58900',
  orange: '#cb4b16',
  red: '#dc322f',
  magenta: '#d33682',
  violet: '#6c71c4',
  blue: '#268bd2',
  cyan: '#2aa198',
  green: '#859900',
}
```

### Resources

- [Solarized Homepage](https://ethanschoonover.com/solarized/)
- [GitHub Repository](https://github.com/altercation/solarized)
- Available for _every major editor_

![Solarized palette](https://picsum.photos/600/300?random=20)

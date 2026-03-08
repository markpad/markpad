---
id: gruvbox
name: Gruvbox
description: Retro groove color scheme with warm earthy tones.
category: serif
fontFamily: Merriweather

preview:
  bgColor: '#282828'
  textColor: '#ebdbb2'
  accentColor: '#fe8019'
  headingFont: Merriweather
  bodyFont: Merriweather
  sampleHeading: Gruvbox
  sampleText: Retro groove with warm earthy tones and vintage aesthetics.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-orange-400
  h2: text-2xl font-bold mb-4 text-orange-300
  h3: text-xl font-semibold mb-3 text-yellow-400
  h4: text-lg font-semibold mb-3 text-yellow-300
  h5: text-base font-semibold mb-2 text-yellow-300
  h6: text-sm font-semibold mb-2 text-yellow-300
  p: mb-3 text-base leading-relaxed
  a: text-blue-400 hover:text-blue-300 hover:underline
  img: max-w-full my-4 rounded border border-yellow-800
  table: table-auto my-4 w-full
  strong: font-bold text-yellow-200
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic text-green-400
  tr: border border-yellow-900 even:bg-yellow-900 odd:bg-gray-800
  td: border border-yellow-900 p-2
  th: border border-yellow-900 p-2 bg-yellow-900 font-semibold text-orange-300
  blockquote: border-l-4 border-orange-500 pl-4 italic my-4 text-yellow-200 bg-gray-800 py-2 rounded-r
  code: bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400
  pre: bg-gray-800 p-4 rounded overflow-x-auto border border-yellow-900
  body: bg-gray-900 p-6 text-yellow-100
  article: prose prose-invert max-w-none
---

# Gruvbox Theme

A retro groove color scheme that feels like a warm autumn evening.

## Origin

Gruvbox was designed by **morhetz** as a Vim color scheme. Its warm, retro palette has since been adopted across editors, terminals, and web applications.

### Design Goals

1. Warm, desaturated colors
2. High readability in any lighting
3. Retro developer aesthetic
4. Clear distinction between syntax groups

> "Designed for long coding sessions — warm tones, easy eyes."

## Color Palette

| Color  | Hex       | Role       |
| ------ | --------- | ---------- |
| Dark0  | `#282828` | Background |
| Light0 | `#fbf1c7` | Foreground |
| Red    | `#cc241d` | Errors     |
| Green  | `#98971a` | Strings    |
| Yellow | `#d79921` | Types      |
| Orange | `#fe8019` | Constants  |

## Code Example

```javascript
const gruvbox = {
  dark: {
    bg: '#282828',
    fg: '#ebdbb2',
    red: '#cc241d',
    green: '#98971a',
    yellow: '#d79921',
    blue: '#458588',
    purple: '#b16286',
    aqua: '#689d6a',
    orange: '#d65d0e',
  },
}
```

### Resources

- [Gruvbox for Vim](https://github.com/morhetz/gruvbox)
- Community ports for _VS Code, IntelliJ, Alacritty_
- Pairs beautifully with serif fonts

![Warm tones](https://picsum.photos/600/300?random=23)

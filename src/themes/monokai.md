---
id: monokai
name: Monokai
description: Classic dark theme inspired by the iconic editor color scheme.
category: monospace
fontFamily: Ubuntu

preview:
  bgColor: '#272822'
  textColor: '#f8f8f2'
  accentColor: '#f92672'
  headingFont: Ubuntu
  bodyFont: Ubuntu
  sampleHeading: Monokai
  sampleText: The iconic color scheme that defined a generation of coding.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-pink-400
  h2: text-2xl font-bold mb-4 text-pink-400
  h3: text-xl font-semibold mb-3 text-yellow-300
  h4: text-lg font-semibold mb-3 text-yellow-300
  h5: text-base font-semibold mb-2 text-yellow-300
  h6: text-sm font-semibold mb-2 text-yellow-300
  p: mb-3 text-base leading-relaxed
  a: text-blue-400 hover:text-blue-300 hover:underline
  img: max-w-full my-4 rounded-lg
  table: table-auto my-4 w-full
  strong: font-bold text-orange-300
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1
  em: italic text-purple-300
  tr: border border-gray-700 even:bg-gray-800 odd:bg-gray-900
  td: border border-gray-700 p-2
  th: border border-gray-700 p-2 bg-gray-800 font-semibold text-pink-400
  blockquote: border-l-4 border-pink-500 pl-4 italic my-4 text-gray-400 bg-gray-800 py-2 rounded-r
  code: bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400
  pre: bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700
  body: bg-gray-900 p-6 text-gray-100
  article: prose prose-invert max-w-none
---

# Monokai Theme

The color scheme that shaped modern code editing.

## History

Monokai was created by **Wimer Hazenberg** in 2006. It quickly became the default theme for Sublime Text and one of the most popular themes across all code editors.

### Why Developers Love It

1. Vibrant colors on a dark canvas
2. Excellent syntax differentiation
3. Comfortable for extended sessions
4. Instantly recognizable aesthetic

> "If you've ever coded, you've probably used Monokai."

## Signature Colors

| Color  | Hex       | Used For   |
| ------ | --------- | ---------- |
| Pink   | `#f92672` | Keywords   |
| Green  | `#a6e22e` | Strings    |
| Yellow | `#e6db74` | Classes    |
| Orange | `#fd971f` | Parameters |
| Purple | `#ae81ff` | Numbers    |
| Blue   | `#66d9ef` | Built-ins  |

## Code Example

```javascript
class MonokaiTheme {
  constructor() {
    this.name = 'Monokai'
    this.type = 'dark'
    this.colors = {
      background: '#272822',
      foreground: '#f8f8f2',
    }
  }

  apply(editor) {
    return editor.setTheme(this)
  }
}
```

### Ecosystem

- Sublime Text default
- Available for _VS Code, Vim, Emacs, IntelliJ_
- Inspired dozens of derivative themes

![Code editor](https://picsum.photos/600/300?random=24)

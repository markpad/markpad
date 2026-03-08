---
id: developer-console
name: Developer Console
description: Monospaced font stack designed for technical documentation.
category: monospace
fontFamily: Fira Sans

preview:
  bgColor: '#030712'
  textColor: '#86efac'
  accentColor: '#22d3ee'
  headingFont: monospace
  bodyFont: monospace
  sampleHeading: '.markdown { @apply font-mono; }'
  sampleText: Monospaced font stack designed for technical documentation.
  style: mono

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-2xl font-bold mb-4 text-green-400 font-mono
  h2: text-xl font-bold mb-3 text-green-400 font-mono
  h3: text-lg font-bold mb-3 text-green-300 font-mono
  h4: text-base font-bold mb-2 text-green-300 font-mono
  h5: text-sm font-bold mb-2 text-green-300 font-mono
  h6: text-xs font-bold mb-2 text-green-300 font-mono
  p: mb-2 text-sm text-green-100 font-mono leading-relaxed
  a: text-cyan-400 hover:text-cyan-300 underline font-mono
  img: max-w-full my-4 border border-green-800
  table: table-auto my-4 w-full font-mono
  strong: font-bold text-green-300
  ul: list-disc list-inside font-mono
  ol: list-decimal list-inside font-mono
  li: mb-1 text-green-100 text-sm
  em: italic text-green-300
  tr: border border-green-900 even:bg-gray-900 odd:bg-gray-950
  td: border border-green-900 p-2 text-sm font-mono
  th: border border-green-900 p-2 bg-gray-900 font-mono text-green-400
  blockquote: border-l-4 border-green-600 pl-4 italic my-4 text-green-300 bg-gray-900 py-2 font-mono
  code: bg-gray-900 px-1.5 py-0.5 rounded font-mono text-sm text-green-400
  pre: bg-black p-4 rounded overflow-x-auto border border-green-900
  body: bg-gray-950 p-6 text-green-200
  article: prose prose-invert max-w-none font-mono
---

# SYSTEM.LOG

> Initializing developer console theme...

## $ whoami

A terminal-inspired theme for developers who live in the command line.

### PROCESS.ENV

```bash
export THEME="developer-console"
export FONT="monospace"
export COLOR_PRIMARY="#86efac"
export COLOR_ACCENT="#22d3ee"
```

## FEATURES.md

- `font-mono` applied globally
- Terminal green color scheme
- High contrast for readability
- Code-first design philosophy

> "There is no place like 127.0.0.1"

## STATUS TABLE

| SERVICE  | PORT | STATUS  |
| -------- | ---- | ------- |
| nginx    | 80   | RUNNING |
| postgres | 5432 | RUNNING |
| redis    | 6379 | RUNNING |
| app      | 3000 | RUNNING |

### SAMPLE.js

```javascript
const developer = {
  name: 'Console Developer',
  theme: 'dark',
  editor: 'vim',
  coffee: true,

  code: function () {
    while (this.coffee) {
      this.write()
    }
  },
}
```

## LINKS.txt

1. [GitHub](https://github.com)
2. [Stack Overflow](https://stackoverflow.com)
3. [Dev.to](https://dev.to)

![Terminal](https://picsum.photos/600/300?random=4)

```
[SUCCESS] Theme loaded successfully
[INFO] Ready for input...
█
```

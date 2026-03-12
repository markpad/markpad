---
id: oceanic-night
name: Oceanic Night
description: Deep ocean blues with cyan accents - adapts to light and dark modes.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#0f172a'
  textColor: '#cbd5e1'
  accentColor: '#06b6d4'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: Oceanic Night
  sampleText: Dive deep into the digital ocean with adaptive dark mode support.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-slate-800 dark:text-cyan-400
  h2: text-2xl font-bold mb-4 text-slate-700 dark:text-cyan-400
  h3: text-xl font-bold mb-3 text-slate-700 dark:text-cyan-300
  h4: text-lg font-bold mb-3 text-slate-600 dark:text-cyan-300
  h5: text-base font-bold mb-2 text-slate-600 dark:text-cyan-300
  h6: text-sm font-bold mb-2 text-slate-600 dark:text-cyan-300
  p: mb-3 text-base text-slate-700 dark:text-slate-300 leading-relaxed
  a: text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 underline decoration-cyan-500/30 hover:decoration-cyan-500
  img: max-w-full my-4 rounded-xl shadow-lg
  table: table-auto my-4 w-full border-collapse
  strong: font-bold text-slate-900 dark:text-white
  ul: list-disc list-inside space-y-1 my-3
  ol: list-decimal list-inside space-y-1 my-3
  li: text-slate-700 dark:text-slate-300
  em: italic text-slate-600 dark:text-slate-400
  tr: border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50
  td: border border-slate-300 dark:border-slate-600 p-3 text-slate-700 dark:text-slate-300
  th: border border-slate-300 dark:border-slate-600 p-3 bg-slate-100 dark:bg-slate-800 font-semibold text-slate-800 dark:text-cyan-400
  blockquote: border-l-4 border-cyan-500 dark:border-cyan-400 pl-4 italic my-4 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-3 pr-4 rounded-r
  code: bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-sm text-cyan-700 dark:text-cyan-400
  pre: bg-slate-100 dark:bg-slate-900 p-4 rounded-lg overflow-x-auto border border-slate-200 dark:border-slate-700 my-4
  body: bg-white dark:bg-slate-900 p-8 text-slate-700 dark:text-slate-300
  article: prose dark:prose-invert max-w-none prose-slate
---

# Oceanic Night

A theme inspired by the deep ocean, seamlessly transitioning between light and dark modes. Perfect for long reading sessions at any time of day.

## Features

- **Adaptive Design**: Automatically adjusts to your system's light/dark mode preference
- **Ocean-Inspired Colors**: Calming blues and cyans that reduce eye strain
- **High Contrast**: Ensures readability in both modes

### Why Choose Oceanic Night?

This theme brings the serenity of the ocean to your documentation. Whether you're working during the day or burning the midnight oil, the adaptive color scheme keeps your content looking professional and easy on the eyes.

```javascript
// Code looks great in both modes
const theme = {
  name: 'Oceanic Night',
  mode: 'adaptive',
  primary: 'cyan',
}
```

> The ocean stirs the heart, inspires the imagination and brings eternal joy to the soul. — Wyland

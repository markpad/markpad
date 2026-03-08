---
id: dark-mode-pro
name: Dark Mode Pro
description: Deep greens and vibrant emerald highlights for high contrast.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#111827'
  textColor: '#d1d5db'
  accentColor: '#34d399'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: Dark Mode Pro
  sampleText: Terminal aesthetics meet high-end editorial design.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-emerald-400
  h2: text-2xl font-bold mb-4 text-emerald-400
  h3: text-xl font-bold mb-3 text-emerald-300
  h4: text-lg font-bold mb-3 text-emerald-300
  h5: text-base font-bold mb-2 text-emerald-300
  h6: text-sm font-bold mb-2 text-emerald-300
  p: mb-2 text-base text-gray-300 leading-relaxed
  a: text-emerald-400 hover:text-emerald-300 hover:underline
  img: max-w-full my-4 rounded-lg
  table: table-auto my-4 w-full
  strong: font-bold text-white
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-gray-300
  em: italic text-gray-400
  tr: border border-gray-700 even:bg-gray-800 odd:bg-gray-900
  td: border border-gray-700 p-2
  th: border border-gray-700 p-2 bg-gray-800 font-semibold text-emerald-400
  blockquote: border-l-4 border-emerald-500 pl-4 italic my-4 text-gray-400 bg-gray-800 py-2 rounded-r
  code: bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-emerald-400
  pre: bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700
  body: bg-gray-900 p-6 text-gray-200
  article: prose prose-invert max-w-none
---

# Dark Mode Pro

Building interfaces that respect your eyes and your preferences.

## Why Dark Mode?

Dark themes have become essential in modern software development. They reduce **eye strain**, save battery on OLED displays, and provide a focused environment for deep work.

### Benefits

1. Reduced eye fatigue during long sessions
2. Better contrast for code readability
3. Lower power consumption
4. Professional aesthetic

> "The night is dark and full of code."  
> — Every developer at 2 AM

## Code Examples

Here's a sample configuration:

```javascript
const config = {
  theme: 'dark',
  accent: 'emerald',
  contrast: 'high',
  animation: true,
}

export default config
```

### Quick Reference

| Setting    | Value     | Description       |
| ---------- | --------- | ----------------- |
| Background | `#111827` | Deep gray base    |
| Text       | `#d1d5db` | Soft white        |
| Accent     | `#34d399` | Emerald highlight |

## Getting Started

- Install the theme package
- Configure your preferences
- Enable system sync
- Enjoy the dark side

Check our [documentation](https://example.com) for more details.

![Dark interface](https://picsum.photos/600/300?grayscale)

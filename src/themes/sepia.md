---
id: sepia
name: Sepia
description: Warm sepia tones for comfortable extended reading sessions.
category: accessibility
fontFamily: Merriweather

preview:
  bgColor: '#f4ecd8'
  textColor: '#433422'
  accentColor: '#8b5e3c'
  headingFont: Merriweather
  bodyFont: Merriweather
  sampleHeading: Sepia Reader
  sampleText: Warm sepia tones for a gentle, book-like reading experience.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: false

classes:
  h1: text-3xl font-bold mb-4 text-yellow-900 leading-tight
  h2: text-2xl font-bold mb-4 text-yellow-900
  h3: text-xl font-semibold mb-3 text-yellow-800
  h4: text-lg font-semibold mb-3 text-yellow-800
  h5: text-base font-semibold mb-2 text-yellow-700
  h6: text-sm font-semibold mb-2 text-yellow-700
  p: mb-4 text-base text-yellow-900 leading-8
  a: text-amber-700 hover:text-amber-900 underline underline-offset-2
  img: max-w-full my-4 rounded border border-yellow-300
  table: table-auto my-4 w-full
  strong: font-bold text-yellow-950
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-2 text-yellow-900 leading-8
  em: italic text-yellow-800
  tr: border border-yellow-300 even:bg-yellow-100 odd:bg-yellow-50
  td: border border-yellow-300 p-2
  th: border border-yellow-300 p-2 bg-yellow-200 font-semibold text-yellow-900
  blockquote: border-l-4 border-amber-600 pl-4 italic my-4 text-yellow-800 bg-yellow-100 py-2 rounded-r
  code: bg-yellow-200 px-1.5 py-0.5 rounded font-mono text-sm text-yellow-900
  pre: bg-yellow-100 p-4 rounded overflow-x-auto border border-yellow-300
  body: p-8 text-yellow-900
  article: prose max-w-none
---

# The Joy of Reading

Settle in with a warm cup of tea and a gentle reading experience.

## A Book-Like Experience

The **Sepia** theme recreates the warm, familiar feeling of reading a printed book. The muted background and warm tones reduce eye strain during extended reading sessions.

### Design Inspiration

1. Aged parchment warmth
2. Kindle-like reading comfort
3. Sunset-hour color temperature
4. Optimized for long-form content

> "A reader lives a thousand lives before he dies. The man who never reads lives only one."
> — George R.R. Martin

## Reading Benefits

| Feature          | Benefit                    |
| ---------------- | -------------------------- |
| Warm background  | Reduces blue light fatigue |
| Serif fonts      | Guides the eye naturally   |
| Generous leading | Prevents line-skipping     |
| Muted contrast   | Comfortable for hours      |

## Typography Settings

```css
.sepia-reader {
  background-color: #f4ecd8;
  color: #433422;
  font-family: 'Merriweather', Georgia, serif;
  font-size: 1.0625rem;
  line-height: 2;
  max-width: 65ch;
}
```

### Recommended Reading

- [On Typography](https://example.com)
- [The Elements of Typographic Style](https://example.com)
- _Night mode alternatives_ for late-night reading

![Old books](https://picsum.photos/600/300?random=33)

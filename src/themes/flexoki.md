---
id: flexoki
name: Flexoki
description: Warm analog color scheme inspired by paper, ink, and the tactile nature of writing.
category: serif
fontFamily: Merriweather

preview:
  bgColor: '#fffcf0'
  textColor: '#100f0f'
  accentColor: '#d14d41'
  headingFont: Merriweather
  bodyFont: Merriweather
  sampleHeading: Flexoki Theme
  sampleText: Inspired by the warmth of paper and the flow of ink.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: false

classes:
  h1: text-3xl font-bold mb-6 leading-tight
  h2: text-2xl font-bold mb-4
  h3: text-xl font-semibold mb-3
  h4: text-lg font-semibold mb-3
  h5: text-base font-semibold mb-2
  h6: text-sm font-semibold mb-2
  p: mb-4 text-base leading-7
  a: underline decoration-2 underline-offset-2 hover:opacity-80 transition-opacity
  img: max-w-full my-4 rounded
  table: table-auto my-4 w-full
  strong: font-bold
  ul: list-disc list-outside ml-6
  ol: list-decimal list-outside ml-6
  li: mb-2 leading-7
  em: italic
  tr: border-b
  td: p-3
  th: p-3 font-semibold text-left border-b-2
  blockquote: border-l-4 pl-4 italic my-4 py-2
  code: px-1.5 py-0.5 rounded font-mono text-sm
  pre: p-4 rounded overflow-x-auto font-mono text-sm
  body: bg-[#fffcf0] text-[#100f0f] p-8
  article: prose max-w-none prose-headings:text-[#100f0f] prose-p:text-[#100f0f] prose-a:text-[#d14d41] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#100f0f] prose-code:text-[#af3029] prose-code:bg-[#f2f0e5] prose-pre:bg-[#f2f0e5] prose-pre:text-[#100f0f] prose-blockquote:border-[#d14d41] prose-blockquote:text-[#282726] prose-th:text-[#100f0f] prose-td:text-[#282726] prose-li:text-[#282726]
---

# Flexoki

A warm, analog color scheme that brings the tactile joy of paper and ink to your digital writing.

## Philosophy

Flexoki is inspired by the **analog materials** we use for thinking and writing:

- Paper in various shades
- Inks and markers in muted tones
- The warm glow of incandescent light
- Natural materials and textures

## Color Palette

The palette uses **warm tones** throughout, creating a cohesive and comfortable reading experience:

- **Base**: Cream and warm grays
- **Text**: Deep charcoal black
- **Red**: `#D14D41` for emphasis and links
- **Orange**: `#DA702C` for highlights
- **Yellow**: `#D0A215` for attention
- **Green**: `#879A39` for success
- **Cyan**: `#3AA99F` for info
- **Blue**: `#4385BE` for calm
- **Purple**: `#8B7EC8` for creativity
- **Magenta**: `#CE5D97` for energy

## Typography

```javascript
const flexoki = {
  paper: '#fffcf0',
  text: '#100f0f',
  text2: '#282726',
  red: '#d14d41',
  orange: '#da702c',
  yellow: '#d0a215',
  green: '#879a39',
}
```

### Features

1. Warm, paper-like background
2. High contrast for readability
3. Muted accent colors inspired by ink
4. Comfortable for long reading sessions

> "The best digital tools should feel as natural as pen and paper."

## Design Principles

| Principle    | Description                          |
| ------------ | ------------------------------------ |
| **Warmth**   | All colors lean toward warm tones    |
| **Contrast** | Text maintains excellent readability |
| **Analog**   | Inspired by physical materials       |
| **Comfort**  | Designed for extended use            |

### Code Example

```css
.flexoki-theme {
  background: #fffcf0;
  color: #100f0f;
  accent-color: #d14d41;
}

/* Warm, analog aesthetic */
.prose {
  font-family: serif;
  line-height: 1.75;
}
```

## Links & Resources

- [Official Flexoki Repository](https://github.com/kepano/flexoki)
- Designed by _Stephan Ango_
- Open source color scheme

![Analog writing materials](https://picsum.photos/600/300?random=27)

---

_Experience the warmth of analog in your digital workflow._

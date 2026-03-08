---
id: material-design
name: Material Design
description: Clean, modern theme following Google Material Design guidelines.
category: sans-serif
fontFamily: Roboto

preview:
  bgColor: '#fafafa'
  textColor: '#212121'
  accentColor: '#1976d2'
  headingFont: Roboto
  bodyFont: Roboto
  sampleHeading: Material Design
  sampleText: Bold, graphic, and intentional — design with purpose.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-medium mb-4 text-gray-900
  h2: text-2xl font-medium mb-4 text-gray-900
  h3: text-xl font-medium mb-3 text-gray-800
  h4: text-lg font-medium mb-3 text-gray-800
  h5: text-base font-medium mb-2 text-gray-800
  h6: text-sm font-medium mb-2 text-gray-700
  p: mb-3 text-base text-gray-700 leading-relaxed
  a: text-blue-700 hover:text-blue-900 hover:underline
  img: max-w-full my-4 rounded-lg
  table: table-auto my-4 w-full
  strong: font-medium text-gray-900
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-gray-700
  em: italic
  tr: border border-gray-200 even:bg-gray-50 odd:bg-white
  td: border border-gray-200 p-3
  th: border border-gray-200 p-3 bg-blue-50 font-medium text-blue-900
  blockquote: border-l-4 border-blue-500 pl-4 my-4 text-gray-600 bg-blue-50 py-2 rounded-r
  code: bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-pink-600
  pre: bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200
  body: bg-white p-6 text-gray-800
  article: prose max-w-none
---

# Material Design

Bold, graphic, and intentional — design guided by print design principles.

## Core Principles

Material Design is a design system created by **Google** to help teams build high-quality digital experiences. It emphasizes a tactile, physical feeling.

### Foundations

1. Material as a metaphor
2. Bold, graphic, intentional
3. Motion provides meaning
4. Adaptive design across devices

> "Good design is good business. Material Design brings consistency and delight to every user interaction."

## Typography Scale

| Level    | Size | Weight | Usage          |
| -------- | ---- | ------ | -------------- |
| Headline | 24sp | 400    | Page titles    |
| Title    | 20sp | 500    | Section heads  |
| Body 1   | 16sp | 400    | Primary text   |
| Body 2   | 14sp | 400    | Secondary text |
| Caption  | 12sp | 400    | Labels         |

## Components

```javascript
const MaterialButton = {
  elevation: 2,
  borderRadius: 4,
  padding: '8px 16px',
  textTransform: 'uppercase',
  fontWeight: 500,
  letterSpacing: '0.0892857em',
  transition: 'box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)',
}
```

### Resources

- [Material Design Guidelines](https://m3.material.io)
- [Material Components](https://github.com/material-components)
- Open-source and _free_ to use

![Material Design](https://picsum.photos/600/300?random=25)

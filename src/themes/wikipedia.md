---
id: wikipedia
name: Wikipedia
description: Encyclopedic style inspired by Wikipedia articles.
category: serif
fontFamily: PT Sans

preview:
  bgColor: '#ffffff'
  textColor: '#202122'
  accentColor: '#3366cc'
  headingFont: PT Sans
  bodyFont: PT Sans
  sampleHeading: Wikipedia
  sampleText: Encyclopedic knowledge in a familiar, trusted format.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: false

classes:
  h1: text-3xl font-normal mb-4 text-gray-900 border-b border-gray-300 pb-1
  h2: text-2xl font-normal mb-3 text-gray-900 border-b border-gray-300 pb-1
  h3: text-xl font-bold mb-3 text-gray-900
  h4: text-lg font-bold mb-2 text-gray-900
  h5: text-base font-bold mb-2 text-gray-800
  h6: text-sm font-bold mb-2 text-gray-700
  p: mb-3 text-base text-gray-800 leading-7
  a: text-blue-700 hover:underline
  img: max-w-full my-4 border border-gray-300 p-1 bg-gray-50
  table: table-auto my-4 w-full text-sm
  strong: font-bold
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-gray-800 leading-7
  em: italic
  tr: border border-gray-300 even:bg-blue-50 odd:bg-white
  td: border border-gray-300 p-2
  th: border border-gray-300 p-2 bg-blue-100 font-bold text-gray-900 text-left
  blockquote: border-l-4 border-blue-400 pl-4 my-4 text-gray-700 bg-blue-50 py-2 rounded-r italic
  code: bg-gray-100 px-1 py-0.5 rounded font-mono text-sm text-gray-800 border border-gray-200
  pre: bg-gray-50 p-4 rounded overflow-x-auto border border-gray-200
  body: bg-white p-6 text-gray-800
  article: prose max-w-none
---

# Markdown (formatting language)

**Markdown** is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is easy to read in its source code form.

## History

Markdown was inspired by pre-existing conventions for marking up **plain text** in email and Usenet posts, such as the earlier markup languages setext and Textile.

### Development Timeline

1. 2004 — John Gruber publishes first Markdown specification
2. 2012 — CommonMark standardization effort begins
3. 2014 — GitHub Flavored Markdown (GFM) formalized
4. 2017 — CommonMark specification reaches 0.28

> "The overriding design goal for Markdown's formatting syntax is to make it as readable as possible."
> — John Gruber

## Syntax Overview

| Element | Markdown Syntax | HTML Output                 |
| ------- | --------------- | --------------------------- |
| Heading | `# Heading`     | `<h1>Heading</h1>`          |
| Bold    | `**bold**`      | `<strong>bold</strong>`     |
| Italic  | `*italic*`      | `<em>italic</em>`           |
| Link    | `[text](url)`   | `<a href="url">text</a>`    |
| Image   | `![alt](url)`   | `<img src="url" alt="alt">` |
| Code    | `` `code` ``    | `<code>code</code>`         |

## Implementations

```javascript
// Example: Simple Markdown to HTML converter
function parseMarkdown(text) {
  return text
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
}
```

### See Also

- [CommonMark Specification](https://commonmark.org)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)
- _reStructuredText_, another popular markup language

![Wikipedia logo](https://picsum.photos/600/300?random=35)

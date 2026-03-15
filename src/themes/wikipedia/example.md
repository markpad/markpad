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
---
id: high-contrast
name: High Contrast
description: Maximum readability with strong contrast ratios and clear hierarchy.
category: accessibility
fontFamily: Open Sans

preview:
  bgColor: '#ffffff'
  textColor: '#000000'
  accentColor: '#1e40af'
  headingFont: Open Sans
  bodyFont: Open Sans
  sampleHeading: High Contrast
  sampleText: Maximum readability with strong contrast ratios and large text.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-4xl font-extrabold mb-6 text-black
  h2: text-3xl font-extrabold mb-4 text-black
  h3: text-2xl font-bold mb-3 text-black
  h4: text-xl font-bold mb-3 text-black
  h5: text-lg font-bold mb-2 text-black
  h6: text-base font-bold mb-2 text-black
  p: mb-3 text-lg text-black leading-loose
  a: text-blue-800 hover:text-blue-600 underline decoration-2 font-semibold
  img: max-w-full my-4
  table: table-auto my-4 w-full
  strong: font-extrabold text-black
  ul: list-disc list-outside ml-8 text-lg
  ol: list-decimal list-outside ml-8 text-lg
  li: mb-2 text-black
  em: italic font-semibold
  tr: border-2 border-black
  td: border-2 border-black p-3 text-lg
  th: border-2 border-black p-3 bg-black text-white font-bold text-lg
  blockquote: border-l-8 border-black pl-6 italic my-6 text-black bg-gray-100 py-4
  code: bg-gray-200 px-2 py-1 rounded font-mono text-base text-black border border-gray-400
  pre: bg-gray-100 p-6 rounded overflow-x-auto border-2 border-black
  body: bg-white p-6
  article: prose prose-slate max-w-none
---

# Accessibility First

**Designing for everyone, without compromise.**

## Why Accessibility Matters

One billion people worldwide live with some form of disability. Good design should work for **everyone**, regardless of ability.

### WCAG Guidelines

This theme follows Web Content Accessibility Guidelines (WCAG) 2.1 AA standards:

- **Contrast ratio**: 7:1 minimum
- **Font size**: 18px base
- **Clear hierarchy**: Bold headings
- **Readable fonts**: Sans-serif

> "The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect."  
> — Tim Berners-Lee

## Key Features

| Feature      | Standard | This Theme |
| ------------ | -------- | ---------- |
| Contrast     | 4.5:1    | 7:1+       |
| Min Font     | 16px     | 18px       |
| Line Height  | 1.5      | 1.75       |
| Focus States | Required | Enhanced   |

### Benefits

1. **Better for low vision users**
2. **Improved readability in bright light**
3. **Reduces eye strain for everyone**
4. **Works without color perception**

## Code Example

```css
.high-contrast {
  color: #000000;
  background: #ffffff;
  font-size: 1.125rem;
  line-height: 1.75;
}
```

## Resources

- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [A11y Project](https://www.a11yproject.com/)
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)

![Inclusive design](https://picsum.photos/600/300?random=6)

**Remember: Accessibility is not a feature, it's a requirement.**

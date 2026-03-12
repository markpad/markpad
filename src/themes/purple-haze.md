---
id: purple-haze
name: Purple Haze
description: Vibrant purples and magentas with adaptive dark mode support for a modern, creative look.
category: sans-serif
fontFamily: Poppins

preview:
  bgColor: '#1e1b4b'
  textColor: '#e9d5ff'
  accentColor: '#a855f7'
  headingFont: Poppins
  bodyFont: Poppins
  sampleHeading: Purple Haze
  sampleText: Bold, creative, and modern with seamless light and dark mode transitions.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-4xl font-bold mb-4 text-purple-700 dark:text-purple-400 tracking-tight
  h2: text-3xl font-bold mb-4 text-purple-600 dark:text-purple-400
  h3: text-2xl font-bold mb-3 text-purple-600 dark:text-fuchsia-400
  h4: text-xl font-bold mb-3 text-purple-500 dark:text-fuchsia-400
  h5: text-lg font-bold mb-2 text-purple-500 dark:text-fuchsia-300
  h6: text-base font-bold mb-2 text-purple-500 dark:text-fuchsia-300
  p: mb-3 text-base text-gray-700 dark:text-purple-100 leading-relaxed
  a: text-purple-600 dark:text-fuchsia-400 hover:text-purple-700 dark:hover:text-fuchsia-300 underline underline-offset-4 decoration-purple-400/50 hover:decoration-purple-600
  img: max-w-full my-4 rounded-2xl shadow-2xl shadow-purple-500/20 dark:shadow-purple-500/40
  table: table-auto my-4 w-full border-collapse
  strong: font-bold text-purple-800 dark:text-fuchsia-300
  ul: list-disc list-inside space-y-2 my-3
  ol: list-decimal list-inside space-y-2 my-3
  li: text-gray-700 dark:text-purple-200
  em: italic text-purple-600 dark:text-fuchsia-300
  tr: border-b border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-colors
  td: border border-purple-300 dark:border-purple-700 p-3 text-gray-700 dark:text-purple-100
  th: border border-purple-300 dark:border-purple-700 p-3 bg-purple-100 dark:bg-purple-900 font-bold text-purple-800 dark:text-purple-300
  blockquote: border-l-4 border-fuchsia-500 dark:border-fuchsia-400 pl-4 italic my-4 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/40 py-3 pr-4 rounded-r
  code: bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded font-mono text-sm text-purple-700 dark:text-fuchsia-400 border border-purple-200 dark:border-purple-700
  pre: bg-purple-50 dark:bg-indigo-950 p-4 rounded-xl overflow-x-auto border border-purple-200 dark:border-purple-800 my-4 shadow-inner
  body: bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-indigo-950 dark:to-purple-950 p-8 text-gray-700 dark:text-purple-100
  article: prose dark:prose-invert max-w-none prose-purple
---

# Purple Haze

A bold, creative theme that embraces the energy of purple and magenta. Perfect for designers, artists, and anyone who wants their content to stand out.

## Why Purple?

Purple represents creativity, wisdom, and imagination. It's the color of innovation and unconventional thinking—perfect for content that breaks the mold.

### Design Features

- **Gradient Backgrounds**: Subtle gradients add depth without distraction
- **High Impact**: Bold colors ensure your headings grab attention
- **Adaptive**: Seamlessly transitions between light and dark modes
- **Modern Typography**: Poppins font family for a clean, contemporary look

### Perfect Use Cases

1. **Creative Portfolios**: Showcase your work with style
2. **Design Documentation**: Match the aesthetic of modern design systems
3. **Tech Startups**: Bold branding for bold ideas
4. **Marketing Content**: Stand out from the traditional blue schemes

### Code Example

```typescript
interface Theme {
  name: 'Purple Haze'
  colors: {
    primary: 'purple'
    accent: 'fuchsia'
  }
  modes: ['light', 'dark']
}

const applyTheme = (theme: Theme) => {
  console.log('Applying ' + theme.name)
  // Magic happens here ✨
}
```

> Creativity is intelligence having fun. — Albert Einstein

**Note**: This theme uses dynamic color classes that automatically adjust based on your system preferences. The vibrant purples remain eye-catching in both modes while maintaining excellent readability.

---

### Tips for Best Results

- Pair with high-quality imagery for maximum impact
- Use the gradient backgrounds to create visual hierarchy
- Let the bold headings guide your reader's attention
- Combine with white space for a clean, modern layout

// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// Generated from src/themes/*.md files
// Run 'npm run generate:themes' to regenerate

import type { TailwindClasses, BehaviorConfig, FontConfig } from '../types'

export interface ThemePreset {
  id: string
  name: string
  description: string
  category: ThemeCategory
  fontFamily: string
  tailwindClasses: TailwindClasses
  behaviorConfig: BehaviorConfig
  fontConfig: FontConfig
  preview: ThemePreview
  exampleContent: string
}

export interface ThemePreview {
  bgColor: string
  textColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  sampleHeading: string
  sampleText: string
  style?: 'serif' | 'sans' | 'mono' | 'brutalist' | 'minimal' | 'default'
}

export type ThemeCategory =
  | 'all'
  | 'serif'
  | 'sans-serif'
  | 'monospace'
  | 'accessibility'
  | 'experimental'

export const THEME_CATEGORIES: { value: ThemeCategory; label: string }[] = [
  { value: 'all', label: 'All Themes' },
  { value: 'serif', label: 'Serif' },
  { value: 'sans-serif', label: 'Sans-Serif' },
  { value: 'monospace', label: 'Monospace' },
  { value: 'accessibility', label: 'Accessibility' },
  { value: 'experimental', label: 'Experimental' },
]

export const themePresets: ThemePreset[] = [
  {
    "id": "academic-paper",
    "name": "Academic Paper",
    "description": "Traditional academic formatting with proper hierarchy and citations.",
    "category": "serif",
    "fontFamily": "Merriweather",
    "tailwindClasses": {
      "h1": "text-2xl font-bold mb-6 text-gray-900 text-center",
      "h2": "text-xl font-bold mb-4 text-gray-900 border-b border-gray-300 pb-2",
      "h3": "text-lg font-semibold mb-3 text-gray-800 italic",
      "h4": "text-base font-semibold mb-3 text-gray-800",
      "h5": "text-sm font-semibold mb-2 text-gray-700",
      "h6": "text-xs font-semibold mb-2 text-gray-600",
      "p": "mb-4 text-base text-gray-800 leading-loose indent-8 text-justify",
      "a": "text-blue-800 hover:text-blue-600 underline",
      "img": "max-w-full my-6 mx-auto",
      "table": "table-auto my-6 w-full",
      "strong": "font-bold",
      "ul": "list-disc list-outside ml-8",
      "ol": "list-decimal list-outside ml-8",
      "li": "mb-2 text-gray-800 leading-relaxed",
      "em": "italic",
      "tr": "border-b border-gray-300",
      "td": "p-2 text-sm",
      "th": "p-2 text-sm font-bold border-b-2 border-gray-400 text-left",
      "blockquote": "border-l-2 border-gray-400 pl-6 italic my-6 text-gray-600 text-sm",
      "code": "bg-gray-100 px-1 rounded font-mono text-sm",
      "pre": "bg-gray-50 p-4 rounded overflow-x-auto text-sm",
      "body": "bg-white p-8 max-w-none",
      "article": "prose prose-slate max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Merriweather"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#1f2937",
      "accentColor": "#1e40af",
      "headingFont": "Merriweather",
      "bodyFont": "Merriweather",
      "sampleHeading": "Academic Paper",
      "sampleText": "Traditional academic formatting with proper hierarchy and citations style.",
      "style": "serif"
    },
    "exampleContent": "# The Impact of Typography on Reading Comprehension: A Systematic Review\n\n**Abstract**\n\nThis paper examines the relationship between typographic choices and reading comprehension across various digital platforms. Through a comprehensive analysis of existing literature, we identify key factors that influence readability and propose guidelines for optimal text presentation.\n\n## Introduction\n\nTypography plays a crucial role in how information is perceived and processed by readers. The selection of appropriate fonts, spacing, and layout can significantly impact comprehension and retention rates (Smith & Johnson, 2023).\n\n### Research Questions\n\nThe present study addresses the following questions:\n\n1. How does font selection affect reading speed?\n2. What role does line spacing play in comprehension?\n3. Are serif or sans-serif fonts more effective for digital reading?\n\n## Literature Review\n\nPrevious research has established several key findings:\n\n> \"The choice of typeface is not merely aesthetic; it fundamentally shapes the reader's cognitive engagement with the text\" (Williams, 2022, p. 45).\n\n### Table 1: Summary of Key Studies\n\n| Author         | Year | Sample Size | Key Finding                    |\n| -------------- | ---- | ----------- | ------------------------------ |\n| Johnson et al. | 2021 | n=450       | Serif fonts improved retention |\n| Chen           | 2022 | n=320       | Line height affects speed      |\n| Patel & Smith  | 2023 | n=275       | Contrast is critical           |\n\n## Methodology\n\nThe systematic review followed PRISMA guidelines for transparent reporting. Databases searched included:\n\n- PubMed\n- PsycINFO\n- Google Scholar\n- Web of Science\n\n### Inclusion Criteria\n\nStudies were included if they met the following conditions: peer-reviewed publication, empirical methodology, and focus on digital typography.\n\n## Results\n\n```\nStatistical analysis revealed significant effects\n(p < 0.05) for font type, size, and spacing.\n```\n\n## Discussion\n\nThe findings suggest that **optimal typography** requires careful consideration of multiple factors working in concert.\n\n## References\n\nSee [full bibliography](https://example.com/references) for complete citations.\n\n![Figure 1: Typography hierarchy](https://picsum.photos/600/300?random=5)"
  },
  {
    "id": "dark-mode-pro",
    "name": "Dark Mode Pro",
    "description": "Deep greens and vibrant emerald highlights for high contrast.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-emerald-400",
      "h2": "text-2xl font-bold mb-4 text-emerald-400",
      "h3": "text-xl font-bold mb-3 text-emerald-300",
      "h4": "text-lg font-bold mb-3 text-emerald-300",
      "h5": "text-base font-bold mb-2 text-emerald-300",
      "h6": "text-sm font-bold mb-2 text-emerald-300",
      "p": "mb-2 text-base text-gray-300 leading-relaxed",
      "a": "text-emerald-400 hover:text-emerald-300 hover:underline",
      "img": "max-w-full my-4 rounded-lg",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-white",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-300",
      "em": "italic text-gray-400",
      "tr": "border border-gray-700 even:bg-gray-800 odd:bg-gray-900",
      "td": "border border-gray-700 p-2",
      "th": "border border-gray-700 p-2 bg-gray-800 font-semibold text-emerald-400",
      "blockquote": "border-l-4 border-emerald-500 pl-4 italic my-4 text-gray-400 bg-gray-800 py-2 rounded-r",
      "code": "bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-emerald-400",
      "pre": "bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700",
      "body": "bg-gray-900 p-6 text-gray-200",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Inter"
    },
    "preview": {
      "bgColor": "#111827",
      "textColor": "#d1d5db",
      "accentColor": "#34d399",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "Dark Mode Pro",
      "sampleText": "Terminal aesthetics meet high-end editorial design.",
      "style": "default"
    },
    "exampleContent": "# Dark Mode Pro\n\nBuilding interfaces that respect your eyes and your preferences.\n\n## Why Dark Mode?\n\nDark themes have become essential in modern software development. They reduce **eye strain**, save battery on OLED displays, and provide a focused environment for deep work.\n\n### Benefits\n\n1. Reduced eye fatigue during long sessions\n2. Better contrast for code readability\n3. Lower power consumption\n4. Professional aesthetic\n\n> \"The night is dark and full of code.\"  \n> — Every developer at 2 AM\n\n## Code Examples\n\nHere's a sample configuration:\n\n```javascript\nconst config = {\n  theme: 'dark',\n  accent: 'emerald',\n  contrast: 'high',\n  animation: true,\n}\n\nexport default config\n```\n\n### Quick Reference\n\n| Setting    | Value     | Description       |\n| ---------- | --------- | ----------------- |\n| Background | `#111827` | Deep gray base    |\n| Text       | `#d1d5db` | Soft white        |\n| Accent     | `#34d399` | Emerald highlight |\n\n## Getting Started\n\n- Install the theme package\n- Configure your preferences\n- Enable system sync\n- Enjoy the dark side\n\nCheck our [documentation](https://example.com) for more details.\n\n![Dark interface](https://picsum.photos/600/300?grayscale)"
  },
  {
    "id": "developer-console",
    "name": "Developer Console",
    "description": "Monospaced font stack designed for technical documentation.",
    "category": "monospace",
    "fontFamily": "Fira Sans",
    "tailwindClasses": {
      "h1": "text-2xl font-bold mb-4 text-green-400 font-mono",
      "h2": "text-xl font-bold mb-3 text-green-400 font-mono",
      "h3": "text-lg font-bold mb-3 text-green-300 font-mono",
      "h4": "text-base font-bold mb-2 text-green-300 font-mono",
      "h5": "text-sm font-bold mb-2 text-green-300 font-mono",
      "h6": "text-xs font-bold mb-2 text-green-300 font-mono",
      "p": "mb-2 text-sm text-green-100 font-mono leading-relaxed",
      "a": "text-cyan-400 hover:text-cyan-300 underline font-mono",
      "img": "max-w-full my-4 border border-green-800",
      "table": "table-auto my-4 w-full font-mono",
      "strong": "font-bold text-green-300",
      "ul": "list-disc list-inside font-mono",
      "ol": "list-decimal list-inside font-mono",
      "li": "mb-1 text-green-100 text-sm",
      "em": "italic text-green-300",
      "tr": "border border-green-900 even:bg-gray-900 odd:bg-gray-950",
      "td": "border border-green-900 p-2 text-sm font-mono",
      "th": "border border-green-900 p-2 bg-gray-900 font-mono text-green-400",
      "blockquote": "border-l-4 border-green-600 pl-4 italic my-4 text-green-300 bg-gray-900 py-2 font-mono",
      "code": "bg-gray-900 px-1.5 py-0.5 rounded font-mono text-sm text-green-400",
      "pre": "bg-black p-4 rounded overflow-x-auto border border-green-900",
      "body": "bg-gray-950 p-6 text-green-200",
      "article": "prose prose-invert max-w-none font-mono"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Fira Sans"
    },
    "preview": {
      "bgColor": "#030712",
      "textColor": "#86efac",
      "accentColor": "#22d3ee",
      "headingFont": "monospace",
      "bodyFont": "monospace",
      "sampleHeading": ".markdown { @apply font-mono; }",
      "sampleText": "Monospaced font stack designed for technical documentation.",
      "style": "mono"
    },
    "exampleContent": "# SYSTEM.LOG\n\n> Initializing developer console theme...\n\n## $ whoami\n\nA terminal-inspired theme for developers who live in the command line.\n\n### PROCESS.ENV\n\n```bash\nexport THEME=\"developer-console\"\nexport FONT=\"monospace\"\nexport COLOR_PRIMARY=\"#86efac\"\nexport COLOR_ACCENT=\"#22d3ee\"\n```\n\n## FEATURES.md\n\n- `font-mono` applied globally\n- Terminal green color scheme\n- High contrast for readability\n- Code-first design philosophy\n\n> \"There is no place like 127.0.0.1\"\n\n## STATUS TABLE\n\n| SERVICE  | PORT | STATUS  |\n| -------- | ---- | ------- |\n| nginx    | 80   | RUNNING |\n| postgres | 5432 | RUNNING |\n| redis    | 6379 | RUNNING |\n| app      | 3000 | RUNNING |\n\n### SAMPLE.js\n\n```javascript\nconst developer = {\n  name: 'Console Developer',\n  theme: 'dark',\n  editor: 'vim',\n  coffee: true,\n\n  code: function () {\n    while (this.coffee) {\n      this.write()\n    }\n  },\n}\n```\n\n## LINKS.txt\n\n1. [GitHub](https://github.com)\n2. [Stack Overflow](https://stackoverflow.com)\n3. [Dev.to](https://dev.to)\n\n![Terminal](https://picsum.photos/600/300?random=4)\n\n```\n[SUCCESS] Theme loaded successfully\n[INFO] Ready for input...\n█\n```"
  },
  {
    "id": "high-contrast",
    "name": "High Contrast",
    "description": "Maximum readability with strong contrast ratios and clear hierarchy.",
    "category": "accessibility",
    "fontFamily": "Open Sans",
    "tailwindClasses": {
      "h1": "text-4xl font-extrabold mb-6 text-black",
      "h2": "text-3xl font-extrabold mb-4 text-black",
      "h3": "text-2xl font-bold mb-3 text-black",
      "h4": "text-xl font-bold mb-3 text-black",
      "h5": "text-lg font-bold mb-2 text-black",
      "h6": "text-base font-bold mb-2 text-black",
      "p": "mb-3 text-lg text-black leading-loose",
      "a": "text-blue-800 hover:text-blue-600 underline decoration-2 font-semibold",
      "img": "max-w-full my-4",
      "table": "table-auto my-4 w-full",
      "strong": "font-extrabold text-black",
      "ul": "list-disc list-outside ml-8 text-lg",
      "ol": "list-decimal list-outside ml-8 text-lg",
      "li": "mb-2 text-black",
      "em": "italic font-semibold",
      "tr": "border-2 border-black",
      "td": "border-2 border-black p-3 text-lg",
      "th": "border-2 border-black p-3 bg-black text-white font-bold text-lg",
      "blockquote": "border-l-8 border-black pl-6 italic my-6 text-black bg-gray-100 py-4",
      "code": "bg-gray-200 px-2 py-1 rounded font-mono text-base text-black border border-gray-400",
      "pre": "bg-gray-100 p-6 rounded overflow-x-auto border-2 border-black",
      "body": "bg-white p-6",
      "article": "prose prose-slate max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Open Sans"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#000000",
      "accentColor": "#1e40af",
      "headingFont": "Open Sans",
      "bodyFont": "Open Sans",
      "sampleHeading": "High Contrast",
      "sampleText": "Maximum readability with strong contrast ratios and large text.",
      "style": "default"
    },
    "exampleContent": "# Accessibility First\n\n**Designing for everyone, without compromise.**\n\n## Why Accessibility Matters\n\nOne billion people worldwide live with some form of disability. Good design should work for **everyone**, regardless of ability.\n\n### WCAG Guidelines\n\nThis theme follows Web Content Accessibility Guidelines (WCAG) 2.1 AA standards:\n\n- **Contrast ratio**: 7:1 minimum\n- **Font size**: 18px base\n- **Clear hierarchy**: Bold headings\n- **Readable fonts**: Sans-serif\n\n> \"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.\"  \n> — Tim Berners-Lee\n\n## Key Features\n\n| Feature      | Standard | This Theme |\n| ------------ | -------- | ---------- |\n| Contrast     | 4.5:1    | 7:1+       |\n| Min Font     | 16px     | 18px       |\n| Line Height  | 1.5      | 1.75       |\n| Focus States | Required | Enhanced   |\n\n### Benefits\n\n1. **Better for low vision users**\n2. **Improved readability in bright light**\n3. **Reduces eye strain for everyone**\n4. **Works without color perception**\n\n## Code Example\n\n```css\n.high-contrast {\n  color: #000000;\n  background: #ffffff;\n  font-size: 1.125rem;\n  line-height: 1.75;\n}\n```\n\n## Resources\n\n- [WCAG Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)\n- [A11y Project](https://www.a11yproject.com/)\n- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)\n\n![Inclusive design](https://picsum.photos/600/300?random=6)\n\n**Remember: Accessibility is not a feature, it's a requirement.**"
  },
  {
    "id": "minimalist",
    "name": "Minimalist",
    "description": "Clean whitespace with subtle gray scales and zero distractions.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-2xl font-light mb-6 text-gray-900 uppercase tracking-[0.3em]",
      "h2": "text-xl font-light mb-4 text-gray-800 uppercase tracking-[0.2em]",
      "h3": "text-lg font-light mb-3 text-gray-700 uppercase tracking-widest",
      "h4": "text-base font-light mb-3 text-gray-700 uppercase tracking-wider",
      "h5": "text-sm font-light mb-2 text-gray-600 uppercase tracking-wider",
      "h6": "text-xs font-light mb-2 text-gray-500 uppercase tracking-wider",
      "p": "mb-4 text-sm text-gray-600 leading-loose",
      "a": "text-gray-600 hover:text-gray-900 underline underline-offset-4 decoration-gray-300",
      "img": "max-w-full my-6",
      "table": "table-auto my-6 w-full",
      "strong": "font-medium text-gray-800",
      "ul": "list-none ml-0",
      "ol": "list-none ml-0",
      "li": "mb-2 text-gray-600 text-sm pl-4 border-l border-gray-200",
      "em": "italic text-gray-500",
      "tr": "border-b border-gray-100",
      "td": "p-3 text-sm",
      "th": "p-3 text-sm font-medium text-gray-400 uppercase tracking-wider",
      "blockquote": "border-l border-gray-200 pl-6 italic my-6 text-gray-400",
      "code": "text-gray-600 text-sm font-mono",
      "pre": "bg-gray-50 p-6 overflow-x-auto",
      "body": "bg-white p-12",
      "article": "prose prose-stone max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Inter"
    },
    "preview": {
      "bgColor": "#f0fdf4",
      "textColor": "#374151",
      "accentColor": "#9ca3af",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "MINIMALIST",
      "sampleText": "FOCUS ON WHAT MATTERS",
      "style": "minimal"
    },
    "exampleContent": "# LESS IS MORE\n\n_The power of restraint._\n\n## THE PHILOSOPHY\n\nMinimalism strips away the unnecessary to reveal what truly matters. Every element serves a purpose. Every space has meaning.\n\n### PRINCIPLES\n\n- Remove the superfluous\n- Embrace white space\n- Let content breathe\n- Value simplicity\n\n> Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.\n\n## ELEMENTS\n\n| Aspect     | Approach      |\n| ---------- | ------------- |\n| Color      | Grayscale     |\n| Typography | Light weights |\n| Spacing    | Generous      |\n| Decoration | None          |\n\n### A MOMENT OF CALM\n\nIn a world of constant noise and visual clutter, minimalist design offers a refuge. It creates space for thought, for focus, for what truly matters.\n\n```\nsimplicity = elegance\n```\n\n## EMBRACE THE VOID\n\nThe empty space is not empty. It is full of potential, full of breath, full of intention.\n\n[Discover more](https://example.com)\n\n![Minimal landscape](https://picsum.photos/600/300?random=2)"
  },
  {
    "id": "modern-serif",
    "name": "Modern Serif",
    "description": "Elegant typography with soft gold accents and cream background.",
    "category": "serif",
    "fontFamily": "Playfair Display",
    "tailwindClasses": {
      "h1": "text-4xl font-bold mb-6 text-amber-900",
      "h2": "text-3xl font-bold mb-4 text-amber-800",
      "h3": "text-2xl font-semibold mb-3 text-amber-800",
      "h4": "text-xl font-semibold mb-3 text-amber-700",
      "h5": "text-lg font-semibold mb-2 text-amber-700",
      "h6": "text-base font-semibold mb-2 text-amber-700",
      "p": "mb-3 text-base text-amber-950 leading-relaxed",
      "a": "text-amber-700 hover:text-amber-500 underline decoration-amber-300",
      "img": "max-w-full my-4 rounded-lg shadow-md",
      "table": "table-auto my-6 w-full",
      "strong": "font-bold text-amber-900",
      "ul": "list-disc list-inside ml-2",
      "ol": "list-decimal list-inside ml-2",
      "li": "mb-1 text-amber-950",
      "em": "italic text-amber-800",
      "tr": "border border-amber-200 even:bg-amber-50 odd:bg-white",
      "td": "border border-amber-200 p-2",
      "th": "border border-amber-200 p-2 bg-amber-100 font-semibold",
      "blockquote": "border-l-4 border-amber-400 pl-4 italic my-4 text-amber-800 bg-amber-50 py-2",
      "code": "bg-amber-100 px-1.5 py-0.5 rounded font-mono text-sm text-amber-900",
      "pre": "bg-amber-50 p-4 rounded-lg overflow-x-auto border border-amber-200",
      "body": "bg-amber-50 p-8",
      "article": "prose prose-slate max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Playfair Display"
    },
    "preview": {
      "bgColor": "#fffbeb",
      "textColor": "#78350f",
      "accentColor": "#d97706",
      "headingFont": "Playfair Display",
      "bodyFont": "Playfair Display",
      "sampleHeading": "Modern Serif",
      "sampleText": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam at porttitor sem.",
      "style": "serif"
    },
    "exampleContent": "# The Art of Typography\n\n_Elegance in every letter, sophistication in every word._\n\n## A Journey Through Time\n\nTypography has been the silent ambassador of design since the earliest days of written communication. From the **illuminated manuscripts** of medieval monks to the digital fonts we use today, the art of arranging type continues to evolve.\n\n### The Golden Ratio\n\nGreat typography respects proportions. Notice how this text flows naturally across the page, with comfortable line heights and generous margins.\n\n> \"Typography is the craft of endowing human language with a durable visual form.\"  \n> — Robert Bringhurst\n\n## Features of Classic Design\n\n- Balanced whitespace\n- Harmonious color palette\n- Readable line lengths\n- Elegant font pairings\n\n### A Sample Table\n\n| Element          | Purpose        | Impact |\n| ---------------- | -------------- | ------ |\n| Serif fonts      | Readability    | High   |\n| Gold accents     | Sophistication | Medium |\n| Cream background | Warmth         | High   |\n\nVisit our [design resources](https://example.com) for more inspiration.\n\n![Typography sample](https://picsum.photos/600/300)\n\n```css\n.elegant-text {\n  font-family: 'Playfair Display', serif;\n  color: #78350f;\n}\n```"
  },
  {
    "id": "neo-brutalist",
    "name": "Neo-Brutalist",
    "description": "Bold borders and high-contrast primary colors for a modern vibe.",
    "category": "experimental",
    "fontFamily": "Oswald",
    "tailwindClasses": {
      "h1": "text-4xl font-black mb-4 text-black uppercase tracking-wider",
      "h2": "text-3xl font-black mb-4 text-black uppercase tracking-wide",
      "h3": "text-2xl font-bold mb-3 text-black uppercase",
      "h4": "text-xl font-bold mb-3 text-black",
      "h5": "text-lg font-bold mb-2 text-black",
      "h6": "text-base font-bold mb-2 text-black",
      "p": "mb-3 text-base text-gray-900 leading-relaxed",
      "a": "text-blue-600 font-bold underline decoration-4 decoration-yellow-400 hover:bg-yellow-400 hover:text-black",
      "img": "max-w-full my-4 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
      "table": "table-auto my-4 w-full border-4 border-black",
      "strong": "font-black text-black",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-900",
      "em": "italic",
      "tr": "border-2 border-black",
      "td": "border-2 border-black p-2",
      "th": "border-2 border-black p-2 bg-yellow-400 font-bold",
      "blockquote": "border-l-8 border-black pl-4 my-4 text-black font-bold bg-yellow-100 py-3",
      "code": "bg-yellow-200 px-2 py-0.5 font-mono text-sm border-2 border-black",
      "pre": "bg-white p-4 overflow-x-auto border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
      "body": "bg-white p-6",
      "article": "max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Oswald"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#000000",
      "accentColor": "#facc15",
      "headingFont": "Oswald",
      "bodyFont": "system-ui",
      "sampleHeading": "NEO-BRUTALIST",
      "sampleText": "BOLD. RAW. UNFILTERED.",
      "style": "brutalist"
    },
    "exampleContent": "# BRUTALISM IN DESIGN\n\n**NO APOLOGIES. NO COMPROMISES.**\n\n## WHAT IS NEO-BRUTALISM?\n\nNeo-brutalism rejects the polished, over-designed aesthetic of modern web design. It embraces **raw edges**, **bold colors**, and **unapologetic simplicity**.\n\n### KEY PRINCIPLES\n\n1. THICK BORDERS\n2. HIGH CONTRAST\n3. PRIMARY COLORS\n4. NO GRADIENTS\n5. BOLD SHADOWS\n\n> \"DESIGN SHOULD NOT BE INVISIBLE. IT SHOULD PUNCH YOU IN THE FACE.\"\n\n## THE COLOR PALETTE\n\n| COLOR  | HEX       | USE           |\n| ------ | --------- | ------------- |\n| BLACK  | `#000000` | BORDERS, TEXT |\n| YELLOW | `#FACC15` | ACCENT        |\n| BLUE   | `#2563EB` | LINKS         |\n| WHITE  | `#FFFFFF` | BACKGROUND    |\n\n### CODE BLOCK\n\n```css\n.brutalist {\n  border: 4px solid black;\n  box-shadow: 8px 8px 0 black;\n  background: white;\n}\n```\n\n## CALL TO ACTION\n\n- **BE BOLD**\n- **BE DIFFERENT**\n- **BE BRUTALIST**\n\n[JOIN THE MOVEMENT](https://example.com)\n\n![Brutalist architecture](https://picsum.photos/600/300?random=1)"
  },
  {
    "id": "pastel-dream",
    "name": "Pastel Dream",
    "description": "Soft pastel colors with rounded elements and gentle gradients.",
    "category": "experimental",
    "fontFamily": "Nunito",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-purple-700",
      "h2": "text-2xl font-bold mb-4 text-pink-600",
      "h3": "text-xl font-semibold mb-3 text-indigo-600",
      "h4": "text-lg font-semibold mb-3 text-indigo-500",
      "h5": "text-base font-semibold mb-2 text-purple-500",
      "h6": "text-sm font-semibold mb-2 text-pink-500",
      "p": "mb-3 text-base text-gray-700 leading-relaxed",
      "a": "text-purple-500 hover:text-pink-500 underline decoration-wavy decoration-pink-300",
      "img": "max-w-full my-4 rounded-2xl shadow-lg",
      "table": "table-auto my-4 w-full rounded-lg overflow-hidden",
      "strong": "font-bold text-purple-700",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-700",
      "em": "italic text-pink-600",
      "tr": "border border-purple-100 even:bg-purple-50 odd:bg-pink-50",
      "td": "border border-purple-100 p-2",
      "th": "border border-purple-100 p-2 bg-purple-100 font-semibold text-purple-800",
      "blockquote": "border-l-4 border-pink-300 pl-4 italic my-4 text-purple-600 bg-pink-50 py-2 rounded-r-lg",
      "code": "bg-purple-100 px-1.5 py-0.5 rounded-lg font-mono text-sm text-purple-700",
      "pre": "bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl overflow-x-auto border border-purple-200",
      "body": "bg-gradient-to-br from-purple-50 to-pink-50 p-6",
      "article": "prose prose-slate max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Nunito"
    },
    "preview": {
      "bgColor": "#faf5ff",
      "textColor": "#6b21a8",
      "accentColor": "#ec4899",
      "headingFont": "Nunito",
      "bodyFont": "Nunito",
      "sampleHeading": "Pastel Dream",
      "sampleText": "Soft pastel colors with rounded elements and gentle vibes.",
      "style": "default"
    },
    "exampleContent": "# ✨ Welcome to Pastel Dream\n\n_Where colors dance and creativity blooms_ 🌸\n\n## A Gentle Aesthetic\n\nPastel Dream brings a **soft, dreamy** atmosphere to your content. Perfect for creative portfolios, lifestyle blogs, and anything that needs a touch of whimsy.\n\n### Why Pastels?\n\nPastel colors are known for their:\n\n- 💜 Calming effect\n- 💗 Friendly appearance\n- 💙 Creative versatility\n- 💚 Modern appeal\n\n> \"Colors are the smiles of nature.\"  \n> — Leigh Hunt\n\n## The Color Story\n\n| Mood  | Color      | Hex       |\n| ----- | ---------- | --------- |\n| Calm  | Lavender   | `#E9D5FF` |\n| Joy   | Pink       | `#FBCFE8` |\n| Trust | Periwinkle | `#C7D2FE` |\n| Fresh | Mint       | `#A7F3D0` |\n\n### Creating Magic\n\n```css\n.pastel-dream {\n  background: linear-gradient(135deg, #faf5ff, #fdf2f8);\n  border-radius: 1rem;\n  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.1);\n}\n```\n\n## Perfect For\n\n1. **Creative portfolios**\n2. **Lifestyle blogs**\n3. **Wedding sites**\n4. **Children's content**\n5. **Wellness brands**\n\n### A Little Inspiration\n\nLife is too short for boring design. Let your content _sparkle_ with personality and charm. ✨\n\n[Explore more themes](https://example.com) 🎨\n\n![Pastel aesthetic](https://picsum.photos/600/300?random=7)\n\n---\n\n_Made with 💜 and a sprinkle of magic_"
  },
  {
    "id": "standard-blue",
    "name": "Standard Blue",
    "description": "The classic Tailwind CSS utility-first aesthetic for developer docs.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-gray-800",
      "h2": "text-2xl font-bold mb-4 text-gray-800",
      "h3": "text-xl font-bold mb-4 text-gray-800",
      "h4": "text-lg font-bold mb-4 text-gray-800",
      "h5": "text-base font-bold mb-4 text-gray-800",
      "h6": "text-sm font-bold mb-4 text-gray-800",
      "p": "mb-2 text-base text-gray-800",
      "a": "text-blue-500 hover:text-blue-700 hover:underline",
      "img": "max-w-full my-4",
      "table": "table-auto my-4",
      "strong": "font-bold",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic",
      "tr": "border border-gray-200 even:bg-gray-50 odd:bg-white",
      "td": "border border-gray-200 p-1",
      "th": "border border-gray-200 p-1",
      "blockquote": "border-l-4 border-gray-300 pl-4 italic my-4",
      "code": "bg-gray-100 px-1 rounded font-mono text-sm",
      "pre": "bg-gray-100 p-4 rounded overflow-x-auto",
      "body": "bg-white p-4",
      "article": "prose prose-slate max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Inter"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#1f2937",
      "accentColor": "#3b82f6",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "Tailwind Default",
      "sampleText": "The classic Tailwind CSS utility-first aesthetic for developer docs.",
      "style": "default"
    },
    "exampleContent": "# Welcome to Tailwind Default\n\nA clean, professional theme based on the Tailwind CSS design system.\n\n## Getting Started\n\nThis theme provides a **solid foundation** for technical documentation, blog posts, and general-purpose content.\n\n### Features\n\n- Clean typography\n- Readable color palette\n- Consistent spacing\n- Mobile-friendly\n\n> Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.\n\n## Installation\n\n```bash\nnpm install tailwindcss\nnpx tailwindcss init\n```\n\n## Configuration\n\n| Property  | Default | Description    |\n| --------- | ------- | -------------- |\n| `content` | `[]`    | Files to scan  |\n| `theme`   | `{}`    | Customizations |\n| `plugins` | `[]`    | Extensions     |\n\n### Example Usage\n\n1. Install dependencies\n2. Configure your template paths\n3. Add Tailwind directives\n4. Start the build process\n\n```javascript\nmodule.exports = {\n  content: ['./src/**/*.{html,js}'],\n  theme: {\n    extend: {},\n  },\n  plugins: [],\n}\n```\n\n## Resources\n\n- [Official Documentation](https://tailwindcss.com)\n- [GitHub Repository](https://github.com/tailwindlabs/tailwindcss)\n- [Community Discord](https://discord.gg/tailwind)\n\n![Tailwind CSS](https://picsum.photos/600/300?random=3)"
  }
]

/**
 * Get a theme by ID
 */
export function getThemeById(id: string): ThemePreset | undefined {
  return themePresets.find((theme) => theme.id === id)
}

/**
 * Filter themes by category
 */
export function filterThemesByCategory(category: ThemeCategory): ThemePreset[] {
  if (category === 'all') return themePresets
  return themePresets.filter((theme) => theme.category === category)
}

/**
 * Search themes by name or description
 */
export function searchThemes(query: string): ThemePreset[] {
  const lowerQuery = query.toLowerCase()
  return themePresets.filter(
    (theme) =>
      theme.name.toLowerCase().includes(lowerQuery) ||
      theme.description.toLowerCase().includes(lowerQuery) ||
      theme.category.toLowerCase().includes(lowerQuery)
  )
}

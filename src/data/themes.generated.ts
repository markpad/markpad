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
    "id": "blog-post",
    "name": "Blog Post",
    "description": "Medium/Substack-inspired clean reading experience.",
    "category": "serif",
    "fontFamily": "Merriweather",
    "tailwindClasses": {
      "h1": "text-4xl font-bold mb-6 text-gray-900 leading-tight",
      "h2": "text-2xl font-bold mb-4 text-gray-900 mt-8",
      "h3": "text-xl font-semibold mb-3 text-gray-800 mt-6",
      "h4": "text-lg font-semibold mb-3 text-gray-800",
      "h5": "text-base font-semibold mb-2 text-gray-700",
      "h6": "text-sm font-semibold mb-2 text-gray-600",
      "p": "mb-4 text-lg text-gray-700 leading-8",
      "a": "text-green-700 hover:text-green-900 underline decoration-1 underline-offset-2",
      "img": "max-w-full my-6 rounded-lg",
      "table": "table-auto my-6 w-full",
      "strong": "font-bold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-2 text-lg text-gray-700 leading-8",
      "em": "italic",
      "tr": "border border-gray-200 even:bg-gray-50 odd:bg-white",
      "td": "border border-gray-200 p-3",
      "th": "border border-gray-200 p-3 bg-gray-50 font-semibold text-gray-800",
      "blockquote": "border-l-4 border-gray-900 pl-6 italic my-6 text-xl text-gray-600 leading-relaxed",
      "code": "bg-gray-100 px-1.5 py-0.5 rounded font-mono text-base text-gray-800",
      "pre": "bg-gray-50 p-6 rounded-lg overflow-x-auto border border-gray-200",
      "body": "bg-white p-8 text-gray-800 max-w-2xl mx-auto",
      "article": "prose prose-lg max-w-none"
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
      "textColor": "#292929",
      "accentColor": "#1a8917",
      "headingFont": "Playfair Display",
      "bodyFont": "Merriweather",
      "sampleHeading": "Blog Post",
      "sampleText": "A clean, elegant reading experience inspired by modern publishing.",
      "style": "default"
    },
    "exampleContent": "# The Art of Writing Clean Code\n\n_A reflection on craftsmanship in software engineering_\n\n## Why Clean Code Matters\n\nEvery developer has inherited a codebase that made them question their career choices. **Clean code** isn't just about aesthetics — it's about respect for your future self and your teammates.\n\n### The Hidden Cost of Messy Code\n\n1. Onboarding new developers takes weeks instead of days\n2. Simple features require complex workarounds\n3. Bug fixes introduce new bugs\n4. Technical debt compounds like interest\n\n> \"Any fool can write code that a computer can understand. Good programmers write code that humans can understand.\"\n> — Martin Fowler\n\n## Principles That Stand the Test of Time\n\nThe best codebases share common traits. They are consistent, well-named, and broken into small, focused pieces.\n\n| Principle             | Impact    | Effort |\n| --------------------- | --------- | ------ |\n| Meaningful names      | High      | Low    |\n| Small functions       | High      | Medium |\n| Single responsibility | High      | Medium |\n| DRY                   | Medium    | Low    |\n| Tests                 | Very High | High   |\n\n## A Simple Example\n\n```javascript\n// Before: What does this do?\nconst d = (a, b) => a.filter((x) => b.includes(x.id))\n\n// After: Crystal clear\nconst findMatchingUsers = (users, allowedIds) => {\n  return users.filter((user) => allowedIds.includes(user.id))\n}\n```\n\n### Further Reading\n\n- [Clean Code by Robert C. Martin](https://example.com)\n- [The Pragmatic Programmer](https://example.com)\n- _Refactoring_ by Martin Fowler\n\n![Writing](https://picsum.photos/600/300?random=29)"
  },
  {
    "id": "comic-book",
    "name": "Comic Book",
    "description": "Bold, colorful comic book style with pop art energy and dynamic typography.",
    "category": "experimental",
    "fontFamily": "Bangers",
    "tailwindClasses": {
      "h1": "text-5xl font-black mb-6 text-red-600 uppercase tracking-wider drop-shadow-[3px_3px_0px_rgba(0,0,0,0.8)]",
      "h2": "text-3xl font-bold mb-4 text-blue-700 uppercase tracking-wide",
      "h3": "text-2xl font-bold mb-3 text-yellow-600 uppercase",
      "h4": "text-xl font-bold mb-3 text-red-500",
      "h5": "text-lg font-bold mb-2 text-blue-600",
      "h6": "text-base font-bold mb-2 text-gray-700",
      "p": "mb-4 text-lg leading-relaxed text-gray-900",
      "a": "text-red-600 hover:text-red-800 underline decoration-wavy decoration-yellow-400 decoration-2",
      "img": "max-w-full my-4 rounded-lg border-4 border-black shadow-[6px_6px_0px_rgba(0,0,0,0.8)]",
      "table": "table-auto my-4 w-full border-4 border-black",
      "strong": "font-extrabold text-blue-700",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-2 text-gray-800 text-lg",
      "em": "italic text-purple-600",
      "tr": "border-2 border-gray-800 even:bg-yellow-50 odd:bg-white",
      "td": "border-2 border-gray-800 p-3",
      "th": "bg-red-600 text-white font-bold uppercase p-3 border-2 border-black",
      "blockquote": "border-l-4 border-red-500 bg-yellow-100 pl-4 py-2 italic my-4 text-gray-900 font-bold rounded-r-lg shadow-[4px_4px_0px_rgba(0,0,0,0.8)]",
      "code": "bg-yellow-300 text-red-700 font-bold px-2 py-0.5 rounded border-2 border-black text-sm font-mono",
      "pre": "bg-gray-900 text-green-300 p-4 rounded-xl border-4 border-black overflow-x-auto shadow-[6px_6px_0px_rgba(0,0,0,0.9)]",
      "body": "bg-yellow-50 p-8 border-4 border-black shadow-[8px_8px_0px_rgba(0,0,0,0.9)] rounded-2xl",
      "article": "prose prose-lg max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Bangers"
    },
    "preview": {
      "bgColor": "#fffde7",
      "textColor": "#1a1a2e",
      "accentColor": "#ff1744",
      "headingFont": "Bangers",
      "bodyFont": "Comic Neue",
      "sampleHeading": "COMIC BOOK!",
      "sampleText": "Bold panels and explosive action in every page.",
      "style": "brutalist"
    },
    "exampleContent": "# 💥 COMIC BOOK STYLE!\n\nWelcome to a world of **bold colors**, _dynamic action_, and explosive storytelling!\n\n> \"With great power comes great responsibility!\" — Every comic ever\n\n## Origin Story\n\nEvery hero needs an origin story. This theme draws inspiration from the **golden age of comics**, bringing:\n\n- **Bold typography** that pops off the page\n- **Vibrant colors** inspired by classic four-color printing\n- **Dynamic shadows** that create depth and impact\n- **Hand-drawn energy** with wavy decorations\n\n## Powers & Abilities\n\n| Power          | Level | Description              |\n| -------------- | ----- | ------------------------ |\n| **Typography** | ★★★★★ | Bold, impactful headings |\n| **Color**      | ★★★★★ | Vibrant primary palette  |\n| **Layout**     | ★★★★☆ | Clean panel structure    |\n| **Fun Factor** | ★★★★★ | Maximum entertainment    |\n\n## The Code of Heroes\n\n```javascript\nfunction assembleTeam(heroes) {\n  return heroes\n    .filter((hero) => hero.isAvailable)\n    .map((hero) => ({\n      ...hero,\n      status: 'ASSEMBLED! 💪',\n    }))\n}\n\nconst avengers = assembleTeam(allHeroes)\nconsole.log('Heroes assembled:', avengers.length)\n```\n\n## Sound Effects\n\nIn the world of comics, every action has a sound:\n\n1. **POW!** — A solid punch landing\n2. **ZAP!** — Energy blasts firing\n3. **WHAM!** — An explosive impact\n4. **SWOOSH!** — A hero taking flight\n\n> 💬 \"The world needs heroes. Not perfect ones — just brave ones willing to stand up and fight for what's right.\"\n\n### Data Links\n\n- [Hero Database](https://example.com)\n- [Villain Archive](https://example.com)\n- Comic series _Issue #42_\n\n![Comic panel](https://picsum.photos/600/300?random=42)"
  },
  {
    "id": "cyberpunk",
    "name": "Cyberpunk",
    "description": "Futuristic neon colors with a tech dystopia aesthetic.",
    "category": "experimental",
    "fontFamily": "Oswald",
    "tailwindClasses": {
      "h1": "text-4xl font-black mb-4 text-cyan-400 uppercase tracking-widest",
      "h2": "text-3xl font-bold mb-4 text-pink-500 uppercase tracking-wider",
      "h3": "text-2xl font-bold mb-3 text-yellow-400 uppercase tracking-wide",
      "h4": "text-xl font-bold mb-3 text-cyan-300",
      "h5": "text-lg font-bold mb-2 text-cyan-300",
      "h6": "text-base font-bold mb-2 text-cyan-300",
      "p": "mb-3 text-base leading-relaxed text-gray-300",
      "a": "text-cyan-400 hover:text-pink-400 hover:underline decoration-2",
      "img": "max-w-full my-4 border-2 border-cyan-500 rounded",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-pink-400",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-300",
      "em": "italic text-yellow-300",
      "tr": "border border-cyan-900 even:bg-gray-900 odd:bg-gray-950",
      "td": "border border-cyan-900 p-2",
      "th": "border border-cyan-900 p-2 bg-cyan-900 font-bold text-cyan-300 uppercase text-sm",
      "blockquote": "border-l-4 border-pink-500 pl-4 italic my-4 text-pink-200 bg-gray-900 py-2 rounded-r",
      "code": "bg-gray-900 px-1.5 py-0.5 rounded font-mono text-sm text-green-400 border border-cyan-800",
      "pre": "bg-gray-950 p-4 rounded overflow-x-auto border border-cyan-800",
      "body": "bg-gray-950 p-6 text-gray-200",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Oswald"
    },
    "preview": {
      "bgColor": "#0a0a0f",
      "textColor": "#e0e0ff",
      "accentColor": "#00ffff",
      "headingFont": "Oswald",
      "bodyFont": "Fira Sans",
      "sampleHeading": "CYBERPUNK",
      "sampleText": "Neon-lit interfaces from a digital dystopia.",
      "style": "brutalist"
    },
    "exampleContent": "# CYBERPUNK\n\nWelcome to the neon grid. The future is now.\n\n## THE DIGITAL FRONTIER\n\nIn a world where technology and humanity converge, **cyberpunk** aesthetics define our visual language. Neon lights cut through digital rain.\n\n### CORE ELEMENTS\n\n1. Neon-lit color palettes\n2. High contrast against dark voids\n3. Glitch-inspired typography\n4. Futuristic tech imagery\n\n> \"The sky above the port was the color of television, tuned to a dead channel.\"\n> — William Gibson, _Neuromancer_\n\n## SYSTEM SPECS\n\n| Module      | Status  | Priority |\n| ----------- | ------- | -------- |\n| Neural Link | ACTIVE  | HIGH     |\n| Cyberware   | ONLINE  | MEDIUM   |\n| ICE Shield  | ARMED   | CRITICAL |\n| Net Runner  | STANDBY | LOW      |\n\n## INITIALIZATION SEQUENCE\n\n```javascript\nconst cyberspace = {\n  initialize: () => {\n    console.log('[SYSTEM] Booting neural interface...')\n    console.log('[NET] Connecting to the grid...')\n    return {\n      status: 'ONLINE',\n      protocol: 'ICE-7',\n      encryption: 'quantum-256',\n    }\n  },\n}\n\ncyberspace.initialize()\n```\n\n### DATA LINKS\n\n- [The Matrix Protocol](https://example.com)\n- [Netrunner Archive](https://example.com)\n- Neural interface _version 3.7.1_\n\n![Neon city](https://picsum.photos/600/300?random=26)"
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
    "id": "dracula",
    "name": "Dracula",
    "description": "Popular dark purple theme with vibrant accent colors.",
    "category": "experimental",
    "fontFamily": "Fira Sans",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-purple-400",
      "h2": "text-2xl font-bold mb-4 text-purple-300",
      "h3": "text-xl font-semibold mb-3 text-pink-400",
      "h4": "text-lg font-semibold mb-3 text-pink-300",
      "h5": "text-base font-semibold mb-2 text-pink-300",
      "h6": "text-sm font-semibold mb-2 text-pink-300",
      "p": "mb-3 text-base leading-relaxed",
      "a": "text-cyan-400 hover:text-cyan-300 hover:underline",
      "img": "max-w-full my-4 rounded-lg border border-purple-800",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-pink-300",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic text-yellow-300",
      "tr": "border border-purple-800 even:bg-purple-900 odd:bg-gray-900",
      "td": "border border-purple-800 p-2",
      "th": "border border-purple-800 p-2 bg-purple-900 font-semibold text-purple-300",
      "blockquote": "border-l-4 border-purple-500 pl-4 italic my-4 text-purple-200 bg-purple-900 py-2 rounded-r",
      "code": "bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400",
      "pre": "bg-gray-900 p-4 rounded-lg overflow-x-auto border border-purple-800",
      "body": "bg-gray-900 p-6 text-gray-100",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Fira Sans"
    },
    "preview": {
      "bgColor": "#282a36",
      "textColor": "#f8f8f2",
      "accentColor": "#bd93f9",
      "headingFont": "Fira Sans",
      "bodyFont": "Fira Sans",
      "sampleHeading": "Dracula",
      "sampleText": "A dark theme with vibrant purples, pinks, and cyans.",
      "style": "default"
    },
    "exampleContent": "# Dracula Theme\n\nWelcome to the dark side — elegant, vibrant, and easy on the eyes.\n\n## What is Dracula?\n\nDracula is a **dark theme** created by Zeno Rocha. It has been adopted by hundreds of applications including editors, terminals, and now — your markdown.\n\n### Color Philosophy\n\n1. High contrast against a dark background\n2. Vibrant yet non-fatiguing accent colors\n3. Carefully balanced warm and cool tones\n4. Consistent across applications\n\n> \"One theme to rule them all.\"\n> — The Dracula community\n\n## Palette\n\n| Color      | Hex       | Usage        |\n| ---------- | --------- | ------------ |\n| Background | `#282a36` | Base canvas  |\n| Foreground | `#f8f8f2` | Primary text |\n| Purple     | `#bd93f9` | Keywords     |\n| Pink       | `#ff79c6` | Functions    |\n| Cyan       | `#8be9fd` | Constants    |\n| Green      | `#50fa7b` | Strings      |\n\n## Code Example\n\n```javascript\nconst dracula = {\n  background: '#282a36',\n  currentLine: '#44475a',\n  foreground: '#f8f8f2',\n  comment: '#6272a4',\n  cyan: '#8be9fd',\n  green: '#50fa7b',\n  orange: '#ffb86c',\n  pink: '#ff79c6',\n  purple: '#bd93f9',\n  red: '#ff5555',\n  yellow: '#f1fa8c',\n}\n```\n\n### Resources\n\n- [Dracula Theme](https://draculatheme.com)\n- Available for _300+_ apps and tools\n- Open-source and community-driven\n\n![Dracula theme](https://picsum.photos/600/300?random=21)"
  },
  {
    "id": "dyslexia-friendly",
    "name": "Dyslexia Friendly",
    "description": "Designed for readability with larger spacing and dyslexia-optimized fonts.",
    "category": "accessibility",
    "fontFamily": "Open Sans",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-6 text-gray-900 leading-loose",
      "h2": "text-2xl font-bold mb-5 text-gray-900 leading-loose",
      "h3": "text-xl font-bold mb-4 text-gray-800 leading-relaxed",
      "h4": "text-lg font-bold mb-3 text-gray-800 leading-relaxed",
      "h5": "text-base font-bold mb-3 text-gray-700",
      "h6": "text-sm font-bold mb-2 text-gray-700",
      "p": "mb-4 text-lg text-gray-800 leading-loose tracking-wide",
      "a": "text-blue-700 hover:text-blue-500 underline decoration-2 underline-offset-4",
      "img": "max-w-full my-6 rounded",
      "table": "table-auto my-6 w-full text-lg",
      "strong": "font-bold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-3 text-lg text-gray-800 leading-loose tracking-wide",
      "em": "italic text-gray-700",
      "tr": "border-2 border-gray-300 even:bg-yellow-50 odd:bg-white",
      "td": "border-2 border-gray-300 p-3",
      "th": "border-2 border-gray-300 p-3 bg-blue-100 font-bold text-gray-900",
      "blockquote": "border-l-4 border-blue-400 pl-6 italic my-6 text-gray-700 bg-blue-50 py-3 rounded-r text-lg",
      "code": "bg-yellow-100 px-2 py-1 rounded font-mono text-base text-gray-800",
      "pre": "bg-yellow-50 p-6 rounded overflow-x-auto border-2 border-yellow-200 text-base leading-loose",
      "body": "p-8 text-gray-800",
      "article": "prose prose-lg max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Open Sans"
    },
    "preview": {
      "bgColor": "#faf8f0",
      "textColor": "#2d2d2d",
      "accentColor": "#4a90d9",
      "headingFont": "Open Sans",
      "bodyFont": "Open Sans",
      "sampleHeading": "Dyslexia Friendly",
      "sampleText": "Optimized for clarity with generous spacing and readable fonts.",
      "style": "default"
    },
    "exampleContent": "# Accessible Reading\n\nA theme designed for everyone, with extra attention to readability.\n\n## Why Accessibility Matters\n\nReading should be comfortable for **everyone**. This theme uses larger spacing, clear fonts, and high contrast to ensure the best possible reading experience.\n\n### Key Design Choices\n\n1. Generous line height and letter spacing\n2. Sans-serif font for screen readability\n3. Warm, low-glare background color\n4. High contrast without harsh black-on-white\n\n> \"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect.\"\n> — Tim Berners-Lee\n\n## Readability Guidelines\n\n| Feature        | This Theme | Standard  |\n| -------------- | ---------- | --------- |\n| Line Height    | 2.0        | 1.5       |\n| Letter Spacing | Wide       | Normal    |\n| Font Size      | 18px base  | 16px base |\n| Paragraph Gap  | 1.5rem     | 1rem      |\n\n## Text Example\n\n```\nThis is a sample of monospace text.\n\nIt uses generous spacing to ensure\neach line is easy to follow.\n\nNo character should be confused\nwith another.\n```\n\n### Resources\n\n- [Web Accessibility Initiative](https://www.w3.org/WAI/)\n- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)\n- Designed with _care and intention_\n\n![Accessibility](https://picsum.photos/600/300?random=32)"
  },
  {
    "id": "flexoki",
    "name": "Flexoki",
    "description": "Warm analog color scheme inspired by paper, ink, and the tactile nature of writing.",
    "category": "serif",
    "fontFamily": "Merriweather",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-6 leading-tight",
      "h2": "text-2xl font-bold mb-4",
      "h3": "text-xl font-semibold mb-3",
      "h4": "text-lg font-semibold mb-3",
      "h5": "text-base font-semibold mb-2",
      "h6": "text-sm font-semibold mb-2",
      "p": "mb-4 text-base leading-7",
      "a": "underline decoration-2 underline-offset-2 hover:opacity-80 transition-opacity",
      "img": "max-w-full my-4 rounded",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold",
      "ul": "list-disc list-outside ml-6",
      "ol": "list-decimal list-outside ml-6",
      "li": "mb-2 leading-7",
      "em": "italic",
      "tr": "border-b",
      "td": "p-3",
      "th": "p-3 font-semibold text-left border-b-2",
      "blockquote": "border-l-4 pl-4 italic my-4 py-2",
      "code": "px-1.5 py-0.5 rounded font-mono text-sm",
      "pre": "p-4 rounded overflow-x-auto font-mono text-sm",
      "body": "bg-[#fffcf0] text-[#100f0f] p-8",
      "article": "prose max-w-none prose-headings:text-[#100f0f] prose-p:text-[#100f0f] prose-a:text-[#d14d41] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#100f0f] prose-code:text-[#af3029] prose-code:bg-[#f2f0e5] prose-pre:bg-[#f2f0e5] prose-pre:text-[#100f0f] prose-blockquote:border-[#d14d41] prose-blockquote:text-[#282726] prose-th:text-[#100f0f] prose-td:text-[#282726] prose-li:text-[#282726]"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Merriweather"
    },
    "preview": {
      "bgColor": "#fffcf0",
      "textColor": "#100f0f",
      "accentColor": "#d14d41",
      "headingFont": "Merriweather",
      "bodyFont": "Merriweather",
      "sampleHeading": "Flexoki Theme",
      "sampleText": "Inspired by the warmth of paper and the flow of ink.",
      "style": "default"
    },
    "exampleContent": "# Flexoki\n\nA warm, analog color scheme that brings the tactile joy of paper and ink to your digital writing.\n\n## Philosophy\n\nFlexoki is inspired by the **analog materials** we use for thinking and writing:\n\n- Paper in various shades\n- Inks and markers in muted tones  \n- The warm glow of incandescent light\n- Natural materials and textures\n\n## Color Palette\n\nThe palette uses **warm tones** throughout, creating a cohesive and comfortable reading experience:\n\n- **Base**: Cream and warm grays\n- **Text**: Deep charcoal black\n- **Red**: `#D14D41` for emphasis and links\n- **Orange**: `#DA702C` for highlights\n- **Yellow**: `#D0A215` for attention\n- **Green**: `#879A39` for success\n- **Cyan**: `#3AA99F` for info\n- **Blue**: `#4385BE` for calm\n- **Purple**: `#8B7EC8` for creativity\n- **Magenta**: `#CE5D97` for energy\n\n## Typography\n\n```javascript\nconst flexoki = {\n  paper: '#fffcf0',\n  text: '#100f0f',\n  text2: '#282726',\n  red: '#d14d41',\n  orange: '#da702c',\n  yellow: '#d0a215',\n  green: '#879a39',\n}\n```\n\n### Features\n\n1. Warm, paper-like background\n2. High contrast for readability\n3. Muted accent colors inspired by ink\n4. Comfortable for long reading sessions\n\n> \"The best digital tools should feel as natural as pen and paper.\"\n\n## Design Principles\n\n| Principle | Description |\n|-----------|-------------|\n| **Warmth** | All colors lean toward warm tones |\n| **Contrast** | Text maintains excellent readability |\n| **Analog** | Inspired by physical materials |\n| **Comfort** | Designed for extended use |\n\n### Code Example\n\n```css\n.flexoki-theme {\n  background: #fffcf0;\n  color: #100f0f;\n  accent-color: #d14d41;\n}\n\n/* Warm, analog aesthetic */\n.prose {\n  font-family: serif;\n  line-height: 1.75;\n}\n```\n\n## Links & Resources\n\n- [Official Flexoki Repository](https://github.com/kepano/flexoki)\n- Designed by *Stephan Ango*\n- Open source color scheme\n\n![Analog writing materials](https://picsum.photos/600/300?random=27)\n\n---\n\n*Experience the warmth of analog in your digital workflow.*"
  },
  {
    "id": "github-readme",
    "name": "GitHub README",
    "description": "Mimics the style of GitHub repository README files.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-gray-900 pb-2 border-b border-gray-300",
      "h2": "text-2xl font-bold mb-3 text-gray-900 pb-2 border-b border-gray-300",
      "h3": "text-xl font-semibold mb-3 text-gray-900",
      "h4": "text-lg font-semibold mb-2 text-gray-900",
      "h5": "text-base font-semibold mb-2 text-gray-900",
      "h6": "text-sm font-semibold mb-2 text-gray-500",
      "p": "mb-4 text-base text-gray-700 leading-7",
      "a": "text-blue-600 hover:underline",
      "img": "max-w-full my-4",
      "table": "table-auto my-4 w-full",
      "strong": "font-semibold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-700 leading-7",
      "em": "italic",
      "tr": "border border-gray-200 even:bg-gray-50 odd:bg-white",
      "td": "border border-gray-200 p-2",
      "th": "border border-gray-200 p-2 bg-gray-50 font-semibold text-gray-900",
      "blockquote": "border-l-4 border-gray-300 pl-4 my-4 text-gray-600",
      "code": "bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-gray-800",
      "pre": "bg-gray-100 p-4 rounded-lg overflow-x-auto",
      "body": "bg-white p-6 text-gray-800",
      "article": "prose max-w-none"
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
      "textColor": "#1f2328",
      "accentColor": "#0969da",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "GitHub README",
      "sampleText": "The familiar, trusted style of GitHub repository documentation.",
      "style": "default"
    },
    "exampleContent": "# marklab\n\nA markdown editor with live preview and Tailwind CSS styling.\n\n[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)\n\n## Features\n\n- Live markdown preview with **Tailwind CSS** classes\n- Theme gallery with 25+ presets\n- URL-based state sharing\n- Custom style panel with autocomplete\n\n> **Note:** This project is under active development. Contributions welcome!\n\n## Quick Start\n\n### Prerequisites\n\n1. Node.js 18+\n2. npm or yarn\n3. A modern browser\n\n### Installation\n\n```bash\ngit clone https://github.com/teles/marklab.git\ncd marklab\nnpm install\nnpm start\n```\n\n## Usage\n\n| Feature | Shortcut | Description         |\n| ------- | -------- | ------------------- |\n| Bold    | `Ctrl+B` | Toggle bold text    |\n| Preview | `Ctrl+P` | Toggle preview mode |\n| Save    | `Ctrl+S` | Save to URL         |\n| Theme   | `Ctrl+T` | Open theme selector |\n\n## Contributing\n\n```bash\n# Fork the repository\ngit checkout -b feature/my-feature\nnpm test\ngit commit -m \"feat: add my feature\"\ngit push origin feature/my-feature\n```\n\n### Project Structure\n\n- `src/components/` — React components\n- `src/themes/` — Theme definitions\n- `src/hooks/` — Custom React hooks\n- `src/services/` — _Business logic_\n\n## License\n\nMIT — see [LICENSE](https://opensource.org/licenses/MIT) for details.\n\n![Screenshot](https://picsum.photos/600/300?random=34)"
  },
  {
    "id": "gruvbox",
    "name": "Gruvbox",
    "description": "Retro groove color scheme with warm earthy tones.",
    "category": "serif",
    "fontFamily": "Merriweather",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-orange-400",
      "h2": "text-2xl font-bold mb-4 text-orange-300",
      "h3": "text-xl font-semibold mb-3 text-yellow-400",
      "h4": "text-lg font-semibold mb-3 text-yellow-300",
      "h5": "text-base font-semibold mb-2 text-yellow-300",
      "h6": "text-sm font-semibold mb-2 text-yellow-300",
      "p": "mb-3 text-base leading-relaxed",
      "a": "text-blue-400 hover:text-blue-300 hover:underline",
      "img": "max-w-full my-4 rounded border border-yellow-800",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-yellow-200",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic text-green-400",
      "tr": "border border-yellow-900 even:bg-yellow-900 odd:bg-gray-800",
      "td": "border border-yellow-900 p-2",
      "th": "border border-yellow-900 p-2 bg-yellow-900 font-semibold text-orange-300",
      "blockquote": "border-l-4 border-orange-500 pl-4 italic my-4 text-yellow-200 bg-gray-800 py-2 rounded-r",
      "code": "bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400",
      "pre": "bg-gray-800 p-4 rounded overflow-x-auto border border-yellow-900",
      "body": "bg-gray-900 p-6 text-yellow-100",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Merriweather"
    },
    "preview": {
      "bgColor": "#282828",
      "textColor": "#ebdbb2",
      "accentColor": "#fe8019",
      "headingFont": "Merriweather",
      "bodyFont": "Merriweather",
      "sampleHeading": "Gruvbox",
      "sampleText": "Retro groove with warm earthy tones and vintage aesthetics.",
      "style": "default"
    },
    "exampleContent": "# Gruvbox Theme\n\nA retro groove color scheme that feels like a warm autumn evening.\n\n## Origin\n\nGruvbox was designed by **morhetz** as a Vim color scheme. Its warm, retro palette has since been adopted across editors, terminals, and web applications.\n\n### Design Goals\n\n1. Warm, desaturated colors\n2. High readability in any lighting\n3. Retro developer aesthetic\n4. Clear distinction between syntax groups\n\n> \"Designed for long coding sessions — warm tones, easy eyes.\"\n\n## Color Palette\n\n| Color  | Hex       | Role       |\n| ------ | --------- | ---------- |\n| Dark0  | `#282828` | Background |\n| Light0 | `#fbf1c7` | Foreground |\n| Red    | `#cc241d` | Errors     |\n| Green  | `#98971a` | Strings    |\n| Yellow | `#d79921` | Types      |\n| Orange | `#fe8019` | Constants  |\n\n## Code Example\n\n```javascript\nconst gruvbox = {\n  dark: {\n    bg: '#282828',\n    fg: '#ebdbb2',\n    red: '#cc241d',\n    green: '#98971a',\n    yellow: '#d79921',\n    blue: '#458588',\n    purple: '#b16286',\n    aqua: '#689d6a',\n    orange: '#d65d0e',\n  },\n}\n```\n\n### Resources\n\n- [Gruvbox for Vim](https://github.com/morhetz/gruvbox)\n- Community ports for _VS Code, IntelliJ, Alacritty_\n- Pairs beautifully with serif fonts\n\n![Warm tones](https://picsum.photos/600/300?random=23)"
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
    "id": "material-design",
    "name": "Material Design",
    "description": "Clean, modern theme following Google Material Design guidelines.",
    "category": "sans-serif",
    "fontFamily": "Roboto",
    "tailwindClasses": {
      "h1": "text-3xl font-medium mb-4 text-gray-900",
      "h2": "text-2xl font-medium mb-4 text-gray-900",
      "h3": "text-xl font-medium mb-3 text-gray-800",
      "h4": "text-lg font-medium mb-3 text-gray-800",
      "h5": "text-base font-medium mb-2 text-gray-800",
      "h6": "text-sm font-medium mb-2 text-gray-700",
      "p": "mb-3 text-base text-gray-700 leading-relaxed",
      "a": "text-blue-700 hover:text-blue-900 hover:underline",
      "img": "max-w-full my-4 rounded-lg",
      "table": "table-auto my-4 w-full",
      "strong": "font-medium text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-700",
      "em": "italic",
      "tr": "border border-gray-200 even:bg-gray-50 odd:bg-white",
      "td": "border border-gray-200 p-3",
      "th": "border border-gray-200 p-3 bg-blue-50 font-medium text-blue-900",
      "blockquote": "border-l-4 border-blue-500 pl-4 my-4 text-gray-600 bg-blue-50 py-2 rounded-r",
      "code": "bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-pink-600",
      "pre": "bg-gray-100 p-4 rounded-lg overflow-x-auto border border-gray-200",
      "body": "bg-white p-6 text-gray-800",
      "article": "prose max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Roboto"
    },
    "preview": {
      "bgColor": "#fafafa",
      "textColor": "#212121",
      "accentColor": "#1976d2",
      "headingFont": "Roboto",
      "bodyFont": "Roboto",
      "sampleHeading": "Material Design",
      "sampleText": "Bold, graphic, and intentional — design with purpose.",
      "style": "default"
    },
    "exampleContent": "# Material Design\n\nBold, graphic, and intentional — design guided by print design principles.\n\n## Core Principles\n\nMaterial Design is a design system created by **Google** to help teams build high-quality digital experiences. It emphasizes a tactile, physical feeling.\n\n### Foundations\n\n1. Material as a metaphor\n2. Bold, graphic, intentional\n3. Motion provides meaning\n4. Adaptive design across devices\n\n> \"Good design is good business. Material Design brings consistency and delight to every user interaction.\"\n\n## Typography Scale\n\n| Level    | Size | Weight | Usage          |\n| -------- | ---- | ------ | -------------- |\n| Headline | 24sp | 400    | Page titles    |\n| Title    | 20sp | 500    | Section heads  |\n| Body 1   | 16sp | 400    | Primary text   |\n| Body 2   | 14sp | 400    | Secondary text |\n| Caption  | 12sp | 400    | Labels         |\n\n## Components\n\n```javascript\nconst MaterialButton = {\n  elevation: 2,\n  borderRadius: 4,\n  padding: '8px 16px',\n  textTransform: 'uppercase',\n  fontWeight: 500,\n  letterSpacing: '0.0892857em',\n  transition: 'box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1)',\n}\n```\n\n### Resources\n\n- [Material Design Guidelines](https://m3.material.io)\n- [Material Components](https://github.com/material-components)\n- Open-source and _free_ to use\n\n![Material Design](https://picsum.photos/600/300?random=25)"
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
    "id": "monokai",
    "name": "Monokai",
    "description": "Classic dark theme inspired by the iconic editor color scheme.",
    "category": "monospace",
    "fontFamily": "Ubuntu",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-pink-400",
      "h2": "text-2xl font-bold mb-4 text-pink-400",
      "h3": "text-xl font-semibold mb-3 text-yellow-300",
      "h4": "text-lg font-semibold mb-3 text-yellow-300",
      "h5": "text-base font-semibold mb-2 text-yellow-300",
      "h6": "text-sm font-semibold mb-2 text-yellow-300",
      "p": "mb-3 text-base leading-relaxed",
      "a": "text-blue-400 hover:text-blue-300 hover:underline",
      "img": "max-w-full my-4 rounded-lg",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-orange-300",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic text-purple-300",
      "tr": "border border-gray-700 even:bg-gray-800 odd:bg-gray-900",
      "td": "border border-gray-700 p-2",
      "th": "border border-gray-700 p-2 bg-gray-800 font-semibold text-pink-400",
      "blockquote": "border-l-4 border-pink-500 pl-4 italic my-4 text-gray-400 bg-gray-800 py-2 rounded-r",
      "code": "bg-gray-800 px-1.5 py-0.5 rounded font-mono text-sm text-green-400",
      "pre": "bg-gray-900 p-4 rounded-lg overflow-x-auto border border-gray-700",
      "body": "bg-gray-900 p-6 text-gray-100",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Ubuntu"
    },
    "preview": {
      "bgColor": "#272822",
      "textColor": "#f8f8f2",
      "accentColor": "#f92672",
      "headingFont": "Ubuntu",
      "bodyFont": "Ubuntu",
      "sampleHeading": "Monokai",
      "sampleText": "The iconic color scheme that defined a generation of coding.",
      "style": "default"
    },
    "exampleContent": "# Monokai Theme\n\nThe color scheme that shaped modern code editing.\n\n## History\n\nMonokai was created by **Wimer Hazenberg** in 2006. It quickly became the default theme for Sublime Text and one of the most popular themes across all code editors.\n\n### Why Developers Love It\n\n1. Vibrant colors on a dark canvas\n2. Excellent syntax differentiation\n3. Comfortable for extended sessions\n4. Instantly recognizable aesthetic\n\n> \"If you've ever coded, you've probably used Monokai.\"\n\n## Signature Colors\n\n| Color  | Hex       | Used For   |\n| ------ | --------- | ---------- |\n| Pink   | `#f92672` | Keywords   |\n| Green  | `#a6e22e` | Strings    |\n| Yellow | `#e6db74` | Classes    |\n| Orange | `#fd971f` | Parameters |\n| Purple | `#ae81ff` | Numbers    |\n| Blue   | `#66d9ef` | Built-ins  |\n\n## Code Example\n\n```javascript\nclass MonokaiTheme {\n  constructor() {\n    this.name = 'Monokai'\n    this.type = 'dark'\n    this.colors = {\n      background: '#272822',\n      foreground: '#f8f8f2',\n    }\n  }\n\n  apply(editor) {\n    return editor.setTheme(this)\n  }\n}\n```\n\n### Ecosystem\n\n- Sublime Text default\n- Available for _VS Code, Vim, Emacs, IntelliJ_\n- Inspired dozens of derivative themes\n\n![Code editor](https://picsum.photos/600/300?random=24)"
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
    "id": "newspaper",
    "name": "Newspaper",
    "description": "Traditional newspaper broadsheet typography and layout.",
    "category": "serif",
    "fontFamily": "Playfair Display",
    "tailwindClasses": {
      "h1": "text-4xl font-bold mb-4 text-gray-900 border-b-2 border-gray-900 pb-2 leading-tight",
      "h2": "text-2xl font-bold mb-3 text-gray-900 border-b border-gray-400 pb-1",
      "h3": "text-xl font-semibold mb-3 text-gray-800 italic",
      "h4": "text-lg font-semibold mb-2 text-gray-800",
      "h5": "text-base font-semibold mb-2 text-gray-700",
      "h6": "text-sm font-bold mb-2 text-gray-600 uppercase tracking-widest",
      "p": "mb-3 text-base text-gray-800 leading-7",
      "a": "text-red-800 hover:text-red-600 hover:underline",
      "img": "max-w-full my-4 border border-gray-300",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-800 leading-7",
      "em": "italic",
      "tr": "border border-gray-300 even:bg-yellow-50 odd:bg-white",
      "td": "border border-gray-300 p-2",
      "th": "border border-gray-300 p-2 bg-gray-200 font-bold text-gray-900 uppercase text-xs tracking-wider",
      "blockquote": "border-l-4 border-red-800 pl-4 italic my-4 text-gray-700 text-lg leading-relaxed",
      "code": "bg-gray-200 px-1 rounded font-mono text-sm text-gray-800",
      "pre": "bg-gray-100 p-4 rounded overflow-x-auto border border-gray-300",
      "body": "p-6 text-gray-900",
      "article": "prose max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Playfair Display"
    },
    "preview": {
      "bgColor": "#f5f0e8",
      "textColor": "#1a1a1a",
      "accentColor": "#8b0000",
      "headingFont": "Playfair Display",
      "bodyFont": "PT Sans",
      "sampleHeading": "The Daily Chronicle",
      "sampleText": "Traditional broadsheet typography meets the digital age.",
      "style": "default"
    },
    "exampleContent": "# BREAKING: The Future of Web Typography\n\n_By our Technology Correspondent — March 8, 2026_\n\n## A New Era for Digital Publishing\n\n**LONDON** — The world of digital publishing is undergoing a revolution. Modern CSS frameworks and web fonts have made it possible to recreate the elegance of traditional print typography on the web.\n\n### The Print-Digital Convergence\n\n1. High-quality web fonts rivaling print\n2. Responsive layouts adapting to every screen\n3. Rich typography controls via CSS\n4. Accessibility built into every design\n\n> \"We are witnessing the golden age of web typography. The gap between print and digital has never been narrower.\"\n> — Sarah Chen, _Typography Today_\n\n## Industry Impact\n\n| Sector     | Adoption | Growth   |\n| ---------- | -------- | -------- |\n| News Media | 89%      | +12% YoY |\n| Publishing | 76%      | +18% YoY |\n| Academia   | 62%      | +25% YoY |\n| Corporate  | 54%      | +8% YoY  |\n\n## Technical Implementation\n\n```css\n@font-face {\n  font-family: 'Broadsheet';\n  src: url('/fonts/broadsheet.woff2') format('woff2');\n  font-weight: 400 700;\n  font-display: swap;\n}\n\n.article-body {\n  font-family: 'Broadsheet', Georgia, serif;\n  font-size: 1.0625rem;\n  line-height: 1.75;\n  hyphens: auto;\n}\n```\n\n### Related Stories\n\n- [The Rise of Variable Fonts](https://example.com)\n- [CSS Grid and Editorial Design](https://example.com)\n- _Digital First: How newspapers are reinventing themselves_\n\n![Newspaper press](https://picsum.photos/600/300?random=30)"
  },
  {
    "id": "nord",
    "name": "Nord",
    "description": "Arctic, north-bluish color palette inspired by Nordic aesthetics.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-blue-300",
      "h2": "text-2xl font-bold mb-4 text-blue-300",
      "h3": "text-xl font-semibold mb-3 text-blue-200",
      "h4": "text-lg font-semibold mb-3 text-blue-200",
      "h5": "text-base font-semibold mb-2 text-blue-200",
      "h6": "text-sm font-semibold mb-2 text-blue-200",
      "p": "mb-3 text-base leading-relaxed",
      "a": "text-cyan-400 hover:text-cyan-300 hover:underline",
      "img": "max-w-full my-4 rounded-lg",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-white",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic text-blue-200",
      "tr": "border border-gray-600 even:bg-gray-800 odd:bg-gray-700",
      "td": "border border-gray-600 p-2",
      "th": "border border-gray-600 p-2 bg-gray-700 font-semibold text-blue-300",
      "blockquote": "border-l-4 border-cyan-500 pl-4 italic my-4 text-blue-200 bg-gray-800 py-2 rounded-r",
      "code": "bg-gray-700 px-1.5 py-0.5 rounded font-mono text-sm text-cyan-300",
      "pre": "bg-gray-800 p-4 rounded-lg overflow-x-auto border border-gray-600",
      "body": "bg-gray-800 p-6 text-gray-200",
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
      "bgColor": "#2e3440",
      "textColor": "#d8dee9",
      "accentColor": "#88c0d0",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "Nord",
      "sampleText": "An arctic, north-bluish color palette for clean, elegant interfaces.",
      "style": "default"
    },
    "exampleContent": "# Nord Theme\n\nAn arctic, north-bluish palette for the modern developer.\n\n## Philosophy\n\nNord's design is inspired by the beauty and calmness of the **arctic**. Clean lines, subdued colors, and a focus on readability define this color scheme.\n\n### Principles\n\n1. Inspired by arctic landscapes\n2. Four distinct palette groups\n3. Smooth color transitions\n4. Universal adaptability\n\n> \"Clean, beautiful, and designed with care — just like Scandinavian architecture.\"\n\n## Palette Groups\n\n| Group       | Purpose          | Colors |\n| ----------- | ---------------- | ------ |\n| Polar Night | Background tones | 4      |\n| Snow Storm  | Text and UI      | 3      |\n| Frost       | Primary accents  | 4      |\n| Aurora      | Status colors    | 5      |\n\n## Code Example\n\n```javascript\nconst nordPalette = {\n  // Polar Night\n  nord0: '#2e3440',\n  nord1: '#3b4252',\n  nord2: '#434c5e',\n  nord3: '#4c566a',\n  // Snow Storm\n  nord4: '#d8dee9',\n  nord5: '#e5e9f0',\n  nord6: '#eceff4',\n  // Frost\n  nord7: '#8fbcbb',\n  nord8: '#88c0d0',\n  nord9: '#81a1c1',\n  nord10: '#5e81ac',\n}\n```\n\n### Resources\n\n- [Nord Website](https://www.nordtheme.com)\n- Available for _editors, terminals, and UI_\n- Community-maintained ports\n\n![Nordic landscape](https://picsum.photos/600/300?random=22)"
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
    "id": "resume-cv",
    "name": "Resume/CV",
    "description": "Clean, professional layout for resumes and CVs.",
    "category": "sans-serif",
    "fontFamily": "Lato",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-2 text-gray-900 tracking-wide",
      "h2": "text-lg font-bold mb-3 text-blue-700 uppercase tracking-widest border-b-2 border-blue-600 pb-1",
      "h3": "text-base font-bold mb-1 text-gray-900",
      "h4": "text-sm font-semibold mb-1 text-gray-700",
      "h5": "text-sm font-semibold mb-1 text-gray-600",
      "h6": "text-xs font-semibold mb-1 text-gray-500 uppercase tracking-wide",
      "p": "mb-2 text-sm text-gray-700 leading-relaxed",
      "a": "text-blue-600 hover:text-blue-800 hover:underline",
      "img": "max-w-full my-3 rounded",
      "table": "table-auto my-3 w-full text-sm",
      "strong": "font-bold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-sm text-gray-700",
      "em": "italic text-gray-500",
      "tr": "border-b border-gray-200",
      "td": "p-2 text-gray-700",
      "th": "p-2 font-semibold text-gray-900 text-left",
      "blockquote": "border-l-2 border-blue-500 pl-4 my-3 text-gray-600 text-sm italic",
      "code": "bg-gray-100 px-1 py-0.5 rounded font-mono text-xs text-gray-800",
      "pre": "bg-gray-50 p-3 rounded overflow-x-auto text-sm border border-gray-200",
      "body": "bg-white p-8 text-gray-800",
      "article": "prose prose-sm max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Lato"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#333333",
      "accentColor": "#2563eb",
      "headingFont": "Lato",
      "bodyFont": "Lato",
      "sampleHeading": "Resume / CV",
      "sampleText": "Professional, clean layout designed for career documents.",
      "style": "default"
    },
    "exampleContent": "# John Developer\n\n_Senior Software Engineer_ — San Francisco, CA\n[john@example.com](mailto:john@example.com) | [github.com/johndeveloper](https://github.com)\n\n## Experience\n\n### Lead Frontend Engineer — TechCorp Inc.\n\n_January 2022 — Present_\n\n- Architected and led migration from legacy jQuery codebase to **React 18** with TypeScript\n- Reduced bundle size by 45% through code splitting and lazy loading\n- Mentored team of 5 junior developers with weekly code reviews\n\n### Senior Developer — StartupXYZ\n\n_March 2019 — December 2021_\n\n- Built real-time collaboration features using WebSockets\n- Implemented CI/CD pipeline reducing deploy time by 60%\n- Contributed to open-source design system with _200+ GitHub stars_\n\n## Skills\n\n| Category  | Technologies                          |\n| --------- | ------------------------------------- |\n| Languages | TypeScript, JavaScript, Python, Go    |\n| Frontend  | React, Next.js, Vue, Tailwind CSS     |\n| Backend   | Node.js, Express, GraphQL, PostgreSQL |\n| Tools     | Git, Docker, AWS, GitHub Actions      |\n\n## Education\n\n### M.S. Computer Science — Stanford University\n\n_2017 — 2019_\n\n> Focus: Human-Computer Interaction and Distributed Systems\n\n### B.S. Computer Science — UC Berkeley\n\n_2013 — 2017_\n\n```\nAwards: Dean's List (6 semesters), ACM Programming Contest Finalist\n```\n\n### Certifications\n\n- AWS Certified Solutions Architect\n- Google Cloud Professional Developer\n- Certified _Kubernetes Administrator_\n\n![Professional headshot](https://picsum.photos/600/300?random=31)"
  },
  {
    "id": "retro-terminal",
    "name": "Retro Terminal",
    "description": "Green-on-black CRT terminal aesthetic from the 80s/90s.",
    "category": "monospace",
    "fontFamily": "Ubuntu",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-green-400 uppercase tracking-wider",
      "h2": "text-2xl font-bold mb-4 text-green-400 uppercase",
      "h3": "text-xl font-bold mb-3 text-green-300",
      "h4": "text-lg font-bold mb-3 text-green-300",
      "h5": "text-base font-bold mb-2 text-green-300",
      "h6": "text-sm font-bold mb-2 text-green-300",
      "p": "mb-3 text-base leading-relaxed text-green-300",
      "a": "text-green-200 hover:text-white hover:underline",
      "img": "max-w-full my-4 border border-green-800 rounded",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-green-200",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-green-300",
      "em": "italic text-green-200",
      "tr": "border border-green-900 even:bg-gray-900 odd:bg-black",
      "td": "border border-green-900 p-2",
      "th": "border border-green-900 p-2 bg-green-900 font-bold text-green-200",
      "blockquote": "border-l-4 border-green-500 pl-4 italic my-4 text-green-200 bg-gray-900 py-2 rounded-r",
      "code": "bg-black px-1.5 py-0.5 rounded font-mono text-sm text-green-400 border border-green-900",
      "pre": "bg-black p-4 rounded overflow-x-auto border border-green-900",
      "body": "bg-black p-6 text-green-400",
      "article": "prose prose-invert max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Ubuntu"
    },
    "preview": {
      "bgColor": "#0c0c0c",
      "textColor": "#33ff33",
      "accentColor": "#33ff33",
      "headingFont": "Ubuntu",
      "bodyFont": "Ubuntu",
      "sampleHeading": "> TERMINAL_",
      "sampleText": "C:\\> Green phosphor glow on a CRT monitor.",
      "style": "default"
    },
    "exampleContent": "# > SYSTEM TERMINAL v2.4\n\nConnection established. Welcome, operator.\n\n## > SYSTEM STATUS\n\nThe **Retro Terminal** theme brings back the golden age of computing. Green phosphor characters on pure black — the way legends were built.\n\n### > FEATURES\n\n1. Authentic CRT green monochrome\n2. Monospace typography throughout\n3. Command-line aesthetic\n4. Minimal visual distractions\n\n> SYSTEM MESSAGE: \"In the beginning, there was the command line.\"\n> — Neal Stephenson\n\n## > PROCESS TABLE\n\n| PID | Process  | Status  | Memory |\n| --- | -------- | ------- | ------ |\n| 001 | kernel   | RUNNING | 64K    |\n| 002 | shell    | RUNNING | 16K    |\n| 003 | editor   | ACTIVE  | 32K    |\n| 004 | compiler | IDLE    | 128K   |\n\n## > SAMPLE PROGRAM\n\n```bash\n#!/bin/bash\necho \"=== SYSTEM BOOT ===\"\necho \"Initializing kernel...\"\nsleep 1\necho \"Loading drivers...\"\nsleep 1\necho \"Starting shell...\"\n\nfor i in $(seq 1 10); do\n  echo \"Process $i started [OK]\"\ndone\n\necho \"=== READY ===\"\n```\n\n### > REFERENCES\n\n- [Unix Heritage Society](https://example.com)\n- [VT100 Terminal Reference](https://example.com)\n- System uptime: _847 days, 14 hours_\n\n![Terminal](https://picsum.photos/600/300?random=27)"
  },
  {
    "id": "sepia",
    "name": "Sepia",
    "description": "Warm sepia tones for comfortable extended reading sessions.",
    "category": "accessibility",
    "fontFamily": "Merriweather",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-yellow-900 leading-tight",
      "h2": "text-2xl font-bold mb-4 text-yellow-900",
      "h3": "text-xl font-semibold mb-3 text-yellow-800",
      "h4": "text-lg font-semibold mb-3 text-yellow-800",
      "h5": "text-base font-semibold mb-2 text-yellow-700",
      "h6": "text-sm font-semibold mb-2 text-yellow-700",
      "p": "mb-4 text-base text-yellow-900 leading-8",
      "a": "text-amber-700 hover:text-amber-900 underline underline-offset-2",
      "img": "max-w-full my-4 rounded border border-yellow-300",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-yellow-950",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-2 text-yellow-900 leading-8",
      "em": "italic text-yellow-800",
      "tr": "border border-yellow-300 even:bg-yellow-100 odd:bg-yellow-50",
      "td": "border border-yellow-300 p-2",
      "th": "border border-yellow-300 p-2 bg-yellow-200 font-semibold text-yellow-900",
      "blockquote": "border-l-4 border-amber-600 pl-4 italic my-4 text-yellow-800 bg-yellow-100 py-2 rounded-r",
      "code": "bg-yellow-200 px-1.5 py-0.5 rounded font-mono text-sm text-yellow-900",
      "pre": "bg-yellow-100 p-4 rounded overflow-x-auto border border-yellow-300",
      "body": "p-8 text-yellow-900",
      "article": "prose max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "Merriweather"
    },
    "preview": {
      "bgColor": "#f4ecd8",
      "textColor": "#433422",
      "accentColor": "#8b5e3c",
      "headingFont": "Merriweather",
      "bodyFont": "Merriweather",
      "sampleHeading": "Sepia Reader",
      "sampleText": "Warm sepia tones for a gentle, book-like reading experience.",
      "style": "default"
    },
    "exampleContent": "# The Joy of Reading\n\nSettle in with a warm cup of tea and a gentle reading experience.\n\n## A Book-Like Experience\n\nThe **Sepia** theme recreates the warm, familiar feeling of reading a printed book. The muted background and warm tones reduce eye strain during extended reading sessions.\n\n### Design Inspiration\n\n1. Aged parchment warmth\n2. Kindle-like reading comfort\n3. Sunset-hour color temperature\n4. Optimized for long-form content\n\n> \"A reader lives a thousand lives before he dies. The man who never reads lives only one.\"\n> — George R.R. Martin\n\n## Reading Benefits\n\n| Feature          | Benefit                    |\n| ---------------- | -------------------------- |\n| Warm background  | Reduces blue light fatigue |\n| Serif fonts      | Guides the eye naturally   |\n| Generous leading | Prevents line-skipping     |\n| Muted contrast   | Comfortable for hours      |\n\n## Typography Settings\n\n```css\n.sepia-reader {\n  background-color: #f4ecd8;\n  color: #433422;\n  font-family: 'Merriweather', Georgia, serif;\n  font-size: 1.0625rem;\n  line-height: 2;\n  max-width: 65ch;\n}\n```\n\n### Recommended Reading\n\n- [On Typography](https://example.com)\n- [The Elements of Typographic Style](https://example.com)\n- _Night mode alternatives_ for late-night reading\n\n![Old books](https://picsum.photos/600/300?random=33)"
  },
  {
    "id": "solarized",
    "name": "Solarized",
    "description": "Ethan Schoonover's precision-engineered color scheme for comfortable reading.",
    "category": "sans-serif",
    "fontFamily": "Source Sans Pro",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-yellow-900",
      "h2": "text-2xl font-bold mb-4 text-yellow-900",
      "h3": "text-xl font-semibold mb-3 text-yellow-800",
      "h4": "text-lg font-semibold mb-3 text-yellow-800",
      "h5": "text-base font-semibold mb-2 text-yellow-800",
      "h6": "text-sm font-semibold mb-2 text-yellow-800",
      "p": "mb-3 text-base leading-relaxed",
      "a": "text-blue-600 hover:text-blue-500 hover:underline",
      "img": "max-w-full my-4 rounded",
      "table": "table-auto my-4 w-full",
      "strong": "font-bold text-yellow-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1",
      "em": "italic text-yellow-700",
      "tr": "border border-yellow-200 even:bg-yellow-50 odd:bg-yellow-100",
      "td": "border border-yellow-200 p-2",
      "th": "border border-yellow-200 p-2 bg-yellow-200 font-semibold text-yellow-900",
      "blockquote": "border-l-4 border-blue-400 pl-4 italic my-4 text-yellow-700 bg-yellow-50 py-2 rounded-r",
      "code": "bg-yellow-100 px-1.5 py-0.5 rounded font-mono text-sm text-red-600",
      "pre": "bg-yellow-100 p-4 rounded overflow-x-auto border border-yellow-200",
      "body": "p-6",
      "article": "prose max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": true
    },
    "fontConfig": {
      "fontFamily": "Source Sans Pro"
    },
    "preview": {
      "bgColor": "#fdf6e3",
      "textColor": "#657b83",
      "accentColor": "#268bd2",
      "headingFont": "Source Sans Pro",
      "bodyFont": "Source Sans Pro",
      "sampleHeading": "Solarized Light",
      "sampleText": "Precision colors designed for optimal readability and reduced eye strain.",
      "style": "default"
    },
    "exampleContent": "# Solarized Theme\n\nA carefully crafted color scheme built for readability and precision.\n\n## About Solarized\n\nSolarized is a sixteen-color palette designed by Ethan Schoonover for use with **terminal** and **GUI** applications. It offers carefully chosen colors with precise CIELAB lightness relationships.\n\n### Design Principles\n\n1. Selective contrast reduction\n2. Balanced warm/cool tones\n3. Dual-mode support (light and dark)\n4. Precise color relationships\n\n> \"Solarized reduces brightness contrast but retains contrasting hues for syntax highlighting.\"\n> — Ethan Schoonover\n\n## Color Palette\n\n| Color  | Hex       | Role           |\n| ------ | --------- | -------------- |\n| Base03 | `#002b36` | Dark bg        |\n| Base3  | `#fdf6e3` | Light bg       |\n| Yellow | `#b58900` | Warning/accent |\n| Blue   | `#268bd2` | Links/info     |\n| Cyan   | `#2aa198` | Constants      |\n\n## Code Example\n\n```javascript\nconst solarized = {\n  base03: '#002b36',\n  base3: '#fdf6e3',\n  yellow: '#b58900',\n  orange: '#cb4b16',\n  red: '#dc322f',\n  magenta: '#d33682',\n  violet: '#6c71c4',\n  blue: '#268bd2',\n  cyan: '#2aa198',\n  green: '#859900',\n}\n```\n\n### Resources\n\n- [Solarized Homepage](https://ethanschoonover.com/solarized/)\n- [GitHub Repository](https://github.com/altercation/solarized)\n- Available for _every major editor_\n\n![Solarized palette](https://picsum.photos/600/300?random=20)"
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
  },
  {
    "id": "technical-docs",
    "name": "Technical Docs",
    "description": "Optimized for API documentation and technical reference material.",
    "category": "sans-serif",
    "fontFamily": "Inter",
    "tailwindClasses": {
      "h1": "text-3xl font-bold mb-4 text-gray-900 pb-2 border-b-2 border-blue-500",
      "h2": "text-2xl font-bold mb-4 text-gray-900 pb-1 border-b border-gray-200",
      "h3": "text-xl font-semibold mb-3 text-gray-800",
      "h4": "text-lg font-semibold mb-3 text-gray-800",
      "h5": "text-base font-semibold mb-2 text-gray-700",
      "h6": "text-sm font-semibold mb-2 text-gray-600 uppercase tracking-wide",
      "p": "mb-3 text-base text-gray-700 leading-relaxed",
      "a": "text-blue-600 hover:text-blue-800 hover:underline",
      "img": "max-w-full my-4 rounded border border-gray-200",
      "table": "table-auto my-4 w-full text-sm",
      "strong": "font-semibold text-gray-900",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-700",
      "em": "italic text-gray-600",
      "tr": "border border-gray-200 even:bg-gray-50 odd:bg-white",
      "td": "border border-gray-200 p-2",
      "th": "border border-gray-200 p-2 bg-gray-100 font-semibold text-gray-800 text-left",
      "blockquote": "border-l-4 border-yellow-400 pl-4 my-4 text-gray-700 bg-yellow-50 py-2 rounded-r",
      "code": "bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-red-600",
      "pre": "bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-100",
      "body": "bg-white p-6 text-gray-800",
      "article": "prose max-w-none"
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
      "textColor": "#24292e",
      "accentColor": "#0366d6",
      "headingFont": "Inter",
      "bodyFont": "Inter",
      "sampleHeading": "Technical Docs",
      "sampleText": "Clean, structured layout optimized for API and technical documentation.",
      "style": "default"
    },
    "exampleContent": "# API Reference\n\nComplete reference for the Taildown REST API v2.0.\n\n## Authentication\n\nAll API requests require a valid **Bearer token** in the `Authorization` header. Tokens can be generated via the dashboard.\n\n### Obtaining a Token\n\n1. Navigate to Settings > API Keys\n2. Click \"Generate New Key\"\n3. Copy the token (shown only once)\n4. Store securely in environment variables\n\n> **Note:** API tokens expire after 90 days. Rotate them regularly to maintain security.\n\n## Endpoints\n\n| Method | Path              | Description        | Auth |\n| ------ | ----------------- | ------------------ | ---- |\n| GET    | `/api/themes`     | List all themes    | Yes  |\n| GET    | `/api/themes/:id` | Get theme by ID    | Yes  |\n| POST   | `/api/themes`     | Create a new theme | Yes  |\n| PUT    | `/api/themes/:id` | Update a theme     | Yes  |\n| DELETE | `/api/themes/:id` | Delete a theme     | Yes  |\n\n## Request Example\n\n```bash\ncurl -X GET https://api.example.com/api/themes \\\n  -H \"Authorization: Bearer YOUR_TOKEN\" \\\n  -H \"Content-Type: application/json\"\n```\n\n### Response\n\n```json\n{\n  \"data\": [\n    {\n      \"id\": \"standard-blue\",\n      \"name\": \"Standard Blue\",\n      \"category\": \"sans-serif\",\n      \"created_at\": \"2024-01-15T10:30:00Z\"\n    }\n  ],\n  \"meta\": {\n    \"total\": 25,\n    \"page\": 1,\n    \"per_page\": 10\n  }\n}\n```\n\n### Error Codes\n\n- `401` — Unauthorized: invalid or expired token\n- `404` — Not Found: resource does not exist\n- `422` — Validation Error: check request body\n- `429` — Rate Limited: max 100 req/min\n\n![API docs](https://picsum.photos/600/300?random=28)"
  },
  {
    "id": "wikipedia",
    "name": "Wikipedia",
    "description": "Encyclopedic style inspired by Wikipedia articles.",
    "category": "serif",
    "fontFamily": "PT Sans",
    "tailwindClasses": {
      "h1": "text-3xl font-normal mb-4 text-gray-900 border-b border-gray-300 pb-1",
      "h2": "text-2xl font-normal mb-3 text-gray-900 border-b border-gray-300 pb-1",
      "h3": "text-xl font-bold mb-3 text-gray-900",
      "h4": "text-lg font-bold mb-2 text-gray-900",
      "h5": "text-base font-bold mb-2 text-gray-800",
      "h6": "text-sm font-bold mb-2 text-gray-700",
      "p": "mb-3 text-base text-gray-800 leading-7",
      "a": "text-blue-700 hover:underline",
      "img": "max-w-full my-4 border border-gray-300 p-1 bg-gray-50",
      "table": "table-auto my-4 w-full text-sm",
      "strong": "font-bold",
      "ul": "list-disc list-inside",
      "ol": "list-decimal list-inside",
      "li": "mb-1 text-gray-800 leading-7",
      "em": "italic",
      "tr": "border border-gray-300 even:bg-blue-50 odd:bg-white",
      "td": "border border-gray-300 p-2",
      "th": "border border-gray-300 p-2 bg-blue-100 font-bold text-gray-900 text-left",
      "blockquote": "border-l-4 border-blue-400 pl-4 my-4 text-gray-700 bg-blue-50 py-2 rounded-r italic",
      "code": "bg-gray-100 px-1 py-0.5 rounded font-mono text-sm text-gray-800 border border-gray-200",
      "pre": "bg-gray-50 p-4 rounded overflow-x-auto border border-gray-200",
      "body": "bg-white p-6 text-gray-800",
      "article": "prose max-w-none"
    },
    "behaviorConfig": {
      "shouldOpenLinksInNewTab": true,
      "shouldShowLineNumbers": false
    },
    "fontConfig": {
      "fontFamily": "PT Sans"
    },
    "preview": {
      "bgColor": "#ffffff",
      "textColor": "#202122",
      "accentColor": "#3366cc",
      "headingFont": "PT Sans",
      "bodyFont": "PT Sans",
      "sampleHeading": "Wikipedia",
      "sampleText": "Encyclopedic knowledge in a familiar, trusted format.",
      "style": "default"
    },
    "exampleContent": "# Markdown (formatting language)\n\n**Markdown** is a lightweight markup language for creating formatted text using a plain-text editor. John Gruber created Markdown in 2004 as a markup language that is easy to read in its source code form.\n\n## History\n\nMarkdown was inspired by pre-existing conventions for marking up **plain text** in email and Usenet posts, such as the earlier markup languages setext and Textile.\n\n### Development Timeline\n\n1. 2004 — John Gruber publishes first Markdown specification\n2. 2012 — CommonMark standardization effort begins\n3. 2014 — GitHub Flavored Markdown (GFM) formalized\n4. 2017 — CommonMark specification reaches 0.28\n\n> \"The overriding design goal for Markdown's formatting syntax is to make it as readable as possible.\"\n> — John Gruber\n\n## Syntax Overview\n\n| Element | Markdown Syntax | HTML Output                 |\n| ------- | --------------- | --------------------------- |\n| Heading | `# Heading`     | `<h1>Heading</h1>`          |\n| Bold    | `**bold**`      | `<strong>bold</strong>`     |\n| Italic  | `*italic*`      | `<em>italic</em>`           |\n| Link    | `[text](url)`   | `<a href=\"url\">text</a>`    |\n| Image   | `![alt](url)`   | `<img src=\"url\" alt=\"alt\">` |\n| Code    | `` `code` ``    | `<code>code</code>`         |\n\n## Implementations\n\n```javascript\n// Example: Simple Markdown to HTML converter\nfunction parseMarkdown(text) {\n  return text\n    .replace(/^### (.*$)/gim, '<h3>$1</h3>')\n    .replace(/^## (.*$)/gim, '<h2>$1</h2>')\n    .replace(/^# (.*$)/gim, '<h1>$1</h1>')\n    .replace(/\\*\\*(.*)\\*\\*/gim, '<strong>$1</strong>')\n    .replace(/\\*(.*)\\*/gim, '<em>$1</em>')\n}\n```\n\n### See Also\n\n- [CommonMark Specification](https://commonmark.org)\n- [GitHub Flavored Markdown](https://github.github.com/gfm/)\n- _reStructuredText_, another popular markup language\n\n![Wikipedia logo](https://picsum.photos/600/300?random=35)"
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

import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [typography],
  safelist: [
    // Allow all text colors for dynamic styling (with dark mode variants)
    { pattern: /^text-/, variants: ['dark', 'hover'] },
    { pattern: /^bg-/, variants: ['dark', 'even', 'odd', 'hover'] },
    { pattern: /^border-/, variants: ['dark', 'hover'] },
    { pattern: /^font-/ },
    { pattern: /^mb-/ },
    { pattern: /^mt-/ },
    { pattern: /^my-/ },
    { pattern: /^mx-/ },
    { pattern: /^p-/ },
    { pattern: /^px-/ },
    { pattern: /^py-/ },
    { pattern: /^rounded/ },
    { pattern: /^max-w-/ },
    { pattern: /^min-w-/ },
    { pattern: /^w-/ },
    { pattern: /^h-/ },
    { pattern: /^list-/ },
    { pattern: /^table-/ },
    { pattern: /^overflow-/ },
    { pattern: /^underline$/, variants: ['hover'] },
  ],
}

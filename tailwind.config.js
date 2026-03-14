/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
  safelist: [
    // Allow all text colors for dynamic styling (with dark mode variants)
    { pattern: /^text-/, variants: ['dark'] },
    { pattern: /^bg-/, variants: ['dark', 'even', 'odd'] },
    { pattern: /^border-/, variants: ['dark'] },
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
    { pattern: /^hover:/ },
  ],
}

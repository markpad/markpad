---
id: retro-terminal
name: Retro Terminal
description: Green-on-black CRT terminal aesthetic from the 80s/90s.
category: monospace
fontFamily: Ubuntu

preview:
  bgColor: '#0c0c0c'
  textColor: '#33ff33'
  accentColor: '#33ff33'
  headingFont: Ubuntu
  bodyFont: Ubuntu
  sampleHeading: '> TERMINAL_'
  sampleText: "C:\\> Green phosphor glow on a CRT monitor."
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-green-400 uppercase tracking-wider
  h2: text-2xl font-bold mb-4 text-green-400 uppercase
  h3: text-xl font-bold mb-3 text-green-300
  h4: text-lg font-bold mb-3 text-green-300
  h5: text-base font-bold mb-2 text-green-300
  h6: text-sm font-bold mb-2 text-green-300
  p: mb-3 text-base leading-relaxed text-green-300
  a: text-green-200 hover:text-white hover:underline
  img: max-w-full my-4 border border-green-800 rounded
  table: table-auto my-4 w-full
  strong: font-bold text-green-200
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-green-300
  em: italic text-green-200
  tr: border border-green-900 even:bg-gray-900 odd:bg-black
  td: border border-green-900 p-2
  th: border border-green-900 p-2 bg-green-900 font-bold text-green-200
  blockquote: border-l-4 border-green-500 pl-4 italic my-4 text-green-200 bg-gray-900 py-2 rounded-r
  code: bg-black px-1.5 py-0.5 rounded font-mono text-sm text-green-400 border border-green-900
  pre: bg-black p-4 rounded overflow-x-auto border border-green-900
  body: bg-black p-6 text-green-400
  article: prose prose-invert max-w-none
---

# > SYSTEM TERMINAL v2.4

Connection established. Welcome, operator.

## > SYSTEM STATUS

The **Retro Terminal** theme brings back the golden age of computing. Green phosphor characters on pure black — the way legends were built.

### > FEATURES

1. Authentic CRT green monochrome
2. Monospace typography throughout
3. Command-line aesthetic
4. Minimal visual distractions

> SYSTEM MESSAGE: "In the beginning, there was the command line."
> — Neal Stephenson

## > PROCESS TABLE

| PID | Process  | Status  | Memory |
| --- | -------- | ------- | ------ |
| 001 | kernel   | RUNNING | 64K    |
| 002 | shell    | RUNNING | 16K    |
| 003 | editor   | ACTIVE  | 32K    |
| 004 | compiler | IDLE    | 128K   |

## > SAMPLE PROGRAM

```bash
#!/bin/bash
echo "=== SYSTEM BOOT ==="
echo "Initializing kernel..."
sleep 1
echo "Loading drivers..."
sleep 1
echo "Starting shell..."

for i in $(seq 1 10); do
  echo "Process $i started [OK]"
done

echo "=== READY ==="
```

### > REFERENCES

- [Unix Heritage Society](https://example.com)
- [VT100 Terminal Reference](https://example.com)
- System uptime: _847 days, 14 hours_

![Terminal](https://picsum.photos/600/300?random=27)

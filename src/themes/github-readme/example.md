# markpad

A markdown editor with live preview and Tailwind CSS styling.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- Live markdown preview with **Tailwind CSS** classes
- Theme gallery with 25+ presets
- URL-based state sharing
- Custom style panel with autocomplete

> **Note:** This project is under active development. Contributions welcome!

## Quick Start

### Prerequisites

1. Node.js 18+
2. npm or yarn
3. A modern browser

### Installation

```bash
git clone https://github.com/teles/markpad.git
cd markpad
npm install
npm start
```

## Usage

| Feature | Shortcut | Description         |
| ------- | -------- | ------------------- |
| Bold    | `Ctrl+B` | Toggle bold text    |
| Preview | `Ctrl+P` | Toggle preview mode |
| Save    | `Ctrl+S` | Save to URL         |
| Theme   | `Ctrl+T` | Open theme selector |

## Contributing

```bash
# Fork the repository
git checkout -b feature/my-feature
npm test
git commit -m "feat: add my feature"
git push origin feature/my-feature
```

### Project Structure

- `src/components/` — React components
- `src/themes/` — Theme definitions
- `src/hooks/` — Custom React hooks
- `src/services/` — _Business logic_

## License

MIT — see [LICENSE](https://opensource.org/licenses/MIT) for details.

![Screenshot](https://picsum.photos/600/300?random=34)

# Monokai Theme

The color scheme that shaped modern code editing.

## History

Monokai was created by **Wimer Hazenberg** in 2006. It quickly became the default theme for Sublime Text and one of the most popular themes across all code editors.

### Why Developers Love It

1. Vibrant colors on a dark canvas
2. Excellent syntax differentiation
3. Comfortable for extended sessions
4. Instantly recognizable aesthetic

> "If you've ever coded, you've probably used Monokai."

## Signature Colors

| Color  | Hex       | Used For   |
| ------ | --------- | ---------- |
| Pink   | `#f92672` | Keywords   |
| Green  | `#a6e22e` | Strings    |
| Yellow | `#e6db74` | Classes    |
| Orange | `#fd971f` | Parameters |
| Purple | `#ae81ff` | Numbers    |
| Blue   | `#66d9ef` | Built-ins  |

## Code Example

```javascript
class MonokaiTheme {
  constructor() {
    this.name = 'Monokai'
    this.type = 'dark'
    this.colors = {
      background: '#272822',
      foreground: '#f8f8f2',
    }
  }

  apply(editor) {
    return editor.setTheme(this)
  }
}
```

### Ecosystem

- Sublime Text default
- Available for _VS Code, Vim, Emacs, IntelliJ_
- Inspired dozens of derivative themes

![Code editor](https://picsum.photos/600/300?random=24)
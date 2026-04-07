# markpad(1)

## NAME

`markpad` - markdown editor with theme presets and publishing tools.

## SYNOPSIS

`markpad [command] [options]`

## COMMANDS

- `markpad open <path>` open an existing markdown file.
- `markpad export --format=pdf` generate a print-ready PDF.
- `markpad publish --draft` create a reviewable public draft.

## OPTIONS

| Flag | Description |
| --- | --- |
| `--theme <id>` | Apply theme before rendering output. |
| `--title <text>` | Override document title for export. |
| `--watch` | Re-render automatically on content changes. |

> Use `markpad help <command>` for command-specific usage.

# PR #128 Review

## Summary

Refactors theme loading to reduce startup cost and simplify fallback behavior.

## Highlights

- Added memoized parser for generated theme metadata.
- Removed duplicate category normalization paths.
- Updated snapshot tests for compact card rendering.

## Risk Matrix

| Area | Impact | Mitigation |
| --- | --- | --- |
| Theme search | Medium | Added regression tests for query + category |
| Preview render | Low | Existing visual tests preserved |
| URL state | Medium | Validate backwards-compatible decode |

> Watch for stale cache keys when switching rapidly between custom and preset themes.

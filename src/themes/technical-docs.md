---
id: technical-docs
name: Technical Docs
description: Optimized for API documentation and technical reference material.
category: sans-serif
fontFamily: Inter

preview:
  bgColor: '#ffffff'
  textColor: '#24292e'
  accentColor: '#0366d6'
  headingFont: Inter
  bodyFont: Inter
  sampleHeading: Technical Docs
  sampleText: Clean, structured layout optimized for API and technical documentation.
  style: default

behavior:
  shouldOpenLinksInNewTab: true
  shouldShowLineNumbers: true

classes:
  h1: text-3xl font-bold mb-4 text-gray-900 pb-2 border-b-2 border-blue-500
  h2: text-2xl font-bold mb-4 text-gray-900 pb-1 border-b border-gray-200
  h3: text-xl font-semibold mb-3 text-gray-800
  h4: text-lg font-semibold mb-3 text-gray-800
  h5: text-base font-semibold mb-2 text-gray-700
  h6: text-sm font-semibold mb-2 text-gray-600 uppercase tracking-wide
  p: mb-3 text-base text-gray-700 leading-relaxed
  a: text-blue-600 hover:text-blue-800 hover:underline
  img: max-w-full my-4 rounded border border-gray-200
  table: table-auto my-4 w-full text-sm
  strong: font-semibold text-gray-900
  ul: list-disc list-inside
  ol: list-decimal list-inside
  li: mb-1 text-gray-700
  em: italic text-gray-600
  tr: border border-gray-200 even:bg-gray-50 odd:bg-white
  td: border border-gray-200 p-2
  th: border border-gray-200 p-2 bg-gray-100 font-semibold text-gray-800 text-left
  blockquote: border-l-4 border-yellow-400 pl-4 my-4 text-gray-700 bg-yellow-50 py-2 rounded-r
  code: bg-gray-100 px-1.5 py-0.5 rounded font-mono text-sm text-red-600
  pre: bg-gray-900 p-4 rounded-lg overflow-x-auto text-gray-100
  body: bg-white p-6 text-gray-800
  article: prose max-w-none
---

# API Reference

Complete reference for the Marklab REST API v2.0.

## Authentication

All API requests require a valid **Bearer token** in the `Authorization` header. Tokens can be generated via the dashboard.

### Obtaining a Token

1. Navigate to Settings > API Keys
2. Click "Generate New Key"
3. Copy the token (shown only once)
4. Store securely in environment variables

> **Note:** API tokens expire after 90 days. Rotate them regularly to maintain security.

## Endpoints

| Method | Path              | Description        | Auth |
| ------ | ----------------- | ------------------ | ---- |
| GET    | `/api/themes`     | List all themes    | Yes  |
| GET    | `/api/themes/:id` | Get theme by ID    | Yes  |
| POST   | `/api/themes`     | Create a new theme | Yes  |
| PUT    | `/api/themes/:id` | Update a theme     | Yes  |
| DELETE | `/api/themes/:id` | Delete a theme     | Yes  |

## Request Example

```bash
curl -X GET https://api.example.com/api/themes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Response

```json
{
  "data": [
    {
      "id": "standard-blue",
      "name": "Standard Blue",
      "category": "sans-serif",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "per_page": 10
  }
}
```

### Error Codes

- `401` — Unauthorized: invalid or expired token
- `404` — Not Found: resource does not exist
- `422` — Validation Error: check request body
- `429` — Rate Limited: max 100 req/min

![API docs](https://picsum.photos/600/300?random=28)

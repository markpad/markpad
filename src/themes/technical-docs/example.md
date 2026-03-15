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
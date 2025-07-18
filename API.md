# API Documentation

This document describes the REST API endpoints available in the AI News Aggregator.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Endpoints

### Stories

#### GET /api/stories
Retrieves all aggregated news stories.

**Response Format:**
```json
{
  "stories": [
    {
      "id": 1,
      "title": "AI breakthrough in medical diagnosis",
      "description": "Researchers develop new AI system...",
      "url": "https://example.com/article",
      "imageUrl": "https://example.com/image.jpg",
      "publishedAt": "2025-01-18T10:00:00Z",
      "source": {
        "name": "TechCrunch",
        "url": "https://techcrunch.com"
      },
      "category": "healthcare",
      "aiSummary": "AI-generated summary of the article...",
      "duplicateCount": 3,
      "sources": ["TechCrunch", "Wired", "Reuters"]
    }
  ]
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

#### GET /api/stories/:id
Retrieves a specific story by ID.

**Parameters:**
- `id` (number) - Story ID

**Response Format:**
```json
{
  "story": {
    "id": 1,
    "title": "AI breakthrough in medical diagnosis",
    "description": "Researchers develop new AI system...",
    "url": "https://example.com/article",
    "imageUrl": "https://example.com/image.jpg",
    "publishedAt": "2025-01-18T10:00:00Z",
    "source": {
      "name": "TechCrunch",
      "url": "https://techcrunch.com"
    },
    "category": "healthcare",
    "aiSummary": "AI-generated summary of the article...",
    "duplicateCount": 3,
    "sources": ["TechCrunch", "Wired", "Reuters"]
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `404 Not Found` - Story not found
- `500 Internal Server Error` - Server error

### API Usage

#### GET /api/usage
Retrieves API usage statistics.

**Response Format:**
```json
{
  "usage": {
    "newsApiCalls": 150,
    "anthropicCalls": 75,
    "socialPilotCalls": 10,
    "dailyLimits": {
      "newsApi": 900,
      "anthropic": 1000,
      "socialPilot": 500
    },
    "lastUpdated": "2025-01-18T10:00:00Z"
  }
}
```

**Status Codes:**
- `200 OK` - Success
- `500 Internal Server Error` - Server error

### Social Media

#### POST /api/social/post
Creates a social media post via Social Pilot.

**Request Body:**
```json
{
  "content": "Check out this AI news: Amazing breakthrough in...",
  "platforms": ["twitter", "linkedin"],
  "storyId": 123
}
```

**Response Format:**
```json
{
  "success": true,
  "postId": "sp_12345",
  "message": "Post created successfully",
  "platforms": ["twitter", "linkedin"]
}
```

**Status Codes:**
- `201 Created` - Post created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Social Pilot API key missing or invalid
- `500 Internal Server Error` - Server error

### Health Check

#### GET /api/health
Returns the health status of the application and its dependencies.

**Response Format:**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-18T10:00:00Z",
  "uptime": 3600,
  "apis": {
    "news": "connected",
    "anthropic": "connected",
    "socialpilot": "connected"
  },
  "storage": {
    "status": "healthy",
    "storiesCount": 150,
    "lastUpdate": "2025-01-18T09:30:00Z"
  }
}
```

**Status Codes:**
- `200 OK` - All systems healthy
- `503 Service Unavailable` - One or more services are down

## Error Handling

All endpoints return consistent error responses in the following format:

```json
{
  "error": {
    "code": "STORY_NOT_FOUND",
    "message": "Story with ID 123 not found",
    "details": "The requested story does not exist in the database"
  }
}
```

### Common Error Codes

- `STORY_NOT_FOUND` - Requested story does not exist
- `API_RATE_LIMIT_EXCEEDED` - API rate limit exceeded
- `INVALID_REQUEST_DATA` - Request data validation failed
- `EXTERNAL_API_ERROR` - External API service error
- `INTERNAL_SERVER_ERROR` - Internal server error

## Rate Limiting

The API implements rate limiting to protect against abuse:

- **News API**: 5 requests per minute
- **Anthropic API**: 50 requests per minute
- **Social Pilot API**: 10 requests per minute

When rate limits are exceeded, the API returns a `429 Too Many Requests` status code with a `Retry-After` header.

## Data Models

### Story Model
```typescript
interface Story {
  id: number;
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category: 'general' | 'healthcare' | 'financial';
  aiSummary?: string;
  duplicateCount: number;
  sources: string[];
}
```

### Usage Model
```typescript
interface Usage {
  newsApiCalls: number;
  anthropicCalls: number;
  socialPilotCalls: number;
  dailyLimits: {
    newsApi: number;
    anthropic: number;
    socialPilot: number;
  };
  lastUpdated: string;
}
```

## Examples

### Fetch All Stories
```bash
curl -X GET http://localhost:5000/api/stories
```

### Fetch Specific Story
```bash
curl -X GET http://localhost:5000/api/stories/123
```

### Create Social Media Post
```bash
curl -X POST http://localhost:5000/api/social/post \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Amazing AI breakthrough in healthcare!",
    "platforms": ["twitter", "linkedin"],
    "storyId": 123
  }'
```

### Check Health
```bash
curl -X GET http://localhost:5000/api/health
```

## Integration Examples

### JavaScript/Node.js
```javascript
const API_BASE = 'http://localhost:5000/api';

// Fetch stories
async function fetchStories() {
  const response = await fetch(`${API_BASE}/stories`);
  const data = await response.json();
  return data.stories;
}

// Create social post
async function createSocialPost(content, platforms, storyId) {
  const response = await fetch(`${API_BASE}/social/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      platforms,
      storyId,
    }),
  });
  return response.json();
}
```

### Python
```python
import requests

API_BASE = 'http://localhost:5000/api'

def fetch_stories():
    response = requests.get(f'{API_BASE}/stories')
    return response.json()['stories']

def create_social_post(content, platforms, story_id):
    data = {
        'content': content,
        'platforms': platforms,
        'storyId': story_id
    }
    response = requests.post(f'{API_BASE}/social/post', json=data)
    return response.json()
```

## WebSocket API (Future Enhancement)

The application is designed to support WebSocket connections for real-time updates. This feature will be implemented in a future release.

**Planned WebSocket Events:**
- `story:new` - New story added
- `story:updated` - Story updated
- `usage:updated` - API usage statistics updated
- `health:changed` - Health status changed

## Versioning

The API currently uses implicit versioning. Future versions will include explicit version numbers in the URL path:

- `v1`: `/api/v1/stories`
- `v2`: `/api/v2/stories`

## Support

For API support and questions:
- Review this documentation
- Check the [main README](README.md)
- Open an issue on GitHub
- Join our community discussions
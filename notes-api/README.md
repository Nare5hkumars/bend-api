# Notes Management API

A RESTful API for managing notes with full CRUD operations, built with Node.js, Express, and MongoDB.

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running on `localhost:27017`

## Setup

```bash
git clone <repo-url>
cd notes-api
npm install
npm start
```

Server runs on `http://localhost:4000`.

## API Endpoints

### Create a Note

```http
POST /notes
Content-Type: application/json

{
  "title": "My Note",
  "content": "This is the note content."
}
```

**Response:** `201 Created`

### Get All Notes

```http
GET /notes
```

**Response:** `200 OK` — Array of notes sorted by newest first.

### Get a Note by ID

```http
GET /notes/:id
```

**Response:** `200 OK` — Single note object.

### Update a Note

```http
PUT /notes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content."
}
```

**Response:** `200 OK`

### Delete a Note

```http
DELETE /notes/:id
```

**Response:** `200 OK`

## Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Missing `title` or `content`, or invalid ID format |
| `404` | Note not found |
| `500` | Internal server error |

## Validation

Both `title` and `content` are required for `POST` and `PUT` requests. Missing fields return:

```json
{
  "message": "Validation error",
  "errors": {
    "title": "Title is required"
  }
}
```

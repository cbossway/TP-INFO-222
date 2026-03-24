# Blog API Backend

A RESTful API backend for a simple blog application built with Node.js, Express, and SQLite. This API provides complete CRUD operations for managing blog articles with comprehensive validation and Swagger documentation.

## Author

**MATAGNE DASSE PRESLIE CHANEL**  
Matricule: 23V2294  
INF222 - EC1 (Développement Backend) : Programmation Web

## Features

-  **Complete CRUD Operations**: Create, Read, Update, Delete articles
-  **Search Functionality**: Search articles by title or content
-  **Filtering**: Filter articles by category, author, or date
-  **Input Validation**: Comprehensive validation using express-validator
-  **Swagger Documentation**: Auto-generated API documentation
-  **Error Handling**: Proper HTTP status codes and error messages
-  **SQLite Database**: Lightweight, file-based database
-  **Security**: CORS and Helmet middleware for security

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework for Node.js
- **SQLite3** - Database engine
- **Swagger** - API documentation
- **Express Validator** - Input validation
- **Helmet** - Security middleware
- **CORS** - Cross-Origin Resource Sharing

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. **Clone the repository** (or download the files)
   ```bash
   git clone <repository-url>
   cd blog-api-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create the database directory**
   ```bash
   mkdir database
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` and automatically restart when files change.

### Production Mode
```bash
npm start
```
The server will start on `http://localhost:3000`.

## API Documentation

Once the server is running, you can access the interactive Swagger documentation at:
```
http://localhost:3000/api-docs
```

## API Endpoints

### Base URL
```
http://localhost:3000/api/articles
```

### Available Endpoints

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| POST | `/api/articles` | Create a new article | - |
| GET | `/api/articles` | Get all articles (with optional filtering) | `category`, `author`, `date` |
| GET | `/api/articles/search` | Search articles by title or content | `query` (required) |
| GET | `/api/articles/{id}` | Get a single article by ID | - |
| PUT | `/api/articles/{id}` | Update an article by ID | - |
| DELETE | `/api/articles/{id}` | Delete an article by ID | - |

### Health Check
```
GET http://localhost:3000/health
```

## Request/Response Examples

### Create an Article
**Request:**
```bash
POST /api/articles
Content-Type: application/json

{
  "title": "Getting Started with Node.js",
  "content": "This is a comprehensive guide to Node.js development...",
  "author": "John Doe",
  "date": "2026-03-18",
  "category": "Technology",
  "tags": ["nodejs", "javascript", "backend"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": {
    "id": 1,
    "title": "Getting Started with Node.js",
    "content": "This is a comprehensive guide to Node.js development...",
    "author": "John Doe",
    "date": "2026-03-18",
    "category": "Technology",
    "tags": ["nodejs", "javascript", "backend"],
    "created_at": "2026-03-18T10:00:00.000Z",
    "updated_at": "2026-03-18T10:00:00.000Z"
  }
}
```

### Get All Articles
**Request:**
```bash
GET /api/articles?category=Technology&author=John%20Doe
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Node.js",
      "content": "This is a comprehensive guide to Node.js development...",
      "author": "John Doe",
      "date": "2026-03-18",
      "category": "Technology",
      "tags": ["nodejs", "javascript", "backend"],
      "created_at": "2026-03-18T10:00:00.000Z",
      "updated_at": "2026-03-18T10:00:00.000Z"
    }
  ]
}
```

### Search Articles
**Request:**
```bash
GET /api/articles/search?query=Node.js
```

**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "query": "Node.js",
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Node.js",
      "content": "This is a comprehensive guide to Node.js development...",
      "author": "John Doe",
      "date": "2026-03-18",
      "category": "Technology",
      "tags": ["nodejs", "javascript", "backend"],
      "created_at": "2026-03-18T10:00:00.000Z",
      "updated_at": "2026-03-18T10:00:00.000Z"
    }
  ]
}
```

### Update an Article
**Request:**
```bash
PUT /api/articles/1
Content-Type: application/json

{
  "title": "Updated: Getting Started with Node.js",
  "content": "Updated content about Node.js development...",
  "category": "Programming"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": {
    "id": 1,
    "title": "Updated: Getting Started with Node.js",
    "content": "Updated content about Node.js development...",
    "author": "John Doe",
    "date": "2026-03-18",
    "category": "Programming",
    "tags": ["nodejs", "javascript", "backend"],
    "created_at": "2026-03-18T10:00:00.000Z",
    "updated_at": "2026-03-18T11:00:00.000Z"
  }
}
```

### Delete an Article
**Request:**
```bash
DELETE /api/articles/1
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## Data Model

### Article Schema
```javascript
{
  id: Integer (auto-generated, primary key),
  title: String (required, 1-255 characters),
  content: String (required, min 1 character),
  author: String (required, 1-100 characters),
  date: String (required, ISO 8601 date format),
  category: String (required, 1-50 characters),
  tags: Array of Strings (optional),
  created_at: DateTime (auto-generated),
  updated_at: DateTime (auto-updated)
}
```

## Error Handling

The API returns appropriate HTTP status codes:

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Validation error or malformed request
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "success": false,
  "error": "Error Type",
  "message": "Detailed error message",
  "details": [/* Validation errors array (for 400 errors) */]
}
```

## Project Structure

```
blog-api-backend/
├── config/
│   └── database.js          # Database configuration and connection
├── controllers/
│   └── articleController.js # Article controller with business logic
├── models/
│   └── Article.js           # Article model with database operations
├── routes/
│   └── articles.js          # Article routes with Swagger documentation
├── database/                # SQLite database files (auto-created)
├── node_modules/            # Node.js dependencies
├── package.json             # Project dependencies and scripts
├── server.js                # Main application entry point
└── README.md               # This file
```

## Testing the API

### Using curl Examples

1. **Create an article:**
   ```bash
   curl -X POST http://localhost:3000/api/articles \
   -H "Content-Type: application/json" \
   -d '{
     "title": "My First Blog Post",
     "content": "This is the content of my blog post...",
     "author": "Preslie Chanel",
     "date": "2026-03-18",
     "category": "Personal",
     "tags": ["blog", "first", "personal"]
   }'
   ```

2. **Get all articles:**
   ```bash
   curl http://localhost:3000/api/articles
   ```

3. **Search articles:**
   ```bash
   curl "http://localhost:3000/api/articles/search?query=blog"
   ```

4. **Get specific article:**
   ```bash
   curl http://localhost:3000/api/articles/1
   ```

5. **Update an article:**
   ```bash
   curl -X PUT http://localhost:3000/api/articles/1 \
   -H "Content-Type: application/json" \
   -d '{
     "title": "Updated Blog Post Title",
     "content": "Updated content..."
   }'
   ```

6. **Delete an article:**
   ```bash
   curl -X DELETE http://localhost:3000/api/articles/1
   ```

### Using Postman

1. Import the collection using the Swagger UI at `http://localhost:3000/api-docs`
2. Or manually configure requests using the examples above

## Deployment (Optional)

### Railway
1. Create a Railway account
2. Connect your GitHub repository
3. Railway will automatically detect the Node.js application
4. Set the PORT environment variable (Railway does this automatically)
5. Deploy!

### Render
1. Create a Render account
2. Connect your GitHub repository
3. Select "Web Service"
4. Configure build settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Deploy!

## Environment Variables

- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment mode (development/production)

## License

This project is licensed under the MIT License.

## Contributing

Feel free to submit issues and enhancement requests!

---

**Note**: This project was developed as part of the INF222 - EC1 (Développement Backend) course assignment at the university.

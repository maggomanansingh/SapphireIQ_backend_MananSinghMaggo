# Notes Task API (Manan Singh Maggo)

A RESTful Notes/Task API built with **Node.js, Express, MongoDB, and Mongoose**.

The project provides user authentication with Express sessions and user-specific note management. Each authenticated user can create, view, update, and delete only their own notes.

### Currently using local MONGO DB url (mongodb://127.0.0.1:27017/notes_task_db) while deployement we can create a cluster on MONGO DB

## Features

* Express REST API
* MongoDB database with Mongoose
* User registration and login
* Password hashing with bcrypt
* Session-based authentication
* Protected note routes
* User-specific note ownership
* Complete Notes CRUD
* Request validation with express-validator
* Centralized error handling
* Filtering notes by completion status
* Sorting notes
* Pagination
* Environment-based configuration
* Consistent JSON API responses

## Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **Express Session**
* **bcrypt**
* **express-validator**
* **dotenv**
* **Nodemon** for development

## Project Structure

```text
notes-task-api/
│
├── src/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   └── note.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   └── note.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── note.routes.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   └── note.validator.js
│   │
│   └── app.js
│
├── server.js
├── package.json
├── package-lock.json
├── .env
└── .gitignore
```

## Installation

Clone or download the project and install the dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/notes_task_db
SESSION_SECRET=ashbdnuhkbjhhsahncjndcnu
```

### Environment variables

| Variable         | Description                               |
| ---------------- | ----------------------------------------- |
| `PORT`           | Port on which the Express server runs     |
| `MONGO_URI`      | MongoDB connection string                 |
| `SESSION_SECRET` | Secret used to sign the session ID cookie |


## Running the Application

### Start

```bash
npm start
```

The server will start at:

```text
http://localhost:5000
```

## Health Check

### Check server status

```http
GET /api/health
```

Example response:

```json
{
  "success": true,
  "message": "Server is running"
}
```

---

# Authentication API

Authentication is session-based.

After a successful login, the server stores the authenticated user's ID in:

```js
req.session.userId
```

The client does not need to send a user ID when creating notes.

## Register

```http
POST /api/auth/register
```

### Request

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

Passwords are hashed before being stored in MongoDB.

---

## Login

```http
POST /api/auth/login
```

### Request

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

A session is created after successful authentication.

---

## Get Current User

```http
GET /api/auth/me
```

Requires authentication.

### Success Response

**200 OK**

```json
{
  "success": true,
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

---

## Logout

```http
POST /api/auth/logout
```

Requires authentication.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

The session is destroyed after logout.

---

# Notes API

All Notes endpoints require authentication.

A note belongs to the user who created it.

The client **must not provide the `user` field** when creating a note. The server obtains the user ID from the authenticated session.

## Create Note

```http
POST /api/notes
```

### Request

```json
{
  "title": "Learn Express",
  "content": "Build a REST API with Express and MongoDB",
  "completed": false
}
```

### Success Response

**201 Created**

```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "NOTE_ID",
    "user": "USER_ID",
    "title": "Learn Express",
    "content": "Build a REST API with Express and MongoDB",
    "completed": false,
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}
```

---

## Get All Notes

```http
GET /api/notes
```

Returns notes belonging only to the authenticated user.

### Filtering

Filter by completion status:

```http
GET /api/notes?completed=true
```

or:

```http
GET /api/notes?completed=false
```

### Sorting

Supported sort options:

```text
createdAt
-createdAt
title
-title
completed
-completed
```

Example:

```http
GET /api/notes?sort=-createdAt
```

### Pagination

Use `page` and `limit`:

```http
GET /api/notes?page=2&limit=10
```

The maximum allowed limit is `100`.

### Combine Query Parameters

Example:

```http
GET /api/notes?completed=false&sort=-createdAt&page=1&limit=10
```

### Success Response

**200 OK**

```json
{
  "success": true,
  "notes": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

## Get Note by ID

```http
GET /api/notes/:id
```

Example:

```http
GET /api/notes/NOTE_ID
```

The note must belong to the authenticated user.

### Success Response

**200 OK**

```json
{
  "success": true,
  "note": {
    "_id": "NOTE_ID",
    "user": "USER_ID",
    "title": "Learn Express",
    "content": "Build a REST API",
    "completed": false,
    "createdAt": "DATE",
    "updatedAt": "DATE"
  }
}
```

---

## Update Note

```http
PUT /api/notes/:id
```

The update supports partial updates.

### Update title only

```json
{
  "title": "Learn Express and MongoDB"
}
```

### Update completion status

```json
{
  "completed": true
}
```

### Update multiple fields

```json
{
  "title": "Updated title",
  "content": "Updated content",
  "completed": true
}
```

At least one field must be provided.

The authenticated user must own the note.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {}
}
```

---

## Delete Note

```http
DELETE /api/notes/:id
```

The authenticated user must own the note.

### Success Response

**200 OK**

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

# Authorization and Note Ownership

Authentication and authorization are handled separately.

### Authentication

The session determines which user is logged in:

```js
req.session.userId
```

### Authorization

Note queries include both the note ID and the authenticated user's ID:

```js
{
  _id: id,
  user: req.session.userId
}
```

This prevents one user from accessing or modifying another user's notes.

For example, if User A attempts to access a note belonging to User B, the API will return:

```text
404 Not Found
```

rather than exposing User B's note.

---

# Validation

Input validation is handled using `express-validator`.

Examples of validated fields include:

### User

* Name is required
* Name must be between 2 and 50 characters
* Email must be valid
* Password must be at least 8 characters

### Notes

* Title is required when creating a note
* Title cannot exceed 100 characters
* Content is required when creating a note
* Content cannot exceed 5000 characters
* `completed` must be a boolean

### Query Parameters

* `page` must be a positive integer
* `limit` must be between 1 and 100
* `completed` must be `true` or `false`
* `sort` must use a supported sort option

Invalid requests return:

**400 Bad Request**

Example:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

---

# Error Handling

The API uses centralized error-handling middleware.

Handled errors include:

| Status | Meaning                           |
| -----: | --------------------------------- |
|  `200` | Successful request                |
|  `201` | Resource created                  |
|  `400` | Invalid request/validation/ID     |
|  `401` | Authentication required           |
|  `404` | Resource not found                |
|  `409` | Duplicate resource, such as email |
|  `500` | Internal server error             |

Mongoose validation errors, duplicate-key errors, invalid ObjectIds, and unexpected errors are handled centrally.

---

# Database Models

## User

The User model contains:

```text
name
email
password
createdAt
updatedAt
```

The password is stored as a bcrypt hash and is excluded from normal queries.

## Note

The Note model contains:

```text
user
title
content
completed
createdAt
updatedAt
```

Each note references one User through a MongoDB ObjectId.

An index is used for efficient user-specific note queries:

```js
{
  user: 1,
  createdAt: -1
}
```

---

# Testing Flow

A recommended API testing sequence is:

1. Check `GET /api/health`
2. Register a user
3. Login
4. Check `GET /api/auth/me`
5. Create a note
6. Get all notes
7. Test filtering
8. Test sorting
9. Test pagination
10. Get a note by ID
11. Update the note
12. Delete the note
13. Logout
14. Verify protected endpoints return `401`
15. Register/login as another user
16. Verify the second user cannot access the first user's notes

---

# Security Considerations

* Passwords are hashed using bcrypt.
* Passwords are not returned in API responses.
* Authentication uses HTTP-only session cookies.
* Notes are scoped to the authenticated user.
* The client cannot assign a note to another user.
* `.env` is excluded from Git.
* Validation is performed before controller logic.
* Unexpected errors are handled centrally.

For local development, the session uses Express's default session store. A production deployment should use a persistent session store instead of the default in-memory store.

---

# Available API Routes

| Method | Endpoint             | Authentication |
| ------ | -------------------- | -------------- |
| GET    | `/api/health`        | No             |
| POST   | `/api/auth/register` | No             |
| POST   | `/api/auth/login`    | No             |
| GET    | `/api/auth/me`       | Yes            |
| POST   | `/api/auth/logout`   | Yes            |
| POST   | `/api/notes`         | Yes            |
| GET    | `/api/notes`         | Yes            |
| GET    | `/api/notes/:id`     | Yes            |
| PUT    | `/api/notes/:id`     | Yes            |
| DELETE | `/api/notes/:id`     | Yes            |

---

# Project Objective

The project demonstrates a structured Node.js REST API using Express and MongoDB/Mongoose, including CRUD operations, validation and error handling, and query features such as filtering, sorting, and pagination.

The authentication and user-specific ownership functionality extends the Notes API so that each authenticated user manages their own notes.

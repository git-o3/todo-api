# TaskMaster API

A production-ready RESTful API for managing tasks, built with Node.js, Express, and MongoDB. Features JWT authentication, role-based ownership, pagination, and clean global error handling.

![Node.js](https://img.shields.io/badge/Node.js-v18+-green) ![Express](https://img.shields.io/badge/Express-v5-blue) ![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen) ![JWT](https://img.shields.io/badge/Auth-JWT-orange)

## Features

- **JWT Authentication** — secure registration and login with 24-hour token expiry
- **Ownership Enforcement** — users can only read, update, or delete their own tasks
- **Pagination** — all task queries support `?page=1&limit=10` for optimized data retrieval
- **Password Security** — bcrypt hashing with a pre-save hook and strength validation on the schema level
- **Rate Limiting** — protects the todos endpoint from abuse
- **Global Error Handling** — `asyncHandler` + `globalErrorHandler` middleware for consistent, crash-free error responses
- **Dual Logging** — Morgan for HTTP request monitoring, Winston for system-level logs

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JSON Web Tokens + Bcrypt.js |
| Logging | Winston + Morgan |

## Project Structure

```
todo-api/
├── src/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Register and login
│   │   └── todoController.js      # CRUD + pagination
│   ├── middleware/
│   │   ├── asyncHandler.js        # Async error wrapper
│   │   ├── auth.js                # JWT verification
│   │   ├── errorHandler.js        # Global error middleware
│   │   ├── morganMiddleware.js
│   │   └── rateLimiter.js
│   ├── models/
│   │   ├── todo.js                # Todo schema (indexed)
│   │   └── user.js                # User schema + bcrypt hooks
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   ├── utils/
│   │   └── logger.js
│   └── app.js
├── server.js
├── .env
└── package.json
```

## Installation

```bash
git clone https://github.com/git-o3/todo-api.git
cd todo-api
npm install
```

## Environment Setup

Create a `.env` file in the root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/todo_db
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

## Running the Server

```bash
# Development (with Nodemon)
npm run dev

# Production
npm start
```

```
🚀 Server running in development mode on port 3000 Chief 🫡
```

## API Reference

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive a JWT |

**Register:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "John", "email": "john@example.com", "password": "secret123" }'
```

**Response:**
```json
{ "token": "eyJhbGciOiJIUzI1NiIs..." }
```

---

### Tasks (Protected — requires Bearer Token)

Add the token to every request:
```
Authorization: Bearer <your_token>
```

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/todos` | Get all your tasks (paginated) |
| POST | `/api/v1/todos` | Create a new task |
| PATCH | `/api/v1/todos/:id` | Partially update a task |
| DELETE | `/api/v1/todos/:id` | Delete a task (returns 204) |

### Health Check

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/health` | Verify the server is running |

---

## Pagination

```bash
GET /api/v1/todos?page=2&limit=5
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "total": 23,
  "pagination": {
    "page": 2,
    "limit": 5,
    "totalPages": 5
  },
  "data": [...]
}
```

Both queries — total count and paginated data — run in parallel via `Promise.all` to keep response times tight.

## Security Model

**Password hashing** — passwords are hashed with bcrypt (10 salt rounds) via a Mongoose pre-save hook. The password field is excluded from all queries by default (`select: false`) and only fetched explicitly during login.

**Ownership checks** — every update and delete operation verifies that `todo.user` matches the authenticated `req.user.id`. Mismatches return a `403 Forbidden` before any database write occurs.

**Token expiry** — JWTs are signed with a 24-hour expiry. Expired tokens are rejected by the auth middleware.

## Requirements

- Node.js v18+
- MongoDB running locally or via MongoDB Atlas

## License

MIT


Project URL: https://roadmap.sh/projects/todo-list-api


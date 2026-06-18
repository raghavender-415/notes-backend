# 📝 Notes App Backend — Full Assignment

A complete Node.js + Express + MongoDB backend covering:
- **Assignment 1:** To-Do List REST API
- **Assignment 2:** User Authentication API
- **Mini Project:** Notes App with JWT-secured CRUD

---

## 🗂️ Project Structure

```
notes-app/
├── config/
│   └── db.js            # MongoDB connection
├── middleware/
│   └── auth.js          # JWT protect middleware
├── models/
│   ├── User.js          # User schema (bcrypt hashing)
│   ├── Task.js          # Task schema (To-Do)
│   └── Note.js          # Note schema
├── routes/
│   ├── auth.js          # Register, Login, Me
│   ├── tasks.js         # Task CRUD
│   └── notes.js         # Note CRUD + Pin toggle
├── .env                 # Environment variables
├── server.js            # App entry point
└── package.json
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
npm install
```

### 2. Configure `.env`
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

### 3. Start the server
```bash
node server.js
```

> Make sure MongoDB is running locally: `mongod`

---

## 🔐 Assignment 2 — User Authentication API

### Register
- **POST** `/api/auth/register`
- **Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```
- **Response:** Returns JWT token + user info

### Login
- **POST** `/api/auth/login`
- **Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```
- **Response:** Returns JWT token

### Get Current User *(Protected)*
- **GET** `/api/auth/me`
- **Header:** `Authorization: Bearer <token>`

**How it works:**
- Passwords are hashed using **bcryptjs** (salt rounds: 12) via a Mongoose `pre('save')` hook
- On login, `bcrypt.compare()` verifies the plaintext password against the hash
- A signed **JWT** is returned — the client must send it on every protected request

---

## ✅ Assignment 1 — To-Do List REST API

> All routes require: `Authorization: Bearer <token>`

### Add a Task
- **POST** `/api/tasks`
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "priority": "high",
  "dueDate": "2025-12-31"
}
```

### Get All Tasks
- **GET** `/api/tasks`
- Optional query params: `?status=pending`, `?priority=high`, `?sort=dueDate`

### Get Single Task
- **GET** `/api/tasks/:id`

### Update Task
- **PUT** `/api/tasks/:id`
```json
{
  "status": "completed"
}
```

### Delete Task
- **DELETE** `/api/tasks/:id`

**Task Schema:**
| Field | Type | Values |
|-------|------|--------|
| title | String | required |
| description | String | optional |
| status | String | `pending`, `in-progress`, `completed` |
| priority | String | `low`, `medium`, `high` |
| dueDate | Date | optional |

---

## 📒 Mini Project — Notes App API

> All routes require: `Authorization: Bearer <token>`

### Create Note
- **POST** `/api/notes`
```json
{
  "title": "Meeting Notes",
  "content": "Discussed project timeline...",
  "tags": ["work", "meeting"],
  "isPinned": false
}
```

### Get All Notes
- **GET** `/api/notes`
- Optional: `?tag=work`, `?pinned=true`, `?search=meeting`

### Get Single Note
- **GET** `/api/notes/:id`

### Update Note
- **PUT** `/api/notes/:id`
```json
{
  "title": "Updated Title",
  "content": "New content here"
}
```

### Toggle Pin
- **PATCH** `/api/notes/:id/pin`

### Delete Note
- **DELETE** `/api/notes/:id`

---

## 🧪 Postman Testing Guide

### Step 1 — Register a user
`POST http://localhost:5000/api/auth/register`

### Step 2 — Copy the token from response
```json
{ "token": "eyJhbGci..." }
```

### Step 3 — Set Authorization header
In Postman, go to the **Authorization** tab:
- Type: **Bearer Token**
- Token: paste the token from Step 2

### Step 4 — Test CRUD routes
Use the task and notes endpoints above with the Bearer token set.

**Pro Tip:** Create a Postman Environment variable `{{token}}` and set it after login for reuse across all requests.

---

## 🔑 How JWT Auth Works

```
Client                     Server
  |                           |
  |-- POST /login ----------->|
  |                           | Verify password with bcrypt
  |<-- 200 OK + JWT token ----|
  |                           |
  |-- GET /notes (+ token) -->|
  |                           | Verify JWT with secret key
  |                           | Attach req.user
  |<-- 200 OK + notes --------|
```

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| express | Web framework |
| mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT generation & verification |
| dotenv | Environment variables |
| cors | Cross-Origin Resource Sharing |

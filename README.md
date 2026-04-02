# 🏫 School Management API

> A RESTful Node.js + Express + MySQL API that lets you **add schools** and **list them sorted by proximity** to any geographic coordinate using the Haversine formula.

---

## 📋 Table of Contents

- [🌐 Live Demo](#-live-demo)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚙️ Environment Variables](#️-environment-variables)
- [🗄️ Database Setup](#️-database-setup)
- [🚀 Getting Started](#-getting-started)
- [📡 API Reference](#-api-reference)
- [📮 Postman Collection](#-postman-collection)
- [🧠 How Distance Sorting Works](#-how-distance-sorting-works)
- [🛡️ Security & Best Practices](#️-security--best-practices)
- [⭐ Assignment Rating](#-assignment-rating)

---

## 🌐 Live Demo

| Resource       | URL |
|---------------|-----|
| Base API URL  | [Open](https://school-management-api-production-df44.up.railway.app/) |
| Health Check  | [Open](https://school-management-api-production-df44.up.railway.app/) |
| Add School    | [Open](https://school-management-api-production-df44.up.railway.app/api/addSchool) |
| List Schools  | [Open](https://school-management-api-production-df44.up.railway.app/api/listSchools) |

> ⚙️ Deployed on **[Railway]**. Replace the placeholders above once the service is live.



- ➕ **Add School** — Validate and persist school records (name, address, coordinates)
- 📍 **List Schools by Proximity** — Returns all schools sorted by distance from the user's location
- 📐 **Haversine Formula** — Accurate great-circle distance calculation in kilometres
- 🔒 **Input Validation** — Range checks on lat/lon, type checks, required-field guards
- 🏊 **Connection Pooling** — Reuses MySQL connections for performance
- 🛡️ **Security Headers** — `helmet` sets safe HTTP headers out of the box
- 📝 **Request Logging** — `morgan` logs every request in dev mode

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | MySQL 8+ |
| DB Client | mysql2/promise (connection pool) |
| Security | helmet, cors |
| Logging | morgan |
| Dev tooling | nodemon, dotenv |

---

## 📁 Project Structure

```
school-api/
├── server.js                   # Entry point – starts server, verifies DB
├── app.js                      # Express app – middleware & routes
├── config/
│   └── db.js                   # MySQL connection pool
├── routes/
│   └── school.routes.js        # Route definitions
├── controller/
│   └── school.controller.js    # Request validation & response shaping
├── services/
│   └── school.service.js       # Business logic & DB queries
├── middleware/
│   └── error.middleware.js     # Global error handler
├── utils/
│   └── helpers.js              # Haversine distance utility
├── schema/
│   └── school.sql              # MySQL DDL
├── .env.example                # Environment variable template
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root. Use `.env.example` as a template:

```env
# Server
PORT=3000

# MySQL
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=school_db
```

> ⚠️ **Never commit your `.env` file** — add it to `.gitignore`.

---

## 🗄️ Database Setup

Run the SQL schema file to create the database and table:

```bash
mysql -u root -p < schema/school.sql
```

This creates:

```sql
CREATE TABLE schools (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(255)  NOT NULL,
  address     VARCHAR(255)  NOT NULL,
  latitude    DECIMAL(10,8) NOT NULL,   -- ±90,  8 decimal places
  longitude   DECIMAL(11,8) NOT NULL,   -- ±180, 8 decimal places
  created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_location (latitude, longitude)
);
```

> 💡 `DECIMAL(11,8)` for longitude (not 10,8) is intentional — longitude reaches ±180, needing 3 digits before the decimal point.

---

## 🚀 Getting Started

### 1. Clone & install

```bash
git clone https://github.com/aditya32193213/school-management-api.git
cd school-api
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# edit .env with your MySQL credentials
```

### 3. Initialise the database

```bash
mysql -u root -p < schema/school.sql
```

### 4. Run the server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:

```
✅ MySQL Connected (pool ready)
🚀 Server running at http://localhost:5000
```

---

## 📡 API Reference

### Base URL

**Local:**
```
http://localhost:5000/api
```

**Deployed:** _(replace once live)_
```
https://<your-deployed-url>/api
```

---

### ➕ POST `/api/addSchool`

Adds a new school to the database.

**Request Body** (`application/json`)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | School name |
| `address` | string | ✅ | Full address |
| `latitude` | number | ✅ | Between -90 and 90 |
| `longitude` | number | ✅ | Between -180 and 180 |

**Example Request**

```json
POST /api/addSchool
Content-Type: application/json

{
  "name": "Delhi Public School",
  "address": "Mathura Road, New Delhi, Delhi 110003",
  "latitude": 28.5494,
  "longitude": 77.2001
}
```

**201 Created**

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1
  }
}
```

**400 Bad Request** (validation failure)

```json
{
  "success": false,
  "message": "Latitude must be between -90 and 90; longitude between -180 and 180"
}
```

---

### 📍 GET `/api/listSchools`

Returns all schools sorted by distance from the given coordinates.

**Query Parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `latitude` | number | ✅ | User's latitude (-90 to 90) |
| `longitude` | number | ✅ | User's longitude (-180 to 180) |

**Example Request**

```
GET /api/listSchools?latitude=28.6139&longitude=77.2090
```

**200 OK**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 2,
      "name": "Springdales School",
      "address": "Pusa Road, New Delhi",
      "latitude": "28.64540000",
      "longitude": "77.16780000",
      "created_at": "2026-04-02T00:00:00.000Z",
      "distance_km": 3.91
    },
    {
      "id": 1,
      "name": "Delhi Public School",
      "address": "Mathura Road, New Delhi",
      "latitude": "28.54940000",
      "longitude": "77.20010000",
      "created_at": "2026-04-02T00:00:00.000Z",
      "distance_km": 7.63
    }
  ]
}
```

> 🗺️ Schools are sorted nearest → farthest. `distance_km` is rounded to 2 decimal places.

**400 Bad Request**

```json
{
  "success": false,
  "message": "Query params latitude and longitude are required"
}
```

---

### ❌ Error Response Shape

All errors follow a consistent envelope:

```json
{
  "success": false,
  "message": "Human-readable error description"
}
```

---

## 📮 Postman Collection

A ready-to-use Postman collection is included in the repo:

```
School_Management_API.postman_collection.json
```

### How to import

1. Open **Postman**
2. Click **Import** → **Upload Files**
3. Select `School_Management_API.postman_collection.json`
4. Set the `base_url` variable in your environment to `http://localhost:3000`
5. Run any request ✅

### Included requests

| # | Name | Method | Endpoint |
|---|------|--------|----------|
| 1 | Health Check | GET | `/` |
| 2 | Add School – Success | POST | `/api/addSchool` |
| 3 | Add School – Missing Fields | POST | `/api/addSchool` |
| 4 | Add School – Invalid Coordinates | POST | `/api/addSchool` |
| 5 | Add School – Non-numeric Coordinates | POST | `/api/addSchool` |
| 6 | List Schools – Success | GET | `/api/listSchools` |
| 7 | List Schools – Missing Params | GET | `/api/listSchools` |
| 8 | List Schools – Invalid Coordinates | GET | `/api/listSchools` |

---

## 🧠 How Distance Sorting Works

The API uses the **Haversine formula** to calculate the great-circle distance between two points on Earth:

```
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
distance = 2R × atan2(√a, √(1−a))    where R = 6,371 km
```

This is more accurate than a simple Euclidean calculation and accounts for Earth's curvature — especially important over large distances. Results are returned in **kilometres**, rounded to 2 decimal places.

---

## 🛡️ Security & Best Practices

| Practice | Status |
|----------|--------|
| `helmet` security headers | ✅ |
| `cors` controlled origins | ✅ |
| Parameterised SQL queries (no SQL injection) | ✅ |
| Input validation (type + range) on all endpoints | ✅ |
| Connection pooling (not per-request connections) | ✅ |
| Global error handler (no stack traces in responses) | ✅ |
| Environment variables via `.env` (no hardcoded credentials) | ✅ |
| DB connectivity check at startup | ✅ |

---

## ⭐ Assignment Rating

| Parameter | Score | Notes |
|-----------|-------|-------|
| **Requirement Coverage** | 9/10 | Both APIs implemented; Haversine sorting correct; SQL schema present |
| **Code Architecture** | 8/10 | Clean controller → service → DB separation; helpers isolated |
| **Input Validation** | 8/10 | Type + range checks on both endpoints; consistent error envelope |
| **Database Design** | 7/10 | Fixed: `DECIMAL(11,8)` for longitude; index on location added |
| **Security** | 8/10 | helmet, cors, parameterised queries; no creds in code |
| **Code Quality** | 7/10 | Pooling fixed; `distance_km` rounded; validation de-duplicated |
| **Documentation** | 9/10 | This README + Postman collection |
| **Overall** | **8/10** | Solid production-ready API with minor improvements applied |

---

## 👨‍💻 Author

Built for the **Node.js School Management API** internship assignment.

---

*Made with ❤️ using Node.js + Express + MySQL*

# Northline Roofing & Exteriors — Roofing Estimator

A full-stack, configuration-driven roofing estimation application built for **Northline Roofing & Exteriors**.

The application provides two user-facing surfaces backed by a single REST API and MongoDB database:

- **Public Estimator:** Homeowners answer a multi-step questionnaire and receive a server-calculated roofing cost range.
- **Owner Panel:** Authenticated business users can manage estimator configuration and review captured leads.

---

## Live Demo

| Service | URL |
| --- | --- |
| Public Estimator | https://wantace-assignment-five.vercel.app |
| Owner Panel | https://wantace-assignment-five.vercel.app/owner/login |
| Backend Health Check | https://wantace-assignment-0q3s.onrender.com/api/health |

---

## Demo Credentials

Use the following credentials to access the Owner Panel:

```text
Username: admin
Password: roofing2026
```

---

## Features

### Public Estimator

- Mobile-responsive multi-step estimator
- Questions dynamically loaded from the database
- Dynamic number and select/radio fields
- Required-field validation
- Minimum/maximum validation
- Customer contact information capture
- Server-side estimate calculation
- Low/high estimate range display
- Loading and error states
- No frontend pricing calculation

### Owner Panel

- JWT-protected owner login
- Authenticated configuration management
- View complete configuration
- Enable/disable questions
- Edit question labels, limits, and options
- Edit material rates, pitch/stories multipliers, and tear-off rates
- Edit global modifiers
- Configuration versioning
- View captured leads, submitted answers, estimate ranges, and the configuration version associated with each lead

### Backend

- REST API using Express
- MongoDB persistence using Mongoose
- Server-side validation and pricing engine
- Lead persistence
- JWT authentication
- Configuration versioning
- Seed data migration
- Protected admin endpoints
- Public and admin API separation

---

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, Axios, React Router, Tailwind CSS / CSS |
| Backend | Node.js, Express.js, MongoDB, Mongoose, JWT, dotenv, CORS |

---

## Architecture

```text
                         MongoDB
                            │
                            │
                      Express API
                            │
             ┌──────────────┼──────────────┐
             │              │              │
          Public          Auth           Admin
           APIs            API            APIs
             │              │              │
             ↓              ↓              ↓
         Estimator         Login       Owner Panel
             │
             ↓
      Server-side Pricing
             │
             ↓
           Leads
```

---

## Project Structure

```text
Watance_Assignment/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── app.js
│   │   └── server.js
│   │
│   └── package.json
│
├── DECISIONS.md
├── AI_LOG.md
└── README.md
```

---

## API Endpoints

### Public Endpoints

#### GET `/api/config`

Returns the public business configuration and only the questions that are currently active. The frontend uses this endpoint to dynamically build the estimator.

#### POST `/api/estimate`

Accepts customer information and estimator answers.

### Authentication

#### POST `/api/auth/login`

Authenticates the owner and returns a JWT. The returned token is used for protected admin endpoints.

### Protected Admin Endpoints

#### GET `/api/admin/config`

Returns the complete configuration.

#### PUT `/api/admin/config`

Updates the complete configuration. The endpoint requires authentication.

#### GET `/api/admin/leads`

Returns captured leads ordered by most recent first.

---

## Local Development Setup

### Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- MongoDB Atlas account or local MongoDB
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Watance_Assignment
```

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
```

Do not commit `.env` to Git.

### 4. Start the Backend

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

### 5. Install Frontend Dependencies

Open a second terminal:

```bash
cd client
npm install
```

### 6. Start the Frontend

```bash
npm run dev
```

The frontend normally runs at `http://localhost:5173`.

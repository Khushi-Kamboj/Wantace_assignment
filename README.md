# Northline Roofing & Exteriors — Roofing Estimator

A full-stack, configuration-driven roofing estimation application built for **Northline Roofing & Exteriors**.

The application provides two user-facing surfaces backed by a single REST API and MongoDB database:

- **Public Estimator** — Homeowners answer a multi-step questionnaire and receive a server-calculated roofing cost range.
- **Owner Panel** — Authenticated business users can manage estimator configuration and review captured leads.

---

## 🚀 Live Demo

### Public Estimator
https://wantace-assignment-five.vercel.app

### Owner Panel
https://wantace-assignment-five.vercel.app/owner/login

### Backend Health Check
https://wantace-assignment-0q3s.onrender.com/api/health

---

## 🔐 Demo Credentials

Use the following credentials to access the Owner Panel:

```text
Username: admin
Password: roofing2026
```

---

# Features

## Public Estimator

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

## Owner Panel

- JWT-protected owner login
- Authenticated configuration management
- View complete configuration
- Enable/disable questions
- Edit question labels
- Edit question limits
- Edit options
- Edit material rates
- Edit pitch/stories multipliers
- Edit tear-off rates
- Edit global modifiers
- Configuration versioning
- View captured leads
- View submitted answers
- View estimate ranges
- View configuration version associated with each lead

## Backend

- REST API using Express
- MongoDB persistence using Mongoose
- Server-side validation
- Server-side pricing engine
- Lead persistence
- JWT authentication
- Configuration versioning
- Seed data migration
- Protected admin endpoints
- Public and admin API separation

---

# Tech Stack

## Frontend

- React
- Vite
- Axios
- React Router
- CSS

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- dotenv
- CORS

---

# Architecture

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

## Public Estimator Flow

```text
GET /api/config
       ↓
Fetch active configuration
       ↓
Render dynamic questions
       ↓
Multi-step estimator
       ↓
Collect contact details
       ↓
POST /api/estimate
       ↓
Backend validation
       ↓
Server-side calculation
       ↓
Store lead
       ↓
Return estimate range
       ↓
Display result
```

## Owner Panel Flow

```text
POST /api/auth/login
       ↓
JWT issued
       ↓
Authenticated Owner Panel
       ↓
GET /api/admin/config
       ↓
Edit complete configuration
       ↓
PUT /api/admin/config
       ↓
Increment config_version
       ↓
New configuration becomes active
```

---

# Project Structure

```text
Watance_Assignment/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── dynamic/
│   │   │       └── QuestionField.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Estimator.jsx
│   │   │   ├── OwnerLogin.jsx
│   │   │   └── OwnerPanel.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   ├── controllers/
│   │   │   ├── estimateController.js
│   │   │   ├── authController.js
│   │   │   ├── adminConfigController.js
│   │   │   └── adminLeadsController.js
│   │   │
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── Config.js
│   │   │   └── Lead.js
│   │   │
│   │   ├── routes/
│   │   │   ├── configRoutes.js
│   │   │   ├── estimateRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── adminConfigRoutes.js
│   │   │   └── adminLeadsRoutes.js
│   │   │
│   │   ├── seed/
│   │   │   └── seed.js
│   │   │
│   │   ├── services/
│   │   │   └── calculator.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env
│   └── package.json
│
├── DECISIONS.md
├── README.md
└── .gitignore
```

---

# API Endpoints

## Public Endpoints

### GET `/api/config`

Returns the public business configuration and only the questions that are currently active.

The frontend uses this endpoint to dynamically build the estimator.

Example response:

```json
{
  "success": true,
  "data": {
    "business": {
      "name": "Northline Roofing & Exteriors",
      "region": "Columbus, OH",
      "currency": "USD"
    },
    "questions": []
  }
}
```

---

### POST `/api/estimate`

Accepts customer information and estimator answers.

Example request:

```json
{
  "name": "Customer Name",
  "phone": "+1-614-555-0100",
  "email": "customer@example.com",
  "answers": {
    "roof_area": 2000,
    "material": "asphalt_3tab",
    "pitch": "medium",
    "layers": "1",
    "stories": "2"
  }
}
```

The backend:

1. Loads the current configuration.
2. Validates the answers.
3. Calculates the estimate.
4. Stores the lead.
5. Stores the configuration version used.
6. Returns the estimate range.

Example response:

```json
{
  "success": true,
  "data": {
    "lead_id": "65...",
    "estimate_low": 12709,
    "estimate_high": 16175,
    "config_version": 3
  }
}
```

---

# Authentication

## POST `/api/auth/login`

Authenticates the owner and returns a JWT.

Example request:

```json
{
  "username": "admin",
  "password": "your-password"
}
```

Example response:

```json
{
  "success": true,
  "token": "eyJ..."
}
```

The returned token is used for protected admin endpoints.

---

# Protected Admin Endpoints

## GET `/api/admin/config`

Returns the **complete configuration**, including:

- Active questions
- Inactive questions
- Labels
- Limits
- Options
- Rates
- Multipliers
- Tear-off costs
- Global modifiers
- Current configuration version

This endpoint requires authentication.

---

## PUT `/api/admin/config`

Updates the complete configuration.

The endpoint requires authentication.

After a successful update:

```text
config_version
```

is incremented.

Example:

```text
Version 3
   ↓
Owner changes pricing
   ↓
Version 4
```

---

## GET `/api/admin/leads`

Returns captured leads ordered by most recent first.

Each lead includes:

- Customer name
- Phone
- Email
- Submitted answers
- Estimate low
- Estimate high
- Configuration version
- Timestamp

---

# Pricing Formula

Pricing is calculated **only on the backend**.

The calculation uses:

- `A` = roof area
- `Rm` = selected material `rate_per_sqft`
- `Mp` = selected pitch `multiplier`
- `Ms` = selected stories `multiplier`
- `Rt` = selected layers `tear_off_per_sqft`
- `W` = waste factor
- `Fp` = permit flat fee
- `S` = range spread

## 1. Base Material Cost

```text
A × Rm × (1 + W)
```

## 2. Tear-Off Cost

```text
A × Rt
```

## 3. Adjusted Subtotal

```text
(Base Material Cost + Tear-Off Cost) × Mp × Ms
```

## 4. Mid Estimate

```text
Adjusted Subtotal + Fp
```

## 5. Low Estimate

```text
E_mid × (1 - S)
```

## 6. High Estimate

```text
E_mid × (1 + S)
```

### Current Seed Values

```text
Waste factor: 0.10
Permit fee: $350
Range spread: 12%
```

The seed data stores:

```text
range_spread_pct: 12
```

The calculator converts it to:

```text
12 / 100 = 0.12
```

before applying the range calculation.

---

# Configuration Versioning

Configuration changes create a new configuration version.

Example:

```text
Version 3
   ↓
Owner changes material rate
   ↓
Version 4
```

Each lead stores the configuration version used during its estimate.

For example:

```text
Old lead:
config_version: 3

New lead:
config_version: 4
```

This ensures historical leads remain traceable even when pricing changes.

---

# Database Models

## Config

The `Config` model stores:

- `config_version`
- Business information
- Questions
- Question types
- Labels
- Units
- Required state
- Minimum/maximum values
- Active/inactive state
- Options
- Material rates
- Pitch multipliers
- Stories multipliers
- Tear-off rates
- Global modifiers

## Lead

The `Lead` model stores:

- Customer name
- Phone
- Email
- Submitted answers
- Estimate low
- Estimate high
- Configuration version
- Created timestamp
- Updated timestamp

Answers are stored as a flexible object because the estimator is configuration-driven and questions may change over time.

---

# Seed Data

The provided seed configuration is **Version 3**.

It contains:

- Northline Roofing & Exteriors business details
- Five current estimator questions
- Material pricing
- Pitch multipliers
- Tear-off rates
- Stories multipliers
- Waste factor
- Permit fee
- Range spread

The provided historical leads are also preserved.

Run the seed script from the `server` directory:

```bash
npm run seed
```

Historical leads from older configuration versions are not rewritten to match the current configuration.

---

# Local Development Setup

## Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- MongoDB Atlas account or local MongoDB
- Git

---

## 1. Clone the repository

```bash
git clone <repository-url>
cd Watance_Assignment
```

---

## 2. Install backend dependencies

```bash
cd server
npm install
```

---

## 3. Configure environment variables

Create:

```text
server/.env
```

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your_admin_password
```

Do not commit `.env` to Git.

---

## 4. Seed the database

```bash
npm run seed
```

---

## 5. Start the backend

```bash
npm run dev
```

Backend:

```text
http://localhost:5000
```

---

## 6. Install frontend dependencies

Open a second terminal:

```bash
cd client
npm install
```

---

## 7. Configure frontend environment variables

Create:

```text
client/.env
```

For local development:

```env
VITE_API_URL=http://localhost:5000
```

For deployment, set `VITE_API_URL` in your hosting provider to the backend origin, without a trailing `/api` path.

---

## 8. Start the frontend

```bash
npm run dev
```

Frontend will normally be available at:

```text
http://localhost:5173
```

---

# Validation

Validation happens at two levels.

## Frontend Validation

The frontend provides immediate feedback for:

- Required inputs
- Number ranges
- Missing selections
- Invalid form states

This improves user experience.

## Backend Validation

The backend is the authoritative validation layer.

It validates:

- Required answers
- Numeric values
- Minimum values
- Maximum values
- Valid select options
- Customer contact information

The backend must not trust browser input.

---

# Security

Important security decisions:

- Pricing logic stays on the server.
- Pricing rates are not hardcoded into the frontend.
- Admin APIs require JWT authentication.
- Browser input is treated as untrusted.
- Admin credentials are stored through environment variables.
- JWT secret is stored through environment variables.
- `.env` is excluded from Git.
- Public API responses do not expose unnecessary admin information.

---

# Testing Checklist

## Public Estimator

- [ ] Configuration loads successfully.
- [ ] Questions are fetched dynamically.
- [ ] Only active questions are displayed.
- [ ] Questions follow configured order.
- [ ] Number validation works.
- [ ] Select options work.
- [ ] Multi-step navigation works.
- [ ] Back/Continue navigation works.
- [ ] Contact details are captured.
- [ ] Estimate submission works.
- [ ] Loading state appears while calculating.
- [ ] Estimate result is displayed.
- [ ] Lead is saved to MongoDB.

## Configuration Management

- [ ] Admin login works.
- [ ] Complete configuration loads.
- [ ] Question can be enabled.
- [ ] Question can be disabled.
- [ ] Question label can be changed.
- [ ] Question limits can be changed.
- [ ] Options can be changed.
- [ ] Material rates can be changed.
- [ ] Multipliers can be changed.
- [ ] Global modifiers can be changed.
- [ ] Save creates a new configuration version.
- [ ] Public estimator reflects the new configuration without redeployment.

## Leads

- [ ] Leads appear in admin panel.
- [ ] Leads are ordered newest first.
- [ ] Customer contact details are displayed.
- [ ] Answers are preserved.
- [ ] Estimate range is displayed.
- [ ] Configuration version is displayed.

## Authentication

- [ ] Valid credentials allow login.
- [ ] Invalid credentials are rejected.
- [ ] Admin config endpoint rejects unauthenticated requests.
- [ ] Admin leads endpoint rejects unauthenticated requests.
- [ ] Invalid/expired JWT is rejected.
- [ ] Sign out clears the frontend authentication state.

## Server-Side Integrity

- [ ] Frontend does not calculate estimates.
- [ ] Backend calculates all estimates.
- [ ] Invalid material values are rejected.
- [ ] Invalid pitch values are rejected.
- [ ] Invalid stories values are rejected.
- [ ] Invalid roof area values are rejected.
- [ ] Browser-side manipulation cannot change the pricing formula.

## Responsive UI

- [ ] Desktop layout works.
- [ ] Tablet layout works.
- [ ] Mobile layout works.
- [ ] No horizontal overflow.
- [ ] Buttons remain accessible.
- [ ] Form inputs remain usable on small screens.

---

# Engineering Principles

The implementation follows these principles:

1. **Database over hardcoded configuration**
2. **Server-side calculation over browser calculation**
3. **Backend validation over client trust**
4. **Configuration versioning for historical traceability**
5. **Simple owner UX for non-technical users**
6. **Reusable dynamic frontend components**
7. **Small, focused APIs**
8. **Minimal unnecessary complexity**
9. **Preserve historical lead data**
10. **Keep public and admin responsibilities separated**

---

# Non-Goals

The following features were intentionally kept outside the assignment scope:

- Customer accounts
- Payment processing
- CRM integrations
- Advanced analytics
- Complex role/permission management
- Customer dashboards
- Automated email/SMS campaigns
- Advanced audit logging
- Complex quote/invoice generation

The goal is to deliver the requested estimator, owner configuration workflow, lead capture, and secure server-side pricing without adding unnecessary complexity.

---

# Future Improvements

With additional development time, the following could be added:

- Automated unit and integration test suite
- Rate limiting
- Stronger production authentication/session management
- Configuration change audit history
- More granular admin permissions for Dale and Marcus
- Better observability and structured logging
- Automated deployment pipeline
- Accessibility audit
- Cross-browser testing
- Production monitoring
- Automated API documentation
- More detailed estimate breakdown for owners
- Automated backup and recovery strategy

---

# Documentation

Additional architectural reasoning, assumptions, trade-offs, questionable seed data, questions for the client, deliberately omitted functionality, and future improvements are documented in:

```text
DECISIONS.md
```

---

# Final Acceptance Criteria

The project is considered functionally complete when:

- Public estimator loads configuration from the database.
- Questions are dynamically rendered.
- Inactive questions do not appear publicly.
- Owner can modify configuration without frontend code changes.
- Owner can enable/disable questions.
- Owner can update labels and pricing.
- Configuration changes increment the configuration version.
- Estimates are calculated only on the backend.
- Invalid answers are rejected server-side.
- Leads are stored with answers and estimate ranges.
- Leads retain the configuration version used for calculation.
- Admin APIs are protected by authentication.
- Public estimator is responsive.
- Configuration changes appear on the public estimator without redeployment.

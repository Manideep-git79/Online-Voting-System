# 🗳️ Online Voting System

A full-stack, role-based online voting application where voters can securely cast a single vote and admins can manage candidates and view live results.

**Live Demo:** https://online-voting-system-kappa-fawn.vercel.app
**Backend API:** https://online-voting-system-81th.onrender.com

> Note: The backend is hosted on Render's free tier, which spins down after periods of inactivity. The first request may take 30-50 seconds to respond while the server wakes up.

## Features

- **Authentication** — Signup/Login secured with JWT tokens
- **Role-Based Access Control** — Separate voter and admin experiences
- **Voting** — One vote per user, enforced at the database level
- **Admin Panel** — Add, edit, and delete candidates
- **Live Results** — Admin-only dashboard showing real-time vote counts per candidate
- **Change Password** — Authenticated users can update their password
- **Protected Routes** — Frontend and backend both enforce access control
- **Responsive UI** — Clean, professional design across devices

## Tech Stack

**Frontend**
- React
- React Router DOM
- Context API (auth state management)
- CSS (custom design system)

**Backend**
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcrypt (password hashing)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

## Project Structure
voting_app/
├── backend/
│ ├── models/
│ │ ├── user.js
│ │ └── candidate.js
│ ├── routes/
│ │ ├── userRoutes.js
│ │ └── candidateRoutes.js
│ ├── db.js
│ ├── jwt.js
│ └── server.js
└── frontend/
└── src/
├── api.js
├── context/
│ └── AuthContext.js
├── components/
│ ├── Navbar.js
│ └── ProtectedRoute.js
└── pages/
├── Login.js
├── Signup.js
├── VoterDashboard.js
├── AdminDashboard.js
├── AdminResults.js
└── ChangePassword.js

## Getting Started

### Prerequisites
- Node.js installed
- A MongoDB connection string (local or MongoDB Atlas)

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
MONGODB_URL=mongodb_connection_string
JWT_SECRET=secret_key
PORT=3000


Run the backend:
```bash
node server.js
```

### Frontend Setup
```bash
cd frontend
npm install
```

Update `src/api.js` with your backend URL if different from default.

Run the frontend:
```bash
npm start
```

## User Roles

| Role | Capabilities |
|---|---|
| **Voter** | View candidates, cast one vote |
| **Admin** | Add/edit/delete candidates, view live results (only one admin account allowed) |

## API Endpoints

### User Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/user/signup` | Register a new user | No |
| POST | `/user/login` | Login and receive JWT | No |
| GET | `/user/profile` | Get logged-in user's profile | Yes |
| PUT | `/user/profile/password` | Change password | Yes |

### Candidate Routes
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| GET | `/candidate/` | List all candidates | Yes |
| POST | `/candidate/` | Add a candidate | Admin only |
| PUT | `/candidate/:id` | Update a candidate | Admin only |
| DELETE | `/candidate/:id` | Delete a candidate | Admin only |
| POST | `/candidate/vote/:id` | Cast a vote for a candidate | Yes (voter only) |
| GET | `/candidate/vote/count` | Get vote counts per candidate | Admin only |

## Security Notes
- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Admin-only routes are protected both on the frontend (route guarding) and backend (middleware checks)
- Only one admin account is permitted system-wide
- A user can vote only once, enforced via an `isVoted` flag on the user document

## Author
Built as a full-stack learning/portfolio project demonstrating authentication, role-based access control, and CRUD operations across a MERN-style stack.

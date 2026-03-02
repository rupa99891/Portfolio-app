# 🚀 PortfolioGen — Multi-User Portfolio Generator (MERN Stack)

A full-stack MERN application that allows multiple users to register, manage their profile/skills/projects, and share a beautiful public portfolio page.

---

## 📁 Folder Structure

```
portfolio-app/
│
├── backend/                        # Node.js + Express API
│   ├── config/                     # (Reserved for DB config if needed)
│   ├── controllers/                # Business logic (MVC Controllers)
│   │   ├── authController.js       # Register, Login
│   │   ├── profileController.js    # Get & Update profile
│   │   ├── skillController.js      # CRUD for skills
│   │   ├── projectController.js    # CRUD for projects
│   │   └── portfolioController.js  # Public portfolio view
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification middleware
│   ├── models/                     # Mongoose schemas (MVC Models)
│   │   ├── User.js                 # User schema with hashed password
│   │   ├── Skill.js                # Skill schema
│   │   └── Project.js              # Project schema
│   ├── routes/                     # Express routers (MVC Routes)
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── skillRoutes.js
│   │   ├── projectRoutes.js
│   │   └── portfolioRoutes.js
│   ├── .env.example                # Template for env variables
│   ├── server.js                   # App entry point
│   └── package.json
│
└── frontend/                       # React application
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── dashboard/
    │   │   │   ├── ProfileSection.js   # Profile edit form
    │   │   │   ├── SkillsSection.js    # Skills CRUD UI
    │   │   │   └── ProjectsSection.js  # Projects CRUD UI
    │   │   └── shared/
    │   │       ├── Navbar.js           # Top navigation
    │   │       └── ProtectedRoute.js   # Auth guard
    │   ├── context/
    │   │   └── AuthContext.js          # Global auth state (React Context)
    │   ├── pages/
    │   │   ├── Home.js                 # Landing page
    │   │   ├── Login.js                # Login page
    │   │   ├── Register.js             # Registration page
    │   │   ├── Dashboard.js            # Protected dashboard
    │   │   └── Portfolio.js            # Public portfolio page
    │   ├── styles/
    │   │   └── global.css              # All styles
    │   ├── utils/
    │   │   └── api.js                  # Axios instance w/ JWT interceptor
    │   ├── App.js                      # Route definitions
    │   └── index.js                    # React entry point
    └── package.json
```

---

## 🔌 API Endpoints

### Auth Routes (`/api/auth`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Private | Get current user |

### Profile Routes (`/api/profile`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/profile` | Private | Get logged-in user's profile |
| PUT | `/api/profile` | Private | Update profile |

### Skills Routes (`/api/skills`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/skills` | Private | Get all skills |
| POST | `/api/skills` | Private | Add a skill |
| PUT | `/api/skills/:id` | Private | Update a skill |
| DELETE | `/api/skills/:id` | Private | Delete a skill |

### Projects Routes (`/api/projects`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/projects` | Private | Get all projects |
| POST | `/api/projects` | Private | Add a project |
| PUT | `/api/projects/:id` | Private | Update a project |
| DELETE | `/api/projects/:id` | Private | Delete a project |

### Portfolio Routes (`/api/portfolio`)
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/portfolio/:username` | Public | Get full portfolio data |

---

## 🗃️ Database Schemas

### User
```javascript
{ name, email, password (hashed), username, bio, title, location,
  phone, website, profileImage, socialLinks: { github, linkedin, twitter, instagram },
  education: [{ school, degree, field, from, to, current, description }] }
```

### Skill
```javascript
{ user (ref), name, category, level: ['Beginner','Intermediate','Advanced','Expert'], icon }
```

### Project
```javascript
{ user (ref), title, description, technologies: [String],
  githubUrl, liveUrl, imageUrl, featured, completedAt }
```

---

## ⚙️ How to Run Locally

### Prerequisites
- Node.js (v16+) — https://nodejs.org
- MongoDB (local) or MongoDB Atlas (cloud) — https://www.mongodb.com
- npm or yarn

---

### Step 1 — Clone or extract the project
```bash
cd portfolio-app
```

### Step 2 — Set up the Backend
```bash
cd backend
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
MONGO_URI=mongodb://localhost:27017/portfolio_db
JWT_SECRET=make_this_a_long_random_string_like_abc123xyz789
PORT=5000
```

> 💡 **MongoDB Atlas (cloud)**: Replace `MONGO_URI` with your Atlas connection string.
> Example: `MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db`

Start the backend:
```bash
npm run dev    # Development (with nodemon)
# or
npm start      # Production
```

✅ You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

---

### Step 3 — Set up the Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

✅ React app opens at `http://localhost:3000`

The `"proxy": "http://localhost:5000"` in `frontend/package.json` forwards all `/api` requests to the backend automatically.

---

### Step 4 — Use the App

1. Go to `http://localhost:3000`
2. Click **Get Started Free** → Register an account
3. You'll be taken to your **Dashboard**
4. Add your profile info, skills, and projects
5. View your live portfolio at: `http://localhost:3000/portfolio/yourusername`

---

## 🔐 How JWT Authentication Works

```
1. User registers/logs in → Server creates JWT token with userId
2. Token sent back to React → Stored in localStorage
3. Every API request → React adds "Authorization: Bearer <token>" header
4. Server's authMiddleware.js verifies the token
5. If valid → req.user is set → request proceeds
6. If invalid/expired → 401 response → React redirects to /login
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| State Management | React Context API |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Styling | Pure CSS with CSS Variables |

---

## 🚀 Deployment

### Backend (Railway / Render / Heroku)
1. Push `backend/` to a Git repo
2. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`
3. Set start command: `npm start`

### Frontend (Vercel / Netlify)
1. Update `api.js` baseURL to your deployed backend URL
2. Push `frontend/` to Git repo
3. Deploy with build command: `npm run build`

---

## 📝 Beginner Tips

- **MVC Pattern**: Models (data shape) → Controllers (logic) → Views (React frontend)
- **JWT**: Like a digital ID card — created at login, checked on every protected request
- **Mongoose ref**: `user: ObjectId ref 'User'` links a skill/project to its owner
- **React Context**: Like a global store — any component can read `user` without prop drilling
- **Protected Route**: A wrapper component that checks if you're logged in before rendering

# 🔍 Back2U — Lost & Found Management System

> A centralized platform for reporting, tracking, and recovering lost items within a campus environment.

---

## 📖 Overview

**Back2U** is a full-stack web application designed to streamline the process of reporting and recovering lost and found items on campus. The platform connects students and administrators through a unified interface, enabling efficient item management, real-time communication, and intelligent matching between lost and found reports.

Whether a student misplaced their laptop in the library or found a wallet on the sports field, Back2U provides the tools to reunite items with their rightful owners — quickly and transparently.

---

## 🎓 Academic Context

This project was developed for the **IT3040 – ITPM** module as a university project.

---

## ✨ Features

| Feature                      | Description                                                          |
| ---------------------------- | -------------------------------------------------------------------- |
| 🧑‍💼 User Profile Management   | Manage personal profiles, preferences, and notification settings     |
| 📦 Lost Item Reporting       | Submit detailed reports for lost items with images and location data |
| 🔎 Found Item Reporting      | Log found items and notify the campus community                      |
| 🤝 Item Claim & Verification | Secure claim submission and admin-verified handover workflow         |
| 🔔 Notifications & Alerts    | Real-time in-app notifications for claim updates and item matches    |
| 💬 In-App Messaging          | Direct messaging between finders and claimants                       |
| 🤖 Chatbot Assistant         | AI-powered assistant to guide users through the reporting process    |
| 🔗 Smart Matching            | Automated suggestion of matched lost & found posts                   |
| 🔍 Search & Filter           | Advanced filtering by category, date, location, and status           |
| 🏆 Leaderboard               | Gamification system rewarding active community contributors          |
| 📢 Admin Notices             | Broadcast important announcements to all users                       |
| 🚨 Report & Moderation       | Content moderation tools for administrators                          |

---

## 👥 Team & Contributions

| Member                   | Contributions                                                                |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Lakvindu K L C**       | User Profile Management · Item Claim & Verification · Notifications & Alerts |
| **Herath H.M.H.N**       | Found Item Reporting · Admin Notices · Chatbot Assistant                     |
| **Sithumini D.M.A**      | In-App Messaging · Leaderboard · Report & Moderation                         |
| **Kumarasinghe I.D.D.H** | Lost Item Reporting · Search & Filter · Matching Post Suggestion             |

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                 |
| ---------------- | ----------------------- |
| React 19         | UI framework            |
| Vite             | Build tool & dev server |
| Tailwind CSS     | Styling                 |
| React Router DOM | Client-side routing     |
| Axios            | HTTP client             |
| Socket.IO Client | Real-time communication |
| Lucide React     | Icon library            |

### Backend

| Technology           | Purpose                                 |
| -------------------- | --------------------------------------- |
| Node.js + Express 5  | REST API server                         |
| MongoDB + Mongoose   | Database & ODM                          |
| Socket.IO            | WebSocket server for real-time features |
| JSON Web Token (JWT) | Authentication                          |
| bcryptjs             | Password hashing                        |
| Multer               | Image/file uploads                      |
| Google Generative AI | Chatbot assistant (Gemini)              |
| node-cron            | Scheduled background jobs               |

---

## 🏗️ Project Structure

```
Back2U/
├── backend/
│   ├── config/          # Database & environment configuration
│   ├── controllers/     # Route handler logic
│   ├── jobs/            # Scheduled cron jobs
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # Mongoose data models
│   ├── routes/          # API route definitions
│   ├── uploads/         # Uploaded media files
│   ├── utils/           # Helper utilities
│   └── server.js        # Entry point
│
├── frontend/
│   └── src/
│       ├── api/         # Axios API service calls
│       ├── components/  # Reusable UI components
│       ├── context/     # React context providers
│       ├── pages/       # Page-level components
│       ├── services/    # Business logic services
│       ├── styles/      # CSS modules & global styles
│       ├── utils/       # Frontend utility functions
│       ├── socket.js    # Socket.IO client setup
│       └── App.jsx      # Root application component
│
└── e2e/                 # End-to-end tests
```

---

## 🔌 API Endpoints Overview

| Route Prefix         | Description                       |
| -------------------- | --------------------------------- |
| `/api/auth`          | Authentication (register, login)  |
| `/api/users`         | User profile management           |
| `/api/lost`          | Lost item reporting & management  |
| `/api/found`         | Found item reporting & management |
| `/api/claims`        | Item claim & verification         |
| `/api/matches`       | Smart item matching               |
| `/api/messages`      | In-app messaging                  |
| `/api/chat`          | Chatbot assistant                 |
| `/api/notices`       | Admin notices & announcements     |
| `/api/notifications` | Notification management           |
| `/api/reports`       | Content reports & moderation      |
| `/api/leaderboard`   | Gamification leaderboard          |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+
- **MongoDB** (local instance or MongoDB Atlas)
- **npm** v9+

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Back2U.git
cd Back2U
```

### 2. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Run the Application

**Start the backend server:**

```bash
cd backend
npm run dev
```

**Start the frontend dev server:**

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` by default.

---

<div align="center">
  <sub>Built with ❤️ by the Back2U Team</sub>
</div>

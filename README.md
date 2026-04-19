# MannMitra 🌿 | Comprehensive Student Wellness Platform

<div align="center">

![MannMitra Logo](frontend/public/MannMitra.png)

**Empowering Minds, Saving Lives.**

A full-stack MERN mental health platform bridging students, counselors, and administrators through AI-powered support, gamified therapy, and real-time crisis intervention.

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📖 About MannMitra

MannMitra ("Mann" = Mind, "Mitra" = Friend in Sanskrit) is a state-of-the-art mental health and student wellness platform. It connects three user roles — **Students**, **Mentors (Counselors)**, and **Administrators** — in a single, cohesive ecosystem. The platform leverages **Google Gemini AI** for intelligent conversational support, **real-time WebSockets** for live video sessions, and an automated **Safety Audit Engine** that proactively monitors students at risk of crisis.

---

## 🚀 Feature Overview

### 👤 Student Experience

The student portal is designed for self-care, professional support, and emergency assistance.

| Feature | Description |
|---|---|
| **Dynamic Dashboard** | Personalized greeting, mood summary, streak tracker, activity stats, and quick-access to all tools. |
| **PHQ-9 Assessment** | Evidence-based mental health assessments with score tracking and trend analysis. |
| **Mood Tracker** | Log daily moods (Happy, Sad, Stressed, Calm, etc.) with visual trend charts. |
| **AI Mitra (Chatbot)** | 24/7 conversational support powered by Google Gemini, with built-in crisis keyword screening. |
| **Breathing Bubble** | Visually immersive box breathing exercise with animated guidance for anxiety relief. |
| **Mood Canvas** | A free-form digital drawing space for emotional expression and art therapy. |
| **Gratitude Journal** | A structured daily diary with date-stamped entries for positive reinforcement. |
| **RBT Game** | Rational Behaviour Therapy game — identify irrational automatic thoughts and reframe them rationally. |
| **ABCDE Method Tool** | A guided, step-by-step CBT exercise covering Activating Event, Beliefs, Consequences, Disputation, and Effective New Belief. |
| **Therapy Modules** | A library of structured psychoeducational content modules, with progress tracking. |
| **Resource Library** | Curated collection of mental health articles, videos, and guides. |
| **Community Forum** | Anonymous and named community discussion space for peer support. |
| **Trusted Contacts** | Register emergency contacts for one-touch alerts during a crisis. |
| **Crisis Mode** | Dedicated emergency screen with local helpline numbers and instant alert dispatch to trusted contacts. |
| **Badge Gallery** | View all earned achievement badges with category filters (Streak, Therapy, CBT, Assessment, etc.). |
| **Video Sessions** | Join scheduled WebRTC/Socket.io powered video sessions with assigned mentor. |
| **Notifications** | Real-time in-app notification bell for session reminders and crisis alerts. |

---

### 👨‍🏫 Mentor Experience

Mentors (counselors) can manage their assigned student roster and provide professional ongoing support.

| Feature | Description |
|---|---|
| **Mentor Dashboard** | Overview of all assigned students with their at-risk status, recent mood, and assessment history. |
| **Student Detail Modal** | Deep-dive view of a student's assessment scores, mood logs, and activity stats. |
| **Risk Flagging** | Toggle a student's `isAtRisk` status directly from the dashboard for supervisor review. |
| **Session Scheduling** | Schedule video sessions with assigned students — automatically creates Google Calendar events with Google Meet links. |
| **Session Notes** | Add private clinical notes to any completed session for record-keeping. |
| **Live Video Session** | Conduct WebRTC-based video calls with students from within the platform. |

---

### 🔑 Admin Experience

A high-level oversight portal for platform governance and safety management.

| Feature | Description |
|---|---|
| **Admin Dashboard** | Real-time metrics: total students, total mentors, pending assessments, average PHQ-9 score. |
| **User Management** | View, manage, and soft-delete student and mentor accounts with cascading cleanup. |
| **Mentor Registration** | Create new mentor accounts with specialization profiles directly from the admin panel. |
| **Mentor Assignment** | Intelligently assign students to the most suitable mentor via a dedicated allotment interface. |
| **Appointment Scheduling** | Schedule sessions between students and mentors via the admin panel — triggers Google Meet link creation. |
| **Crisis Log Monitoring** | View all crisis logs, including trigger sources (chat, forum, system audit) and severity levels. |
| **Forum Content Moderation** | View and moderate community forum posts. |
| **Allotment Log** | Track which students are assigned to which mentors. |

---

## 🛡️ Safety & Crisis System

MannMitra has a multi-layered, automated safety system that operates continuously.

### 1. Real-Time Crisis Detection (Two-Stage Pipeline)
- **Stage 1 — Keyword Scan**: Every chat message and forum post is instantly screened against a comprehensive library of 15+ crisis patterns (e.g., `suicide`, `want to die`, `hurt myself`).
- **Stage 2 — AI Contextual Analysis**: If a keyword match or a long message is detected, the message is sent to **Gemini AI** for a nuanced contextual safety evaluation, returning a `severity` score (`high`, `medium`, `low`, `none`).

### 2. Proactive Global Safety Audit
A background job runs every **12 hours** and scans all student accounts for two passive risk indicators:
- **3-Day Inactivity**: Students who haven't logged any activity for 3+ days are flagged.
- **Negative Mood Trend**: Students whose last 3 consecutive mood logs are all negative (`Sad` or `Stressed`) are flagged.

### 3. Crisis Response Actions
When a crisis is confirmed (with a 24-hour cooldown to prevent notification spam):
1. **An immutable Crisis Log** is created in the database.
2. **The student's profile** is flagged as `isAtRisk: true`.
3. **The assigned mentor** receives an in-app notification alarm.
4. **All admins** receive a critical in-app notification.

---

## 🏆 Gamification & Badge System

MannMitra uses a gamified reward system to encourage consistent wellness habits. Badges are evaluated and awarded server-side on every user activity update.

| Category | Badges |
|---|---|
| **Streak** | 🌱 First Step, 🔥 3-Day Streak, 🛡️ Week Warrior, ⚔️ Fortnight Strong, 👑 Monthly Champion |
| **Therapy** | 🌬️ Deep Breather, 🧘 Calm Master, 🎨 Artist Within, 🌈 Color Your Mind, ✍️ Grateful Heart, 🙏 Gratitude Guru |
| **CBT** | 🧩 Thought Challenger, 🌀 Mind Shifter, 🔨 Pattern Breaker |
| **Assessment** | 👁️ Self Aware, 📊 Check-In Pro |
| **Connection** | 🤝 Not Alone, 💬 Open Up |
| **Special** | 🦉 Night Owl, 🌅 Early Bird |
| **Milestone** | 🚀 Journey Begun, 🌟 MannMitra Star |

A **BadgeCelebration** animation fires in the browser whenever a new badge is earned.

---

## 📧 Email System

MannMitra uses **Nodemailer** with Gmail SMTP for transactional emails.

| Event | Recipient | Description |
|---|---|---|
| **Account Registration** | New Student | Sends a 6-digit OTP for email verification before account activation. |
| **Contact Us Form** | `mannmitra.noreply@gmail.com` | Forwards support inquiries directly to the support inbox, with a `Reply-To` set to the sender. |

If `EMAIL_USER` and `EMAIL_PASS` are not set, the system gracefully falls back to printing the OTP to the server console (safe for local development).

---

## 🗓️ Google Calendar Integration

When a session is scheduled (by either an Admin or a Mentor), the backend automatically:
1. Creates a **Google Calendar event** using the configured OAuth2 service account.
2. Generates a **Google Meet conference link** and attaches it to the event.
3. Stores the `meetingLink` and `calendarEventId` in the `Session` database record.

The Meet link is then displayed directly in the Mentor and Student dashboards for one-click access.

---

## 🛠️ Technical Architecture

### Frontend Stack

| Technology | Version | Purpose |
|---|---|---|
| **React** | 19 | Core UI framework |
| **Vite** | 7 | Build tool and dev server with HMR |
| **React Router DOM** | 6 | Client-side routing |
| **Tailwind CSS** | 3 | Utility-first styling framework |
| **Lucide React** | Latest | Icon library |
| **React Icons** | Latest | Extended icon set |
| **Axios** | Latest | HTTP client for API communication |
| **Socket.io Client** | 4 | Real-time WebSocket connection |
| **Chart.js + react-chartjs-2** | Latest | Assessment score and mood trend charts |

**Performance**: All pages are **lazily loaded** using `React.lazy()` and `Suspense` to minimize initial bundle size. Heavy components like charts and PDF tools are dynamically imported.

### Backend Stack

| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 18+ | Server runtime |
| **Express.js** | 5 | Web framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 8 | MongoDB ODM with schema validation |
| **JSON Web Tokens (JWT)** | 9 | Stateless authentication |
| **Bcrypt.js** | 3 | Password hashing |
| **Socket.io** | 4 | Real-time WebSocket server |
| **Nodemailer** | 8 | Email/SMTP service |
| **Google Generative AI** | 0.24 | Gemini AI integration |
| **googleapis** | 171 | Google Calendar + OAuth2 API |
| **Helmet** | 8 | HTTP security headers |
| **Compression** | 1 | Gzip response compression |
| **Express Rate Limit** | 8 | API and auth route rate limiting |
| **Express Mongo Sanitize** | 2 | NoSQL injection prevention |
| **Nodemon** | 3 | Dev server with auto-restart |

---

## 📂 Project Structure

```
MannMitra/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection via Mongoose
│   ├── controllers/
│   │   ├── assessmentController.js  # PHQ-9 submit & retrieve
│   │   ├── chatController.js        # Gemini AI chat + crisis detection
│   │   ├── contactController.js     # Trusted contacts CRUD
│   │   ├── forumController.js       # Forum posts + crisis screening
│   │   ├── notificationController.js # In-app notification management
│   │   ├── supportController.js     # Contact Us form handler
│   │   ├── userController.js        # Auth, onboarding, badges, activity
│   │   └── adminController.js       # Admin-level stat aggregation
│   ├── middleware/
│   │   ├── authMiddleware.js        # JWT protect + requireRole guard
│   │   ├── adminMiddleware.js       # Admin-only access guard
│   │   └── errorMiddleware.js       # Global error handler
│   ├── models/
│   │   ├── User.js                  # Core user schema (all roles)
│   │   ├── Mentor.js                # Mentor profile schema
│   │   ├── Assessment.js            # PHQ-9 assessment results
│   │   ├── Mood.js                  # Daily mood logs
│   │   ├── Session.js               # Scheduled video sessions
│   │   ├── Appointment.js           # Legacy appointment tracking
│   │   ├── CrisisLog.js             # Crisis detection logs
│   │   ├── ForumPost.js             # Community forum posts
│   │   ├── Module.js                # Therapy module content
│   │   ├── ModuleProgress.js        # Student module completion tracking
│   │   ├── Notification.js          # In-app notification records
│   │   ├── Quote.js                 # Motivational quotes
│   │   └── TrustedContact.js        # Emergency contact records
│   ├── routes/
│   │   ├── index.js                 # Central router aggregator
│   │   ├── userRoutes.js            # /api/users (auth, profile, badges)
│   │   ├── adminRoutes.js           # /api/admin (users, mentors, sessions)
│   │   ├── adminAuthRoutes.js       # /api/admin/auth (admin login)
│   │   ├── assessmentRoutes.js      # /api/assessments
│   │   ├── chatRoutes.js            # /api/chat
│   │   ├── contactRoutes.js         # /api/contacts (trusted contacts)
│   │   ├── forumRoutes.js           # /api/forum
│   │   ├── mentorRoutes.js          # /api/mentor + /api/mentors
│   │   ├── moduleRoutes.js          # /api/modules
│   │   ├── moodRoutes.js            # /api/moods
│   │   ├── notificationRoutes.js    # /api/notifications
│   │   ├── quoteRoutes.js           # /api/quotes
│   │   ├── sessionRoutes.js         # /api/sessions
│   │   └── supportRoutes.js         # /api/support (Contact Us email)
│   ├── services/
│   │   ├── safetyService.js         # Crisis detection engine + global audit
│   │   ├── badgeService.js          # Badge definitions + award logic
│   │   ├── emailService.js          # OTP + Contact Us emails (Nodemailer)
│   │   ├── googleCalendarService.js # Google Meet link generation
│   │   └── allotmentService.js      # Mentor-student matching logic
│   ├── socket/
│   │   └── sessionSocket.js         # WebSocket event handlers (video sessions)
│   ├── .env.example                 # Environment variable template
│   ├── seedModules.js               # Database seeder for therapy modules
│   └── server.js                    # Express server entry point
│
└── frontend/
    └── src/
        ├── components/
        │   ├── Navbar.jsx               # Responsive top nav with auth state
        │   ├── BadgeCelebration.jsx     # Pop-up badge award animation
        │   ├── MoodTracker.jsx          # Dashboard mood logging widget
        │   ├── AssessmentChart.jsx      # PHQ-9 history visualization
        │   ├── NotificationBell.jsx     # Real-time notification dropdown
        │   ├── StudentDetailModal.jsx   # Mentor view of student details
        │   ├── VideoChat.jsx            # WebRTC video chat component
        │   ├── CrisisModal.jsx          # Emergency resources modal
        │   ├── MotivationPopup.jsx      # Motivational message widget
        │   ├── ThemeToggle.jsx          # Dark/Light mode toggle
        │   └── PageLoader.jsx           # Lazy-load suspense fallback
        ├── pages/
        │   ├── LandingPage.jsx          # Public marketing homepage
        │   ├── About.jsx                # About MannMitra page
        │   ├── Contact.jsx              # Contact Us form (email integration)
        │   ├── PrivacyPolicy.jsx        # Privacy policy page
        │   ├── Register.jsx             # Student registration + OTP verification flow
        │   ├── VerifyEmail.jsx          # Email OTP verification screen
        │   ├── Login.jsx                # Role-aware login screen
        │   ├── Dashboard.jsx            # Main student dashboard
        │   ├── AdminDashboard.jsx       # Admin control panel
        │   ├── AdminStudentDetail.jsx   # Admin student profile viewer
        │   ├── MentorDashboard.jsx      # Mentor clinical roster dashboard
        │   ├── Assessment.jsx           # PHQ-9 assessment form
        │   ├── Chatbot.jsx              # AI Mitra chat interface
        │   ├── BreathingBubble.jsx      # Guided breathing exercise
        │   ├── MoodCanvas.jsx           # Digital art therapy canvas
        │   ├── GratitudeJournal.jsx     # Daily gratitude diary
        │   ├── RBTGame.jsx              # Rational Behaviour Therapy game
        │   ├── ABCDEGame.jsx            # ABCDE CBT method tool
        │   ├── TherapyModules.jsx       # Module library browser
        │   ├── ModuleDetail.jsx         # Individual module content viewer
        │   ├── ResourceLibrary.jsx      # Mental health resource browser
        │   ├── Forum.jsx                # Community peer support forum
        │   ├── BadgeGallery.jsx         # Achievement badge showcase
        │   ├── TrustedContact.jsx       # Emergency contact management
        │   ├── MentorSession.jsx        # Mentor-side video session view
        │   ├── StudentSession.jsx       # Student-side video session view
        │   └── CrisisModal.jsx          # Crisis emergency overlay
        └── services/
            └── api.js                   # Axios instances + API helper functions
```

---

## 📡 API Reference

All routes are prefixed with `/api`.

| Route Prefix | Access | Description |
|---|---|---|
| `POST /users/register` | Public | Register a new student account |
| `POST /users/verify-otp` | Public | Verify email with OTP |
| `POST /users/login` | Public | Authenticate and receive JWT |
| `GET /users/profile` | Student | Get authenticated user profile |
| `POST /users/activity` | Student | Log activity + trigger badge check |
| `POST /assessments` | Student | Submit PHQ-9 assessment |
| `GET /assessments` | Student | Get own assessment history |
| `GET /moods` | Student | Get mood history |
| `POST /moods` | Student | Log a new mood entry |
| `POST /chat` | Student | Send message to Gemini AI (with crisis screen) |
| `GET /contacts` | Auth | Get trusted contacts list |
| `POST /contacts` | Auth | Add a trusted contact |
| `GET /forum` | Public | Get all forum posts |
| `POST /forum` | Auth | Create a forum post |
| `GET /modules` | Auth | Get all therapy modules |
| `GET /modules/:id` | Auth | Get a specific module |
| `GET /quotes` | Auth | Get a daily motivational quote |
| `GET /notifications` | Auth | Get user notifications |
| `POST /support` | Public | Submit a Contact Us inquiry (sends email) |
| `GET /mentor/students` | Mentor | Get assigned students |
| `GET /mentor/sessions` | Mentor | Get scheduled sessions |
| `POST /mentor/schedule` | Mentor | Schedule a session (creates Google Meet) |
| `PUT /mentor/sessions/:id/notes` | Mentor | Add notes to a session |
| `PUT /mentor/students/:id/risk` | Mentor | Toggle student at-risk flag |
| `GET /admin/stats` | Admin | Get platform-wide statistics |
| `GET /admin/users` | Admin | Get all users |
| `DELETE /admin/users/:id` | Admin | Soft-delete user with cascading cleanup |
| `GET /admin/mentors` | Admin | Get all mentor profiles |
| `POST /admin/mentors` | Admin | Register a new mentor |
| `PUT /admin/students/:id/assign-mentor` | Admin | Assign a mentor to a student |
| `POST /admin/students/:id/appointments` | Admin | Schedule a session (creates Google Meet) |
| `GET /admin/crisis` | Admin | View all crisis logs |
| `GET /admin/allotments` | Admin | View mentor-student assignments |

---

## 🔒 Security Model

- **JWT Authentication**: All protected routes validate a Bearer token signed with `JWT_SECRET`.
- **Role-Based Access Control (RBAC)**: The `protect` + `requireRole()` middleware chain enforces that students can't access admin/mentor routes and vice versa.
- **Stricter Auth Rate Limiting**: Login and register routes are capped at **20 requests per 15 minutes** per IP. All other API routes are capped at **500 requests per 15 minutes**.
- **HTTP Security Headers**: Helmet.js sets secure `Content-Security-Policy`, `X-Frame-Options`, and other headers.
- **NoSQL Injection Prevention**: `express-mongo-sanitize` strips `$` and `.` operators from incoming request data.
- **Gzip Compression**: All responses are compressed via the `compression` middleware.
- **Soft Deletes**: Users are never hard-deleted. A `deletedAt` timestamp is set and a Mongoose query middleware globally filters these documents from all `find()` operations.
- **Email Verification**: New student accounts are inactive until a 6-digit OTP code is verified (expires in 15 minutes).

---

## ⚙️ Setup & Installation

### Prerequisites
- **Node.js** v18+
- **MongoDB** (Local or MongoDB Atlas cloud cluster)
- A **Google Cloud** project with the Google Calendar API enabled (for video session scheduling)
- A **Gmail** account with an App Password (for email features)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/MannMitra.git
cd MannMitra
```

### 2. Configure Backend Environment
Create a `.env` file in the `/backend` directory by copying the example:
```bash
cp backend/.env.example backend/.env
```
Then fill in all the required values:
```env
# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/mannmitra

# App Settings
PORT=5000
JWT_SECRET=your_strong_random_jwt_secret_key
FRONTEND_URL=http://localhost:5173

# AI Service (Gemini)
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio

# Email Service (Nodemailer via Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-char-gmail-app-password

# Google OAuth for Calendar/Meet Integration
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GOOGLE_REFRESH_TOKEN=your_google_oauth_refresh_token
```

> **Note:** For local development, if `EMAIL_USER` and `EMAIL_PASS` are not set, OTP codes will be printed to the server console instead of being sent by email.

### 3. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Seed Therapy Modules (Optional)
Populate the database with initial therapy module content:
```bash
cd backend
node seedModules.js
```

### 5. Start Development Servers

```bash
# Terminal 1: Start the backend
cd backend
npm run dev    # Uses nodemon for auto-restart

# Terminal 2: Start the frontend
cd frontend
npm run dev    # Vite dev server with HMR
```

The application will be available at:
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 🗺️ Application Routes

| Path | Access | Page |
|---|---|---|
| `/` | Public | Landing Page |
| `/about` | Public | About MannMitra |
| `/contact` | Public | Contact Us |
| `/privacy` | Public | Privacy Policy |
| `/library` | Public | Resource Library |
| `/forum` | Public | Community Forum |
| `/register` | Public | Student Registration |
| `/verify-email` | Public | OTP Verification |
| `/login` | Public | Login |
| `/dashboard` | Student | Main Dashboard |
| `/assessment` | Student | PHQ-9 Assessment |
| `/chat` | Student | AI Mitra Chatbot |
| `/contacts` | Auth | Trusted Contacts |
| `/badges` | Auth | Badge Gallery |
| `/therapy-modules` | Auth | Module Browser |
| `/modules/breathing-bubble` | Auth | Breathing Exercise |
| `/modules/mood-canvas` | Auth | Drawing Canvas |
| `/modules/gratitude-journal` | Auth | Gratitude Journal |
| `/modules/:id` | Auth | Dynamic Module Content |
| `/rbt-game` | Auth | RBT Thought Challenge Game |
| `/rbt-abcde` | Auth | ABCDE CBT Method Tool |
| `/student/session` | Auth | Student Video Session |
| `/mentor-dashboard` | Mentor | Mentor Dashboard |
| `/mentor/session` | Mentor | Mentor Video Session |
| `/admin` | Admin | Admin Control Panel |

---

## 🏗️ Production Deployment Notes

- Set `NODE_ENV=production` on the server.
- Set `FRONTEND_URL` to your deployed frontend domain to restrict CORS.
- The backend is production-ready with `helmet`, `compression`, `trust proxy`, and `express-rate-limit`.
- The Global Safety Audit background job is configured to run every **12 hours** in production.
- For **Render/Railway**: Use `node server.js` as the start command.
- For **Vercel (Frontend)**: Build with `npm run build` and deploy the `dist/` folder.

---

## 📄 License

This project is for educational purposes. All rights reserved © 2026 MannMitra.

---

*MannMitra — Empowering Minds, Saving Lives.* 💙
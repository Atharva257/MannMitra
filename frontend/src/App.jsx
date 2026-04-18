import React, { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PageLoader from "./components/PageLoader";
import BadgeCelebration from "./components/BadgeCelebration";

// Lazy Loaded Pages
const Register = lazy(() => import("./pages/Register"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const Login = lazy(() => import("./pages/Login"));
const Assessment = lazy(() => import("./pages/Assessment"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Chatbot = lazy(() => import("./pages/Chatbot"));
const TrustedContact = lazy(() => import("./pages/TrustedContact"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const MentorDashboard = lazy(() => import("./pages/MentorDashboard"));
const LandingPage = lazy(() => import("./pages/LandingPage"));
const MentorSession = lazy(() => import("./pages/MentorSession"));
const StudentSession = lazy(() => import("./pages/StudentSession"));
const RBTGame = lazy(() => import("./pages/RBTGame"));
const TherapyModules = lazy(() => import("./pages/TherapyModules"));
const ABCDEGame = lazy(() => import("./pages/ABCDEGame"));
const ModuleDetail = lazy(() => import("./pages/ModuleDetail"));
const BreathingBubble = lazy(() => import("./pages/BreathingBubble"));
const MoodCanvas = lazy(() => import("./pages/MoodCanvas"));
const GratitudeJournal = lazy(() => import("./pages/GratitudeJournal"));
const ResourceLibrary = lazy(() => import("./pages/ResourceLibrary"));
const Forum = lazy(() => import("./pages/Forum"));
const BadgeGallery = lazy(() => import("./pages/BadgeGallery"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));

function App() {
  const [auth, setAuth] = useState(() => !!localStorage.getItem("token"));
  const [role, setRole] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return user?.role || null;
    } catch (e) {
      return null;
    }
  });
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const updateAuth = () => {
      const token = localStorage.getItem("token");
      const userJson = localStorage.getItem("user");
      try {
        const user = userJson ? JSON.parse(userJson) : null;
        setAuth(!!token);
        setRole(user?.role || null);
      } catch (e) {
        setAuth(false);
        setRole(null);
      }
      setIsInitializing(false);
    };

    updateAuth();
    window.addEventListener("authChange", updateAuth);
    window.addEventListener("popstate", updateAuth);

    return () => {
      window.removeEventListener("authChange", updateAuth);
      window.removeEventListener("popstate", updateAuth);
    };
  }, []);

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-bold animate-pulse uppercase tracking-[0.3em] text-[10px]">Securing Session</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50 dark:from-slate-900 dark:via-gray-900 dark:to-slate-800 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar auth={auth} setAuth={setAuth} role={role} />

        <div className="p-6">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/library" element={<ResourceLibrary />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/login" element={<Login setAuth={setAuth} />} />

              {/* Student-only routes */}
              <Route
                path="/assessment"
                element={auth && role === "student" ? <Assessment /> : <Navigate to="/login" />}
              />
              <Route
                path="/dashboard"
                element={auth && role === "student" ? <Dashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/chat"
                element={auth && role === "student" ? <Chatbot /> : <Navigate to="/login" />}
              />
              <Route
                path="/contacts"
                element={auth ? <TrustedContact /> : <Navigate to="/login" />}
              />

              {/* Admin-only routes */}
              <Route
                path="/admin"
                element={auth && role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />}
              />
              <Route
                path="/mentor-dashboard"
                element={auth && role === "mentor" ? <MentorDashboard /> : <Navigate to="/login" />}
              />

              {/* Video Session Routes */}
              <Route path="/mentor/session" element={<MentorSession />} />
              <Route path="/student/session" element={<StudentSession />} />
              <Route path="/rbt-game" element={<RBTGame />} />
              <Route path="/rbt-abcde" element={<ABCDEGame />} />
              <Route path="/therapy-modules" element={<TherapyModules />} />
              <Route path="/modules/breathing-bubble" element={<BreathingBubble />} />
              <Route path="/modules/mood-canvas" element={<MoodCanvas />} />
              <Route path="/modules/gratitude-journal" element={<GratitudeJournal />} />
              <Route path="/modules/:id" element={<ModuleDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/badges" element={<BadgeGallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
            </Routes>
          </Suspense>
        </div>
        <BadgeCelebration />
      </div>
    </Router>
  );
}

export default App;
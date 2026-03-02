import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";


import Register from "./pages/Register";
import Login from "./pages/Login";
import Assessment from "./pages/Assessment";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./pages/Chatbot";
import TrustedContact from "./pages/TrustedContact";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import MentorSession from "./pages/MentorSession";
import StudentSession from "./pages/StudentSession";

function App() {
  const [auth, setAuth] = useState(false);
  const [role, setRole] = useState(null);

useEffect(() => {
  const updateAuth = () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    setAuth(!!token);
    setRole(user?.role || null);
  };

  // Initial check + auto-refresh whenever route changes
  updateAuth();
  window.addEventListener("authChange", updateAuth);

  // Also re-check auth when user navigates between pages
  window.addEventListener("popstate", updateAuth);

  return () => {
    window.removeEventListener("authChange", updateAuth);
    window.removeEventListener("popstate", updateAuth);
  };
}, []);



  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
        <Navbar auth={auth} setAuth={setAuth} role={role} />

        <div className="p-6">
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login setAuth={setAuth} />} />
            <Route path="/admin-login" element={<AdminLogin setAuth={setAuth} />} />

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
              element={auth && role === "student" ? <TrustedContact /> : <Navigate to="/login" />}
            />

            {/* Admin-only routes */}
            <Route
              path="/admin"
              element={auth && role === "admin" ? <AdminDashboard /> : <Navigate to="/admin/login" />}
            />

            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Video Session Routes */}
            <Route path="/mentor/session" element={<MentorSession />} />
            <Route path="/student/session" element={<StudentSession />} />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
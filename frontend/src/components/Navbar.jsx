import React from "react";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";

function Navbar({ auth, setAuth, role }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white dark:bg-slate-900 shadow-md p-4 flex justify-between items-center transition-colors duration-300">
      <div className="flex items-center gap-2">
        <img src="/MannMitra.png" alt="MannMitra Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-blue-600">MannMitra</h1>
      </div>

      <div className="flex gap-4 text-blue-600 dark:text-blue-400 items-center font-semibold">
        {!auth && <a href="/">Home</a>}
        <Link to="/library">Library</Link>
        <Link to="/forum">Forum</Link>

        {auth && role === "student" && (
          <>
            <Link to="/assessment">Assessment</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/badges">Badges</Link>
            <Link to="/contacts">Emergency Contacts</Link>
          </>
        )}

        {auth && (role === "admin" || role === "mentor") && (
          <>
            <Link to="/contacts">Emergency Contacts</Link>
            {role === "admin" && <Link to="/admin">Admin Dashboard</Link>}
            {role === "mentor" && <Link to="/mentor-dashboard">Mentor Dashboard</Link>}
          </>
        )}

        {!auth ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded-lg">Login</Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg ml-2"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import React from "react";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";

function Navbar({ auth, setAuth, role }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(false);
    window.location.href = "/login";
  };

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <img src="/MannMitra.png" alt="MannMitra Logo" className="w-8 h-8" />
        <h1 className="text-xl font-bold text-blue-600">MannMitra</h1>
      </div>

      <div className="flex gap-4 text-blue-600 items-center">
        <a href="/">Home</a>

        {auth && role === "student" && (
          <>
            <Link to="/assessment">Assessment</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/contacts">Contacts</Link>
            <Link to="/dashboard">Dashboard</Link>
          </>
        )}

        {auth && role === "admin" && (
          <Link to="/admin">Admin Dashboard</Link>
        )}

        {!auth ? (
          <>
            <Link to="/register">Register</Link>
            <Link to="/login" className="bg-blue-600 text-white px-3 py-1 rounded-lg">Login</Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <NotificationBell />
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg"
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
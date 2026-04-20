import React, { useState } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { Menu, X, LogOut, ChevronRight, Sparkles } from "lucide-react";

function Navbar({ auth, setAuth, role }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth(false);
    window.location.href = "/login";
  };

  const navLinks = [
    { to: "/", label: "Home", show: !auth },
    { to: "/library", label: "Library", show: true },
    { to: "/forum", label: "Forum", show: true },
    { to: "/assessment", label: "Assessment", show: auth && role === "student" },
    { to: "/dashboard", label: "Dashboard", show: auth && role === "student" },
    { to: "/badges", label: "Badges", show: auth && role === "student" },
    { to: "/contacts", label: "Emergency Contacts", show: auth },
    { to: "/admin", label: "Admin Dashboard", show: auth && role === "admin" },
    { to: "/mentor-dashboard", label: "Mentor Dashboard", show: auth && role === "mentor" },
  ];

  const activeLinks = navLinks.filter(l => l.show);

  return (
    <nav className="z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 lg:h-20 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/MannMitra.png" alt="Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-110" />
          <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white">
            MannMitra
          </h1>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            {activeLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 border-l border-slate-200 dark:border-slate-800 pl-6">
            {!auth ? (
              <>
                <Link to="/register" className="text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 transition-colors text-sm">Register</Link>
                <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black hover:bg-blue-700 shadow-xl shadow-blue-200 dark:shadow-none transition-all active:scale-95 text-sm">
                  Login
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <NotificationBell />
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center gap-3">
          {auth && (
            <>
              <ThemeToggle />
              <NotificationBell />
            </>
          )}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`
        md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl transition-all duration-300 ease-in-out
        ${isMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible"}
      `}>
        <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
          {activeLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-700 dark:text-white font-bold"
            >
              {link.label}
              <ChevronRight size={18} className="text-slate-400" />
            </Link>
          ))}

          {!auth ? (
            <div className="grid grid-cols-2 gap-4 pt-4">
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 font-bold text-slate-700 dark:text-white"
              >
                Register
              </Link>
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center p-4 rounded-2xl bg-blue-600 text-white font-bold"
              >
                Login
              </Link>
            </div>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 mt-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 font-bold rounded-2xl"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
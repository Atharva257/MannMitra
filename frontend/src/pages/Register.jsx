import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { Heart, Brain, Shield, User, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { FiUserPlus } from "react-icons/fi";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const data = await register(form);

      // ✅ Store user session immediately
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setMsg("Account created! Let's start your journey 🌿");
      setMsgType("success");

      // Redirect to assessment after a short delay
      setTimeout(() => {
        navigate("/assessment", { replace: true });
        window.location.reload(); // Ensure auth state updates
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed. Please try again.");
      setMsgType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
      {/* 🌈 Background blobs (Emerald theme) */}
      <div className="absolute w-96 h-96 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob top-[-6rem] left-[-6rem]" />
      <div className="absolute w-80 h-80 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 bottom-[-6rem] right-[-6rem]" />
      <div className="absolute w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating icons */}
      <div className="absolute top-24 right-16 text-emerald-400/60 animate-bounce animation-delay-1000">
        <Heart className="w-8 h-8" />
      </div>
      <div className="absolute top-36 left-20 text-teal-400/60 animate-bounce animation-delay-3000">
        <Brain className="w-10 h-10" />
      </div>
      <div className="absolute bottom-28 right-28 text-blue-400/60 animate-bounce animation-delay-5000">
        <Shield className="w-9 h-9" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl p-8 mx-4">
        <div className="flex flex-col items-center mb-8">
          <img src="/MannMitra.png" alt="MannMitra Logo" className="w-16 h-16 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Join MannMitra
          </h1>
          <p className="text-gray-600 text-center text-sm mt-2">
            Start your personalized path to{" "}
            <span className="font-semibold text-emerald-600">better mindfulness</span>
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 outline-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 outline-none transition"
              disabled={isLoading}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-4 focus:ring-emerald-200/50 focus:border-emerald-400 outline-none transition"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-emerald-200/50 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Creating Account...
              </>
            ) : (
              <>
                <FiUserPlus /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Message */}
        {msg && (
          <p
            className={`mt-6 p-3 rounded-xl text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 ${msgType === "success"
              ? "bg-emerald-100/70 text-emerald-700"
              : "bg-red-100/70 text-red-700"
              }`}
          >
            {msg}
          </p>
        )}

        {/* Links */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="font-semibold text-emerald-600 hover:text-teal-600 transition">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
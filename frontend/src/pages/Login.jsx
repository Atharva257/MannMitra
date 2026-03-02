import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { Heart, Brain, Shield, Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { login } from "../services/authService";

function Login({ setAuth }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  // ✅ Auto redirect if already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      if (storedUser.role === "admin") {
        navigate("/admin");
      } else if (storedUser.firstLogin || !storedUser.assessmentCompleted) {
        navigate("/assessment");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const data = await login(form);

      // ✅ Store user session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      if (setAuth) {
        setAuth(true);
        window.dispatchEvent(new Event("authChange"));
      }

      setMsg(`Welcome back, ${data.name || "User"} 🌿`);
      setMsgType("success");

      // ✅ Redirect with React Router
      if (data.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (data.firstLogin === true || data.assessmentCompleted === false) {
        navigate("/assessment", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid credentials. Please try again.");
      setMsgType("error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-teal-50 to-emerald-50">
      {/* 🌈 Background blobs */}
      <div className="absolute w-96 h-96 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob top-[-6rem] left-[-6rem]" />
      <div className="absolute w-80 h-80 bg-teal-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 bottom-[-6rem] right-[-6rem]" />
      <div className="absolute w-72 h-72 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

      {/* Floating icons */}
      <div className="absolute top-24 left-16 text-teal-400/60 animate-bounce animation-delay-1000">
        <Heart className="w-8 h-8" />
      </div>
      <div className="absolute top-36 right-20 text-blue-400/60 animate-bounce animation-delay-3000">
        <Brain className="w-10 h-10" />
      </div>
      <div className="absolute bottom-28 left-28 text-emerald-400/60 animate-bounce animation-delay-5000">
        <Shield className="w-9 h-9" />
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/30 backdrop-blur-2xl border border-white/40 rounded-3xl shadow-2xl p-8 mx-4">
        <div className="flex flex-col items-center mb-8">
          <img src="/MannMitra.png" alt="MannMitra Logo" className="w-16 h-16 mb-4 drop-shadow-lg" />
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-center text-sm mt-2">
            Continue your journey towards{" "}
            <span className="font-semibold text-teal-600">mental wellness</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-4 focus:ring-teal-200/50 focus:border-teal-400 outline-none transition"
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
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-white/70 border border-gray-200 focus:ring-4 focus:ring-teal-200/50 focus:border-teal-400 outline-none transition"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.02] hover:shadow-xl focus:ring-4 focus:ring-teal-200/50 transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Logging in...
              </>
            ) : (
              <>
                <FiLogIn /> Login
              </>
            )}
          </button>
        </form>

        {/* Message */}
        {msg && (
          <p
            className={`mt-6 p-3 rounded-xl text-center text-sm font-medium ${
              msgType === "success"
                ? "bg-emerald-100/70 text-emerald-700"
                : "bg-red-100/70 text-red-700"
            }`}
          >
            {msg}
          </p>
        )}

        {/* Links */}
        <p className="text-center text-sm text-gray-600 mt-6">
          New here?{" "}
          <a href="/register" className="font-semibold text-teal-600 hover:text-blue-600 transition">
            Create Account
          </a>
        </p>
        <p className="text-center text-xs text-gray-500 mt-4">
          <a href="/forgot-password" className="hover:text-teal-600">
            Forgot your password?
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
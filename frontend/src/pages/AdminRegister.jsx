import { useState } from "react";
import { UserPlus, Mail, Lock, Shield, Loader2 } from "lucide-react";
import axios from "axios";

function AdminRegister() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      const res = await axios.post("http://localhost:5000/api/admin/auth/register", form);
      setMsg("✅ Admin registered successfully! Redirecting to login...");
      setTimeout(() => (window.location.href = "/admin/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-emerald-50 relative">
      {/* Animated Blobs */}
      <div className="absolute w-96 h-96 bg-gradient-to-r from-purple-200 to-blue-200 blur-3xl opacity-50 rounded-full top-[-10rem] left-[-8rem]" />
      <div className="absolute w-96 h-96 bg-gradient-to-r from-emerald-200 to-blue-200 blur-3xl opacity-50 rounded-full bottom-[-10rem] right-[-8rem]" />

      {/* Card */}
      <div className="relative bg-white/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Admin Registration
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Create an admin account for MannMitra control panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="relative">
            <UserPlus className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Register as Admin"}
          </button>
        </form>

        {msg && (
          <p
            className={`mt-4 text-center text-sm ${
              msg.startsWith("✅") ? "text-green-700" : "text-red-600"
            }`}
          >
            {msg}
          </p>
        )}

        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Already registered?{" "}
            <a
              href="/admin/login"
              className="font-semibold text-blue-600 hover:text-purple-600 transition-colors"
            >
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default AdminRegister;
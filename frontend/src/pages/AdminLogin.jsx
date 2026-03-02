import { useState } from "react";
import { Shield, Lock, Mail, Loader2 } from "lucide-react";
import axios from "axios";

function AdminLogin({ setAuth }) {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const res = await axios.post("http://localhost:5000/api/admin/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      setAuth(true);
      setMsg("✅ Welcome, Admin!");
      setTimeout(() => (window.location.href = "/admin"), 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative">
      {/* Background animation */}
      <div className="absolute w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse top-[-10rem] left-[-8rem]" />
      <div className="absolute w-80 h-80 bg-blue-200/30 rounded-full blur-3xl animate-pulse bottom-[-8rem] right-[-6rem]" />

      {/* Card */}
      <div className="relative bg-white/40 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg">
            <Shield className="text-white w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            Secure access to the MannMitra Admin Panel
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Admin email"
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

          {/* Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Login as Admin"}
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
      </div>
    </div>
  );
}

export default AdminLogin;
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { verifyOTP, resendOTP } from "../services/authService";
import { Mail, Loader2, CheckCircle, ArrowRight, RefreshCw, Smartphone } from "lucide-react";

function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!email) {
      navigate("/login");
    }
  }, [email, navigate]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto focus next
    if (index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return;

    setIsLoading(true);
    setMsg("");

    try {
      const data = await verifyOTP({ email, otp: code });
      
      // Store user session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      
      setMsg("Email verified! Redirecting to your journey...");
      setMsgType("success");

      setTimeout(() => {
        navigate("/assessment", { replace: true });
        window.location.reload(); 
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Verification failed. Please try again.");
      setMsgType("error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP(email);
      setMsg("A new code has been sent to your email.");
      setMsgType("success");
      setTimer(60); // 1 minute cooldown
    } catch (err) {
      setMsg("Failed to resend code. Please try again later.");
      setMsgType("error");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-emerald-50">
      {/* Background patterns */}
      <div className="absolute w-96 h-96 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob top-[-6rem] left-[-6rem]" />
      <div className="absolute w-80 h-80 bg-emerald-200/40 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000 bottom-[-6rem] right-[-6rem]" />

      <div className="relative z-10 w-full max-w-md bg-white/40 backdrop-blur-2xl border border-white/40 rounded-[2.5rem] shadow-2xl p-10 mx-4 text-center">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-emerald-200/50">
            <Mail className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight mb-2">
            Verify Your Email
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed px-4">
            We've sent a 6-digit verification code to <br />
            <span className="font-bold text-emerald-600 italic">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-2xl font-black bg-white rounded-2xl border border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200/50 outline-none transition shadow-sm"
                disabled={isLoading}
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || otp.join("").length < 6}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black shadow-xl shadow-emerald-200/50 hover:scale-[1.02] active:scale-95 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>Verify Account <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        {msg && (
          <div className={`mt-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${msgType === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`}>
            {msgType === "success" ? <CheckCircle size={18} /> : <div className="w-2 h-2 rounded-full bg-red-600" />}
            {msg}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-100/50">
          <p className="text-gray-500 text-sm mb-4">Didn't receive the code?</p>
          <button
            onClick={handleResend}
            disabled={resending || timer > 0}
            className="inline-flex items-center gap-2 text-emerald-600 font-black hover:text-teal-700 transition disabled:text-gray-400"
          >
            {resending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className={`w-4 h-4 ${timer > 0 ? "" : "animate-spin-slow"}`} />
            )}
            {timer > 0 ? `Resend in ${timer}s` : "Resend New Code"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
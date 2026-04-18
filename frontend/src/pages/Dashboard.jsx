import { useEffect, useState, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { getHistory } from "../services/assessmentService";
import { BookOpen, Gamepad2, ArrowRight, Bot, Sparkles, Bell, Download, Award, ChevronRight, Loader2 } from "lucide-react";
import MoodTracker from "../components/MoodTracker";
import MotivationPopup from "../components/MotivationPopup";

const AssessmentChart = lazy(() => import("../components/AssessmentChart"));

function Dashboard() {
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);

  const needsReassessment = history.length > 0 && 
    (new Date() - new Date(history[0].createdAt)) > 14 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyData, profileData] = await Promise.all([
          getHistory(),
          API.get("/users/profile")
        ]);
        setHistory(historyData);
        setUser(profileData.data);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: history.map((h) => new Date(h.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: "PHQ-9 Score",
        data: history.map((h) => h.score),
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74,144,226,0.15)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const exportPDF = async () => {
    const element = document.getElementById("pdf-export-area");
    if (!element) return;
    try {
      // Dynamic imports for heavy libraries to keep initial bundle small
      const [ { default: jsPDF }, { default: html2canvas } ] = await Promise.all([
        import("jspdf"),
        import("html2canvas")
      ]);

      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("MannMitra_Wellness_Report.pdf");
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to export report.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
        <h2 className="text-3xl font-bold text-blue-700">Your Wellness Dashboard 🌿</h2>
      </div>

      {user && (
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-8 md:p-10 mb-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
              Welcome back, {user?.name.split(" ")[0]}!
            </h1>
            <p className="text-blue-100 text-lg md:text-xl font-medium max-w-2xl">
              Here is your wellness overview for today. Take a deep breath and let's check in.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center shrink-0">
            {user?.currentStreak > 0 && (
              <div className="inline-flex items-center gap-3 bg-orange-500/20 border border-orange-400/30 px-6 py-3 rounded-3xl backdrop-blur-md self-start md:self-center">
                <span className="text-3xl">🔥</span>
                <div>
                  <p className="text-[10px] uppercase font-black tracking-widest text-orange-200">Global Wellness</p>
                  <span className="font-bold text-orange-50 text-xl">{user.currentStreak} Day Streak</span>
                </div>
              </div>
            )}
            
            <Link to="/badges" className="flex flex-col gap-2 group">
              <p className="text-[10px] uppercase font-black tracking-widest text-blue-200 ml-1">Achievements</p>
              <div className="flex -space-x-2">
                {user?.badges?.length > 0 ? (
                  <>
                    {user.badges.slice(-3).reverse().map((badge, i) => (
                      <div key={i} className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 flex items-center justify-center text-2xl shadow-lg ring-4 ring-blue-600/20 group-hover:-translate-y-1 transition-transform" title={badge.name}>
                        {badge.icon}
                      </div>
                    ))}
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/30 flex items-center justify-center text-blue-100 font-black text-xs group-hover:bg-white/30 transition shadow-lg">
                      {user.badges.length > 3 ? `+${user.badges.length - 3}` : <ChevronRight size={18} />}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-2xl border border-white/20 transition backdrop-blur-sm">
                    <Award size={20} className="text-yellow-300" />
                    <span className="text-sm font-bold">View Badge Gallery</span>
                  </div>
                )}
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Wellness Overview Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Stats/Mood - Span 2 */}
        <div className="lg:col-span-2 space-y-8">
          <MoodTracker />

          {/* Therapy Modules - Quick Access */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 shadow-sm border border-blue-50 dark:border-slate-700 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Therapy Modules</h3>
              </div>
              <p className="text-gray-500 dark:text-gray-300 max-w-md mb-8 leading-relaxed">
                Continue your journey through our structured mental wellness paths.
                Master anxiety, stress, and build lasting resilience.
              </p>
              <Link
                to="/therapy-modules"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition shadow-xl shadow-blue-100 active:scale-95"
              >
                Explore Modules <ArrowRight size={20} />
              </Link>
            </div>
            {/* Decorative BG */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-50 rounded-full blur-3xl group-hover:bg-blue-100 transition-colors duration-700"></div>
          </div>
        </div>

        {/* Side Panel - Mentor & Games */}
        <div className="space-y-8">
          {/* Mentor Status */}
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 italic">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Your Trusted Mentor
            </h3>
            {user?.mentor ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                    🧑‍🏫
                  </div>
                  <div>
                    <p className="font-bold text-lg">{user.mentor.name}</p>
                    <p className="text-blue-200 text-sm">{user.mentor.specialization}</p>
                  </div>
                </div>
                <Link
                  to="/student/session"
                  className="block w-full text-center py-4 bg-white text-blue-700 rounded-2xl font-black hover:bg-blue-50 transition shadow-inner active:scale-95"
                >
                  Join Video Session
                </Link>
              </div>
            ) : (
              <div className="py-6 text-center text-blue-100 space-y-4">
                <p className="italic">No mentor assigned yet.</p>
                <div className="text-xs bg-white/10 p-3 rounded-xl border border-white/5">
                  Complete your assessment to be paired with a professional.
                </div>
              </div>
            )}
            <div className="absolute bottom-0 right-0 opacity-10 scale-150 transform translate-x-4 translate-y-4">
              <Gamepad2 size={120} />
            </div>
          </div>

          {/* AI Chatbot - New Feature Card */}
          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="font-bold mb-2 flex items-center gap-2">
                <Sparkles size={18} className="text-yellow-300" />
                Meet Your AI Companion
              </h3>
              <p className="text-indigo-100 text-sm mb-6 leading-relaxed">
                Talk to MannMitra AI for instant emotional support, breathing exercises, or just someone to listen.
              </p>
              <Link
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-sm hover:bg-indigo-50 transition active:scale-95 shadow-lg"
              >
                Chat Now <ArrowRight size={16} />
              </Link>
            </div>
            <Bot size={100} className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-500" />
          </div>

          {/* RBT Game Shortcuts */}
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-purple-50 dark:border-slate-700">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
              <Gamepad2 className="text-purple-500" size={20} />
              Reframing Tools
            </h3>
            <div className="space-y-3">
              <Link to="/rbt-game" className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 dark:bg-slate-700/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-slate-700 transition group font-bold">
                Thought Challenger
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/rbt-abcde" className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 dark:bg-slate-700/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition group font-bold">
                ABCDE Model Tool
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes Section */}
      <MotivationPopup />

      {/* Assessment Section */}
      {history.length > 0 ? (
        <>
          {needsReassessment && (
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 mb-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-full">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-800">Time for a Check-in!</h3>
                  <p className="text-orange-700">It's been over 14 days since your last assessment. Take 2 minutes to update your wellness score.</p>
                </div>
              </div>
              <Link to="/assessment" className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition shadow-md">
                Retake Assessment
              </Link>
            </div>
          )}

          <div className="flex justify-between items-end mb-6">
            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">Your Health Record</h3>
            <button onClick={exportPDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition shadow-md active:scale-95">
              <Download size={18} /> Export PDF
            </button>
          </div>

          <div id="pdf-export-area" className="space-y-6 bg-transparent">
            {/* Latest Result */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 dark:border dark:border-slate-700">
            <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">Latest PHQ-9 Result</h3>
            <p className="text-gray-700 dark:text-gray-200 text-lg">
              Score: <strong>{history[0].score}</strong>{" "}
              <span className="text-sm text-gray-500 dark:text-gray-400">({history[0].severity})</span>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Taken on {new Date(history[0].createdAt).toLocaleString()}
            </p>
          </div>

          {/* Progress Chart */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 dark:border dark:border-slate-700 min-h-[300px] flex flex-col items-center justify-center">
            <h3 className="text-lg font-semibold text-purple-600 dark:text-purple-400 mb-4 self-start">Your Progress Over Time</h3>
            <Suspense fallback={<Loader2 className="animate-spin text-purple-600" />}>
              <AssessmentChart data={chartData} />
            </Suspense>
          </div>

          {/* History Table */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 mb-10 dark:border dark:border-slate-700">
            <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
              Past Assessments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-50 dark:bg-slate-700 text-gray-700 dark:text-gray-200">
                    <th className="p-3 border dark:border-slate-600 text-left">Date</th>
                    <th className="p-3 border dark:border-slate-600 text-left">Score</th>
                    <th className="p-3 border dark:border-slate-600 text-left">Severity</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 dark:text-gray-300">
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="p-3 border dark:border-slate-700">{new Date(h.createdAt).toLocaleString()}</td>
                      <td className="p-3 border dark:border-slate-700">{h.score}</td>
                      <td className="p-3 border dark:border-slate-700 capitalize">{h.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </div>
        </>
      ) : (
        <div className="text-center bg-white rounded-2xl shadow-md p-8 text-gray-600">
          <p>No assessments yet. Take your first one to begin your journey 🌱</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
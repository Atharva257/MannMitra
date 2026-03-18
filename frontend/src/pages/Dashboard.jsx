import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { getHistory } from "../services/assessmentService";
import { Line } from "react-chartjs-2";
import { BookOpen, Gamepad2, ArrowRight, Bot, Sparkles } from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import MoodTracker from "../components/MoodTracker";
import MotivationPopup from "../components/MotivationPopup";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [history, setHistory] = useState([]);

  const [user, setUser] = useState(null);

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

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
        <h2 className="text-3xl font-bold text-blue-700">Your Wellness Dashboard 🌿</h2>
      </div>

      {/* Wellness Overview Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Stats/Mood - Span 2 */}
        <div className="lg:col-span-2 space-y-8">
          <MoodTracker />

          {/* Therapy Modules - Quick Access */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-blue-50 relative overflow-hidden group">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">Therapy Modules</h3>
              </div>
              <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
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
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-purple-50">
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Gamepad2 className="text-purple-500" size={20} />
              Reframing Tools
            </h3>
            <div className="space-y-3">
              <Link to="/rbt-game" className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition group font-bold">
                Thought Challenger
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
              <Link to="/rbt-abcde" className="flex items-center justify-between p-4 rounded-2xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition group font-bold">
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
          {/* Latest Result */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-3">Latest PHQ-9 Result</h3>
            <p className="text-gray-700 text-lg">
              Score: <strong>{history[0].score}</strong>{" "}
              <span className="text-sm text-gray-500">({history[0].severity})</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Taken on {new Date(history[0].createdAt).toLocaleString()}
            </p>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-purple-600 mb-4">Your Progress Over Time</h3>
            <Line data={chartData} />
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl shadow-md p-6 mb-10">
            <h3 className="text-lg font-semibold text-blue-600 mb-4">
              Past Assessments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-blue-50 text-gray-700">
                    <th className="p-2 border">Date</th>
                    <th className="p-2 border">Score</th>
                    <th className="p-2 border">Severity</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-2 border">{new Date(h.createdAt).toLocaleString()}</td>
                      <td className="p-2 border">{h.score}</td>
                      <td className="p-2 border capitalize">{h.severity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
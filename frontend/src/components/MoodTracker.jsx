import { useEffect, useState } from "react";
import { Smile, Heart, Meh, Frown, Cloud } from "lucide-react";
import API from "../services/api";
import { Line } from "react-chartjs-2";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function MoodTracker() {
  const [mood, setMood] = useState(null);
  const [history, setHistory] = useState([]);

  const moods = [
    { icon: <Smile size={30} />, label: "Happy", color: "text-green-500" },
    { icon: <Heart size={30} />, label: "Calm", color: "text-pink-500" },
    { icon: <Meh size={30} />, label: "Neutral", color: "text-yellow-500" },
    { icon: <Frown size={30} />, label: "Sad", color: "text-blue-500" },
    { icon: <Cloud size={30} />, label: "Stressed", color: "text-gray-500" },
  ];

  // Fetch last 7 days moods
  const fetchHistory = async () => {
    try {
      const { data } = await API.get("/moods/history");
      setHistory(data);

      // If today's mood (last entry) is already set, update state
      const todayMood = data[data.length - 1];
      if (todayMood && todayMood.mood) {
        setMood(todayMood.mood);
      }
    } catch (err) {
      console.error("Error fetching mood history", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Save today's mood
  const handleMoodSelect = async (selectedMood) => {
    if (mood) return; // Prevent selection if already set

    try {
      setMood(selectedMood);
      await API.post("/moods", { mood: selectedMood });
      fetchHistory();
    } catch (err) {
      console.error("Error saving mood", err);
      // Reset if failed
      setMood(null);
    }
  };

  // Prepare data for chart
  const chartData = {
    labels: history.map((m) => {
      const d = new Date(m.createdAt);
      return isNaN(d) ? "N/A" : d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: "Mood Trend",
        data: history.map((m) =>
          m.mood ? ["Happy", "Calm", "Neutral", "Sad", "Stressed"].indexOf(m.mood) + 1 : null
        ),
        borderColor: "#14b8a6",
        tension: 0.3,
        fill: false,
        spanGaps: true,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          callback: (value) =>
            ["Happy", "Calm", "Neutral", "Sad", "Stressed"][value - 1] || "",
        },
        min: 1,
        max: 5,
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-2xl p-6 mb-8">
      <h3 className="text-xl font-semibold text-teal-700 mb-4">
        {mood ? "Your mood for today is set 🌿" : "How are you feeling today?"}
      </h3>

      {/* Emoji Mood Selector */}
      <div className="flex justify-center gap-6 mb-6">
        {moods.map((m, idx) => (
          <button
            key={idx}
            onClick={() => handleMoodSelect(m.label)}
            disabled={!!mood}
            className={`flex flex-col items-center transition-transform ${!mood ? "hover:scale-110" : "cursor-not-allowed"
              } ${mood === m.label ? "opacity-100 scale-110" : "opacity-40"
              }`}
          >
            <div className={`text-4xl ${m.color}`}>{m.icon}</div>
            <span className="text-sm mt-1 font-medium">{m.label}</span>
          </button>
        ))}
      </div>

      {mood && (
        <p className="text-center text-gray-500 mb-6 italic">
          You logged your feeling as <span className="font-bold text-teal-600">{mood}</span>.
          Selection is locked for today.
        </p>
      )}

      {/* Chart */}
      <div className="bg-gray-50 rounded-xl p-4">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default MoodTracker;
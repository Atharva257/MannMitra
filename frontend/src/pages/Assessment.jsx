import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { phq9Questions } from "../data/phq9";
import CrisisModal from "../components/CrisisModal";

function Assessment() {
  const [answers, setAnswers] = useState(Array(9).fill(null));
  const [result, setResult] = useState(null);
  const [showCrisis, setShowCrisis] = useState(false);
  const navigate = useNavigate();

  const handleChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Calculate score & severity
      const score = answers.reduce((acc, curr) => acc + (curr ?? 0), 0);
      let severity = "Minimal";
      if (score >= 5 && score <= 9) severity = "Mild";
      else if (score >= 10 && score <= 14) severity = "Moderate";
      else if (score >= 15 && score <= 19) severity = "Moderately Severe";
      else if (score >= 20) severity = "Severe";

      setResult({ score, severity });

      // 2️⃣ Crisis alert check
      if (score >= 15 || answers[8] > 0) {
        setShowCrisis(true);
      }

      // 3️⃣ Save to backend: mark assessment complete
      await axios.put(
        "http://localhost:5000/api/users/complete-assessment",
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // 4️⃣ Update localStorage
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        user.assessmentCompleted = true;
        localStorage.setItem("user", JSON.stringify(user));
      }

      // 5️⃣ Redirect to dashboard after short delay
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      alert("Error submitting assessment");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header with logo */}
      <div className="flex items-center gap-2 mb-6">
        <img src="/MannMitra.png" alt="Logo" className="w-8 h-8" />
        <h2 className="text-2xl font-bold text-green-700">PHQ-9 Assessment</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {phq9Questions.map((q, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow-md">
            <p className="font-medium text-gray-700">{i + 1}. {q}</p>
            <select
              onChange={(e) => handleChange(i, e.target.value)}
              required
              className="mt-2 w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Assessment
        </button>
      </form>

      {result && (
        <div className="bg-green-50 border border-green-200 p-6 mt-6 rounded-xl">
          <h3 className="text-lg font-semibold text-green-700">Results</h3>
          <p>Score: <strong>{result.score}</strong></p>
          <p>Severity: {result.severity}</p>
        </div>
      )}

      {showCrisis && <CrisisModal onClose={() => setShowCrisis(false)} />}
    </div>
  );
}

export default Assessment;
import { useEffect, useState } from "react";
import { getTodaysQuote } from "../services/quoteService";
import { X, Star } from "lucide-react";

function MotivationPopup() {
  const [visible, setVisible] = useState(true);
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    // show only once per session
    if (sessionStorage.getItem("motivationShown")) {
      setVisible(false);
      return;
    }

    const fetchQuote = async () => {
      try {
        const q = await getTodaysQuote();
        setQuote(q);
        sessionStorage.setItem("motivationShown", "true");
      } catch (err) {
        console.error("Quote fetch failed", err);
      }
    };

    fetchQuote();

    const timer = setTimeout(() => setVisible(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible || !quote) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm text-center relative animate-fadeIn">
        <button onClick={() => setVisible(false)} className="absolute top-3 right-3 text-gray-500 hover:text-teal-600">
          <X size={20} />
        </button>

        <div className="text-yellow-500 flex justify-center mb-4 animate-pulse">
          <Star size={40} />
        </div>

        <h3 className="text-2xl font-semibold text-teal-700 mb-2">Daily Motivation 🌞</h3>
        <p className="text-gray-700 italic mb-2">"{quote.text}"</p>
        <p className="text-sm text-gray-500">— {quote.author}</p>
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fadeIn {
            animation: fadeIn 0.4s ease-in-out;
          }
        `}
      </style>
    </div>
  );
}

export default MotivationPopup;
import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { Award, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BadgeCelebration = () => {
  const [activeBadge, setActiveBadge] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const handleNewBadge = (event) => {
      const newBadges = event.detail;
      setQueue((prev) => [...prev, ...newBadges]);
    };

    window.addEventListener("newBadgesEarned", handleNewBadge);
    return () => window.removeEventListener("newBadgesEarned", handleNewBadge);
  }, []);

  useEffect(() => {
    if (!activeBadge && queue.length > 0) {
      const nextBadge = queue[0];
      setQueue((prev) => prev.slice(1));
      showCelebration(nextBadge);
    }
  }, [queue, activeBadge]);

  const showCelebration = (badge) => {
    setActiveBadge(badge);

    // Play Sound
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3");
    audio.play().catch((e) => console.log("Audio play blocked", e));

    // Confetti!
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setActiveBadge(null);
    }, 5000);
  };

  return (
    <AnimatePresence>
      {activeBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 100 }}
          className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[10000] w-full max-w-sm"
        >
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-yellow-400 p-6 mx-4 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-300 via-orange-500 to-yellow-300 animate-pulse"></div>
            
            <button 
              onClick={() => setActiveBadge(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-5xl mb-4 shadow-lg ring-4 ring-yellow-100 dark:ring-yellow-900/30">
                {activeBadge.icon || "🏅"}
              </div>
              
              <div className="inline-block px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-black uppercase tracking-widest mb-2">
                New Achievement Unlocked!
              </div>
              
              <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-1">
                {activeBadge.name}
              </h2>
              
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                {activeBadge.category} Milestone Reached
              </p>
            </div>
            
            {/* Interactive Shine Effect */}
            <div className="absolute -inset-x-20 top-0 h-full w-20 bg-white/20 skew-x-[-30deg] animate-shine"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeCelebration;
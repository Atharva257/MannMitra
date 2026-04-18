import React, { useState, useEffect } from "react";
import { ArrowLeft, Award, Lock, Star, Zap, Activity, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

const ALL_BADGES = [
  // Streak
  { name: "First Step", category: "Streak", icon: "🌱", desc: "Logged your first activity" },
  { name: "3-Day Streak", category: "Streak", icon: "🔥", desc: "3 days of consistent wellness" },
  { name: "Week Warrior", category: "Streak", icon: "🛡️", desc: "7 days of consistent wellness" },
  { name: "Fortnight Strong", category: "Streak", icon: "⚔️", desc: "14 days of consistent wellness" },
  { name: "Monthly Champion", category: "Streak", icon: "👑", desc: "30 days of consistent wellness" },
  
  // Therapy
  { name: "Deep Breather", category: "Therapy", icon: "🌬️", desc: "Completed first breathing session" },
  { name: "Calm Master", category: "Therapy", icon: "🧘", desc: "Completed 10 breathing sessions" },
  { name: "Artist Within", category: "Therapy", icon: "🎨", desc: "First mood canvas session" },
  { name: "Color Your Mind", category: "Therapy", icon: "🌈", desc: "Completed 5 canvas sessions" },
  { name: "Grateful Heart", category: "Therapy", icon: "✍️", desc: "First gratitude journal entry" },
  { name: "Gratitude Guru", category: "Therapy", icon: "🙏", desc: "7 gratitude entries" },

  // CBT
  { name: "Thought Challenger", category: "CBT", icon: "🧩", desc: "First ABCDE exercise" },
  { name: "Mind Shifter", category: "CBT", icon: "🌀", desc: "5 reframing sessions" },
  { name: "Pattern Breaker", category: "CBT", icon: "🔨", desc: "10 CBT exercises" },

  // Assessment
  { name: "Self Aware", category: "Assessment", icon: "👁️", desc: "First PHQ-9 assessment" },
  { name: "Check-In Pro", category: "Assessment", icon: "📊", desc: "3 wellness assessments" },

  // Connection
  { name: "Not Alone", category: "Connection", icon: "🤝", desc: "Booked first mentor session" },
  { name: "Open Up", category: "Connection", icon: "💬", desc: "First AI chat session" },

  // Milestones
  { name: "MannMitra Star", category: "Milestone", icon: "🌟", desc: "Earned 10 other badges" },
  { name: "Journey Begun", category: "Milestone", icon: "🚀", desc: "Completed onboarding fully" },
  
  // Special
  { name: "Night Owl", category: "Special", icon: "🦉", desc: "Logged activity late at night" },
  { name: "Early Bird", category: "Special", icon: "🌅", desc: "Logged activity early in the morning" }
];

const BadgeGallery = () => {
  const [userBadges, setUserBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setUserBadges(data.badges || []);
      } catch (err) {
        console.error("Failed to fetch badges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  const categories = [...new Set(ALL_BADGES.map(b => b.category))];

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-screen">
      <div className="flex items-center justify-between mb-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
        <div className="text-right">
          <h1 className="text-4xl font-black text-gray-800 dark:text-gray-100 mb-2">Achievement Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400">You've earned <span className="font-bold text-yellow-500">{userBadges.length}</span> out of <span className="font-bold">{ALL_BADGES.length}</span> badges</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.map(cat => (
            <div key={cat} className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="h-px bg-gray-200 dark:bg-slate-700 flex-1"></span>
                <h2 className="text-xl font-black text-gray-400 uppercase tracking-widest">{cat} Badges</h2>
                <span className="h-px bg-gray-200 dark:bg-slate-700 flex-1"></span>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {ALL_BADGES.filter(b => b.category === cat).map(badge => {
                  const isEarned = userBadges.some(ub => ub.name === badge.name);
                  const earnedDetails = userBadges.find(ub => ub.name === badge.name);
                  
                  return (
                    <div 
                      key={badge.name}
                      className={`relative group p-6 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col items-center text-center ${
                        isEarned 
                          ? "bg-white dark:bg-slate-800 border-yellow-200 dark:border-yellow-900/30 shadow-xl shadow-yellow-100/50 dark:shadow-none" 
                          : "bg-gray-50/50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800 grayscale hover:grayscale-0"
                      }`}
                    >
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-4 transition-transform duration-500 group-hover:scale-110 ${
                        isEarned 
                          ? "bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20" 
                          : "bg-gray-100 dark:bg-slate-800"
                      }`}>
                        {isEarned ? badge.icon : <Lock size={24} className="text-gray-300 dark:text-gray-600" />}
                      </div>
                      
                      <h3 className={`font-black text-sm mb-1 ${isEarned ? "text-gray-800 dark:text-gray-100" : "text-gray-400 dark:text-gray-600"}`}>
                        {badge.name}
                      </h3>
                      
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">
                        {badge.desc}
                      </p>

                      {isEarned && (
                        <div className="absolute top-4 right-4 text-yellow-500">
                          <Star size={12} fill="currentColor" />
                        </div>
                      )}
                      
                      {isEarned && earnedDetails && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 w-full opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-[9px] text-gray-400 uppercase font-bold tracking-tighter">
                            Earned {new Date(earnedDetails.awardedAt).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BadgeGallery;
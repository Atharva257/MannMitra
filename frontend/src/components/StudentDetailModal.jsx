import React, { useEffect, useState } from "react";
import API from "../services/api";
import { X, TrendingUp, Calendar, Shield, User as UserIcon, Award } from "lucide-react";

const StudentDetailModal = ({ studentId, onClose }) => {
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const role = user?.role || "student";
        const baseRoute = role === "admin" ? "/admin" : "/mentor";
        
        const [s, a] = await Promise.all([
          API.get(`${baseRoute}/students/${studentId}`),
          API.get(`${baseRoute}/students/${studentId}/assessments`),
        ]);
        setStudent(s.data);
        setAssessments(a.data);
      } catch (err) {
        console.error("Failed to fetch student details", err);
      } finally {
        setLoading(false);
      }
    };
    if (studentId) fetchData();
  }, [studentId]);

  if (loading) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl animate-pulse">Loading Analytics...</div>
    </div>
  );

  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-all">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{student.name}</h2>
              <p className="text-blue-100 text-sm">{student.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/30">
              <p className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase mb-1">Current Status</p>
              <h4 className={`text-xl font-black ${student.isAtRisk ? 'text-red-600' : 'text-green-600'}`}>
                {student.isAtRisk ? 'High Risk' : 'Stable'}
              </h4>
            </div>
            <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-900/30">
              <p className="text-purple-600 dark:text-purple-400 text-[10px] font-black uppercase mb-1">Latest PHQ-9</p>
              <h4 className="text-xl font-black text-purple-700 dark:text-purple-400">
                {assessments[0]?.score || "N/A"}
              </h4>
            </div>
            <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
              <p className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase mb-1">Total Sessions</p>
              <h4 className="text-xl font-black text-emerald-700 dark:text-emerald-400">
                {student.stats?.sessionCount || 0}
              </h4>
            </div>
          </div>

          {/* Performance Trend */}
          <div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight italic">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              CLINICAL HISTORY
            </h3>
            <div className="bg-white dark:bg-slate-900 border dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-gray-50 dark:bg-slate-800 border-b dark:border-slate-800">
                  <tr>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Score</th>
                    <th className="p-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Severity</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {assessments.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition">
                      <td className="p-4 text-gray-700 dark:text-gray-300 font-bold">{new Date(a.date).toLocaleDateString()}</td>
                      <td className="p-4 font-black text-blue-600 dark:text-blue-400">{a.score}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-tighter ${
                          a.severity === "Severe" ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400" :
                          a.severity === "Moderate" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400" :
                          "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        }`}>
                          {a.severity.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {assessments.length === 0 && (
                    <tr>
                      <td colSpan="3" className="p-12 text-center text-gray-400 italic font-black">No clinical data points recorded</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Therapy Inventory */}
          <div>
            <h3 className="text-lg font-black text-gray-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-tight italic">
              <Award className="w-5 h-5 text-indigo-600" />
              THERAPY INVENTORY
            </h3>
            <div className="flex flex-wrap gap-3">
              {student.modules && student.modules.length > 0 ? (
                student.modules.map((m, idx) => (
                  <div key={idx} className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20 rounded-2xl min-w-[150px]">
                    <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest mb-1">{m.category}</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{m.title}</p>
                  </div>
                ))
              ) : (
                <div className="w-full p-8 text-center bg-gray-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700 text-gray-400 italic text-sm font-bold">
                  No therapy modules assigned (Self-Guided).
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t dark:border-slate-800 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl font-black text-[10px] uppercase text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-750 transition"
          >
            Close Analyst View
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
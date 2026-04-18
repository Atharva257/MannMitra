import React, { useEffect, useState } from "react";
import API from "../services/api";
import { 
  Users, Calendar, Video, Clock, ChevronRight, 
  ShieldAlert, TrendingUp, LayoutDashboard, Plus, 
  Trash2, Mail, ExternalLink, Award, Search,
  CheckCircle2, AlertCircle, CalendarRange
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StudentDetailModal from "../components/StudentDetailModal";

function MentorDashboard() {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, upcomingSessions: 0, atRiskCount: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ studentId: "", date: "" });

  const fetchData = async () => {
    try {
      const [sRes, sessRes] = await Promise.all([
        API.get("/mentor/students"),
        API.get("/mentor/sessions"),
      ]);
      setStudents(sRes.data);
      setSessions(sessRes.data);
      setStats({
        totalStudents: sRes.data.length,
        upcomingSessions: sessRes.data.filter(s => s.status === "scheduled").length,
        atRiskCount: sRes.data.filter(s => s.isAtRisk).length,
      });
    } catch (err) {
      console.error("Mentor dashboard fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    if (!scheduleForm.studentId || !scheduleForm.date) return;
    try {
      await API.post("/mentor/schedule", scheduleForm);
      setIsScheduleModalOpen(false);
      setScheduleForm({ studentId: "", date: "" });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to schedule session");
    }
  };

  const handleToggleRisk = async (studentId, currentRiskStatus) => {
    try {
      await API.put(`/mentor/students/${studentId}/risk`, { isAtRisk: !currentRiskStatus });
      fetchData();
    } catch (err) {
      alert("Failed to update risk status");
    }
  };

  const handleSaveNotes = async (sessionId, notes) => {
    try {
      await API.put(`/mentor/sessions/${sessionId}/notes`, { notes });
      fetchData();
    } catch (err) {
      alert("Failed to save notes");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing Clinical Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col sticky top-0 h-auto lg:h-screen z-10 transition-colors duration-300 shadow-sm overflow-y-auto pt-16">
        <div className="p-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-600/20 mb-8">
            <h3 className="text-sm font-black text-blue-700 dark:text-blue-400 uppercase tracking-widest mb-1">Clinical View</h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">Managing guidance and mental wellness journeys.</p>
          </div>

          <nav className="space-y-1">
            {[
              { id: "overview", label: "Overview", icon: LayoutDashboard },
              { id: "roster", label: "Clinical Roster", icon: Users },
              { id: "scheduler", label: "Session Scheduler", icon: CalendarRange },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
                  activeTab === item.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" 
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 pt-10 lg:pt-20 transition-all duration-300 overflow-x-hidden">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
                {activeTab === "overview" && "Performance Center"}
                {activeTab === "roster" && "Clinical Roster"}
                {activeTab === "scheduler" && "Session Scheduler"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Mentor oversight & student wellness monitoring</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsScheduleModalOpen(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                SCHEDULE SESSION
              </button>
            </div>
          </header>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "blue" },
                    { label: "Upcoming Sessions", value: stats.upcomingSessions, icon: Video, color: "purple" },
                    { label: "At-Risk Alerts", value: stats.atRiskCount, icon: ShieldAlert, color: "red" },
                  ].map((stat, i) => (
                    <div key={i} className="group p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600 dark:text-${stat.color}-400 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{stat.value}</h3>
                    </div>
                  ))}
                </div>

                {/* Performance Chart Logic Placeholder / Quick Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Priority Alerts */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight italic">
                      <AlertCircle className="w-5 h-5 text-red-500 font-black" />
                      Priority Clinical Alerts
                    </h2>
                    <div className="space-y-4">
                      {students.filter(s => s.isAtRisk).length > 0 ? (
                        students.filter(s => s.isAtRisk).map(s => (
                          <div key={s._id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
                            <div>
                              <p className="font-black text-red-800 dark:text-red-400">{s.name}</p>
                              <p className="text-[10px] text-red-600 dark:text-red-500 font-bold uppercase tracking-widest">Marked as High Risk</p>
                            </div>
                            <button 
                              onClick={() => setSelectedStudentId(s._id)}
                              className="px-4 py-2 bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 rounded-xl font-black text-[10px] uppercase shadow-sm hover:bg-red-600 hover:text-white transition"
                            >
                              View History
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center text-slate-400 italic">
                          <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20 text-green-500" />
                          No priority clinical alerts at this time.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upcoming Schedule Shortcut */}
                  <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
                    <h2 className="text-lg font-black text-slate-800 dark:text-white mb-6 flex items-center gap-2 uppercase tracking-tight italic">
                      <Clock className="w-5 h-5 text-blue-500" />
                      Next 24 Hours
                    </h2>
                    <div className="space-y-4">
                      {sessions.filter(s => s.status === "scheduled").slice(0, 3).length > 0 ? (
                        sessions.filter(s => s.status === "scheduled").slice(0, 3).map(sess => (
                          <div key={sess._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600">
                                <Video className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-black text-slate-800 dark:text-white">{sess.student?.name}</p>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                  {new Date(sess.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-slate-400 hover:text-blue-600 cursor-pointer" />
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center text-slate-400 italic">
                          No sessions scheduled for the next 24 hours.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "roster" && (
              <motion.div 
                key="roster"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {students.map(s => (
                  <div key={s._id} className="group bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-300">
                    <div className={`h-2 bg-gradient-to-r ${s.isAtRisk ? 'from-red-500 to-red-600' : 'from-blue-500 to-indigo-600'}`}></div>
                    <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-14 h-14 bg-slate-100 dark:bg-slate-700 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                          <Users className="w-7 h-7" />
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {s.isAtRisk && (
                            <span className="bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ring-1 ring-red-200 dark:ring-red-900 animate-pulse">
                              AT RISK
                            </span>
                          )}
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                            {s.badges?.length || 0} BADGES
                          </span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1 leading-tight">{s.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">{s.email}</p>

                      {/* Therapy Tags */}
                      <div className="mb-8">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">Therapy Assigned</p>
                        <div className="flex flex-wrap gap-2">
                          {s.modules && s.modules.length > 0 ? (
                            s.modules.map((m, idx) => (
                              <span key={idx} className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2.5 py-1.5 rounded-xl text-[10px] font-bold border border-blue-100 dark:border-blue-900/30">
                                {m.title}
                              </span>
                            ))
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">No therapy packages assigned</span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button 
                          onClick={() => setSelectedStudentId(s._id)}
                          className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-600 dark:text-slate-400 py-3 rounded-2xl font-black text-[10px] tracking-tight uppercase transition-all active:scale-95"
                        >
                          <TrendingUp className="w-4 h-4" />
                          ANALYTICS
                        </button>
                        <button 
                          onClick={() => {
                            setScheduleForm({ ...scheduleForm, studentId: s._id });
                            setIsScheduleModalOpen(true);
                          }}
                          className="flex items-center justify-center gap-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white py-3 rounded-2xl font-black text-[10px] tracking-tight uppercase transition-all active:scale-95"
                        >
                          <Calendar className="w-4 h-4" />
                          SCHEDULE
                        </button>
                      </div>

                      <button 
                        onClick={() => handleToggleRisk(s._id, s.isAtRisk)}
                        className={`w-full mt-3 py-2.5 rounded-xl font-black text-[9px] uppercase tracking-widest transition shadow-inner ${
                          s.isAtRisk 
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30' 
                            : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-100 dark:border-slate-800 hover:text-red-600'
                        }`}
                      >
                        {s.isAtRisk ? 'MARK AS STABLE' : 'FLAG HIGH RISK'}
                      </button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === "scheduler" && (
              <motion.div 
                key="scheduler"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-slate-800 rounded-[32px] p-8 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden relative">
                   <div className="absolute top-0 right-0 p-8 opacity-5">
                      <CalendarRange className="w-32 h-32" />
                   </div>
                   
                   <div className="flex justify-between items-center mb-10">
                      <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Upcoming Clinical Sessions</h2>
                      <div className="flex gap-2">
                        <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-black uppercase tracking-widest ring-1 ring-blue-200">
                          {stats.upcomingSessions} PENDING
                        </span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      {sessions.length > 0 ? sessions.map(sess => (
                        <div key={sess._id} className="group flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-700 hover:border-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300">
                          <div className="flex items-center gap-4 min-w-[200px]">
                            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
                              <span className="font-black text-sm">{new Date(sess.scheduledAt).toLocaleDateString([], { day: '2-digit' })}</span>
                            </div>
                            <div>
                               <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">{new Date(sess.scheduledAt).toLocaleDateString([], { month: 'short', year: 'numeric' })}</p>
                               <p className="text-xl font-black text-slate-800 dark:text-white leading-tight">{sess.student?.name}</p>
                            </div>
                          </div>

                          <div className="flex-1 flex gap-4 w-full">
                            <div className="flex-1 bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-inner border border-slate-100 dark:border-slate-700">
                              <p className="text-[9px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Clinical Documentation
                              </p>
                              <textarea 
                                  className="w-full text-sm bg-transparent border-none outline-none resize-none text-slate-700 dark:text-slate-300 font-medium" 
                                  placeholder="Type session notes here..."
                                  defaultValue={sess.notes || ""}
                                  onBlur={(e) => {
                                      if(e.target.value !== sess.notes) handleSaveNotes(sess._id, e.target.value);
                                  }}
                                  rows="2"
                              ></textarea>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 w-full md:w-auto min-w-[180px]">
                            <div className="flex items-center gap-2 mb-1 px-4">
                              <div className={`w-2 h-2 rounded-full ${sess.status === 'scheduled' ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{sess.status}</span>
                            </div>
                            <a
                                href={sess.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-lg active:scale-95"
                            >
                                <Video className="w-4 h-4" />
                                JOIN SESSION
                            </a>
                            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                              Starts at {new Date(sess.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      )) : (
                        <div className="p-20 text-center text-slate-400 italic">
                          <CalendarRange className="w-16 h-16 mx-auto mb-4 opacity-10" />
                          No clinical sessions on the calendar.
                        </div>
                      )}
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Analytics Modal Wrapper */}
      {selectedStudentId && (
        <StudentDetailModal 
          studentId={selectedStudentId} 
          onClose={() => setSelectedStudentId(null)} 
        />
      )}

      {/* Scheduling Modal */}
      <AnimatePresence>
        {isScheduleModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden p-8 border border-white/20"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                    <CalendarRange className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Sync New Session</h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Clinical Scheduling Interface</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleScheduleSession} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Select Clinical Subject</label>
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition outline-none appearance-none"
                    value={scheduleForm.studentId}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, studentId: e.target.value })}
                    required
                  >
                    <option value="">Choose a student...</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Session Datetime</label>
                  <input 
                    type="datetime-local" 
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl font-bold text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition outline-none"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="flex-1 py-4 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest hover:text-slate-800 transition"
                  >
                    CANCEL ABORT
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/30 transition active:scale-95"
                  >
                    CONFIRM & SYNC
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default MentorDashboard;
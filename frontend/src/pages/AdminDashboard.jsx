import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { 
  Users, UserPlus, Calendar, PhoneCall, ShieldAlert, 
  TrendingUp, Award, Clock, MoreVertical, 
  ChevronRight, LayoutDashboard, Settings,
  Loader2, Plus, Trash2, Mail, ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import StudentDetailModal from "../components/StudentDetailModal";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalMentors: 0, pendingAssessments: 0, averagePhqScore: 0 });
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchData = async () => {
    try {
      const [u, m, st, ap, c] = await Promise.all([
        API.get("/admin/users"),
        API.get("/admin/mentors"),
        API.get("/admin/stats"),
        API.get("/admin/all-appointments"),
        API.get("/contacts")
      ]);
      setStudents(u.data.filter(user => user.role === "student"));
      setMentors(m.data);
      setStats(st.data);
      setAppointments(ap.data);
      setContacts(c.data);
    } catch (err) {
      console.error("Dashboard data fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAssignMentor = async (studentId, mentorId) => {
    if (!mentorId) return;
    try {
      await API.put(`/admin/students/${studentId}/assign-mentor`, { mentorId });
      fetchData();
    } catch (err) {
      alert("Assignment failed");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      await API.delete(`/contacts/${id}`);
      fetchData();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-500 font-medium">Initializing Admin Portal...</p>
      </div>
    </div>
  );

  const unassignedStudents = students.filter(s => !s.mentor);
  
  // Group students by mentor
  const mentorStudentGroups = mentors.map(m => ({
    ...m,
    allottedStudents: students.filter(s => s.mentor === m._id || s.mentor?._id === m._id)
  }));

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F8FAFC] dark:bg-slate-910">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 flex flex-col sticky top-0 h-auto lg:h-screen z-20">
        <div className="p-6 flex items-center gap-3 border-b dark:border-slate-800">
          <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            MannMitra
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "overview" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button 
            onClick={() => setActiveTab("mentors")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "mentors" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <Users className="w-5 h-5" />
            <span>Mentor Registry</span>
          </button>
          <button 
            onClick={() => setActiveTab("appointments")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "appointments" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <Calendar className="w-5 h-5" />
            <span>Appointments</span>
          </button>
          <button 
            onClick={() => setActiveTab("emergency")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "emergency" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <ShieldAlert className="w-5 h-5" />
            <span>Crisis Hotlines</span>
          </button>
          <button 
            onClick={() => setActiveTab("registration")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "registration" ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 shadow-sm font-bold' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800'}`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Onboard Mentor</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white capitalize leading-tight">
              {activeTab === 'overview' ? 'Admin Insights' : activeTab.replace(/([A-Z])/g, ' $1')}
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Welcome back, system health is optimal.</p>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[
                  { label: "Students", val: stats.totalStudents, icon: Users, color: "bg-blue-600" },
                  { label: "Mentors", val: stats.totalMentors, icon: Award, color: "bg-purple-600" },
                  { label: "Pending", val: stats.pendingAssessments, icon: Clock, color: "bg-orange-600" },
                  { label: "Avg PHQ-9", val: stats.averagePhqScore, icon: TrendingUp, color: "bg-emerald-600" }
                ].map((s, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center gap-4 transition-transform hover:scale-[1.02]">
                    <div className={`w-12 h-12 ${s.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      <s.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
                      <h4 className="text-3xl font-black text-gray-900 dark:text-white leading-none">{s.val}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Required: Unassigned Students */}
              {unassignedStudents.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-2 mb-4">
                    <ShieldAlert className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <h3 className="text-lg font-black text-red-800 dark:text-red-200 uppercase tracking-tight">Immediate Action Required: {unassignedStudents.length} Pending Allotment</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {unassignedStudents.map(s => (
                      <div key={s._id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-red-50 dark:border-red-900/10 flex items-center justify-between shadow-sm group">
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 dark:text-gray-100 truncate">{s.name}</p>
                          <p className="text-[10px] text-gray-400 uppercase font-black">{s.email}</p>
                        </div>
                        <select 
                          className="ml-3 text-[10px] bg-red-600 text-white font-black px-3 py-2 rounded-xl outline-none shadow-sm hover:bg-red-700 transition"
                          onChange={(e) => handleAssignMentor(s._id, e.target.value)}
                        >
                          <option value="">ALLOT</option>
                          {mentors.map(m => (
                            <option key={m._id} value={m._id}>{m.name}</option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mentors & Students Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-3">
                    <Users className="w-8 h-8 text-blue-600" />
                    Clinical Oversight
                  </h3>
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {mentorStudentGroups.map((m, i) => (
                    <motion.div 
                      key={i} 
                      className="bg-white dark:bg-slate-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col"
                    >
                      <div className="p-8 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-800/50 dark:to-slate-900/50 border-b border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-[1.25rem] flex items-center justify-center text-blue-600 shadow-md font-black text-2xl">
                            {m.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-2xl font-black text-blue-900 dark:text-blue-100">{m.name}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter">
                                {m.specialization}
                              </span>
                              <span className="text-[10px] text-gray-400 font-bold uppercase italic">
                                Primary Lead
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-center sm:text-right bg-white dark:bg-slate-800 px-6 py-4 rounded-2xl shadow-inner border border-white dark:border-white/5">
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Students</p>
                          <p className="text-4xl font-black text-blue-600 dark:text-blue-400 leading-none">{m.allottedStudents.length}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 flex-1">
                        {m.allottedStudents.length > 0 ? (
                          m.allottedStudents.map(s => (
                            <div 
                              key={s._id} 
                              className="group flex items-center justify-between p-4 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 rounded-2xl transition cursor-pointer"
                              onClick={() => setSelectedStudentId(s._id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-2.5 h-2.5 rounded-full ${s.isAtRisk ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'}`}></div>
                                <div>
                                  <p className="font-extrabold text-gray-800 dark:text-gray-200 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition">{s.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase">{s.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-black px-3 py-1 rounded-full border ${s.isAtRisk ? 'border-red-200 bg-red-50 text-red-600 dark:bg-red-900/20 dark:border-red-900/30' : 'border-green-200 bg-green-50 text-green-600 dark:bg-green-900/20 dark:border-green-900/30'}`}>
                                  {s.isAtRisk ? 'CRITICAL' : 'STABLE'}
                                </span>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition" />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 opacity-30 grayscale">
                             <Users className="w-12 h-12 mb-3" />
                             <p className="text-center font-bold text-sm">No Active Engagements</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "mentors" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-8">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h4 className="text-2xl font-black text-blue-900 dark:text-blue-100">Mentor Registry</h4>
                  <div className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full font-black uppercase shadow-sm">
                    {mentors.length} Verified Specialists
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {mentors.map((m, i) => (
                    <div key={i} className="p-8 bg-gray-50/50 dark:bg-slate-800/30 rounded-[2rem] border border-gray-100 dark:border-slate-800/50 flex flex-col items-center text-center group hover:bg-white dark:hover:bg-slate-800 transition shadow-hover">
                      <div className="w-20 h-20 bg-white dark:bg-slate-700 rounded-3xl flex items-center justify-center text-blue-600 shadow-lg text-2xl font-black mb-6 group-hover:scale-110 transition">
                        {m.name.charAt(0)}
                      </div>
                      <h5 className="text-xl font-black text-gray-900 dark:text-white mb-2">{m.name}</h5>
                      <p className="text-blue-600 dark:text-blue-400 font-black text-xs uppercase tracking-widest mb-4">{m.specialization}</p>
                      <div className="w-full pt-6 border-t dark:border-slate-700 flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-2 text-gray-400">
                          <Mail className="w-4 h-4" />
                          <span className="text-[10px] font-bold truncate max-w-[150px]">{m.email}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {mentors.length === 0 && (
                    <div className="col-span-full py-20 text-center text-gray-400 italic font-bold">No specialists registered yet.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "appointments" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-10">
              <div className="flex items-center justify-between mb-10">
                 <h4 className="text-2xl font-black text-blue-900 dark:text-blue-100">Global Scheduling</h4>
                 <div className="flex gap-2 text-[10px] font-black uppercase">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full">Active Sessions</span>
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b dark:border-slate-800 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                      <th className="pb-6 pl-4">Patient Profile</th>
                      <th className="pb-6">Clinician</th>
                      <th className="pb-6">Scheduled Window</th>
                      <th className="pb-6">Verification</th>
                      <th className="pb-6 text-right pr-4">Meeting Access</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-slate-800">
                    {appointments.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/50 transition">
                        <td className="py-6 pl-4">
                           <p className="font-extrabold text-gray-800 dark:text-gray-100">{a.student?.name}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase">{a.student?.email}</p>
                        </td>
                        <td className="py-6">
                           <p className="text-blue-600 dark:text-blue-400 font-black">{a.mentor?.name}</p>
                           <p className="text-[9px] text-gray-400 uppercase font-black italic">{a.mentor?.specialization}</p>
                        </td>
                        <td className="py-6 text-gray-600 dark:text-gray-400 font-bold text-sm">
                           {new Date(a.date).toLocaleDateString()} at {new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-6">
                          <span className={`px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest ${a.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                            {a.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-6 text-right pr-4">
                           <button className="p-3 bg-gray-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition shadow-sm">
                              <ExternalLink className="w-5 h-5" />
                           </button>
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                       <tr>
                          <td colSpan="5" className="py-20 text-center text-gray-400 italic font-bold">No clinical sessions currently orchestrated.</td>
                       </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === "emergency" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-800 p-10">
                <div className="flex items-center justify-between mb-10">
                   <h4 className="text-2xl font-black text-red-900 dark:text-red-400">Global Crisis Grid</h4>
                   <p className="text-xs text-gray-400 font-bold italic max-w-sm text-right">System-wide hotlines accessible to all students in immediate distress.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {contacts.map((c, i) => (
                    <div key={i} className="p-8 bg-gradient-to-br from-red-50/50 to-orange-50/50 dark:from-red-900/10 dark:to-orange-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 relative group hover:scale-[1.02] transition">
                      <button 
                        onClick={() => handleDeleteContact(c._id)}
                        className="absolute top-6 right-6 text-red-200 hover:text-red-600 opacity-0 group-hover:opacity-100 transition p-2"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                      <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-red-600 shadow-md mb-6">
                         <ShieldAlert className="w-6 h-6" />
                      </div>
                      <h5 className="font-black text-gray-900 dark:text-white text-xl mb-1">{c.name}</h5>
                      <p className="text-red-600 dark:text-red-400 font-black text-[10px] uppercase tracking-widest mb-8">{c.relationship}</p>
                      <a href={`tel:${c.phone}`} className="flex w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-red-100 dark:border-red-900/30 items-center justify-center gap-3 font-black text-red-700 dark:text-red-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition shadow-sm">
                        <PhoneCall className="w-5 h-5" />
                        {c.phone}
                      </a>
                    </div>
                  ))}
                  <motion.div 
                    whileHover={{ scale: 0.98 }}
                    className="p-8 border-[3px] border-dashed border-gray-100 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-gray-300 dark:text-slate-700 hover:border-blue-400 dark:hover:border-blue-700 hover:text-blue-600 transition cursor-pointer"
                    onClick={() => {
                        const name = prompt("Official Department Name:");
                        const relationship = prompt("Label (e.g. 24/7 Helpline):");
                        const phone = prompt("Emergency Contact Number:");
                        if (name && phone && relationship) {
                            API.post("/contacts", { name, phone, relationship }).then(fetchData);
                        }
                    }}
                  >
                    <Plus className="w-12 h-12 mb-4" />
                    <p className="font-black text-xs uppercase tracking-widest text-center leading-loose">Onboard New<br/>Crisis Extension</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "registration" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-sm border border-gray-100 dark:border-slate-800 p-12 max-w-3xl mx-auto overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
              <div className="text-center mb-12 relative">
                <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-[2.5rem] flex items-center justify-center text-blue-600 mx-auto mb-6 shadow-xl shadow-blue-500/10">
                    <UserPlus className="w-12 h-12" />
                </div>
                <h3 className="text-4xl font-black text-gray-900 dark:text-white lowercase tracking-tight">Onboard specialist <span className="text-blue-600">.</span></h3>
                <p className="text-gray-500 dark:text-gray-400 font-bold mt-2">Activate a new clinical portal immediately.</p>
              </div>
              <form
                className="space-y-8 relative"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  const data = Object.fromEntries(formData);
                  try {
                    await API.post("/admin/mentors", data);
                    alert("Specialist portal activated!");
                    e.target.reset();
                    fetchData();
                    setActiveTab("mentors");
                  } catch (err) {
                    alert(err.response?.data?.message || "Onboarding rejected");
                  }
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Full Legal Name</label>
                        <input name="name" required className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-0 rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none text-gray-900 dark:text-white font-bold" placeholder="Dr. Sarah Jenkins" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Primary Specialization</label>
                        <input name="specialization" required className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-0 rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none text-gray-900 dark:text-white font-bold" placeholder="Neuropsychiatry" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Systems Access Email</label>
                    <input name="email" type="email" required className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-0 rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none text-gray-900 dark:text-white font-bold" placeholder="sarah.j@mannmitra.com" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">Temporary Access Token</label>
                    <input name="password" type="password" required className="w-full p-5 bg-gray-50 dark:bg-slate-800 border-0 rounded-[1.5rem] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/50 outline-none text-gray-900 dark:text-white font-bold" placeholder="••••••••" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-black py-6 rounded-[2rem] hover:bg-blue-700 transition shadow-2xl shadow-blue-500/30 uppercase tracking-[0.2em] text-xs">
                   Provision Access
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Student Analytics Modal */}
      <AnimatePresence>
        {selectedStudentId && (
          <StudentDetailModal 
            studentId={selectedStudentId} 
            onClose={() => setSelectedStudentId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminDashboard;
import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Users, Calendar, Video, Clock, ChevronRight } from "lucide-react";

function MentorDashboard() {
    const [students, setStudents] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [stats, setStats] = useState({ totalStudents: 0, upcomingSessions: 0 });
    const [loading, setLoading] = useState(true);

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

    const handleScheduleSession = async (studentId) => {
        const date = prompt("Enter session date & time (YYYY-MM-DD HH:MM):");
        if (!date) return;
        try {
            await API.post("/mentor/schedule", { studentId, date });
            alert("Session scheduled successfully!");
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to schedule session");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading Mentor Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Mentor Dashboard</h1>
                    <p className="text-gray-600">Guidance & Support Management</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-blue-100 p-4 rounded-2xl flex items-center gap-3">
                        <Users className="text-blue-600" />
                        <div>
                            <p className="text-xs text-blue-600 font-medium">My Students</p>
                            <p className="text-xl font-bold">{stats.totalStudents}</p>
                        </div>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-2xl flex items-center gap-3">
                        <Calendar className="text-purple-600" />
                        <div>
                            <p className="text-xs text-purple-600 font-medium">Upcoming Sessions</p>
                            <p className="text-xl font-bold">{stats.upcomingSessions}</p>
                        </div>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Assigned Students */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" /> Assigned Students
                    </h2>
                    <div className="space-y-4">
                        {students.length > 0 ? students.map(s => (
                            <div key={s._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl group hover:bg-blue-50 transition-colors">
                                <div>
                                    <p className="font-bold text-gray-800">{s.name}</p>
                                    <p className="text-xs text-gray-500">{s.email}</p>
                                </div>
                                <button
                                    onClick={() => handleScheduleSession(s._id)}
                                    className="bg-white text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-600 hover:text-white transition"
                                >
                                    Schedule
                                </button>
                            </div>
                        )) : <p className="text-gray-400 italic">No students assigned yet.</p>}
                    </div>
                </div>

                {/* Sessions List */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Video className="w-5 h-5 text-purple-500" /> Upcoming Sessions
                    </h2>
                    <div className="space-y-4">
                        {sessions.length > 0 ? sessions.map(sess => (
                            <div key={sess._id} className="p-4 bg-gray-50 rounded-2xl border-l-4 border-purple-400">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded">
                                        {sess.status.toUpperCase()}
                                    </span>
                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                        <Clock className="w-3 h-3" />
                                        {new Date(sess.scheduledAt).toLocaleString()}
                                    </div>
                                </div>
                                <p className="font-bold text-gray-800">{sess.student?.name}</p>
                                <div className="mt-3 flex gap-2">
                                    <a
                                        href={`/student/session?room=${sess.meetingRoomId}`}
                                        className="flex-1 bg-purple-600 text-white text-center py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition"
                                    >
                                        Join Room
                                    </a>
                                </div>
                            </div>
                        )) : <p className="text-gray-400 italic">No sessions scheduled.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MentorDashboard;
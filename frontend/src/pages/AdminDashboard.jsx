import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [stats, setStats] = useState({ totalStudents: 0, totalMentors: 0, pendingAssessments: 0 });
  const [allotments, setAllotments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [trustedContacts, setTrustedContacts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, m, st, al] = await Promise.all([
          API.get("/admin/users"), // Adjusted to match backend route /admin/users
          API.get("/admin/mentors"),
          API.get("/admin/stats"),
          API.get("/admin/allotments"),
        ]);
        setStudents(s.data.filter(u => u.role === "student"));
        setMentors(m.data);
        setStats(st.data);
        setAllotments(al.data);
      } catch (err) {
        console.error("Admin fetch failed", err);
      }
    };
    fetchData();
  }, []);

  const handleAssignMentor = async (studentId) => {
    const mentorId = prompt("Enter Mentor ID to assign:");
    if (!mentorId) return;
    try {
      await API.put(`/admin/students/${studentId}/assign-mentor`, { mentorId });
      alert("Mentor assigned!");
      window.location.reload();
    } catch (err) {
      alert("Assignment failed");
    }
  };

  const handleScheduleAppointment = async (studentId, mentorId) => {
    if (!mentorId) return alert("Assign a mentor first!");
    const date = prompt("Enter Appointment Date (YYYY-MM-DD HH:MM):", new Date().toISOString().slice(0, 16).replace("T", " "));
    if (!date) return;
    try {
      await API.post(`/admin/students/${studentId}/appointments`, { mentorId, date });
      alert("Appointment & Video Session Scheduled!");
      window.location.reload();
    } catch (err) {
      alert("Scheduling failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
          <h2 className="text-3xl font-bold text-blue-700 font-serif">Admin Dashboard</h2>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold">
          System Overview
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-50">
          <p className="text-sm text-gray-500 font-medium">Total Students</p>
          <h4 className="text-4xl font-extrabold text-green-600">{stats.totalStudents}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-blue-50">
          <p className="text-sm text-gray-500 font-medium">Total Mentors</p>
          <h4 className="text-4xl font-extrabold text-blue-600">{stats.totalMentors}</h4>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-purple-50">
          <p className="text-sm text-gray-500 font-medium">Pending Assessments</p>
          <h4 className="text-4xl font-extrabold text-purple-600">{stats.pendingAssessments}</h4>
        </div>
      </div>

      {/* Students Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-600 mb-4 font-serif">Students Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-green-50/50 text-left text-gray-600">
                <th className="p-4 border-b">Name</th>
                <th className="p-4 border-b">Email</th>
                <th className="p-4 border-b">Performance</th>
                <th className="p-4 border-b">Mentor</th>
                <th className="p-4 border-b text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 border-b font-medium">{s.name}</td>
                  <td className="p-4 border-b text-gray-500">{s.email}</td>
                  <td className="p-4 border-b">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${s.latestScore > 15 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      Score: {s.latestScore || "0"}
                    </span>
                  </td>
                  <td className="p-4 border-b italic text-gray-400">
                    {s.mentor ? "Allotted" : "Pending"}
                  </td>
                  <td className="p-4 border-b text-center space-x-3">
                    <Link
                      to={`/admin/student/${s._id}`}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Analyze
                    </Link>
                    <button
                      onClick={() => handleAssignMentor(s._id)}
                      className="bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-xl hover:bg-purple-200 transition"
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => handleScheduleAppointment(s._id, s.mentor)}
                      className="bg-blue-600 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-blue-700 shadow-sm transition"
                    >
                      Schedule Session
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trusted Contacts Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">
          Trusted Contacts (Admin-managed)
        </h3>
        <ul className="space-y-2">
          {trustedContacts.map((c, i) => (
            <li key={i} className="p-3 border rounded-md flex justify-between">
              <span>{c.name} ({c.role}) - {c.phone}</span>
              <button className="text-red-600">Remove</button>
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-green-600 text-white px-3 py-1 rounded">
          + Add Contact
        </button>
      </div>

      {/* Allotment Logs */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Allotment Logs (Automatic Pairings)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 italic text-gray-400 text-sm">
                <th className="pb-4 font-medium">Student Name</th>
                <th className="pb-4 font-medium">Assigned Mentor</th>
                <th className="pb-4 font-medium">Specialization</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allotments.map((al, idx) => (
                <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 text-gray-700 font-medium">{al.name}</td>
                  <td className="py-4 text-blue-600">{al.mentor?.name}</td>
                  <td className="py-4 text-gray-500 text-sm">{al.mentor?.specialization}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {allotments.length === 0 && (
            <p className="text-center py-10 text-gray-400 italic">No pairings recorded yet.</p>
          )}
        </div>
      </div>

      {/* Appointments Section */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Appointments</h3>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Mentor</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="p-2 border">{a.studentName}</td>
                <td className="p-2 border">{a.mentorName}</td>
                <td className="p-2 border">{new Date(a.date).toLocaleString()}</td>
                <td className="p-2 border">{a.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
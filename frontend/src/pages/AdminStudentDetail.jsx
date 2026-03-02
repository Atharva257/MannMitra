import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function AdminStudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [showMentorModal, setShowMentorModal] = useState(false);
  const [showApptModal, setShowApptModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState("");
  const [apptDate, setApptDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, a, ap, c, m] = await Promise.all([
          API.get(`/admin/students/${id}`),
          API.get(`/admin/students/${id}/assessments`),
          API.get(`/admin/students/${id}/appointments`),
          API.get(`/admin/students/${id}/trusted-contacts`),
          API.get("/admin/mentors"),
        ]);
        setStudent(s.data);
        setAssessments(a.data);
        setAppointments(ap.data);
        setContacts(c.data);
        setMentors(m.data);
      } catch (err) {
        console.error("Student detail fetch failed", err);
      }
    };
    fetchData();
  }, [id]);

  const handleAssignMentor = async () => {
    try {
      await API.put(`/admin/students/${id}/assign-mentor`, {
        mentorId: selectedMentor,
      });
      setShowMentorModal(false);
      window.location.reload(); // refresh
    } catch (err) {
      console.error("Mentor assignment failed", err);
    }
  };

  const handleScheduleAppt = async () => {
    try {
      await API.post(`/admin/students/${id}/appointments`, {
        mentorId: selectedMentor,
        date: apptDate,
      });
      setShowApptModal(false);
      window.location.reload();
    } catch (err) {
      console.error("Schedule appointment failed", err);
    }
  };

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
        <h2 className="text-3xl font-bold text-blue-700">
          Student Detail – {student.name}
        </h2>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-green-600 mb-4">Profile</h3>
        <p><strong>Email:</strong> {student.email}</p>
        <p><strong>Role:</strong> {student.role}</p>
        <p><strong>Mentor:</strong> {student.mentorName || "Not Assigned"}</p>
        <button
          className="mt-3 bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => setShowMentorModal(true)}
        >
          Assign Mentor
        </button>
      </div>

      {/* Performance */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-600 mb-4">Performance</h3>
        {assessments.length === 0 ? (
          <p>No assessments yet.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-blue-50">
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Severity</th>
              </tr>
            </thead>
            <tbody>
              {assessments.map((a, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">
                    {new Date(a.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{a.score}</td>
                  <td className="p-2 border">{a.severity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Appointments */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-purple-600 mb-4">Appointments</h3>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-purple-50">
                <th className="p-2 border">Mentor</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((ap, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-2 border">{ap.mentorName}</td>
                  <td className="p-2 border">{new Date(ap.date).toLocaleString()}</td>
                  <td className="p-2 border">{ap.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button
          className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setShowApptModal(true)}
        >
          + Schedule Appointment
        </button>
      </div>

      {/* Trusted Contacts */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-4">
          Student’s Trusted Contacts
        </h3>
        {contacts.length === 0 ? (
          <p>No contacts.</p>
        ) : (
          <ul className="space-y-2">
            {contacts.map((c, i) => (
              <li key={i} className="p-3 border rounded-lg">
                {c.name} – {c.relationship} ({c.phone})
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mentor Modal */}
      {showMentorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Assign Mentor</h3>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Mentor</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowMentorModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignMentor}
                className="px-4 py-2 bg-purple-600 text-white rounded"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {showApptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">Schedule Appointment</h3>
            <select
              value={selectedMentor}
              onChange={(e) => setSelectedMentor(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            >
              <option value="">Select Mentor</option>
              {mentors.map((m) => (
                <option key={m._id} value={m._id}>{m.name}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              value={apptDate}
              onChange={(e) => setApptDate(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowApptModal(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleAppt}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminStudentDetail;

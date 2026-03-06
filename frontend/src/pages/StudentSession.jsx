import { useEffect, useState } from "react";
import VideoChat from "../components/VideoChat";
import API from "../services/api";

function StudentSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data } = await API.get("/sessions/active");
        setSession(data);
      } catch (err) {
        console.error("No active session", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, []);

  if (loading) return <div className="p-20 text-center text-gray-400">Loading session...</div>;
  if (!session) return <div className="p-20 text-center text-red-500 italic">No scheduled session found today.</div>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Student Video Session</h1>
      <VideoChat roomId={session.meetingRoomId} userName="Student" />
    </div>
  );
}

export default StudentSession;
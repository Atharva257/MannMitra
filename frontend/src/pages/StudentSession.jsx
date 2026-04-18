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
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl text-center">
        {session.meetingLink ? (
          <>
            <p className="text-lg text-gray-700 mb-6 font-medium">
              Your session is scheduled via Google Meet.
            </p>
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition duration-300 shadow-lg"
            >
              Join Google Meet
            </a>
          </>
        ) : (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl text-orange-800">
            <p className="font-bold mb-2">Meeting Link Not Available</p>
            <p className="text-sm">
              The video meeting link hasn't been generated properly for this session. 
              Please contact your administrator or mentor to get the link.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentSession;
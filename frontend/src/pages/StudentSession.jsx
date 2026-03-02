import VideoChat from "../components/VideoChat";

function StudentSession() {
  const roomId = "mannmitra-room"; // should match mentor’s room
  const userName = "Student";

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Student Video Session</h1>
      <VideoChat roomId={roomId} userName={userName} />
    </div>
  );
}

export default StudentSession;
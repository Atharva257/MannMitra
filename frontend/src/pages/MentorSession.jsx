import VideoChat from "../components/VideoChat";

function MentorSession() {
  const roomId = "mannmitra-room"; // can be dynamic (studentId)
  const userName = "Mentor";

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-purple-50">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Mentor Video Session</h1>
      <VideoChat roomId={roomId} userName={userName} />
    </div>
  );
}

export default MentorSession;
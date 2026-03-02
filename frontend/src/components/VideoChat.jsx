import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function VideoChat({ roomId, userName }) {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.emit("join-room", roomId, userName);
    setJoined(true);

    socket.on("user-joined", () => {
      createOffer();
    });

    socket.on("offer", async (offer) => {
      if (!peerConnection.current) createPeerConnection();
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      socket.emit("answer", { roomId, answer });
    });

    socket.on("answer", async (answer) => {
      await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
    });

    socket.on("candidate", async (candidate) => {
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    });

    return () => socket.disconnect();
  }, []);

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" }
      ]
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("candidate", { roomId, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current = pc;
  };

  const createOffer = async () => {
    createPeerConnection();

    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStream.getTracks().forEach((track) => peerConnection.current.addTrack(track, localStream));
    localVideoRef.current.srcObject = localStream;

    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.emit("offer", { roomId, offer });
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <h2 className="text-2xl font-semibold text-blue-700">Session Room: {roomId}</h2>
      {!joined ? (
        <p>Joining session...</p>
      ) : (
        <>
          <div className="flex gap-4">
            <video ref={localVideoRef} autoPlay playsInline muted className="w-72 rounded-lg shadow-md" />
            <video ref={remoteVideoRef} autoPlay playsInline className="w-72 rounded-lg shadow-md" />
          </div>
        </>
      )}
    </div>
  );
}

export default VideoChat;
import { useState } from "react";
import { sendMessage } from "../services/chatService";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await sendMessage(input);
      setMessages([...newMessages, { sender: "bot", text: res.reply }]);
    } catch {
      setMessages([...newMessages, { sender: "bot", text: "Sorry, something went wrong. 🌸" }]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <img src="public/MannMitra.png" alt="Logo" className="w-8 h-8" />
        <h2 className="text-2xl font-bold text-purple-700">Chat with MannMitra</h2>
      </div>

      {/* Chat Window */}
      <div className="bg-white shadow-lg rounded-2xl p-4 h-[400px] overflow-y-auto flex flex-col gap-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg max-w-xs ${
              m.sender === "user"
                ? "bg-blue-100 text-blue-900 self-end rounded-br-none"
                : "bg-green-100 text-green-900 self-start rounded-bl-none"
            }`}
          >
            {m.text}
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-gray-500 text-center mt-10">
            Start a conversation 🌱
          </p>
        )}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border p-3 rounded-lg focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default Chatbot;

import { useState, useEffect, useRef } from "react";
import { sendMessage } from "../services/chatService";
import API from "../services/api";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Wind,
  Brain,
  AlertTriangle,
  Loader2,
  Trash2
} from "lucide-react";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userContext, setUserContext] = useState(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Fetch user profile/assessment for context
    const fetchContext = async () => {
      try {
        const { data } = await API.get("/users/profile");
        const assessmentRes = await API.get("/assessments");
        const latest = assessmentRes.data[0];
        setUserContext({
          name: data.name,
          score: latest?.score,
          severity: latest?.severity
        });

        // Initial bot greeting
        setMessages([{
          sender: "bot",
          text: `Hello ${data.name}! I'm MannMitra, your wellness companion. I'm here to listen and support you. How are you feeling today? 🌿`,
          timestamp: new Date()
        }]);
      } catch (err) {
        console.error("Failed to load context", err);
      }
    };
    fetchContext();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e, directText = null) => {
    if (e) e.preventDefault();
    const textToSend = directText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage = { sender: "user", text: textToSend, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = updatedMessages.slice(-6, -1).map(m => ({ sender: m.sender, text: m.text }));
      const res = await sendMessage(textToSend, chatHistory);
      API.put("/users/log-activity").catch(e => console.error(e));
      const botMessage = { sender: "bot", text: res.reply, timestamp: new Date() };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: "bot",
        text: "I'm having a little trouble connecting to my thoughts. Could you repeat that? 🌸",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    if (window.confirm("Clear our conversation?")) {
      setMessages([messages[0]]);
    }
  };

  const quickActions = [
    { label: "Breathing Exercise", icon: <Wind size={16} />, text: "Can you guide me through a quick breathing exercise?" },
    { label: "Reframe Thought", icon: <Brain size={16} />, text: "I'm having a negative thought I want to challenge." },
    { label: "Daily Affirmation", icon: <Sparkles size={16} />, text: "Give me a positive affirmation for today." },
    { label: "Crisis Help", icon: <AlertTriangle size={16} />, text: "I need immediate support, I'm feeling very overwhelmed." },
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      {/* Header Card */}
      <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl p-6 mb-6 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-tight">MannMitra AI</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Always Online</span>
            </div>
          </div>
        </div>

        {userContext && (
          <div className="hidden md:block text-right">
            <p className="text-xs font-bold text-purple-600 uppercase tracking-tighter">Mood Context</p>
            <p className="text-sm font-medium text-gray-600">
              {userContext.severity || "No assessment"}
              {userContext.score !== undefined && ` (${userContext.score})`}
            </p>
          </div>
        )}

        <button
          onClick={clearChat}
          className="p-3 text-gray-400 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
          title="Clear Conversation"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Chat Window Container */}
      <div className="flex-1 overflow-hidden flex flex-col bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-xl relative">

        {/* Messages Layout */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div className={`flex gap-3 max-w-[80%] ${m.sender === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                  ${m.sender === "user" ? "bg-blue-600 text-white" : "bg-white text-purple-600 border border-purple-50"}`}
                >
                  {m.sender === "user" ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className={`p-5 rounded-3xl text-[15px] leading-relaxed shadow-sm
                  ${m.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100"
                    : "bg-white text-gray-800 rounded-tl-none border border-gray-50"}`}
                >
                  {m.text}
                  <div className={`text-[10px] mt-2 opacity-50 ${m.sender === "user" ? "text-right" : "text-left"}`}>
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-in fade-in duration-300">
              <div className="flex gap-3 items-center ml-14 p-4 bg-white/50 rounded-2xl border border-gray-100 italic text-sm text-gray-400">
                <Loader2 className="animate-spin text-purple-400" size={16} /> MannMitra is thinking...
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions Bar */}
        <div className="px-8 py-4 flex gap-3 overflow-x-auto no-scrollbar border-t border-white/20 bg-white/10">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => handleSend(null, action.text)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm rounded-2xl text-xs font-bold text-gray-700 hover:bg-purple-600 hover:text-white transition-all shadow-sm border border-white shrink-0 active:scale-95"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-8 pt-0">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-xl shadow-purple-900/5"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="How can I support you right now?"
              className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-700 placeholder:text-gray-300 font-medium"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 disabled:opacity-50 disabled:shadow-none active:scale-95"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
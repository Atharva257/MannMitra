import React, { useState, useEffect } from "react";
import API from "../services/api";
import { MessageSquare, Heart, Send, User, ShieldAlert, Filter, Plus, X } from "lucide-react";
import CrisisModal from "./CrisisModal";

export default function Forum() {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [showNewPost, setShowNewPost] = useState(false);
  
  // New Post Form
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General", isAnonymous: false });
  const [commentText, setCommentText] = useState({});
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const userId = JSON.parse(localStorage.getItem("user"))?._id;

  const categories = ["All", "General", "Anxiety", "Depression", "Academic Stress", "Success Story"];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/forum?category=${category}`);
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [category]);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/forum", newPost);
      setPosts([data, ...posts]);
      setNewPost({ title: "", content: "", category: "General", isAnonymous: false });
      setShowNewPost(false);
    } catch (err) {
      if (err.response?.data?.crisisDetected) {
        setShowCrisisModal(true);
        setShowNewPost(false);
      } else {
        alert("Failed to create post. Please try again.");
      }
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const { data } = await API.put(`/forum/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? { ...p, likes: data.likes } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText[postId]?.trim()) return;
    try {
      const { data } = await API.post(`/forum/${postId}/comment`, { 
        content: commentText[postId], 
        isAnonymous: false // Default to known for comments for now 
      });
      setPosts(posts.map(p => p._id === postId ? { ...p, comments: [...p.comments, data] } : p));
      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      if (err.response?.data?.crisisDetected) {
        setShowCrisisModal(true);
      } else {
        console.error(err);
      }
    }
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8 px-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-blue-800 dark:text-blue-100 italic">Peer Support Forum</h1>
          <p className="text-gray-500 dark:text-gray-400">Share your journey, support others, stay anonymous.</p>
        </div>
        {isLoggedIn ? (
          <button 
            onClick={() => setShowNewPost(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
          >
            <Plus size={20} /> Create Post
          </button>
        ) : (
          <a
            href="/login"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
          >
            <User size={20} /> Login to Post
          </a>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 rounded-full whitespace-nowrap font-bold transition ${
              category === cat 
                ? "bg-blue-600 text-white shadow-md" 
                : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-slate-700 hover:bg-blue-50 dark:hover:bg-slate-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* New Post Modal/Overlay */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowNewPost(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">Start a Discussion</h2>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input 
                type="text" 
                placeholder="Topic Title"
                className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 ring-blue-500 dark:text-white"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                required
              />
              <select 
                className="w-full p-4 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 ring-blue-500 dark:text-white"
                value={newPost.category}
                onChange={(e) => setNewPost({...newPost, category: e.target.value})}
              >
                {categories.slice(1).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea 
                placeholder="What's on your mind?"
                className="w-full p-4 h-32 bg-gray-50 dark:bg-slate-900 border-none rounded-2xl focus:ring-2 ring-blue-500 dark:text-white resize-none"
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                required
              />
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                  checked={newPost.isAnonymous}
                  onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Post Anonymously</span>
                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold ml-auto opacity-0 group-hover:opacity-100 transition">Privacy Protected</span>
              </label>
              <button 
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition active:scale-[0.98]"
              >
                Post to Forum
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-6 pb-20">
        {loading ? (
          <div className="text-center py-20 space-y-4">
             <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
             <p className="text-gray-500 font-bold">Waking up the community...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-400 italic">No discussions found in this category. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-sm border border-gray-50 dark:border-slate-700 hover:shadow-md transition">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${post.isAnonymous ? 'bg-slate-400' : 'bg-gradient-to-br from-blue-500 to-indigo-600'}`}>
                    {post.isAnonymous ? <ShieldAlert size={24} /> : (post.author?.name?.[0] ?? <User size={20} />)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-800 dark:text-gray-100">{post.author?.name ?? "Deleted User"}</h3>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest leading-none">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {post.category}
                </span>
              </div>

              {/* Post Content */}
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{post.content}</p>

              {/* Footer Actions */}
              <div className="flex items-center gap-6 border-t dark:border-slate-700 pt-6">
                <button 
                  onClick={() => handleToggleLike(post._id)}
                  className={`flex items-center gap-2 font-bold transition ${post.likes?.includes(userId) ? "text-pink-500" : "text-gray-400 hover:text-pink-400"}`}
                >
                  <Heart size={20} fill={post.likes?.includes(userId) ? "currentColor" : "none"} />
                  {post.likes?.length || 0}
                </button>
                <div className="flex items-center gap-2 text-gray-400 font-bold">
                  <MessageSquare size={20} />
                  {post.comments?.length || 0}
                </div>
              </div>

              {/* Comments Section */}
              <div className="mt-6 space-y-4">
                {post.comments?.map((comment, i) => (
                  <div key={i} className="flex gap-3 bg-gray-50 dark:bg-slate-900/50 p-4 rounded-2xl">
                    <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                      {comment.author?.name?.[0] ?? "?"}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-200 mb-1">{comment.author?.name ?? "Deleted User"}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{comment.content}</p>
                    </div>
                  </div>
                ))}
                
                {/* Add Comment Input — only shown if logged in */}
                {isLoggedIn && (
                  <div className="flex gap-2 mt-4">
                    <input 
                      type="text" 
                      placeholder="Add a kind comment..."
                      className="flex-1 bg-gray-100 dark:bg-slate-900 border-none rounded-xl p-3 text-sm focus:ring-1 ring-blue-500 dark:text-white"
                      value={commentText[post._id] || ""}
                      onChange={(e) => setCommentText({...commentText, [post._id]: e.target.value})}
                    />
                    <button 
                      onClick={() => handleAddComment(post._id)}
                      className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-100 dark:shadow-none"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {showCrisisModal && <CrisisModal onClose={() => setShowCrisisModal(false)} />}
    </div>
  );
}
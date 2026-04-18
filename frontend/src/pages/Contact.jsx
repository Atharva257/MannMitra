import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Sparkles, MessageSquare, CheckCircle } from "lucide-react";

function Contact() {
    const [status, setStatus] = useState("idle"); // idle, sending, success
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("sending");
        
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/support/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus("success");
                setFormData({ name: "", email: "", subject: "", message: "" });
                setTimeout(() => setStatus("idle"), 5000);
            } else {
                const data = await response.json();
                alert(data.message || "Failed to send message. Please try again.");
                setStatus("idle");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("Connection error. Please check your internet and try again.");
            setStatus("idle");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/4 -right-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-[100px]"></div>

            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                        <Sparkles size={16} />
                        <span>Get In Touch</span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">Let’s Start a Conversation</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed text-lg">
                        Have a question about our services or need support? Our team is here to listen 
                        and provide the help you need.
                    </p>
                </div>

                <div className="grid lg:grid-cols-5 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                             <img 
                                src="/contact_us_illustration.png" 
                                alt="Contact Illustration" 
                                className="w-full h-auto"
                            />
                        </div>

                        <div className="space-y-6">
                            <ContactItem 
                                icon={<Mail className="text-emerald-500" />}
                                label="Support Email"
                                content="mannmitra.noreply@gmail.com"
                            />
                            <ContactItem 
                                icon={<Phone className="text-indigo-500" />}
                                label="Emergency Support"
                                content="+91 98765 43210"
                            />
                            <ContactItem 
                                icon={<MapPin className="text-rose-500" />}
                                label="Headquarters"
                                content="Nagpur, Maharashtra, India"
                            />
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-3 glass-card rounded-[3rem] p-8 lg:p-12">
                        {status === "success" ? (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Message Sent!</h2>
                                <p className="text-slate-500 dark:text-slate-400">Thank you for reaching out. We'll get back to you within 24 hours.</p>
                                <button 
                                    onClick={() => setStatus("idle")}
                                    className="text-indigo-600 font-bold hover:underline"
                                >
                                    Send another message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <FormInput 
                                        label="Full Name"
                                        placeholder="John Carter"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                    <FormInput 
                                        label="Email Address"
                                        placeholder="john@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                                <FormInput 
                                    label="Subject"
                                    placeholder="How can we help?"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    required
                                />
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message</label>
                                    <textarea 
                                        rows="5"
                                        placeholder="Tell us more about what's on your mind..."
                                        className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all outline-none resize-none shadow-sm dark:shadow-none"
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        required
                                    ></textarea>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={status === "sending"}
                                    className="w-full btn-premium bg-indigo-600 text-white flex items-center justify-center gap-3 disabled:opacity-50 disabled:scale-100"
                                >
                                    {status === "sending" ? "Sending..." : "Send Message"}
                                    <Send size={20} className={status === "sending" ? "animate-pulse" : ""} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const ContactItem = ({ icon, label, content }) => (
    <div className="flex items-center gap-6 p-6 glass-card rounded-[2rem] hover:shadow-lg transition-all duration-300">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            {icon}
        </div>
        <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-black mb-1">{label}</p>
            <p className="text-slate-800 dark:text-slate-200 font-bold">{content}</p>
        </div>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
        <input 
            className="w-full p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 transition-all outline-none shadow-sm dark:shadow-none"
            {...props}
        />
    </div>
);

export default Contact;
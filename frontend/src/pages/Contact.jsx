import { Mail, Phone, MapPin, Send } from "lucide-react";

function Contact() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-20 px-6">
            <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 bg-white rounded-[3rem] p-12 shadow-2xl overflow-hidden relative">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-green-50 rounded-full blur-3xl opacity-50"></div>

                <div className="space-y-8 relative z-10">
                    <div>
                        <h1 className="text-4xl font-extrabold text-green-800">Reach Out 🌿</h1>
                        <p className="text-gray-500 mt-4">We are always here to listen and help. Your feedback and questions are vital to us.</p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 group">
                            <div className="p-4 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Mail />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Email Us</p>
                                <p className="text-gray-700 font-medium text-lg">support@mannmitra.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-4 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <Phone />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Call Us</p>
                                <p className="text-gray-700 font-medium text-lg">+91 98765 43210</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 group">
                            <div className="p-4 bg-green-50 rounded-2xl text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <MapPin />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Visit Us</p>
                                <p className="text-gray-700 font-medium text-lg">Nagpur, Maharashtra, India</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form className="space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                        <input placeholder="Your Name" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-green-100 transition shadow-inner" />
                        <input placeholder="Your Email" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-green-100 transition shadow-inner" />
                    </div>
                    <input placeholder="Subject" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-green-100 transition shadow-inner" />
                    <textarea rows="4" placeholder="How can we help?" className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-4 focus:ring-green-100 transition shadow-inner resize-none"></textarea>
                    <button className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition shadow-xl shadow-green-100">
                        Send Message <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Contact;

import React from "react";
import { Shield, Eye, Lock, FileText, ChevronRight, ArrowLeft, Scale, Bell } from "lucide-react";
import { Link } from "react-router-dom";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-6 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-100 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>

            <div className="max-w-4xl mx-auto space-y-12 relative">
                {/* Header Card */}
                <div className="glass-card rounded-[3rem] p-8 lg:p-12 text-center space-y-6">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto text-indigo-600 dark:text-indigo-400 shadow-sm">
                        <Shield size={40} />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">Privacy Policy</h1>
                    <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
                        Your trust is our most valuable asset. Learn how we protect and manage 
                        your data at MannMitra.
                    </p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 uppercase tracking-widest">
                        <Bell size={14} /> Last Updated: May 2024
                    </div>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    <PolicySection 
                        icon={<Eye className="text-blue-500" />}
                        title="Data Transparency"
                        content="At MannMitra, we only collect data that is strictly necessary to provide our therapeutic and safety services. This includes your mood assessments, AI chat history, and trusted contact details used for emergency alerts."
                    />
                    
                    <PolicySection 
                        icon={<Lock className="text-emerald-500" />}
                        title="Secure Storage"
                        content="Your data is stored using industry-standard AES-256 encryption. We never share your personal therapeutic history with third parties without your explicit consent, except in critical crisis situations where emergency intervention is required by law."
                    />

                    <PolicySection 
                        icon={<Scale className="text-purple-500" />}
                        title="User Rights"
                        content="You have the right to access, export, or delete your data at any time through your account settings. We believe in complete data portability and ownership for every user on our platform."
                    />

                    <PolicySection 
                        icon={<FileText className="text-amber-500" />}
                        title="Cookie Policy"
                        content="We use minimal, essential cookies only to manage your session and ensure the security of your account. We do not use third-party tracking or advertising cookies."
                    />
                </div>

                {/* Footer Action */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-8 glass-card rounded-3xl gap-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-50 dark:bg-slate-800 rounded-2xl text-indigo-600">
                            <Shield size={24} />
                        </div>
                        <p className="text-slate-700 dark:text-slate-200 font-bold">Still have questions?</p>
                    </div>
                    <Link to="/contact" className="btn-premium bg-indigo-600 text-white text-sm">
                        Contact Privacy Team
                    </Link>
                </div>

                <div className="text-center">
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
                    >
                        <ArrowLeft size={18} /> Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

const PolicySection = ({ icon, title, content }) => (
    <div className="glass-card rounded-[2.5rem] p-8 lg:p-10 border-none shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-start gap-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl shrink-0">
                {icon}
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    {title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {content}
                </p>
            </div>
        </div>
    </div>
);

export default PrivacyPolicy;
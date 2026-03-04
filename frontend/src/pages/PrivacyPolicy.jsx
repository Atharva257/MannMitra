import { Shield, Eye, Lock } from "lucide-react";

function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-gray-50 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-white rounded-[3rem] p-12 shadow-sm border border-gray-100 space-y-8">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600">
                            <Shield size={32} />
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-800">Privacy Policy</h1>
                    </div>

                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-6">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Eye className="text-blue-500" size={20} /> Data Transparency
                            </h2>
                            <p>
                                At MannMitra, your privacy is our top priority. We only collect data that is
                                strictly necessary to provide our therapeutic and safety services.
                                This includes your mood assessments, AI chat history, and trusted contact details.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                <Lock className="text-blue-500" size={20} /> Secure Storage
                            </h2>
                            <p>
                                Your data is stored using industry-standard encryption. We never share your
                                personal therapeutic history with third parties without your explicit consent,
                                except in critical crisis situations where emergency intervention is required.
                            </p>
                        </section>

                        <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-800 text-sm">
                            <strong>Last Updated: May 2024.</strong> We periodically update this policy to
                            reflect changes in our platform and legal requirements.
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button
                        onClick={() => window.history.back()}
                        className="text-blue-600 font-bold hover:underline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PrivacyPolicy;

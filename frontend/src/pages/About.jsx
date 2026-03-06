import { Heart, Target, Cloud } from "lucide-react";

function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-extrabold text-blue-800">About MannMitra 🌿</h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                        MannMitra is more than just an app; it's a dedicated companion for your mental wellness journey.
                        Born from the need for accessible, empathetic support, we combine technology with
                        therapeutic best practices like RBT.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100 space-y-4">
                        <Heart className="text-red-500 w-10 h-10" />
                        <h3 className="text-xl font-bold text-gray-800">Our Mission</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            To provide a safe, non-judgmental space where students can understand and master their emotions.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100 space-y-4">
                        <Target className="text-blue-500 w-10 h-10" />
                        <h3 className="text-xl font-bold text-gray-800">Our Goal</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            To bridge the gap between struggling in silence and finding professional, scalable support.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-100 space-y-4">
                        <Cloud className="text-indigo-400 w-10 h-10" />
                        <h3 className="text-xl font-bold text-gray-800">Our Vision</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            A world where mental health tools are as common and accessible as physical health tools.
                        </p>
                    </div>
                </div>

                <div className="bg-blue-600 rounded-[3rem] p-12 text-white text-center space-y-6">
                    <h2 className="text-3xl font-bold text-white">Join the Community</h2>
                    <p className="text-blue-100 text-lg">
                        Whether you are a student seeking support or a mentor willing to help,
                        MannMitra is here for you. We believe in the power of mindfulness and
                        connection to transform lives.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default About;

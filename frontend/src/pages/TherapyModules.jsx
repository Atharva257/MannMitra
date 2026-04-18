import { useState, useEffect } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle, Clock, ArrowRight, Star } from "lucide-react";

function TherapyModules() {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    const interactiveModules = [
        {
            _id: 'breathing-bubble',
            category: 'Stress Relief',
            title: 'Breathing Bubble',
            description: 'Guided box breathing exercise to calm your mind and regulate your nervous system instantly.',
            isInteractive: true
        },
        {
            _id: 'mood-canvas',
            category: 'Creative Expression',
            title: 'Mood Canvas',
            description: 'Draw and express how you feel visually. A relaxing space to let your emotions flow onto the canvas.',
            isInteractive: true
        },
        {
            _id: 'gratitude-journal',
            category: 'Daily Habit',
            title: 'Gratitude Journal',
            description: 'Focus on the positive aspects of your day. Track your daily gratitude streak and build resilience.',
            isInteractive: true
        }
    ];

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const { data } = await API.get("/modules");
                setModules([...interactiveModules, ...data]);
            } catch (err) {
                console.error("Failed to fetch modules", err);
                setModules([...interactiveModules]);
            } finally {
                setLoading(false);
            }
        };
        fetchModules();
    }, []);

    if (loading) return <div className="p-20 text-center text-gray-400 animate-pulse">Loading wellness paths...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-12">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-indigo-800 rounded-[2.5rem] p-12 text-white shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">Therapeutic Modules</h1>
                    <p className="text-blue-100 text-xl leading-relaxed">
                        Structured journeys designed to help you build resilience, manage stress, and master your mind.
                    </p>
                </div>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 h-60 bg-blue-400/20 rounded-full blur-2xl"></div>
            </div>

            {/* Modules Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {modules.map((module) => (
                    <div
                        key={module._id}
                        className="group relative bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 overflow-hidden"
                    >
                        {/* Category Tag */}
                        <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-bold mb-6 tracking-widest uppercase">
                            {module.category}
                        </div>

                        <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
                            {module.title}
                        </h3>
                        <p className="text-gray-500 mb-8 leading-relaxed line-clamp-3">
                            {module.description}
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <BookOpen size={18} className="text-blue-300" />
                                <span>{module.sections?.length || 0} Sections</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Star size={18} className="text-yellow-400" />
                                <span>RBT Tool Included</span>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Link
                                to={`/modules/${module._id}`}
                                className="inline-flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
                            >
                                Start Module <ArrowRight size={20} />
                            </Link>
                        </div>

                        {/* Hover visual effect */}
                        <div className="absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 bg-blue-50 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700 -z-10 opacity-50"></div>
                    </div>
                ))}

                {modules.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-400 italic">New therapeutic modules coming soon! 🌿</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TherapyModules;
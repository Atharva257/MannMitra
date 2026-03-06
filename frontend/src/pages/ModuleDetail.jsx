import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { ArrowLeft, ArrowRight, CheckCircle, Gamepad2 } from "lucide-react";

function ModuleDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentSectionIdx, setCurrentSectionIdx] = useState(0);

    useEffect(() => {
        const fetchModule = async () => {
            try {
                const { data } = await API.get(`/modules/${id}`);
                setData(data);
            } catch (err) {
                console.error("Failed to load module", err);
            } finally {
                setLoading(false);
            }
        };
        fetchModule();
    }, [id]);

    const handleNext = async () => {
        const currentSection = data.module.sections[currentSectionIdx];
        try {
            await API.post(`/modules/${id}/progress`, { sectionOrder: currentSection.order });

            if (currentSectionIdx < data.module.sections.length - 1) {
                setCurrentSectionIdx(currentSectionIdx + 1);
                window.scrollTo(0, 0);
            } else {
                // Module finished!
                if (data.module.gameType === "ABCDE") {
                    navigate("/rbt-abcde");
                } else if (data.module.gameType === "ThoughtChallenger") {
                    navigate("/rbt-game");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (err) {
            console.error("Failed to save progress", err);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400">Loading module...</div>;
    if (!data) return <div className="p-20 text-center text-red-500">Module not found.</div>;

    const section = data.module.sections[currentSectionIdx];

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-8">
            <button
                onClick={() => navigate("/therapy-modules")}
                className="flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft size={20} /> Back to Modules
            </button>

            <div className="space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-800">{data.module.title}</h1>
                <div className="flex items-center gap-2">
                    {data.module.sections.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${i <= currentSectionIdx ? 'bg-blue-600' : 'bg-gray-100'}`}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-blue-700 mb-6">{section.title}</h2>
                <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed text-lg">
                    {section.content.split('\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <div className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                    Step {currentSectionIdx + 1} of {data.module.sections.length}
                </div>
                <button
                    onClick={handleNext}
                    className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg transition-all transform active:scale-95"
                >
                    {currentSectionIdx === data.module.sections.length - 1 ? (
                        <>Finish & Start Game <Gamepad2 size={20} /></>
                    ) : (
                        <>Next Section <ArrowRight size={20} /></>
                    )}
                </button>
            </div>
        </div>
    );
}

export default ModuleDetail;
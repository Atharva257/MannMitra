import { useState } from "react";
import { Brain, ArrowRight, CheckCircle, Info } from "lucide-react";
import API from "../services/api";

function ABCDEGame() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        A: "", // Activating Event
        B: "", // Beliefs
        C: "", // Consequences
        D: "", // Disputation
        E: "", // Effective New Belief
    });

    const nextStep = () => setStep(step + 1);
    const reset = () => {
        setStep(1);
        setData({ A: "", B: "", C: "", D: "", E: "" });
    };

    const stepsInfo = [
        { label: "A - Activating Event", desc: "What happened? (Just the facts)" },
        { label: "B - Beliefs", desc: "What did you tell yourself about what happened?" },
        { label: "C - Consequences", desc: "How did you feel or act as a result of those beliefs?" },
        { label: "D - Disputation", desc: "Challenge your beliefs. Is there evidence they are true? Are they logical?" },
        { label: "E - Effective New Belief", desc: "What is a more accurate, helpful way to see the situation?" },
    ];

    const currentKey = ["A", "B", "C", "D", "E"][step - 1];

    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-[2rem] shadow-2xl border border-purple-50">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
                        <Brain size={32} />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent italic">
                            ABCDE Method Tool
                        </h2>
                        <p className="text-gray-400 text-sm">Master your internal dialogue</p>
                    </div>
                </div>
                <div className="text-purple-600 font-bold text-xl px-4 py-2 bg-purple-50 rounded-xl">
                    Step {step}/5
                </div>
            </div>

            {step <= 5 ? (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <span className="w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full text-sm">
                                {currentKey}
                            </span>
                            {stepsInfo[step - 1].label}
                        </h3>
                        <p className="text-gray-500 text-lg ml-10">
                            {stepsInfo[step - 1].desc}
                        </p>
                    </div>

                    <div className="relative">
                        <textarea
                            value={data[currentKey]}
                            onChange={(e) => setData({ ...data, [currentKey]: e.target.value })}
                            placeholder="Reflect and type here..."
                            className="w-full h-48 p-6 rounded-3xl border-2 border-gray-100 focus:border-purple-400 focus:ring-8 focus:ring-purple-50 outline-none transition-all text-lg leading-relaxed placeholder:text-gray-300"
                        />
                        <div className="absolute bottom-4 right-4 text-gray-300 text-sm italic">
                            Be as honest as possible
                        </div>
                    </div>

                    <button
                        disabled={!data[currentKey]}
                        onClick={() => {
                            nextStep();
                            if (step === 5) {
                                API.put('/users/log-activity', { activityType: 'cbt' })
                                    .then(res => {
                                        if (res.data.newBadges?.length > 0) {
                                            window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: res.data.newBadges }));
                                        }
                                    })
                                    .catch(console.error);
                            }
                        }}
                        className="w-full py-5 bg-purple-600 text-white rounded-[1.5rem] font-bold text-xl shadow-xl hover:bg-purple-700 disabled:opacity-50 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                    >
                        {step === 5 ? "Complete Analysis" : "Continue Journey"} <ArrowRight size={24} />
                    </button>
                </div>
            ) : (
                <div className="text-center space-y-10 animate-in zoom-in-95 duration-700">
                    <div className="inline-block p-8 bg-green-100 text-green-600 rounded-full shadow-inner">
                        <CheckCircle size={84} />
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-4xl font-extrabold text-gray-800">Insight Gained!</h3>
                        <p className="text-gray-600 text-xl max-w-lg mx-auto leading-relaxed">
                            By disputing irrational beliefs and forming an
                            <strong className="text-purple-600"> Effective New Belief</strong>,
                            you've taken back control.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <div className="p-6 bg-red-50 rounded-2xl border border-red-100">
                            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Initial Belief (B)</span>
                            <p className="text-red-700 mt-2 italic">"{data.B}"</p>
                        </div>
                        <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
                            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">New Perspective (E)</span>
                            <p className="text-green-700 mt-2 font-medium">"{data.E}"</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={reset}
                            className="w-full py-5 bg-purple-600 text-white rounded-[1.5rem] font-bold text-xl shadow-xl hover:bg-purple-700 transition-all hover:shadow-2xl"
                        >
                            Start New Analysis
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="text-gray-400 hover:text-purple-600 font-semibold transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Intro Overlay or Guide (Optional) */}
            <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-blue-100 flex gap-4 items-start">
                <Info className="text-blue-500 shrink-0" size={24} />
                <p className="text-sm text-blue-800 leading-relaxed">
                    The ABCDE method is a core tool in Rational Emotive Behavior Therapy (REBT).
                    It helps you understand that your <strong>feelings (C)</strong> are caused not by the
                    <strong> events (A)</strong> themselves, but by your <strong>beliefs (B)</strong> about those events.
                </p>
            </div>
        </div>
    );
}

export default ABCDEGame;
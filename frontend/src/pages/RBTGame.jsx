import { Brain, ArrowRight, CheckCircle } from "lucide-react";
import API from "../services/api";

function RBTGame() {
    const [step, setStep] = useState(1);
    const [thoughts, setThoughts] = useState({
        negative: "",
        rational: "",
    });

    const nextStep = () => setStep(step + 1);
    const reset = () => {
        setStep(1);
        setThoughts({ negative: "", rational: "" });
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-blue-50">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                    <Brain size={32} />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Thought Challenger 🧠
                </h2>
            </div>

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Welcome to the Thought Challenger! A key technique in RBT is identifying
                        <strong> "negative automatic thoughts" </strong> and reframing them logically.
                    </p>
                    <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 italic text-blue-700">
                        "I'm going to fail this exam because I'm not smart enough."
                    </div>
                    <button
                        onClick={nextStep}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                        Start Reframing <ArrowRight size={20} />
                    </button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-semibold text-gray-800">Identify the Negative Thought</h3>
                    <p className="text-gray-500">What is bothering you right now? Write it down exactly as it feels.</p>
                    <textarea
                        value={thoughts.negative}
                        onChange={(e) => setThoughts({ ...thoughts, negative: e.target.value })}
                        placeholder="e.g. I never get anything right..."
                        className="w-full h-32 p-4 rounded-2xl border-2 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
                    />
                    <button
                        disabled={!thoughts.negative}
                        onClick={nextStep}
                        className="w-full py-4 bg-purple-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        Review Logic <ArrowRight size={20} />
                    </button>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                    <h3 className="text-xl font-semibold text-gray-800">The Rational Response</h3>
                    <p className="text-gray-500">Is there actual evidence for this? What's a more balanced way to look at it?</p>
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-2">
                        Original: "{thoughts.negative}"
                    </div>
                    <textarea
                        value={thoughts.rational}
                        onChange={(e) => setThoughts({ ...thoughts, rational: e.target.value })}
                        placeholder="e.g. I've handled many things well before, and even if I fail this specific thing, I can learn."
                        className="w-full h-32 p-4 rounded-2xl border-2 border-gray-100 focus:border-green-400 focus:ring-4 focus:ring-green-50 outline-none transition-all"
                    />
                    <button
                        disabled={!thoughts.rational}
                        onClick={() => {
                            nextStep();
                            API.put('/users/log-activity', { activityType: 'cbt' })
                                .then(res => {
                                    if (res.data.newBadges?.length > 0) {
                                        window.dispatchEvent(new CustomEvent('newBadgesEarned', { detail: res.data.newBadges }));
                                    }
                                })
                                .catch(console.error);
                        }}
                        className="w-full py-4 bg-green-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-green-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                    >
                        Commit to Change <CheckCircle size={20} />
                    </button>
                </div>
            )}

            {step === 4 && (
                <div className="text-center space-y-6 animate-in zoom-in-95 duration-500">
                    <div className="inline-block p-6 bg-green-100 text-green-600 rounded-full mb-4">
                        <CheckCircle size={64} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Nice work!</h3>
                    <p className="text-gray-600">
                        You've just practiced <strong>Cognitive Reframing</strong>. By challenging negative
                        patterns, you take control of your mood.
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={reset}
                            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-lg hover:bg-blue-700 transition-all"
                        >
                            Do Another Exercise
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="text-gray-500 hover:text-blue-600 font-medium"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RBTGame;

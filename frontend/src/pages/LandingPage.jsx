import { Link } from "react-router-dom";
import { 
  BarChart3, 
  MessageCircle, 
  ShieldAlert, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Heart,
  Sparkles
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mx-auto">
              <Sparkles size={16} />
              <span>Your Personal Mental Wellness Companion</span>
            </div>
            
            <h1 className="text-5xl lg:text-8xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
              Nurture Your Mind with <br />
              <span className="text-gradient">MannMitra</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              MannMitra combines advanced AI with proven therapeutic practices like RBT to help you 
              navigate emotions, master mindfulness, and find support when you need it most.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-4">
              <Link
                to="/register"
                className="btn-premium px-10 py-5 bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center gap-2 text-lg font-bold"
              >
                Start Your Journey <ArrowRight size={20} />
              </Link>
              <Link
                to="/about"
                className="btn-premium px-10 py-5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center justify-center gap-2 text-lg font-bold"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="flex flex-col items-center gap-8 pt-8">
            <div className="flex items-center gap-8">
                <div className="flex -space-x-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                    </div>
                    ))}
                </div>
                <p className="text-sm text-slate-500 font-bold tracking-wide">
                    TRUSTED BY <span className="text-indigo-600">1,000+</span> STUDENTS
                </p>
            </div>

            <div className="inline-flex items-center gap-4 px-6 py-3 glass-card rounded-2xl border-none shadow-sm">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white">
                    <CheckCircle2 size={20} />
                </div>
                <div className="text-left leading-none">
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1">Privacy First</p>
                    <p className="text-slate-800 dark:text-white font-bold">100% Encrypted Sessions</p>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-indigo-600">
              Powerful Tools for Inner Peace
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              Everything you need to manage your mental well-being in one beautiful, safe space.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 className="text-indigo-500" />}
              title="Mood Analytics"
              description="Track your emotional journey with PHQ-9 assessments and visual data reports."
              color="indigo"
            />
            <FeatureCard 
              icon={<MessageCircle className="text-emerald-500" />}
              title="AI Mitra"
              description="An empathetic AI chatbot trained to provide RBT-based support anytime, anywhere."
              color="emerald"
            />
            <FeatureCard 
              icon={<Sparkles className="text-purple-500" />}
              title="Therapy Modules"
              description="Specialized interactive modules designed to help you master specific mental health skills."
              color="indigo"
            />
            <FeatureCard 
              icon={<Heart className="text-pink-500" />}
              title="Gratitude Journal"
              description="Nurture positivity by recording and reflecting on your daily wins and blessings."
              color="rose"
            />
             <FeatureCard 
              icon={<Users className="text-blue-500" />}
              title="Breathing Bubble"
              description="Find instant calm with our guided breathing exercise designed for anxiety relief."
              color="blue"
            />
            <FeatureCard 
              icon={<ShieldAlert className="text-rose-500" />}
              title="Crisis Support"
              description="Instant connection to professional help and emergency resources when critical."
              color="rose"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 pt-20 pb-10 px-6 border-t border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <img src="/MannMitra.png" alt="Logo" className="w-10 h-10" />
              <span className="text-2xl font-bold text-slate-800 dark:text-white">MannMitra</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering students with accessible mental health tools and professional mentorship.
              Your journey to emotional intelligence starts here.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-6">Support</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400">
              <li><Link to="/about" className="hover:text-indigo-600 transition">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-indigo-600 transition">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-800 dark:text-white mb-6">Connection</h4>
            <ul className="space-y-4 text-slate-500 dark:text-slate-400">
              <li><Link to="/forum" className="hover:text-indigo-600 transition">Community Forum</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 transition">Join as Mentor</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 transition">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">© 2024 MannMitra. Built with 💚 for Better Minds.</p>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <Heart size={16} className="text-red-500" /> Made for humanity
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, color }) => {
  const colorMap = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
  };

  return (
    <div className="group p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform group-hover:scale-105 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-4">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div className="space-y-2">
    <p className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white">{value}</p>
    <p className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest font-bold">{label}</p>
  </div>
);

export default LandingPage;
import { Heart, Target, Cloud, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-24 px-6 overflow-hidden relative">
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="max-w-6xl mx-auto space-y-32">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              <Sparkles size={16} />
              <span>Our Story</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-800 dark:text-white leading-tight">
              A Mission for <br />
              <span className="text-gradient">Every Mind.</span>
            </h1>
            <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
              MannMitra was born from a simple belief: mental health support should be a right, 
              not a privilege. We bridge the gap between struggling and thriving by combining 
              tech-driven therapy with genuine human empathy.
            </p>
          </div>
          <div className="flex-1 relative">
            <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-800">
              <img 
                src="/empathy_support_artwork.png" 
                alt="Empathy Artwork" 
                className="w-full h-auto transform scale-105 hover:scale-100 transition-transform duration-700" 
              />
            </div>
            {/* Glass badge */}
            <div className="absolute -bottom-8 -right-8 z-20 glass-card p-8 rounded-3xl animate-float">
               <ShieldCheck size={40} className="text-emerald-500 mb-2" />
               <p className="text-slate-800 dark:text-white font-bold">Trust Built In</p>
               <p className="text-slate-400 text-xs uppercase tracking-tighter">Verified Mentors Only</p>
            </div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <ValueCard 
            icon={<Heart className="w-8 h-8 text-rose-500" />}
            title="Our Mission"
            description="To provide a safe, non-judgmental space where students can understand and master their emotions through RBT."
          />
          <ValueCard 
            icon={<Target className="w-8 h-8 text-indigo-500" />}
            title="Our Goal"
            description="To bridge the gap between struggling in silence and finding professional, scalable support at your fingertips."
          />
          <ValueCard 
            icon={<Cloud className="w-8 h-8 text-cyan-400" />}
            title="Our Vision"
            description="A world where mental health tools are as common and accessible as physical health tools."
          />
        </section>

        {/* Philosophy Section */}
        <section className="bg-indigo-600 rounded-[4rem] p-12 lg:p-24 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-700">
            <Heart size={300} fill="currentColor" />
          </div>
          
          <div className="relative z-10 max-w-3xl space-y-8">
            <h2 className="text-4xl lg:text-5xl font-black">Empowerment through Understanding</h2>
            <p className="text-indigo-100 text-xl leading-relaxed">
              We don't just provide a chat window; we provide a framework. 
              By utilizing Rational Behavior Therapy (RBT), we empower you to challenge 
              unhelpful thoughts and rewire your emotional responses for a resilient life.
            </p>
            <button className="bg-white text-indigo-600 px-10 py-5 rounded-3xl font-bold flex items-center gap-3 hover:bg-slate-50 transition-colors shadow-xl">
              Meet the Community <ArrowRight size={20} />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
    <div className="p-5 bg-slate-50 dark:bg-slate-800 w-fit rounded-2xl mb-8 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-4">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);

export default About;
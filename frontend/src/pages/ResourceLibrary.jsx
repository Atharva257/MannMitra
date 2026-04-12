import React from 'react';
import { BookOpen, Video, Phone, ExternalLink } from 'lucide-react';

export default function ResourceLibrary() {
  const articles = [
    { title: "Understanding Therapy and Psychology", link: "https://www.apa.org/topics/therapy", source: "American Psychological Association" },
    { title: "How to Stop Overthinking", link: "https://www.psychologytoday.com/us/blog/click-here-happiness/201901/how-stop-overthinking", source: "Psychology Today" },
    { title: "The Science of Sleep and Mental Health", link: "https://www.sleepfoundation.org/mental-health", source: "Sleep Foundation" }
  ];

  const videos = [
    { title: "10-Minute Guided Meditation for Anxiety", url: "https://www.youtube.com/embed/O-6f5wQXSu8" },
    { title: "What is Depression? | TED-Ed", url: "https://www.youtube.com/embed/z-IR48Mb3W0" },
    { title: "How to manage your mental health | Leon Taylor", url: "https://www.youtube.com/embed/rkZl2gsLUp4" }
  ];

  const helplines = [
    { name: "Vandrevala Foundation (India)", number: "+91 9999 666 555", desc: "24x7 Mental Health Helpline" },
    { name: "AASRA (India)", number: "9820466726", desc: "Suicide Prevention Helpline" },
    { name: "National Suicide Prevention Lifeline (US)", number: "988", desc: "Available 24/7 in English and Spanish" },
  ];

  return (
    <div className="max-w-5xl mx-auto mt-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-blue-800 dark:text-blue-100 tracking-tight">Resource Library</h1>
        <p className="text-gray-500 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Curated materials to help you understand your mind, self-regulate, and find immediate help when needed.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Articles Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-blue-50 dark:border-slate-700">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-800 dark:text-gray-100">
            <BookOpen className="text-blue-500" /> Essential Reading
          </h2>
          <div className="space-y-4">
            {articles.map((article, i) => (
              <a href={article.link} target="_blank" rel="noreferrer" key={i} className="block p-4 rounded-2xl bg-blue-50/50 dark:bg-slate-700/50 hover:bg-blue-100 dark:hover:bg-slate-700 transition group">
                <h3 className="font-bold text-blue-700 dark:text-blue-300 group-hover:underline flex items-center justify-between">
                  {article.title} <ExternalLink size={16} />
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{article.source}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Helplines Section */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-red-50 dark:border-slate-700">
          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 text-gray-800 dark:text-gray-100">
            <Phone className="text-red-500" /> Immediate Support
          </h2>
          <div className="space-y-4">
            {helplines.map((help, i) => (
              <div key={i} className="p-4 rounded-2xl bg-red-50/50 dark:bg-slate-700/50 border border-red-100 dark:border-slate-600">
                <h3 className="font-bold text-red-700 dark:text-red-400 mb-1">{help.name}</h3>
                <a href={`tel:${help.number}`} className="text-2xl font-black text-gray-800 dark:text-gray-100 hover:text-red-500 transition">{help.number}</a>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{help.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Videos Section */}
      <div className="bg-white dark:bg-slate-800 p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-green-50 dark:border-slate-700">
        <h2 className="text-2xl font-bold flex items-center gap-3 mb-8 text-gray-800 dark:text-gray-100">
          <Video className="text-green-500" /> Helpful Videos
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((video, i) => (
            <div key={i} className="rounded-2xl overflow-hidden shadow-sm bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700">
              <iframe 
                src={video.url} 
                className="w-full h-48"
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
              <div className="p-4">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 text-sm line-clamp-2">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

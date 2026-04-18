import React from "react";
import { Loader2 } from "lucide-react";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
      <div className="relative">
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        
        {/* Main loader */}
        <div className="relative flex flex-col items-center">
          <img src="/MannMitra.png" alt="Logo" className="w-16 h-16 mb-6 animate-bounce" />
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
          <p className="mt-4 text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-[0.3em] animate-pulse">
            Curating Wellness...
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
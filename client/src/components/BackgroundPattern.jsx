import React from 'react';

const BackgroundPattern = () => {
    return (
        <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
            {/* Vibrant Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-100 via-fuchsia-50 to-cyan-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-900 opacity-100 transition-colors duration-500" />

            {/* Floating Blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-purple-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] bg-indigo-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-32 left-20 w-[45rem] h-[45rem] bg-pink-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000" />

            {/* Geometric Floating Elements (SVGs) */}
            <svg className="absolute top-[20%] left-[10%] w-12 h-12 text-violet-500/20 animate-float-slow" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
            </svg>

            <svg className="absolute bottom-[20%] right-[10%] w-16 h-16 text-fuchsia-500/20 animate-float-medium" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 22h20L12 2z" />
            </svg>

            <svg className="absolute top-[40%] right-[20%] w-8 h-8 text-cyan-500/30 animate-float-fast" viewBox="0 0 24 24" fill="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="4" />
            </svg>

            <svg className="absolute bottom-[10%] left-[30%] w-24 h-24 text-indigo-500/10 animate-pulse-slow" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
        </div>
    );
};

export default BackgroundPattern;

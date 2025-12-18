import React from 'react';

const FloatingStickers = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">

            {/* --- STATIC FRAMING ELEMENTS --- */}
            <div className="absolute top-0 right-20 w-32 h-12 bg-yellow-200/60 rotate-[3deg] shadow-sm z-0"></div>
            <div className="absolute bottom-10 -left-5 w-48 h-12 bg-pink-200/50 -rotate-[5deg] shadow-sm z-0"></div>

            {/* --- DYNAMIC SEWING LINES --- */}
            <svg className="absolute inset-0 w-full h-full opacity-20" pointerEvents="none">
                <path d="M-100,50 Q 400,200 800,50 T 1600,100" fill="none" stroke="#6366f1" strokeWidth="2" strokeDasharray="10,10" className="animate-dash-flow" />
                <path d="M-100,800 Q 500,600 1000,900" fill="none" stroke="#ec4899" strokeWidth="2" strokeDasharray="15,15" className="animate-dash-flow-reverse" />
            </svg>

            {/* --- ANIMATED FASHION SKETCHES --- */}

            {/* 1. SCISSORS */}
            <div className="absolute top-24 left-16 opacity-15 rotate-12 animate-float-delayed group">
                <div className="absolute inset-0 bg-yellow-300/30 blur-xl rounded-full scale-150"></div>
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" className="text-indigo-900 relative">
                    <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" /><line x1="8.12" y1="8.12" x2="12" y2="12" />
                    <path d="M22 2 L 24 0" strokeDasharray="2,2" />
                </svg>
            </div>

            {/* 2. SPRAY BOTTLE */}
            <div className="absolute top-1/3 right-12 opacity-15 -rotate-12 animate-bounce-slow">
                <div className="absolute inset-0 bg-blue-300/30 blur-xl rounded-full scale-125"></div>
                <svg width="80" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-blue-900 relative">
                    <path d="M5 10 h14 v12 h-14 z" /><path d="M12 10 v-4" /><path d="M8 6 h8 l-2 -4 h-4 z" />
                    <path d="M18 4 l 4 -2" strokeDasharray="1,1" className="animate-pulse" /><path d="M19 6 l 4 2" strokeDasharray="1,1" className="animate-pulse" />
                </svg>
            </div>

            {/* 3. SAFETY PIN */}
            <div className="absolute top-1/2 left-24 opacity-15 rotate-45 animate-float-random duration-[8000ms]">
                <svg width="60" height="40" viewBox="0 0 50 20" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-700">
                    <path d="M10,10 L40,10 A5,5 0 0,1 40,20 L5,20 A5,5 0 0,1 5,10 L10,10" />
                    <circle cx="40" cy="15" r="2" fill="currentColor" className="opacity-50" />
                </svg>
            </div>

            {/* 4. BUTTONS */}
            <div className="absolute top-20 right-[40%] opacity-20 animate-spin-slow">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-pink-500">
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="9" cy="9" r="1" fill="currentColor" /><circle cx="15" cy="9" r="1" fill="currentColor" />
                    <circle cx="9" cy="15" r="1" fill="currentColor" /><circle cx="15" cy="15" r="1" fill="currentColor" />
                </svg>
            </div>
            <div className="absolute bottom-1/3 left-1/4 opacity-15 animate-spin-reverse duration-[12000ms]">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-500">
                    <circle cx="12" cy="12" r="10" />
                    <rect x="11" y="6" width="2" height="12" rx="1" />
                </svg>
            </div>

            {/* 5. THREAD SPOOL */}
            <div className="absolute top-60 left-8 opacity-15 -rotate-12 animate-bounce-slow">
                <svg width="50" height="60" viewBox="0 0 30 40" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-700">
                    <rect x="5" y="2" width="20" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
                    <rect x="5" y="34" width="20" height="4" rx="2" fill="currentColor" fillOpacity="0.2" />
                    <rect x="8" y="6" width="14" height="28" fill="currentColor" fillOpacity="0.1" />
                    <line x1="8" y1="10" x2="22" y2="10" /><line x1="8" y1="14" x2="22" y2="14" /><line x1="8" y1="18" x2="22" y2="18" />
                    <path d="M22,20 Q 30,25 25,35" strokeWidth="1" />
                </svg>
            </div>

            {/* 6. FABRIC SWATCH */}
            <div className="absolute top-40 right-10 opacity-10 rotate-6">
                <div className="w-16 h-16 bg-slate-200 border-2 border-slate-400 border-dashed transform rotate-3 flex items-center justify-center">
                    <span className="text-[8px] font-mono text-slate-500">COTTON</span>
                </div>
            </div>

            {/* 7. LIGHTBULB */}
            <div className="absolute bottom-1/2 right-[20%] opacity-20 -rotate-12 animate-pulse-slow">
                <svg width="50" height="70" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-yellow-600">
                    <path d="M9 22H15C15.55 22 16 21.55 16 21V20H8V21C8 21.55 8.45 22 9 22Z" />
                    <path d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z" />
                    <path d="M9 5 L8 3 M15 5 L16 3 M12 2 L12 0" strokeDasharray="1,2" className="animate-pulse" />
                </svg>
            </div>

            {/* 8. HANGER & FRAMES */}
            <div className="absolute bottom-1/4 left-10 opacity-10 rotate-6 animate-swing">
                <svg width="120" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-800">
                    <path d="M12 2 C 12 2, 14 0, 14 4 L 14 5 L 2 10 L 22 10 L 12 5" /><line x1="2" y1="10" x2="22" y2="10" />
                </svg>
            </div>
            <div className="absolute top-20 right-1/3 w-32 h-40 border-4 border-white bg-slate-100/50 shadow-sm -rotate-6 opacity-30 animate-float-random">
                <div className="w-full h-24 bg-slate-200/50 mb-2"></div><div className="w-20 h-2 bg-slate-300/50 mx-auto rounded-full"></div>
            </div>

            {/* 9. MEASURING TAPE */}
            <div className="absolute bottom-5 right-0 opacity-10 -rotate-2 w-[400px] h-10 border-t-2 border-dashed border-slate-900 flex items-start overflow-hidden font-mono text-[10px]">
                {[...Array(25)].map((_, i) => (<div key={i} className="flex-1 h-3 border-r border-slate-900 flex justify-center pt-1">{i % 5 === 0 ? i : ''}</div>))}
            </div>

            {/* --- NEW HANGING MEMORY ELEMENTS --- */}

            {/* Hanging Fashion Sketch (Top Right) */}
            <div className="absolute top-0 right-10 lg:right-24 origin-top animate-swing z-0 hidden xl:block">
                <div className="w-0.5 h-40 bg-slate-300/80 mx-auto shadow-sm"></div>
                {/* Clip */}
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-300 absolute top-[9.5rem] left-1/2 -translate-x-1/2 z-10 shadow-md"></div>

                <div className="relative p-3 bg-white shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500 w-48 border border-slate-100 mt-[-10px]">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-8 bg-slate-200/50 rounded-full blur-sm"></div> {/* Tape/Glue mark */}
                    <img src="/fashion_sketch.png" alt="Fashion Sketch" className="w-full h-auto object-cover opacity-90 contrast-110 hover:scale-105 transition-transform duration-700" />
                    <div className="text-right font-hand text-xs text-slate-400 mt-2 pr-2">La Mode '24</div>
                </div>
            </div>

            {/* Pinned Sticky Note (Bottom Left) */}
            <div className="absolute bottom-20 left-10 lg:left-24 z-0 hidden xl:block animate-float-delayed" style={{ animationDelay: '1.5s' }}>
                <div className="w-40 h-40 bg-[#fef08a] shadow-lg rotate-[-6deg] p-4 flex flex-col items-center justify-center transform hover:rotate-0 transition-transform relative border border-yellow-200">
                    <div className="w-3 h-3 rounded-full bg-red-400 shadow-sm absolute -top-1.5 left-1/2 -translate-x-1/2 z-10 border border-red-500"></div>
                    <div className="font-hand text-slate-700 text-center leading-tight">
                        <span className="block text-lg font-bold mb-2">Daily Mantra:</span>
                        "Fashion is what you buy, style is what you do with it."
                    </div>
                    {/* Corner curl */}
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-yellow-400/20 rounded-tl-2xl shadow-inner"></div>
                </div>
            </div>

            {/* --- TEXTURES --- */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#4f46e5 0.5px, transparent 0.5px), linear-gradient(90deg, #4f46e5 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }}></div>
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-multiply bg-orange-50/50 contrast-125">
                <svg className='w-full h-full opacity-50'>
                    <filter id='noise'><feTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch' /></filter>
                    <rect width='100%' height='100%' filter='url(#noise)' />
                </svg>
            </div>

            <style>{`
                @keyframes float-delayed { 0%, 100% { transform: translateY(0) rotate(12deg); } 50% { transform: translateY(-20px) rotate(15deg); } }
                @keyframes swing { 0%, 100% { transform: rotate(6deg); } 50% { transform: rotate(-6deg); } }
                @keyframes dash-flow { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
                @keyframes spin-reverse { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
                .animate-float-delayed { animation: float-delayed 6s ease-in-out infinite; }
                .animate-swing { animation: swing 4s ease-in-out infinite; }
                .animate-dash-flow { animation: dash-flow 20s linear infinite; }
                .animate-spin-reverse { animation: spin-reverse 20s linear infinite; }
            `}</style>
        </div>
    );
};

export default FloatingStickers;

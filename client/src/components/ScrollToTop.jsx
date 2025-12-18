import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => setIsVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-8 left-1/2 -translate-x-1/2 z-40
                transition-all duration-300 ease-in-out
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
            `}
            aria-label="Scroll to top"
        >
            {/* Scrapbook themed button */}
            <div className="relative group">
                {/* Tape effect on top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-4 bg-yellow-200/80 rotate-1 shadow-sm z-10"></div>

                {/* Button body - Paper note style */}
                <div className="bg-white px-4 py-2 rounded-lg shadow-lg border-2 border-dashed border-indigo-200
                    group-hover:bg-indigo-50 group-hover:border-indigo-400 group-hover:-translate-y-1
                    transition-all duration-300 flex items-center gap-2
                ">
                    <ArrowUp className="w-4 h-4 text-indigo-600" />
                    <span className="font-hand text-sm text-indigo-900">Top</span>
                </div>
            </div>
        </button>
    );
};

export default ScrollToTop;

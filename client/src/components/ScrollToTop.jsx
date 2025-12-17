import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button
            onClick={scrollToTop}
            className={`
                fixed bottom-8 right-8 z-50 p-4 rounded-full
                bg-indigo-600 text-white shadow-2xl
                border-4 border-white
                transition-all duration-300 ease-in-out
                hover:bg-indigo-700 hover:scale-110 hover:-rotate-12
                active:scale-95
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
            `}
            aria-label="Scroll to top"
        >
            <ArrowUp className="w-6 h-6" />
            {/* Decorative Ring */}
            <span className="absolute inset-0 rounded-full border-4 border-dashed border-indigo-300 animate-spin-slow opacity-50"></span>
        </button>
    );
};

export default ScrollToTop;

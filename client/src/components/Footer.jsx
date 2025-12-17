import React from 'react';
import { Sparkles, Github, Heart, Scissors, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-24 overflow-hidden">

            {/* Stitching Border Top */}
            <div className="h-4 bg-transparent border-t-4 border-dashed border-indigo-200 relative">
                <div className="absolute top-0 left-20 w-48 h-10 bg-yellow-200/80 -translate-y-1/2 rotate-2 shadow-md z-10"></div>
                <div className="absolute top-0 right-32 w-40 h-10 bg-pink-200/80 -translate-y-1/2 -rotate-3 shadow-md z-10"></div>
            </div>

            {/* Main Footer Body - Paper Texture */}
            <div className="bg-amber-50/80 backdrop-blur-sm py-16 px-4 relative
                before:content-[''] before:absolute before:inset-0 before:opacity-[0.08] 
                before:bg-[url('data:image/svg+xml,%3Csvg width=%2720%27 height=%2720%27 viewBox=%270 0 20 20%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27%236366f1%27 fill-opacity=%270.4%27 fill-rule=%27evenodd%27%3E%3Ccircle cx=%271%27 cy=%271%27 r=%271%27/%3E%3C/g%3E%3C/svg%3E')]">

                <div className="max-w-6xl mx-auto relative z-10">

                    {/* Top Section - Brand & Tagline */}
                    <div className="text-center mb-16 relative">
                        {/* Highlighter Effect */}
                        <div className="inline-block relative">
                            <span className="absolute -inset-2 bg-yellow-300/50 -skew-y-1 rounded-lg z-0"></span>
                            <div className="relative z-10 flex items-center justify-center gap-3">
                                <div className="p-3 bg-white rounded-full border-4 border-dashed border-indigo-300 shadow-lg rotate-6 hover:rotate-0 transition-transform">
                                    <Sparkles className="w-8 h-8 text-indigo-600" />
                                </div>
                                <h2 className="font-hand text-5xl font-black text-indigo-900">StyleGenie</h2>
                            </div>
                        </div>
                        <p className="font-hand text-2xl text-slate-600 mt-6 rotate-1">
                            "Where AI meets your perfect style" ✨
                        </p>
                    </div>

                    {/* Cards Row - Polaroid Style */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">

                        {/* About Card */}
                        <div className="bg-white p-6 shadow-xl rounded-sm transform -rotate-2 hover:rotate-0 transition-all duration-300 border-b-4 border-indigo-200 relative group">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-pink-300/80 rotate-1 shadow-sm z-10"></div>
                            <h4 className="font-hand text-3xl text-indigo-900 mb-4 mt-2">About Us</h4>
                            <p className="text-slate-600 leading-relaxed">
                                StyleGenie is your AI-powered personal stylist. Upload a photo and discover hairstyles perfectly matched to your unique features.
                            </p>
                            {/* Decorative Stamp */}
                            <div className="absolute bottom-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Scissors className="w-12 h-12 text-slate-800 rotate-45" />
                            </div>
                        </div>

                        {/* Quick Links Card */}
                        <div className="bg-white p-6 shadow-xl rounded-sm transform rotate-1 hover:rotate-0 transition-all duration-300 border-b-4 border-yellow-200 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-yellow-300/80 -rotate-1 shadow-sm z-10"></div>
                            <h4 className="font-hand text-3xl text-indigo-900 mb-4 mt-2">Explore</h4>
                            <ul className="space-y-3">
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">→</span>
                                        <span className="font-hand text-xl">Home Dashboard</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">→</span>
                                        <span className="font-hand text-xl">Style Gallery</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-sm group-hover:bg-indigo-600 group-hover:text-white transition-all">→</span>
                                        <span className="font-hand text-xl">How It Works</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Connect Card */}
                        <div className="bg-white p-6 shadow-xl rounded-sm transform -rotate-1 hover:rotate-0 transition-all duration-300 border-b-4 border-pink-200 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-7 bg-indigo-300/80 rotate-2 shadow-sm z-10"></div>
                            <h4 className="font-hand text-3xl text-indigo-900 mb-4 mt-2">Connect</h4>
                            <div className="flex flex-col gap-3">
                                <a
                                    href="https://github.com/jayadeep8712/StyleGenie"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-indigo-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-1"
                                >
                                    <Github className="w-5 h-5" />
                                    Star on GitHub
                                </a>
                                <div className="flex gap-2 mt-2">
                                    <a href="#" className="p-3 bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded-full hover:scale-110 transition-transform shadow-md">
                                        <Instagram className="w-5 h-5" />
                                    </a>
                                    <a href="#" className="p-3 bg-sky-500 text-white rounded-full hover:scale-110 transition-transform shadow-md">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Bar - Handwritten Style */}
                    <div className="border-t-2 border-dashed border-slate-300 pt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="font-hand text-xl text-slate-600 flex items-center gap-2">
                                Crafted with <Heart className="w-5 h-5 text-red-500 fill-red-500 animate-pulse" /> by
                                <span className="font-black text-indigo-600 underline decoration-wavy decoration-yellow-400 underline-offset-4">Jayadeep</span>
                            </p>
                            <p className="text-slate-400 text-sm bg-white/50 px-4 py-2 rounded-full">
                                © {currentYear} StyleGenie Studio • Your AI Makeover Destination
                            </p>
                        </div>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-10 left-10 opacity-5 rotate-12">
                    <svg width="150" height="150" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-indigo-900">
                        <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
                        <line x1="20" y1="4" x2="8.12" y2="15.88" /><line x1="14.47" y1="14.48" x2="20" y2="20" />
                    </svg>
                </div>
                <div className="absolute bottom-10 right-10 opacity-5 -rotate-12">
                    <svg width="120" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-800">
                        <path d="M12 2 C 12 2, 14 0, 14 4 L 14 5 L 2 10 L 22 10 L 12 5" />
                    </svg>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

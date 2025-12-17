import React, { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';

const HairstyleGallery = () => {
    const [hairstyles, setHairstyles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchHairstyles();
    }, []);

    const fetchHairstyles = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/hairstyles');
            const result = await response.json();
            if (result.success) {
                setHairstyles(result.data);
            }
        } catch (error) {
            console.error("Failed to load gallery:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredStyles = hairstyles.filter(style => {
        const matchesSearch = style.name.toLowerCase().includes(search.toLowerCase());
        const gender = style.gender ? style.gender.toLowerCase() : 'unisex';
        const matchesTab =
            filter === 'all' ? true :
                filter === 'male' ? (gender === 'male' || gender === 'unisex') :
                    filter === 'female' ? (gender === 'female' || gender === 'unisex') : true;

        return matchesSearch && matchesTab;
    });

    // Grouping Logic
    const stylesByCategory = filteredStyles.reduce((acc, style) => {
        const category = (style.tags && style.tags.length > 0) ? style.tags[0] : 'Uncategorized';
        const catName = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
        if (!acc[catName]) acc[catName] = [];
        acc[catName].push(style);
        return acc;
    }, {});

    const sortedCategories = Object.keys(stylesByCategory).sort();

    return (
        <div className="w-full max-w-6xl mx-auto p-4 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">

                {/* Search Bar */}
                <div className="relative rotate-1 group z-10 hidden md:block">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 rotate-1 transform skew-x-12 bg-yellow-200/80"></div>
                    <div className="border-2 rounded-full px-6 py-3 flex items-center gap-3 shadow-md focus-within:ring-2 focus-within:ring-indigo-300 transition-all w-72 bg-white border-slate-200">
                        <Search className="w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Find a style..."
                            className="bg-transparent border-none outline-none font-hand text-xl w-full text-slate-700 placeholder:text-slate-400"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-4 p-2 rounded-full border shadow-sm backdrop-blur-sm bg-white/50 border-white">
                    {['all', 'male', 'female'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab)}
                            className={`
                                relative px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all duration-300 border-2
                                ${filter === tab
                                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105 rotate-1'
                                    : 'bg-white/50 border-transparent text-slate-500 hover:bg-white hover:text-indigo-600'
                                }
                            `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-50">
                    <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
                    <p className="font-hand text-2xl animate-pulse text-slate-400">Digging through the archives...</p>
                </div>
            ) : (
                <div className="space-y-16 pb-20">
                    {sortedCategories.map((category) => (
                        <div key={category} className="space-y-6">

                            {/* Category Header */}
                            <div className="flex items-center gap-4">
                                <h3 className="font-hand text-4xl font-bold text-indigo-900">{category}</h3>
                                <div className="h-1 flex-1 rounded-full opacity-50 bg-indigo-100"></div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {stylesByCategory[category].map((style, index) => (
                                    <div key={style.id} className="group relative">

                                        {/* Card Body with Paper Texture */}
                                        <div className="
                                            relative p-3 pb-4 shadow-lg rounded-sm border transition-all duration-300 
                                            hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:z-10
                                            before:content-[''] before:absolute before:inset-0 before:opacity-5 before:bg-[url('data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'/%3E%3C/svg%3E')]
                                            bg-white border-slate-200
                                        ">
                                            {/* Photo Frame */}
                                            <div className="aspect-[4/5] mb-4 overflow-hidden border-2 relative shadow-inner bg-slate-100 border-slate-100">
                                                <img
                                                    src={style.image_url}
                                                    alt={style.name}
                                                    className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 transform group-hover:scale-110"
                                                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x400?text=Style'}
                                                />
                                                {/* Gender Badge (Pin Style) */}
                                                <div className="absolute top-2 right-2">
                                                    <span className="text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-widest font-black shadow-sm transform rotate-3 inline-block bg-white text-slate-800 border border-slate-200">
                                                        {style.gender || 'Unisex'}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Handwritten Title */}
                                            <h3 className="font-hand text-3xl text-center leading-none truncate px-1 mb-3 text-slate-800">
                                                {style.name.replace(/ [MF]$/i, '').replace(/-[mf]$/i, '')}
                                            </h3>

                                            {/* Tags as Stickers */}
                                            <div className="flex justify-center flex-wrap gap-2 px-2">
                                                {style.tags && style.tags.filter(t => t.toLowerCase() !== category.toLowerCase()).slice(0, 3).map((tag, i) => (
                                                    <span key={i} className={`
                                                    text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-sm shadow-sm
                                                    transform ${i % 2 === 0 ? '-rotate-2' : 'rotate-2'}
                                                    bg-yellow-100 text-yellow-900 border border-yellow-200
                                                `}>
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Decorative Tape */}
                                        <div className={`washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 ${index % 2 === 0 ? 'rotate-2' : '-rotate-1'} z-20 shadow-sm opacity-90 group-hover:-translate-y-2 transition-transform duration-300 bg-pink-300/80`}></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && filteredStyles.length === 0 && (
                <div className="text-center py-20">
                    <p className="font-hand text-3xl text-slate-600">Nothing found in this drawer!</p>
                </div>
            )}
        </div>
    );
};

export default HairstyleGallery;

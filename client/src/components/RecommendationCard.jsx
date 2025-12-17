import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Button } from './ui/button';

/**
 * RecommendationCard Component (Themed: Digital Scrapbook)
 * Displays AI-recommended hairstyles with Polaroid-style cards
 */
const RecommendationCard = ({ recommendations, selectedIndex, onSelect }) => {
    if (!recommendations || recommendations.length === 0) {
        return null;
    }

    return (
        <div className="w-full space-y-8">
            {/* Header omitted (handled in parent) */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((rec, index) => {
                    // Random rotation for natural feel
                    const rot = (index % 2 === 0 ? '-rotate-1' : 'rotate-2');

                    return (
                        <div
                            key={index}
                            className={`relative group cursor-pointer transition-all duration-300 transform hover:rotate-0 hover:z-10 hover:scale-105 ${rot} ${selectedIndex === index ? 'z-20 scale-105' : ''}`}
                            onClick={() => onSelect(index)}
                        >
                            {/* Washi Tape (Visual Only) */}
                            <div className={`washi-tape absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-pink-200/80 rotate-2 z-20 ${selectedIndex === index ? 'opacity-100' : 'opacity-80'}`}></div>

                            {/* Polaroid Card */}
                            <div className={`bg-white p-3 pb-6 shadow-lg rounded-sm border border-slate-200 ${selectedIndex === index ? 'ring-4 ring-indigo-300 ring-offset-2' : ''}`}>

                                {/* Photo Area */}
                                <div className="aspect-[4/5] bg-slate-100 mb-4 overflow-hidden relative border border-slate-100">
                                    <img
                                        src={rec.image_url}
                                        alt={rec.name}
                                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x400?text=Style+Loading';
                                        }}
                                    />
                                    {selectedIndex === index && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1 shadow-md border-2 border-white animate-bounce-slow">
                                            <Check className="h-4 w-4" />
                                        </div>
                                    )}
                                </div>

                                {/* Handwritten Label */}
                                <h3 className="font-hand text-3xl text-center text-slate-800 leading-none mb-3 truncate px-1">
                                    {rec.name}
                                </h3>

                                {/* Tags */}
                                {rec.tags && rec.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                                        {rec.tags.slice(0, 3).map((tag, i) => (
                                            <span key={i} className="text-[10px] uppercase font-bold tracking-widest text-slate-400 border border-slate-200 px-2 py-0.5 rounded-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Sticky Note Explanation */}
                                <div className="bg-yellow-50 p-3 text-xs font-hand text-slate-600 leading-tight border-l-2 border-yellow-200 rotate-1">
                                    <span className="font-bold text-yellow-600 block mb-1">AI Note:</span>
                                    {rec.explanation}
                                </div>

                                {/* Button */}
                                <Button
                                    className={`w-full mt-4 font-bold tracking-wide ${selectedIndex === index
                                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                                            : 'bg-white hover:bg-slate-50 text-slate-600 border-2 border-slate-200'
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onSelect(index);
                                    }}
                                >
                                    {selectedIndex === index ? '✨ SELECTED' : 'TRY THIS'}
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Clothing Advice (Notebook Paper Style) */}
            {recommendations[0]?.clothingSuggestion && (
                <div className="mt-8 bg-white p-6 shadow-sm border border-slate-200 relative overflow-hidden group">
                    {/* Notebook Holes */}
                    <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-space-evenly gap-8 py-4">
                        <div className="w-3 h-3 rounded-full bg-slate-100 shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-100 shadow-inner"></div>
                        <div className="w-3 h-3 rounded-full bg-slate-100 shadow-inner"></div>
                    </div>
                    {/* Red Margin Line */}
                    <div className="absolute left-8 top-0 bottom-0 w-[1px] bg-red-100 h-full"></div>

                    <div className="pl-8">
                        <h3 className="font-hand text-2xl text-indigo-900 mb-2 flex items-center gap-2">
                            💡 Fashion Tip
                        </h3>
                        <p className="font-hand text-xl text-slate-600 leading-relaxed">
                            "{recommendations[0].clothingSuggestion}"
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecommendationCard;

import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2, Camera, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [sizeLevel, setSizeLevel] = useState(2); // 0-4, start at medium
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "🧞‍♂️ PHENOMENAL COSMIC POWERS!\n\nI'm your StyleGenie! Here's what I can do:\n\n📸 Upload a photo for face analysis\n💇 Ask about hairstyles\n🎨 Get color matching tips\n👔 Fashion advice\n\n✨ Your wish is my command!" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showAttention, setShowAttention] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [expression, setExpression] = useState(0);

    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    // 5 Size levels
    const sizes = [
        { width: 300, height: 360, label: 'XS' },
        { width: 340, height: 400, label: 'S' },
        { width: 380, height: 450, label: 'M' },
        { width: 440, height: 520, label: 'L' },
        { width: 520, height: 600, label: 'XL' },
    ];
    const currentSize = sizes[sizeLevel];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) { setShowAttention(false); return; }
        const interval = setInterval(() => {
            setShowAttention(true);
            setExpression(prev => (prev + 1) % 5);
            setTimeout(() => setShowAttention(false), 4000);
        }, 5000);
        setShowAttention(true);
        return () => clearInterval(interval);
    }, [isOpen]);

    const handleImageSelect = (e) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const clearChat = () => {
        setMessages([{ role: 'assistant', content: "🧞‍♂️ Poof! Chat cleared!\n\nFresh start - what style magic can I grant you today?" }]);
    };

    const increaseSize = () => setSizeLevel(prev => Math.min(4, prev + 1));
    const decreaseSize = () => setSizeLevel(prev => Math.max(0, prev - 1));

    const sendMessage = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;
        const userMessage = input.trim();
        const hasImage = !!selectedImage;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage || "📷 Photo uploaded", image: imagePreview }]);
        setIsLoading(true);

        try {
            let response;
            if (hasImage) {
                const formData = new FormData();
                formData.append('message', userMessage || "Please analyze this photo and give me styling advice.");
                formData.append('history', JSON.stringify(messages.slice(-4)));
                formData.append('image', selectedImage);
                response = await fetch('http://localhost:3001/api/chat', { method: 'POST', body: formData });
            } else {
                response = await fetch('http://localhost:3001/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage, history: messages.slice(-4) })
                });
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: data.response || "Hmm, try asking about hairstyles!"
            }]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: "Having trouble connecting! Make sure the server is running. 🔌"
            }]);
        } finally {
            setIsLoading(false);
            removeImage();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    };

    const funnyPhrases = [
        "Rub the lamp! 🪔",
        "FREE STYLE ADVICE!",
        "ITTY BITTY living space!",
        "Al, you're not gonna believe THIS!",
        "You ain't never had a friend like me!"
    ];

    // Blue Genie SVG
    const AladdinGenie = ({ size = 120, animate = false, expr = 0 }) => (
        <svg width={size} height={size * 1.3} viewBox="0 0 120 156" className="overflow-visible">
            <defs>
                <linearGradient id="blueBody" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="50%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="ghostTail" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="70%" stopColor="#60a5fa" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
                </linearGradient>
            </defs>

            {animate && (
                <g className="animate-pulse">
                    <text x="5" y="25" fontSize="14">✨</text>
                    <text x="105" y="20" fontSize="12">⭐</text>
                    <text x="0" y="70" fontSize="10">💫</text>
                    <text x="115" y="60" fontSize="14">✨</text>
                </g>
            )}

            <path d="M45 100 Q40 120 50 140 Q55 150 60 155 Q65 150 70 140 Q80 120 75 100" fill="url(#ghostTail)" />
            <path d="M50 105 Q48 125 55 138" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.5" />
            <path d="M70 105 Q72 125 65 138" stroke="#93c5fd" strokeWidth="2" fill="none" opacity="0.5" />

            <ellipse cx="60" cy="80" rx="30" ry="25" fill="url(#blueBody)" />
            <path d="M35 90 Q40 100 60 105 Q80 100 85 90" fill="url(#blueBody)" />
            <path d="M50 70 Q55 75 60 70 Q65 75 70 70" stroke="#1d4ed8" strokeWidth="2" fill="none" opacity="0.3" />

            <ellipse cx="60" cy="38" rx="32" ry="30" fill="#60a5fa" />
            <ellipse cx="50" cy="18" rx="15" ry="8" fill="#93c5fd" opacity="0.5" />

            <ellipse cx="60" cy="12" rx="8" ry="6" fill="#1e3a5f" />
            <path d="M68 12 Q85 5 90 25 Q88 40 80 50" stroke="#1e3a5f" strokeWidth="8" fill="none" strokeLinecap="round" />
            <circle cx="80" cy="52" r="5" fill="#1e3a5f" />
            <ellipse cx="72" cy="12" rx="4" ry="3" fill="#fbbf24" />

            {expr === 0 && (
                <><path d="M38 28 Q48 20 58 28" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M62 28 Q72 20 82 28" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" /></>
            )}
            {expr === 1 && (
                <><path d="M40 18 Q48 12 56 18" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M64 18 Q72 12 80 18" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" /></>
            )}
            {expr === 2 && (
                <><path d="M40 28 Q48 24 56 30" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M64 16 Q72 10 80 18" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" /></>
            )}
            {expr === 3 && (
                <><path d="M40 22 Q48 28 56 22" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" />
                    <path d="M64 22 Q72 28 80 22" stroke="#1e3a5f" strokeWidth="5" fill="none" strokeLinecap="round" /></>
            )}
            {expr === 4 && (
                <><path d="M38 22 Q43 18 48 24 Q53 18 58 24" stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M62 22 Q67 18 72 24 Q77 18 82 24" stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round" /></>
            )}

            <ellipse cx="48" cy="40" rx="11" ry="13" fill="white" />
            <ellipse cx="72" cy="40" rx="11" ry="13" fill="white" />

            {expr === 0 && (<><circle cx="50" cy="42" r="7" fill="#1e3a5f" /><circle cx="52" cy="40" r="2.5" fill="white" />
                <circle cx="74" cy="42" r="7" fill="#1e3a5f" /><circle cx="76" cy="40" r="2.5" fill="white" /></>)}
            {expr === 1 && (<><circle cx="48" cy="40" r="4" fill="#1e3a5f" /><circle cx="72" cy="40" r="4" fill="#1e3a5f" /></>)}
            {expr === 2 && (<><circle cx="54" cy="42" r="7" fill="#1e3a5f" /><circle cx="56" cy="40" r="2.5" fill="white" />
                <circle cx="78" cy="42" r="7" fill="#1e3a5f" /><circle cx="80" cy="40" r="2.5" fill="white" /></>)}
            {expr === 3 && (<><circle cx="48" cy="44" r="6" fill="#1e3a5f" /><circle cx="50" cy="42" r="2" fill="white" />
                <circle cx="72" cy="44" r="6" fill="#1e3a5f" /><circle cx="74" cy="42" r="2" fill="white" /></>)}
            {expr === 4 && (<><circle cx="48" cy="40" r="8" fill="#1e3a5f" /><circle cx="72" cy="40" r="8" fill="#1e3a5f" />
                <path d="M45 37 L51 43 M51 37 L45 43" stroke="white" strokeWidth="2" />
                <path d="M69 37 L75 43 M75 37 L69 43" stroke="white" strokeWidth="2" /></>)}

            <ellipse cx="60" cy="50" rx="5" ry="3" fill="#2563eb" />
            <ellipse cx="60" cy="62" rx="4" ry="6" fill="#1e3a5f" />

            {expr === 0 && (<><path d="M42 56 Q60 72 78 56" fill="#1e3a5f" /><path d="M48 58 L72 58" stroke="white" strokeWidth="3" /></>)}
            {expr === 1 && <ellipse cx="60" cy="58" rx="10" ry="12" fill="#1e3a5f" />}
            {expr === 2 && <path d="M50 56 Q65 62 78 52" stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round" />}
            {expr === 3 && <path d="M48 60 Q60 54 72 60" stroke="#1e3a5f" strokeWidth="4" fill="none" strokeLinecap="round" />}
            {expr === 4 && (<><path d="M38 54 Q60 78 82 54" fill="#1e3a5f" /><path d="M45 56 L75 56" stroke="white" strokeWidth="3" />
                <path d="M50 64 L70 64" stroke="#b91c1c" strokeWidth="4" strokeLinecap="round" /></>)}

            <circle cx="26" cy="42" r="6" fill="#fbbf24" stroke="#b45309" strokeWidth="2" />
            <ellipse cx="22" cy="78" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />
            <ellipse cx="98" cy="78" rx="10" ry="5" fill="#fbbf24" stroke="#b45309" strokeWidth="1" />

            {animate ? (
                <><g className="animate-wave-left origin-[35px_70px]">
                    <path d="M30 70 Q10 55 5 35" stroke="#3b82f6" strokeWidth="16" fill="none" strokeLinecap="round" />
                    <circle cx="3" cy="32" r="12" fill="#60a5fa" />
                    <path d="M3 20 L3 8" stroke="#60a5fa" strokeWidth="7" strokeLinecap="round" />
                    <path d="M-5 28 L-12 24" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
                    <path d="M10 26 L16 20" stroke="#60a5fa" strokeWidth="5" strokeLinecap="round" />
                </g>
                    <g className="animate-wave-right origin-[85px_70px]">
                        <path d="M90 70 Q110 55 115 35" stroke="#3b82f6" strokeWidth="16" fill="none" strokeLinecap="round" />
                        <circle cx="117" cy="32" r="12" fill="#60a5fa" />
                        <path d="M117 20 L117 8" stroke="#60a5fa" strokeWidth="7" strokeLinecap="round" />
                    </g></>
            ) : (
                <><path d="M32 75 Q20 85 15 95" stroke="#3b82f6" strokeWidth="12" fill="none" strokeLinecap="round" />
                    <circle cx="13" cy="98" r="8" fill="#60a5fa" />
                    <path d="M88 75 Q100 85 105 95" stroke="#3b82f6" strokeWidth="12" fill="none" strokeLinecap="round" />
                    <circle cx="107" cy="98" r="8" fill="#60a5fa" /></>
            )}
        </svg>
    );

    const LampIcon = ({ size = 32 }) => (
        <svg width={size} height={size} viewBox="0 0 32 32">
            <defs><linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#b45309" /></linearGradient></defs>
            <ellipse cx="16" cy="24" rx="10" ry="4" fill="url(#gold)" />
            <ellipse cx="16" cy="20" rx="8" ry="5" fill="url(#gold)" />
            <path d="M12 16 Q10 12 8 10" stroke="#fbbf24" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="16" cy="16" rx="4" ry="2" fill="#fbbf24" />
            <path d="M22 20 Q28 16 26 24" stroke="#b45309" strokeWidth="2" fill="none" />
            <circle cx="7" cy="8" r="3" fill="#60a5fa" opacity="0.8" />
            <circle cx="5" cy="4" r="2" fill="#3b82f6" opacity="0.5" />
        </svg>
    );

    return (
        <>
            {/* Chat Panel */}
            <div
                className={`fixed bottom-24 right-6 z-50 transition-all duration-300 ease-out origin-bottom-right
                    ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
                style={{ width: currentSize.width, height: currentSize.height }}
            >
                <div className="relative h-full">
                    <div className="absolute -left-3 top-12 bottom-12 w-5 flex flex-col justify-around z-30">
                        {[...Array(Math.max(4, Math.floor(currentSize.height / 65)))].map((_, i) => (
                            <div key={i} className="w-5 h-5 rounded-full bg-blue-300 border-2 border-blue-200 shadow-inner"></div>
                        ))}
                    </div>

                    <div className="h-full flex flex-col bg-gradient-to-b from-amber-50 to-blue-50 rounded-2xl shadow-2xl border-2 border-blue-200 overflow-hidden ml-2">
                        <div className="absolute -top-2 left-10 w-20 h-5 bg-blue-400/70 rotate-1 z-20"></div>
                        <div className="absolute -top-2 right-8 w-16 h-5 bg-yellow-400/70 -rotate-2 z-20"></div>

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-100 to-amber-50 px-3 py-2 border-b-2 border-dashed border-blue-200 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <AladdinGenie size={26} animate={false} expr={0} />
                                    <div>
                                        <h3 className="font-hand text-base font-bold text-blue-900">StyleGenie</h3>
                                        <p className="text-[8px] text-blue-500">Your wish is my command!</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <button onClick={clearChat} className="p-1 hover:bg-red-100 rounded-full" title="Clear">
                                        <Trash2 className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                    </button>
                                    <button onClick={decreaseSize} disabled={sizeLevel === 0} className="p-1 hover:bg-blue-100 rounded-full disabled:opacity-30" title="Smaller">
                                        <ZoomOut className="w-3 h-3 text-blue-500" />
                                    </button>
                                    <span className="text-[9px] text-blue-400 font-bold w-5 text-center">{currentSize.label}</span>
                                    <button onClick={increaseSize} disabled={sizeLevel === 4} className="p-1 hover:bg-blue-100 rounded-full disabled:opacity-30" title="Larger">
                                        <ZoomIn className="w-3 h-3 text-blue-500" />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-red-100 rounded-full ml-0.5">
                                        <X className="w-3 h-3 text-slate-400 hover:text-red-500" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[linear-gradient(transparent_26px,#dbeafe_26px)] bg-[length:100%_27px]">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] px-3 py-2 shadow-sm text-sm ${msg.role === 'user'
                                        ? 'bg-blue-500 text-white rounded-xl rounded-br-sm'
                                        : 'bg-white text-slate-700 rounded-xl rounded-bl-sm border border-blue-100'}`}>
                                        {msg.image && <img src={msg.image} alt="" className="w-full h-20 object-cover rounded-lg mb-2" />}
                                        <p className="leading-relaxed whitespace-pre-wrap text-xs">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white px-3 py-2 rounded-xl shadow-sm border border-blue-100 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                                        <span className="text-xs text-blue-500 font-hand">Granting wish...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {imagePreview && (
                            <div className="px-3 py-2 bg-blue-50 border-t border-blue-100 flex-shrink-0">
                                <div className="relative inline-block">
                                    <img src={imagePreview} alt="" className="h-10 w-10 object-cover rounded-lg border-2 border-white shadow" />
                                    <button onClick={removeImage} className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] flex items-center justify-center">×</button>
                                </div>
                            </div>
                        )}

                        <div className="p-2 bg-white border-t border-blue-100 flex-shrink-0">
                            <div className="flex items-center gap-1.5">
                                <input type="file" ref={fileInputRef} onChange={handleImageSelect} accept="image/*" className="hidden" />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-1.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 flex-shrink-0">
                                    <Camera className="w-3.5 h-3.5" />
                                </button>
                                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                    placeholder="Make a wish..." className="flex-1 px-3 py-1.5 bg-blue-50 rounded-full text-xs outline-none focus:ring-2 focus:ring-blue-300 focus:bg-white placeholder:text-blue-300"
                                    disabled={isLoading} autoComplete="off" />
                                <button type="button" onClick={sendMessage} disabled={isLoading || (!input.trim() && !selectedImage)}
                                    className="p-1.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 shadow flex-shrink-0">
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Genie Attention */}
            <div className={`fixed bottom-24 right-8 z-40 pointer-events-none transition-all duration-700 flex items-end gap-2 ${showAttention && !isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
                <div className="relative bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-xl font-hand text-base font-bold whitespace-nowrap border-2 border-white animate-bounce mb-20">
                    {funnyPhrases[expression]}
                    <div className="absolute right-[-10px] bottom-4 w-0 h-0 border-8 border-transparent border-l-blue-600"></div>
                </div>
                <AladdinGenie size={100} animate={true} expr={expression} />
            </div>

            {/* Chat Button */}
            <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 z-50 group transition-all duration-300 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
                <div className="relative">
                    <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
                    <div className="relative bg-white p-2 rounded-full shadow-xl border-3 border-yellow-500 group-hover:border-blue-500 group-hover:scale-110 transition-all">
                        <LampIcon size={36} />
                    </div>
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-[9px] text-white font-bold">3</span>
                    </div>
                </div>
            </button>

            <style>{`
                @keyframes wave-left { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-35deg); } }
                @keyframes wave-right { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(35deg); } }
                .animate-wave-left { animation: wave-left 0.35s ease-in-out infinite; }
                .animate-wave-right { animation: wave-right 0.35s ease-in-out infinite 0.15s; }
            `}</style>
        </>
    );
};

export default ChatBot;

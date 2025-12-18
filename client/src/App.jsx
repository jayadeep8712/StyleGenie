import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Sliders, Home, ScanFace, CheckCircle2, Scissors, Sun, Heart, History, Lock, Paperclip } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import FaceDetector from './components/FaceDetector';
import CanvasOverlay from './components/CanvasOverlay';
import RecommendationCard from './components/RecommendationCard';
import HairstyleGallery from './components/HairstyleGallery';
import FloatingStickers from './components/FloatingStickers';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatBot from './components/ChatBot';
import { Button } from './components/ui/button';
import { analyzeFace } from './services/apiService';
import './index.css';

function App() {
    const [imageFile, setImageFile] = useState(null);
    const [imageData, setImageData] = useState(null);
    const [landmarks, setLandmarks] = useState(null);
    const [faceGeometry, setFaceGeometry] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [selectedHairstyleIndex, setSelectedHairstyleIndex] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [step, setStep] = useState('upload');
    const [analysisMeta, setAnalysisMeta] = useState(null);

    const [activeTab, setActiveTab] = useState('dashboard');

    // Manual Controls
    const [manualScale, setManualScale] = useState(1);
    const [manualX, setManualX] = useState(0);
    const [manualY, setManualY] = useState(0);
    const [manualRotation, setManualRotation] = useState(0);

    const handleImageSelect = (file, data) => {
        setImageFile(file);
        setImageData(data);
        setLandmarks(null);
        setFaceGeometry(null);
        setRecommendations(null);
        setAnalysisMeta(null);
        setError(null);
        setStep(file ? 'detecting' : 'upload');
        setManualScale(1); setManualX(0); setManualY(0); setManualRotation(0);
    };

    const handleLandmarksDetected = (detectedLandmarks) => {
        setLandmarks(detectedLandmarks);
        if (detectedLandmarks.geometry) setFaceGeometry(detectedLandmarks.geometry);
        // Quick transition to ready state
        setTimeout(() => {
            setStep('ready');
        }, 1800);
    };

    const handleError = (errorMessage) => {
        setError(errorMessage);
        setIsProcessing(false);
        setStep('upload');
    };

    const handleAnalyze = async () => {
        if (!imageFile || !landmarks) {
            setError('Please upload an image first');
            return;
        }
        try {
            setIsProcessing(true);
            setError(null);
            setStep('analyzing');

            const result = await analyzeFace(imageFile, landmarks, faceGeometry);

            if (result.recommendations && result.recommendations.length > 0) {
                const enrichedRecommendations = result.recommendations.map(rec => ({
                    ...rec,
                    clothingSuggestion: result.clothingSuggestion
                }));
                setRecommendations(enrichedRecommendations);
                setAnalysisMeta({
                    clothing: result.clothingSuggestion,
                    source: result.source,
                    analysis: result.analysis,
                    gender: result.gender,
                    faceShape: result.faceShape
                });
                setSelectedHairstyleIndex(0);
                setStep('results');
            } else {
                setError('No hairstyle recommendations found. Please try another image.');
                setStep('ready');
            }
        } catch (err) {
            setError(err.message || 'Failed to analyze face. Please try again.');
            setStep('ready');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReset = () => {
        setImageFile(null); setImageData(null); setLandmarks(null); setFaceGeometry(null);
        setRecommendations(null); setAnalysisMeta(null); setSelectedHairstyleIndex(0);
        setError(null); setStep('upload');
    };

    const selectedHairstyle = recommendations?.[selectedHairstyleIndex];

    const NavItem = ({ icon: Icon, label, id, rotate, disabled }) => (
        <div className={`group relative flex flex-col items-center gap-1 ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`} onClick={() => !disabled && setActiveTab(id)}>
            <div className={`p-3 rounded-full border-2 transition-all duration-300 relative ${activeTab === id ? 'border-slate-800 bg-yellow-100 shadow-md ' + rotate : 'border-transparent hover:bg-slate-50'}`}>
                <Icon className={`h-6 w-6 ${activeTab === id ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                {disabled && (
                    <div className="absolute -top-1 -right-1 bg-slate-100 rounded-full p-0.5 border border-slate-200">
                        <Lock className="w-3 h-3 text-slate-400" />
                    </div>
                )}
            </div>
            <span className={`font-hand text-lg text-slate-500 ${activeTab === id ? 'font-bold text-slate-800' : ''}`}>{label}</span>
            {disabled && (
                <div className="absolute left-10 top-2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    Coming Soon
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen font-sans selection:bg-yellow-200 overflow-x-hidden text-slate-800 bg-amber-50/30">

            <FloatingStickers />

            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            </div>

            {/* --- SIDEBAR (Enhanced Hanging Toolkit) --- */}
            <div className="fixed left-8 top-0 h-auto min-h-[600px] flex flex-col items-center z-50 hidden lg:flex pointer-events-none">
                <div className="w-1 h-16 bg-slate-400/80 shadow-sm z-10 origin-top animate-sway-slow"></div>
                <div className="w-24 h-full pb-10 relative flex flex-col items-center gap-8 rounded-b-xl bg-slate-50 shadow-2xl transform origin-top animate-sway-slow pointer-events-auto overflow-hidden border-x border-b border-slate-200">
                    <div className="absolute inset-1.5 border-2 border-dashed border-slate-300 rounded-b-lg pointer-events-none opacity-60"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-repeat pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '8px 8px' }}></div>
                    <div className="absolute top-4 w-4 h-4 bg-slate-800/80 rounded-full shadow-inner z-20 ring-2 ring-white/50"></div>
                    <div className="mt-16 p-2 rounded-full border-4 border-double border-indigo-200 bg-white shadow-md group hover:scale-110 transition-transform cursor-pointer" onClick={handleReset}>
                        <Sparkles className="h-6 w-6 text-indigo-500" />
                    </div>
                    <nav className="flex flex-col gap-6 w-full items-center">
                        <NavItem icon={Home} label="Home" id="dashboard" rotate="-rotate-3" />
                        <NavItem icon={Sliders} label="Gallery" id="gallery" rotate="rotate-2" />
                        <NavItem icon={Heart} label="Faves" id="favorites" rotate="-rotate-2" disabled={true} />
                        <NavItem icon={History} label="History" id="history" rotate="rotate-3" disabled={true} />
                    </nav>
                    <div className="mt-auto opacity-30 pb-4">
                        <Scissors className="h-5 w-5 text-slate-400 rotate-90" />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 py-8 lg:pl-32 transition-all duration-500">

                {activeTab === 'gallery' ? (
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-4 border-dashed min-h-[80vh] bg-white/50 border-indigo-100 shadow-xl relative rotate-1">
                        <div className="washi-tape -top-4 -right-10 rotate-12 bg-yellow-200/80 w-40 h-10 shadow-sm absolute z-20"></div>
                        <div className="text-center mb-8">
                            <h2 className="font-hand text-5xl font-bold mb-2 text-indigo-900">The Collection</h2>
                            <p className="font-hand text-xl text-slate-500">Browsing our entire archive of styles</p>
                        </div>
                        <HairstyleGallery />
                    </div>
                ) : (
                    <>
                        {/* HEADER */}
                        <header className="mb-12 flex flex-col items-center justify-center gap-8 relative text-center">
                            <div className="relative text-center py-4 group cursor-default select-none z-0 mt-8">
                                <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 animate-bounce duration-[3000ms]">
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" className="text-yellow-400 rotate-12 drop-shadow-md filter saturate-150">
                                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="relative inline-block z-10">
                                    <span className="absolute -inset-x-6 -inset-y-2 bg-yellow-300 transform -skew-y-2 rounded-lg z-0 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 border-2 border-black/5 shadow-[4px_4px_0px_rgba(0,0,0,0.1)]"></span>
                                    <h1 className="relative z-10 text-6xl md:text-7xl font-black tracking-tight text-indigo-950 font-['Outfit'] drop-shadow-sm whitespace-nowrap">
                                        StyleGenie
                                        <span className="text-indigo-600 relative inline-block ml-3">
                                            Studio
                                            <svg className="absolute w-[110%] h-5 -bottom-2 -left-1 text-indigo-400 opacity-80" viewBox="0 0 100 10" preserveAspectRatio="none">
                                                <path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" />
                                            </svg>
                                        </span>
                                    </h1>
                                    <div className="absolute -top-6 -right-12 z-20">
                                        <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full -rotate-12 shadow-lg border-2 border-white font-['Outfit'] flex items-center gap-1 hover:scale-110 transition-transform">
                                            <span className="animate-pulse w-2 h-2 bg-white rounded-full inline-block"></span>
                                            AI V2.0
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-8 relative inline-block z-10 block">
                                    <p className="font-['Caveat'] text-3xl md:text-4xl text-slate-600 rotate-1 font-bold relative bg-white/50 px-4 rounded-full backdrop-blur-sm">
                                        ✨ Your Personal AI Stylist & Face Intelligence
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                            <div className="lg:col-span-8 space-y-12">
                                {error && (
                                    <div className="bg-red-50 border-4 border-white shadow-xl p-4 rounded-xl rotate-1 text-red-700 flex items-center gap-3 animate-bounce max-w-lg mx-auto transform hover:rotate-0 transition-transform">
                                        <AlertCircle className="h-6 w-6" />
                                        <span className="font-hand text-xl">{error}</span>
                                    </div>
                                )}

                                {/* --- UPLOAD STAGE --- */}
                                {step === 'upload' && (
                                    <div className="relative space-y-6 animate-in fade-in duration-700 zoom-in-95 py-8">
                                        <div className="scrapbook-card p-5 bg-white rounded-xl max-w-2xl mx-auto transform rotate-1 hover:rotate-0 transition-transform duration-500 shadow-2xl mt-8 relative border-2 border-slate-100">
                                            {/* Washi tape decorations */}
                                            <div className="absolute -top-4 left-8 w-24 h-6 bg-pink-200/80 rotate-[-3deg] shadow-sm z-20"></div>
                                            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-10 relative group cursor-pointer hover:from-indigo-50/80 transition-all duration-300">
                                                {/* AI Badge */}
                                                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-300 to-amber-300 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg rotate-12 group-hover:rotate-6 transition-transform z-10 border-2 border-white">
                                                    <Sparkles className="w-3 h-3 inline mr-1" />AI READY
                                                </div>

                                                {/* Small decorative elements */}
                                                <div className="absolute top-4 left-4 w-3 h-3 bg-indigo-300 rounded-full opacity-40"></div>
                                                <div className="absolute bottom-6 right-6 w-2 h-2 bg-pink-300 rounded-full opacity-50"></div>
                                                <div className="absolute bottom-4 left-8 w-2 h-2 bg-yellow-300 rounded-full opacity-40"></div>

                                                <div className="text-center space-y-8 relative z-10">
                                                    {/* Logo Icon */}
                                                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 via-white to-indigo-50 flex items-center justify-center mx-auto shadow-xl group-hover:scale-105 transition-transform duration-500 border-5 border-white ring-2 ring-indigo-200">
                                                        <Sparkles className="w-14 h-14 text-indigo-500 group-hover:scale-110 transition-transform" />
                                                    </div>

                                                    {/* Title */}
                                                    <div>
                                                        <h2 className="text-5xl font-bold text-slate-800 font-hand">Who are we styling today?</h2>
                                                        <p className="text-slate-500 mt-3 font-medium text-lg">Don't worry, we'll find your perfect match.</p>
                                                    </div>

                                                    {/* Upload Button */}
                                                    <div className="w-full max-w-sm mx-auto">
                                                        <ImageUpload onImageSelect={handleImageSelect} isProcessing={isProcessing} />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom corner tape */}
                                            <div className="absolute -bottom-2 -right-2 w-16 h-5 bg-indigo-200/70 rotate-[-8deg] shadow-sm z-10"></div>
                                        </div>
                                    </div>
                                )}

                                {/* --- DETECTING STAGE (Enhanced Polaroid) --- */}
                                {step === 'detecting' && (
                                    <div className="flex flex-col items-center justify-center p-8 min-h-[500px] animate-in fade-in duration-200">

                                        {/* Floating Sparkles */}
                                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                            <div className="absolute top-20 left-1/4 text-2xl floating-sparkle" style={{ animationDelay: '0s' }}>✨</div>
                                            <div className="absolute top-32 right-1/4 text-xl floating-sparkle" style={{ animationDelay: '0.3s' }}>⭐</div>
                                            <div className="absolute bottom-40 left-1/3 text-lg floating-sparkle" style={{ animationDelay: '0.6s' }}>💫</div>
                                            <div className="absolute bottom-32 right-1/3 text-2xl floating-sparkle" style={{ animationDelay: '0.9s' }}>✨</div>
                                        </div>

                                        {/* Bigger Hanging Polaroid */}
                                        <div className="relative pt-16">
                                            {/* String */}
                                            <div className="absolute left-1/2 -translate-x-1/2 -top-0 w-1 h-16 bg-gradient-to-b from-slate-300 to-slate-400 rounded-full"></div>

                                            {/* Clip/Pin */}
                                            <div className="absolute left-1/2 -translate-x-1/2 top-12 w-10 h-6 bg-yellow-400 rounded-sm shadow-lg border-2 border-yellow-500 z-10"></div>

                                            {/* Polaroid with sway animation - BIGGER */}
                                            <div className="polaroid-sway origin-top relative">
                                                {/* Washi tape top */}
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-pink-200/80 rotate-[-2deg] z-20"></div>

                                                {/* Polaroid frame - RESIZED BIGGER */}
                                                <div className="w-96 md:w-[500px] h-[500px] md:h-[600px] bg-white p-6 shadow-2xl rounded-sm border-2 border-slate-100 mt-3 flex flex-col">
                                                    {/* Photo area */}
                                                    <div className="relative w-full flex-grow rounded-sm overflow-hidden bg-gradient-to-br from-indigo-100 via-white to-purple-50">
                                                        {/* User photo - fast magical fade in */}
                                                        {imageData && (
                                                            <img src={imageData} alt="Your photo" className="absolute inset-0 w-full h-full object-cover photo-magical-in" />
                                                        )}
                                                        {/* Logo overlay - fast magical fade out */}
                                                        <div className="absolute inset-0 flex items-center justify-center logo-magical-out bg-gradient-to-br from-indigo-100 via-white to-purple-50">
                                                            <div className="text-center">
                                                                <div className="relative">
                                                                    <Sparkles className="w-20 h-20 text-indigo-500 mx-auto mb-4 sparkle-glow" />
                                                                    <div className="absolute inset-0 sparkle-ring"></div>
                                                                </div>
                                                                <div className="font-hand text-indigo-600 text-2xl font-bold">StyleGenie</div>
                                                                <div className="text-indigo-400 text-sm mt-1">AI Magic ✨</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Caption area */}
                                                    <div className="h-16 flex flex-col items-center justify-center">
                                                        <div className="flex items-center gap-2 font-hand text-slate-600 text-lg">
                                                            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> Analyzing your style...
                                                        </div>
                                                        {/* Progress bar */}
                                                        <div className="w-48 h-1.5 bg-slate-200 rounded-full mt-2 overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full progress-bar"></div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Decorative corner tapes */}
                                                <div className="absolute -bottom-2 -right-2 w-12 h-5 bg-yellow-200/80 rotate-12"></div>
                                                <div className="absolute -bottom-2 -left-2 w-10 h-4 bg-indigo-200/70 -rotate-6"></div>
                                            </div>
                                        </div>

                                        {/* Loading text */}
                                        <div className="mt-6 text-center">
                                            <h2 className="text-3xl font-bold text-indigo-900 font-hand">Finding your perfect style...</h2>
                                            <div className="flex items-center justify-center gap-3 mt-4">
                                                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                                                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                                            </div>
                                        </div>

                                        {/* Enhanced Animations */}
                                        <style>{`
                                            @keyframes polaroidSway {
                                                0%, 100% { transform: rotate(-1.5deg); }
                                                50% { transform: rotate(1.5deg); }
                                            }
                                            @keyframes photoMagicalIn {
                                                0% { opacity: 0; clip-path: inset(0 100% 0 0); filter: blur(4px); }
                                                60% { opacity: 0.8; clip-path: inset(0 20% 0 0); filter: blur(1px); }
                                                100% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); }
                                            }
                                            @keyframes logoMagicalOut {
                                                0% { opacity: 1; clip-path: inset(0 0 0 0); filter: blur(0); }
                                                40% { opacity: 0.6; clip-path: inset(0 0 0 40%); filter: blur(1px); }
                                                100% { opacity: 0; clip-path: inset(0 0 0 100%); filter: blur(4px); }
                                            }
                                            @keyframes sparkleGlow {
                                                0%, 100% { filter: drop-shadow(0 0 12px rgba(99, 102, 241, 0.7)); transform: scale(1) rotate(0deg); }
                                                50% { filter: drop-shadow(0 0 24px rgba(139, 92, 246, 0.9)); transform: scale(1.15) rotate(5deg); }
                                            }
                                            @keyframes floatingSparkle {
                                                0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
                                                50% { transform: translateY(-15px) scale(1.2); opacity: 1; }
                                            }
                                            @keyframes progressBar {
                                                0% { width: 0%; }
                                                100% { width: 100%; }
                                            }
                                            .polaroid-sway { animation: polaroidSway 2s ease-in-out infinite; }
                                            .photo-magical-in { animation: photoMagicalIn 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                                            .logo-magical-out { animation: logoMagicalOut 1.5s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
                                            .sparkle-glow { animation: sparkleGlow 1s ease-in-out infinite; }
                                            .floating-sparkle { animation: floatingSparkle 2s ease-in-out infinite; }
                                            .progress-bar { animation: progressBar 1.6s ease-out forwards; }
                                        `}</style>

                                        {/* FaceDetector runs in background */}
                                        <div className="hidden">
                                            <FaceDetector imageData={imageData} onLandmarksDetected={handleLandmarksDetected} onError={handleError} />
                                        </div>
                                    </div>
                                )}

                                {/* --- READY / ANALYZING STAGES --- */}
                                {(step === 'ready' || step === 'analyzing') && (
                                    <div className="space-y-8 relative animate-in fade-in duration-500 max-w-3xl mx-auto">
                                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-yellow-200 text-yellow-900 px-8 py-2 shadow-lg transform -rotate-1 z-20 font-hand text-2xl border-2 border-white">
                                            {step === 'analyzing' ? '✨ Sketching your new look...' : '✅ Face Detected!'}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                                            <div className={`scrapbook-card p-6 rounded-2xl ${step === 'ready' ? 'rotate-1' : ''} bg-white relative overflow-hidden`}>
                                                <div className="absolute -right-8 -top-8 w-24 h-24 bg-green-100 rounded-full opacity-50"></div>
                                                <div className="flex items-start gap-4 relative z-10">
                                                    <div className="p-3 bg-white border-2 border-green-100 rounded-full text-green-600 shadow-sm">
                                                        <ScanFace className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Analysis</h3>
                                                        {faceGeometry ? (
                                                            <div className="mt-1 text-slate-700">
                                                                <p className="text-3xl font-black text-indigo-900 tracking-tight">{faceGeometry.shape}</p>
                                                                <div className="flex items-center gap-2 mt-2">
                                                                    <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded-full border border-green-200">{faceGeometry.confidence} Match</span>
                                                                </div>
                                                                <p className="text-lg mt-3 leading-relaxed opacity-90 font-hand text-slate-600">"{faceGeometry.reasoning}"</p>
                                                            </div>
                                                        ) : (
                                                            <p className="text-slate-400 italic mt-2 animate-pulse">Measuring geometry...</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="scrapbook-card p-6 rounded-2xl bg-indigo-600 text-white -rotate-1 border-indigo-600 relative overflow-hidden">
                                                <div className="absolute -right-4 -bottom-4 text-indigo-500 opacity-20"><Sparkles size={120} /></div>
                                                <h3 className="font-bold text-lg opacity-90 border-b border-indigo-400 pb-2 mb-4">System Status</h3>
                                                <div className="space-y-3 relative z-10">
                                                    <div className="flex items-center gap-3">
                                                        <div className="bg-white/20 p-1 rounded-full"><CheckCircle2 className="w-4 h-4 text-white" /></div>
                                                        <span className="font-medium">Face Landmarks</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 opacity-90">
                                                        {step === 'analyzing' ? <Loader2 className="w-6 h-6 animate-spin text-yellow-300" /> : <div className="w-6 h-6 border-2 border-indigo-400 bg-indigo-700 rounded-full flex items-center justify-center text-[10px]">-</div>}
                                                        <span className={`${step === 'analyzing' ? 'font-bold text-yellow-200' : 'text-indigo-200'}`}>{step === 'analyzing' ? 'Detecting Gender...' : 'Gender Detection (Pending)'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 opacity-90">
                                                        {step === 'analyzing' ? <Loader2 className="w-6 h-6 animate-spin text-yellow-300" /> : <div className="w-6 h-6 border-2 border-indigo-400 bg-indigo-700 rounded-full flex items-center justify-center text-[10px]">-</div>}
                                                        <span className={`${step === 'analyzing' ? 'font-bold text-yellow-200' : 'text-indigo-200'}`}>{step === 'analyzing' ? 'Matching Styles...' : 'Style Matching (Pending)'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="scrapbook-card p-2 bg-white rounded-xl mt-8 shadow-2xl">
                                            <div className="washi-tape -top-3 -left-8 -rotate-12 bg-pink-200/80 w-32"></div>
                                            <div className="washi-tape -bottom-3 -right-8 rotate-12 bg-blue-200/80 w-32"></div>

                                            <div className="relative aspect-video bg-slate-100 rounded-lg overflow-hidden border-2 border-slate-100 group">
                                                {imageData && (
                                                    <>
                                                        <img src={imageData} alt="Analysis Target" className="w-full h-full object-contain mix-blend-multiply" />
                                                        <div className="absolute inset-0 bg-indigo-900/10 backdrop-blur-[1px] flex items-center justify-center transition-all duration-500">
                                                            {step === 'ready' && (
                                                                <button onClick={handleAnalyze} type="button" className="group relative transition-transform hover:scale-105 active:scale-95 z-50">
                                                                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                                                    <div className="relative px-8 py-4 bg-white ring-1 ring-gray-900/5 rounded-lg leading-none flex items-center space-x-4 shadow-xl border-b-4 border-r-4 border-slate-900 text-slate-900 font-black text-2xl">
                                                                        <Sparkles className="w-6 h-6 text-indigo-600 animate-spin-slow" />
                                                                        <span>GENERATE STYLE</span>
                                                                    </div>
                                                                </button>
                                                            )}
                                                            {step === 'analyzing' && (
                                                                <div className="text-white text-center bg-black/40 p-8 rounded-2xl backdrop-blur-md border border-white/20 shadow-2xl animate-in zoom-in-90">
                                                                    <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-yellow-300" />
                                                                    <p className="font-bold text-2xl drop-shadow-md font-hand">Consulting the AI Stylist...</p>
                                                                    <p className="text-sm opacity-80 mt-2">Analyzing geometry & trends</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- RESULTS STAGE --- */}
                                {step === 'results' && recommendations && (
                                    <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">



                                        {/* Transformation Complete Header */}
                                        <div className="relative p-8 bg-gradient-to-br from-white via-indigo-50/30 to-purple-50/30 border-4 border-dashed border-indigo-200 rounded-3xl text-center shadow-lg w-full max-w-5xl mx-auto">
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-black tracking-widest shadow-xl -rotate-2 border-4 border-white flex items-center gap-2">
                                                <CheckCircle2 className="w-5 h-5" />
                                                TRANSFORMATION COMPLETE
                                            </div>
                                            <div className="mt-6">
                                                <h2 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
                                                    Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{analysisMeta?.faceShape}</span> Look
                                                </h2>
                                                <p className="text-xl md:text-2xl font-hand text-slate-500 mt-4 inline-block bg-yellow-50 px-6 py-2 rounded-lg border border-yellow-100">
                                                    ✨ "{analysisMeta?.analysis || 'Perfectly matched to your features'}"
                                                </p>
                                            </div>
                                            <div className="absolute top-4 right-8 text-green-600 border-green-600 stamp-badge w-20 h-20 text-center text-[10px] p-2 hidden md:flex items-center justify-center font-bold">APPROVED<br />BY AI<br />STYLIST</div>
                                        </div>

                                        {/* Action Buttons Row */}
                                        <div className="flex justify-center gap-4 mb-6">
                                            <button
                                                onClick={() => handleImageSelect(null, null)}
                                                className="group relative flex items-center gap-3 px-8 py-4 bg-[#ffeb3b] text-slate-900 border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] rounded-xl font-black text-xl tracking-wide uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-200"
                                            >
                                                <div className="absolute -top-3 -left-3 text-2xl group-hover:rotate-12 transition-transform duration-300">🤩</div>
                                                <div className="absolute -bottom-2 -right-2 text-2xl group-hover:-rotate-12 transition-transform duration-300 delay-100">🚀</div>
                                                <span>Try a New Look</span>
                                            </button>
                                        </div>

                                        {/* Main Grid Layout: Canvas (Left) + Stack (Right) */}
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative box-border">

                                            {/* Left Column: Canvas */}
                                            <div className="lg:col-span-8 relative z-10">
                                                <div className="relative w-full mx-auto">
                                                    <div className="scrapbook-card p-3 bg-white rounded-2xl shadow-2xl relative border-2 border-slate-100">
                                                        <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 w-48 bg-gradient-to-r from-yellow-200 to-amber-200 -rotate-1 h-10"></div>
                                                        <CanvasOverlay
                                                            imageData={imageData}
                                                            hairstyleUrl={selectedHairstyle?.image_url}
                                                            landmarks={landmarks}
                                                            manualScale={manualScale}
                                                            manualX={manualX}
                                                            manualY={manualY}
                                                            manualRotation={manualRotation}
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-yellow-300 to-amber-400 text-amber-900 w-24 h-24 rounded-full flex items-center justify-center font-bold text-center text-xs rotate-12 shadow-xl border-4 border-white z-20 animate-bounce-slow cursor-pointer hover:scale-110 transition-transform">
                                                        TAP STYLES<br />BELOW! 👇
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right Column: Controls & Wardrobe Stack */}
                                            <div className="lg:col-span-4 space-y-8 sticky top-24 pt-4 lg:pt-0 z-0">

                                                {/* Fine Tuning - Sticky Note Style */}
                                                <div className="bg-[#fff9c4] p-5 shadow-lg rotate-1 relative transition-transform hover:rotate-0 duration-300 transform hover:scale-[1.02]">
                                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/30 -rotate-2 backdrop-blur-md border border-white/20 shadow-sm pointer-events-none"></div>
                                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-yellow-800/40 uppercase tracking-widest z-10">Adjust</div>

                                                    <h3 className="text-xl font-bold text-yellow-900 font-hand mb-4 flex items-center gap-2 mt-2">
                                                        <Sliders className="w-5 h-5" /> Fine Tuning
                                                    </h3>
                                                    <div className="space-y-4">
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Size</label>
                                                            <input type="range" min="0.5" max="2.0" step="0.05" value={manualScale} onChange={(e) => setManualScale(parseFloat(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="space-y-1">
                                                                <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Move X</label>
                                                                <input type="range" min="-250" max="250" step="1" value={manualX} onChange={(e) => setManualX(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Move Y</label>
                                                                <input type="range" min="-250" max="250" step="1" value={manualY} onChange={(e) => setManualY(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Tilt</label>
                                                            <input type="range" min="-45" max="45" step="1" value={manualRotation} onChange={(e) => setManualRotation(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                                        </div>
                                                        <div className="text-center pt-2">
                                                            <button onClick={() => { setManualScale(1); setManualX(0); setManualY(0); setManualRotation(0); }} className="text-xs font-bold text-yellow-700 hover:text-yellow-900 underline decoration-dotted">Reset Adjustments</button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Wardrobe Picks - Pinned Note Style */}
                                                {recommendations[0]?.clothingSuggestion && (
                                                    <div className="bg-pink-50 p-5 shadow-md -rotate-1 relative transition-transform hover:rotate-0 duration-300 border border-pink-100 transform hover:scale-[1.02]">
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-red-400 rounded-full shadow-md border-2 border-white z-10"></div>
                                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-black/10 z-0"></div>

                                                        <h3 className="text-xl font-bold text-pink-900 font-hand mb-4 flex items-center gap-2 mt-2">
                                                            👗 Wardrobe Picks
                                                        </h3>
                                                        <p className="font-hand text-slate-600 mb-4 text-sm bg-white/60 px-3 py-2 rounded-lg inline-block w-full">
                                                            "{analysisMeta?.clothing || 'Styles to match'}"
                                                        </p>
                                                        <div className="space-y-4">
                                                            {/* Simple List Layout for Sidebar */}
                                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">👕</span>
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-800 text-sm">Casual</h4>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {(recommendations[0].outfitSuggestions?.[0]?.colors || ['Blue', 'White']).map((c, i) => (
                                                                                <span key={i} className="text-[9px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{c}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-2xl">👔</span>
                                                                    <div>
                                                                        <h4 className="font-bold text-slate-800 text-sm">Formal</h4>
                                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                                            {(recommendations[0].outfitSuggestions?.[1]?.colors || ['Grey', 'Black']).map((c, i) => (
                                                                                <span key={i} className="text-[9px] font-bold uppercase bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{c}</span>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>



                                        {/* Curated Collection - Scrapbook Style */}
                                        <div className="mt-12 bg-white p-8 md:p-10 rounded-3xl border-4 border-dashed border-indigo-200 relative shadow-xl ">
                                            <div className="absolute top-0 left-0 w-full h-full bg-indigo-50/10 pointer-events-none rounded-3xl"></div>

                                            {/* Top Tape Header */}
                                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#e0e7ff] text-indigo-900 px-8 py-2 font-black tracking-widest uppercase rotate-1 shadow-sm border border-white transform skew-x-12">
                                                Your New Collection
                                            </div>

                                            <div className="relative z-10">
                                                <h3 className="text-3xl md:text-4xl font-bold mb-8 flex items-center justify-center gap-3 text-indigo-900 font-hand">
                                                    <span className="text-4xl">✂️</span>
                                                    Top 3 Recommended Styles
                                                </h3>
                                                <RecommendationCard
                                                    recommendations={recommendations}
                                                    selectedIndex={selectedHairstyleIndex}
                                                    onSelect={setSelectedHairstyleIndex}
                                                />
                                            </div>
                                        </div>


                                    </div>
                                )}
                            </div>

                            {/* RIGHT PANEL: TOOLS & TIPS */}
                            <div className="lg:col-span-4 space-y-8 sticky top-8 pt-12 lg:pt-0">

                                {step !== 'results' && (
                                    <div className="relative min-h-[500px] w-full animate-in slide-in-from-right-8 duration-700 delay-300 mt-12 hidden lg:block">
                                        <div className="absolute top-0 right-4 w-60 bg-[#fef9c3] p-6 shadow-md rotate-2 transform hover:rotate-0 transition-transform duration-300 rounded-sm hover:z-10 hover:shadow-xl">
                                            <div className="w-3 h-3 rounded-full bg-red-400 border border-red-500 shadow-sm mx-auto -mt-8 mb-4"></div>
                                            <h3 className="font-hand text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                <Sun className="w-5 h-5 text-orange-400" /> Lighting 101
                                            </h3>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed font-hand text-lg">
                                                Face the window! Shadows are the enemy of style. ☀️
                                            </p>
                                        </div>
                                        <div className="absolute top-48 right-16 w-60 bg-[#fce7f3] p-6 shadow-md -rotate-3 transform hover:rotate-0 transition-transform duration-300 rounded-sm hover:z-10 hover:shadow-xl">
                                            <div className="w-3 h-3 rounded-full bg-blue-400 border border-blue-500 shadow-sm mx-auto -mt-8 mb-4"></div>
                                            <h3 className="font-hand text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                                                <Scissors className="w-5 h-5 text-indigo-500" /> Hair Back
                                            </h3>
                                            <p className="text-sm font-medium text-slate-600 leading-relaxed font-hand text-lg">
                                                Pull it back! We need to see that jawline. 📐
                                            </p>
                                        </div>
                                        <div className="absolute top-96 right-10 w-32 h-8 bg-green-200/80 rotate-12 opacity-80 shadow-sm"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>

            <Footer />
            <ScrollToTop />
            <ChatBot />
        </div>
    );
}

export default App;

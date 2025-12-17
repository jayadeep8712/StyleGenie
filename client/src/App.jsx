import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, Sliders, Home, ScanFace, CheckCircle2, Scissors } from 'lucide-react';
import ImageUpload from './components/ImageUpload';
import FaceDetector from './components/FaceDetector';
import CanvasOverlay from './components/CanvasOverlay';
import RecommendationCard from './components/RecommendationCard';
import HairstyleGallery from './components/HairstyleGallery';
import FloatingStickers from './components/FloatingStickers';
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
        setStep('ready');
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

    return (
        <div className="min-h-screen font-sans selection:bg-yellow-200 overflow-x-hidden text-slate-800 bg-amber-50/30">

            {/* --- NEW: Floating Background Stickers --- */}
            <FloatingStickers />

            {/* --- HAND-DRAWN BLOBS (Background Layer 2) --- */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 animate-blob"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-100 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 animate-blob animation-delay-4000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse-slow"></div>
            </div>

            {/* --- SIDEBAR (Scrapbook Bookmark Style) --- */}
            <div className="fixed left-6 top-0 h-auto min-h-[500px] flex flex-col items-center py-12 z-50 hidden lg:flex">
                <div className="w-20 h-full border-x-2 border-b-2 shadow-xl relative flex flex-col items-center gap-8 pb-8 rounded-b-lg bg-white border-slate-200">

                    {/* TAPE */}
                    <div className="washi-tape absolute -top-2 left-1/2 -translate-x-1/2 w-24 h-8 rotate-2 shadow-sm z-20 bg-pink-300/90"></div>

                    {/* Logo/Reset */}
                    <div className="mt-8 p-2 rounded-full border-4 border-dashed shadow-inner group transition-transform hover:scale-110 hover:rotate-6 cursor-pointer border-indigo-300 bg-indigo-50" onClick={handleReset}>
                        <Sparkles className="h-6 w-6 text-indigo-500" />
                    </div>

                    <nav className="flex flex-col gap-6 w-full items-center">
                        <div className="group relative flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
                            <div className={`p-3 rounded-full border-2 transition-all duration-300 ${activeTab === 'dashboard' ? 'border-slate-800 bg-yellow-100 rotate-3 shadow-md' : 'border-transparent hover:bg-slate-50'}`}>
                                <Home className={`h-6 w-6 ${activeTab === 'dashboard' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            </div>
                            <span className="font-hand text-xl -rotate-2 text-slate-500">Home</span>
                        </div>

                        <div className="group relative flex flex-col items-center gap-1 cursor-pointer" onClick={() => setActiveTab('gallery')}>
                            <div className={`p-3 rounded-full border-2 transition-all duration-300 ${activeTab === 'gallery' ? 'border-slate-800 bg-yellow-100 -rotate-2 shadow-md' : 'border-transparent hover:bg-slate-50'}`}>
                                <Sliders className={`h-6 w-6 ${activeTab === 'gallery' ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`} />
                            </div>
                            <span className="font-hand text-xl -rotate-1 text-slate-500">Gallery</span>
                        </div>
                    </nav>

                    <div className="mt-auto w-full h-8 flex items-end justify-center opacity-20">
                        <Scissors className="h-4 w-4 -rotate-45 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:pl-28 transition-all duration-500">

                {/* VIEW: HAIRSTYLE GALLERY */}
                {activeTab === 'gallery' ? (
                    <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border-4 border-dashed min-h-[80vh] bg-white/50 border-indigo-100 shadow-xl relative rotate-1">
                        {/* Tape corners for container */}
                        <div className="washi-tape -top-4 -right-10 rotate-12 bg-yellow-200/80 w-40 h-10 shadow-sm absolute z-20"></div>

                        <div className="text-center mb-8">
                            <h2 className="font-hand text-5xl font-bold mb-2 text-indigo-900">The Collection</h2>
                            <p className="font-hand text-xl text-slate-500">Browsing our entire archive of styles</p>
                        </div>
                        <HairstyleGallery /> {/* Removed dark mode prop */}
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
                                    <span className="absolute -inset-x-6 -inset-y-2 bg-indigo-500/20 transform skew-y-1 translate-x-3 translate-y-3 rounded-lg z-[-1] blur-sm"></span>

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

                            {/* LEFT PANEL: WORKSPACE */}
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
                                        {/* Arrow Visual */}
                                        <div className="absolute top-24 right-[98%] hidden xl:flex flex-col items-end z-30 pointer-events-none select-none w-72">
                                            <div className="relative flex flex-col items-end transform -rotate-6 group">
                                                <div className="relative z-10 text-right mr-4 mb-2">
                                                    <span className="block font-hand text-4xl text-indigo-400 font-bold transform -rotate-2 origin-bottom-right">Start your</span>
                                                    <span className="relative inline-block mt-1">
                                                        <span className="relative z-10 font-hand text-5xl text-indigo-600 font-black tracking-wide drop-shadow-sm">makeover here!</span>
                                                        <svg className="absolute -top-2 -left-4 w-[120%] h-[140%] -z-10 text-yellow-300 opacity-90 mix-blend-multiply" viewBox="0 0 200 60" preserveAspectRatio="none">
                                                            <path d="M10,25 Q100,5 190,30 L185,45 Q90,20 15,40 Z" fill="currentColor" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <div className="relative -mr-8 w-40 h-32 animate-bounce-slow">
                                                    <svg width="100%" height="100%" viewBox="0 0 160 120" fill="none" className="text-indigo-500 drop-shadow-md">
                                                        <path d="M30,10 C-10,40 5,80 40,80 C70,80 80,40 50,30 C20,20 40,90 130,105" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 6" fill="none" />
                                                        <path d="M115,95 L135,106 L118,115" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="scrapbook-card p-3 bg-white rounded-xl max-w-2xl mx-auto transform hover:rotate-0 transition-transform duration-500">
                                            <div className="washi-tape washi-tape-top"></div>
                                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 bg-slate-50 relative group cursor-pointer hover:bg-indigo-50/50 transition-all duration-300">
                                                <div className="absolute -top-3 -right-3 bg-yellow-300 text-yellow-900 text-xs font-black px-4 py-1.5 rounded-full shadow-lg rotate-12 group-hover:rotate-6 transition-transform z-10 border-2 border-white">AI READY ⚡</div>
                                                <div className="text-center space-y-8">
                                                    <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform duration-300 border-4 border-indigo-50">
                                                        <Sparkles className="w-12 h-12 text-indigo-500" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-4xl font-bold text-slate-800 font-hand">Who are we styling today?</h2>
                                                        <p className="text-slate-500 mt-2 font-medium">Don't worry, we'll find your perfect match.</p>
                                                    </div>
                                                    <div className="w-full max-w-sm mx-auto">
                                                        <ImageUpload onImageSelect={handleImageSelect} isProcessing={isProcessing} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- PROCESSING STAGES --- */}
                                {(step === 'detecting' || step === 'ready' || step === 'analyzing') && (
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
                                                        {step === 'analyzing' ? <Loader2 className="w-6 h-6 animate-spin text-yellow-300" /> : <div className="w-6 h-6 border-2 border-white/30 rounded-full" />}
                                                        <span className={step === 'analyzing' ? 'font-bold text-yellow-200' : ''}>Gender Detection</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 opacity-90">
                                                        {step === 'analyzing' ? <Loader2 className="w-6 h-6 animate-spin text-yellow-300" /> : <div className="w-6 h-6 border-2 border-white/30 rounded-full" />}
                                                        <span className={step === 'analyzing' ? 'font-bold text-yellow-200' : ''}>Style Matching</span>
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
                                                                <button onClick={handleAnalyze} className="group relative transition-transform hover:scale-105 active:scale-95">
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
                                                <div className="hidden"><FaceDetector imageData={imageData} onLandmarksDetected={handleLandmarksDetected} onError={handleError} /></div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- RESULTS STAGE --- */}
                                {step === 'results' && recommendations && (
                                    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700">
                                        <div className="relative p-8 bg-white border-4 border-dashed border-indigo-200 rounded-3xl text-center rotate-1 shadow-lg max-w-4xl mx-auto">
                                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-8 py-3 rounded-full font-black tracking-widest shadow-xl -rotate-2 border-4 border-white">TRANSFORMATION COMPLETE</div>
                                            <div className="mt-6">
                                                <h2 className="text-5xl font-black text-slate-800 tracking-tight">
                                                    {analysisMeta?.gender || 'Your'} <span className="text-indigo-600 underline decoration-wavy decoration-yellow-300 decoration-4 underline-offset-4">{analysisMeta?.faceShape}</span> Look
                                                </h2>
                                                <p className="text-2xl font-hand text-slate-500 mt-4 rotate-1 inline-block bg-yellow-50 px-4 py-1">"{analysisMeta?.analysis || 'Perfectly matched to your features'}"</p>
                                            </div>
                                            <div className="absolute top-4 right-8 text-green-600 border-green-600 stamp-badge w-24 h-24 text-center text-xs p-2 hidden md:flex">APPROVED<br />BY AI<br />STYLIST</div>
                                        </div>

                                        <div className="relative max-w-4xl mx-auto">
                                            <div className="scrapbook-card p-2 bg-white rounded-xl shadow-2xl relative">
                                                <div className="washi-tape -top-4 left-1/2 -translate-x-1/2 w-48 bg-yellow-200/90 -rotate-1 h-10"></div>
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
                                            <div className="absolute -bottom-8 -right-8 bg-yellow-300 text-yellow-900 w-28 h-28 rounded-full flex items-center justify-center font-bold text-center text-sm rotate-12 shadow-xl border-4 border-white z-20 animate-bounce-slow cursor-pointer hover:scale-110 transition-transform">
                                                TAP STYLES<br />BELOW! 👇
                                            </div>
                                        </div>

                                        <div className="mt-12 bg-indigo-50/50 p-8 rounded-3xl border-2 border-indigo-100">
                                            <h3 className="text-3xl font-bold mb-8 flex items-center gap-3 text-indigo-900">
                                                <span className="bg-white p-2 rounded-xl text-indigo-600 shadow-sm border border-indigo-100 flex items-center justify-center w-12 h-12">✂️</span>
                                                Curated Collection
                                            </h3>
                                            <RecommendationCard
                                                recommendations={recommendations}
                                                selectedIndex={selectedHairstyleIndex}
                                                onSelect={setSelectedHairstyleIndex}
                                            />
                                        </div>

                                        {recommendations[0]?.clothingSuggestion && (
                                            <div className="mt-8 bg-white/50 p-8 rounded-3xl border-4 border-dashed border-pink-200 rotate-1 relative">
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-pink-100 text-pink-700 px-6 py-2 rounded-full font-bold shadow-lg border-2 border-white">🎀 Stylist's Wardrobe Picks</div>
                                                <div className="text-center mb-8 mt-4">
                                                    <p className="font-hand text-2xl text-slate-600">"{analysisMeta?.clothing || 'Styles to match your new look'}"</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="bg-white p-6 rounded-xl shadow-md transform -rotate-1 hover:rotate-0 transition-transform border border-slate-100">
                                                        <div className="flex items-center gap-3 mb-4 border-b pb-2">
                                                            <div className="bg-blue-100 p-2 rounded-full">👕</div>
                                                            <h4 className="font-bold text-lg text-slate-800">Casual Vibe</h4>
                                                        </div>
                                                        <p className="text-slate-600 mb-4">{recommendations[0].outfitSuggestions?.[0]?.description || "Relaxed fit tee with classic denim."}</p>
                                                        <div className="flex gap-2">
                                                            {recommendations[0].outfitSuggestions?.[0]?.colors?.map((c, i) => (
                                                                <span key={i} className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">{c}</span>
                                                            )) || <span className="text-xs bg-slate-100 px-2 py-1 rounded">Blue</span>}
                                                        </div>
                                                    </div>
                                                    <div className="bg-white p-6 rounded-xl shadow-md transform rotate-1 hover:rotate-0 transition-transform border border-slate-100">
                                                        <div className="flex items-center gap-3 mb-4 border-b pb-2">
                                                            <div className="bg-purple-100 p-2 rounded-full">👔</div>
                                                            <h4 className="font-bold text-lg text-slate-800">Formal Look</h4>
                                                        </div>
                                                        <p className="text-slate-600 mb-4">{recommendations[0].outfitSuggestions?.[1]?.description || "Sharp blazer with tailored trousers."}</p>
                                                        <div className="flex gap-2">
                                                            {recommendations[0].outfitSuggestions?.[1]?.colors?.map((c, i) => (
                                                                <span key={i} className="text-xs font-bold uppercase bg-slate-100 px-2 py-1 rounded text-slate-500">{c}</span>
                                                            )) || <span className="text-xs bg-slate-100 px-2 py-1 rounded">Grey</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT PANEL: TOOLS & TIPS (Sticky Note Style) */}
                            <div className="lg:col-span-4 space-y-8 sticky top-8 pt-12 lg:pt-0">
                                {step === 'results' && (
                                    <div className="bg-[#fff9c4] p-6 shadow-xl rotate-1 relative transition-transform hover:rotate-0 duration-300">
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-10 bg-white/40 rotate-1 backdrop-blur-sm shadow-sm opacity-60"></div>
                                        <h3 className="text-2xl font-bold text-yellow-900 font-hand mb-6 flex items-center gap-2">
                                            <Sliders className="w-6 h-6" /> Fine Tuning
                                        </h3>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Size check</label>
                                                <input type="range" min="0.5" max="2.0" step="0.05" value={manualScale} onChange={(e) => setManualScale(parseFloat(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none cursor-pointer accent-indigo-600" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Move X</label>
                                                    <input type="range" min="-250" max="250" step="1" value={manualX} onChange={(e) => setManualX(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Move Y</label>
                                                    <input type="range" min="-250" max="250" step="1" value={manualY} onChange={(e) => setManualY(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase text-yellow-800/60 tracking-wider">Tilt</label>
                                                <input type="range" min="-45" max="45" step="1" value={manualRotation} onChange={(e) => setManualRotation(parseInt(e.target.value))} className="w-full h-2 bg-yellow-600/20 rounded-full appearance-none accent-indigo-600" />
                                            </div>
                                            <Button variant="ghost" onClick={() => { setManualScale(1); setManualX(0); setManualY(0); setManualRotation(0); }} className="w-full text-yellow-800 hover:bg-yellow-200/50 font-hand text-xl">Reset to Default</Button>
                                        </div>
                                    </div>
                                )}

                                {step !== 'results' && (
                                    <div className="bg-white border-4 border-slate-100 p-8 rounded-3xl shadow-lg -rotate-1 relative overflow-hidden group hover:border-indigo-100 transition-colors">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Sparkles className="w-32 h-32 text-indigo-500" />
                                        </div>
                                        <h3 className="font-black text-2xl mb-6 text-indigo-900">StyleGenie Secrets</h3>
                                        <ul className="space-y-6">
                                            <li className="flex items-start gap-4">
                                                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">1</div>
                                                <div>
                                                    <p className="font-bold text-slate-800">Light it up!</p>
                                                    <p className="text-slate-500 text-sm leading-relaxed">Face a window for the best AI detection accuracy.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-4">
                                                <div className="bg-pink-100 text-pink-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm shrink-0 border-2 border-white shadow-sm">2</div>
                                                <div>
                                                    <p className="font-bold text-slate-800">Clear view</p>
                                                    <p className="text-slate-500 text-sm leading-relaxed">Pull hair back so we can see that jawline!</p>
                                                </div>
                                            </li>
                                        </ul>
                                        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                                            <p className="font-hand text-2xl text-indigo-400 rotate-2">"Trust the process!"</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}

export default App;

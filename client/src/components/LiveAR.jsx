import React, { useEffect, useRef, useState } from 'react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { X, Loader2, Sliders, Camera } from 'lucide-react';

const LiveAR = ({ hairstyleUrl, onClose, isDarkMode }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const overlayRef = useRef(null);
    const landmarkerRef = useRef(null);
    const requestRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hairImage, setHairImage] = useState(null);

    // Manual Adjustments
    const [scale, setScale] = useState(1.0);
    const [offsetX, setOffsetX] = useState(0);
    const [offsetY, setOffsetY] = useState(0); // Default slightly up for forehead
    const [rotation, setRotation] = useState(0);
    const [showControls, setShowControls] = useState(true);

    // 1. Load Hair Image Asset
    useEffect(() => {
        if (hairstyleUrl) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = hairstyleUrl;
            img.onload = () => setHairImage(img);
        }
    }, [hairstyleUrl]);

    // 2. Initialize MediaPipe & Camera
    useEffect(() => {
        const init = async () => {
            try {
                console.log("Loading MediaPipe Vision...");
                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
                        delegate: "GPU"
                    },
                    runningMode: "VIDEO",
                    numFaces: 1
                });

                console.log("MediaPipe Ready. Starting Camera...");
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadeddata = () => {
                        setIsLoading(false);
                        predictWebcam();
                    };
                }
            } catch (err) {
                console.error("Init Error:", err);
                setError("Failed to access camera or load AI.");
                setIsLoading(false);
            }
        };

        init();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
            }
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // 3. Render Loop (The AR Logic)
    const predictWebcam = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const landmarker = landmarkerRef.current;

        if (video && canvas && landmarker) {
            // Check video validity
            if (video.videoWidth > 0 && video.videoHeight > 0) {
                // Match canvas to video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d');

                // Detect
                const startTimeMs = performance.now();
                const results = landmarker.detectForVideo(video, startTimeMs);

                // Clear previous frame
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // If face found, Draw Hair
                if (results.faceLandmarks && results.faceLandmarks.length > 0 && hairImage) {
                    const landmarks = results.faceLandmarks[0];

                    // --- ANCHOR LOGIC ---
                    // 10: Top Forehead, 152: Chin, 234: Left Ear, 454: Right Ear

                    // Head Width (approx)
                    const leftSide = landmarks[234];
                    const rightSide = landmarks[454];
                    const dx = (rightSide.x - leftSide.x) * canvas.width;
                    const dy = (rightSide.y - leftSide.y) * canvas.height;
                    const headWidthPixels = Math.sqrt(dx * dx + dy * dy);

                    // Head Center (Forehead/Brows approx)
                    // Using mid-point between temples for consistent rotation anchor
                    const centerX = ((leftSide.x + rightSide.x) / 2) * canvas.width;
                    const centerY = ((leftSide.y + rightSide.y) / 2) * canvas.height;

                    // Rotation (Roll)
                    const angle = Math.atan2(dy, dx); // Radians

                    // Vertical offset to move from "Ear line" to "Forehead/Hairline"
                    // The "Up" vector is perpendicular to the eye line
                    // -Math.sin(angle) is X component of Up, Math.cos(angle) is Y component of Up
                    // We want to move UP, so we subtract from Y using the calculated rotation vectors

                    // Actually, let's keep it simple: Use landmark 10 (top forehead) as anchor?
                    // Landmark 10 is usually good, but keypoints 10 can be unstable on extreme pitch.
                    // Let's stick to center + manual offset for now, or use Landmark 10.

                    const forehead = landmarks[10];
                    const anchorX = forehead.x * canvas.width;
                    const anchorY = forehead.y * canvas.height;

                    // --- DRAWING TRANSFORM ---
                    ctx.save();

                    // Translate to Anchor
                    ctx.translate(anchorX + offsetX, anchorY + offsetY);

                    // Rotate (Head Tilt + Manual)
                    ctx.rotate(angle + (rotation * Math.PI / 180));

                    // Scale (Head Size + Manual)
                    // Base size: Hair image width should cover head width * multiplier
                    // Typical hair asset is wider than face. Let's guess base scale.
                    const baseScale = (headWidthPixels / hairImage.width) * 2.2;
                    const finalScale = baseScale * scale;

                    ctx.scale(finalScale, finalScale);

                    // Draw centered (Offset by half image size)
                    ctx.drawImage(hairImage, -hairImage.width / 2, -hairImage.height / 2);

                    ctx.restore();
                }
            }
        }

        requestRef.current = requestAnimationFrame(predictWebcam);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">

            {/* Main Viewport */}
            <div className={`relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 ${isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-white bg-slate-100'}`}>

                {isLoading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-20 bg-black/50 backdrop-blur-sm">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-indigo-400" />
                        <p className="font-hand text-xl">Loading Magic Mirror...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center text-red-400 font-bold p-8 text-center z-30">
                        {error}
                    </div>
                )}

                {/* Video Layer */}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                />

                {/* AR Canvas Layer */}
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] pointer-events-none"
                />

                {/* Close Button */}
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 z-50">
                    <X />
                </button>

                {/* Controls Toggle */}
                <button
                    onClick={() => setShowControls(!showControls)}
                    className="absolute bottom-4 left-4 bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-lg z-50 flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Sliders size={18} /> Adjust Fit
                </button>
            </div>

            {/* Adjustment Controls Panel */}
            {showControls && (
                <div className="mt-6 w-full max-w-2xl bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-white animate-in slide-in-from-bottom-5">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">Scale</label>
                            <input
                                type="range" min="0.5" max="2.0" step="0.05"
                                value={scale} onChange={(e) => setScale(parseFloat(e.target.value))}
                                className="w-full accent-indigo-400 h-2 bg-white/20 rounded-full appearance-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">Move X</label>
                            <input
                                type="range" min="-100" max="100" step="1"
                                value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))}
                                className="w-full accent-indigo-400 h-2 bg-white/20 rounded-full appearance-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">Move Y</label>
                            <input
                                type="range" min="-200" max="100" step="1"
                                value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))}
                                className="w-full accent-indigo-400 h-2 bg-white/20 rounded-full appearance-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider opacity-70">Tilt</label>
                            <input
                                type="range" min="-45" max="45" step="1"
                                value={rotation} onChange={(e) => setRotation(parseInt(e.target.value))}
                                className="w-full accent-indigo-400 h-2 bg-white/20 rounded-full appearance-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LiveAR;

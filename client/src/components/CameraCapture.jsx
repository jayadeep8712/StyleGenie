import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCcw } from 'lucide-react';

const CameraCapture = ({ onCapture, onClose, isDarkMode }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            setError("Could not access camera. Please allow permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            const video = videoRef.current;
            canvasRef.current.width = video.videoWidth;
            canvasRef.current.height = video.videoHeight;
            context.drawImage(video, 0, 0);

            const imageUrl = canvasRef.current.toDataURL('image/jpeg');
            setCapturedImage(imageUrl);
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
    };

    const handleConfirm = () => {
        // Convert to Blob
        canvasRef.current.toBlob((blob) => {
            onCapture(blob);
        }, 'image/jpeg');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className={`relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-gray-100">
                    <h3 className={`font-hand text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Magic Mirror</h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100/10 transition-colors">
                        <X className={isDarkMode ? 'text-white' : 'text-gray-800'} />
                    </button>
                </div>

                {/* Camera Viewport */}
                <div className="relative aspect-[3/4] bg-black">
                    {error ? (
                        <div className="absolute inset-0 flex items-center justify-center text-red-500 text-center p-4">
                            {error}
                        </div>
                    ) : capturedImage ? (
                        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover transform scale-x-[-1]" />
                    ) : (
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />
                    )}
                    <canvas ref={canvasRef} className="hidden" />
                </div>

                {/* Controls */}
                <div className="p-6 flex justify-center items-center gap-8">
                    {capturedImage ? (
                        <>
                            <button onClick={handleRetake} className="flex flex-col items-center gap-1 text-gray-500 hover:text-indigo-500 transition-colors">
                                <span className="p-3 rounded-full border-2 border-current"><RefreshCcw /></span>
                                <span className="text-xs font-bold uppercase">Retake</span>
                            </button>
                            <button onClick={handleConfirm} className="flex flex-col items-center gap-1 text-green-500 hover:text-green-600 transition-colors scale-110">
                                <span className="p-4 rounded-full bg-green-500 text-white shadow-lg shadow-green-200"><Check size={32} /></span>
                            </button>
                        </>
                    ) : (
                        <button onClick={handleCapture} className="group relative">
                            <div className="w-16 h-16 rounded-full border-4 border-indigo-500 p-1">
                                <div className="w-full h-full bg-indigo-500 rounded-full group-hover:scale-90 transition-transform"></div>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CameraCapture;

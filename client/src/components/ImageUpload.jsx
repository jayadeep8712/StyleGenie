import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Camera } from 'lucide-react';

const ImageUpload = ({ onImageSelect, isProcessing }) => {
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (file) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                onImageSelect(file, reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="relative max-w-md mx-auto">
            {/* Simple Washi Tape Top Center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-8 bg-yellow-200/80 rotate-1 z-10 shadow-sm"></div>

            {/* Main Polaroid-style Card */}
            <div className="bg-white p-4 pt-8 pb-8 rounded-sm shadow-xl transform -rotate-1 transition-transform hover:rotate-0 hover:shadow-2xl">

                <div
                    className={`relative border-2 border-dashed rounded-lg p-8 transition-colors duration-150 flex flex-col items-center justify-center gap-6
                        ${dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}
                        ${isProcessing ? 'opacity-60 pointer-events-none' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    style={{ minHeight: '300px' }}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                        disabled={isProcessing}
                    />

                    {preview ? (
                        <div className="flex flex-col items-center gap-4 w-full">
                            <div className="relative bg-white p-2 shadow-md rotate-1">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full max-w-[200px] aspect-square object-cover"
                                />
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreview(null);
                                    onImageSelect(null, null);
                                }}
                                className="text-sm text-indigo-600 underline font-hand text-lg hover:text-indigo-800"
                                disabled={isProcessing}
                            >
                                Choose another photo
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-white p-4 rounded-full shadow-sm border border-slate-200">
                                <ImageIcon className="w-10 h-10 text-slate-400" />
                            </div>

                            <div className="text-center space-y-1">
                                <h3 className="font-hand text-2xl font-bold text-slate-700">Upload Selfie</h3>
                                <p className="text-sm text-slate-500 font-medium">Drag & drop or tap to browse</p>
                            </div>

                            {/* Simple Action Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                }}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md font-hand text-lg shadow-md hover:bg-indigo-700 active:bg-indigo-800 transition-colors cursor-pointer flex items-center gap-2"
                            >
                                <Camera className="w-4 h-4" />
                                <span>Pick Photo</span>
                            </button>

                            <p className="text-xs text-slate-400 mt-2">JPG, PNG • Max 10MB</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;

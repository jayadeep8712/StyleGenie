import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

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
        <Card className="w-full">
            <CardContent className="p-6">
                <div
                    className={`relative border-4 border-dashed rounded-2xl p-8 transition-all duration-300 ${dragActive
                        ? 'border-indigo-400 bg-indigo-50 scale-[1.02] rotate-1'
                        : 'border-indigo-200 bg-slate-50/50 hover:border-indigo-300 hover:bg-slate-50'
                        } ${isProcessing ? 'opacity-50 pointer-events-none' : 'cursor-pointer group'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={handleClick}
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
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-full max-w-md aspect-square rounded-xl overflow-hidden shadow-lg border-4 border-white rotate-2 transform hover:rotate-0 transition-transform duration-500">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setPreview(null);
                                    onImageSelect(null, null);
                                }}
                                disabled={isProcessing}
                                className="rounded-full border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 font-bold"
                            >
                                <Upload className="mr-2 h-4 w-4" />
                                Upload Different Image
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-6 text-center py-4">
                            <div className="p-5 rounded-full bg-indigo-100 text-indigo-500 shadow-sm transform -rotate-6 group-hover:rotate-6 transition-transform duration-300 border-4 border-white">
                                <ImageIcon className="h-10 w-10" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-3xl font-bold font-hand text-slate-700 tracking-wide rotate-1">
                                    Upload Your Selfie
                                </p>
                                <p className="text-sm font-medium text-slate-500">
                                    Drag and drop or click to browse
                                </p>
                            </div>
                            <Button variant="default" size="lg" type="button" className="rounded-full bg-indigo-600 hover:bg-indigo-700 font-bold shadow-md hover:scale-105 transition-transform">
                                <Upload className="mr-2 h-5 w-5" />
                                Pick a Photo
                            </Button>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pt-2 opacity-60">
                                JPG, PNG, WEBP (Max 10MB)
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ImageUpload;

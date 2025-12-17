import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '../components/ui/card';

/**
 * CanvasOverlay Component
 * Renders the user's image with the selected hairstyle overlay.
 * 
 * LOGIC UPDATE:
 * 1. Uses explicit MediaPipe landmarks for accurate face width:
 *    - Left Cheek: 234
 *    - Right Cheek: 454
 * 2. Uses Landmark 10 (Forehead Top) as the primary anchor.
 * 3. Applies a base 2.2x multiplier for realistic volume + Manual Scale.
 */
const CanvasOverlay = ({ imageData, hairstyleUrl, landmarks, manualScale, manualX, manualY, manualRotation }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!imageData || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Load and draw the base image
        const baseImage = new Image();
        baseImage.onload = () => {
            // Set canvas dimensions
            canvas.width = baseImage.width;
            canvas.height = baseImage.height;

            // Draw base image
            ctx.drawImage(baseImage, 0, 0);

            // If hairstyle and landmarks are available, overlay the hairstyle
            if (hairstyleUrl && landmarks) {
                const hairImage = new Image();
                hairImage.crossOrigin = 'anonymous';

                hairImage.onload = () => {
                    const { forehead, imageWidth, imageHeight, allLandmarks } = landmarks;

                    // 1. Calculate Face Angle (Rotation)
                    let rotationAngle = 0;
                    if (allLandmarks && allLandmarks.length > 0) {
                        const leftEye = allLandmarks[33];
                        const rightEye = allLandmarks[263];

                        if (leftEye && rightEye) {
                            const dy = (rightEye.y - leftEye.y) * imageHeight;
                            const dx = (rightEye.x - leftEye.x) * imageWidth;
                            rotationAngle = Math.atan2(dy, dx);
                        }
                    }

                    // 2. Determine Anchor and Dimensions using Specific Landmarks
                    let foreheadX = 0;
                    let foreheadY = 0;
                    let faceWidth = 0;

                    // Check if we have the specific points required
                    if (allLandmarks && allLandmarks[10] && allLandmarks[234] && allLandmarks[454]) { // 10=Forehead, 234=LeftCheek, 454=RightCheek
                        // Anchor: Forehead Top (10)
                        foreheadX = allLandmarks[10].x * imageWidth;
                        foreheadY = allLandmarks[10].y * imageHeight;

                        // Width: Cheek to Cheek
                        const leftCheekX = allLandmarks[234].x * imageWidth;
                        const rightCheekX = allLandmarks[454].x * imageWidth;
                        faceWidth = Math.abs(rightCheekX - leftCheekX);
                    } else {
                        // Safe Fallback (if using mock detector or partial data)
                        foreheadX = forehead.top.x * imageWidth;
                        foreheadY = forehead.top.y * imageHeight;
                        faceWidth = Math.abs(forehead.right.x - forehead.left.x) * imageWidth;
                    }

                    // 3. Scale Logic
                    // User Rule: 2.2x multiplier for volume
                    const baseMultiplier = 2.2;
                    // Apply Manual Adjustment
                    const finalScale = baseMultiplier * (manualScale || 1);

                    const hairWidth = faceWidth * finalScale;

                    // Maintain Aspect Ratio
                    const aspectRatio = hairImage.width / hairImage.height;
                    const hairHeight = hairWidth / aspectRatio;

                    // 4. Draw with Transformations
                    ctx.save();

                    // Translate to Anchor (Forehead)
                    ctx.translate(foreheadX, foreheadY);

                    // Apply Rotation: Base Angle + Manual Adjustment
                    const manualRotRad = ((manualRotation || 0) * Math.PI) / 180;
                    ctx.rotate(rotationAngle + manualRotRad);

                    // 5. Shadow Removed (Per User Request for better blending)
                    /* 
                    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
                    ctx.shadowBlur = 15;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 8;
                    */

                    // 6. Positioning Logic
                    // Center Horizontal relative to anchor
                    const xOffset = (-hairWidth / 2) + (manualX || 0);

                    // Vertical Offset
                    // Goal: "Offset slightly upwards so it sits naturally on hairline"
                    // -0.65 shifts the image up so the bottom bang area hits the anchor point
                    const yOffset = (-hairHeight * 0.65) + (manualY || 0);

                    ctx.drawImage(hairImage, xOffset, yOffset, hairWidth, hairHeight);

                    ctx.restore();
                };

                hairImage.onerror = () => {
                    console.error('Failed to load hairstyle image');
                };

                hairImage.src = hairstyleUrl;
            }
        };

        baseImage.src = imageData;
    }, [imageData, hairstyleUrl, landmarks, manualScale, manualX, manualY, manualRotation]);

    return (
        <Card className="w-full">
            <CardContent className="p-6">
                <div className="flex justify-center">
                    <div className="relative rounded-lg overflow-hidden shadow-2xl max-w-2xl">
                        <canvas
                            ref={canvasRef}
                            className="w-full h-auto"
                            style={{ maxHeight: '600px', objectFit: 'contain' }}
                        />
                        {!hairstyleUrl && landmarks && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                                <p className="text-white text-lg font-semibold">
                                    Select a hairstyle to preview
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CanvasOverlay;

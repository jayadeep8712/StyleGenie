import { useEffect, useRef, useState } from 'react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import { calculateFaceShape, calculateGender } from '../lib/faceMath'; // Import Math Utility

/**
 * FaceDetector Component (Restored Real Implementation)
 * Uses MediaPipe Face Landmarker to detect facial features.
 * Includes improved loading logic and error handling.
 */
const FaceDetector = ({ imageData, onLandmarksDetected, onError }) => {
    const [isLoading, setIsLoading] = useState(true);
    const faceLandmarkerRef = useRef(null);
    const hasDetectedRef = useRef(false); // Prevent multiple detections
    const isInitializingRef = useRef(false); // Prevent double init in StrictMode

    // Initialize MediaPipe Face Landmarker
    useEffect(() => {
        const initializeFaceLandmarker = async () => {
            if (isInitializingRef.current || faceLandmarkerRef.current) return;
            isInitializingRef.current = true;

            try {
                console.log('Initializing MediaPipe Face Landmarker...');

                const vision = await FilesetResolver.forVisionTasks(
                    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
                );

                faceLandmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
                    baseOptions: {
                        modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
                        delegate: "GPU"
                    },
                    outputFaceBlendshapes: true,
                    runningMode: "IMAGE",
                    numFaces: 1
                });

                console.log('Face Landmarker initialized successfully');
                setIsLoading(false);
            } catch (error) {
                console.error('Failed to initialize Face Landmarker:', error);
                isInitializingRef.current = false;
                onError?.('Failed to load face detector. Please refresh and try again.');
                setIsLoading(false);
            }
        };

        initializeFaceLandmarker();
    }, []);

    // Reset detection flag when image changes
    useEffect(() => {
        hasDetectedRef.current = false;
    }, [imageData]);

    // Detect faces when image changes
    useEffect(() => {
        if (!imageData || !faceLandmarkerRef.current || isLoading || hasDetectedRef.current) return;

        const detectFace = async () => {
            try {
                console.log('Starting face detection...');
                const image = new Image();

                image.onload = () => {
                    if (!faceLandmarkerRef.current || hasDetectedRef.current) return;

                    const results = faceLandmarkerRef.current.detect(image);

                    if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                        hasDetectedRef.current = true; // Mark as detected
                        console.log('Face detected!');
                        const landmarks = results.faceLandmarks[0];

                        // Extract relevant points for hairstyle overlay
                        // MediaPipe Face Mesh Keypoints:
                        // 10: Top of forehead, 152: Chin, 234: Left cheek, 454: Right cheek

                        // NEW: Calculate Face Geometry & Gender
                        const geometry = calculateFaceShape(landmarks, image.width, image.height);
                        const genderAnalysis = calculateGender(landmarks, image.width, image.height);
                        console.log('Calculated Face Geometry:', geometry);
                        console.log('Estimated Gender:', genderAnalysis);

                        // Merge for passing up
                        geometry.gender = genderAnalysis.gender;
                        geometry.genderScore = genderAnalysis.score;

                        const landmarkData = {
                            forehead: {
                                top: landmarks[10],
                                left: landmarks[338], // Alternative left forehead
                                right: landmarks[109] // Alternative right forehead
                            },
                            chin: landmarks[152],
                            cheeks: {
                                left: landmarks[234],
                                right: landmarks[454]
                            },
                            imageWidth: image.width,
                            imageHeight: image.height,
                            allLandmarks: landmarks,
                            // Pass geometric analysis up
                            geometry: geometry
                        };

                        onLandmarksDetected?.(landmarkData);
                    } else {
                        console.warn('No face detected in image');
                        onError?.('No face detected. Please upload a clear selfie.');
                    }
                };

                image.onerror = () => {
                    console.error('Failed to load image for detection');
                    onError?.('Failed to process image.');
                };

                image.src = imageData;
            } catch (error) {
                console.error('Error during face detection:', error);
                onError?.('Error analyzing face. Please try another photo.');
            }
        };

        detectFace();
    }, [imageData, isLoading]); // Removed callback deps to prevent loops

    return null; // Logic-only component
};

export default FaceDetector;


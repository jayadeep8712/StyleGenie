import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Analyzes a face image and returns hairstyle recommendations
 * @param {File} imageFile - The uploaded image file
 * @param {Object} landmarks - Face landmarks from MediaPipe
 * @returns {Promise<Object>} - Recommendations from Gemini AI
 */
export const analyzeFace = async (imageFile, landmarks, geometry) => {
    try {
        const formData = new FormData();
        // Append JSON data BEFORE the file to ensure Multer processes it correctly
        if (geometry) {
            formData.append('geometry', JSON.stringify(geometry));
        }
        formData.append('image', imageFile);
        formData.append('landmarks', JSON.stringify(landmarks));

        const response = await apiClient.post('/api/analyze-face', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error analyzing face:', error);
        throw new Error(
            error.response?.data?.error || 'Failed to analyze face. Please try again.'
        );
    }
};

/**
 * Health check endpoint
 */
export const checkHealth = async () => {
    try {
        const response = await apiClient.get('/health');
        return response.data;
    } catch (error) {
        console.error('Health check failed:', error);
        return { status: 'error' };
    }
};

export default apiClient;

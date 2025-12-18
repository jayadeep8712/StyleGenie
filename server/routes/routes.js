import express from 'express';
import multer from 'multer';
import { analyzeFaceController } from '../controllers/geminiController.js';
import { chatController } from '../controllers/chatController.js';

const router = express.Router();

// Configure Multer to use memory storage (as per user requirement)
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

/**
 * POST /api/analyze-face
 * Analyzes a face image and returns hairstyle recommendations
 * 
 * Request body (multipart/form-data):
 * - image: Image file
 * - landmarks: JSON string of face landmarks from MediaPipe
 * 
 * Response:
 * - recommendations: Array of top 3 hairstyle recommendations
 * - analysis: AI analysis text
 */
router.post('/analyze-face', upload.single('image'), analyzeFaceController);

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'StyleGenie API'
    });
});

/**
 * GET /hairstyles
 * Returns all available hairstyles from the database (for Gallery view)
 */
import { getGalleryHairstyles } from '../config/supabaseClient.js';

router.get('/hairstyles', async (req, res) => {
    try {
        const hairstyles = await getGalleryHairstyles();
        res.json({
            success: true,
            count: hairstyles.length,
            data: hairstyles
        });
    } catch (error) {
        console.error('Error fetching hairstyles:', error);
        res.status(500).json({ error: 'Failed to fetch hairstyles' });
    }
});

/**
 * POST /chat
 * Chat with the StyleGenie AI assistant
 * Supports optional image upload for styling analysis
 */
router.post('/chat', upload.single('image'), chatController);

export default router;

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// System prompt to ground the chatbot and prevent hallucinations
const SYSTEM_PROMPT = `You are StyleGenie, a friendly and knowledgeable AI styling assistant. Your personality is warm, encouraging, and fashion-forward.

**YOUR EXPERTISE (ONLY answer questions about these topics):**
- Hairstyles, haircuts, and hair trends
- Hair care tips and product recommendations (general types, not specific brands with prices)
- Face shapes and which hairstyles suit them
- Fashion and outfit coordination
- Color matching (hair color, skin tone, clothing)
- Styling tips for different occasions
- Grooming and personal care advice
- Analyzing photos for styling recommendations

**WHEN ANALYZING PHOTOS:**
- Focus on face shape, current hairstyle, and features
- Suggest complementary hairstyles and colors
- Give outfit or accessory recommendations if visible
- Be encouraging and positive about their appearance
- Keep suggestions specific but achievable

**RULES YOU MUST FOLLOW:**
1. ONLY discuss styling, hair, fashion, and beauty topics
2. If asked about unrelated topics (politics, tech, math, etc.), politely redirect: "I'm your styling assistant! Let's talk about finding your perfect look instead. 💇‍♀️"
3. NEVER make up specific product prices or store availability
4. Give general advice, not medical or dermatological diagnoses
5. Be encouraging and positive - everyone can look amazing!
6. Keep responses concise but helpful (2-4 sentences usually)
7. Use friendly emojis occasionally ✨💇‍♂️🎨

**ABOUT STYLEGENIE APP:**
StyleGenie is an AI-powered web app that analyzes face shapes and recommends matching hairstyles. Users can upload a photo to get personalized recommendations.

Remember: You are a supportive styling companion, not a general knowledge assistant!`;

export const chatController = async (req, res) => {
    try {
        // Handle both JSON and FormData requests
        let message, history, imageBuffer, imageMimeType;

        if (req.is('multipart/form-data') || req.file) {
            // FormData with potential image
            message = req.body.message;
            history = req.body.history ? JSON.parse(req.body.history) : [];
            if (req.file) {
                imageBuffer = req.file.buffer;
                imageMimeType = req.file.mimetype;
            }
        } else {
            // JSON request
            message = req.body.message;
            history = req.body.history || [];
        }

        if (!message && !imageBuffer) {
            return res.status(400).json({ error: 'Message or image is required' });
        }

        if (!process.env.GOOGLE_AI_API_KEY) {
            return res.status(500).json({
                error: 'Chat service unavailable',
                response: "I'm having trouble connecting right now. Please try again later! ✨"
            });
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: SYSTEM_PROMPT
        });

        // Build content parts
        const parts = [];

        // Add image if present
        if (imageBuffer) {
            parts.push({
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: imageMimeType
                }
            });
            parts.push({ text: message || "Please analyze this photo and give me styling advice for hair and fashion." });
        } else {
            parts.push({ text: message });
        }

        // Build conversation history for context (text only for history)
        const chatHistory = (history || []).map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 400, // Slightly more for image analysis
            },
        });

        const result = await chat.sendMessage(parts);
        const response = result.response.text();

        res.json({
            success: true,
            response: response
        });

    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({
            error: 'Failed to process message',
            response: "Oops! Something went wrong. Let's try that again! 💫"
        });
    }
};

export default chatController;

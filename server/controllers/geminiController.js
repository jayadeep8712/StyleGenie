import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { getAllHairstyles, queryHairstylesByFaceShape } from '../config/supabaseClient.js';

dotenv.config();

const apiKey = process.env.GOOGLE_AI_API_KEY;

/**
 * Smart Multimodal Controller
 * 1. Visual Analysis (Gemini Vision) - Prioritized
 * 2. Gender Filtering (Strict Code Enforcement)
 * 3. Fallback to Database Query if AI fails
 */
export async function analyzeFaceController(req, res) {
    // 1. Initialize Variables
    let detectedFaceShape = null; // Start null to see if detection works
    let detectedGender = 'Neutral';
    let clothingSuggestion = "Classic styles work well.";
    let isRealAI = false;
    let selectedRecommendations = [];

    console.log('--- STARTING FACE ANALYSIS ---');

    // 2. Parse Inputs
    const imageBuffer = req.file?.buffer;
    const geometryString = req.body.geometry;
    let mathHintShape = 'Unknown';

    // Debug Logs
    console.log("Input File Size:", imageBuffer ? imageBuffer.length : "NO FILE");

    if (geometryString) {
        try {
            const clientGeometry = JSON.parse(geometryString);
            console.log("📐 Math Hint Received:", clientGeometry);
            mathHintShape = clientGeometry.shape || 'Unknown';
        } catch (e) {
            console.warn("Failed to parse geometry JSON");
        }
    }

    if (!imageBuffer) return res.status(400).json({ error: 'No image provided' });

    // 3. Fetch Full Inventory for Context
    let allHairstyles = [];
    try {
        allHairstyles = await getAllHairstyles();
        console.log(`📚 Inventory loaded: ${allHairstyles.length} styles.`);
    } catch (e) {
        console.error("❌ DB Error:", e);
    }

    // ============================================================
    // STEP 4: REAL GEMINI AI ANALYSIS
    // ============================================================
    try {
        if (apiKey && allHairstyles.length > 0) {
            console.log('🧠 Asking Gemini 1.5 Flash...');
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                generationConfig: { temperature: 0 } // Zero temp for consistency
            });

            // Context for AI
            const inventoryContext = allHairstyles.map(h => ({
                id: h.id,
                name: h.name,
                gender: h.gender,
                tags: h.tags
            }));

            // THE UPDATED PROMPT (Fixes the "Oval" issue)
            const prompt = `
                You are an expert virtual hair stylist.
                
                INPUT DATA:
                1. IMAGE: Analyze the uploaded face visually. Look at jawline, cheekbones, and forehead.
                2. MATH HINT: A basic algorithm suggested the shape might be: "${mathHintShape}".

                INSTRUCTIONS:
                1. LOOK at the image. 
                2. If the image clearly looks Square, Round, Heart, or Diamond, but the "Math Hint" says Oval -> **IGNORE THE MATH AND TRUST YOUR VISUAL ANALYSIS.**
                3. Determine the GENDER (Male or Female) based on the image.
                4. Select the TOP 3 most suitable hairstyles from the INVENTORY list below.

                STRICT SELECTION RULES:
                - You must return 3 IDs from the inventory.
                - Do not hallucinate IDs.

                INVENTORY:
                ${JSON.stringify(inventoryContext)}

                Return strictly valid JSON:
                {
                    "faceShape": "string (The shape YOU see visually)",
                    "gender": "Male | Female",
                    "clothingSuggestion": "string (Short generic advice)",
                    "outfit_suggestions": [
                        { "style": "Casual", "description": "e.g., White tee and denim", "colors": ["White", "Navy"] },
                        { "style": "Formal", "description": "e.g., Charcoal Suit", "colors": ["Grey", "Black"] }
                    ],
                    "selectedIds": [integer, integer, integer], 
                    "reasoning": ["string", "string", "string"]
                }
            `;

            const imagePart = {
                inlineData: {
                    data: imageBuffer.toString('base64'),
                    mimeType: req.file.mimetype,
                },
            };

            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Clean Markdown
            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiData = JSON.parse(cleanedText);

            console.log("🤖 AI Raw Result:", aiData);

            if (aiData.selectedIds) {
                // Update Globals from AI
                detectedFaceShape = aiData.faceShape;
                detectedGender = aiData.gender;
                clothingSuggestion = aiData.clothingSuggestion;

                // --- STRICT CODE-LEVEL FILTERING (Fixes the Gender issue) ---
                const aiGenderNormalized = aiData.gender.toLowerCase();

                selectedRecommendations = aiData.selectedIds.map((id, index) => {
                    const original = allHairstyles.find(h => h.id === id);
                    if (!original) return null;

                    // Check Gender Match
                    const itemGender = original.gender ? original.gender.toLowerCase() : 'unisex';
                    const isMatch = (itemGender === aiGenderNormalized) || (itemGender === 'unisex');

                    if (!isMatch) {
                        console.warn(`❌ FILTERED: AI picked '${original.name}' (${itemGender}) for ${aiGenderNormalized} user.`);
                        return null; // Remove it
                    }

                    return {
                        ...original,
                        name: original.name.replace(/ [MF]$/i, '').trim(),
                        explanation: aiData.reasoning?.[index] || "AI Recommended"
                    };
                }).filter(Boolean); // Clear nulls

                if (selectedRecommendations.length > 0) {
                    isRealAI = true;
                } else {
                    console.warn("⚠️ AI worked, but gender filter removed all results. Falling to Hybrid.");
                }
            }
        }
    } catch (aiError) {
        console.error('⚠️ Gemini Analysis Failed:', aiError.message);
    }

    // ============================================================
    // STEP 5: HYBRID FALLBACK (Smart DB Query)
    // ============================================================
    if (selectedRecommendations.length === 0) {
        console.log('🔄 Using Hybrid Fallback...');
        try {
            // Use AI detected gender if available, otherwise simulate
            let genderToQuery = detectedGender;
            if (!genderToQuery || genderToQuery === 'Neutral') {
                const genders = ['Male', 'Female'];
                genderToQuery = genders[Math.floor(Math.random() * genders.length)];
                detectedGender = genderToQuery + " (Simulated)";
            }

            // Use AI detected shape if available, otherwise use Math hint, otherwise Random
            if (!detectedFaceShape) {
                detectedFaceShape = (mathHintShape !== 'Unknown') ? mathHintShape : 'Oval';
            }

            console.log(`Querying DB -> Shape: ${detectedFaceShape}, Gender: ${genderToQuery}`);

            selectedRecommendations = await queryHairstylesByFaceShape([detectedFaceShape.toLowerCase()], genderToQuery);

            selectedRecommendations = selectedRecommendations.slice(0, 3).map(s => ({
                ...s,
                name: s.name.replace(/ [MF]$/i, '').trim(),
                explanation: `Best fit for ${detectedFaceShape} face shape.`
            }));

        } catch (dbError) {
            console.error('Hybrid Query Failed:', dbError);
        }
    }

    // ============================================================
    // STEP 6: FINAL SYSTEM FALLBACK (Hardcoded)
    // ============================================================
    if (selectedRecommendations.length === 0) {
        console.warn('🚨 Using Hardcoded Fallback data');
        detectedFaceShape = detectedFaceShape || "Oval";
        selectedRecommendations = [
            {
                id: 999,
                name: 'Classic Taper',
                image_url: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033',
                tags: ['short', 'classic'],
                explanation: 'Universal style.',
                clothingSuggestion: "Casual fits."
            }
        ];
    }

    // 7. Return Response
    return res.json({
        success: true,
        recommendations: selectedRecommendations,
        analysis: `Face Shape: **${detectedFaceShape}**`,
        gender: detectedGender,
        clothingSuggestion: clothingSuggestion,
        outfitSuggestions: aiData?.outfit_suggestions || [
            { style: "Casual", description: "Classic t-shirt and jeans", colors: ["Blue", "White"] },
            { style: "Formal", description: "Standard business attire", colors: ["Grey", "Black"] }
        ],
        source: isRealAI ? 'Gemini AI (Visual)' : 'Hybrid Logic'
    });
}

export default { analyzeFaceController };

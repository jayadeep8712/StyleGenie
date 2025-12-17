// server/sync-assets.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

// --- CONFIG ---
// NOTE: Using SUPABASE_ANON_KEY as verified in checking server/config/supabaseClient.js
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
// We stick to the standard model name; if it fails, our catch block handles it.
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const BUCKET_NAME = 'hairstyle-assets';
// --- END CONFIG ---

async function syncAssets() {
    console.log(`🚀 Starting AI-Powered Asset Sync from bucket: "${BUCKET_NAME}"...`);

    // 1. Get all files from Supabase Storage
    const { data: files, error } = await supabase.storage.from(BUCKET_NAME).list();
    if (error) {
        console.error(`Could not list files: ${error.message}`);
        return;
    }
    console.log(`📂 Found ${files?.length || 0} files in storage bucket.`);
    if (!files || files.length === 0) {
        console.log("Bucket is empty or not found. Nothing to sync.");
        return;
    }

    for (const file of files) {
        if (file.name.includes('.emptyFolderPlaceholder')) continue;

        // 2. Extract Gender from Filename
        let gender = 'unisex'; // Default
        if (file.name.toLowerCase().includes('-m')) gender = 'male';
        if (file.name.toLowerCase().includes('-f')) gender = 'female';

        // 3. Check if exists (by filename or publicUrl)
        const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(file.name);

        // We check by Name OR ImageURL to be safe
        const { data: existing } = await supabase.from('hair_assets')
            .select('id')
            .or(`image_url.eq.${publicUrl},name.eq.${file.name}`)
            .maybeSingle();

        if (existing) {
            console.log(`⏩ Skipping ${file.name} (already in DB)`);
            continue;
        }

        console.log(`\n✨ Processing [${gender.toUpperCase()}] asset: ${file.name}`);

        try {
            // Get Image Buffer (required for Gemini)
            const imageResponse = await fetch(publicUrl);
            const buffer = await imageResponse.arrayBuffer();
            const mimeType = file.metadata?.mimetype || 'image/png';

            const imagePart = {
                inlineData: { data: Buffer.from(buffer).toString('base64'), mimeType: mimeType },
            };

            let metadata;

            // 4. Try AI Generation
            try {
                const prompt = `
                  You are an expert hairstylist. This hairstyle is for a '${gender}' presentation.
                  Analyze the image and return ONLY a valid JSON object (NO MARKDOWN) with:
                  {
                    "name": "Creative Name",
                    "tags": ["short", "long", "curly", "straight", "formal", "casual"],
                    "face_shape_match": ["oval", "round", "square", "heart", "oblong"],
                    "description": "Short description."
                  }
                `;

                const result = await model.generateContent([prompt, imagePart]);
                const text = result.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
                metadata = JSON.parse(text);
                console.log(`  🤖 AI Generated: "${metadata.name}"`);

            } catch (aiError) {
                console.warn(`  ⚠️ AI Failed (${aiError.message}). Using Fallback Metadata.`);

                // FALLBACK LOGIC
                const cleanName = file.name
                    .replace(/-/g, ' ')
                    .replace(/_/g, ' ')
                    .replace(/\.[^/.]+$/, "") // remove extension
                    .replace(/\b\w/g, l => l.toUpperCase()); // Title Case

                metadata = {
                    name: cleanName,
                    image_url: publicUrl,
                    gender: gender,
                    tags: ['classic', 'everyday', gender],
                    face_shape_match: ['oval', 'round', 'square', 'heart'], // Broad match
                    description: `A classic ${gender} style verified by StyleGenie.`
                };
            }

            // 5. Insert into DB
            const { error: insertError } = await supabase.from('hair_assets').insert({
                name: metadata.name,
                image_url: publicUrl,
                gender: gender,
                tags: metadata.tags,
                face_shape_match: metadata.face_shape_match,
                description: metadata.description
            });

            if (insertError) throw insertError;
            console.log(`  ✅ Saved to DB: "${metadata.name}"`);

        } catch (err) {
            console.error(`  ❌ Critical Error for ${file.name}:`, err.message);
        }
    }
    console.log("\n🎉 Database sync complete!");
}

syncAssets();

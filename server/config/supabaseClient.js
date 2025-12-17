import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in environment variables');
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Query hairstyles from the database based on face shape AND gender
 * @param {string[]} faceShapes - Array of face shapes to match
 * @param {string} [targetGender] - Optional gender to filter by ('male' or 'female')
 * @returns {Promise<Array>} - Array of matching hairstyles
 */
export async function queryHairstylesByFaceShape(faceShapes, targetGender) {
    try {
        let query = supabase
            .from('hair_assets')
            .select('*')
            .overlaps('face_shape_match', faceShapes);

        if (targetGender) {
            // Filter: (gender == target) OR (gender == 'unisex')
            // Note: Supabase 'or' syntax inside a filter is tricky, so we use the .or() modifier carefully
            // Actually, simplest is to just rely on the column being correct. 
            // Let's use the 'in' filter for simplicity: gender IN (target, 'unisex')
            const validGenders = [targetGender.toLowerCase(), 'unisex'];
            query = query.in('gender', validGenders);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Supabase query error:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error querying hairstyles:', error);
        throw error;
    }
}

/**
 * Get all hairstyles from the database (for AI to select from)
 * @returns {Promise<Array>} - Array of all hairstyles
 */
export async function getAllHairstyles() {
    try {
        const { data, error } = await supabase
            .from('hair_assets')
            .select('*')
            .limit(20); // Limit to 20 for prompt context window efficiency

        if (error) {
            console.error('Supabase query error:', error);
            throw error;
        }

        return data || [];
    } catch (error) {
        console.error('Error fetching hairstyles:', error);
        throw error;
    }
}

/**
 * Get ALL hairstyles for the Gallery Grid (No limit)
 * @returns {Promise<Array>}
 */
export async function getGalleryHairstyles() {
    try {
        const { data, error } = await supabase
            .from('hair_assets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching gallery:', error);
        throw error;
    }
}

export default supabase;

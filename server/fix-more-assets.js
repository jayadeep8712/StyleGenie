import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fixMoreAssets() {
    console.log('--- Fixing Misclassified Assets ---');

    const assetsToFix = [
        'Textured Faux Hawk',
        'Side Swept Fringe'
    ];

    for (const namePattern of assetsToFix) {
        // 1. Find
        const { data: assets, error: findError } = await supabase
            .from('hair_assets')
            .select('*')
            .ilike('name', `%${namePattern}%`);

        if (findError || !assets.length) {
            console.log(`❌ Asset not found: ${namePattern}`);
            continue;
        }

        const asset = assets[0];
        console.log(`Found: ${asset.name} (Gender: ${asset.gender})`);

        // 2. Prepare Match
        let newTags = asset.tags.filter(t => t.toLowerCase() !== 'female');
        if (!newTags.includes('male')) newTags.push('male');

        // 3. Update
        const { error: updateError } = await supabase
            .from('hair_assets')
            .update({
                gender: 'male',
                tags: newTags
            })
            .eq('id', asset.id);

        if (updateError) {
            console.error(`Failed to update ${asset.name}:`, updateError);
        } else {
            console.log(`✅ Fixed ${asset.name} -> Male`);
        }
    }
}

fixMoreAssets();

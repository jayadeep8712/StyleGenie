import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function fixAsset() {
    console.log('--- Fixing Asset Gender ---');

    // 1. Find the Asset
    const { data: assets, error: findError } = await supabase
        .from('hair_assets')
        .select('*')
        .ilike('name', '%French Crop%');

    if (findError || !assets.length) {
        console.error('Asset not found or error:', findError);
        return;
    }

    const asset = assets[0];
    console.log(`Found asset: ${asset.name} (ID: ${asset.id})`);
    console.log(`Current Gender: ${asset.gender}`);
    console.log(`Current Tags:`, asset.tags);

    // 2. Prepare Updates
    let newTags = asset.tags.filter(t => t.toLowerCase() !== 'female');
    if (!newTags.includes('male')) newTags.push('male');

    // 3. Update
    const { data: updated, error: updateError } = await supabase
        .from('hair_assets')
        .update({
            gender: 'male',
            tags: newTags
        })
        .eq('id', asset.id)
        .select();

    if (updateError) {
        console.error('Update failed:', updateError);
    } else {
        console.log('✅ Asset updated successfully!');
        console.log('New Gender:', updated[0].gender);
        console.log('New Tags:', updated[0].tags);
    }
}

fixAsset();

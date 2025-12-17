// server/debug-db.js
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Use ANON key for public access check
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function debugSupabase() {
    console.log("🔍 Debugging Supabase Data (Deep Scan)...");

    // 1. Check Table Count
    const { count, error: tableError } = await supabase
        .from('hair_assets')
        .select('*', { count: 'exact', head: true });

    if (tableError) {
        console.error("❌ Table Check Failed:", tableError.message);
    } else {
        console.log(`📊 'hair_assets' Table Row Count: ${count}`);
    }

    // 2. Check Storage Buckets
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
        console.error("❌ Bucket List Failed:", bucketError.message);
    } else {
        console.log(`🗂️ FOUND BUCKETS:`, buckets ? buckets.map(b => b.name) : 'None');

        if (buckets) {
            for (const bucket of buckets) {
                const { data: files, error: fileError } = await supabase.storage.from(bucket.id).list();
                if (fileError) {
                    console.log(`   ❌ Could not list files in '${bucket.name}'`);
                } else {
                    console.log(`   📂 Bucket '${bucket.name}' (ID: ${bucket.id}) File Count: ${files ? files.length : 0}`);
                    if (files && files.length > 0) {
                        console.log(`      Example: ${files[0].name}`);
                    }
                }
            }
        }
    }
}

debugSupabase();

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkData() {
    console.log('--- Checking Database Content ---');
    console.log('URL:', process.env.SUPABASE_URL);

    // 1. Check Row Count
    const { count, error: countError } = await supabase
        .from('hair_assets')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting rows:', countError);
    } else {
        console.log(`Row count in 'hair_assets': ${count}`);
    }

    // 2. Fetch Sample
    const { data, error: dataError } = await supabase
        .from('hair_assets')
        .select('id, name, gender, tags')
        .limit(3);

    if (dataError) {
        console.error('Error fetching sample:', dataError);
    } else {
        console.log('Sample Data:', JSON.stringify(data, null, 2));
    }
}

checkData();

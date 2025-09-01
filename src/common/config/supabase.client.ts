import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

' console.log(process.env.SUPABASE_SERVICE_ROLE_KEY) '

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.log(supabaseUrl, supabaseKey)
   throw new Error('Faltan variables de entorno de Supabase');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
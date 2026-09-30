import { createClient } from '@supabase/supabase-js';
import { triggerRestore } from './db-wake.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabase = null;

if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        fetch: async (url, options) => {
          try {
            const res = await fetch(url, options);
            if (!res.ok && res.status >= 500) triggerRestore();
            return res;
          } catch (err) {
            triggerRestore();
            throw err;
          }
        },
      },
    });
  } catch (e) {
    console.warn('Could not initialize Supabase client:', e?.message || e);
  }
}

export default supabase;

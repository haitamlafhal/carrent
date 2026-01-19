import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// ⚠️ REPLACE WITH YOUR PROJECT DETAILS FROM supabase.com
const SUPABASE_URL = 'https://ocdcobvfbenhvdjcltqu.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kIOg63LwHw2PpY8ChXGH6Q_yiWaIt-Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: {
            getItem: (key) => {
                // In Expo, we'd typically use AsyncStorage here, but for now we'll keep it simple
                // or add AsyncStorage later if persistent auth session is needed.
                // For secure storage, 'expo-secure-store' is better.
                return null;
            },
            setItem: (key, value) => { },
            removeItem: (key) => { },
        },
        autoRefreshToken: true,
        persistSession: true, // Set to false if no storage provided
        detectSessionInUrl: false,
    },
});

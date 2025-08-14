import 'react-native-url-polyfill/auto';
import { MMKV } from 'react-native-mmkv';
import { createClient, processLock } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Initialize MMKV instance
const mmkv = new MMKV();

// Structured logger for better debugging
export const logger = {
  info: (message: string, ...args: any[]) =>
    __DEV__ && console.log(`[Supabase] ${message}, ...args`),
  error: (message: string, ...args: any[]) =>
    console.error(`[Supabase] ${message}, ...args`),
};

// Custom storage interface for Supabase
interface SupabaseStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

// Custom MMKV storage adapter for Supabase
const mmkvStorage: SupabaseStorage = {
  getItem: (key: string) => {
    const value = mmkv.getString(key);
    logger.info(`Retrieving item from MMKV: ${key}`);
    return value ?? null; // Return null if undefined to match Supabase expectations
  },
  setItem: (key: string, value: string) => {
    mmkv.set(key, value);
    logger.info(`Setting item in MMKV: ${key}`);
  },
  removeItem: (key: string) => {
    mmkv.delete(key);
    logger.info(`Removing item from MMKV: ${key}`);
  },
};

// Supabase client configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

/**
 * Supabase client instance
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: mmkvStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

// Handle app state changes for auto-refresh
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    logger.info('App is active, starting auto-refresh');
    supabase.auth.startAutoRefresh();
  } else {
    logger.info('App is inactive, stopping auto-refresh');
    supabase.auth.stopAutoRefresh();
  }
});

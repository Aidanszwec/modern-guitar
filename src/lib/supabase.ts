import { createClient } from '@supabase/supabase-js';
import type { PostgrestError } from '@supabase/postgrest-js';

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging
console.log('Supabase URL exists:', !!supabaseUrl);
console.log('Supabase Key exists:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    db: { schema: 'public' },
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

// Enhanced logging function
interface ErrorWithDetails extends Error {
  code?: string;
  details?: string;
  hint?: string;
}

const logError = (context: string, error: ErrorWithDetails) => {
  console.error(`[Supabase Error - ${context}]`, {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint,
    stack: error.stack
  });
};

// Check if beta_signups table exists
const createBetaSignupsTable = async () => {
  try {
    console.log('Checking if beta_signups table exists');

    // Query the table
    const { error: queryError } = await supabase
      .from('beta_signups')
      .select('id')
      .limit(1);

    if (!queryError) {
      console.log('beta_signups table already exists');
      return;
    }

    console.log('beta_signups table does not exist. Please create it in Supabase:');
    console.log(`
      Table Name: beta_signups
      Columns:
      - id: uuid (primary key)
      - name: text
      - email: text
      - genres: text[]
      - experience_level: text
      - favorite_artists: text[]
      - features_request: text
      - created_at: timestamptz (default: now())
    `);
  } catch (error) {
    if (error instanceof Error) {
      logError('Table Check', error);
    }
  }
};

export interface UserSignupData {
  name: string;
  email: string;
  genres: string[];
  experienceLevel: string;
  favoriteArtists: string[];
  featuresRequest?: string;
}

export async function addUserSignup(userData: UserSignupData) {
  try {
    if (!userData.name || userData.name.trim() === '') {
      throw new Error('Name is required and cannot be empty');
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      throw new Error('Valid email is required');
    }

    const sanitizedData = {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      genres: Array.isArray(userData.genres) ? userData.genres : [],
      experience_level: userData.experienceLevel || '',
      favorite_artists: Array.isArray(userData.favoriteArtists) ? userData.favoriteArtists : [],
      features_request: userData.featuresRequest || '',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('beta_signups')
      .insert(sanitizedData)
      .select();

    if (error) {
      logError('Insertion Error', error);
      if ((error as PostgrestError).code === '23505') {
        throw new Error('An account with this email already exists');
      }
      if ((error as PostgrestError).code === '23502') {
        throw new Error('Missing required field');
      }
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logError('Signup Error', error);
      throw error;
    }
  }
}

export { supabase };
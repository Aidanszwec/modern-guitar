import { createClient } from '@supabase/supabase-js';
import type { PostgrestError } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
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

// Create beta_signups table if it doesn't exist
const createBetaSignupsTable = async () => {
  try {
    console.log('Checking if beta_signups table exists');
    
    // Try to query the table
    const { error: queryError } = await supabase
      .from('beta_signups')
      .select('id')
      .limit(1);

    // If there's no error, table exists
    if (!queryError) {
      console.log('beta_signups table already exists');
      return;
    }

    // If table doesn't exist, create it through the dashboard
    console.log('beta_signups table does not exist. Please create it through the Supabase dashboard with the following structure:');
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

interface UserSignupData {
  name: string;
  email: string;
  genres: string[];
  experienceLevel: string;
  favoriteArtists: string[];
  featuresRequest?: string;
}

const addUserSignup = async (userData: UserSignupData) => {
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
      genres: userData.genres || [],
      experience_level: userData.experienceLevel || '',
      favorite_artists: userData.favoriteArtists || [],
      features_request: userData.featuresRequest || '',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('beta_signups')
      .insert(sanitizedData)
      .select();

    if (error) {
      if (error instanceof PostgrestError) {
        logError('Insertion Error', error);
        switch (error.code) {
          case '23505':
            throw new Error('An account with this email already exists');
          case '23502':
            throw new Error('Missing required fields');
          default:
            throw new Error(`Database insertion failed: ${error.message}`);
        }
      } else {
        throw error;
      }
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      logError('Signup Process', error);
      throw new Error(
        error.message 
      );
    } else {
      throw error;
    }
  }
};

// Initialize table check
createBetaSignupsTable().catch(error => {
  if (error instanceof Error) {
    console.error('Failed to check table existence:', error);
  }
});

// Export the initialized client
export default {
  client: supabase,
  addUserSignup
};
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL, 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
);

// Enhanced logging function
const logError = (context: string, error: any) => {
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
    console.log('Attempting to ensure beta_signups table exists');
    
    // First check if the table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('beta_signups')
      .select('id')
      .limit(1);

    if (checkError && checkError.code !== 'PGRST116') {
      // If error is not "relation does not exist", then it's a different issue
      throw checkError;
    }

    if (!existingTable) {
      // Table doesn't exist, create it
      const { error } = await supabase
        .from('beta_signups')
        .insert([]) // This will fail if table doesn't exist
        .select();

      if (error && error.code === 'PGRST204') {
        // Table doesn't exist, create it using RPC or direct SQL if you have permission
        const { error: createError } = await supabase.sql(`
          CREATE TABLE IF NOT EXISTS beta_signups (
            id SERIAL PRIMARY KEY,
            name TEXT,
            email TEXT,
            genres TEXT[],
            experience_level TEXT,
            favorite_artists TEXT[],
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
        `);

        if (createError) {
          console.error('Failed to create table:', createError);
          // Don't throw here, just log the error
        }
      }
    }
  } catch (error) {
    logError('Table Creation Catch', error);
    // Don't throw here, just log the error
  }
};

export const addUserSignup = async (userData: {
  name: string;
  email: string;
  genres: string[];
  experienceLevel: string;
  favoriteArtists: string[];
  featuresRequest?: string;
}) => {
  try {
    // Comprehensive input validation
    if (!userData.name || userData.name.trim() === '') {
      throw new Error('Name is required and cannot be empty');
    }

    if (!userData.email || !/\S+@\S+\.\S+/.test(userData.email)) {
      throw new Error('Valid email is required');
    }

    // Sanitize and prepare data
    const sanitizedData = {
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      genres: userData.genres || [],
      experience_level: userData.experienceLevel || '',
      favorite_artists: userData.favoriteArtists || [],
      features_request: userData.featuresRequest || '',
      created_at: new Date().toISOString()
    };

    console.log('Attempting to insert user data:', sanitizedData);

    // Perform the insert with detailed error handling
    const { data, error } = await supabase
      .from('beta_signups')
      .insert(sanitizedData)
      .select();

    if (error) {
      logError('Insertion Error', error);

      // Specific error handling
      switch (error.code) {
        case '23505': // Unique constraint violation
          throw new Error('An account with this email already exists');
        case '23502': // Not null violation
          throw new Error('Missing required fields');
        default:
          throw new Error(`Database insertion failed: ${error.message}`);
      }
    }

    console.log('User signup successful:', data);
    return data;
  } catch (error) {
    logError('Signup Process', error);
    
    // Rethrow with a user-friendly message
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred during signup. Please try again.'
    );
  }
};

// Ensure table exists on module import
createBetaSignupsTable().catch(error => {
  console.error('Failed to ensure table exists on import:', error);
});

export default { supabase, addUserSignup };
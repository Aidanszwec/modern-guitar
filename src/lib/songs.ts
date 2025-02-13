import { supabase } from './supabase';

export type Song = {
  id: number;
  title: string;
  artist: string;
  key: string;
  tempo: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  chord_progression: string[];
  youtube_url?: string;
  tabs?: string;
  notes?: string;
};

export async function getSongs() {
  try {
    console.log('Attempting to fetch songs...');
    
    const result = await supabase
      .from('songs')
      .select('*')
      .order('created_at', { ascending: false });
    
    console.log('Supabase query result:', result);

    if (result.error) {
      console.error('Supabase query error:', {
        message: result.error.message,
        details: result.error.details,
        hint: result.error.hint
      });
      throw result.error;
    }

    if (!result.data) {
      console.log('No data returned from Supabase');
      return [];
    }

    console.log('Successfully fetched songs:', result.data.length);
    return result.data as Song[];
  } catch (error) {
    console.error('Caught error in getSongs:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
}

export async function addSong(song: Omit<Song, 'id'>) {
  const { data, error } = await supabase
    .from('songs')
    .insert([song])
    .select()
    .single();

  if (error) throw error;
  return data as Song;
}

export async function updateSong(id: number, updates: Partial<Song>) {
  const { data, error } = await supabase
    .from('songs')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Song;
}

export async function deleteSong(id: number) {
  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
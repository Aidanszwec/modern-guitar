'use client';

import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import AddSongModal from '@/components/AddSongModal';
import { getSongs, addSong, type Song } from '@/lib/songs';

export default function TabsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadSongs();
  }, []);

  async function loadSongs() {
    try {
      const data = await getSongs();
      setSongs(data);
    } catch (error) {
      console.error('Error loading songs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddSong = async (songData: any) => {
    try {
      await addSong(songData);
      await loadSongs(); // Reload the songs list
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding song:', error);
    }
  };

  const filteredSongs = songs.filter(song => 
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black pt-20">
      <div className="container mx-auto px-4">
        {/* Search and Add Song Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Search songs..."
              className="w-full bg-gray-800 text-white px-4 py-2 pl-10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Song
          </button>
        </div>

        {/* Songs List */}
        {isLoading ? (
          <div className="text-center text-gray-400">Loading songs...</div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredSongs.map((song) => (
              <div
                key={song.id}
                className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <h3 className="text-xl font-semibold text-white">{song.title}</h3>
                <p className="text-gray-400">{song.artist}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                    Key: {song.key}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                    BPM: {song.tempo}
                  </span>
                  <span className="px-2 py-1 bg-gray-700 rounded text-sm text-gray-300">
                    {song.difficulty}
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-400">
                    Progression: {song.chord_progression.join(" → ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Song Modal */}
        <AddSongModal 
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddSong}
        />
      </div>
    </div>
  );
}
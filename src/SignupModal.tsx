"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGuitar, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { useSignup } from './context/SignupContext';
import { addUserSignup } from '@/lib/supabase'; 


const GENRES = [
  'Rock', 'Blues', 'Jazz', 'Classical', 
  'Metal', 'Folk', 'Country', 'Funk',
  'Pop', 'R&B', 'Soul', 'Electronic'
];

const EXPERIENCE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Professional'
];

const FAVORITE_ARTISTS = [
  'Jimi Hendrix', 'Eric Clapton', 'Jimmy Page', 'Eddie Van Halen',
  'Steve Vai', 'Joe Satriani', 'John Mayer', 'B.B. King',
  'Carlos Santana', 'David Gilmour', 'Slash', 'John Petrucci'
];

const SignupModal: React.FC = () => {
  const { isOpen, closeSignupModal, customFields } = useSignup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genres: [] as string[],
    experienceLevel: '',
    favoriteArtists: [] as string[],
    featuresRequest: '',
    style: { color: 'black' }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      style: { color: 'black' }
    }));
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const toggleArtist = (artist: string) => {
    setFormData(prev => ({
      ...prev,
      favoriteArtists: prev.favoriteArtists.includes(artist)
        ? prev.favoriteArtists.filter(a => a !== artist)
        : [...prev.favoriteArtists, artist]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    const validationErrors: string[] = [];

    if (!formData.name.trim()) {
      validationErrors.push('Please enter your name');
    }

    if (!formData.email.trim()) {
      validationErrors.push('Please enter your email');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (formData.genres.length === 0) {
      validationErrors.push('Please select at least one genre');
    }

    if (!formData.experienceLevel) {
      validationErrors.push('Please select your experience level');
    }

    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join('. '));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await addUserSignup({
        name: formData.name,
        email: formData.email,
        genres: formData.genres,
        experienceLevel: formData.experienceLevel,
        favoriteArtists: formData.favoriteArtists,
        featuresRequest: formData.featuresRequest
      });

      if (response) {
        setIsSuccess(true);
      }
    } catch (error) {
      if (error instanceof Error) {
        setSubmitError(error.message);
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 overflow-y-auto bg-black/75"
        >
          <div className="min-h-screen w-full px-4 py-6 flex items-start justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl relative mt-4"
            >
              <div className="bg-gradient-to-b from-gray-900/95 to-gray-900/90 backdrop-blur-md rounded-2xl shadow-2xl shadow-purple-500/10 overflow-hidden">
                <div className="sticky top-0 z-10 pt-4 px-4 bg-gradient-to-b from-gray-900/95 to-gray-900/90">
                  <button 
                    onClick={closeSignupModal} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-purple-400 transition-colors"
                  >
                    <FaTimes className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-12 pt-8 overflow-y-auto custom-scrollbar">
                  {isSuccess ? (
                    <div className="text-center space-y-6">
                      <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Thank you 🎵
                      </h2>
                      <p className="text-xl text-gray-300">
                        Check your email, you will be jammin' in no time.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="text-center space-y-6 mb-10">
                        <div className="flex items-center justify-center mb-6">
                          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Modern Guitar
                          </h2>
                          <FaGuitar className="text-6xl text-purple-500 ml-4" />
                        </div>
                        <p className="text-xl text-gray-300">
                          The only guitar platform you'll ever need. Join our waitlist and be part of the journey.
                        </p>
                      </div>

                      {submitError && (
                        <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-xl flex items-center mb-8">
                          <FaExclamationCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                          <p>{submitError}</p>
                        </div>
                      )}

                      <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-8">
                          <div>
                            <label htmlFor="name" className="block text-base font-medium text-white mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleInputChange}
                              style={{ color: 'black' }}
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-lg focus:ring-2 focus:ring-purple-500/50 focus:shadow-purple-500/20 transition-all placeholder:text-gray-500"
                              placeholder="Your name"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-base font-medium text-white mb-2">
                              Email
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              style={{ color: 'black' }}
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-lg focus:ring-2 focus:ring-purple-500/50 focus:shadow-purple-500/20 transition-all placeholder:text-gray-500"
                              placeholder="your@email.com"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-base font-medium text-white mb-3">
                              Favorite Genres
                            </label>
                            <div className="flex flex-wrap gap-2">
                              {GENRES.map((genre) => (
                                <motion.button
                                  key={genre}
                                  type="button"
                                  onClick={() => toggleGenre(genre)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className={`px-4 py-2 rounded-lg transition-all ${
                                    formData.genres.includes(genre)
                                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20'
                                      : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                                  }`}
                                >
                                  {genre}
                                </motion.button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label htmlFor="experienceLevel" className="block text-base font-medium text-white mb-2">
                              Experience Level
                            </label>
                            <select
                              id="experienceLevel"
                              name="experienceLevel"
                              value={formData.experienceLevel}
                              onChange={handleInputChange}
                              style={{ color: 'black' }}
                              className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-lg focus:ring-2 focus:ring-purple-500/50 focus:shadow-purple-500/20 transition-all"
                              required
                            >
                              <option value="" className="text-gray-400">Select your level</option>
                              {EXPERIENCE_LEVELS.map((level) => (
                                <option key={level} value={level} className="text-gray-900 bg-white">{level}</option>
                              ))}
                            </select>
                          </div>

                          {customFields.includes('Select Your Favorite Artists (choose multiple)') && (
                            <div>
                              <label className="block text-base font-medium text-white mb-3">
                                Favorite Artists
                              </label>
                              <div className="flex flex-wrap gap-2">
                                {FAVORITE_ARTISTS.map((artist) => (
                                  <motion.button
                                    key={artist}
                                    type="button"
                                    onClick={() => toggleArtist(artist)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className={`px-4 py-2 rounded-lg transition-all ${
                                      formData.favoriteArtists.includes(artist)
                                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg shadow-purple-500/20'
                                        : 'bg-white/5 backdrop-blur-sm hover:bg-white/10'
                                    }`}
                                  >
                                    {artist}
                                  </motion.button>
                                ))}
                              </div>
                            </div>
                          )}

                          {customFields.includes('What features do you want to see? (optional)') && (
                            <div>
                              <label htmlFor="featuresRequest" className="block text-base font-medium text-white mb-2">
                                What features would you like to see?
                              </label>
                              <textarea
                                id="featuresRequest"
                                name="featuresRequest"
                                value={formData.featuresRequest}
                                onChange={handleInputChange}
                                style={{ color: 'black' }}
                                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border-0 rounded-lg shadow-lg focus:ring-2 focus:ring-purple-500/50 focus:shadow-purple-500/20 transition-all placeholder:text-gray-500"
                                placeholder="Tell us what features you'd like..."
                                rows={4}
                              />
                            </div>
                          )}
                        </div>

                        <motion.button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-6 py-3 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg hover:from-purple-500 hover:to-purple-600 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 focus:ring-2 focus:ring-purple-500/50 focus:ring-offset-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center">
                              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Submitting...
                            </div>
                          ) : (
                            'Join Waitlist'
                          )}
                        </motion.button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal;

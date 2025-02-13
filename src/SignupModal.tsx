"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGuitar, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { useSignup } from './context/SignupContext';
import supabaseClient from './lib/supabase';

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

const SignupModal: React.FC = () => {
  const { isOpen, closeSignupModal } = useSignup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genres: [] as string[],
    experienceLevel: '',
    favoriteArtists: [] as string[],
    featuresRequest: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value.split(',').map(item => item.trim()).filter(Boolean)
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
      const { data, error } = await supabaseClient
        .from('beta_signups')
        .insert([{
          name: formData.name,
          email: formData.email,
          genres: formData.genres,
          experience_level: formData.experienceLevel,
          favorite_artists: formData.favoriteArtists,
          features_request: formData.featuresRequest
        }])
        .select();

      if (error) {
        throw error;
      }

      console.log('Signup successful:', data);
      setIsSuccess(true);
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
          className="fixed inset-0 z-50 overflow-y-auto"
        >
          <div className="min-h-screen px-4 text-center">
            <div className="fixed inset-0 bg-black/75" onClick={closeSignupModal} />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="inline-block w-full max-w-2xl p-8 my-8 text-left align-middle bg-gray-900 rounded-2xl border border-gray-800 shadow-xl transform transition-all relative"
            >
              <button 
                onClick={closeSignupModal} 
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes className="w-6 h-6" />
              </button>

              <div className="text-center space-y-4 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <FaGuitar className="text-6xl text-purple-500 mr-4" />
                  <h1 className="text-4xl font-bold tracking-tight text-white">Modern Guitar</h1>
                </div>
                
                <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  We&apos;re crafting the ultimate platform for guitar enthusiasts. Join our waitlist and be part of the journey!
                </p>
              </div>

              {submitError && (
                <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-xl flex items-center mb-6">
                  <FaExclamationCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                  <p>{submitError}</p>
                </div>
              )}

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <FaGuitar className="mx-auto text-6xl text-purple-500 mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Thank you for signing up!</h3>
                  <p className="text-gray-300">We&apos;ll keep you updated on our progress.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="genres" className="block text-sm font-medium text-gray-300 mb-2">
                      Favorite Genres (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="genres"
                      name="genres"
                      value={formData.genres.join(', ')}
                      onChange={handleMultiSelectChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Rock, Blues, Jazz"
                    />
                    <p className="mt-2 text-sm text-gray-400">
                      Suggestions: {GENRES.join(', ')}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-300 mb-2">
                      Experience Level
                    </label>
                    <select
                      id="experienceLevel"
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={e => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    >
                      <option value="">Select your level</option>
                      {EXPERIENCE_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="favoriteArtists" className="block text-sm font-medium text-gray-300 mb-2">
                      Favorite Artists/Bands (comma-separated)
                    </label>
                    <input
                      type="text"
                      id="favoriteArtists"
                      name="favoriteArtists"
                      value={formData.favoriteArtists.join(', ')}
                      onChange={handleMultiSelectChange}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Led Zeppelin, Pink Floyd, Eric Clapton"
                    />
                  </div>

                  <div>
                    <label htmlFor="featuresRequest" className="block text-sm font-medium text-gray-300 mb-2">
                      What features would you like to see? (Optional)
                    </label>
                    <textarea
                      id="featuresRequest"
                      name="featuresRequest"
                      value={formData.featuresRequest}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="Tell us what features would be most helpful for your guitar journey..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                      isSubmitting 
                        ? 'bg-purple-700 cursor-not-allowed'
                        : 'bg-purple-600 hover:bg-purple-500'
                    }`}
                  >
                    {isSubmitting ? 'Signing up...' : 'Join the Waitlist'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignupModal;
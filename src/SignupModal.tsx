"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGuitar, FaTimes, FaExclamationCircle } from 'react-icons/fa';
import { useSignup } from './context/SignupContext';
import { addUserSignup } from './lib/supabase';

const GENRES = [
  'Rock', 'Blues', 'Jazz', 'Classical', 
  'Metal', 'Folk', 'Country', 'Funk', 
  'Indie', 'Electronic'
];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];
const FAVORITE_ARTISTS = ['Jimi Hendrix', 'Eric Clapton', 'Stevie Ray Vaughan', 'B.B. King', 'Slash'];

export default function SignupModal() {
  const { isOpen, closeSignupModal } = useSignup();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genres: [] as string[],
    experienceLevel: '',
    favoriteArtists: [] as string[],
    featuresRequest: ''
  });

  const handleMultiSelectChange = (field: string, value: string) => {
    setFormData(prev => {
      const currentValues = prev[field as keyof typeof formData] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value];
      return { ...prev, [field]: newValues };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    console.log('Form data before submission:', formData);

    // Comprehensive client-side validation
    const validationErrors = [];

    if (!formData.name.trim()) {
      validationErrors.push('Please enter your name');
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.push('Please enter a valid email address');
    }

    if (formData.genres.length === 0) {
      validationErrors.push('Please select at least one genre');
    }

    if (!formData.experienceLevel) {
      validationErrors.push('Please select your experience level');
    }

    // If there are validation errors, display them and stop
    if (validationErrors.length > 0) {
      setSubmitError(validationErrors.join('. '));
      setIsSubmitting(false);
      return;
    }

    try {
      // Attempt to submit signup data
      const result = await addUserSignup({
        name: formData.name,
        email: formData.email,
        genres: formData.genres,
        experienceLevel: formData.experienceLevel,
        favoriteArtists: formData.favoriteArtists,
        featuresRequest: formData.featuresRequest
      });

      console.log('Signup successful:', result);

      // Show success state
      setIsSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        genres: [],
        experienceLevel: '',
        favoriteArtists: [],
        featuresRequest: ''
      });

      // Close modal after 3 seconds
      setTimeout(() => {
        closeSignupModal();
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error('Signup submission error:', error);
      
      // Provide a more user-friendly error message
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
      
      setSubmitError(errorMessage);
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-2xl bg-gray-900 rounded-3xl p-12 relative shadow-2xl border border-white/10" style={{ maxHeight: '80vh', overflowY: 'auto' }}
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
                We're crafting the ultimate platform for guitar enthusiasts. Join our waitlist and be part of the journey!
              </p>
            </div>

            {submitError && (
              <div className="bg-red-900/20 border border-red-500 text-red-300 p-4 rounded-xl flex items-center mb-6">
                <FaExclamationCircle className="mr-3 text-2xl text-red-500" />
                <span>{submitError}</span>
              </div>
            )}

            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-8"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                >
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-3xl font-bold text-white mb-4">Thank You!</h3>
                <p className="text-gray-300 text-lg">You will be jamming in no time. Check your email for updates.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-base font-medium text-gray-300 mb-3">
                      Your Name
                    </label>
                    <input 
                      id="name"
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-base font-medium text-gray-300 mb-3">
                      Email Address
                    </label>
                    <input 
                      id="email"
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Genres Section */}
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Select Your Genres (choose multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {GENRES.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => handleMultiSelectChange('genres', genre)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.genres.includes(genre)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Favorite Artists Section */}
                <div>
                  <label className="block text-base font-medium text-gray-300 mb-3">
                    Select Your Favorite Artists (choose multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {FAVORITE_ARTISTS.map(artist => (
                      <button
                        key={artist}
                        type="button"
                        onClick={() => handleMultiSelectChange('favoriteArtists', artist)}
                        className={`py-3 rounded-xl text-sm font-medium transition-all ${
                          formData.favoriteArtists.includes(artist)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {artist}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label htmlFor="experience" className="block text-base font-medium text-gray-300 mb-3">
                    Guitar Experience Level
                  </label>
                  <select
                    id="experience"
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Your Level</option>
                    {EXPERIENCE_LEVELS.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                {/* Features Request Section */}
                <div>
                  <label htmlFor="featuresRequest" className="block text-base font-medium text-gray-300 mb-3">
                    What features do you want to see? (optional)
                  </label>
                  <textarea
                    id="featuresRequest"
                    value={formData.featuresRequest}
                    onChange={(e) => setFormData({...formData, featuresRequest: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Type your features request here"
                    rows={4}
                  />
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-4 bg-purple-500 text-white text-lg font-bold rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
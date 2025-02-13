"use client";

import React, { useState } from 'react';
import { FaGuitar } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { addUserSignup } from '../../lib/supabase';

const GENRES = [
  'Rock', 'Blues', 'Jazz', 'Classical', 
  'Metal', 'Folk', 'Country', 'Funk', 
  'Indie', 'Electronic'
];
const EXPERIENCE_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

export default function SignupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    genres: [] as string[],
    experienceLevel: '',
    favoriteArtists: [] as string[]
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

    try {
      await addUserSignup({
        name: formData.name,
        email: formData.email,
        genres: formData.genres,
        experienceLevel: formData.experienceLevel,
        favoriteArtists: formData.favoriteArtists
      });

      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
        <div className="w-full max-w-3xl space-y-10 bg-gray-900 p-12 rounded-3xl shadow-2xl border border-white/10">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <FaGuitar className="text-6xl text-purple-500 mr-4" />
              <h1 className="text-5xl font-bold tracking-tight">Modern Guitar</h1>
            </div>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              We're crafting the ultimate platform for guitar enthusiasts. Join our waitlist and be part of the journey!
            </p>
          </div>

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

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting || formData.genres.length === 0 || !formData.experienceLevel}
              className="w-full py-4 bg-purple-500 text-white text-lg font-bold rounded-xl hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Join Waitlist'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

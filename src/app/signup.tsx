import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaGuitar, FaTimes, FaExclamationCircle } from 'react-icons/fa';

const SignupPage = () => {
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
    // Add form submission logic here
  };

  return (
    <div>
      <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Animated musical notes */}
          <div className="animate-note-flow">
            <span className="text-white text-6xl">♪</span>
            <span className="text-white text-6xl">♫</span>
            <span className="text-white text-6xl">♬</span>
          </div>
        </div>
        <div className="relative max-w-2xl w-full">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-lg font-medium text-gray-300 mb-3">
                  Your Name
                </label>
                <input 
                  id="name"
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-lg font-medium text-gray-300 mb-3">
                  Email Address
                </label>
                <input 
                  id="email"
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="genres" className="block text-lg font-medium text-gray-300 mb-3">
                  Favorite Genres
                </label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.genres.includes('Rock') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('genres', 'Rock')}
                  >
                    Rock
                  </button>
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.genres.includes('Jazz') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('genres', 'Jazz')}
                  >
                    Jazz
                  </button>
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.genres.includes('Blues') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('genres', 'Blues')}
                  >
                    Blues
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="experienceLevel" className="block text-lg font-medium text-gray-300 mb-3">
                  Experience Level
                </label>
                <select 
                  id="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                >
                  <option value="">Select an option</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="favoriteArtists" className="block text-lg font-medium text-gray-300 mb-3">
                  Favorite Artists
                </label>
                <div className="flex flex-wrap gap-2">
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.favoriteArtists.includes('John Mayer') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('favoriteArtists', 'John Mayer')}
                  >
                    John Mayer
                  </button>
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.favoriteArtists.includes('Eric Clapton') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('favoriteArtists', 'Eric Clapton')}
                  >
                    Eric Clapton
                  </button>
                  <button 
                    type="button"
                    className={`px-4 py-2 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg ${formData.favoriteArtists.includes('B.B. King') ? 'bg-purple-500' : ''}`}
                    onClick={() => handleMultiSelectChange('favoriteArtists', 'B.B. King')}
                  >
                    B.B. King
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="featuresRequest" className="block text-lg font-medium text-gray-300 mb-3">
                  Features Request
                </label>
                <textarea 
                  id="featuresRequest"
                  value={formData.featuresRequest}
                  onChange={(e) => setFormData({...formData, featuresRequest: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-800 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                  placeholder="Enter your features request"
                />
              </div>
            </div>
            <button 
              type="submit"
              className="w-full px-4 py-3 bg-purple-500 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <style jsx>{`
        .animate-note-flow span {
          display: inline-block;
          animation: noteFlow 8s linear infinite;
        }

        @keyframes noteFlow {
          0% { transform: translateY(100vh); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;

"use client";

import { FaGuitar } from 'react-icons/fa';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl text-center space-y-8 bg-gray-900 p-12 rounded-2xl shadow-2xl border border-white/10">
        <div className="flex items-center justify-center mb-6">
          <FaGuitar className="text-6xl text-purple-500 mr-4" />
          <h1 className="text-4xl font-bold">Modern Guitar</h1>
        </div>
        
        <h2 className="text-3xl font-semibold text-white mb-4">
          Thank You for Joining!
        </h2>
        
        <p className="text-gray-400 mb-8">
          You're now on the waitlist for Modern Guitar. We'll keep you updated on our progress and send you exclusive early access information.
        </p>
        
        <div className="space-y-4">
          <Link 
            href="/" 
            className="inline-block w-full py-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Back to Home
          </Link>
          
          <p className="text-sm text-gray-500">
            Follow us on social media for the latest updates
          </p>
        </div>
      </div>
    </div>
  );
}

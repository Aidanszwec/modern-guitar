'use client';

import Image from "next/image";
import Link from "next/link";
import { FaGuitar, FaMusic, FaGraduationCap } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useSignup } from '../context/SignupContext';
import SignupModal from '../SignupModal';
import { useState, useCallback } from "react";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink = ({ href, children }: NavLinkProps) => {
  return (
    <Link 
      href={href}
      className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all relative group text-lg font-medium"
    >
      {children}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300"
        layoutId="underline"
      />
    </Link>
  );
};

const musicEmojis = ['🎸', '🎵', '🎶'];

const MusicEmoji = ({ x, y, emoji }: { x: number; y: number; emoji: string }) => {
  return (
    <motion.div
      className="absolute text-4xl pointer-events-none"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5 }}
      style={{ left: x, top: y }}
    >
      {emoji}
    </motion.div>
  );
};

const ClientComponent = () => {
  const { openSignupModal } = useSignup();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [emojis, setEmojis] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const [currentEmojiIndex, setCurrentEmojiIndex] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    if (Math.random() > 0.9) {
      setEmojis((prevEmojis) => [
        ...prevEmojis,
        { 
          id: Date.now(), 
          x: e.clientX, 
          y: e.clientY, 
          emoji: musicEmojis[currentEmojiIndex]
        },
      ]);
    }
  }, [currentEmojiIndex]);

  const handleTabLibraryClick = () => {
    openSignupModal(['Select Your Favorite Artists (choose multiple)', 'What features do you want to see? (optional)']);
  };

  const handleJamRoomClick = () => {
    openSignupModal(['Select Your Favorite Artists (choose multiple)', 'What features do you want to see? (optional)']);
  };

  const handleLearnClick = () => {
    openSignupModal(['Select Your Favorite Artists (choose multiple)', 'What features do you want to see? (optional)']);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <SignupModal />
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden" onMouseMove={handleMouseMove}>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 mix-blend-multiply opacity-70" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/path/to/your/image.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 opacity-50" />
        <AnimatePresence>
          {emojis.map((emoji) => (
            <MusicEmoji key={emoji.id} x={emoji.x} y={emoji.y} emoji={emoji.emoji} />
          ))}
        </AnimatePresence>
        
        <div className="relative container mx-auto px-4 h-full flex items-center justify-center pt-20">
          <div className="max-w-5xl animate-fade-in text-center relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block bg-blue-500/10 px-6 py-2 rounded-lg mb-4"
            >
              <span className="text-base md:text-xl font-bold text-blue-400 tracking-wider uppercase rotate-[-5deg]">⚡ A new way of playing guitar ⚡</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-9xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-tight drop-shadow-2xl text-center"
            >
               Modern Guitar🎸
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-100 mb-12 leading-relaxed drop-shadow-lg"
            >
              Play, Practice, & Gig
              <span className="text-purple-400"> For Guitarists by Guitarists</span>
              <span className="block mt-4 text-lg md:text-xl lg:text-2xl text-gray-300">Learn your favorite songs • Jam over adjustable jam tracks • Join the community</span>
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 md:gap-8 justify-center mb-20 w-full max-w-4xl mx-auto px-4 md:px-0"
            >
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleTabLibraryClick}
                className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 md:px-8 md:py-2 rounded-xl flex-1 relative overflow-hidden group sm:px-12 sm:py-6 shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-shadow"
              >
                <span className="relative z-10 text-lg md:text-xl lg:text-3xl font-bold flex items-center justify-center gap-3">
                  <FaGuitar className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                  Find Tabs
                </span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleJamRoomClick}
                className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 md:px-8 md:py-2 rounded-xl flex-1 relative overflow-hidden group sm:px-12 sm:py-6 shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
              >
                <span className="relative z-10 text-lg md:text-xl lg:text-3xl font-bold flex items-center justify-center gap-3">
                  <FaMusic className="w-4 h-4 md:w-5 md:h-5 lg:w-8 lg:h-8" />
                  Jam Room
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-4 bg-gray-900/50 backdrop-blur-sm -mt-20 pb-16">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
          >
            Everything You Need
          </motion.h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-[1400px] mx-auto px-4">
            <motion.div 
              onClick={handleTabLibraryClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="p-6 rounded-xl bg-gradient-to-br from-blue-900/50 to-purple-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group min-h-[200px] flex flex-col justify-center cursor-pointer"
            >
              <FaGuitar className="w-12 h-12 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold mb-3">Tab Library</h3>
              <p className="text-gray-300 text-lg leading-relaxed">Dynamic tabs, better looking interface, auto scrolling, & automatic transpose.</p>
            </motion.div>
            
            <motion.div 
              onClick={handleJamRoomClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-6 rounded-xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group min-h-[200px] flex flex-col justify-center cursor-pointer"
            >
              <FaMusic className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold mb-3">Jam Room</h3>
              <p className="text-gray-300 text-lg leading-relaxed">Practice with backing tracks, record your sessions, & get instant feedback.</p>
            </motion.div>
            
            <motion.div 
              onClick={handleLearnClick}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-6 rounded-xl bg-gradient-to-br from-pink-900/50 to-red-900/50 backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20 group min-h-[200px] flex flex-col justify-center cursor-pointer"
            >
              <FaGraduationCap className="w-12 h-12 text-pink-400 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="text-3xl font-bold mb-3">Learn</h3>
              <p className="text-gray-300 text-lg leading-relaxed">Interactive lessons, practice exercises, & progress tracking.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ClientComponent;

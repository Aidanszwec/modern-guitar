'use client';

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGuitar, FaMusic, FaSignInAlt, FaBars, FaTimes } from "react-icons/fa";
import { useSignup } from '../context/SignupContext';

const NavLink = ({ href, children, onClick, className = "" }: { 
  href?: string, 
  children: React.ReactNode, 
  onClick?: () => void,
  className?: string 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all relative group text-lg font-medium ${className}`}
    >
      {href ? (
        <Link href={href} className="flex items-center gap-2">
          {children}
        </Link>
      ) : (
        <button onClick={onClick} className="flex items-center gap-2 w-full text-left">
          {children}
        </button>
      )}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100 transition-all duration-300"
        layoutId="underline"
      />
    </motion.div>
  );
};

export default function Navbar() {
  const { openSignupModal } = useSignup();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <FaGuitar className="text-blue-400" />
          Modern Guitar
        </Link>

        {/* Mobile menu button */}
        <button 
          onClick={toggleMenu}
          className="md:hidden text-white p-2"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink href="/signup">
            <FaSignInAlt className="w-5 h-5" />
            Join Beta
          </NavLink>
          
          <NavLink href="/signup">
            <FaMusic className="w-5 h-5" />
            Jam Room
          </NavLink>
          
          <NavLink href="/signup">
            <FaGuitar className="w-5 h-5" />
            Learn
          </NavLink>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-md"
        >
          <div className="flex flex-col p-4">
            <NavLink href="/signup" className="w-full">
              <FaSignInAlt className="w-5 h-5" />
              Join Beta
            </NavLink>
            
            <NavLink href="/signup" className="w-full">
              <FaMusic className="w-5 h-5" />
              Jam Room
            </NavLink>
            
            <NavLink href="/signup" className="w-full">
              <FaGuitar className="w-5 h-5" />
              Learn
            </NavLink>
          </div>
        </motion.div>
      )}
    </nav>
  );
}
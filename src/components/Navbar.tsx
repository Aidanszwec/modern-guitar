'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { FaGuitar, FaMusic, FaSignInAlt } from "react-icons/fa";
import { useSignup } from '../context/SignupContext';

const NavLink = ({ href, children, onClick }: { 
  href?: string, 
  children: React.ReactNode, 
  onClick?: () => void 
}) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all relative group text-lg font-medium"
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

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/50 backdrop-blur-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
          <FaGuitar className="text-blue-400" />
          Modern Guitar
        </Link>

        <div className="flex items-center space-x-4">
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
    </nav>
  );
}
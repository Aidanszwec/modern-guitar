"use client";

import Link from 'next/link';
import { FaSignInAlt } from 'react-icons/fa';

export default function SignupButton() {
  return (
    <Link 
      href="/signup" 
      className="px-6 py-3 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors flex items-center gap-2"
    >
      <FaSignInAlt />
      Join Waitlist
    </Link>
  );
}

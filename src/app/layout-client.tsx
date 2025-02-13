"use client";

import React from 'react';
import { SignupProvider } from '../context/SignupContext';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SignupProvider>
      {children}
    </SignupProvider>
  )
}

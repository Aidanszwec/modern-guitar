'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SignupContextType {
  isOpen: boolean;
  openSignupModal: () => void;
  closeSignupModal: () => void;
}

const SignupContext = createContext<SignupContextType>({
  isOpen: false,
  openSignupModal: () => {},
  closeSignupModal: () => {}
});

export const SignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openSignupModal = () => setIsOpen(true);
  const closeSignupModal = () => setIsOpen(false);

  return (
    <SignupContext.Provider value={{ isOpen, openSignupModal, closeSignupModal }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);

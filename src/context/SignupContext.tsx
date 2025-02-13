'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface SignupContextType {
  isOpen: boolean;
  openSignupModal: (customFields?: string[]) => void;
  closeSignupModal: () => void;
  customFields: string[];
}

const SignupContext = createContext<SignupContextType>({
  isOpen: false,
  openSignupModal: () => {},
  closeSignupModal: () => {},
  customFields: []
});

export const SignupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customFields, setCustomFields] = useState<string[]>([]);

  const openSignupModal = (fields: string[] = []) => {
    setCustomFields(fields);
    setIsOpen(true);
  };
  
  const closeSignupModal = () => {
    setIsOpen(false);
    setCustomFields([]);
  };

  return (
    <SignupContext.Provider value={{ isOpen, openSignupModal, closeSignupModal, customFields }}>
      {children}
    </SignupContext.Provider>
  );
};

export const useSignup = () => useContext(SignupContext);

// First, let's create a language context to manage the language state
// Create a new file called LanguageContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const LanguageContext = createContext();

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Get initial language from localStorage or use English as default
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language; // Update HTML lang attribute
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => useContext(LanguageContext);
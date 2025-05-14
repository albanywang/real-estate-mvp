// client/src/contexts/LanguageContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

// Create context
const LanguageContext = createContext();

// Create a custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Create a provider component
export const LanguageProvider = ({ children }) => {
  // Get saved language from localStorage or default to Japanese
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || 'ja'; // Default to Japanese
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Function to change language
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };

  // Value object to be provided by context
  const value = {
    language,
    changeLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
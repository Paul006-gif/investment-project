import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load language from localStorage
    const stored = localStorage.getItem('selectedLanguage') || 'en';
    setLanguage(stored);
    setIsLoaded(true);

    // Listen for language changes
    const handleLanguageChange = (e) => {
      setLanguage(e.detail.language);
    };

    window.addEventListener('languageChange', handleLanguageChange);
    return () => window.removeEventListener('languageChange', handleLanguageChange);
  }, []);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem('selectedLanguage', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
  };

  if (!isLoaded) {
    return children;
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

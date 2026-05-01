import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'fr';

interface Translations {
  [key: string]: {
    en: string;
    fr: string;
  };
}

export const translations: Translations = {
  dashboard: { en: 'Dashboard', fr: 'Tableau de bord' },
  aiTools: { en: 'AI Tools', fr: 'Outils IA' },
  history: { en: 'History', fr: 'Historique' },
  settings: { en: 'Settings', fr: 'Paramètres' },
  chat: { en: 'AI Chat', fr: 'Chat IA' },
  logout: { en: 'Logout', fr: 'Déconnexion' },
  welcome: { en: 'Welcome back', fr: 'Bon retour' },
  summarize: { en: 'Summarize', fr: 'Résumer' },
  quiz: { en: 'Generate Quiz', fr: 'Générer un quiz' },
  explain: { en: 'Explain Simply', fr: 'Expliquer simplement' },
  pasteNotes: { en: 'Paste your notes or text below:', fr: 'Collez vos notes ou votre texte ci-dessous :' },
  uploadFile: { en: 'Upload File', fr: 'Charger un fichier' },
  language: { en: 'Language', fr: 'Langue' },
  darkMode: { en: 'Dark Mode', fr: 'Mode sombre' },
  placeholder: { en: 'Type something...', fr: 'Écrivez quelque chose...' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const storedLang = localStorage.getItem('study_assistant_lang') as Language;
    if (storedLang) setLanguageState(storedLang);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('study_assistant_lang', lang);
  };

  const t = (key: string) => {
    return translations[key] ? translations[key][language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};

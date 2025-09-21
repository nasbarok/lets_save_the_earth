
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { translations, type Language } from '../locales';

type Translations = typeof translations.en;

interface LocalizationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  ready: boolean;
}

export const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // In a real app, you might load this from user preferences or browser settings
    setReady(true);
  }, []);

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations[language];

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if translation is missing
        let fallbackResult: any = translations['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
        }

        if(fallbackResult !== undefined) {
            result = fallbackResult;
            break;
        }
        
        return key;
      }
    }

    if (typeof result !== 'string') {
      return key;
    }

    if (replacements) {
      return Object.entries(replacements).reduce((acc, [placeholder, value]) => {
        return acc.replace(`{${placeholder}}`, String(value));
      }, result);
    }

    return result;
  }, [language]);

  return (
    <LocalizationContext.Provider value={{ language, setLanguage, t, ready }}>
      {children}
    </LocalizationContext.Provider>
  );
};
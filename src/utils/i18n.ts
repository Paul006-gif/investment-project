import en from '../i18n/en.json';
import es from '../i18n/es.json';
import pt from '../i18n/pt.json';
import pl from '../i18n/pl.json';

export type Language = 'en' | 'es' | 'pt' | 'pl';

const translations = {
  en,
  es,
  pt,
  pl
};

export function getLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const stored = localStorage.getItem('selectedLanguage');
  if (stored && stored in translations) {
    return stored as Language;
  }
  
  return 'en';
}

export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('selectedLanguage', lang);
  window.dispatchEvent(new CustomEvent('languageChange', { detail: { language: lang } }));
}

export function t(key: string, lang: Language = getLanguage()): string {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (!value && lang !== 'en') {
    // Fallback to English if key not found
    let fallback: any = translations.en;
    for (const k of keys) {
      fallback = fallback?.[k];
    }
    return fallback || key;
  }
  
  return value || key;
}

export function getTranslations(lang: Language = getLanguage()) {
  return translations[lang];
}

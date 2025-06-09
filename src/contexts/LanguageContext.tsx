import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLanguageByCode, isRTL } from '../i18n';

interface LanguageContextType {
  currentLanguage: string;
  isRTL: boolean;
  direction: 'ltr' | 'rtl';
  changeLanguage: (language: string) => Promise<void>;
  formatNumber: (number: number) => string;
  formatDate: (date: Date) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  formatRelativeTime: (date: Date) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: React.ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
      
      // Update document properties
      const language = getLanguageByCode(lng);
      document.documentElement.dir = language.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
      
      // Update meta tags
      const htmlElement = document.documentElement;
      htmlElement.setAttribute('lang', lng);
      
      // Update font loading for specific languages
      loadLanguageSpecificFonts(lng);
    };

    // Listen for language changes
    i18n.on('languageChanged', handleLanguageChange);
    
    // Set initial language properties
    handleLanguageChange(i18n.language);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const loadLanguageSpecificFonts = (language: string) => {
    // Remove existing language-specific font classes
    document.body.classList.remove(
      'font-chinese', 'font-japanese', 'font-korean', 'font-arabic', 
      'font-hindi', 'font-thai', 'font-vietnamese'
    );

    // Add language-specific font classes
    switch (language) {
      case 'zh-CN':
      case 'zh-TW':
        document.body.classList.add('font-chinese');
        break;
      case 'ja':
        document.body.classList.add('font-japanese');
        break;
      case 'ko':
        document.body.classList.add('font-korean');
        break;
      case 'ar':
        document.body.classList.add('font-arabic');
        break;
      case 'hi':
        document.body.classList.add('font-hindi');
        break;
      case 'th':
        document.body.classList.add('font-thai');
        break;
      case 'vi':
        document.body.classList.add('font-vietnamese');
        break;
    }
  };

  const changeLanguage = async (language: string) => {
    try {
      await i18n.changeLanguage(language);
      localStorage.setItem('easytimestamps-language', language);
    } catch (error) {
      console.error('Failed to change language:', error);
      throw error;
    }
  };

  const getLocale = () => {
    // Map i18n language codes to proper locale codes
    const localeMap: Record<string, string> = {
      'en': 'en-US',
      'es': 'es-ES',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ja': 'ja-JP',
      'ru': 'ru-RU',
      'ko': 'ko-KR',
      'zh-CN': 'zh-CN',
      'zh-TW': 'zh-TW',
      'ar': 'ar-SA',
      'bg': 'bg-BG',
      'ca': 'ca-ES',
      'nl': 'nl-NL',
      'el': 'el-GR',
      'hi': 'hi-IN',
      'id': 'id-ID',
      'ms': 'ms-MY',
      'pl': 'pl-PL',
      'sv': 'sv-SE',
      'th': 'th-TH',
      'tr': 'tr-TR',
      'uk': 'uk-UA',
      'vi': 'vi-VN',
    };

    return localeMap[currentLanguage] || 'en-US';
  };

  const formatNumber = (number: number): string => {
    try {
      return new Intl.NumberFormat(getLocale()).format(number);
    } catch (error) {
      console.warn('Number formatting failed:', error);
      return number.toString();
    }
  };

  const formatDate = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(getLocale(), {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.warn('Date formatting failed:', error);
      return date.toLocaleDateString();
    }
  };

  const formatTime = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(getLocale(), {
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.warn('Time formatting failed:', error);
      return date.toLocaleTimeString();
    }
  };

  const formatDateTime = (date: Date): string => {
    try {
      return new Intl.DateTimeFormat(getLocale(), {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.warn('DateTime formatting failed:', error);
      return date.toLocaleString();
    }
  };

  const formatRelativeTime = (date: Date): string => {
    try {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffSeconds = Math.floor(diffMs / 1000);
      const diffMinutes = Math.floor(diffSeconds / 60);
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      const rtf = new Intl.RelativeTimeFormat(getLocale(), { numeric: 'auto' });

      if (diffSeconds < 60) {
        return rtf.format(-diffSeconds, 'second');
      } else if (diffMinutes < 60) {
        return rtf.format(-diffMinutes, 'minute');
      } else if (diffHours < 24) {
        return rtf.format(-diffHours, 'hour');
      } else if (diffDays < 30) {
        return rtf.format(-diffDays, 'day');
      } else {
        return formatDate(date);
      }
    } catch (error) {
      console.warn('Relative time formatting failed:', error);
      return date.toLocaleString();
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    isRTL: isRTL(currentLanguage),
    direction: isRTL(currentLanguage) ? 'rtl' : 'ltr',
    changeLanguage,
    formatNumber,
    formatDate,
    formatTime,
    formatDateTime,
    formatRelativeTime,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
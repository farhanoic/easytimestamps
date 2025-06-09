import React, { useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface LocalizationProviderProps {
  children: React.ReactNode;
}

export const LocalizationProvider: React.FC<LocalizationProviderProps> = ({ children }) => {
  const { locale, config, isRTL } = useLocalization();

  useEffect(() => {
    // Set document direction
    document.documentElement.dir = config.direction;
    document.documentElement.lang = locale;
    
    // Set locale data attribute for CSS custom properties
    document.documentElement.setAttribute('data-locale', locale);
    
    // Apply appropriate font class based on locale
    const body = document.body;
    
    // Remove existing font classes
    body.classList.remove(
      'font-arabic', 'font-chinese', 'font-chinese-traditional', 
      'font-japanese', 'font-korean', 'font-hindi', 'font-thai', 'font-vietnamese'
    );
    
    // Add appropriate font class
    switch (locale) {
      case 'ar':
        body.classList.add('font-arabic');
        break;
      case 'zh-CN':
        body.classList.add('font-chinese');
        break;
      case 'zh-TW':
        body.classList.add('font-chinese-traditional');
        break;
      case 'ja':
        body.classList.add('font-japanese');
        break;
      case 'ko':
        body.classList.add('font-korean');
        break;
      case 'hi':
        body.classList.add('font-hindi');
        break;
      case 'th':
        body.classList.add('font-thai');
        break;
      case 'vi':
        body.classList.add('font-vietnamese');
        break;
      default:
        // Default Inter font is already applied
        break;
    }
    
    // Apply RTL class to body
    if (isRTL) {
      body.classList.add('rtl');
    } else {
      body.classList.remove('rtl');
    }
    
  }, [locale, config, isRTL]);

  return (
    <div className={`min-h-screen ${isRTL ? 'rtl' : 'ltr'}`}>
      {children}
    </div>
  );
};
import { languages } from '../i18n';

// Extract language code from URL path
export const extractLanguageFromPath = (pathname: string): { language: string; path: string } => {
  const segments = pathname.split('/').filter(Boolean);
  
  if (segments.length === 0) {
    return { language: '', path: '/' };
  }
  
  const firstSegment = segments[0];
  const isLanguageCode = languages.some(lang => lang.code === firstSegment);
  
  if (isLanguageCode) {
    const remainingPath = segments.length > 1 ? `/${segments.slice(1).join('/')}` : '/';
    return { language: firstSegment, path: remainingPath };
  }
  
  return { language: '', path: pathname };
};

// Generate URL with language prefix
export const createLanguageUrl = (path: string, language?: string): string => {
  // Don't add language prefix for default language (English)
  if (!language || language === 'en') {
    return path;
  }
  
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Add language prefix
  return `/${language}${cleanPath === '/' ? '' : cleanPath}`;
};

// Get current language from URL or browser
export const getCurrentLanguageFromUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'en';
  }
  
  const { language } = extractLanguageFromPath(window.location.pathname);
  return language || 'en';
};

// Update URL with new language
export const updateUrlWithLanguage = (newLanguage: string, currentPath: string = window.location.pathname): string => {
  const { path } = extractLanguageFromPath(currentPath);
  return createLanguageUrl(path, newLanguage);
};

// Navigate to URL with language prefix
export const navigateWithLanguage = (path: string, language?: string): void => {
  const url = createLanguageUrl(path, language);
  window.history.pushState({}, '', url);
};

// Check if current URL has language prefix
export const hasLanguagePrefix = (pathname: string = window.location.pathname): boolean => {
  const { language } = extractLanguageFromPath(pathname);
  return Boolean(language);
};

// Get supported language codes
export const getSupportedLanguages = (): string[] => {
  return languages.map(lang => lang.code);
};

// Validate language code
export const isValidLanguageCode = (code: string): boolean => {
  return languages.some(lang => lang.code === code);
};

// Get language redirect if needed
export const getLanguageRedirect = (pathname: string, preferredLanguage: string): string | null => {
  const { language, path } = extractLanguageFromPath(pathname);
  
  // If URL has no language prefix and preferred language is not English
  if (!language && preferredLanguage !== 'en') {
    return createLanguageUrl(path, preferredLanguage);
  }
  
  // If URL has invalid language prefix
  if (language && !isValidLanguageCode(language)) {
    return createLanguageUrl(path, preferredLanguage);
  }
  
  return null;
};
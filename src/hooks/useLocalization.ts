import { useTranslation } from 'react-i18next';
import { getLocaleConfig, formatNumber, formatDate, formatTime, formatCurrency, isRTL } from '../utils/localization';

export const useLocalization = () => {
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  const config = getLocaleConfig(currentLocale);

  return {
    locale: currentLocale,
    config,
    isRTL: isRTL(currentLocale),
    formatNumber: (number: number) => formatNumber(number, currentLocale),
    formatDate: (date: Date) => formatDate(date, currentLocale),
    formatTime: (date: Date) => formatTime(date, currentLocale),
    formatCurrency: (amount: number) => formatCurrency(amount, currentLocale),
    getDirectionClass: () => isRTL(currentLocale) ? 'rtl' : 'ltr',
    
    // Cultural color adaptations
    getSuccessColor: () => config.colors.success,
    getErrorColor: () => config.colors.error,
    getWarningColor: () => config.colors.warning,
    getPrimaryColor: () => config.colors.primary,
    
    // Privacy compliance
    requiresGDPR: () => config.privacy.gdpr,
    requiresCCPA: () => config.privacy.ccpa,
    requiresCookieConsent: () => config.privacy.cookieConsent,
    
    // Regional formatting
    getPhoneFormat: () => config.contact.phoneFormat,
    getAddressFormat: () => config.contact.addressFormat,
    
    // Formality level
    isFormal: () => config.formality === 'formal',
    
    // Currency and region
    getCurrency: () => config.currency,
    getRegion: () => config.region,
    getCountry: () => config.country
  };
};
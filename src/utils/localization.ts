export interface LocaleConfig {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  dateFormat: string;
  timeFormat: '12h' | '24h';
  numberFormat: {
    decimal: string;
    thousands: string;
    currency: string;
  };
  formality: 'formal' | 'informal';
  region: string;
  country: string;
  currency: string;
  colors: {
    primary: string;
    success: string;
    warning: string;
    error: string;
  };
  privacy: {
    gdpr: boolean;
    ccpa: boolean;
    cookieConsent: boolean;
  };
  contact: {
    phoneFormat: string;
    addressFormat: string[];
  };
}

export const localeConfigs: Record<string, LocaleConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    direction: 'ltr',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '$'
    },
    formality: 'informal',
    region: 'US',
    country: 'United States',
    currency: 'USD',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: false,
      ccpa: true,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '(XXX) XXX-XXXX',
      addressFormat: ['street', 'city', 'state', 'zip', 'country']
    }
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    formality: 'formal',
    region: 'ES',
    country: 'Spain',
    currency: 'EUR',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: true,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+34 XXX XXX XXX',
      addressFormat: ['street', 'city', 'zip', 'country']
    }
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: '€'
    },
    formality: 'formal',
    region: 'FR',
    country: 'France',
    currency: 'EUR',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: true,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+33 X XX XX XX XX',
      addressFormat: ['street', 'zip', 'city', 'country']
    }
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: '.',
      currency: '€'
    },
    formality: 'formal',
    region: 'DE',
    country: 'Germany',
    currency: 'EUR',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: true,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+49 XXX XXXXXXX',
      addressFormat: ['street', 'zip', 'city', 'country']
    }
  },
  ja: {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    direction: 'ltr',
    dateFormat: 'YYYY/MM/DD',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    formality: 'formal',
    region: 'JP',
    country: 'Japan',
    currency: 'JPY',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#dc2626' // Less intense red for Japanese culture
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+81-XX-XXXX-XXXX',
      addressFormat: ['country', 'zip', 'prefecture', 'city', 'street']
    }
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    direction: 'rtl',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: 'ر.س'
    },
    formality: 'formal',
    region: 'SA',
    country: 'Saudi Arabia',
    currency: 'SAR',
    colors: {
      primary: '#3b82f6',
      success: '#059669', // Green is highly positive in Islamic culture
      warning: '#d97706',
      error: '#dc2626'
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+966 XX XXX XXXX',
      addressFormat: ['street', 'district', 'city', 'zip', 'country']
    }
  },
  zh_CN: {
    code: 'zh-CN',
    name: 'Chinese (Simplified)',
    nativeName: '中文 (简体)',
    direction: 'ltr',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '¥'
    },
    formality: 'formal',
    region: 'CN',
    country: 'China',
    currency: 'CNY',
    colors: {
      primary: '#3b82f6',
      success: '#dc2626', // Red is lucky/positive in Chinese culture
      warning: '#f59e0b',
      error: '#374151' // Black/dark for negative, avoiding red
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: false
    },
    contact: {
      phoneFormat: '+86 XXX XXXX XXXX',
      addressFormat: ['country', 'province', 'city', 'district', 'street', 'zip']
    }
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    direction: 'ltr',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₹'
    },
    formality: 'formal',
    region: 'IN',
    country: 'India',
    currency: 'INR',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+91 XXXXX XXXXX',
      addressFormat: ['street', 'city', 'state', 'zip', 'country']
    }
  },
  ru: {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    direction: 'ltr',
    dateFormat: 'DD.MM.YYYY',
    timeFormat: '24h',
    numberFormat: {
      decimal: ',',
      thousands: ' ',
      currency: '₽'
    },
    formality: 'formal',
    region: 'RU',
    country: 'Russia',
    currency: 'RUB',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+7 XXX XXX-XX-XX',
      addressFormat: ['country', 'zip', 'region', 'city', 'street']
    }
  },
  ko: {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    direction: 'ltr',
    dateFormat: 'YYYY. MM. DD.',
    timeFormat: '12h',
    numberFormat: {
      decimal: '.',
      thousands: ',',
      currency: '₩'
    },
    formality: 'formal',
    region: 'KR',
    country: 'South Korea',
    currency: 'KRW',
    colors: {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    },
    privacy: {
      gdpr: false,
      ccpa: false,
      cookieConsent: true
    },
    contact: {
      phoneFormat: '+82 XX-XXXX-XXXX',
      addressFormat: ['country', 'province', 'city', 'district', 'street', 'zip']
    }
  }
};

export const getLocaleConfig = (locale: string): LocaleConfig => {
  const normalizedLocale = locale.replace('-', '_');
  return localeConfigs[normalizedLocale] || localeConfigs.en;
};

export const formatNumber = (number: number, locale: string): string => {
  return number.toLocaleString(locale.replace('_', '-'), {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

export const formatDate = (date: Date, locale: string): string => {
  return date.toLocaleDateString(locale.replace('_', '-'));
};

export const formatTime = (date: Date, locale: string): string => {
  const config = getLocaleConfig(locale);
  const use24Hour = config.timeFormat === '24h';
  
  return date.toLocaleTimeString(locale.replace('_', '-'), {
    hour12: !use24Hour,
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatCurrency = (amount: number, locale: string): string => {
  const config = getLocaleConfig(locale);
  return new Intl.NumberFormat(locale.replace('_', '-'), {
    style: 'currency',
    currency: config.currency
  }).format(amount);
};

export const getDirectionClass = (locale: string): string => {
  const config = getLocaleConfig(locale);
  return config.direction === 'rtl' ? 'rtl' : 'ltr';
};

export const isRTL = (locale: string): boolean => {
  const config = getLocaleConfig(locale);
  return config.direction === 'rtl';
};
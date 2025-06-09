/**
 * Route utilities for multi-language URL handling
 * Handles translated slugs and language-specific routing
 */

import { SUPPORTED_LANGUAGES } from './seoUtils'

// Route configuration with translated paths
export const ROUTES = {
  home: {
    en: '/',
    es: '/es',
    fr: '/fr', 
    de: '/de',
    pt: '/pt',
    ja: '/ja',
    ko: '/ko',
    'zh-CN': '/zh'
  },
  features: {
    en: '/features',
    es: '/es/caracteristicas',
    fr: '/fr/fonctionnalites',
    de: '/de/funktionen', 
    pt: '/pt/recursos',
    ja: '/ja/機能',
    ko: '/ko/기능',
    'zh-CN': '/zh/功能'
  },
  pricing: {
    en: '/pricing',
    es: '/es/precios',
    fr: '/fr/tarifs',
    de: '/de/preise',
    pt: '/pt/precos', 
    ja: '/ja/料金',
    ko: '/ko/가격',
    'zh-CN': '/zh/价格'
  },
  about: {
    en: '/about',
    es: '/es/acerca-de',
    fr: '/fr/a-propos',
    de: '/de/uber-uns',
    pt: '/pt/sobre',
    ja: '/ja/について', 
    ko: '/ko/소개',
    'zh-CN': '/zh/关于'
  },
  contact: {
    en: '/contact',
    es: '/es/contacto',
    fr: '/fr/contact',
    de: '/de/kontakt',
    pt: '/pt/contato',
    ja: '/ja/お問い合わせ',
    ko: '/ko/문의', 
    'zh-CN': '/zh/联系'
  },
  privacy: {
    en: '/privacy',
    es: '/es/privacidad',
    fr: '/fr/confidentialite',
    de: '/de/datenschutz',
    pt: '/pt/privacidade',
    ja: '/ja/プライバシー',
    ko: '/ko/개인정보',
    'zh-CN': '/zh/隐私'
  },
  terms: {
    en: '/terms',
    es: '/es/terminos',
    fr: '/fr/conditions', 
    de: '/de/nutzungsbedingungen',
    pt: '/pt/termos',
    ja: '/ja/利用規約',
    ko: '/ko/이용약관',
    'zh-CN': '/zh/条款'
  }
} as const

// Get localized route for a page
export const getLocalizedRoute = (
  routeKey: keyof typeof ROUTES, 
  language: string
): string => {
  const route = ROUTES[routeKey]
  return route[language as keyof typeof route] || route.en
}

// Get all language variants of a route
export const getRouteVariants = (routeKey: keyof typeof ROUTES) => {
  return ROUTES[routeKey]
}

// Detect language from current pathname
export const detectLanguageFromPath = (pathname: string): string => {
  // Remove leading slash
  const path = pathname.startsWith('/') ? pathname.slice(1) : pathname
  
  // Check for language prefixes
  const pathSegments = path.split('/')
  const firstSegment = pathSegments[0]
  
  // Direct language matches
  const languageMap: { [key: string]: string } = {
    'es': 'es',
    'fr': 'fr', 
    'de': 'de',
    'pt': 'pt',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh-CN'
  }
  
  if (languageMap[firstSegment]) {
    return languageMap[firstSegment]
  }
  
  // Default to English
  return 'en'
}

// Get route key from pathname
export const getRouteKeyFromPath = (pathname: string): keyof typeof ROUTES | null => {
  // Normalize pathname
  const normalizedPath = pathname.toLowerCase()
  
  // Check each route to find a match
  for (const [routeKey, routes] of Object.entries(ROUTES)) {
    for (const route of Object.values(routes)) {
      if (normalizedPath === route.toLowerCase() || 
          normalizedPath === route.toLowerCase() + '/') {
        return routeKey as keyof typeof ROUTES
      }
    }
  }
  
  // Check for home route (empty path or just language prefix)
  if (normalizedPath === '/' || 
      normalizedPath.match(/^\/(es|fr|de|pt|ja|ko|zh)\/?$/)) {
    return 'home'
  }
  
  return null
}

// Generate alternate URLs for current page
export const generateAlternateUrls = (
  currentRoute: keyof typeof ROUTES,
  baseUrl: string = 'https://easytimestamps.com'
) => {
  const routes = ROUTES[currentRoute]
  const alternates: Array<{ hreflang: string; href: string }> = []
  
  Object.entries(routes).forEach(([lang, path]) => {
    const langConfig = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]
    if (langConfig) {
      alternates.push({
        hreflang: langConfig.locale,
        href: `${baseUrl}${path}`
      })
    }
  })
  
  // Add x-default
  alternates.push({
    hreflang: 'x-default', 
    href: `${baseUrl}${routes.en}`
  })
  
  return alternates
}

// Redirect to localized version based on browser language
export const redirectToLocalizedRoute = (
  routeKey: keyof typeof ROUTES,
  browserLanguage?: string
) => {
  if (!browserLanguage) {
    browserLanguage = navigator.language || navigator.languages[0] || 'en-US'
  }
  
  // Extract language code from browser language
  const langCode = browserLanguage.split('-')[0].toLowerCase()
  
  // Map browser language to supported languages
  const langMap: { [key: string]: string } = {
    'es': 'es',
    'fr': 'fr',
    'de': 'de', 
    'pt': 'pt',
    'ja': 'ja',
    'ko': 'ko',
    'zh': 'zh-CN',
    'en': 'en'
  }
  
  const targetLang = langMap[langCode] || 'en'
  const localizedRoute = getLocalizedRoute(routeKey, targetLang)
  
  // Only redirect if not already on the correct localized route
  if (window.location.pathname !== localizedRoute) {
    window.history.replaceState({}, '', localizedRoute)
  }
  
  return targetLang
}

// Get breadcrumb data for current route
export const getBreadcrumbs = (
  routeKey: keyof typeof ROUTES,
  language: string
) => {
  const homeRoute = getLocalizedRoute('home', language)
  const currentRoute = getLocalizedRoute(routeKey, language)
  
  const breadcrumbs = [
    {
      name: language === 'en' ? 'Home' :
            language === 'es' ? 'Inicio' :
            language === 'fr' ? 'Accueil' :
            language === 'de' ? 'Startseite' :
            language === 'pt' ? 'Início' :
            language === 'ja' ? 'ホーム' :
            language === 'ko' ? '홈' :
            language === 'zh-CN' ? '首页' : 'Home',
      url: homeRoute
    }
  ]
  
  if (routeKey !== 'home') {
    const pageNames: { [key in keyof typeof ROUTES]: { [lang: string]: string } } = {
      home: { en: 'Home' },
      features: {
        en: 'Features',
        es: 'Características', 
        fr: 'Fonctionnalités',
        de: 'Funktionen',
        pt: 'Recursos',
        ja: '機能',
        ko: '기능',
        'zh-CN': '功能'
      },
      pricing: {
        en: 'Pricing',
        es: 'Precios',
        fr: 'Tarifs', 
        de: 'Preise',
        pt: 'Preços',
        ja: '料金',
        ko: '가격',
        'zh-CN': '价格'
      },
      about: {
        en: 'About',
        es: 'Acerca de',
        fr: 'À propos',
        de: 'Über uns', 
        pt: 'Sobre',
        ja: 'について',
        ko: '소개',
        'zh-CN': '关于'
      },
      contact: {
        en: 'Contact',
        es: 'Contacto',
        fr: 'Contact',
        de: 'Kontakt',
        pt: 'Contato', 
        ja: 'お問い合わせ',
        ko: '문의',
        'zh-CN': '联系'
      },
      privacy: {
        en: 'Privacy Policy',
        es: 'Política de Privacidad',
        fr: 'Politique de Confidentialité',
        de: 'Datenschutz',
        pt: 'Política de Privacidade',
        ja: 'プライバシーポリシー',
        ko: '개인정보 정책', 
        'zh-CN': '隐私政策'
      },
      terms: {
        en: 'Terms of Service',
        es: 'Términos de Servicio',
        fr: 'Conditions d\'Utilisation',
        de: 'Nutzungsbedingungen',
        pt: 'Termos de Serviço',
        ja: '利用規約',
        ko: '이용약관',
        'zh-CN': '服务条款'
      }
    }
    
    breadcrumbs.push({
      name: pageNames[routeKey][language] || pageNames[routeKey].en,
      url: currentRoute
    })
  }
  
  return breadcrumbs
}

// Generate sitemap URL structure
export const generateSitemapUrls = (baseUrl: string = 'https://easytimestamps.com') => {
  const urls: Array<{
    loc: string
    lastmod: string
    changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: string
    alternates: Array<{ hreflang: string; href: string }>
  }> = []
  
  const lastmod = new Date().toISOString().split('T')[0]
  
  Object.keys(ROUTES).forEach(routeKey => {
    const route = routeKey as keyof typeof ROUTES
    const alternates = generateAlternateUrls(route, baseUrl)
    
    // Add main English version
    urls.push({
      loc: `${baseUrl}${ROUTES[route].en}`,
      lastmod,
      changefreq: route === 'home' ? 'daily' : 'weekly',
      priority: route === 'home' ? '1.0' : '0.8',
      alternates
    })
    
    // Add localized versions
    Object.entries(ROUTES[route]).forEach(([lang, path]) => {
      if (lang !== 'en') {
        urls.push({
          loc: `${baseUrl}${path}`,
          lastmod,
          changefreq: route === 'home' ? 'daily' : 'weekly', 
          priority: route === 'home' ? '0.9' : '0.7',
          alternates
        })
      }
    })
  })
  
  return urls
}
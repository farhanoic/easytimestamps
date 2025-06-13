/**
 * SEO Utilities for Multi-language Site
 * Handles hreflang, meta tags, canonical URLs, and structured data
 */

// Language configuration with SEO metadata
export const SUPPORTED_LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    locale: 'en-US',
    dir: 'ltr',
    region: 'US',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: '',
      features: 'features',
      pricing: 'pricing',
      about: 'about',
      contact: 'contact',
      privacy: 'privacy',
      terms: 'terms'
    },
    seo: {
      title: 'Easy Timestamps - Free YouTube Timestamp & Chapter Generator',
      description: 'Create YouTube timestamps and video chapters instantly. Free online tool to generate timestamps for YouTube videos with copy-to-clipboard functionality.',
      keywords: 'YouTube timestamps, video chapters, timestamp generator, YouTube chapter generator'
    }
  },
  es: {
    code: 'es',
    name: 'Español',
    locale: 'es-ES',
    dir: 'ltr',
    region: 'ES',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'es',
      features: 'es/caracteristicas',
      pricing: 'es/precios',
      about: 'es/acerca-de',
      contact: 'es/contacto',
      privacy: 'es/privacidad',
      terms: 'es/terminos'
    },
    seo: {
      title: 'Easy Timestamps - Generador Gratuito de Marcas de Tiempo para YouTube',
      description: 'Crea marcas de tiempo y capítulos para YouTube al instante. Herramienta online gratuita para generar timestamps con función de copiar al portapapeles.',
      keywords: 'marcas de tiempo YouTube, capítulos de video, generador timestamps, generador capítulos YouTube'
    }
  },
  fr: {
    code: 'fr',
    name: 'Français',
    locale: 'fr-FR',
    dir: 'ltr',
    region: 'FR',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'fr',
      features: 'fr/fonctionnalites',
      pricing: 'fr/tarifs',
      about: 'fr/a-propos',
      contact: 'fr/contact',
      privacy: 'fr/confidentialite',
      terms: 'fr/conditions'
    },
    seo: {
      title: 'Easy Timestamps - Générateur Gratuit de Horodatage YouTube',
      description: 'Créez des horodatages et chapitres YouTube instantanément. Outil en ligne gratuit pour générer des timestamps avec fonction copier-coller.',
      keywords: 'horodatage YouTube, chapitres vidéo, générateur timestamps, générateur chapitres YouTube'
    }
  },
  de: {
    code: 'de',
    name: 'Deutsch',
    locale: 'de-DE',
    dir: 'ltr',
    region: 'DE',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'de',
      features: 'de/funktionen',
      pricing: 'de/preise',
      about: 'de/uber-uns',
      contact: 'de/kontakt',
      privacy: 'de/datenschutz',
      terms: 'de/nutzungsbedingungen'
    },
    seo: {
      title: 'Easy Timestamps - Kostenloser YouTube Zeitstempel Generator',
      description: 'Erstellen Sie YouTube Zeitstempel und Video-Kapitel sofort. Kostenloses Online-Tool zum Generieren von Timestamps mit Kopier-Funktion.',
      keywords: 'YouTube Zeitstempel, Video Kapitel, Zeitstempel Generator, YouTube Kapitel Generator'
    }
  },
  pt: {
    code: 'pt',
    name: 'Português',
    locale: 'pt-BR',
    dir: 'ltr',
    region: 'BR',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'pt',
      features: 'pt/recursos',
      pricing: 'pt/precos',
      about: 'pt/sobre',
      contact: 'pt/contato',
      privacy: 'pt/privacidade',
      terms: 'pt/termos'
    },
    seo: {
      title: 'Easy Timestamps - Gerador Gratuito de Marcadores de Tempo YouTube',
      description: 'Crie marcadores de tempo e capítulos do YouTube instantaneamente. Ferramenta online gratuita para gerar timestamps com função copiar.',
      keywords: 'marcadores tempo YouTube, capítulos vídeo, gerador timestamps, gerador capítulos YouTube'
    }
  },
  ja: {
    code: 'ja',
    name: '日本語',
    locale: 'ja-JP',
    dir: 'ltr',
    region: 'JP',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'ja',
      features: 'ja/機能',
      pricing: 'ja/料金',
      about: 'ja/について',
      contact: 'ja/お問い合わせ',
      privacy: 'ja/プライバシー',
      terms: 'ja/利用規約'
    },
    seo: {
      title: 'Easy Timestamps - 無料YouTubeタイムスタンプ・チャプタージェネレーター',
      description: 'YouTubeのタイムスタンプとビデオチャプターを瞬時に作成。コピー機能付きの無料オンラインタイムスタンプ生成ツール。',
      keywords: 'YouTubeタイムスタンプ, ビデオチャプター, タイムスタンプジェネレーター, YouTubeチャプタージェネレーター'
    }
  },
  ko: {
    code: 'ko',
    name: '한국어',
    locale: 'ko-KR',
    dir: 'ltr',
    region: 'KR',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'ko',
      features: 'ko/기능',
      pricing: 'ko/가격',
      about: 'ko/소개',
      contact: 'ko/문의',
      privacy: 'ko/개인정보',
      terms: 'ko/이용약관'
    },
    seo: {
      title: 'Easy Timestamps - 무료 YouTube 타임스탬프 및 챕터 생성기',
      description: 'YouTube 타임스탬프와 비디오 챕터를 즉시 생성하세요. 복사 기능이 있는 무료 온라인 타임스탬프 생성 도구입니다.',
      keywords: 'YouTube 타임스탬프, 비디오 챕터, 타임스탬프 생성기, YouTube 챕터 생성기'
    }
  },
  zh: {
    code: 'zh-CN',
    name: '中文',
    locale: 'zh-CN',
    dir: 'ltr',
    region: 'CN',
    domain: 'www.easytimestamps.com',
    slugs: {
      home: 'zh',
      features: 'zh/功能',
      pricing: 'zh/价格',
      about: 'zh/关于',
      contact: 'zh/联系',
      privacy: 'zh/隐私',
      terms: 'zh/条款'
    },
    seo: {
      title: 'Easy Timestamps - 免费YouTube时间戳和章节生成器',
      description: '即时创建YouTube时间戳和视频章节。免费在线时间戳生成工具，带复制到剪贴板功能。',
      keywords: 'YouTube时间戳, 视频章节, 时间戳生成器, YouTube章节生成器'
    }
  }
} as const

// Generate hreflang tags for current page
export const generateHrefLangTags = (currentLang: string, currentPath: string = '') => {
  const hrefLangTags: Array<{ rel: string; hreflang: string; href: string }> = []
  
  // Add self-referencing canonical
  const currentLangConfig = SUPPORTED_LANGUAGES[currentLang as keyof typeof SUPPORTED_LANGUAGES]
  if (currentLangConfig) {
    hrefLangTags.push({
      rel: 'canonical',
      hreflang: currentLangConfig.locale,
      href: `https://${currentLangConfig.domain}/${currentPath}`
    })
  }
  
  // Add alternate language versions
  Object.values(SUPPORTED_LANGUAGES).forEach(lang => {
    if (lang.code !== currentLang) {
      const href = `https://${lang.domain}/${currentPath ? getLocalizedPath(currentPath, lang.code) : lang.slugs.home}`
      hrefLangTags.push({
        rel: 'alternate',
        hreflang: lang.locale,
        href: href
      })
    }
  })
  
  // Add x-default for main language
  hrefLangTags.push({
    rel: 'alternate',
    hreflang: 'x-default',
    href: `https://${SUPPORTED_LANGUAGES.en.domain}/`
  })
  
  return hrefLangTags
}

// Get localized path for a given route
export const getLocalizedPath = (path: string, targetLang: string) => {
  const langConfig = SUPPORTED_LANGUAGES[targetLang as keyof typeof SUPPORTED_LANGUAGES]
  if (!langConfig) return path
  
  // Map English paths to localized paths
  const pathMappings: { [key: string]: string } = {
    '': langConfig.slugs.home,
    'features': langConfig.slugs.features,
    'pricing': langConfig.slugs.pricing,
    'about': langConfig.slugs.about,
    'contact': langConfig.slugs.contact,
    'privacy': langConfig.slugs.privacy,
    'terms': langConfig.slugs.terms
  }
  
  return pathMappings[path] || `${langConfig.slugs.home}/${path}`
}

// Generate structured data for the application
export const generateStructuredData = (lang: string) => {
  const langConfig = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]
  if (!langConfig) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': langConfig.seo.title,
    'url': `https://${langConfig.domain}/${langConfig.slugs.home}`,
    'description': langConfig.seo.description,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Web Browser',
    'inLanguage': langConfig.locale,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': langConfig.region === 'US' ? 'USD' : langConfig.region === 'ES' ? 'EUR' : 'USD'
    },
    'creator': {
      '@type': 'Organization',
      'name': 'Easy Timestamps',
      'url': `https://${langConfig.domain}`
    },
    'featureList': [
      lang === 'en' ? 'YouTube timestamp generation' : 
      lang === 'es' ? 'Generación de marcas de tiempo para YouTube' :
      lang === 'fr' ? 'Génération d\'horodatage YouTube' :
      lang === 'de' ? 'YouTube Zeitstempel-Generierung' :
      lang === 'pt' ? 'Geração de marcadores de tempo YouTube' :
      lang === 'ja' ? 'YouTubeタイムスタンプ生成' :
      lang === 'ko' ? 'YouTube 타임스탬프 생성' :
      lang === 'zh-CN' ? 'YouTube时间戳生成' : 'YouTube timestamp generation',
      
      lang === 'en' ? 'Video chapter creation' :
      lang === 'es' ? 'Creación de capítulos de video' :
      lang === 'fr' ? 'Création de chapitres vidéo' :
      lang === 'de' ? 'Video-Kapitel-Erstellung' :
      lang === 'pt' ? 'Criação de capítulos de vídeo' :
      lang === 'ja' ? 'ビデオチャプター作成' :
      lang === 'ko' ? '비디오 챕터 생성' :
      lang === 'zh-CN' ? '视频章节创建' : 'Video chapter creation',
      
      lang === 'en' ? 'Copy to clipboard functionality' :
      lang === 'es' ? 'Función copiar al portapapeles' :
      lang === 'fr' ? 'Fonction copier-coller' :
      lang === 'de' ? 'Kopieren-Funktion' :
      lang === 'pt' ? 'Função copiar' :
      lang === 'ja' ? 'クリップボードコピー機能' :
      lang === 'ko' ? '클립보드 복사 기능' :
      lang === 'zh-CN' ? '复制到剪贴板功能' : 'Copy to clipboard functionality'
    ],
    'keywords': langConfig.seo.keywords,
    'isAccessibleForFree': true,
    'browserRequirements': 'Modern web browser with JavaScript enabled'
  }
}

// Generate Open Graph meta tags
export const generateOpenGraphTags = (lang: string, path: string = '') => {
  const langConfig = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]
  if (!langConfig) return {}
  
  const url = `https://${langConfig.domain}/${path}`
  
  return {
    'og:type': 'website',
    'og:url': url,
    'og:title': langConfig.seo.title,
    'og:description': langConfig.seo.description,
    'og:image': `https://${langConfig.domain}/og-image-${lang}.jpg`,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:type': 'image/jpeg',
    'og:image:alt': langConfig.seo.title,
    'og:site_name': 'Easy Timestamps',
    'og:locale': langConfig.locale,
    'twitter:card': 'summary_large_image',
    'twitter:url': url,
    'twitter:title': langConfig.seo.title.substring(0, 70), // Twitter title limit
    'twitter:description': langConfig.seo.description.substring(0, 200), // Twitter description limit
    'twitter:image': `https://${langConfig.domain}/og-image-${lang}.jpg`
  }
}

// Generate meta keywords for better SEO
export const generateMetaKeywords = (lang: string, pageType: string = 'home') => {
  const langConfig = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]
  if (!langConfig) return ''
  
  const baseKeywords = langConfig.seo.keywords
  
  // Add page-specific keywords
  const pageKeywords: { [key: string]: { [key: string]: string } } = {
    features: {
      en: 'video editing tools, timestamp features, YouTube tools',
      es: 'herramientas edición video, características timestamps, herramientas YouTube',
      fr: 'outils édition vidéo, fonctionnalités horodatage, outils YouTube',
      de: 'Video-Bearbeitungstools, Zeitstempel-Funktionen, YouTube-Tools',
      pt: 'ferramentas edição vídeo, recursos timestamps, ferramentas YouTube',
      ja: '動画編集ツール, タイムスタンプ機能, YouTubeツール',
      ko: '비디오 편집 도구, 타임스탬프 기능, YouTube 도구',
      'zh-CN': '视频编辑工具, 时间戳功能, YouTube工具'
    },
    pricing: {
      en: 'free video tools, premium features, subscription plans',
      es: 'herramientas video gratis, características premium, planes suscripción',
      fr: 'outils vidéo gratuits, fonctionnalités premium, plans abonnement',
      de: 'kostenlose Video-Tools, Premium-Funktionen, Abonnement-Pläne',
      pt: 'ferramentas vídeo grátis, recursos premium, planos assinatura',
      ja: '無料動画ツール, プレミアム機能, サブスクリプションプラン',
      ko: '무료 비디오 도구, 프리미엄 기능, 구독 계획',
      'zh-CN': '免费视频工具, 高级功能, 订阅计划'
    }
  }
  
  const additionalKeywords = pageKeywords[pageType]?.[lang] || ''
  return additionalKeywords ? `${baseKeywords}, ${additionalKeywords}` : baseKeywords
}

// SEO utility to check and update document meta tags
export const updateDocumentSEO = (lang: string, pageType: string = 'home', customPath?: string) => {
  const langConfig = SUPPORTED_LANGUAGES[lang as keyof typeof SUPPORTED_LANGUAGES]
  if (!langConfig || typeof document === 'undefined') return
  
  // Update title
  document.title = langConfig.seo.title
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', langConfig.seo.description)
  }
  
  // Update meta keywords
  const metaKeywords = document.querySelector('meta[name="keywords"]')
  if (metaKeywords) {
    metaKeywords.setAttribute('content', generateMetaKeywords(lang, pageType))
  }
  
  // Update lang attribute on html element
  const htmlElement = document.documentElement
  htmlElement.setAttribute('lang', langConfig.code)
  htmlElement.setAttribute('dir', langConfig.dir)
  
  // Update Open Graph tags
  const ogTags = generateOpenGraphTags(lang, customPath)
  Object.entries(ogTags).forEach(([property, content]) => {
    let metaTag = document.querySelector(`meta[property="${property}"]`)
    if (!metaTag) {
      metaTag = document.createElement('meta')
      metaTag.setAttribute('property', property)
      document.head.appendChild(metaTag)
    }
    metaTag.setAttribute('content', content)
  })
  
  // Add/update canonical link
  let canonicalLink = document.querySelector('link[rel="canonical"]')
  if (!canonicalLink) {
    canonicalLink = document.createElement('link')
    canonicalLink.setAttribute('rel', 'canonical')
    document.head.appendChild(canonicalLink)
  }
  const canonicalUrl = customPath 
    ? `https://${langConfig.domain}/${customPath}`
    : `https://${langConfig.domain}/${langConfig.slugs.home}`
  canonicalLink.setAttribute('href', canonicalUrl)
  
  // Add hreflang tags
  // Remove existing hreflang tags
  document.querySelectorAll('link[hreflang]').forEach(link => link.remove())
  
  // Add new hreflang tags
  const hrefLangTags = generateHrefLangTags(lang, customPath)
  hrefLangTags.forEach(tag => {
    const link = document.createElement('link')
    link.setAttribute('rel', tag.rel)
    link.setAttribute('hreflang', tag.hreflang)
    link.setAttribute('href', tag.href)
    document.head.appendChild(link)
  })
  
  // Update structured data
  let structuredDataScript = document.querySelector('script[type="application/ld+json"]')
  if (!structuredDataScript) {
    structuredDataScript = document.createElement('script')
    structuredDataScript.setAttribute('type', 'application/ld+json')
    document.head.appendChild(structuredDataScript)
  }
  structuredDataScript.textContent = JSON.stringify(generateStructuredData(lang), null, 2)
}

// Generate sitemap entries for all languages
export const generateSitemapEntries = () => {
  const entries: Array<{
    url: string
    lastmod: string
    changefreq: string
    priority: string
    lang: string
    alternates: Array<{ lang: string; url: string }>
  }> = []
  
  const pages = ['', 'features', 'pricing', 'about', 'contact', 'privacy', 'terms']
  const lastmod = new Date().toISOString().split('T')[0]
  
  Object.values(SUPPORTED_LANGUAGES).forEach(langConfig => {
    pages.forEach(page => {
      const localizedPath = page ? getLocalizedPath(page, langConfig.code) : langConfig.slugs.home
      const url = `https://${langConfig.domain}/${localizedPath}`
      
      // Generate alternates for this page
      const alternates = Object.values(SUPPORTED_LANGUAGES).map(altLang => ({
        lang: altLang.locale,
        url: `https://${altLang.domain}/${page ? getLocalizedPath(page, altLang.code) : altLang.slugs.home}`
      }))
      
      entries.push({
        url,
        lastmod,
        changefreq: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? '1.0' : '0.8',
        lang: langConfig.locale,
        alternates
      })
    })
  })
  
  return entries
}
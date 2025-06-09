import { useEffect } from 'react'
import { useLocalization } from '../hooks/useLocalization'
import { 
  updateDocumentSEO, 
  generateHrefLangTags, 
  generateStructuredData,
  generateOpenGraphTags,
  generateMetaKeywords
} from '../utils/seoUtils'

interface SEOHeadProps {
  pageType?: string
  customTitle?: string
  customDescription?: string
  customKeywords?: string
  customPath?: string
}

const SEOHead: React.FC<SEOHeadProps> = ({ 
  pageType = 'home',
  customTitle,
  customDescription,
  customKeywords,
  customPath
}) => {
  const { locale, isRTL } = useLocalization()
  const currentLanguage = locale

  useEffect(() => {
    // Update all SEO meta tags when language changes
    updateDocumentSEO(currentLanguage, pageType, customPath)
    
    // Override with custom values if provided
    if (customTitle) {
      document.title = customTitle
    }
    
    if (customDescription) {
      const metaDescription = document.querySelector('meta[name="description"]')
      if (metaDescription) {
        metaDescription.setAttribute('content', customDescription)
      }
    }
    
    if (customKeywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]')
      if (metaKeywords) {
        metaKeywords.setAttribute('content', customKeywords)
      }
    }
    
  }, [currentLanguage, pageType, customTitle, customDescription, customKeywords, customPath])

  // Set RTL direction when needed
  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr')
  }, [isRTL])

  return null // This component only manages document head, no visual rendering
}

export default SEOHead

// Hook for generating SEO data without side effects
export const useSEOData = (lang: string, pageType: string = 'home') => {
  return {
    hrefLangTags: generateHrefLangTags(lang),
    structuredData: generateStructuredData(lang),
    openGraphTags: generateOpenGraphTags(lang),
    metaKeywords: generateMetaKeywords(lang, pageType)
  }
}
/**
 * Translation Quality Assurance Utilities
 * Automated checks for translation completeness, consistency, and quality
 */

import { SUPPORTED_LANGUAGES } from './seoUtils'

// Define UI element character limits
export const CHARACTER_LIMITS = {
  button: 20,
  menu_item: 25,
  navigation: 30,
  title: 60,
  description: 160,
  error_message: 120,
  tooltip: 80,
  form_label: 40,
  form_placeholder: 50,
  notification: 100
} as const

// Language-specific character multipliers (some languages are naturally longer/shorter)
export const LANGUAGE_MULTIPLIERS = {
  'en': 1.0,
  'es': 1.15,  // Spanish tends to be 15% longer
  'fr': 1.2,   // French tends to be 20% longer
  'de': 1.3,   // German can be 30% longer due to compound words
  'pt': 1.1,   // Portuguese slightly longer
  'ja': 0.8,   // Japanese often shorter due to ideograms
  'ko': 0.9,   // Korean slightly shorter
  'zh-CN': 0.7 // Chinese typically much shorter
} as const

export interface TranslationIssue {
  type: 'missing' | 'consistency' | 'length' | 'encoding' | 'cultural'
  severity: 'critical' | 'warning' | 'info'
  language: string
  key: string
  message: string
  suggestion?: string
  context?: string
}

interface TranslationStats {
  totalKeys: number
  translatedKeys: number
  missingKeys: number
  completionRate: number
  issues: TranslationIssue[]
}

// Load translation files dynamically
export const loadTranslationFile = async (language: string): Promise<Record<string, any>> => {
  try {
    const module = await import(`../i18n/locales/${language}.json`)
    return module.default || module
  } catch (error) {
    console.error(`Failed to load translation file for ${language}:`, error)
    return {}
  }
}

// Flatten nested object to dot notation
export const flattenObject = (obj: Record<string, any>, prefix = ''): Record<string, string> => {
  const flattened: Record<string, string> = {}
  
  Object.keys(obj).forEach(key => {
    const value = obj[key]
    const newKey = prefix ? `${prefix}.${key}` : key
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey))
    } else {
      flattened[newKey] = String(value)
    }
  })
  
  return flattened
}

// Check for missing translations
export const detectMissingTranslations = async (): Promise<TranslationIssue[]> => {
  const issues: TranslationIssue[] = []
  const allTranslations: Record<string, Record<string, string>> = {}
  
  // Load all translation files
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  for (const lang of languages) {
    const translations = await loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  }
  
  // Use English as the reference
  const englishKeys = Object.keys(allTranslations.en || {})
  
  // Check each language for missing keys
  languages.forEach(lang => {
    if (lang === 'en') return // Skip reference language
    
    const langTranslations = allTranslations[lang] || {}
    
    englishKeys.forEach(key => {
      if (!langTranslations[key] || langTranslations[key].trim() === '') {
        issues.push({
          type: 'missing',
          severity: 'critical',
          language: lang,
          key,
          message: `Missing translation for key "${key}"`,
          suggestion: `Add translation: "${allTranslations.en[key]}"`,
          context: allTranslations.en[key]
        })
      }
    })
    
    // Check for keys that exist in other languages but not in English
    Object.keys(langTranslations).forEach(key => {
      if (!englishKeys.includes(key)) {
        issues.push({
          type: 'consistency',
          severity: 'warning',
          language: lang,
          key,
          message: `Extra key "${key}" found that doesn't exist in English`,
          suggestion: 'Remove unused key or add to English translations'
        })
      }
    })
  })
  
  return issues
}

// Check translation consistency (same placeholders, HTML tags, etc.)
export const checkTranslationConsistency = async (): Promise<TranslationIssue[]> => {
  const issues: TranslationIssue[] = []
  const allTranslations: Record<string, Record<string, string>> = {}
  
  // Load all translation files
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  for (const lang of languages) {
    const translations = await loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  }
  
  const englishTranslations = allTranslations.en || {}
  
  // Check each key across all languages
  Object.keys(englishTranslations).forEach(key => {
    const englishValue = englishTranslations[key]
    
    // Extract placeholders like {{variable}} or {variable}
    const placeholderRegex = /\{\{?([^}]+)\}?\}/g
    const englishPlaceholders = (englishValue.match(placeholderRegex) || []).sort()
    
    // Extract HTML tags
    const htmlTagRegex = /<[^>]+>/g
    const englishTags = (englishValue.match(htmlTagRegex) || []).sort()
    
    languages.forEach(lang => {
      if (lang === 'en') return
      
      const langValue = allTranslations[lang]?.[key]
      if (!langValue) return
      
      // Check placeholders
      const langPlaceholders = (langValue.match(placeholderRegex) || []).sort()
      if (JSON.stringify(englishPlaceholders) !== JSON.stringify(langPlaceholders)) {
        issues.push({
          type: 'consistency',
          severity: 'critical',
          language: lang,
          key,
          message: `Placeholder mismatch in "${key}"`,
          suggestion: `Expected placeholders: ${englishPlaceholders.join(', ')}. Found: ${langPlaceholders.join(', ')}`,
          context: `EN: ${englishValue}\n${lang.toUpperCase()}: ${langValue}`
        })
      }
      
      // Check HTML tags
      const langTags = (langValue.match(htmlTagRegex) || []).sort()
      if (JSON.stringify(englishTags) !== JSON.stringify(langTags)) {
        issues.push({
          type: 'consistency',
          severity: 'warning',
          language: lang,
          key,
          message: `HTML tag mismatch in "${key}"`,
          suggestion: `Expected tags: ${englishTags.join(', ')}. Found: ${langTags.join(', ')}`,
          context: `EN: ${englishValue}\n${lang.toUpperCase()}: ${langValue}`
        })
      }
    })
  })
  
  return issues
}

// Validate character limits for UI elements
export const validateCharacterLimits = async (): Promise<TranslationIssue[]> => {
  const issues: TranslationIssue[] = []
  const allTranslations: Record<string, Record<string, string>> = {}
  
  // Load all translation files
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  for (const lang of languages) {
    const translations = await loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  }
  
  // Define UI element patterns and their limits
  const uiPatterns = [
    { pattern: /^(button|btn)\./, limit: CHARACTER_LIMITS.button, type: 'button' },
    { pattern: /^(nav|navigation|menu)\./, limit: CHARACTER_LIMITS.navigation, type: 'navigation' },
    { pattern: /^(title|heading)\./, limit: CHARACTER_LIMITS.title, type: 'title' },
    { pattern: /^(error|err)\./, limit: CHARACTER_LIMITS.error_message, type: 'error_message' },
    { pattern: /^(tooltip|tip)\./, limit: CHARACTER_LIMITS.tooltip, type: 'tooltip' },
    { pattern: /^(label)\./, limit: CHARACTER_LIMITS.form_label, type: 'form_label' },
    { pattern: /^(placeholder)\./, limit: CHARACTER_LIMITS.form_placeholder, type: 'form_placeholder' }
  ]
  
  languages.forEach(lang => {
    const langTranslations = allTranslations[lang] || {}
    const multiplier = LANGUAGE_MULTIPLIERS[lang as keyof typeof LANGUAGE_MULTIPLIERS] || 1.0
    
    Object.entries(langTranslations).forEach(([key, value]) => {
      uiPatterns.forEach(({ pattern, limit, type }) => {
        if (pattern.test(key)) {
          const adjustedLimit = Math.floor(limit * multiplier)
          const cleanValue = value.replace(/<[^>]+>/g, '').trim() // Remove HTML tags
          
          if (cleanValue.length > adjustedLimit) {
            issues.push({
              type: 'length',
              severity: cleanValue.length > adjustedLimit * 1.5 ? 'critical' : 'warning',
              language: lang,
              key,
              message: `Text too long for ${type} (${cleanValue.length}/${adjustedLimit} chars)`,
              suggestion: `Consider shortening text. Current: "${cleanValue}"`,
              context: `UI Element: ${type}, Language multiplier: ${multiplier}`
            })
          }
        }
      })
    })
  })
  
  return issues
}

// Check for proper encoding of special characters
export const validateSpecialCharacters = async (): Promise<TranslationIssue[]> => {
  const issues: TranslationIssue[] = []
  const allTranslations: Record<string, Record<string, string>> = {}
  
  // Load all translation files
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  for (const lang of languages) {
    const translations = await loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  }
  
  // Define problematic character patterns (commented out to fix build)
  // const encodingIssues = [
  //   { pattern: /[\u00C0-\u00FF]/, test: (text: string) => !/^[\x00-\x7F]*$/.test(text), name: 'Latin extended characters' },
  //   { pattern: /[\u0100-\u017F]/, test: (text: string) => /[\u0100-\u017F]/.test(text), name: 'Latin extended A' },
  //   { pattern: /[\u4E00-\u9FFF]/, test: (text: string) => /[\u4E00-\u9FFF]/.test(text), name: 'CJK characters' },
  //   { pattern: /[\u3040-\u309F\u30A0-\u30FF]/, test: (text: string) => /[\u3040-\u309F\u30A0-\u30FF]/.test(text), name: 'Japanese characters' },
  //   { pattern: /[\uAC00-\uD7AF]/, test: (text: string) => /[\uAC00-\uD7AF]/.test(text), name: 'Korean characters' },
  //   { pattern: /[\u0600-\u06FF]/, test: (text: string) => /[\u0600-\u06FF]/.test(text), name: 'Arabic characters' }
  // ]
  
  languages.forEach(lang => {
    const langTranslations = allTranslations[lang] || {}
    
    Object.entries(langTranslations).forEach(([key, value]) => {
      // Check for common encoding issues
      if (value.includes('Ã') || value.includes('â€™') || value.includes('Â')) {
        issues.push({
          type: 'encoding',
          severity: 'critical',
          language: lang,
          key,
          message: `Potential encoding issue detected`,
          suggestion: `Check for UTF-8 encoding problems in: "${value}"`,
          context: 'Common double-encoding artifacts found'
        })
      }
      
      // Check for invisible/control characters
      if (/[\u0000-\u001F\u007F-\u009F]/.test(value)) {
        issues.push({
          type: 'encoding',
          severity: 'warning',
          language: lang,
          key,
          message: `Control characters detected`,
          suggestion: `Remove invisible characters from: "${value}"`,
          context: 'Non-printable characters found'
        })
      }
      
      // Language-specific character validation
      const expectedCharSets = {
        'ja': /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF]/,
        'ko': /[\uAC00-\uD7AF]/,
        'zh-CN': /[\u4E00-\u9FFF]/,
        'de': /[äöüßÄÖÜ]/,
        'fr': /[àâäéèêëïîôöùûüÿçÀÂÄÉÈÊËÏÎÔÖÙÛÜŸÇ]/,
        'es': /[áéíóúñüÁÉÍÓÚÑÜ¿¡]/,
        'pt': /[áàâãéêíóôõúçÁÀÂÃÉÊÍÓÔÕÚÇ]/
      }
      
      const expectedPattern = expectedCharSets[lang as keyof typeof expectedCharSets]
      if (expectedPattern && lang !== 'en') {
        // For non-English languages, warn if no language-specific characters are found
        // (might indicate missing localization)
        if (!expectedPattern.test(value) && value.length > 10) {
          issues.push({
            type: 'cultural',
            severity: 'info',
            language: lang,
            key,
            message: `No language-specific characters found`,
            suggestion: `Verify this is properly translated: "${value}"`,
            context: `Expected to see characters typical for ${lang}`
          })
        }
      }
    })
  })
  
  return issues
}

// Generate comprehensive translation quality report
export const generateQualityReport = async (): Promise<{
  summary: Record<string, TranslationStats>
  allIssues: TranslationIssue[]
  recommendations: string[]
}> => {
  console.log('🔍 Running translation quality assurance checks...')
  
  const [missingIssues, consistencyIssues, lengthIssues, encodingIssues] = await Promise.all([
    detectMissingTranslations(),
    checkTranslationConsistency(), 
    validateCharacterLimits(),
    validateSpecialCharacters()
  ])
  
  const allIssues = [...missingIssues, ...consistencyIssues, ...lengthIssues, ...encodingIssues]
  
  // Generate stats per language
  const summary: Record<string, TranslationStats> = {}
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  
  for (const lang of languages) {
    const translations = await loadTranslationFile(lang)
    const flattened = flattenObject(translations)
    const langIssues = allIssues.filter(issue => issue.language === lang)
    const missingCount = langIssues.filter(issue => issue.type === 'missing').length
    const totalKeys = Object.keys(flattenObject(await loadTranslationFile('en'))).length
    
    summary[lang] = {
      totalKeys,
      translatedKeys: Object.keys(flattened).length,
      missingKeys: missingCount,
      completionRate: ((totalKeys - missingCount) / totalKeys) * 100,
      issues: langIssues
    }
  }
  
  // Generate recommendations
  const recommendations = [
    'Review all critical issues before deployment',
    'Test UI layouts with longest translations (German, French)',
    'Verify special character rendering in browsers',
    'Consider hiring native speakers for major markets',
    'Implement automated QA checks in CI/CD pipeline',
    'Use translation memory tools for consistency',
    'Regular cultural appropriateness reviews'
  ]
  
  return { summary, allIssues, recommendations }
}

// Export issues to different formats
export const exportIssues = (issues: TranslationIssue[], format: 'json' | 'csv' | 'markdown' = 'json') => {
  switch (format) {
    case 'csv':
      const headers = ['Type', 'Severity', 'Language', 'Key', 'Message', 'Suggestion']
      const rows = issues.map(issue => [
        issue.type,
        issue.severity,
        issue.language,
        issue.key,
        `"${issue.message}"`,
        `"${issue.suggestion || ''}"`
      ])
      return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
      
    case 'markdown':
      return `# Translation Quality Issues\n\n${issues.map(issue => 
        `## ${issue.severity.toUpperCase()}: ${issue.type}\n` +
        `**Language:** ${issue.language}\n` +
        `**Key:** \`${issue.key}\`\n` +
        `**Issue:** ${issue.message}\n` +
        `**Suggestion:** ${issue.suggestion || 'N/A'}\n` +
        (issue.context ? `**Context:** ${issue.context}\n` : '') +
        '\n---\n'
      ).join('\n')}`
      
    default:
      return JSON.stringify(issues, null, 2)
  }
}
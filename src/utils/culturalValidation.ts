/**
 * Cultural Appropriateness Validation
 * Checks for cultural sensitivity and appropriateness across different languages and regions
 */

import { SUPPORTED_LANGUAGES } from './seoUtils'

interface CulturalIssue {
  type: 'cultural' | 'religious' | 'political' | 'social' | 'formatting' | 'legal'
  severity: 'critical' | 'warning' | 'info'
  language: string
  key: string
  message: string
  suggestion: string
  context?: string
  category: string
}

// Cultural patterns and guidelines for different regions
export const CULTURAL_GUIDELINES = {
  // Western cultures (US, UK, Canada, Australia)
  western: {
    timeFormat: '12-hour',
    dateFormat: 'MM/DD/YYYY',
    weekStart: 'sunday',
    currency: ['USD', 'GBP', 'CAD', 'AUD'],
    colors: {
      positive: ['green', 'blue'],
      negative: ['red'],
      neutral: ['gray', 'white', 'black']
    },
    avoided_topics: ['politics', 'religion', 'personal_income'],
    formality: 'casual_to_formal'
  },
  
  // European cultures
  european: {
    timeFormat: '24-hour',
    dateFormat: 'DD/MM/YYYY',
    weekStart: 'monday',
    currency: ['EUR', 'GBP', 'CHF'],
    colors: {
      positive: ['green', 'blue'],
      negative: ['red'],
      neutral: ['gray', 'white']
    },
    avoided_topics: ['personal_income', 'age', 'weight'],
    formality: 'formal'
  },
  
  // East Asian cultures (Japan, Korea, China)
  east_asian: {
    timeFormat: '24-hour',
    dateFormat: 'YYYY/MM/DD',
    weekStart: 'monday',
    currency: ['JPY', 'KRW', 'CNY'],
    colors: {
      positive: ['red', 'gold', 'yellow'], // Red is lucky in China
      negative: ['white', 'black'], // White for mourning in some contexts
      neutral: ['blue', 'green']
    },
    avoided_topics: ['politics', 'historical_conflicts', 'personal_failure'],
    formality: 'very_formal',
    hierarchy: 'important',
    age_respect: 'critical'
  },
  
  // Latin American cultures
  latin_american: {
    timeFormat: '12-hour',
    dateFormat: 'DD/MM/YYYY',
    weekStart: 'monday',
    currency: ['MXN', 'BRL', 'ARS', 'COP'],
    colors: {
      positive: ['green', 'blue', 'yellow'],
      negative: ['red', 'black'],
      neutral: ['white', 'gray']
    },
    avoided_topics: ['politics', 'class_differences'],
    formality: 'formal_with_warmth',
    family: 'very_important'
  }
} as const

// Language to cultural region mapping
export const LANGUAGE_CULTURE_MAP = {
  'en': 'western',
  'es': 'latin_american',
  'fr': 'european',
  'de': 'european',
  'pt': 'latin_american',
  'ja': 'east_asian',
  'ko': 'east_asian',
  'zh-CN': 'east_asian'
} as const

// Problematic terms and phrases that should be avoided or handled carefully
export const CULTURAL_SENSITIVITY_PATTERNS = {
  // Religious references
  religious: {
    patterns: [
      /\b(christmas|easter|hannukah|ramadan|diwali)\b/i,
      /\b(church|mosque|temple|synagogue)\b/i,
      /\b(prayer|blessing|holy|sacred)\b/i,
      /\b(god|allah|buddha|jesus|muhammad)\b/i
    ],
    severity: 'warning',
    message: 'Religious reference detected',
    suggestion: 'Consider using more inclusive language or provide alternatives for different religious backgrounds'
  },
  
  // Political references
  political: {
    patterns: [
      /\b(democracy|dictatorship|election|vote|government)\b/i,
      /\b(president|prime minister|congress|parliament)\b/i,
      /\b(left|right|liberal|conservative|socialist|capitalist)\b/i
    ],
    severity: 'warning',
    message: 'Political reference detected',
    suggestion: 'Consider neutral language that doesn\'t assume political systems or preferences'
  },
  
  // Cultural assumptions
  cultural_assumptions: {
    patterns: [
      /\b(nuclear family|traditional family)\b/i,
      /\b(western|eastern|oriental)\b/i,
      /\b(developed|developing|third world)\b/i,
      /\b(normal|standard|typical)\b/i
    ],
    severity: 'info',
    message: 'Cultural assumption detected',
    suggestion: 'Consider if this term makes assumptions about user backgrounds or cultures'
  },
  
  // Gender assumptions
  gender: {
    patterns: [
      /\b(he\/she|his\/her)\b/i,
      /\b(chairman|spokesman|manpower)\b/i,
      /\b(guys|dudes)\b/i
    ],
    severity: 'warning',
    message: 'Gender-specific language detected',
    suggestion: 'Consider using gender-neutral alternatives (they/them, chairperson, workforce, everyone)'
  },
  
  // Age assumptions
  age: {
    patterns: [
      /\b(young people|old people|elderly|seniors)\b/i,
      /\b(kids these days|back in my day)\b/i
    ],
    severity: 'info',
    message: 'Age-related assumption detected',
    suggestion: 'Consider age-neutral language that doesn\'t exclude any age groups'
  },
  
  // Economic assumptions
  economic: {
    patterns: [
      /\b(cheap|expensive|affordable)\b/i,
      /\b(everyone has|all users have)\b/i,
      /\b(simply|just|easily)\b/i
    ],
    severity: 'info',
    message: 'Economic or accessibility assumption detected',
    suggestion: 'Consider that users may have different economic situations or technical capabilities'
  }
}

// Date and time format validation
export const DATE_TIME_PATTERNS = {
  us_date: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // MM/DD/YYYY
  eu_date: /\b\d{1,2}\/\d{1,2}\/\d{4}\b/, // DD/MM/YYYY (same pattern, different meaning)
  iso_date: /\b\d{4}-\d{2}-\d{2}\b/, // YYYY-MM-DD
  time_12h: /\b\d{1,2}:\d{2}\s?(AM|PM|am|pm)\b/,
  time_24h: /\b\d{1,2}:\d{2}\b/
}

// Currency and number format validation
export const NUMBER_FORMAT_PATTERNS = {
  us_decimal: /\d+\.\d+/, // 1.23
  eu_decimal: /\d+,\d+/, // 1,23
  us_thousands: /\d{1,3}(,\d{3})+/, // 1,000
  eu_thousands: /\d{1,3}(\.\d{3})+/, // 1.000
  currency_symbols: /[$€£¥₩￥]/
}

// Color usage validation for different cultures
export const validateColorUsage = async (text: string, language: string): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  const culture = LANGUAGE_CULTURE_MAP[language as keyof typeof LANGUAGE_CULTURE_MAP]
  const guidelines = CULTURAL_GUIDELINES[culture]
  
  if (!guidelines) return issues
  
  // Check for color mentions that might have cultural significance
  const colorPatterns = {
    red: /\b(red|rouge|rojo|rot|vermelho|赤|빨간|红色)\b/i,
    white: /\b(white|blanc|blanco|weiß|branco|白|하얀|白色)\b/i,
    black: /\b(black|noir|negro|schwarz|preto|黒|검은|黑色)\b/i,
    green: /\b(green|vert|verde|grün|verde|緑|녹색|绿色)\b/i,
    blue: /\b(blue|bleu|azul|blau|azul|青|파란|蓝色)\b/i
  }
  
  Object.entries(colorPatterns).forEach(([color, pattern]) => {
    if (pattern.test(text)) {
      // Check if color has negative connotations in this culture
      if (culture === 'east_asian' && color === 'white' && text.includes('negative')) {
        issues.push({
          type: 'cultural',
          severity: 'warning',
          language,
          key: 'color_usage',
          message: `White color used in negative context - has mourning connotations in ${culture} cultures`,
          suggestion: 'Consider using gray or other neutral colors instead',
          category: 'color_symbolism',
          context: text
        })
      }
      
      if (culture === 'east_asian' && color === 'red' && text.includes('error')) {
        issues.push({
          type: 'cultural',
          severity: 'info',
          language,
          key: 'color_usage',
          message: `Red color for errors - note that red is lucky in ${culture} cultures`,
          suggestion: 'Red is acceptable for errors but be aware of positive connotations',
          category: 'color_symbolism',
          context: text
        })
      }
    }
  })
  
  return issues
}

// Validate cultural sensitivity
export const validateCulturalSensitivity = async (text: string, language: string, key: string): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  
  Object.entries(CULTURAL_SENSITIVITY_PATTERNS).forEach(([category, config]) => {
    config.patterns.forEach(pattern => {
      if (pattern.test(text)) {
        issues.push({
          type: 'cultural',
          severity: config.severity as 'critical' | 'warning' | 'info',
          language,
          key,
          message: config.message,
          suggestion: config.suggestion,
          category,
          context: text
        })
      }
    })
  })
  
  return issues
}

// Validate date and time formats
export const validateDateTimeFormats = async (text: string, language: string, key: string): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  const culture = LANGUAGE_CULTURE_MAP[language as keyof typeof LANGUAGE_CULTURE_MAP]
  const guidelines = CULTURAL_GUIDELINES[culture]
  
  if (!guidelines) return issues
  
  // Check for date format consistency
  if (DATE_TIME_PATTERNS.us_date.test(text) && guidelines.dateFormat !== 'MM/DD/YYYY') {
    issues.push({
      type: 'formatting',
      severity: 'warning',
      language,
      key,
      message: `US date format (MM/DD/YYYY) used in ${culture} culture`,
      suggestion: `Consider using ${guidelines.dateFormat} format instead`,
      category: 'date_format',
      context: text
    })
  }
  
  // Check for time format consistency
  if (DATE_TIME_PATTERNS.time_12h.test(text) && guidelines.timeFormat === '24-hour') {
    issues.push({
      type: 'formatting',
      severity: 'info',
      language,
      key,
      message: `12-hour time format used in ${culture} culture`,
      suggestion: `Consider using 24-hour format (${guidelines.timeFormat})`,
      category: 'time_format',
      context: text
    })
  }
  
  return issues
}

// Validate number and currency formats
export const validateNumberFormats = async (text: string, language: string, key: string): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  const culture = LANGUAGE_CULTURE_MAP[language as keyof typeof LANGUAGE_CULTURE_MAP]
  const guidelines = CULTURAL_GUIDELINES[culture]
  
  if (!guidelines) return issues
  
  // Check for decimal separator consistency
  if (NUMBER_FORMAT_PATTERNS.us_decimal.test(text) && culture === 'european') {
    issues.push({
      type: 'formatting',
      severity: 'warning',
      language,
      key,
      message: 'US decimal format (1.23) used in European culture',
      suggestion: 'Consider using European decimal format (1,23)',
      category: 'number_format',
      context: text
    })
  }
  
  // Check for currency symbols
  if (NUMBER_FORMAT_PATTERNS.currency_symbols.test(text)) {
    const hasAppropriateSymbol = guidelines.currency.some(curr => {
      const symbols: Record<string, string> = {
        'USD': '$', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'KRW': '₩', 'CNY': '￥'
      }
      return text.includes(symbols[curr])
    })
    
    if (!hasAppropriateSymbol) {
      issues.push({
        type: 'formatting',
        severity: 'info',
        language,
        key,
        message: `Currency symbol may not match local expectations for ${culture}`,
        suggestion: `Consider using appropriate currency for ${culture}: ${guidelines.currency.join(', ')}`,
        category: 'currency_format',
        context: text
      })
    }
  }
  
  return issues
}

// Check for formality level appropriateness
export const validateFormalityLevel = async (text: string, language: string, key: string): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  const culture = LANGUAGE_CULTURE_MAP[language as keyof typeof LANGUAGE_CULTURE_MAP]
  const guidelines = CULTURAL_GUIDELINES[culture]
  
  if (!guidelines) return issues
  
  // Informal patterns
  const informalPatterns = [
    /\b(hey|hi|sup|yo)\b/i,
    /\b(gonna|wanna|gotta)\b/i,
    /\b(awesome|cool|sweet)\b/i,
    /[!]{2,}/, // Multiple exclamation marks
    /\b(lol|omg|btw)\b/i
  ]
  
  // Very formal patterns
  const veryFormalPatterns = [
    /\b(esteemed|distinguished|venerable)\b/i,
    /\b(humbly|respectfully|cordially)\b/i,
    /\b(kindly|graciously)\b/i
  ]
  
  const hasInformal = informalPatterns.some(pattern => pattern.test(text))
  const hasVeryFormal = veryFormalPatterns.some(pattern => pattern.test(text))
  
  if (hasInformal && guidelines.formality === 'very_formal') {
    issues.push({
      type: 'cultural',
      severity: 'warning',
      language,
      key,
      message: `Informal language detected in ${culture} culture context`,
      suggestion: 'Consider using more formal language appropriate for this culture',
      category: 'formality_level',
      context: text
    })
  }
  
  if (hasVeryFormal && guidelines.formality === 'casual_to_formal') {
    issues.push({
      type: 'cultural',
      severity: 'info',
      language,
      key,
      message: `Very formal language may seem distant in ${culture} culture`,
      suggestion: 'Consider slightly more casual but still professional tone',
      category: 'formality_level',
      context: text
    })
  }
  
  return issues
}

// Main cultural validation function
export const validateCulturalAppropriateness = async (): Promise<CulturalIssue[]> => {
  const issues: CulturalIssue[] = []
  
  // Load translation files (simplified for this example)
  const languages = Object.keys(SUPPORTED_LANGUAGES)
  
  for (const lang of languages) {
    try {
      // In a real implementation, this would load the actual translation files
      const translations = await loadTranslationFile(lang)
      const flattenedTranslations = flattenObject(translations)
      
      for (const [key, text] of Object.entries(flattenedTranslations)) {
        // Run all cultural validation checks
        const sensitivityIssues = await validateCulturalSensitivity(text, lang, key)
        const colorIssues = await validateColorUsage(text, lang)
        const dateTimeIssues = await validateDateTimeFormats(text, lang, key)
        const numberIssues = await validateNumberFormats(text, lang, key)
        const formalityIssues = await validateFormalityLevel(text, lang, key)
        
        issues.push(
          ...sensitivityIssues,
          ...colorIssues,
          ...dateTimeIssues,
          ...numberIssues,
          ...formalityIssues
        )
      }
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error)
    }
  }
  
  return issues
}

// Helper functions (these would be imported from translationQA.ts in real implementation)
async function loadTranslationFile(language: string): Promise<Record<string, any>> {
  try {
    const module = await import(`../i18n/locales/${language}.json`)
    return module.default || module
  } catch (error) {
    console.error(`Failed to load translation file for ${language}:`, error)
    return {}
  }
}

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, string> {
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

// Generate cultural appropriateness report
export const generateCulturalReport = async (): Promise<{
  issues: CulturalIssue[]
  summary: Record<string, { total: number; critical: number; warning: number; info: number }>
  recommendations: string[]
}> => {
  const issues = await validateCulturalAppropriateness()
  
  // Generate summary by language
  const summary: Record<string, { total: number; critical: number; warning: number; info: number }> = {}
  
  Object.keys(SUPPORTED_LANGUAGES).forEach(lang => {
    const langIssues = issues.filter(issue => issue.language === lang)
    summary[lang] = {
      total: langIssues.length,
      critical: langIssues.filter(i => i.severity === 'critical').length,
      warning: langIssues.filter(i => i.severity === 'warning').length,
      info: langIssues.filter(i => i.severity === 'info').length
    }
  })
  
  // Generate recommendations
  const recommendations = [
    'Review all cultural sensitivity warnings with native speakers',
    'Validate date/time formats match local expectations',
    'Ensure color usage is appropriate for target cultures',
    'Check formality levels match cultural expectations',
    'Consider hiring cultural consultants for major markets',
    'Test with users from target cultures before launch',
    'Regularly update cultural guidelines as they evolve'
  ]
  
  return { issues, summary, recommendations }
}
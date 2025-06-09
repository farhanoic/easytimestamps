#!/usr/bin/env node

/**
 * Translation Quality Assurance CLI Tool
 * Run automated checks on translation files
 */

const fs = require('fs')
const path = require('path')

// Character limits for UI elements
const CHARACTER_LIMITS = {
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
}

// Language multipliers
const LANGUAGE_MULTIPLIERS = {
  'en': 1.0,
  'es': 1.15,
  'fr': 1.2,
  'de': 1.3,
  'pt': 1.1,
  'ja': 0.8,
  'ko': 0.9,
  'zh-CN': 0.7
}

// Load translation file
function loadTranslationFile(language) {
  try {
    const filePath = path.join(__dirname, '..', 'src', 'i18n', 'locales', `${language}.json`)
    const content = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(content)
  } catch (error) {
    console.error(`❌ Failed to load ${language}.json:`, error.message)
    return {}
  }
}

// Flatten nested object
function flattenObject(obj, prefix = '') {
  const flattened = {}
  
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

// Check missing translations
function detectMissingTranslations() {
  console.log('🔍 Checking for missing translations...')
  
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN']
  const allTranslations = {}
  const issues = []
  
  // Load all files
  languages.forEach(lang => {
    const translations = loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  })
  
  const englishKeys = Object.keys(allTranslations.en || {})
  
  // Check each language
  languages.forEach(lang => {
    if (lang === 'en') return
    
    const langTranslations = allTranslations[lang] || {}
    let missingCount = 0
    
    englishKeys.forEach(key => {
      if (!langTranslations[key] || langTranslations[key].trim() === '') {
        issues.push({
          type: 'missing',
          severity: 'critical',
          language: lang,
          key,
          message: `Missing translation for "${key}"`,
          englishText: allTranslations.en[key]
        })
        missingCount++
      }
    })
    
    const completionRate = ((englishKeys.length - missingCount) / englishKeys.length * 100).toFixed(1)
    console.log(`  ${lang}: ${completionRate}% complete (${missingCount} missing)`)
  })
  
  return issues
}

// Check consistency
function checkConsistency() {
  console.log('🔍 Checking translation consistency...')
  
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN']
  const allTranslations = {}
  const issues = []
  
  // Load all files
  languages.forEach(lang => {
    const translations = loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  })
  
  const englishTranslations = allTranslations.en || {}
  
  Object.keys(englishTranslations).forEach(key => {
    const englishValue = englishTranslations[key]
    
    // Check placeholders
    const placeholderRegex = /\{\{?([^}]+)\}?\}/g
    const englishPlaceholders = (englishValue.match(placeholderRegex) || []).sort()
    
    // Check HTML tags
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
          message: `Placeholder mismatch`,
          expected: englishPlaceholders.join(', '),
          actual: langPlaceholders.join(', ')
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
          message: `HTML tag mismatch`,
          expected: englishTags.join(', '),
          actual: langTags.join(', ')
        })
      }
    })
  })
  
  return issues
}

// Check character limits
function validateCharacterLimits() {
  console.log('🔍 Validating character limits...')
  
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN']
  const allTranslations = {}
  const issues = []
  
  // Load all files
  languages.forEach(lang => {
    const translations = loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  })
  
  const uiPatterns = [
    { pattern: /^(button|btn)\./, limit: CHARACTER_LIMITS.button, type: 'button' },
    { pattern: /^(nav|navigation|menu)\./, limit: CHARACTER_LIMITS.navigation, type: 'navigation' },
    { pattern: /^(title|heading)\./, limit: CHARACTER_LIMITS.title, type: 'title' },
    { pattern: /^(error|err)\./, limit: CHARACTER_LIMITS.error_message, type: 'error_message' },
    { pattern: /^(tooltip|tip)\./, limit: CHARACTER_LIMITS.tooltip, type: 'tooltip' }
  ]
  
  languages.forEach(lang => {
    const langTranslations = allTranslations[lang] || {}
    const multiplier = LANGUAGE_MULTIPLIERS[lang] || 1.0
    
    Object.entries(langTranslations).forEach(([key, value]) => {
      uiPatterns.forEach(({ pattern, limit, type }) => {
        if (pattern.test(key)) {
          const adjustedLimit = Math.floor(limit * multiplier)
          const cleanValue = value.replace(/<[^>]+>/g, '').trim()
          
          if (cleanValue.length > adjustedLimit) {
            issues.push({
              type: 'length',
              severity: cleanValue.length > adjustedLimit * 1.5 ? 'critical' : 'warning',
              language: lang,
              key,
              message: `Text too long for ${type}`,
              length: cleanValue.length,
              limit: adjustedLimit,
              text: cleanValue
            })
          }
        }
      })
    })
  })
  
  return issues
}

// Check encoding issues
function validateEncoding() {
  console.log('🔍 Validating character encoding...')
  
  const languages = ['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN']
  const allTranslations = {}
  const issues = []
  
  // Load all files
  languages.forEach(lang => {
    const translations = loadTranslationFile(lang)
    allTranslations[lang] = flattenObject(translations)
  })
  
  languages.forEach(lang => {
    const langTranslations = allTranslations[lang] || {}
    
    Object.entries(langTranslations).forEach(([key, value]) => {
      // Check for encoding artifacts
      if (value.includes('Ã') || value.includes('â€™') || value.includes('Â')) {
        issues.push({
          type: 'encoding',
          severity: 'critical',
          language: lang,
          key,
          message: 'Potential encoding issue',
          text: value
        })
      }
      
      // Check for control characters
      if (/[\u0000-\u001F\u007F-\u009F]/.test(value)) {
        issues.push({
          type: 'encoding',
          severity: 'warning',
          language: lang,
          key,
          message: 'Control characters detected',
          text: value
        })
      }
    })
  })
  
  return issues
}

// Generate report
function generateReport(issues) {
  console.log('\n📊 TRANSLATION QUALITY REPORT')
  console.log('=' * 50)
  
  const criticalIssues = issues.filter(i => i.severity === 'critical')
  const warningIssues = issues.filter(i => i.severity === 'warning')
  
  console.log(`🚨 Critical Issues: ${criticalIssues.length}`)
  console.log(`⚠️  Warning Issues: ${warningIssues.length}`)
  console.log(`📝 Total Issues: ${issues.length}`)
  
  // Group by language
  const byLanguage = {}
  issues.forEach(issue => {
    if (!byLanguage[issue.language]) {
      byLanguage[issue.language] = []
    }
    byLanguage[issue.language].push(issue)
  })
  
  console.log('\n📋 Issues by Language:')
  Object.entries(byLanguage).forEach(([lang, langIssues]) => {
    const critical = langIssues.filter(i => i.severity === 'critical').length
    const warning = langIssues.filter(i => i.severity === 'warning').length
    console.log(`  ${lang}: ${critical} critical, ${warning} warnings`)
  })
  
  // Show critical issues
  if (criticalIssues.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES:')
    criticalIssues.slice(0, 10).forEach(issue => {
      console.log(`  [${issue.language}] ${issue.key}`)
      console.log(`    ${issue.message}`)
      if (issue.expected) console.log(`    Expected: ${issue.expected}`)
      if (issue.actual) console.log(`    Found: ${issue.actual}`)
      if (issue.text && issue.text.length < 100) console.log(`    Text: "${issue.text}"`)
      console.log('')
    })
    
    if (criticalIssues.length > 10) {
      console.log(`  ... and ${criticalIssues.length - 10} more critical issues`)
    }
  }
  
  return issues
}

// Main function
function main() {
  console.log('🌍 Translation Quality Assurance Tool')
  console.log('=====================================\n')
  
  const allIssues = [
    ...detectMissingTranslations(),
    ...checkConsistency(),
    ...validateCharacterLimits(),
    ...validateEncoding()
  ]
  
  generateReport(allIssues)
  
  // Export to file if requested
  const args = process.argv.slice(2)
  if (args.includes('--export')) {
    const filename = 'translation-qa-report.json'
    fs.writeFileSync(filename, JSON.stringify(allIssues, null, 2))
    console.log(`\n💾 Report exported to ${filename}`)
  }
  
  // Exit with error code if critical issues found
  const criticalCount = allIssues.filter(i => i.severity === 'critical').length
  if (criticalCount > 0) {
    console.log(`\n❌ Found ${criticalCount} critical issues. Please fix before deployment.`)
    process.exit(1)
  } else {
    console.log('\n✅ No critical issues found!')
    process.exit(0)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

module.exports = {
  detectMissingTranslations,
  checkConsistency,
  validateCharacterLimits,
  validateEncoding,
  generateReport
}
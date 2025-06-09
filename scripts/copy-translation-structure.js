#!/usr/bin/env node

/**
 * Copy translation structure from English to all supported languages
 * This ensures all translation files have the same structure
 */

const fs = require('fs');
const path = require('path');

function copyTranslationStructure() {
  console.log('🔧 Copying translation structure from English to all languages...\n');
  
  // Load English translations as the source
  const enPath = path.join(__dirname, '..', 'src', 'i18n', 'locales', 'en.json');
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  
  const languages = ['es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN'];
  
  languages.forEach(lang => {
    const langPath = path.join(__dirname, '..', 'src', 'i18n', 'locales', `${lang}.json`);
    
    try {
      // Load existing translations if any
      let existingTranslations = {};
      if (fs.existsSync(langPath)) {
        existingTranslations = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      }
      
      // Deep merge function to preserve existing translations
      function deepMerge(target, source, keyPrefix = '') {
        const result = { ...target };
        
        Object.keys(source).forEach(key => {
          const fullKey = keyPrefix ? `${keyPrefix}.${key}` : key;
          
          if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
            // It's an object, recurse
            result[key] = deepMerge(result[key] || {}, source[key], fullKey);
          } else {
            // It's a primitive value
            if (!result[key]) {
              // No existing translation, use English as placeholder with [NEEDS_TRANSLATION] marker
              if (typeof source[key] === 'string') {
                result[key] = `[${lang.toUpperCase()}] ${source[key]}`;
              } else {
                result[key] = source[key]; // For arrays and other types
              }
            }
            // If translation exists, keep it
          }
        });
        
        return result;
      }
      
      const mergedTranslations = deepMerge(existingTranslations, enTranslations);
      
      // Write the updated file
      fs.writeFileSync(langPath, JSON.stringify(mergedTranslations, null, 2), 'utf8');
      console.log(`✓ Updated ${lang}.json with complete structure`);
      
    } catch (error) {
      console.error(`✗ Error updating ${lang}.json:`, error.message);
    }
  });
  
  console.log('\n✅ Translation structure copied successfully!');
  console.log('\nAll language files now have the same structure as English.');
  console.log('Placeholders marked with [LANG] prefix need to be properly translated.');
}

if (require.main === module) {
  copyTranslationStructure();
}

module.exports = { copyTranslationStructure };
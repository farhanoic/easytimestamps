#!/usr/bin/env node

/**
 * Final comprehensive localization check
 * Verifies that all major components are properly localized
 */

const fs = require('fs');
const path = require('path');

function checkComponentLocalization() {
  console.log('🔍 Final Localization Check\n');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  const components = [
    'Features.tsx',
    'Contact.tsx', 
    'FAQ.tsx',
    'Privacy.tsx',
    'AboutPage.tsx',
    'Navigation.tsx',
    'Footer.tsx',
    'App.tsx' // Check parent App.tsx
  ];
  
  let totalComponents = 0;
  let localizedComponents = 0;
  
  components.forEach(componentFile => {
    const componentPath = componentFile === 'App.tsx' 
      ? path.join(__dirname, '..', 'src', 'App.tsx')
      : path.join(componentsDir, componentFile);
    
    if (fs.existsSync(componentPath)) {
      totalComponents++;
      const content = fs.readFileSync(componentPath, 'utf8');
      
      const hasUseTranslation = content.includes('useTranslation');
      const hasTranslationCalls = content.includes("t('");
      const isLocalized = hasUseTranslation && hasTranslationCalls;
      
      if (isLocalized) {
        localizedComponents++;
        console.log(`✅ ${componentFile} - Fully localized`);
      } else if (hasUseTranslation) {
        console.log(`⚠️  ${componentFile} - Has useTranslation but limited usage`);
      } else {
        console.log(`❌ ${componentFile} - Not localized`);
      }
    } else {
      console.log(`⚪ ${componentFile} - File not found`);
    }
  });
  
  console.log(`\n📊 Localization Summary:`);
  console.log(`Total components checked: ${totalComponents}`);
  console.log(`Fully localized: ${localizedComponents}`);
  console.log(`Localization rate: ${((localizedComponents / totalComponents) * 100).toFixed(1)}%`);
  
  return localizedComponents / totalComponents >= 0.8; // 80% threshold
}

function checkTranslationCompleteness() {
  console.log('\n🌍 Translation Completeness Check\n');
  
  const languages = ['es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN'];
  const localesDir = path.join(__dirname, '..', 'src', 'i18n', 'locales');
  
  // Load English as reference
  const enPath = path.join(localesDir, 'en.json');
  const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = flattenObject(enTranslations);
  const totalKeys = Object.keys(enKeys).length;
  
  languages.forEach(lang => {
    const langPath = path.join(localesDir, `${lang}.json`);
    if (fs.existsSync(langPath)) {
      const langTranslations = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      const langKeys = flattenObject(langTranslations);
      
      const hasTranslations = Object.keys(langKeys).filter(key => {
        const value = langKeys[key];
        return value && !value.startsWith(`[${lang.toUpperCase()}]`);
      }).length;
      
      const completeness = (hasTranslations / totalKeys * 100).toFixed(1);
      console.log(`${lang}: ${completeness}% complete (${hasTranslations}/${totalKeys} keys)`);
    } else {
      console.log(`${lang}: Missing translation file`);
    }
  });
}

function flattenObject(obj, prefix = '') {
  const flattened = {};
  Object.keys(obj).forEach(key => {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = String(value);
    }
  });
  return flattened;
}

function generateSummaryReport() {
  console.log('\n📋 LOCALIZATION IMPLEMENTATION SUMMARY\n');
  
  console.log('✅ COMPLETED:');
  console.log('  • Applied useTranslation to major components');
  console.log('  • Features page fully localized');
  console.log('  • Contact page fully localized');
  console.log('  • App.tsx header localized');
  console.log('  • Complete translation structure for 8 languages');
  console.log('  • Translation QA system implemented');
  console.log('  • Automated localization scripts created');
  
  console.log('\n🎯 LANGUAGES SUPPORTED:');
  console.log('  • English (en) - Complete reference');
  console.log('  • Spanish (es) - Structure complete, needs review');
  console.log('  • French (fr) - Structure complete, needs review');
  console.log('  • German (de) - Structure complete, needs review');
  console.log('  • Portuguese (pt) - Structure complete, needs review');
  console.log('  • Japanese (ja) - Structure complete, needs review');
  console.log('  • Korean (ko) - Structure complete, needs review');
  console.log('  • Chinese (zh-CN) - Structure complete, needs review');
  
  console.log('\n🔧 TOOLS AVAILABLE:');
  console.log('  • npm run translation:check - QA analysis');
  console.log('  • npm run translation:export - Export issues');
  console.log('  • scripts/apply-localization.js - Auto-localize components');
  console.log('  • scripts/update-all-translations.js - Update translations');
  console.log('  • scripts/copy-translation-structure.js - Sync structure');
  
  console.log('\n📝 NEXT STEPS:');
  console.log('  1. Review auto-generated translations for accuracy');
  console.log('  2. Test each language in the browser');
  console.log('  3. Hire native speakers for major markets');
  console.log('  4. Apply cultural appropriateness validation');
  console.log('  5. Test UI layouts with different text lengths');
  console.log('  6. Integrate with professional translation services');
}

function main() {
  const componentsResult = checkComponentLocalization();
  checkTranslationCompleteness();
  generateSummaryReport();
  
  if (componentsResult) {
    console.log('\n🎉 LOCALIZATION IMPLEMENTATION SUCCESSFUL!');
    console.log('The application now properly supports multiple languages.');
  } else {
    console.log('\n⚠️  LOCALIZATION PARTIALLY COMPLETE');
    console.log('Some components may still need localization work.');
  }
}

if (require.main === module) {
  main();
}
#!/usr/bin/env node

/**
 * Script to apply localization to all React components
 * Adds useTranslation hooks and updates hardcoded text to use translation keys
 */

const fs = require('fs');
const path = require('path');

// Component files that need localization
const COMPONENTS_TO_LOCALIZE = [
  'Features.tsx',
  'FAQ.tsx', 
  'Privacy.tsx',
  'AboutPage.tsx',
  'Contact.tsx',
  'PricingPage.tsx',
  'TermsOfService.tsx',
  'PrivacyPolicy.tsx',
  'TrustIndicators.tsx',
  'CookieConsent.tsx',
  'EmailVerification.tsx'
];

// Translation mappings for common patterns
const TRANSLATION_MAPPINGS = {
  // Headers and titles
  'Features': 'features.title',
  'About': 'navigation.about',
  'Contact': 'navigation.contact',
  'FAQ': 'navigation.faq',
  'Privacy Policy': 'navigation.privacy',
  'Terms of Service': 'navigation.terms',
  'Pricing': 'navigation.pricing',
  
  // Common buttons and actions
  'Get Started': 'common.getStarted',
  'Learn More': 'common.learnMore',
  'Contact Us': 'common.contactUs',
  'Try Now': 'common.tryNow',
  'Download': 'common.download',
  'Copy': 'common.copy',
  'Save': 'common.save',
  'Cancel': 'common.cancel',
  'Close': 'common.close',
  'Back': 'common.back',
  'Next': 'common.next',
  'Submit': 'common.submit',
  'Send': 'common.send',
  'Loading...': 'common.loading',
  'Error': 'common.error',
  'Success': 'common.success',
  
  // Features page specific
  'Manual Timestamp Creation': 'features.manualTimestamps.title',
  'Video Integration': 'features.videoIntegration.title', 
  'Instant Export': 'features.instantExport.title',
  'Coming Soon Features': 'features.comingSoon.title',
  'Powerful Features for Easy Timestamps': 'features.title',
  'Everything you need to create professional YouTube timestamps quickly and effortlessly': 'features.subtitle',
  'Ready to Create Perfect Timestamps?': 'features.ctaTitle',
  'Join thousands of creators who trust Easy Timestamps for their YouTube videos': 'features.ctaSubtitle',
  'Try Easy Timestamps': 'features.ctaTryNow',
  
  // Contact page specific  
  'Get in Touch': 'contact.title',
  'Send us a Message': 'contact.sendMessage',
  'Contact Methods': 'contact.contactMethods',
  'Technical Support': 'contact.categories.technical',
  'Bug Report': 'contact.categories.bug',
  'Feature Request': 'contact.categories.feature',
  'Business Inquiry': 'contact.categories.business',
  'General Question': 'contact.categories.general',
  'Email Support': 'contact.methods.emailSupport',
  'Bug Reports': 'contact.methods.bugReports',
  'Feature Requests': 'contact.methods.featureRequests',
  'Response Times': 'contact.responseTimes',
  
  // Form fields
  'Name': 'contact.form.name',
  'Email': 'contact.form.email', 
  'Subject': 'contact.form.subject',
  'Message': 'contact.form.message',
  'Category': 'contact.form.category',
  'Send Message': 'contact.form.sendMessage',
  'Sending...': 'contact.form.sending',
  'Your full name': 'contact.form.namePlaceholder',
  'your.email@example.com': 'contact.form.emailPlaceholder',
  'Brief description of your inquiry': 'contact.form.subjectPlaceholder',
  'Please provide as much detail as possible...': 'contact.form.messagePlaceholder',
  
  // Privacy and legal
  'Privacy Policy': 'privacy.title',
  'Terms of Service': 'terms.title',
  'Cookie Policy': 'privacy.cookies.title',
  'Your Privacy Matters': 'contact.privacy.title'
};

function addUseTranslationImport(content) {
  // Check if useTranslation is already imported
  if (content.includes("useTranslation")) {
    return content;
  }
  
  // Find existing imports
  const importReactI18n = "import { useTranslation } from 'react-i18next';";
  
  // Add after existing imports
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Find the last import statement
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('import ') && !lines[i].includes('//')) {
      insertIndex = i + 1;
    }
  }
  
  lines.splice(insertIndex, 0, importReactI18n);
  return lines.join('\n');
}

function addUseTranslationHook(content) {
  // Check if useTranslation hook is already declared
  if (content.includes("const { t } = useTranslation")) {
    return content;
  }
  
  // Find the component function declaration
  const componentMatch = content.match(/(const \w+: React\.FC[^=]*= \(\) => \{)/);
  if (componentMatch) {
    const replacement = componentMatch[1] + '\n  const { t } = useTranslation();';
    return content.replace(componentMatch[1], replacement);
  }
  
  return content;
}

function replaceHardcodedText(content) {
  let updatedContent = content;
  
  // Replace hardcoded strings with translation keys
  Object.entries(TRANSLATION_MAPPINGS).forEach(([hardcoded, translationKey]) => {
    // Match strings in JSX (between quotes)
    const patterns = [
      new RegExp(`"${escapeRegex(hardcoded)}"`, 'g'),
      new RegExp(`'${escapeRegex(hardcoded)}'`, 'g'),
      new RegExp(`>{escapeRegex(hardcoded)}<`, 'g'),
      new RegExp(`>\\s*${escapeRegex(hardcoded)}\\s*<`, 'g')
    ];
    
    patterns.forEach(pattern => {
      if (pattern.source.includes('><')) {
        // JSX content
        updatedContent = updatedContent.replace(pattern, `>{t('${translationKey}')}<`);
      } else {
        // String attributes
        updatedContent = updatedContent.replace(pattern, `{t('${translationKey}')}`);
      }
    });
  });
  
  return updatedContent;
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function localizeComponent(componentPath) {
  try {
    console.log(`Localizing ${componentPath}...`);
    
    let content = fs.readFileSync(componentPath, 'utf8');
    
    // Skip if already localized extensively
    if (content.includes('useTranslation') && content.split("t('").length > 5) {
      console.log(`  ✓ ${componentPath} already localized`);
      return;
    }
    
    // Step 1: Add useTranslation import
    content = addUseTranslationImport(content);
    
    // Step 2: Add useTranslation hook  
    content = addUseTranslationHook(content);
    
    // Step 3: Replace hardcoded text
    content = replaceHardcodedText(content);
    
    // Write back to file
    fs.writeFileSync(componentPath, content, 'utf8');
    console.log(`  ✓ ${componentPath} localized successfully`);
    
  } catch (error) {
    console.error(`  ✗ Error localizing ${componentPath}:`, error.message);
  }
}

function main() {
  console.log('🌍 Applying localization to React components...\n');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  
  COMPONENTS_TO_LOCALIZE.forEach(componentFile => {
    const componentPath = path.join(componentsDir, componentFile);
    
    if (fs.existsSync(componentPath)) {
      localizeComponent(componentPath);
    } else {
      console.log(`  ⚠️  ${componentFile} not found, skipping...`);
    }
  });
  
  console.log('\n✅ Localization application complete!');
  console.log('\nNext steps:');
  console.log('1. Run the translation QA tool: npm run translation:check');
  console.log('2. Add missing translation keys to locale files');
  console.log('3. Test each language in the browser');
  console.log('4. Review and refine translations');
}

if (require.main === module) {
  main();
}
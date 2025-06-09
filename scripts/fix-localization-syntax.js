#!/usr/bin/env node

/**
 * Fix syntax errors from automatic localization
 * Corrects common JSX syntax issues caused by the auto-localization script
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_TO_FIX = [
  'CookieConsent.tsx',
  'Privacy.tsx', 
  'PrivacyPolicy.tsx',
  'TermsOfService.tsx'
];

function fixJSXSyntax(content) {
  let fixed = content;
  
  // Fix pattern: {t('key')}sometext -> {t('key')} sometext (add space)
  fixed = fixed.replace(/\{t\('[^']+'\)\}([A-Za-z])/g, "{t('$1')} $2");
  
  // Fix pattern: sometext{t('key')} -> sometext {t('key')} (add spaces)
  fixed = fixed.replace(/([A-Za-z])\{t\('[^']+'\)\}/g, "$1 {t('$2')}");
  
  // Fix incomplete JSX tags due to malformed replacements
  // Pattern: className="..."{t('key')}/tagname> -> className="...">{t('key')}</tagname>
  fixed = fixed.replace(/className="[^"]*"\{t\('([^']+)'\)\}\/([a-zA-Z]+)>/g, 'className="$1">{t(\'$2\')}</$3>');
  
  // Fix pattern: >{t('key')}</ -> >{t('key')}</
  fixed = fixed.replace(/>\{t\('([^']+)'\)\}<\//g, '>{t(\'$1\')}</');
  
  // Fix pattern: "text"{t('key')} -> "text" {t('key')}
  fixed = fixed.replace(/"([^"]+)"\{t\('([^']+)'\)\}/g, '"$1" {t(\'$2\')}');
  
  // Fix malformed JSX where translation calls break tag structure
  // Pattern: <tag{t('key')}> -> <tag>{t('key')}</tag>
  fixed = fixed.replace(/<([a-zA-Z][a-zA-Z0-9]*[^>]*)\{t\('([^']+)'\)\}>/g, '<$1>{t(\'$2\')}</$1>');
  
  // Fix pattern where closing tags are broken: <tag>{t('key')}/tag> -> <tag>{t('key')}</tag>
  fixed = fixed.replace(/<([a-zA-Z][a-zA-Z0-9]*[^>]*)>\{t\('([^']+)'\)\}\/\1>/g, '<$1>{t(\'$2\')}</$1>');
  
  return fixed;
}

function fixSpecificPatterns(content, filename) {
  let fixed = content;
  
  // Component-specific fixes
  if (filename.includes('Privacy.tsx')) {
    // Fix broken section tag
    fixed = fixed.replace(/\{t\('privacy\.title'\)\}\/section>/g, '{t(\'privacy.title\')}</section>');
    
    // Fix broken paragraph tags
    fixed = fixed.replace(/className="[^"]*"\{t\('[^']+'\)\}\/p>/g, (match) => {
      const classMatch = match.match(/className="([^"]*)"/);
      const tMatch = match.match(/\{t\('([^']+)'\)\}/);
      if (classMatch && tMatch) {
        return `className="${classMatch[1]}">{t('${tMatch[1]}')}</p>`;
      }
      return match;
    });
  }
  
  if (filename.includes('CookieConsent.tsx')) {
    // Fix button text patterns
    fixed = fixed.replace(/>\{t\('([^']+)'\)\}\/button>/g, '>{t(\'$1\')}</button>');
  }
  
  return fixed;
}

function fixComponent(componentPath) {
  try {
    console.log(`Fixing ${path.basename(componentPath)}...`);
    
    let content = fs.readFileSync(componentPath, 'utf8');
    
    // Apply general JSX syntax fixes
    content = fixJSXSyntax(content);
    
    // Apply component-specific fixes
    content = fixSpecificPatterns(content, componentPath);
    
    // Write the fixed content back
    fs.writeFileSync(componentPath, content, 'utf8');
    console.log(`  ✓ Fixed ${path.basename(componentPath)}`);
    
  } catch (error) {
    console.error(`  ✗ Error fixing ${path.basename(componentPath)}:`, error.message);
  }
}

function main() {
  console.log('🔧 Fixing localization syntax errors...\n');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  
  COMPONENTS_TO_FIX.forEach(componentFile => {
    const componentPath = path.join(componentsDir, componentFile);
    
    if (fs.existsSync(componentPath)) {
      fixComponent(componentPath);
    } else {
      console.log(`  ⚠️  ${componentFile} not found, skipping...`);
    }
  });
  
  console.log('\n✅ Syntax fixes complete!');
  console.log('\nNext step: Run npm run build to verify all errors are resolved');
}

if (require.main === module) {
  main();
}
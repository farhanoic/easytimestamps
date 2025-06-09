/**
 * Functionality Testing Framework for Multi-language Applications
 * Tests core functionality across different languages and locales
 */

import { SUPPORTED_LANGUAGES } from './seoUtils'

interface FunctionalTestResult {
  testName: string
  language: string
  status: 'pass' | 'fail' | 'warning'
  message: string
  details?: string
  executionTime: number
  expectedBehavior: string
  actualBehavior: string
}

interface TestConfig {
  timeout: number
  retries: number
  skipNonCritical: boolean
  verbose: boolean
}

// Define core functionality tests
export const FUNCTIONALITY_TESTS = {
  // UI Navigation Tests
  navigation: {
    name: 'Navigation Functionality',
    critical: true,
    tests: [
      'menu_accessibility',
      'breadcrumb_navigation', 
      'language_switcher',
      'back_button_behavior',
      'tab_navigation'
    ]
  },
  
  // Form Functionality Tests
  forms: {
    name: 'Form Functionality',
    critical: true,
    tests: [
      'input_validation',
      'error_message_display',
      'success_feedback',
      'form_submission',
      'field_focus_behavior'
    ]
  },
  
  // Content Display Tests
  content: {
    name: 'Content Display',
    critical: true,
    tests: [
      'text_rendering',
      'special_character_display',
      'rtl_text_alignment',
      'font_fallback',
      'line_height_adjustment'
    ]
  },
  
  // Interactive Elements Tests
  interactive: {
    name: 'Interactive Elements',
    critical: true,
    tests: [
      'button_click_response',
      'modal_behavior',
      'dropdown_functionality',
      'search_functionality',
      'copy_to_clipboard'
    ]
  },
  
  // Data Processing Tests
  data_processing: {
    name: 'Data Processing',
    critical: true,
    tests: [
      'timestamp_parsing',
      'video_url_validation',
      'file_upload_handling',
      'export_functionality',
      'data_persistence'
    ]
  },
  
  // Accessibility Tests
  accessibility: {
    name: 'Accessibility',
    critical: false,
    tests: [
      'keyboard_navigation',
      'screen_reader_compatibility',
      'focus_management',
      'aria_labels',
      'color_contrast'
    ]
  }
} as const

export class FunctionalityTester {
  private results: FunctionalTestResult[] = []
  private config: TestConfig
  private currentLanguage: string = 'en'

  constructor(config: Partial<TestConfig> = {}) {
    this.config = {
      timeout: 5000,
      retries: 2,
      skipNonCritical: false,
      verbose: false,
      ...config
    }
  }

  // Run all functionality tests for all languages
  async runAllTests(): Promise<FunctionalTestResult[]> {
    this.results = []
    
    const languages = Object.keys(SUPPORTED_LANGUAGES)
    
    for (const language of languages) {
      await this.switchLanguage(language)
      await this.runLanguageTests(language)
    }
    
    return this.results
  }

  // Run tests for a specific language
  async runLanguageTests(language: string): Promise<FunctionalTestResult[]> {
    const languageResults: FunctionalTestResult[] = []
    
    // Run each test category
    for (const [category, categoryConfig] of Object.entries(FUNCTIONALITY_TESTS)) {
      if (this.config.skipNonCritical && !categoryConfig.critical) {
        continue
      }
      
      for (const testName of categoryConfig.tests) {
        const result = await this.runTest(testName, language, category)
        languageResults.push(result)
        this.results.push(result)
      }
    }
    
    return languageResults
  }

  // Switch application language
  private async switchLanguage(language: string): Promise<void> {
    this.currentLanguage = language
    
    // Simulate language switching (in real app, this would trigger actual language change)
    const event = new CustomEvent('languageChange', { detail: { language } })
    window.dispatchEvent(event)
    
    // Wait for language change to take effect
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Run individual test
  private async runTest(testName: string, language: string, category: string): Promise<FunctionalTestResult> {
    const startTime = Date.now()
    let retries = 0
    
    while (retries <= this.config.retries) {
      try {
        const result = await this.executeTest(testName, language, category)
        result.executionTime = Date.now() - startTime
        return result
      } catch (error) {
        retries++
        if (retries > this.config.retries) {
          return {
            testName,
            language,
            status: 'fail',
            message: `Test failed after ${this.config.retries} retries: ${error}`,
            executionTime: Date.now() - startTime,
            expectedBehavior: 'Test should execute without errors',
            actualBehavior: `Error: ${error}`
          }
        }
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    // This should never be reached due to the throw above
    throw new Error('Unexpected test execution path')
  }

  // Execute specific test logic
  private async executeTest(testName: string, language: string, category: string): Promise<FunctionalTestResult> {
    const baseResult = {
      testName,
      language,
      executionTime: 0
    }

    switch (testName) {
      case 'menu_accessibility':
        return await this.testMenuAccessibility(baseResult)
      
      case 'language_switcher':
        return await this.testLanguageSwitcher(baseResult)
      
      case 'input_validation':
        return await this.testInputValidation(baseResult)
      
      case 'text_rendering':
        return await this.testTextRendering(baseResult)
      
      case 'button_click_response':
        return await this.testButtonClickResponse(baseResult)
      
      case 'timestamp_parsing':
        return await this.testTimestampParsing(baseResult)
      
      case 'special_character_display':
        return await this.testSpecialCharacterDisplay(baseResult)
      
      case 'form_submission':
        return await this.testFormSubmission(baseResult)
      
      case 'copy_to_clipboard':
        return await this.testCopyToClipboard(baseResult)
      
      case 'keyboard_navigation':
        return await this.testKeyboardNavigation(baseResult)
      
      default:
        return {
          ...baseResult,
          status: 'warning',
          message: `Test '${testName}' not implemented yet`,
          expectedBehavior: 'Test should be implemented',
          actualBehavior: 'Test implementation missing'
        }
    }
  }

  // Test menu accessibility
  private async testMenuAccessibility(baseResult: any): Promise<FunctionalTestResult> {
    const menuItems = document.querySelectorAll('nav a, [role="menuitem"]')
    
    if (menuItems.length === 0) {
      return {
        ...baseResult,
        status: 'fail',
        message: 'No menu items found',
        expectedBehavior: 'Navigation menu should be present',
        actualBehavior: 'No navigation elements found'
      }
    }

    let accessibleCount = 0
    menuItems.forEach(item => {
      const hasText = item.textContent?.trim().length > 0
      const hasAriaLabel = item.getAttribute('aria-label')
      const hasTitle = item.getAttribute('title')
      
      if (hasText || hasAriaLabel || hasTitle) {
        accessibleCount++
      }
    })

    const accessibilityRate = (accessibleCount / menuItems.length) * 100

    return {
      ...baseResult,
      status: accessibilityRate >= 100 ? 'pass' : accessibilityRate >= 80 ? 'warning' : 'fail',
      message: `${accessibleCount}/${menuItems.length} menu items have accessibility labels`,
      details: `Accessibility rate: ${accessibilityRate.toFixed(1)}%`,
      expectedBehavior: 'All menu items should have accessible labels',
      actualBehavior: `${accessibilityRate.toFixed(1)}% of menu items are accessible`
    }
  }

  // Test language switcher functionality
  private async testLanguageSwitcher(baseResult: any): Promise<FunctionalTestResult> {
    const languageSwitcher = document.querySelector('[data-testid="language-switcher"], .language-selector')
    
    if (!languageSwitcher) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'Language switcher not found',
        expectedBehavior: 'Language switcher should be present',
        actualBehavior: 'No language switcher element found'
      }
    }

    // Test if language switcher is functional
    const isInteractive = languageSwitcher.tagName === 'SELECT' || 
                          languageSwitcher.getAttribute('role') === 'button' ||
                          languageSwitcher.onclick !== null

    return {
      ...baseResult,
      status: isInteractive ? 'pass' : 'fail',
      message: isInteractive ? 'Language switcher is interactive' : 'Language switcher not interactive',
      expectedBehavior: 'Language switcher should be clickable/selectable',
      actualBehavior: isInteractive ? 'Element is interactive' : 'Element is not interactive'
    }
  }

  // Test input validation
  private async testInputValidation(baseResult: any): Promise<FunctionalTestResult> {
    const inputs = document.querySelectorAll('input[type="text"], textarea')
    
    if (inputs.length === 0) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'No text inputs found to test',
        expectedBehavior: 'Should find text inputs to validate',
        actualBehavior: 'No text inputs present'
      }
    }

    // Test with invalid input (empty required field)
    const firstInput = inputs[0] as HTMLInputElement
    const originalValue = firstInput.value
    
    // Clear the input if it's required
    if (firstInput.required) {
      firstInput.value = ''
      firstInput.blur()
      
      // Check if validation message appears
      const hasValidationMessage = firstInput.validationMessage.length > 0 ||
                                  document.querySelector('.error-message, .validation-error')
      
      // Restore original value
      firstInput.value = originalValue
      
      return {
        ...baseResult,
        status: hasValidationMessage ? 'pass' : 'fail',
        message: hasValidationMessage ? 'Input validation working' : 'No validation message shown',
        expectedBehavior: 'Validation message should appear for invalid input',
        actualBehavior: hasValidationMessage ? 'Validation message displayed' : 'No validation feedback'
      }
    }

    return {
      ...baseResult,
      status: 'pass',
      message: 'No required inputs to validate',
      expectedBehavior: 'Required inputs should show validation',
      actualBehavior: 'No required inputs found'
    }
  }

  // Test text rendering
  private async testTextRendering(baseResult: any): Promise<FunctionalTestResult> {
    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
    let renderingIssues = 0
    
    textElements.forEach(element => {
      const computedStyle = window.getComputedStyle(element)
      const text = element.textContent || ''
      
      // Check for common rendering issues
      if (text.includes('?') && this.currentLanguage !== 'en') {
        renderingIssues++
      }
      
      if (computedStyle.fontFamily === 'inherit' && text.length > 0) {
        renderingIssues++
      }
    })

    const renderingRate = ((textElements.length - renderingIssues) / textElements.length) * 100

    return {
      ...baseResult,
      status: renderingRate >= 95 ? 'pass' : renderingRate >= 85 ? 'warning' : 'fail',
      message: `Text rendering quality: ${renderingRate.toFixed(1)}%`,
      details: `${renderingIssues} potential rendering issues found`,
      expectedBehavior: 'All text should render properly without missing characters',
      actualBehavior: `${renderingRate.toFixed(1)}% of text renders correctly`
    }
  }

  // Test button click response
  private async testButtonClickResponse(baseResult: any): Promise<FunctionalTestResult> {
    const buttons = document.querySelectorAll('button, [role="button"]')
    
    if (buttons.length === 0) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'No buttons found to test',
        expectedBehavior: 'Should find buttons to test',
        actualBehavior: 'No buttons present'
      }
    }

    let responsiveButtons = 0
    buttons.forEach(button => {
      const hasClickHandler = button.onclick !== null ||
                             button.getAttribute('onclick') !== null ||
                             button.addEventListener !== undefined
      
      const isDisabled = (button as HTMLButtonElement).disabled
      const hasAriaDisabled = button.getAttribute('aria-disabled') === 'true'
      
      if ((hasClickHandler || button.tagName === 'BUTTON') && !isDisabled && !hasAriaDisabled) {
        responsiveButtons++
      }
    })

    const responseRate = (responsiveButtons / buttons.length) * 100

    return {
      ...baseResult,
      status: responseRate >= 100 ? 'pass' : responseRate >= 80 ? 'warning' : 'fail',
      message: `${responsiveButtons}/${buttons.length} buttons are responsive`,
      details: `Response rate: ${responseRate.toFixed(1)}%`,
      expectedBehavior: 'All enabled buttons should be responsive to clicks',
      actualBehavior: `${responseRate.toFixed(1)}% of buttons are responsive`
    }
  }

  // Test timestamp parsing functionality
  private async testTimestampParsing(baseResult: any): Promise<FunctionalTestResult> {
    const testTimestamps = [
      '0:30',
      '1:23',
      '12:34',
      '1:23:45',
      '0:00',
      '59:59'
    ]
    
    // Look for timestamp input or parsing functionality
    const timestampInput = document.querySelector('input[placeholder*="time"], input[data-testid*="timestamp"]') as HTMLInputElement
    
    if (!timestampInput) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'No timestamp input found to test',
        expectedBehavior: 'Should find timestamp input field',
        actualBehavior: 'No timestamp input element found'
      }
    }

    let validParses = 0
    const originalValue = timestampInput.value

    for (const timestamp of testTimestamps) {
      timestampInput.value = timestamp
      timestampInput.dispatchEvent(new Event('input', { bubbles: true }))
      timestampInput.dispatchEvent(new Event('change', { bubbles: true }))
      
      // Check if the value is accepted (no validation error)
      const hasError = timestampInput.classList.contains('error') ||
                      timestampInput.getAttribute('aria-invalid') === 'true' ||
                      document.querySelector('.error-message')
      
      if (!hasError) {
        validParses++
      }
    }

    // Restore original value
    timestampInput.value = originalValue

    const parseRate = (validParses / testTimestamps.length) * 100

    return {
      ...baseResult,
      status: parseRate >= 100 ? 'pass' : parseRate >= 80 ? 'warning' : 'fail',
      message: `${validParses}/${testTimestamps.length} timestamps parsed correctly`,
      details: `Parse rate: ${parseRate.toFixed(1)}%`,
      expectedBehavior: 'All valid timestamp formats should be accepted',
      actualBehavior: `${parseRate.toFixed(1)}% of timestamps parsed successfully`
    }
  }

  // Test special character display
  private async testSpecialCharacterDisplay(baseResult: any): Promise<FunctionalTestResult> {
    const specialChars = {
      'en': 'Test: "quotes" & symbols!',
      'es': 'Prueba: "comillas" ñáéíóú ¿¡',
      'fr': 'Test: «guillemets» àâäéèêëïîôöùûüÿç',
      'de': 'Test: „Anführungszeichen" äöüß',
      'pt': 'Teste: "aspas" áàâãéêíóôõúç',
      'ja': 'テスト：「引用符」漢字ひらがなカタカナ',
      'ko': '테스트: "인용부호" 한글문자',
      'zh-CN': '测试："引号"中文汉字'
    }

    const testChar = specialChars[this.currentLanguage as keyof typeof specialChars] || specialChars.en
    
    // Create temporary element to test character rendering
    const testElement = document.createElement('div')
    testElement.textContent = testChar
    testElement.style.position = 'absolute'
    testElement.style.left = '-9999px'
    document.body.appendChild(testElement)

    // Check if characters render (width > 0 indicates successful rendering)
    const hasWidth = testElement.offsetWidth > 0
    const renderedText = testElement.textContent

    document.body.removeChild(testElement)

    return {
      ...baseResult,
      status: hasWidth && renderedText === testChar ? 'pass' : 'fail',
      message: hasWidth ? 'Special characters render correctly' : 'Special character rendering issues',
      details: `Test string: "${testChar}"`,
      expectedBehavior: 'Special characters should render without replacement characters',
      actualBehavior: hasWidth ? 'Characters render correctly' : 'Character rendering failed'
    }
  }

  // Test form submission
  private async testFormSubmission(baseResult: any): Promise<FunctionalTestResult> {
    const forms = document.querySelectorAll('form')
    
    if (forms.length === 0) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'No forms found to test',
        expectedBehavior: 'Should find forms to test submission',
        actualBehavior: 'No forms present'
      }
    }

    const form = forms[0] as HTMLFormElement
    let hasSubmitHandler = false
    
    // Check if form has submit handler
    if (form.onsubmit || form.addEventListener) {
      hasSubmitHandler = true
    }

    // Check for submit button
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]')
    
    return {
      ...baseResult,
      status: hasSubmitHandler && submitButton ? 'pass' : 'warning',
      message: hasSubmitHandler ? 'Form submission configured' : 'Form may not handle submission',
      expectedBehavior: 'Forms should have submit handlers and submit buttons',
      actualBehavior: `Submit handler: ${hasSubmitHandler}, Submit button: ${!!submitButton}`
    }
  }

  // Test copy to clipboard functionality
  private async testCopyToClipboard(baseResult: any): Promise<FunctionalTestResult> {
    const copyButtons = document.querySelectorAll('[data-testid*="copy"], .copy-button, button[title*="copy" i]')
    
    if (copyButtons.length === 0) {
      return {
        ...baseResult,
        status: 'warning',
        message: 'No copy buttons found',
        expectedBehavior: 'Should find copy-to-clipboard functionality',
        actualBehavior: 'No copy buttons present'
      }
    }

    // Test if clipboard API is available
    const hasClipboardAPI = navigator.clipboard && navigator.clipboard.writeText

    return {
      ...baseResult,
      status: hasClipboardAPI ? 'pass' : 'fail',
      message: hasClipboardAPI ? 'Clipboard API available' : 'Clipboard API not supported',
      details: `Found ${copyButtons.length} copy buttons`,
      expectedBehavior: 'Clipboard API should be available for copy functionality',
      actualBehavior: hasClipboardAPI ? 'Clipboard API supported' : 'Clipboard API not available'
    }
  }

  // Test keyboard navigation
  private async testKeyboardNavigation(baseResult: any): Promise<FunctionalTestResult> {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length === 0) {
      return {
        ...baseResult,
        status: 'fail',
        message: 'No focusable elements found',
        expectedBehavior: 'Should have focusable elements for keyboard navigation',
        actualBehavior: 'No focusable elements present'
      }
    }

    let accessibleElements = 0
    focusableElements.forEach(element => {
      const style = window.getComputedStyle(element)
      const isVisible = style.display !== 'none' && style.visibility !== 'hidden'
      const hasTabIndex = element.getAttribute('tabindex') !== '-1'
      
      if (isVisible && hasTabIndex) {
        accessibleElements++
      }
    })

    const accessibilityRate = (accessibleElements / focusableElements.length) * 100

    return {
      ...baseResult,
      status: accessibilityRate >= 90 ? 'pass' : accessibilityRate >= 70 ? 'warning' : 'fail',
      message: `${accessibleElements}/${focusableElements.length} elements keyboard accessible`,
      details: `Accessibility rate: ${accessibilityRate.toFixed(1)}%`,
      expectedBehavior: 'Most interactive elements should be keyboard accessible',
      actualBehavior: `${accessibilityRate.toFixed(1)}% of elements are keyboard accessible`
    }
  }

  // Generate comprehensive test report
  generateReport(): string {
    const passedTests = this.results.filter(r => r.status === 'pass')
    const failedTests = this.results.filter(r => r.status === 'fail')
    const warningTests = this.results.filter(r => r.status === 'warning')
    
    let report = '# Functionality Test Report\n\n'
    report += `## Summary\n`
    report += `- Total Tests: ${this.results.length}\n`
    report += `- Passed: ${passedTests.length}\n`
    report += `- Failed: ${failedTests.length}\n`
    report += `- Warnings: ${warningTests.length}\n`
    report += `- Success Rate: ${((passedTests.length / this.results.length) * 100).toFixed(1)}%\n\n`
    
    // Group results by language
    const byLanguage = this.results.reduce((acc, result) => {
      if (!acc[result.language]) acc[result.language] = []
      acc[result.language].push(result)
      return acc
    }, {} as Record<string, FunctionalTestResult[]>)
    
    report += `## Results by Language\n`
    Object.entries(byLanguage).forEach(([lang, results]) => {
      const passed = results.filter(r => r.status === 'pass').length
      const failed = results.filter(r => r.status === 'fail').length
      const warnings = results.filter(r => r.status === 'warning').length
      report += `- ${lang}: ${passed} passed, ${failed} failed, ${warnings} warnings\n`
    })
    
    if (failedTests.length > 0) {
      report += `\n## Failed Tests\n`
      failedTests.forEach(test => {
        report += `### ${test.testName} [${test.language}]\n`
        report += `**Status:** ${test.status}\n`
        report += `**Message:** ${test.message}\n`
        report += `**Expected:** ${test.expectedBehavior}\n`
        report += `**Actual:** ${test.actualBehavior}\n`
        if (test.details) report += `**Details:** ${test.details}\n`
        report += `**Execution Time:** ${test.executionTime}ms\n\n`
      })
    }
    
    return report
  }

  // Export results
  exportResults(): FunctionalTestResult[] {
    return [...this.results]
  }
}

// Utility function to run functionality tests
export const runFunctionalityTests = async (config?: Partial<TestConfig>): Promise<FunctionalTestResult[]> => {
  const tester = new FunctionalityTester(config)
  return await tester.runAllTests()
}
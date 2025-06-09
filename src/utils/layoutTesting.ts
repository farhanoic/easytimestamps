/**
 * UI Layout Testing Framework for Multi-language Support
 * Tests UI elements with different language text lengths and character sets
 */

import { SUPPORTED_LANGUAGES } from './seoUtils'

interface LayoutTestResult {
  element: string
  language: string
  issue: string
  severity: 'critical' | 'warning' | 'info'
  originalText: string
  recommendation: string
}

interface LayoutTestConfig {
  testOverflow: boolean
  testTruncation: boolean
  testWrapping: boolean
  testAlignment: boolean
  testAccessibility: boolean
}

// Mock texts for testing extreme cases
export const LAYOUT_TEST_TEXTS = {
  shortest: {
    en: 'OK',
    es: 'Vale',
    fr: 'OK',
    de: 'OK',
    pt: 'OK',
    ja: 'はい',
    ko: '확인',
    'zh-CN': '好'
  },
  medium: {
    en: 'Create Timestamp',
    es: 'Crear Marca de Tiempo',
    fr: 'Créer un Horodatage',
    de: 'Zeitstempel Erstellen',
    pt: 'Criar Marcador de Tempo',
    ja: 'タイムスタンプを作成',
    ko: '타임스탬프 생성',
    'zh-CN': '创建时间戳'
  },
  longest: {
    en: 'Add Timestamp at Current Video Time Position',
    es: 'Agregar Marca de Tiempo en la Posición Actual del Video',
    fr: 'Ajouter un Horodatage à la Position Actuelle de la Vidéo',
    de: 'Zeitstempel an der aktuellen Videoposition hinzufügen',
    pt: 'Adicionar Marcador de Tempo na Posição Atual do Vídeo',
    ja: '現在のビデオ時間位置にタイムスタンプを追加',
    ko: '현재 비디오 시간 위치에 타임스탬프 추가',
    'zh-CN': '在当前视频时间位置添加时间戳'
  },
  compound_german: {
    en: 'Video Chapter Management System',
    de: 'Videokaptelverwaltungssystemkonfigurationseinstellungen',
    fr: 'Système de Gestion des Chapitres Vidéo',
    es: 'Sistema de Gestión de Capítulos de Video',
    pt: 'Sistema de Gerenciamento de Capítulos de Vídeo',
    ja: 'ビデオチャプター管理システム',
    ko: '비디오 챕터 관리 시스템',
    'zh-CN': '视频章节管理系统'
  },
  special_chars: {
    en: 'File: "video.mp4" (1.2GB)',
    es: 'Archivo: "video.mp4" (1,2GB)',
    fr: 'Fichier : « video.mp4 » (1,2 Go)',
    de: 'Datei: „video.mp4" (1,2 GB)',
    pt: 'Arquivo: "video.mp4" (1,2GB)',
    ja: 'ファイル：「video.mp4」（1.2GB）',
    ko: '파일: "video.mp4" (1.2GB)',
    'zh-CN': '文件："video.mp4"（1.2GB）'
  }
}

// Define UI element selectors and their expected behavior
export const UI_ELEMENTS = {
  buttons: [
    { selector: '.btn-primary', type: 'button', maxLines: 1, priority: 'critical' },
    { selector: '.btn-secondary', type: 'button', maxLines: 1, priority: 'critical' },
    { selector: '[role="button"]', type: 'button', maxLines: 2, priority: 'warning' }
  ],
  navigation: [
    { selector: 'nav a', type: 'nav-link', maxLines: 1, priority: 'critical' },
    { selector: '.nav-item', type: 'nav-item', maxLines: 1, priority: 'critical' },
    { selector: '.breadcrumb', type: 'breadcrumb', maxLines: 1, priority: 'warning' }
  ],
  forms: [
    { selector: 'label', type: 'label', maxLines: 2, priority: 'warning' },
    { selector: 'input[placeholder]', type: 'placeholder', maxLines: 1, priority: 'warning' },
    { selector: '.error-message', type: 'error', maxLines: 3, priority: 'critical' }
  ],
  content: [
    { selector: 'h1, h2, h3', type: 'heading', maxLines: 2, priority: 'warning' },
    { selector: '.tooltip', type: 'tooltip', maxLines: 3, priority: 'warning' },
    { selector: '.notification', type: 'notification', maxLines: 4, priority: 'info' }
  ]
}

// Browser testing utilities
export class LayoutTester {
  private results: LayoutTestResult[] = []
  private config: LayoutTestConfig

  constructor(config: Partial<LayoutTestConfig> = {}) {
    this.config = {
      testOverflow: true,
      testTruncation: true,
      testWrapping: true,
      testAlignment: true,
      testAccessibility: true,
      ...config
    }
  }

  // Test all UI elements with different text lengths
  async testAllElements(): Promise<LayoutTestResult[]> {
    this.results = []
    
    // Test each category of UI elements
    for (const [category, elements] of Object.entries(UI_ELEMENTS)) {
      for (const element of elements) {
        await this.testElement(element, category)
      }
    }
    
    return this.results
  }

  // Test a specific UI element
  private async testElement(elementConfig: any, _category: string) {
    const elements = document.querySelectorAll(elementConfig.selector)
    
    elements.forEach((element, _index) => {
      const htmlElement = element as HTMLElement
      
      // Store original content
      const originalHTML = htmlElement.innerHTML
      
      // Test with different text lengths for each language
      Object.entries(SUPPORTED_LANGUAGES).forEach(([langCode, _langConfig]) => {
        // Test with longest text to check overflow
        this.testWithText(htmlElement, LAYOUT_TEST_TEXTS.longest[langCode as keyof typeof LAYOUT_TEST_TEXTS.longest], elementConfig, langCode, 'longest')
        
        // Test with compound German words
        if (langCode === 'de') {
          this.testWithText(htmlElement, LAYOUT_TEST_TEXTS.compound_german[langCode as keyof typeof LAYOUT_TEST_TEXTS.compound_german], elementConfig, langCode, 'compound')
        }
        
        // Test with special characters
        this.testWithText(htmlElement, LAYOUT_TEST_TEXTS.special_chars[langCode as keyof typeof LAYOUT_TEST_TEXTS.special_chars], elementConfig, langCode, 'special_chars')
      })
      
      // Restore original content
      htmlElement.innerHTML = originalHTML
    })
  }

  // Test element with specific text
  private testWithText(element: HTMLElement, text: string, config: any, language: string, testType: string) {
    if (!text) return
    
    // Set the text
    const originalText = element.textContent || ''
    element.textContent = text
    
    // Force layout recalculation
    element.offsetHeight
    
    // Test for overflow
    if (this.config.testOverflow) {
      this.checkOverflow(element, config, language, text, testType)
    }
    
    // Test for truncation
    if (this.config.testTruncation) {
      this.checkTruncation(element, config, language, text, testType)
    }
    
    // Test for inappropriate wrapping
    if (this.config.testWrapping) {
      this.checkWrapping(element, config, language, text, testType)
    }
    
    // Test text alignment
    if (this.config.testAlignment) {
      this.checkAlignment(element, config, language, text, testType)
    }
    
    // Test accessibility
    if (this.config.testAccessibility) {
      this.checkAccessibility(element, config, language, text, testType)
    }
    
    // Restore original text
    element.textContent = originalText
  }

  private checkOverflow(element: HTMLElement, config: any, language: string, text: string, testType: string) {
    const rect = element.getBoundingClientRect()
    const parentRect = element.parentElement?.getBoundingClientRect()
    
    if (parentRect && (rect.width > parentRect.width || rect.height > parentRect.height)) {
      this.results.push({
        element: `${config.selector} (${config.type})`,
        language,
        issue: `Text overflow detected with ${testType} text`,
        severity: config.priority as 'critical' | 'warning' | 'info',
        originalText: text,
        recommendation: 'Consider using shorter text, responsive design, or text truncation with ellipsis'
      })
    }
  }

  private checkTruncation(element: HTMLElement, config: any, language: string, text: string, testType: string) {
    const computedStyle = window.getComputedStyle(element)
    const hasEllipsis = computedStyle.textOverflow === 'ellipsis'
    const hasHiddenOverflow = computedStyle.overflow === 'hidden'
    
    if (hasEllipsis && hasHiddenOverflow) {
      // Check if text is actually being truncated
      const tempElement = element.cloneNode(true) as HTMLElement
      tempElement.style.width = 'auto'
      tempElement.style.maxWidth = 'none'
      tempElement.style.whiteSpace = 'nowrap'
      document.body.appendChild(tempElement)
      
      const fullWidth = tempElement.offsetWidth
      document.body.removeChild(tempElement)
      
      if (fullWidth > element.offsetWidth) {
        this.results.push({
          element: `${config.selector} (${config.type})`,
          language,
          issue: `Text truncation occurring with ${testType} text`,
          severity: 'warning',
          originalText: text,
          recommendation: 'Ensure truncated text is accessible via tooltip or expand functionality'
        })
      }
    }
  }

  private checkWrapping(element: HTMLElement, config: any, language: string, text: string, testType: string) {
    const lineHeight = parseInt(window.getComputedStyle(element).lineHeight)
    const actualHeight = element.offsetHeight
    const estimatedLines = Math.round(actualHeight / lineHeight)
    
    if (estimatedLines > config.maxLines) {
      this.results.push({
        element: `${config.selector} (${config.type})`,
        language,
        issue: `Text wrapping to ${estimatedLines} lines (max: ${config.maxLines}) with ${testType} text`,
        severity: estimatedLines > config.maxLines * 1.5 ? 'critical' : 'warning',
        originalText: text,
        recommendation: `Consider shorter text or allow up to ${estimatedLines} lines for this language`
      })
    }
  }

  private checkAlignment(element: HTMLElement, config: any, language: string, text: string, _testType: string) {
    const computedStyle = window.getComputedStyle(element)
    const direction = computedStyle.direction
    
    // Check RTL languages (Arabic would be added here if supported)
    const rtlLanguages: string[] = [] // Add RTL language codes here
    
    if (rtlLanguages.includes(language) && direction !== 'rtl') {
      this.results.push({
        element: `${config.selector} (${config.type})`,
        language,
        issue: `RTL language not properly aligned`,
        severity: 'warning',
        originalText: text,
        recommendation: 'Set direction: rtl for RTL languages'
      })
    }
  }

  private checkAccessibility(element: HTMLElement, config: any, language: string, text: string, _testType: string) {
    // Check if text is readable (contrast, size)
    const computedStyle = window.getComputedStyle(element)
    const fontSize = parseInt(computedStyle.fontSize)
    
    if (fontSize < 12) {
      this.results.push({
        element: `${config.selector} (${config.type})`,
        language,
        issue: `Font size too small for accessibility (${fontSize}px)`,
        severity: 'warning',
        originalText: text,
        recommendation: 'Ensure minimum font size of 12px for accessibility'
      })
    }
    
    // Check for proper ARIA labels if text is truncated
    if (!element.getAttribute('aria-label') && !element.getAttribute('title')) {
      const hasOverflow = element.scrollWidth > element.clientWidth
      if (hasOverflow) {
        this.results.push({
          element: `${config.selector} (${config.type})`,
          language,
          issue: `Truncated text without accessibility label`,
          severity: 'warning',
          originalText: text,
          recommendation: 'Add aria-label or title attribute for truncated text'
        })
      }
    }
  }

  // Generate a comprehensive report
  generateReport(): string {
    const criticalIssues = this.results.filter(r => r.severity === 'critical')
    const warningIssues = this.results.filter(r => r.severity === 'warning')
    const infoIssues = this.results.filter(r => r.severity === 'info')
    
    let report = '# UI Layout Test Report\n\n'
    report += `## Summary\n`
    report += `- Critical Issues: ${criticalIssues.length}\n`
    report += `- Warning Issues: ${warningIssues.length}\n`
    report += `- Info Issues: ${infoIssues.length}\n`
    report += `- Total Issues: ${this.results.length}\n\n`
    
    // Group by language
    const byLanguage = this.results.reduce((acc, result) => {
      if (!acc[result.language]) acc[result.language] = []
      acc[result.language].push(result)
      return acc
    }, {} as Record<string, LayoutTestResult[]>)
    
    report += `## Issues by Language\n`
    Object.entries(byLanguage).forEach(([lang, issues]) => {
      const critical = issues.filter(i => i.severity === 'critical').length
      const warning = issues.filter(i => i.severity === 'warning').length
      const info = issues.filter(i => i.severity === 'info').length
      report += `- ${lang}: ${critical} critical, ${warning} warnings, ${info} info\n`
    })
    
    if (criticalIssues.length > 0) {
      report += `\n## Critical Issues\n`
      criticalIssues.forEach(issue => {
        report += `### ${issue.element} [${issue.language}]\n`
        report += `**Issue:** ${issue.issue}\n`
        report += `**Text:** "${issue.originalText}"\n`
        report += `**Recommendation:** ${issue.recommendation}\n\n`
      })
    }
    
    return report
  }

  // Export results for further analysis
  exportResults(): LayoutTestResult[] {
    return [...this.results]
  }
}

// Utility function to run layout tests
export const runLayoutTests = async (config?: Partial<LayoutTestConfig>): Promise<LayoutTestResult[]> => {
  const tester = new LayoutTester(config)
  return await tester.testAllElements()
}

// Browser-specific testing utilities
export const browserTestUtils = {
  // Test on different viewport sizes
  testResponsive: async (viewports: { width: number; height: number; name: string }[]) => {
    const results: any[] = []
    
    for (const viewport of viewports) {
      // Set viewport size
      if (window.innerWidth !== viewport.width || window.innerHeight !== viewport.height) {
        window.resizeTo(viewport.width, viewport.height)
        await new Promise(resolve => setTimeout(resolve, 100)) // Wait for resize
      }
      
      const tester = new LayoutTester()
      const viewportResults = await tester.testAllElements()
      
      results.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        issues: viewportResults
      })
    }
    
    return results
  },
  
  // Test different font sizes (accessibility)
  testFontScaling: async (scales: number[]) => {
    const originalFontSize = document.documentElement.style.fontSize
    const results: any[] = []
    
    for (const scale of scales) {
      document.documentElement.style.fontSize = `${scale * 100}%`
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const tester = new LayoutTester()
      const scaleResults = await tester.testAllElements()
      
      results.push({
        scale: `${scale * 100}%`,
        issues: scaleResults
      })
    }
    
    // Restore original font size
    document.documentElement.style.fontSize = originalFontSize
    
    return results
  }
}
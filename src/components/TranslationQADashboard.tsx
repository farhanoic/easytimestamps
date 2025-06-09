import React, { useState } from 'react'
import { AlertTriangle, CheckCircle, Info, Download, Play, RefreshCw } from 'lucide-react'
import { generateQualityReport, exportIssues, TranslationIssue } from '../utils/translationQA'
import { runLayoutTests, browserTestUtils } from '../utils/layoutTesting'
import { useLocalization } from '../hooks/useLocalization'

interface QualityStats {
  totalKeys: number
  translatedKeys: number
  missingKeys: number
  completionRate: number
  issues: TranslationIssue[]
}

interface TestResults {
  translationQA: {
    summary: Record<string, QualityStats>
    allIssues: TranslationIssue[]
    recommendations: string[]
  } | null
  layoutTests: any[] | null
  loading: boolean
  lastUpdated: Date | null
}

const TranslationQADashboard: React.FC = () => {
  const [results, setResults] = useState<TestResults>({
    translationQA: null,
    layoutTests: null,
    loading: false,
    lastUpdated: null
  })
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [testMode, setTestMode] = useState<'basic' | 'comprehensive'>('basic')
  const { locale } = useLocalization()
  const currentLanguage = locale
  const switchLanguage = (lang: string) => {
    // Language switching functionality would be implemented here
    console.log('Switching to language:', lang)
  }

  // Run all QA tests
  const runAllTests = async () => {
    setResults(prev => ({ ...prev, loading: true }))
    
    try {
      // Run translation QA
      const translationReport = await generateQualityReport()
      
      // Run layout tests
      const layoutResults = await runLayoutTests({
        testOverflow: true,
        testTruncation: true,
        testWrapping: true,
        testAlignment: true,
        testAccessibility: true
      })
      
      // Run comprehensive tests if selected
      if (testMode === 'comprehensive') {
        await runComprehensiveTests()
      }
      
      setResults({
        translationQA: translationReport,
        layoutTests: layoutResults,
        loading: false,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error running QA tests:', error)
      setResults(prev => ({ ...prev, loading: false }))
    }
  }

  // Run comprehensive tests including browser testing
  const runComprehensiveTests = async () => {
    const viewports = [
      { width: 320, height: 568, name: 'Mobile Small' },
      { width: 375, height: 667, name: 'Mobile Medium' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 1024, height: 768, name: 'Desktop Small' },
      { width: 1920, height: 1080, name: 'Desktop Large' }
    ]
    
    const fontScales = [0.8, 1.0, 1.2, 1.5, 2.0]
    
    const responsiveTests = await browserTestUtils.testResponsive(viewports)
    const fontTests = await browserTestUtils.testFontScaling(fontScales)
    
    return {
      responsive: responsiveTests,
      fontScaling: fontTests
    }
  }

  // Test specific language by switching to it
  const testLanguage = async (languageCode: string) => {
    await switchLanguage(languageCode)
    await new Promise(resolve => setTimeout(resolve, 500)) // Wait for language switch
    await runAllTests()
  }

  // Export results to different formats
  const exportResults = (format: 'json' | 'csv' | 'markdown') => {
    if (!results.translationQA) return
    
    const exported = exportIssues(results.translationQA.allIssues, format)
    const blob = new Blob([exported], { 
      type: format === 'json' ? 'application/json' : 
           format === 'csv' ? 'text/csv' : 
           'text/markdown' 
    })
    
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `translation-qa-report.${format}`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Get severity color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />
      case 'warning': return <AlertTriangle className="h-4 w-4" />
      case 'info': return <Info className="h-4 w-4" />
      default: return <CheckCircle className="h-4 w-4" />
    }
  }

  // Filter issues based on selected language
  const filteredIssues = results.translationQA?.allIssues.filter(issue => 
    selectedLanguage === 'all' || issue.language === selectedLanguage
  ) || []

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Translation Quality Assurance Dashboard</h1>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2">
            <button
              onClick={runAllTests}
              disabled={results.loading}
              className="btn-primary flex items-center space-x-2"
            >
              {results.loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              <span>{results.loading ? 'Running Tests...' : 'Run QA Tests'}</span>
            </button>
            
            <select
              value={testMode}
              onChange={(e) => setTestMode(e.target.value as 'basic' | 'comprehensive')}
              className="input-field"
            >
              <option value="basic">Basic Tests</option>
              <option value="comprehensive">Comprehensive Tests</option>
            </select>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="input-field"
            >
              <option value="all">All Languages</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="pt">Portuguese</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
              <option value="zh-CN">Chinese</option>
            </select>
          </div>
          
          {results.translationQA && (
            <div className="flex gap-2">
              <button
                onClick={() => exportResults('json')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => exportResults('csv')}
                className="btn-secondary flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            </div>
          )}
        </div>
        
        {results.lastUpdated && (
          <p className="text-sm text-gray-500 mt-2">
            Last updated: {results.lastUpdated.toLocaleString()}
          </p>
        )}
      </div>

      {/* Summary Stats */}
      {results.translationQA && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(results.translationQA.summary).map(([lang, stats]) => (
            <div key={lang} className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{lang.toUpperCase()}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completion:</span>
                  <span className={`text-sm font-medium ${stats.completionRate >= 100 ? 'text-green-600' : stats.completionRate >= 90 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {stats.completionRate.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Issues:</span>
                  <span className="text-sm font-medium text-gray-900">{stats.issues.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${stats.completionRate >= 100 ? 'bg-green-500' : stats.completionRate >= 90 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${stats.completionRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Issues List */}
      {filteredIssues.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Issues Found ({filteredIssues.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredIssues.map((issue, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 p-1 rounded ${getSeverityColor(issue.severity)}`}>
                    {getSeverityIcon(issue.severity)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{issue.type}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm font-medium text-gray-700">{issue.language}</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 mb-1">{issue.message}</p>
                    <p className="text-sm text-gray-600 mb-2">Key: <code className="bg-gray-100 px-1 rounded">{issue.key}</code></p>
                    
                    {issue.suggestion && (
                      <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-2">
                        <p className="text-sm text-blue-800"><strong>Suggestion:</strong> {issue.suggestion}</p>
                      </div>
                    )}
                    
                    {issue.context && (
                      <details className="text-sm">
                        <summary className="text-gray-600 cursor-pointer hover:text-gray-800">Context</summary>
                        <pre className="bg-gray-50 p-2 rounded mt-2 text-xs overflow-x-auto">{issue.context}</pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layout Test Results */}
      {results.layoutTests && results.layoutTests.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Layout Test Results ({results.layoutTests.length} issues)
            </h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.layoutTests.slice(0, 12).map((result, index) => (
                <div key={index} className="border border-gray-200 rounded p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${
                      result.severity === 'critical' ? 'bg-red-500' :
                      result.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                    <span className="font-medium text-sm">{result.element}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{result.language}</p>
                  <p className="text-sm text-gray-900">{result.issue}</p>
                </div>
              ))}
            </div>
            
            {results.layoutTests.length > 12 && (
              <p className="text-center text-gray-500 mt-4">
                ... and {results.layoutTests.length - 12} more layout issues
              </p>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {results.translationQA?.recommendations && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h2>
          <ul className="space-y-2">
            {results.translationQA.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Language Tests */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Language Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {['en', 'es', 'fr', 'de', 'pt', 'ja', 'ko', 'zh-CN'].map(lang => (
            <button
              key={lang}
              onClick={() => testLanguage(lang)}
              className={`p-2 text-sm border rounded hover:bg-gray-50 ${
                currentLanguage === lang ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
              }`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TranslationQADashboard
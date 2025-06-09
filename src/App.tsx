import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import TimestampExtractor from './components/TimestampExtractor'
import Features from './components/Features'
import FAQ from './components/FAQ'
import Privacy from './components/Privacy'
import Contact from './components/Contact'
import AboutPage from './components/AboutPage'
import Settings from './components/Settings'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import Logo from './components/Logo'
import { LocalizationProvider } from './components/LocalizationProvider'
import { PrivacyCompliance } from './components/PrivacyCompliance'
import { useTheme } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import { AuthModal } from './components/AuthModal'
import { GitHubCallback } from './components/GitHubCallback'
import SEOHead from './components/SEOHead'
import { Sun, Moon, Crown } from 'lucide-react'
import { trackUIEvent, trackFeatureUsage } from './utils/analytics'
import { useTranslation } from 'react-i18next'
import { authAnalytics } from './services/authAnalytics'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [comingSoonModalOpen, setComingSoonModalOpen] = useState(false)

  // Listen for auth modal events from Navigation
  useEffect(() => {
    const handleOpenAuthModal = (event: CustomEvent) => {
      setAuthMode(event.detail.mode)
      setAuthModalOpen(true)
    }

    const handleOpenComingSoonModal = () => {
      setComingSoonModalOpen(true)
    }

    window.addEventListener('openAuthModal', handleOpenAuthModal as EventListener)
    window.addEventListener('openComingSoonModal', handleOpenComingSoonModal as EventListener)
    return () => {
      window.removeEventListener('openAuthModal', handleOpenAuthModal as EventListener)
      window.removeEventListener('openComingSoonModal', handleOpenComingSoonModal as EventListener)
    }
  }, [])

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    toggleTheme()
    
    // Track theme toggle
    trackUIEvent('theme_changed', {
      from_theme: theme,
      to_theme: newTheme
    })
    trackFeatureUsage('theme_toggle')
  }

  const HomePage = () => (
    <>
      {/* Header */}
      <header className="relative text-center py-12 px-4">
        {/* Theme Toggle Button */}
        <button
          onClick={handleThemeToggle}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white dark:bg-gray-800 border border-neutral-200 dark:border-gray-700 hover:bg-neutral-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <Moon className="h-5 w-5 text-neutral-700 dark:text-gray-300" />
          ) : (
            <Sun className="h-5 w-5 text-neutral-700 dark:text-gray-300" />
          )}
        </button>
        
        <div className="mb-6 flex justify-center">
          <Logo size="hero" showText={false} />
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 dark:text-gray-200 mb-4">
          {t('header.subtitle')}
        </h1>
        <p className="text-base md:text-lg text-neutral-500 dark:text-gray-400 max-w-2xl mx-auto">
          {t('header.description')}
        </p>
      </header>
      
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <TimestampExtractor />
      </main>
    </>
  )

  return (
    <AuthProvider>
      <LocalizationProvider>
        <Router>
        <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 transition-colors duration-200">
          {/* Navigation */}
          <Navigation />
          
          <Routes>
            <Route path="/" element={
              <>
                <SEOHead pageType="home" />
                <HomePage />
              </>
            } />
            <Route path="/features" element={
              <>
                <SEOHead pageType="features" />
                <Features />
              </>
            } />
            <Route path="/faq" element={
              <>
                <SEOHead pageType="faq" />
                <FAQ />
              </>
            } />
            <Route path="/privacy" element={
              <>
                <SEOHead pageType="privacy" />
                <Privacy />
              </>
            } />
            <Route path="/contact" element={
              <>
                <SEOHead pageType="contact" />
                <Contact />
              </>
            } />
            <Route path="/about" element={
              <>
                <SEOHead pageType="about" />
                <AboutPage />
              </>
            } />
            <Route path="/settings" element={
              <>
                <SEOHead pageType="settings" />
                <Settings />
              </>
            } />
            <Route path="/auth/github/callback" element={<GitHubCallback />} />
          </Routes>
          
          {/* Footer */}
          <Footer />
          
          {/* Privacy Compliance Banner */}
          <PrivacyCompliance />
          
          {/* Auth Modal - Rendered at app level for proper overlay */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={() => setAuthModalOpen(false)}
            initialMode={authMode}
          />

          {/* Coming Soon Modal - Rendered at app level for proper overlay */}
          {comingSoonModalOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[99999] p-4 animate-in fade-in duration-200"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setComingSoonModalOpen(false)
                  authAnalytics.trackEngagement('coming_soon_modal_closed', {
                    method: 'backdrop'
                  })
                }
              }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 transform transition-all duration-300 scale-100 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 animate-in zoom-in duration-200">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                    {t('upgrade.comingSoon.title', 'Coming Soon!')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {t('upgrade.comingSoon.message', 'We\'re working hard to bring you premium features. Stay tuned for exciting updates!')}
                  </p>
                </div>
                
                {/* OK Button */}
                <button
                  onClick={() => {
                    setComingSoonModalOpen(false)
                    authAnalytics.trackEngagement('coming_soon_modal_closed', {
                      method: 'button'
                    })
                  }}
                  className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {t('common.ok', 'OK')}
                </button>
              </div>
            </div>
          )}
        </div>
        </Router>
      </LocalizationProvider>
    </AuthProvider>
  )
}

export default App
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AnimatedBackground from './components/AnimatedBackground'
import GradientOverlay from './components/GradientOverlay'
import ParticleField from './components/ParticleField'
import { LocalizationProvider } from './components/LocalizationProvider'
import { PrivacyCompliance } from './components/PrivacyCompliance'
import { useTheme } from './contexts/ThemeContext'
import SEOHead from './components/SEOHead'
import { Sun, Moon } from 'lucide-react'
import { trackUIEvent, trackFeatureUsage } from './utils/analytics'
import { useTranslation } from 'react-i18next'

function App() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useTranslation()

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
      {/* Animated Background */}
      <GradientOverlay />
      <ParticleField />
      <AnimatedBackground />
      
      {/* Header */}
      <header className="relative text-center py-12 px-4 z-10">
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
      <main className="relative max-w-6xl mx-auto px-4 pb-16 z-10">
        <TimestampExtractor />
      </main>
    </>
  )

  return (
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
        </Routes>
        
        {/* Footer */}
        <Footer />
        
        {/* Privacy Compliance Banner */}
        <PrivacyCompliance />
      </div>
      </Router>
    </LocalizationProvider>
  )
}

export default App
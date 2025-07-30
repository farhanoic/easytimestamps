import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Users, HelpCircle, Shield, Mail, Zap } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { trackUIEvent } from '../utils/analytics'
import Logo from './Logo'
import LanguageSelector from './LanguageSelector'

interface DropdownItem {
  label: string
  href?: string
  icon?: React.ReactNode
  description?: string
  onClick?: () => void
  badge?: string
}

function Navigation() {
  const { t } = useTranslation()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const timeoutRef = useRef<number | undefined>()

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null)
    }
    
    if (activeDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [activeDropdown])

  const handleDropdownLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setActiveDropdown(null)
    }, 150)
  }

  const handleItemClick = (item: DropdownItem, category: string) => {
    trackUIEvent('navigation_click', {
      category,
      item: item.label,
      href: item.href
    })
    
    if (item.onClick) {
      item.onClick()
    }
    
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
  }


  // Toolkit menu component
  const ToolkitMenu = () => (
    <div className="relative">
      <div
        className="group p-2 rounded-lg text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
        onMouseEnter={() => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }
          setActiveDropdown('toolkit')
        }}
        onMouseLeave={() => {
          timeoutRef.current = window.setTimeout(() => {
            setActiveDropdown(null)
          }, 150)
        }}
      >
        {/* 9 dots pattern with arrow animation */}
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
          {/* Dots with smooth transition to arrow - 3x3 grid */}
          {/* Top row */}
          <circle 
            cx="7" cy="7" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:translate-x-1 group-hover:translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="12" cy="7" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="17" cy="7" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-x-1 group-hover:translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
          
          {/* Middle row */}
          <circle 
            cx="7" cy="12" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:translate-x-2"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="12" cy="12" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="17" cy="12" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-x-2"
            style={{ transformOrigin: 'center' }}
          />
          
          {/* Bottom row */}
          <circle 
            cx="7" cy="17" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="12" cy="17" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
          <circle 
            cx="17" cy="17" r="1.5" 
            fill="currentColor"
            className="transition-all duration-300 ease-in-out group-hover:transform group-hover:-translate-x-1 group-hover:-translate-y-2"
            style={{ transformOrigin: 'center' }}
          />
        </svg>
      </div>

      {/* Mega dropdown menu */}
      {(activeDropdown === 'toolkit' || activeDropdown === 'help-submenu') && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-neutral-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current)
            }
          }}
          onMouseLeave={handleDropdownLeave}
        >
          <Link
            to="/features"
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150"
            onClick={() => handleItemClick({ label: t('navigation.features'), href: '/features' }, 'features')}
          >
            <Zap className="h-4 w-4 text-neutral-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {t('navigation.features')}
            </span>
          </Link>
          <div 
            className="relative group"
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }
              setActiveDropdown('help-submenu')
            }}
            onMouseLeave={() => {
              timeoutRef.current = window.setTimeout(() => {
                setActiveDropdown('toolkit')
              }, 100)
            }}
          >
            <button
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150 ${
                activeDropdown === 'help-submenu' ? 'bg-neutral-50 dark:bg-gray-800' : ''
              }`}
              onClick={() => handleItemClick({ label: t('navigation.help'), href: '/help' }, 'help')}
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-4 w-4 text-neutral-500 dark:text-gray-400" />
                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                  {t('navigation.help')}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-neutral-500 dark:text-gray-400" />
            </button>
            
            {/* Help submenu */}
            {activeDropdown === 'help-submenu' && (
              <div 
                className="absolute left-full top-0 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-neutral-200 dark:border-gray-700 py-1 z-50"
                onMouseEnter={() => {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                  }
                  setActiveDropdown('help-submenu')
                }}
                onMouseLeave={() => {
                  timeoutRef.current = window.setTimeout(() => {
                    setActiveDropdown('toolkit')
                  }, 100)
                }}
              >
                <Link
                  to="/faq"
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150"
                  onClick={() => handleItemClick({ label: t('navigation.faq'), href: '/faq' }, 'help')}
                >
                  <HelpCircle className="h-3 w-3 text-neutral-500 dark:text-gray-400" />
                  <span className="text-neutral-900 dark:text-white">{t('navigation.faq')}</span>
                </Link>
                <Link
                  to="/privacy"
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150"
                  onClick={() => handleItemClick({ label: t('navigation.privacy'), href: '/privacy' }, 'help')}
                >
                  <Shield className="h-3 w-3 text-neutral-500 dark:text-gray-400" />
                  <span className="text-neutral-900 dark:text-white">{t('navigation.privacy')}</span>
                </Link>
                <Link
                  to="/contact"
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150"
                  onClick={() => handleItemClick({ label: t('navigation.contact'), href: '/contact' }, 'help')}
                >
                  <Mail className="h-3 w-3 text-neutral-500 dark:text-gray-400" />
                  <span className="text-neutral-900 dark:text-white">{t('navigation.contact')}</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Language Selector */}
          <div className="px-4 py-3 flex items-center gap-3 hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150">
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {t('navigation.language')}:
            </span>
            <LanguageSelector size="sm" showLabel={false} triggerOnHover={true} />
          </div>
          
          <Link
            to="/about"
            className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-gray-800 transition-colors duration-150"
            onClick={() => handleItemClick({ label: t('navigation.about'), href: '/about' }, 'about')}
          >
            <Users className="h-4 w-4 text-neutral-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
              {t('navigation.about')}
            </span>
          </Link>
        </div>
      )}
    </div>
  )

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo size="large" showText={false} />
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <ToolkitMenu />
          </div>

          {/* Mobile right side */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              className="p-2 rounded-lg text-neutral-700 dark:text-gray-300 hover:bg-neutral-100 dark:hover:bg-gray-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-gray-700 py-4 space-y-1">
            <Link
              to="/features"
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => handleItemClick({ label: t('navigation.features'), href: '/features' }, 'features')}
            >
              <Zap className="h-4 w-4" />
              {t('navigation.features')}
            </Link>
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-gray-400">
                {t('navigation.help')}
              </div>
              <Link
                to="/faq"
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg ml-4"
                onClick={() => handleItemClick({ label: t('navigation.faq'), href: '/faq' }, 'help')}
              >
                <HelpCircle className="h-4 w-4" />
                {t('navigation.faq')}
              </Link>
              <Link
                to="/privacy"
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg ml-4"
                onClick={() => handleItemClick({ label: t('navigation.privacy'), href: '/privacy' }, 'help')}
              >
                <Shield className="h-4 w-4" />
                {t('navigation.privacy')}
              </Link>
              <Link
                to="/contact"
                className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg ml-4"
                onClick={() => handleItemClick({ label: t('navigation.contact'), href: '/contact' }, 'help')}
              >
                <Mail className="h-4 w-4" />
                {t('navigation.contact')}
              </Link>
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-neutral-500 dark:text-gray-400">
                {t('navigation.language')}
              </div>
              <div className="px-3 py-2">
                <LanguageSelector size="md" triggerOnHover={false} />
              </div>
            </div>
            <Link
              to="/about"
              className="w-full flex items-center gap-3 px-3 py-2 text-left text-sm text-neutral-600 dark:text-gray-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-gray-800 rounded-lg"
              onClick={() => handleItemClick({ label: t('navigation.about'), href: '/about' }, 'about')}
            >
              <Users className="h-4 w-4" />
              {t('navigation.about')}
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
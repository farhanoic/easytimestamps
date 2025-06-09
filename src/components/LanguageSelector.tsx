import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Search, Check, ChevronDown } from 'lucide-react';
import { languages, getLanguageByCode } from '../i18n';
import { trackUIEvent } from '../utils/analytics';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  triggerOnHover?: boolean;
  onChange?: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className = '',
  showLabel = true,
  size = 'md',
  triggerOnHover = false,
  onChange
}) => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<number | undefined>();

  const currentLanguage = getLanguageByCode(i18n.language);

  // Filter languages based on search term
  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredLanguages.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : filteredLanguages.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < filteredLanguages.length) {
            handleLanguageChange(filteredLanguages[selectedIndex].code);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredLanguages]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleLanguageChange = async (languageCode: string) => {
    const previousLanguage = i18n.language;
    const newLanguage = getLanguageByCode(languageCode);
    
    // Track language change
    trackUIEvent('language_changed', {
      from_language: previousLanguage,
      to_language: languageCode,
      language_name: newLanguage.name,
      native_name: newLanguage.nativeName
    });

    try {
      await i18n.changeLanguage(languageCode);
      
      // Update document direction for RTL languages
      document.documentElement.dir = newLanguage.rtl ? 'rtl' : 'ltr';
      document.documentElement.lang = languageCode;
      
      // Store language preference
      localStorage.setItem('easytimestamps-language', languageCode);
      
      setIsOpen(false);
      setSearchTerm('');
      setSelectedIndex(-1);
      
      // Call onChange callback if provided
      if (onChange) {
        onChange();
      }
      
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setSearchTerm('');
      setSelectedIndex(-1);
    }
  };

  const handleMouseEnter = () => {
    if (triggerOnHover) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(true);
        setSearchTerm('');
        setSelectedIndex(-1);
      }, 150); // Small delay to prevent accidental opens
    }
  };

  const handleMouseLeave = () => {
    if (triggerOnHover) {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = window.setTimeout(() => {
        setIsOpen(false);
        setSearchTerm('');
        setSelectedIndex(-1);
      }, 200); // Slightly longer delay to allow moving to dropdown
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          button: 'px-3 py-2 sm:px-2 sm:py-1 text-base sm:text-sm min-h-[44px] sm:min-h-[32px] touch-manipulation',
          dropdown: 'w-72 sm:w-64',
          flag: 'text-base sm:text-sm',
          icon: 'h-4 w-4 sm:h-3 sm:w-3'
        };
      case 'lg':
        return {
          button: 'px-5 py-3 sm:px-4 sm:py-3 text-lg min-h-[48px] touch-manipulation',
          dropdown: 'w-80 sm:w-80',
          flag: 'text-lg',
          icon: 'h-5 w-5'
        };
      default:
        return {
          button: 'px-4 py-3 sm:px-3 sm:py-2 text-base sm:text-sm min-h-[48px] sm:min-h-[40px] touch-manipulation',
          dropdown: 'w-full sm:w-76',
          flag: 'text-base',
          icon: 'h-4 w-4'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div 
      className={`relative ${className}`} 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <button
        onClick={!triggerOnHover ? toggleDropdown : undefined}
        className={`flex items-center gap-2 ${sizeClasses.button} bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
          isOpen ? 'ring-2 ring-blue-500 border-blue-500' : ''
        }`}
        style={{ WebkitTapHighlightColor: 'transparent' }}
        aria-label={t('language.selector.title')}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className={sizeClasses.flag}>{currentLanguage.flag}</span>
        {showLabel && (
          <>
            <Globe className={`${sizeClasses.icon} text-gray-500 dark:text-gray-400`} />
            <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">
              {currentLanguage.nativeName}
            </span>
          </>
        )}
        <ChevronDown
          className={`${sizeClasses.icon} text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute top-full left-0 mt-2 ${sizeClasses.dropdown} bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-[60] animate-in fade-in slide-in-from-top-2 duration-200`}
          role="listbox"
          aria-label={t('language.selector.title')}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
              {t('language.selector.title')}
            </h3>
            
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(-1);
                }}
                placeholder={t('language.selector.searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoComplete="off"
              />
            </div>
          </div>

          {/* Language List */}
          <div
            ref={listRef}
            className="max-h-60 overflow-y-auto py-2"
            role="list"
          >
            {filteredLanguages.length > 0 ? (
              filteredLanguages.map((language, index) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                    selectedIndex === index ? 'bg-gray-50 dark:bg-gray-700' : ''
                  } ${
                    language.code === i18n.language ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                  }`}
                  role="option"
                  aria-selected={language.code === i18n.language}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {language.nativeName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {language.name}
                      </span>
                    </div>
                  </div>
                  
                  {language.code === i18n.language && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                        {t('language.selector.current')}
                      </span>
                      <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="h-8 w-8 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('language.selector.noResults')}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750 rounded-b-xl">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {filteredLanguages.length} {filteredLanguages.length === 1 ? 'language' : 'languages'} available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
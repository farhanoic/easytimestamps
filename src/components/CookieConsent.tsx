/**
 * Cookie Consent Component
 * GDPR-compliant cookie consent with granular controls
 */

import React, { useState, useEffect } from 'react';
import { Cookie, Settings, Check, X, Shield, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CookieSettings {
  essential: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}

export const CookieConsent: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CookieSettings>({
    essential: true, // Always required
    analytics: false,
    preferences: false,
    marketing: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    } else {
      // Load saved preferences
      try {
        const savedSettings = JSON.parse(consent);
        setSettings(savedSettings);
      } catch {
        // If parsing fails, show consent banner again
        setIsVisible(true);
      }
    }
  }, []);

  const saveConsent = (consentSettings: CookieSettings) => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      ...consentSettings,
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    
    setIsVisible(false);
    setShowSettings(false);

    // Apply cookie settings
    applyCookieSettings(consentSettings);
  };

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      preferences: true,
      marketing: true
    };
    setSettings(allAccepted);
    saveConsent(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      preferences: false,
      marketing: false
    };
    setSettings(essentialOnly);
    saveConsent(essentialOnly);
  };

  const saveCustomSettings = () => {
    saveConsent(settings);
  };

  const applyCookieSettings = (cookieSettings: CookieSettings) => {
    // Apply analytics cookies
    if (cookieSettings.analytics) {
      // Enable Google Analytics or other analytics
      console.log('Analytics cookies enabled');
    } else {
      // Disable analytics
      console.log('Analytics cookies disabled');
    }

    // Apply preference cookies
    if (cookieSettings.preferences) {
      // Enable preference tracking
      console.log('Preference cookies enabled');
    }

    // Apply marketing cookies
    if (cookieSettings.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-gray-800 rounded-t-2xl w-full max-w-4xl shadow-2xl animate-in slide-in-from-bottom duration-300">
        {showSettings ? (
          // Detailed Settings View
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Cookie Preferences
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose which cookies you want to allow
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Essential Cookies
                      </h3>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
                        Always On
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      These cookies are necessary for the website to function and cannot be switched off. 
                      They are usually only set in response to actions made by you such as setting your 
                      privacy preferences, logging in, or filling in forms.
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Examples:</strong> Authentication, security, basic functionality
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="w-10 h-6 bg-green-500 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Analytics Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      These cookies help us understand how visitors interact with our website by 
                      collecting and reporting information anonymously. This helps us improve our service.
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Examples:</strong> Google Analytics, usage statistics, performance monitoring
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setSettings({ ...settings, analytics: !settings.analytics })}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        settings.analytics 
                          ? 'bg-blue-500 justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Preference Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Preference Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      These cookies remember your preferences and settings to provide you with a 
                      more personalized experience on future visits.
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Examples:</strong> Language preference, theme settings, interface customization
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setSettings({ ...settings, preferences: !settings.preferences })}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        settings.preferences 
                          ? 'bg-purple-500 justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Cookie className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        Marketing Cookies
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      These cookies track your online activity to help advertisers deliver more 
                      relevant advertising or to limit how many times you see an ad.
                    </p>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <strong>Examples:</strong> Social media widgets, advertising networks, remarketing
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={() => setSettings({ ...settings, marketing: !settings.marketing })}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        settings.marketing 
                          ? 'bg-orange-500 justify-end' 
                          : 'bg-gray-300 dark:bg-gray-600 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <button
                onClick={saveCustomSettings}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Save Preferences</span>
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Accept All
              </button>
            </div>
          </div>
        ) : (
          // Simple Consent View
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  We Use Cookies
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                  We use cookies to enhance your experience, analyze our traffic, and provide 
                  personalized content. You can choose which cookies to accept below.
                </p>
                
                {/* Privacy Highlights */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3 mb-4">
                  <div className="flex items-center space-x-2 text-green-800 dark:text-green-200 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>{t('contact.privacy.title')}</span>
                  </div>
                  <ul className="mt-2 text-xs text-green-700 dark:text-green-300 space-y-1">
                    <li>• We never sell your personal data</li>
                    <li>• You can change your preferences anytime</li>
                    <li>• Essential cookies only for basic functionality</li>
                  </ul>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={acceptAll}
                    className="bg-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept All</span>
                  </button>
                  
                  <button
                    onClick={acceptEssential}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Essential Only
                  </button>
                  
                  <button
                    onClick={() => setShowSettings(true)}
                    className="border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-xl font-semibold hover:border-gray-400 dark:hover:border-gray-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Customize</span>
                  </button>
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  <p>
                    By continuing to use our website, you consent to our use of cookies. 
                    Read our{' '}
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                      {t('navigation.privacy')}
                    </a>
                    {' '}and{' '}
                    <a href="/cookies" target="_blank" className="text-blue-600 hover:text-blue-700 underline">
                      Cookie Policy
                    </a>
                    {' '}for more information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
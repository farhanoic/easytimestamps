import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocalization } from '../hooks/useLocalization';
import { X, Cookie } from 'lucide-react';

interface PrivacyComplianceProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const PrivacyCompliance: React.FC<PrivacyComplianceProps> = ({
  onAccept,
  onDecline
}) => {
  const { t } = useTranslation();
  const { isRTL, getDirectionClass } = useLocalization();
  const [showBanner, setShowBanner] = useState(false);
  const [consentType, setConsentType] = useState<'gdpr' | 'ccpa' | 'cookies' | null>(null);

  useEffect(() => {
    // Check if consent is already given
    const hasConsent = localStorage.getItem('privacy-consent');
    if (!hasConsent) {
      // Always show simple cookie consent
      setConsentType('cookies');
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacy-consent', 'accepted');
    localStorage.setItem('privacy-consent-type', consentType || '');
    localStorage.setItem('privacy-consent-date', new Date().toISOString());
    setShowBanner(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('privacy-consent', 'declined');
    localStorage.setItem('privacy-consent-type', consentType || '');
    localStorage.setItem('privacy-consent-date', new Date().toISOString());
    setShowBanner(false);
    onDecline?.();
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner || !consentType) {
    return null;
  }

  const getConsentContent = () => {
    return {
      title: t('privacy.cookies.title', 'Cookie Notice'),
      description: t('privacy.cookies.description', 'This website uses cookies to enhance your browsing experience.'),
      acceptText: t('privacy.cookies.accept', 'Accept Cookies'),
      declineText: t('privacy.cookies.decline', 'Essential Only'),
      learnMoreText: t('privacy.cookies.learnMore', 'Privacy Policy'),
      icon: <Cookie className="w-5 h-5" />
    };
  };

  const content = getConsentContent();

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${getDirectionClass()}`}>
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <div className="text-blue-600 dark:text-blue-400">
                {content.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                  {content.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {content.description}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} ml-4`}>
              <a
                href="/privacy"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
              >
                {content.learnMoreText}
              </a>
              
              <button
                onClick={handleDecline}
                className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors whitespace-nowrap"
              >
                {content.declineText}
              </button>
              
              <button
                onClick={handleAccept}
                className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                {content.acceptText}
              </button>
              
              <button
                onClick={handleDismiss}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={t('common.close', 'Close')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
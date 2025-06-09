import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Cloud, 
  X, 
  CheckCircle,
  Star,
  Users,
  RotateCcw
} from 'lucide-react';
import { useLocalization } from '../hooks/useLocalization';

interface SignupPromptProps {
  trigger: 'success' | 'storage_limit' | 'multiple_projects' | 'feature_discovery';
  onClose: () => void;
  onSignup: () => void;
  onRemindLater: () => void;
}

export const SignupPrompt: React.FC<SignupPromptProps> = ({
  trigger,
  onClose,
  onSignup,
  onRemindLater
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();

  const getPromptContent = () => {
    switch (trigger) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: t('signup.success.title', '🎉 Great work!'),
          subtitle: t('signup.success.subtitle', 'You just created your first timestamp project!'),
          description: t('signup.success.description', 'Want to save your projects in the cloud so you can access them from any device?'),
          benefits: [
            t('signup.benefits.cloudSync', 'Cloud sync across all devices'),
            t('signup.benefits.backup', 'Automatic backup & restore'),
            t('signup.benefits.sharing', 'Share projects with team members')
          ]
        };
      case 'storage_limit':
        return {
          icon: <Cloud className="w-8 h-8 text-blue-500" />,
          title: t('signup.storage.title', 'Want cloud storage?'),
          subtitle: t('signup.storage.subtitle', 'Save your work in the cloud'),
          description: t('signup.storage.description', 'Upgrade to cloud storage for unlimited projects and access from anywhere.'),
          benefits: [
            t('signup.benefits.unlimited', 'Unlimited cloud storage'),
            t('signup.benefits.access', 'Access from any device'),
            t('signup.benefits.security', 'Secure cloud backup')
          ]
        };
      case 'multiple_projects':
        return {
          icon: <RotateCcw className="w-8 h-8 text-purple-500" />,
          title: t('signup.multiple.title', 'Working on multiple projects?'),
          subtitle: t('signup.multiple.subtitle', 'Keep them synced across devices'),
          description: t('signup.multiple.description', 'Sign up to sync all your projects and never lose your work again.'),
          benefits: [
            t('signup.benefits.sync', 'Real-time sync'),
            t('signup.benefits.collaborate', 'Collaboration tools'),
            t('signup.benefits.history', 'Version history')
          ]
        };
      case 'feature_discovery':
      default:
        return {
          icon: <Star className="w-8 h-8 text-yellow-500" />,
          title: t('signup.discover.title', 'Unlock premium features'),
          subtitle: t('signup.discover.subtitle', 'Get the most out of Easy Timestamps'),
          description: t('signup.discover.description', 'Join thousands of creators who use Easy Timestamps Pro for their workflow.'),
          benefits: [
            t('signup.benefits.aiGeneration', 'AI-powered timestamp generation'),
            t('signup.benefits.templates', 'Custom templates & themes'),
            t('signup.benefits.analytics', 'Project analytics & insights')
          ]
        };
    }
  };

  const content = getPromptContent();

  // Auto-dismiss after 15 seconds if no interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemindLater();
    }, 15000);

    return () => clearTimeout(timer);
  }, [onRemindLater]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 ${isRTL ? 'rtl' : 'ltr'} transform transition-all duration-300 scale-100`}>
        {/* Header */}
        <div className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            {content.icon}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {content.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {content.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Description */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {content.description}
        </p>

        {/* Benefits */}
        <div className="space-y-2 mb-6">
          {content.benefits.map((benefit, index) => (
            <div key={index} className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-6">
          <div className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''}`}>
            <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {t('signup.socialProof', 'Join 10,000+ creators already using Easy Timestamps Pro')}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={onSignup}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Cloud className="w-4 h-4" />
            <span>{t('signup.getStarted', 'Get Started - It\'s Free!')}</span>
          </button>

          <div className={`flex space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
            <button
              onClick={onRemindLater}
              className="flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
            >
              {t('signup.remindLater', 'Remind me later')}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm"
            >
              {t('signup.noThanks', 'No thanks')}
            </button>
          </div>
        </div>

        {/* Fine Print */}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          {t('signup.finePrint', 'No credit card required. Free plan includes 5 cloud projects.')}
        </p>
      </div>
    </div>
  );
};

// Hook for managing signup prompt logic
export const useSignupPrompt = () => {
  const [shouldShow, setShouldShow] = useState(false);
  const [trigger, setTrigger] = useState<SignupPromptProps['trigger']>('success');

  // Check local storage for prompt preferences
  const getPromptPreferences = () => {
    try {
      const prefs = localStorage.getItem('easy_timestamps_signup_prefs');
      return prefs ? JSON.parse(prefs) : {};
    } catch {
      return {};
    }
  };

  const setPromptPreferences = (prefs: any) => {
    try {
      localStorage.setItem('easy_timestamps_signup_prefs', JSON.stringify(prefs));
    } catch {
      // Ignore storage errors
    }
  };

  const shouldShowPrompt = (triggerType: SignupPromptProps['trigger']): boolean => {
    const prefs = getPromptPreferences();
    const lastDismissed = prefs[`${triggerType}_dismissed`];
    const remindLater = prefs[`${triggerType}_remind_later`];

    // Don't show if permanently dismissed
    if (lastDismissed && !remindLater) {
      return false;
    }

    // Don't show if reminded later and it's been less than 7 days
    if (remindLater) {
      const daysSince = (Date.now() - remindLater) / (1000 * 60 * 60 * 24);
      if (daysSince < 7) {
        return false;
      }
    }

    return true;
  };

  const showPrompt = (triggerType: SignupPromptProps['trigger']) => {
    if (shouldShowPrompt(triggerType)) {
      setTrigger(triggerType);
      setShouldShow(true);
    }
  };

  const handleClose = () => {
    setShouldShow(false);
    const prefs = getPromptPreferences();
    prefs[`${trigger}_dismissed`] = Date.now();
    setPromptPreferences(prefs);
  };

  const handleRemindLater = () => {
    setShouldShow(false);
    const prefs = getPromptPreferences();
    prefs[`${trigger}_remind_later`] = Date.now();
    setPromptPreferences(prefs);
  };

  const handleSignup = () => {
    setShouldShow(false);
    // Track conversion
    console.log('Signup triggered from:', trigger);
    // Redirect to signup flow
    window.open('#signup', '_blank');
  };

  return {
    shouldShow,
    trigger,
    showPrompt,
    handleClose,
    handleRemindLater,
    handleSignup
  };
};
/**
 * Upgrade Prompt Component
 * Displays contextual upgrade prompts based on user tier and feature usage
 */

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Crown, 
  X, 
  Check, 
  Zap, 
  Users, 
  Cloud, 
  Shield,
  Star,
  Clock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService, SUBSCRIPTION_PLANS } from '../services/subscriptionService';
import { authAnalytics } from '../services/authAnalytics';
import { useLocalization } from '../hooks/useLocalization';

export interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: 'feature_limit' | 'usage_limit' | 'collaboration' | 'storage' | 'export' | 'manual';
  feature?: string;
  targetTier?: 'premium' | 'pro';
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  trigger = 'manual',
  feature,
  targetTier
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { user } = useAuth();
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !user) return null;

  // Determine recommended tier based on trigger and current usage
  const recommendations = subscriptionService.getUpgradeRecommendations(user);
  const recommendedTier = targetTier || recommendations.recommendedTier;
  
  const currentPlan = SUBSCRIPTION_PLANS[user.tier];
  const targetPlan = SUBSCRIPTION_PLANS[recommendedTier];
  
  // Get yearly discount
  const yearlyDiscount = subscriptionService.getYearlyDiscount(recommendedTier);
  
  // Trial information
  const trialInfo = subscriptionService.getTrialInfo(recommendedTier);
  const isTrialAvailable = user.tier === 'free' && !subscriptionService.isInTrial(user);

  const handleClose = () => {
    authAnalytics.trackEngagement('upgrade_prompt_closed', {
      trigger,
      feature,
      currentTier: user.tier,
      targetTier: recommendedTier,
      method: 'close_button'
    });
    onClose();
  };

  const handleUpgrade = async (planType: 'trial' | 'subscription') => {
    setIsLoading(true);
    
    authAnalytics.trackEngagement('upgrade_button_clicked', {
      trigger,
      feature,
      currentTier: user.tier,
      targetTier: recommendedTier,
      billing: selectedBilling,
      planType
    });

    try {
      // Simulate upgrade process - replace with actual payment integration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (planType === 'trial') {
        // Start trial
        console.log(`Starting ${trialInfo.trialDays}-day trial for ${recommendedTier}`);
      } else {
        // Process subscription
        console.log(`Upgrading to ${recommendedTier} (${selectedBilling})`);
      }
      
      onClose();
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPromptTitle = () => {
    switch (trigger) {
      case 'feature_limit':
        return t('upgrade.titles.featureLimit', 'Unlock Premium Features');
      case 'usage_limit':
        return t('upgrade.titles.usageLimit', 'You\'ve Reached Your Limit');
      case 'collaboration':
        return t('upgrade.titles.collaboration', 'Collaborate with Your Team');
      case 'storage':
        return t('upgrade.titles.storage', 'Get More Storage');
      case 'export':
        return t('upgrade.titles.export', 'Advanced Export Options');
      default:
        return t('upgrade.titles.default', 'Upgrade Your Plan');
    }
  };

  const getPromptDescription = () => {
    switch (trigger) {
      case 'feature_limit':
        return t('upgrade.descriptions.featureLimit', 'Access advanced features and boost your productivity.');
      case 'usage_limit':
        return t('upgrade.descriptions.usageLimit', 'Increase your limits and continue creating without interruption.');
      case 'collaboration':
        return t('upgrade.descriptions.collaboration', 'Invite team members and collaborate on projects together.');
      case 'storage':
        return t('upgrade.descriptions.storage', 'Store your projects in the cloud and access them anywhere.');
      case 'export':
        return t('upgrade.descriptions.export', 'Export to professional formats like FCPxml, EDL, and more.');
      default:
        return t('upgrade.descriptions.default', 'Get access to premium features and unlimited usage.');
    }
  };

  const getFeatureIcon = (featureName: string) => {
    const iconProps = { className: "w-4 h-4 text-green-500" };
    
    switch (featureName.toLowerCase()) {
      case 'unlimited':
      case 'unlimited timestamps':
      case 'unlimited projects':
        return <Zap {...iconProps} />;
      case 'collaboration':
      case 'team':
        return <Users {...iconProps} />;
      case 'cloud':
      case 'storage':
        return <Cloud {...iconProps} />;
      case 'priority':
      case 'support':
        return <Shield {...iconProps} />;
      case 'advanced':
      case 'analytics':
        return <Star {...iconProps} />;
      default:
        return <Check {...iconProps} />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className={`bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl ${isRTL ? 'rtl' : 'ltr'}`}>
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {getPromptTitle()}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400">
              {getPromptDescription()}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Current vs Target Plan Comparison */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Current Plan */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {currentPlan.displayName} {t('upgrade.currentPlan', '(Current)')}
                </h3>
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  ${(currentPlan.price / 100).toFixed(2)}
                  <span className="text-sm font-normal">/{currentPlan.billing}</span>
                </div>
              </div>
              
              <ul className="space-y-2">
                {currentPlan.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-sm text-gray-600 dark:text-gray-400`}>
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Target Plan */}
            <div className="border-2 border-blue-500 rounded-xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                {t('upgrade.recommended', 'Recommended')}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {targetPlan.displayName}
                </h3>
                
                {/* Billing Toggle */}
                <div className="flex items-center justify-center space-x-2 my-3">
                  <button
                    onClick={() => setSelectedBilling('monthly')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedBilling === 'monthly'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {t('upgrade.monthly', 'Monthly')}
                  </button>
                  <button
                    onClick={() => setSelectedBilling('yearly')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedBilling === 'yearly'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {t('upgrade.yearly', 'Yearly')}
                    {yearlyDiscount > 0 && (
                      <span className="ml-1 text-green-600 dark:text-green-400">
                        ({yearlyDiscount}% off)
                      </span>
                    )}
                  </button>
                </div>
                
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${selectedBilling === 'yearly' 
                    ? ((targetPlan.price * 12 * (100 - yearlyDiscount)) / 10000).toFixed(2)
                    : (targetPlan.price / 100).toFixed(2)
                  }
                  <span className="text-sm font-normal">
                    /{selectedBilling === 'yearly' ? 'year' : 'month'}
                  </span>
                </div>
              </div>
              
              <ul className="space-y-2">
                {targetPlan.features.map((feature, index) => (
                  <li key={index} className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} text-sm text-gray-700 dark:text-gray-300`}>
                    {getFeatureIcon(feature)}
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Usage Stats (if applicable) */}
          {trigger === 'usage_limit' && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  {t('upgrade.usageAlert', 'Usage Alert')}
                </span>
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                {feature === 'projects' && t('upgrade.projectLimitReached', 'You\'ve reached your monthly project limit.')}
                {feature === 'storage' && t('upgrade.storageLimitReached', 'Your storage is full.')}
                {feature === 'exports' && t('upgrade.exportLimitReached', 'You\'ve used all your export credits.')}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            {/* Trial Button (if available) */}
            {isTrialAvailable && (
              <button
                onClick={() => handleUpgrade('trial')}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Star className="w-5 h-5" />
                    <span>
                      {t('upgrade.startTrial', 'Start {{days}}-Day Free Trial', { days: trialInfo.trialDays })}
                    </span>
                  </>
                )}
              </button>
            )}

            {/* Subscription Button */}
            <button
              onClick={() => handleUpgrade('subscription')}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${
                isTrialAvailable
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  <span>
                    {isTrialAvailable 
                      ? t('upgrade.skipTrial', 'Subscribe Now')
                      : t('upgrade.upgradeNow', 'Upgrade to {{tier}}', { tier: targetPlan.displayName })
                    }
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
            <p>
              {t('upgrade.footer', 'Cancel anytime • 30-day money-back guarantee • Secure payment')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
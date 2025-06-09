import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import { authAnalytics } from '../services/authAnalytics';
import { UpgradePrompt } from './UpgradePrompt';
import { useTranslation } from 'react-i18next';

export const PricingPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [billingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro'>('premium');

  const plans = subscriptionService.getDisplayPlans();

  const handlePlanSelect = (planId: 'free' | 'premium' | 'pro') => {
    if (!isAuthenticated) {
      authAnalytics.trackEngagement('pricing_plan_selected_guest', {
        selectedPlan: planId,
        billingCycle
      });
      return;
    }

    if (user?.tier === planId) {
      return;
    }

    authAnalytics.trackEngagement('pricing_plan_selected', {
      currentTier: user?.tier,
      selectedPlan: planId,
      billingCycle
    });

    if (planId !== 'free') {
      setSelectedPlan(planId);
      setShowUpgradePrompt(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Choose Your Plan
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
          Scale your video timestamp creation with powerful features and unlimited access.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700"
          >
            <div className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {plan.displayName}
                </h3>
                <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                  ${(plan.price / 100).toFixed(2)}
                  <span className="text-lg font-normal text-gray-500 dark:text-gray-400">
                    /month
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePlanSelect(plan.name as any)}
                className="w-full py-3 px-6 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                {plan.name === 'free' ? t('common.getStarted') : 'Upgrade'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showUpgradePrompt && (
        <UpgradePrompt
          isOpen={showUpgradePrompt}
          onClose={() => setShowUpgradePrompt(false)}
          targetTier={selectedPlan}
          trigger="manual"
        />
      )}
    </div>
  );
};
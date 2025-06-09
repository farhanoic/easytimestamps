/**
 * Feature Gate Hook
 * Manages feature access control based on user subscription tier
 */

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import { authAnalytics } from '../services/authAnalytics';

export interface FeatureGateResult {
  hasAccess: boolean;
  isLoading: boolean;
  feature: string;
  currentTier: string;
  requiredTier: string;
  upgradeUrl?: string;
  trialAvailable?: boolean;
  usageInfo?: {
    used: number;
    limit: number;
    percentage: number;
  };
}

export interface UseFeatureGateOptions {
  feature: string;
  requiredTier?: 'premium' | 'pro';
  gracePeriod?: boolean; // Allow limited access during grace period
  trackAccess?: boolean; // Track access attempts
  showUpgradePrompt?: boolean; // Show upgrade UI when blocked
}

/**
 * Hook to check feature access and provide upgrade information
 */
export const useFeatureGate = (options: UseFeatureGateOptions): FeatureGateResult => {
  const { user, isLoading: authLoading } = useAuth();
  const {
    feature,
    requiredTier = 'premium',
    gracePeriod = false,
    trackAccess = true
  } = options;

  if (authLoading || !user) {
    return {
      hasAccess: false,
      isLoading: authLoading,
      feature,
      currentTier: 'guest',
      requiredTier,
      trialAvailable: true
    };
  }

  const hasBasicAccess = user.tier === requiredTier || 
                        (requiredTier === 'premium' && user.tier === 'pro');
  
  // Check for trial access
  const isInTrial = subscriptionService.isInTrial(user);
  const hasTrialAccess = isInTrial && (user.tier === 'free' || user.tier === requiredTier);
  
  // Check for grace period access
  const hasGracePeriodAccess = gracePeriod && 
                              user.subscriptionStatus === 'past_due' &&
                              (user.tier === requiredTier || user.tier === 'pro');

  const hasAccess = hasBasicAccess || hasTrialAccess || hasGracePeriodAccess;

  // Get usage information for the feature
  const usageInfo = getFeatureUsageInfo(user, feature);

  // Track access attempt if enabled
  if (trackAccess) {
    authAnalytics.trackFeatureUsage('feature_gate_check', {
      feature,
      hasAccess,
      currentTier: user.tier,
      requiredTier,
      isInTrial,
      usagePercentage: usageInfo?.percentage || 0
    });
  }

  return {
    hasAccess,
    isLoading: false,
    feature,
    currentTier: user.tier,
    requiredTier,
    upgradeUrl: `/upgrade?feature=${feature}&from=${user.tier}&to=${requiredTier}`,
    trialAvailable: !isInTrial && user.tier === 'free',
    usageInfo
  };
};

/**
 * Hook specifically for usage-based features (projects, storage, etc.)
 */
export const useUsageGate = (feature: string): FeatureGateResult & {
  remainingUsage: number;
  resetDate: string;
} => {
  const { user } = useAuth();
  
  const baseResult = useFeatureGate({ feature, trackAccess: true });
  
  if (!user) {
    return {
      ...baseResult,
      remainingUsage: 0,
      resetDate: new Date().toISOString()
    };
  }

  const hasReachedLimit = subscriptionService.hasReachedLimit(user, feature);
  const usagePercentage = subscriptionService.getUsagePercentage(user, feature);
  const plan = subscriptionService.getPlan(user.tier);
  
  let remainingUsage = 0;
  if (plan) {
    const currentUsage = getCurrentUsage(user, feature);
    const limit = getFeatureLimit(plan, feature);
    remainingUsage = limit === -1 ? Infinity : Math.max(0, limit - currentUsage);
  }

  // Get next reset date (typically monthly)
  const resetDate = getNextResetDate();

  return {
    ...baseResult,
    hasAccess: baseResult.hasAccess && !hasReachedLimit,
    usageInfo: {
      used: getCurrentUsage(user, feature),
      limit: getFeatureLimit(plan, feature),
      percentage: usagePercentage
    },
    remainingUsage,
    resetDate
  };
};

/**
 * Hook for checking specific permissions
 */
export const usePermission = (permission: keyof import('../contexts/AuthContext').FeaturePermissions): boolean => {
  const { user } = useAuth();
  
  if (!user) return false;
  
  return user.featurePermissions[permission] || false;
};

// Helper functions
function getFeatureUsageInfo(user: any, feature: string) {
  if (!user) return undefined;
  
  const plan = subscriptionService.getPlan(user.tier);
  if (!plan) return undefined;

  const currentUsage = getCurrentUsage(user, feature);
  const limit = getFeatureLimit(plan, feature);
  const percentage = limit === -1 ? 0 : Math.min(100, (currentUsage / limit) * 100);

  return {
    used: currentUsage,
    limit,
    percentage
  };
}

function getCurrentUsage(user: any, feature: string): number {
  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthlyStats = user.usageStatistics.monthlyStats.find((stat: any) => stat.month === currentMonth);
  
  if (!monthlyStats) return 0;
  
  switch (feature) {
    case 'projects':
      return monthlyStats.projectsCreated;
    case 'videos':
      return monthlyStats.videosProcessed;
    case 'timestamps':
      return monthlyStats.timestampsCreated;
    case 'storage':
      return user.usageStatistics.storageUsedMB;
    default:
      return 0;
  }
}

function getFeatureLimit(plan: any, feature: string): number {
  switch (feature) {
    case 'projects':
      return plan.limits.projectsPerMonth;
    case 'timestamps':
      return plan.limits.timestampsPerProject;
    case 'storage':
      return plan.limits.cloudStorage ? subscriptionService.getStorageLimit(plan.name) : 0;
    case 'videoUpload':
      return plan.limits.videoUploadSizeMB;
    default:
      return 0;
  }
}

function getNextResetDate(): string {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth.toISOString();
}

/**
 * Higher-order component for feature gating
 */
export function withFeatureGate<T extends object>(
  Component: React.ComponentType<T>,
  featureOptions: UseFeatureGateOptions
) {
  return function FeatureGatedComponent(props: T) {
    const gateResult = useFeatureGate(featureOptions);
    
    if (!gateResult.hasAccess) {
      // Return upgrade prompt or blocked UI
      return React.createElement(FeatureBlockedFallback, { gateResult });
    }
    
    return React.createElement(Component, props);
  };
}

// Fallback component for blocked features
function FeatureBlockedFallback({ gateResult }: { gateResult: FeatureGateResult }) {
  const handleUpgradeClick = () => {
    authAnalytics.trackEngagement('upgrade_prompt_clicked', {
      feature: gateResult.feature,
      currentTier: gateResult.currentTier,
      requiredTier: gateResult.requiredTier
    });
    
    // Navigate to upgrade page
    window.location.href = gateResult.upgradeUrl || '/upgrade';
  };

  return React.createElement('div', {
    className: "p-6 text-center border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
  }, [
    React.createElement('h3', {
      key: 'title',
      className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
    }, 'Upgrade Required'),
    React.createElement('p', {
      key: 'description',
      className: "text-gray-600 dark:text-gray-400 mb-4"
    }, `This feature requires a ${gateResult.requiredTier} subscription.`),
    React.createElement('button', {
      key: 'button',
      onClick: handleUpgradeClick,
      className: "bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
    }, `Upgrade to ${gateResult.requiredTier}`)
  ]);
}
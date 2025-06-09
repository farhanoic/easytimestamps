/**
 * Subscription Service
 * Manages user tiers, feature access, and billing logic
 */

import { User, SubscriptionPlan, UsageStatistics, FeaturePermissions } from '../contexts/AuthContext';

// Define available subscription plans
export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
  free: {
    id: 'free',
    name: 'free',
    displayName: 'Free',
    price: 0,
    currency: 'USD',
    billing: 'monthly',
    features: [
      'Basic timestamp creation',
      'YouTube URL support',
      'Local video upload (up to 100MB)',
      'Basic export formats',
      'Community support'
    ],
    limits: {
      timestampsPerProject: 50,
      projectsPerMonth: 5,
      exportFormats: ['srt', 'txt'],
      videoUploadSizeMB: 100,
      collaborators: 0,
      cloudStorage: false,
      prioritySupport: false
    }
  },
  
  premium: {
    id: 'premium',
    name: 'premium',
    displayName: 'Premium',
    price: 999, // $9.99/month
    currency: 'USD',
    billing: 'monthly',
    features: [
      'Everything in Free',
      'Unlimited timestamps per project',
      'Advanced export formats',
      'Large video uploads (up to 1GB)',
      'Cloud storage (5GB)',
      'Priority email support',
      'Batch operations',
      'Custom export templates'
    ],
    limits: {
      timestampsPerProject: -1, // unlimited
      projectsPerMonth: 25,
      exportFormats: ['srt', 'vtt', 'txt', 'csv', 'json', 'xml'],
      videoUploadSizeMB: 1024,
      collaborators: 0,
      cloudStorage: true,
      prioritySupport: true
    }
  },
  
  pro: {
    id: 'pro',
    name: 'pro',
    displayName: 'Pro',
    price: 2999, // $29.99/month
    currency: 'USD',
    billing: 'monthly',
    features: [
      'Everything in Premium',
      'Unlimited projects',
      'Team collaboration (up to 10 members)',
      'API access',
      'Custom branding',
      'Advanced analytics',
      'Cloud storage (50GB)',
      'Phone support',
      'SSO integration'
    ],
    limits: {
      timestampsPerProject: -1, // unlimited
      projectsPerMonth: -1, // unlimited
      exportFormats: ['srt', 'vtt', 'txt', 'csv', 'json', 'xml', 'fcpxml', 'edl'],
      videoUploadSizeMB: 5120, // 5GB
      collaborators: 10,
      cloudStorage: true,
      prioritySupport: true
    }
  }
};

// Yearly plans with discount
export const YEARLY_PLANS: Record<string, SubscriptionPlan> = {
  premium_yearly: {
    ...SUBSCRIPTION_PLANS.premium,
    id: 'premium_yearly',
    billing: 'yearly',
    price: 9999, // $99.99/year (2 months free)
  },
  
  pro_yearly: {
    ...SUBSCRIPTION_PLANS.pro,
    id: 'pro_yearly',
    billing: 'yearly',
    price: 29999, // $299.99/year (2 months free)
  }
};

class SubscriptionService {
  
  /**
   * Get subscription plan by ID
   */
  getPlan(planId: string): SubscriptionPlan | null {
    return SUBSCRIPTION_PLANS[planId] || YEARLY_PLANS[planId] || null;
  }
  
  /**
   * Get all available plans
   */
  getAllPlans(): SubscriptionPlan[] {
    return [...Object.values(SUBSCRIPTION_PLANS), ...Object.values(YEARLY_PLANS)];
  }
  
  /**
   * Get plans for display (monthly only)
   */
  getDisplayPlans(): SubscriptionPlan[] {
    return Object.values(SUBSCRIPTION_PLANS);
  }
  
  /**
   * Generate feature permissions based on user tier
   */
  generateFeaturePermissions(tier: 'free' | 'premium' | 'pro'): FeaturePermissions {
    const plan = SUBSCRIPTION_PLANS[tier];
    
    return {
      canCreateUnlimitedProjects: plan.limits.projectsPerMonth === -1,
      canUseAdvancedExports: plan.limits.exportFormats.length > 2,
      canUploadLargeVideos: plan.limits.videoUploadSizeMB > 100,
      canInviteCollaborators: plan.limits.collaborators > 0,
      canUseCloudStorage: plan.limits.cloudStorage,
      canAccessPrioritySupport: plan.limits.prioritySupport,
      canUseAPIAccess: tier === 'pro',
      canUseBulkOperations: tier !== 'free',
      canUseCustomBranding: tier === 'pro',
      canUseAdvancedAnalytics: tier === 'pro'
    };
  }
  
  /**
   * Initialize usage statistics for new user
   */
  initializeUsageStatistics(): UsageStatistics {
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    return {
      timestampsCreated: 0,
      projectsCreated: 0,
      videosProcessed: 0,
      exportsGenerated: 0,
      collaborationInvites: 0,
      storageUsedMB: 0,
      monthlyStats: [{
        month: currentMonth,
        timestampsCreated: 0,
        projectsCreated: 0,
        videosProcessed: 0
      }],
      lastResetDate: now.toISOString()
    };
  }
  
  /**
   * Check if user has reached usage limit for a feature
   */
  hasReachedLimit(user: User, feature: string): boolean {
    const plan = SUBSCRIPTION_PLANS[user.tier];
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyStats = user.usageStatistics.monthlyStats.find(stat => stat.month === currentMonth);
    
    if (!monthlyStats) return false;
    
    switch (feature) {
      case 'projects':
        return plan.limits.projectsPerMonth !== -1 && monthlyStats.projectsCreated >= plan.limits.projectsPerMonth;
      
      case 'timestamps':
        // This would be checked per project, not monthly
        return false;
      
      case 'videos':
        // Could add video processing limits if needed
        return false;
      
      case 'storage':
        return user.usageStatistics.storageUsedMB >= this.getStorageLimit(user.tier);
      
      default:
        return false;
    }
  }
  
  /**
   * Get storage limit for tier
   */
  getStorageLimit(tier: 'free' | 'premium' | 'pro'): number {
    switch (tier) {
      case 'free': return 0; // No cloud storage
      case 'premium': return 5 * 1024; // 5GB in MB
      case 'pro': return 50 * 1024; // 50GB in MB
      default: return 0;
    }
  }
  
  /**
   * Calculate usage percentage for a feature
   */
  getUsagePercentage(user: User, feature: string): number {
    const plan = SUBSCRIPTION_PLANS[user.tier];
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyStats = user.usageStatistics.monthlyStats.find(stat => stat.month === currentMonth);
    
    if (!monthlyStats) return 0;
    
    switch (feature) {
      case 'projects':
        if (plan.limits.projectsPerMonth === -1) return 0; // Unlimited
        return Math.min(100, (monthlyStats.projectsCreated / plan.limits.projectsPerMonth) * 100);
      
      case 'storage':
        const storageLimit = this.getStorageLimit(user.tier);
        if (storageLimit === 0) return 0; // No storage
        return Math.min(100, (user.usageStatistics.storageUsedMB / storageLimit) * 100);
      
      default:
        return 0;
    }
  }
  
  /**
   * Get upgrade recommendations based on usage
   */
  getUpgradeRecommendations(user: User): {
    shouldUpgrade: boolean;
    reasons: string[];
    recommendedTier: 'premium' | 'pro';
  } {
    const reasons: string[] = [];
    let recommendedTier: 'premium' | 'pro' = 'premium';
    
    if (user.tier === 'free') {
      // Check if hitting limits
      if (this.getUsagePercentage(user, 'projects') > 80) {
        reasons.push('Approaching project limit');
      }
      
      if (user.usageStatistics.timestampsCreated > 200) {
        reasons.push('Heavy timestamp usage');
      }
      
      if (user.usageStatistics.exportsGenerated > 10) {
        reasons.push('Frequent exports - get advanced formats');
      }
    }
    
    if (user.tier === 'premium') {
      if (this.getUsagePercentage(user, 'projects') > 80) {
        reasons.push('Need unlimited projects');
        recommendedTier = 'pro';
      }
      
      if (user.usageStatistics.collaborationInvites > 0) {
        reasons.push('Team collaboration needed');
        recommendedTier = 'pro';
      }
    }
    
    return {
      shouldUpgrade: reasons.length > 0,
      reasons,
      recommendedTier
    };
  }
  
  /**
   * Calculate discount for yearly plans
   */
  getYearlyDiscount(monthlyPlanId: string): number {
    const monthlyPlan = SUBSCRIPTION_PLANS[monthlyPlanId];
    const yearlyPlan = YEARLY_PLANS[`${monthlyPlanId}_yearly`];
    
    if (!monthlyPlan || !yearlyPlan) return 0;
    
    const monthlyTotal = monthlyPlan.price * 12;
    const yearlyPrice = yearlyPlan.price;
    
    return Math.round(((monthlyTotal - yearlyPrice) / monthlyTotal) * 100);
  }
  
  /**
   * Get trial information
   */
  getTrialInfo(tier: 'premium' | 'pro'): {
    trialDays: number;
    features: string[];
  } {
    const plan = SUBSCRIPTION_PLANS[tier];
    
    return {
      trialDays: 14, // 14-day free trial
      features: plan.features
    };
  }
  
  /**
   * Check if user is in trial period
   */
  isInTrial(user: User): boolean {
    if (!user.trialEndsAt) return false;
    return new Date(user.trialEndsAt) > new Date();
  }
  
  /**
   * Get days remaining in trial
   */
  getTrialDaysRemaining(user: User): number {
    if (!user.trialEndsAt) return 0;
    
    const trialEnd = new Date(user.trialEndsAt);
    const now = new Date();
    const diffMs = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return Math.max(0, diffDays);
  }
  
  /**
   * Update user's monthly usage statistics
   */
  updateUsageStats(user: User, feature: string, increment: number = 1): UsageStatistics {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const stats = { ...user.usageStatistics };
    
    // Find or create current month stats
    let monthlyStats = stats.monthlyStats.find(stat => stat.month === currentMonth);
    if (!monthlyStats) {
      monthlyStats = {
        month: currentMonth,
        timestampsCreated: 0,
        projectsCreated: 0,
        videosProcessed: 0
      };
      stats.monthlyStats.push(monthlyStats);
    }
    
    // Update overall and monthly stats
    switch (feature) {
      case 'timestamps':
        stats.timestampsCreated += increment;
        monthlyStats.timestampsCreated += increment;
        break;
      
      case 'projects':
        stats.projectsCreated += increment;
        monthlyStats.projectsCreated += increment;
        break;
      
      case 'videos':
        stats.videosProcessed += increment;
        monthlyStats.videosProcessed += increment;
        break;
      
      case 'exports':
        stats.exportsGenerated += increment;
        break;
      
      case 'collaborations':
        stats.collaborationInvites += increment;
        break;
      
      case 'storage':
        stats.storageUsedMB += increment;
        break;
    }
    
    // Keep only last 12 months of stats
    stats.monthlyStats = stats.monthlyStats
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);
    
    return stats;
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService();
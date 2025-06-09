/**
 * Usage Tracking Hook
 * Manages user usage statistics and limits
 */

import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionService } from '../services/subscriptionService';
import { authAnalytics } from '../services/authAnalytics';

export interface UsageTracker {
  trackTimestampCreation: () => Promise<boolean>;
  trackProjectCreation: () => Promise<boolean>;
  trackVideoProcessing: (sizeMB?: number) => Promise<boolean>;
  trackExportGeneration: (format: string) => Promise<boolean>;
  trackCollaborationInvite: () => Promise<boolean>;
  trackStorageUsage: (sizeMB: number) => Promise<boolean>;
  getUsageStatus: (feature: string) => {
    used: number;
    limit: number;
    percentage: number;
    canUse: boolean;
    resetDate: string;
  };
  getRemainingUsage: (feature: string) => number;
}

export const useUsageTracking = (): UsageTracker => {
  const { user, updateProfile } = useAuth();

  const updateUsageStats = useCallback(async (feature: string, increment: number = 1, metadata?: any) => {
    if (!user) return false;

    try {
      // Check if user has reached limit before allowing action
      const hasReachedLimit = subscriptionService.hasReachedLimit(user, feature);
      if (hasReachedLimit) {
        // Track blocked usage attempt
        authAnalytics.trackFeatureUsage('usage_limit_reached', {
          feature,
          tier: user.tier,
          usagePercentage: subscriptionService.getUsagePercentage(user, feature),
          ...metadata
        });
        return false;
      }

      // Update usage statistics
      const updatedStats = subscriptionService.updateUsageStats(user, feature, increment);
      
      // Update user profile with new stats
      await updateProfile({ usageStatistics: updatedStats });

      // Track successful usage
      authAnalytics.trackFeatureUsage(`${feature}_used`, {
        tier: user.tier,
        newTotal: feature === 'timestamps' ? updatedStats.timestampsCreated :
                 feature === 'projects' ? updatedStats.projectsCreated :
                 feature === 'videos' ? updatedStats.videosProcessed :
                 feature === 'exports' ? updatedStats.exportsGenerated :
                 updatedStats.storageUsedMB,
        usagePercentage: subscriptionService.getUsagePercentage(user, feature),
        ...metadata
      });

      return true;
    } catch (error) {
      console.error(`Failed to track ${feature} usage:`, error);
      return false;
    }
  }, [user, updateProfile]);

  const trackTimestampCreation = useCallback(async (): Promise<boolean> => {
    const success = await updateUsageStats('timestamps', 1, {
      method: 'manual_creation'
    });

    if (!success && user) {
      // Show upgrade prompt for timestamp limits
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'timestamp_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const trackProjectCreation = useCallback(async (): Promise<boolean> => {
    const success = await updateUsageStats('projects', 1, {
      method: 'new_project'
    });

    if (!success && user) {
      // Show upgrade prompt for project limits
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'project_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const trackVideoProcessing = useCallback(async (sizeMB: number = 0): Promise<boolean> => {
    if (!user) return false;

    // Check video size limits
    const plan = subscriptionService.getPlan(user.tier);
    if (plan && sizeMB > plan.limits.videoUploadSizeMB) {
      authAnalytics.trackFeatureUsage('video_size_limit_reached', {
        tier: user.tier,
        videoSizeMB: sizeMB,
        limitMB: plan.limits.videoUploadSizeMB
      });
      return false;
    }

    const success = await updateUsageStats('videos', 1, {
      videoSizeMB: sizeMB,
      method: 'video_upload'
    });

    if (!success) {
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'video_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const trackExportGeneration = useCallback(async (format: string): Promise<boolean> => {
    if (!user) return false;

    // Check if format is available for user's tier
    const plan = subscriptionService.getPlan(user.tier);
    if (plan && !plan.limits.exportFormats.includes(format)) {
      authAnalytics.trackFeatureUsage('export_format_restricted', {
        tier: user.tier,
        requestedFormat: format,
        availableFormats: plan.limits.exportFormats
      });
      return false;
    }

    const success = await updateUsageStats('exports', 1, {
      exportFormat: format,
      method: 'export_generation'
    });

    if (!success) {
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'export_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const trackCollaborationInvite = useCallback(async (): Promise<boolean> => {
    if (!user) return false;

    // Check collaboration limits
    const plan = subscriptionService.getPlan(user.tier);
    if (plan && plan.limits.collaborators === 0) {
      authAnalytics.trackFeatureUsage('collaboration_restricted', {
        tier: user.tier,
        collaboratorLimit: plan.limits.collaborators
      });
      return false;
    }

    const success = await updateUsageStats('collaborations', 1, {
      method: 'collaboration_invite'
    });

    if (!success) {
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'collaboration_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const trackStorageUsage = useCallback(async (sizeMB: number): Promise<boolean> => {
    if (!user) return false;

    // Check storage limits
    const storageLimit = subscriptionService.getStorageLimit(user.tier);
    const currentUsage = user.usageStatistics.storageUsedMB;
    
    if (storageLimit > 0 && (currentUsage + sizeMB) > storageLimit) {
      authAnalytics.trackFeatureUsage('storage_limit_reached', {
        tier: user.tier,
        currentUsageMB: currentUsage,
        requestedSizeMB: sizeMB,
        limitMB: storageLimit
      });
      return false;
    }

    const success = await updateUsageStats('storage', sizeMB, {
      fileSizeMB: sizeMB,
      method: 'file_upload'
    });

    if (!success) {
      authAnalytics.trackEngagement('upgrade_prompt_triggered', {
        trigger: 'storage_limit',
        currentTier: user.tier
      });
    }

    return success;
  }, [updateUsageStats, user]);

  const getUsageStatus = useCallback((feature: string) => {
    if (!user) {
      return {
        used: 0,
        limit: 0,
        percentage: 0,
        canUse: false,
        resetDate: new Date().toISOString()
      };
    }

    const plan = subscriptionService.getPlan(user.tier);
    if (!plan) {
      return {
        used: 0,
        limit: 0,
        percentage: 0,
        canUse: false,
        resetDate: new Date().toISOString()
      };
    }

    const usagePercentage = subscriptionService.getUsagePercentage(user, feature);
    const hasReachedLimit = subscriptionService.hasReachedLimit(user, feature);
    
    // Get current usage
    const currentMonth = new Date().toISOString().slice(0, 7);
    const monthlyStats = user.usageStatistics.monthlyStats.find(stat => stat.month === currentMonth);
    
    let used = 0;
    let limit = 0;
    
    switch (feature) {
      case 'projects':
        used = monthlyStats?.projectsCreated || 0;
        limit = plan.limits.projectsPerMonth;
        break;
      case 'timestamps':
        used = monthlyStats?.timestampsCreated || 0;
        limit = plan.limits.timestampsPerProject;
        break;
      case 'storage':
        used = user.usageStatistics.storageUsedMB;
        limit = subscriptionService.getStorageLimit(user.tier);
        break;
      case 'videos':
        used = monthlyStats?.videosProcessed || 0;
        limit = -1; // No specific limit, but size limits apply
        break;
    }

    // Calculate next reset date (typically monthly)
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return {
      used,
      limit,
      percentage: usagePercentage,
      canUse: !hasReachedLimit,
      resetDate: nextMonth.toISOString()
    };
  }, [user]);

  const getRemainingUsage = useCallback((feature: string): number => {
    const status = getUsageStatus(feature);
    if (status.limit === -1) return Infinity;
    return Math.max(0, status.limit - status.used);
  }, [getUsageStatus]);

  return {
    trackTimestampCreation,
    trackProjectCreation,
    trackVideoProcessing,
    trackExportGeneration,
    trackCollaborationInvite,
    trackStorageUsage,
    getUsageStatus,
    getRemainingUsage
  };
};
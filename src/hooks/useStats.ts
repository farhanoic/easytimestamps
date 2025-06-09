import { useState, useEffect } from 'react';
import { statsService, AppStats, formatNumber, formatUptime } from '../utils/statsService';

export interface FormattedStats {
  usersWorldwide: string;
  timestampsGenerated: string;
  languagesSupported: string;
  uptime: string;
  isLoading: boolean;
  lastUpdated: Date | null;
}

export const useStats = () => {
  const [stats, setStats] = useState<AppStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Subscribe to stats updates
    const unsubscribe = statsService.subscribe((newStats) => {
      setStats(newStats);
      setIsLoading(false);
    });

    // Initial load
    const currentStats = statsService.getStats();
    if (currentStats) {
      setStats(currentStats);
      setIsLoading(false);
    }

    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);

  // Format stats for display
  const formattedStats: FormattedStats = {
    usersWorldwide: stats ? formatNumber(stats.usersWorldwide) : '10,000+',
    timestampsGenerated: stats ? formatNumber(stats.timestampsGenerated) : '100,000+',
    languagesSupported: stats ? stats.languagesSupported.toString() : '25',
    uptime: stats ? formatUptime(stats.uptime) : '99.9%',
    isLoading,
    lastUpdated: stats?.lastUpdated || null
  };

  // Methods to update stats
  const incrementTimestamps = (count: number = 1) => {
    statsService.incrementTimestamps(count);
  };

  const recordNewUser = () => {
    statsService.recordNewUser();
  };

  const forceUpdate = () => {
    statsService.forceUpdate();
  };

  return {
    stats: formattedStats,
    rawStats: stats,
    incrementTimestamps,
    recordNewUser,
    forceUpdate,
    isLoading
  };
};
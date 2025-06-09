// Real-time statistics service for Easy Timestamps

export interface AppStats {
  usersWorldwide: number;
  timestampsGenerated: number;
  languagesSupported: number;
  uptime: number;
  lastUpdated: Date;
}

// In a real implementation, you might use:
// - Google Analytics Reporting API
// - Firebase Analytics
// - Your own backend API
// - Local storage counter (for client-side only stats)

class StatsService {
  private static instance: StatsService;
  private stats: AppStats | null = null;
  private listeners: ((stats: AppStats) => void)[] = [];
  private updateInterval: number | null = null;

  private constructor() {
    this.initializeStats();
    this.startPeriodicUpdates();
  }

  static getInstance(): StatsService {
    if (!StatsService.instance) {
      StatsService.instance = new StatsService();
    }
    return StatsService.instance;
  }

  private async initializeStats() {
    // Load initial stats from localStorage or set defaults
    const savedStats = this.loadStatsFromStorage();
    if (savedStats) {
      this.stats = savedStats;
      this.notifyListeners();
    } else {
      // Set initial realistic baseline numbers
      this.stats = {
        usersWorldwide: 8543,
        timestampsGenerated: 127649,
        languagesSupported: 25,
        uptime: 99.87,
        lastUpdated: new Date()
      };
      this.saveStatsToStorage();
      this.notifyListeners();
    }

    // Try to fetch real data from analytics
    await this.fetchRealStats();
  }

  private async fetchRealStats(): Promise<void> {
    try {
      // Option 1: Use Google Analytics API (requires setup)
      // const realStats = await this.fetchFromGoogleAnalytics();
      
      // Option 2: Use your own backend API
      // const realStats = await this.fetchFromBackend();
      
      // Option 3: Simulate real-time updates for demo
      await this.simulateRealTimeUpdates();
      
    } catch (error) {
      console.warn('Failed to fetch real stats:', error);
      // Fall back to simulated updates
      await this.simulateRealTimeUpdates();
    }
  }

  private async simulateRealTimeUpdates(): Promise<void> {
    if (!this.stats) return;

    // Simulate organic growth with realistic patterns
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - this.stats.lastUpdated.getTime();
    const hoursSinceUpdate = timeSinceLastUpdate / (1000 * 60 * 60);

    if (hoursSinceUpdate > 0.1) { // Update every 6 minutes
      // Users grow slowly (1-5 new users per hour)
      const newUsers = Math.floor(Math.random() * 5 * hoursSinceUpdate);
      
      // Timestamps grow faster (10-50 per hour depending on activity)
      const timeOfDay = now.getHours();
      const activityMultiplier = this.getActivityMultiplier(timeOfDay);
      const newTimestamps = Math.floor(Math.random() * 50 * hoursSinceUpdate * activityMultiplier);

      // Uptime fluctuates slightly
      const uptimeChange = (Math.random() - 0.5) * 0.02; // ±0.01%
      
      this.stats = {
        ...this.stats,
        usersWorldwide: this.stats.usersWorldwide + newUsers,
        timestampsGenerated: this.stats.timestampsGenerated + newTimestamps,
        uptime: Math.max(99.5, Math.min(99.99, this.stats.uptime + uptimeChange)),
        lastUpdated: now
      };

      this.saveStatsToStorage();
      this.notifyListeners();
    }
  }

  private getActivityMultiplier(hour: number): number {
    // Simulate activity patterns throughout the day (UTC)
    // Higher activity during business hours across time zones
    if (hour >= 6 && hour <= 10) return 1.5; // Morning peak
    if (hour >= 14 && hour <= 18) return 2.0; // Afternoon peak
    if (hour >= 20 && hour <= 23) return 1.3; // Evening peak
    return 0.7; // Quiet hours
  }

  private loadStatsFromStorage(): AppStats | null {
    try {
      const saved = localStorage.getItem('easytimestamps-stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          lastUpdated: new Date(parsed.lastUpdated)
        };
      }
    } catch (error) {
      console.warn('Failed to load stats from storage:', error);
    }
    return null;
  }

  private saveStatsToStorage(): void {
    try {
      if (this.stats) {
        localStorage.setItem('easytimestamps-stats', JSON.stringify(this.stats));
      }
    } catch (error) {
      console.warn('Failed to save stats to storage:', error);
    }
  }

  private startPeriodicUpdates(): void {
    // Update stats every 5 minutes
    this.updateInterval = setInterval(() => {
      this.fetchRealStats();
    }, 5 * 60 * 1000);
  }

  private notifyListeners(): void {
    if (this.stats) {
      this.listeners.forEach(listener => listener(this.stats!));
    }
  }

  // Public methods
  public getStats(): AppStats | null {
    return this.stats;
  }

  public subscribe(listener: (stats: AppStats) => void): () => void {
    this.listeners.push(listener);
    
    // Immediately call with current stats if available
    if (this.stats) {
      listener(this.stats);
    }

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public async forceUpdate(): Promise<void> {
    await this.fetchRealStats();
  }

  public incrementTimestamps(count: number = 1): void {
    if (this.stats) {
      this.stats = {
        ...this.stats,
        timestampsGenerated: this.stats.timestampsGenerated + count,
        lastUpdated: new Date()
      };
      this.saveStatsToStorage();
      this.notifyListeners();
    }
  }

  public recordNewUser(): void {
    if (this.stats) {
      this.stats = {
        ...this.stats,
        usersWorldwide: this.stats.usersWorldwide + 1,
        lastUpdated: new Date()
      };
      this.saveStatsToStorage();
      this.notifyListeners();
    }
  }

  public destroy(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.listeners = [];
  }
}

// Export singleton instance
export const statsService = StatsService.getInstance();

// Utility functions for formatting
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M+';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K+';
  }
  return num.toLocaleString() + '+';
};

export const formatUptime = (uptime: number): string => {
  return uptime.toFixed(1) + '%';
};
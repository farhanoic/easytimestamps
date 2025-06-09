import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/auth';
import { authAnalytics } from '../services/authAnalytics';
import { securityService } from '../services/securityService';

// Subscription and billing types
export interface SubscriptionPlan {
  id: string;
  name: 'free' | 'premium' | 'pro';
  displayName: string;
  price: number; // in cents
  currency: 'USD' | 'EUR' | 'GBP';
  billing: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    timestampsPerProject: number;
    projectsPerMonth: number;
    exportFormats: string[];
    videoUploadSizeMB: number;
    collaborators: number;
    cloudStorage: boolean;
    prioritySupport: boolean;
  };
}

export interface UsageStatistics {
  timestampsCreated: number;
  projectsCreated: number;
  videosProcessed: number;
  exportsGenerated: number;
  collaborationInvites: number;
  storageUsedMB: number;
  monthlyStats: {
    month: string; // YYYY-MM
    timestampsCreated: number;
    projectsCreated: number;
    videosProcessed: number;
  }[];
  lastResetDate: string; // Monthly usage reset
}

export interface BillingInformation {
  customerId?: string; // Stripe/payment provider customer ID
  subscriptionId?: string;
  paymentMethodId?: string;
  billingAddress?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxId?: string;
  companyName?: string;
  invoiceEmail?: string;
  nextBillingDate?: string;
  billingHistory: {
    invoiceId: string;
    amount: number;
    currency: string;
    date: string;
    status: 'paid' | 'pending' | 'failed' | 'refunded';
    downloadUrl?: string;
  }[];
}

export interface FeaturePermissions {
  canCreateUnlimitedProjects: boolean;
  canUseAdvancedExports: boolean;
  canUploadLargeVideos: boolean;
  canInviteCollaborators: boolean;
  canUseCloudStorage: boolean;
  canAccessPrioritySupport: boolean;
  canUseAPIAccess: boolean;
  canUseBulkOperations: boolean;
  canUseCustomBranding: boolean;
  canUseAdvancedAnalytics: boolean;
}

// Enhanced User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'email';
  
  // Subscription information
  tier: 'free' | 'premium' | 'pro';
  subscriptionPlan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  trialEndsAt?: string;
  subscriptionEndsAt?: string;
  
  // Account metadata
  createdAt: string;
  lastLoginAt: string;
  emailVerified: boolean;
  accountStatus: 'active' | 'suspended' | 'pending_verification';
  
  // Usage and permissions
  usageStatistics: UsageStatistics;
  featurePermissions: FeaturePermissions;
  
  // Billing (placeholder for future)
  billingInformation?: BillingInformation;
  
  // Settings and preferences
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    emailNotifications: {
      marketing: boolean;
      productUpdates: boolean;
      usageAlerts: boolean;
      billingAlerts: boolean;
    };
    timezone: string;
  };
}

// Authentication state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Authentication context type
export interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  verifyEmail: (token: string) => Promise<boolean>;
  resendEmailVerification: (email: string) => Promise<void>;
  isSessionValid: () => boolean;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props
interface AuthProviderProps {
  children: ReactNode;
}


// Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  // Auth methods
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    authAnalytics.trackAuthAttempt('email', 'started');
    
    try {
      // Check for account lockout
      if (securityService.isAccountLocked(email)) {
        throw new Error('Account temporarily locked due to too many failed login attempts. Please try again later.');
      }
      
      const user = await authService.signInWithEmail(email, password);
      
      // Clear failed login attempts on success
      securityService.clearFailedLogins(email);
      
      // Create secure session
      securityService.createSession(
        user.id,
        'unknown', // IP would come from server
        navigator.userAgent
      );
      
      setUser(user);
      authAnalytics.trackAuthAttempt('email', 'success');
      authAnalytics.trackAuthSuccess(user);
    } catch (error) {
      // Record failed login attempt
      const result = securityService.recordFailedLogin(email);
      
      let errorMessage = (error as Error).message;
      if (result.isLocked) {
        errorMessage = `Account locked for ${result.lockoutMinutes} minutes due to repeated failed attempts.`;
      } else if (result.remainingAttempts <= 2) {
        errorMessage += ` ${result.remainingAttempts} attempts remaining.`;
      }
      
      authAnalytics.trackAuthAttempt('email', 'failed', { 
        error: errorMessage,
        remainingAttempts: result.remainingAttempts
      });
      
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    authAnalytics.trackAuthAttempt('email', 'started');
    
    try {
      const user = await authService.signUpWithEmail(email, password, name);
      setUser(user);
      authAnalytics.trackAuthAttempt('email', 'success');
      authAnalytics.trackAuthSuccess(user);
      authAnalytics.trackConversion('signup', { method: 'email' });
    } catch (error) {
      authAnalytics.trackAuthAttempt('email', 'failed', { error: (error as Error).message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    authAnalytics.trackAuthAttempt('google', 'started');
    
    try {
      const user = await authService.signInWithGoogle();
      setUser(user);
      authAnalytics.trackAuthAttempt('google', 'success');
      authAnalytics.trackAuthSuccess(user);
      authAnalytics.trackConversion('signup', { method: 'google' });
    } catch (error) {
      authAnalytics.trackAuthAttempt('google', 'failed', { error: (error as Error).message });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  const signOut = async () => {
    setIsLoading(true);
    
    // Track signout with session duration
    if (user) {
      authAnalytics.track('auth_signout', {
        method: user.provider,
        userTier: user.tier
      });
    }
    
    try {
      await authService.signOut();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<User>) => {
    // Mock implementation - replace with actual service call
    if (!user) throw new Error('No user signed in');
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
  };

  const verifyEmail = async (token: string): Promise<boolean> => {
    try {
      const result = securityService.verifyEmailToken(token);
      if (result.isValid && user) {
        const updatedUser = { ...user, emailVerified: true };
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Email verification failed:', error);
      return false;
    }
  };

  const resendEmailVerification = async (email: string): Promise<void> => {
    const { token } = securityService.generateEmailVerificationToken(email);
    // In a real app, this would trigger an email
    console.log('Email verification token (demo):', token);
  };

  const isSessionValid = (): boolean => {
    if (!user) return false;
    
    // In a real app, you would validate with the server
    const result = securityService.validateSession(
      'current-session-id', // Would be stored
      'unknown', // IP from server
      navigator.userAgent
    );
    
    return result.isValid;
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    verifyEmail,
    resendEmailVerification,
    isSessionValid
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hooks
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};
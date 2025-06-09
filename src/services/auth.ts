/**
 * Authentication Service
 * Handles all authentication operations including social login
 */

import { User } from '../contexts/AuthContext';
import { subscriptionService } from './subscriptionService';
import { securityService } from './securityService';

// Configuration constants (replace with your actual values)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_BASE_URL = 'http://localhost:3001/api';

// Rate limiting storage
const rateLimitStorage = {
  attempts: new Map<string, number>(),
  lastAttempt: new Map<string, number>(),
  
  checkRateLimit(identifier: string, maxAttempts = 5, windowMs = 15 * 60 * 1000): boolean {
    const now = Date.now();
    const lastAttempt = this.lastAttempt.get(identifier) || 0;
    const attempts = this.attempts.get(identifier) || 0;
    
    // Reset if window has passed
    if (now - lastAttempt > windowMs) {
      this.attempts.set(identifier, 0);
      this.lastAttempt.set(identifier, now);
      return true;
    }
    
    // Check if rate limited
    if (attempts >= maxAttempts) {
      return false;
    }
    
    // Increment attempts
    this.attempts.set(identifier, attempts + 1);
    this.lastAttempt.set(identifier, now);
    return true;
  }
};

// Security utilities
const SecurityUtils = {
  /**
   * Hash password using Web Crypto API
   */
  async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Generate secure random token
   */
  generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  },

  /**
   * Validate email format
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate password strength
   */
  validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  /**
   * Check if running on HTTPS in production
   */
  enforceHTTPS(): void {
    // Only enforce HTTPS in production
    if (window.location.hostname !== 'localhost' && window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
    }
  }
};

// Session management
const SessionManager = {
  TOKEN_KEY: 'easy_timestamps_token',
  USER_KEY: 'easy_timestamps_user',
  REFRESH_TOKEN_KEY: 'easy_timestamps_refresh_token',

  setSession(user: User, token: string, refreshToken?: string): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  },

  getSession(): { user: User | null; token: string | null; refreshToken: string | null } {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      const token = localStorage.getItem(this.TOKEN_KEY);
      const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
      
      return {
        user: userStr ? JSON.parse(userStr) : null,
        token,
        refreshToken
      };
    } catch {
      return { user: null, token: null, refreshToken: null };
    }
  },

  clearSession(): void {
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  },

  isTokenExpired(token: string): boolean {
    try {
      // JWT token format: header.payload.signature
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      const currentTime = Math.floor(Date.now() / 1000);
      return decodedPayload.exp < currentTime;
    } catch {
      return true;
    }
  }
};

// Google OAuth implementation
const GoogleAuth = {
  /**
   * Initialize Google Sign-In
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window.google !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
      document.head.appendChild(script);
    });
  },

  /**
   * Trigger Google Sign-In
   */
  async signIn(): Promise<User> {
    await this.initialize();

    return new Promise((resolve, reject) => {
      if (!window.google) {
        reject(new Error('Google Sign-In not available'));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response: any) => {
          try {
            const user = await this.handleCredentialResponse(response);
            resolve(user);
          } catch (error) {
            reject(error);
          }
        }
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed()) {
          // Fallback to popup if prompt is not displayed
          window.google.accounts.id.renderButton(
            document.createElement('div'),
            { theme: 'outline', size: 'large' }
          );
        }
      });
    });
  },

  /**
   * Handle Google credential response
   */
  async handleCredentialResponse(response: any): Promise<User> {
    try {
      // Decode JWT token
      const [, payload] = response.credential.split('.');
      const userInfo = JSON.parse(atob(payload));

      const user: User = {
        id: `google_${userInfo.sub}`,
        email: userInfo.email,
        name: userInfo.name,
        avatar: userInfo.picture,
        provider: 'google',
        tier: 'free',
        subscriptionPlan: subscriptionService.getPlan('free')!,
        subscriptionStatus: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: true,
        accountStatus: 'active',
        usageStatistics: subscriptionService.initializeUsageStatistics(),
        featurePermissions: subscriptionService.generateFeaturePermissions('free'),
        preferences: {
          theme: 'system',
          language: 'en',
          emailNotifications: {
            marketing: true,
            productUpdates: true,
            usageAlerts: true,
            billingAlerts: true
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      // Store session
      const token = SecurityUtils.generateToken();
      SessionManager.setSession(user, token);

      return user;
    } catch (error) {
      throw new Error('Failed to process Google sign-in response');
    }
  }
};


// Main AuthService class
export class AuthService {
  constructor() {
    SecurityUtils.enforceHTTPS();
  }

  /**
   * Sign in with email and password
   */
  async signInWithEmail(email: string, password: string): Promise<User> {
    // Rate limiting
    if (!rateLimitStorage.checkRateLimit(`email_${email}`)) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    if (!SecurityUtils.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Simulate API call (replace with actual backend call)
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hash password for security (in production, this would be done on backend)
    await SecurityUtils.hashPassword(password);
    
    // Mock validation - replace with actual backend authentication
    if (email === 'demo@example.com' && password === 'demo123') {
      const user: User = {
        id: 'email_1',
        email,
        name: 'Demo User',
        provider: 'email',
        tier: 'free',
        subscriptionPlan: subscriptionService.getPlan('free')!,
        subscriptionStatus: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        emailVerified: true,
        accountStatus: 'active',
        usageStatistics: subscriptionService.initializeUsageStatistics(),
        featurePermissions: subscriptionService.generateFeaturePermissions('free'),
        preferences: {
          theme: 'system',
          language: 'en',
          emailNotifications: {
            marketing: true,
            productUpdates: true,
            usageAlerts: true,
            billingAlerts: true
          },
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      };

      const token = SecurityUtils.generateToken();
      SessionManager.setSession(user, token);
      return user;
    }

    throw new Error('Invalid email or password');
  }

  /**
   * Sign up with email and password
   */
  async signUpWithEmail(email: string, password: string, name: string): Promise<User> {
    // Rate limiting
    if (!rateLimitStorage.checkRateLimit(`signup_${email}`)) {
      throw new Error('Too many signup attempts. Please try again later.');
    }

    if (!SecurityUtils.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    const passwordValidation = SecurityUtils.validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Hash password for security (in production, this would be done on backend)
    await SecurityUtils.hashPassword(password);

    // Simulate API call (replace with actual backend call)
    await new Promise(resolve => setTimeout(resolve, 1200));

    const user: User = {
      id: `email_${Date.now()}`,
      email,
      name,
      provider: 'email',
      tier: 'free',
      subscriptionPlan: subscriptionService.getPlan('free')!,
      subscriptionStatus: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      emailVerified: false,
      accountStatus: 'pending_verification',
      usageStatistics: subscriptionService.initializeUsageStatistics(),
      featurePermissions: subscriptionService.generateFeaturePermissions('free'),
      preferences: {
        theme: 'system',
        language: 'en',
        emailNotifications: {
          marketing: true,
          productUpdates: true,
          usageAlerts: true,
          billingAlerts: true
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      }
    };

    const token = SecurityUtils.generateToken();
    SessionManager.setSession(user, token);
    return user;
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(): Promise<User> {
    // Rate limiting
    if (!rateLimitStorage.checkRateLimit('google_signin')) {
      throw new Error('Too many Google sign-in attempts. Please try again later.');
    }

    return GoogleAuth.signIn();
  }


  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    SessionManager.clearSession();
    
    // Sign out from Google if applicable
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Reset password - Step 1: Request reset
   */
  async resetPassword(email: string): Promise<void> {
    // Rate limiting
    if (!rateLimitStorage.checkRateLimit(`reset_${email}`, 3, 15 * 60 * 1000)) {
      throw new Error('Too many reset attempts. Please try again in 15 minutes.');
    }

    if (!SecurityUtils.validateEmail(email)) {
      throw new Error('Invalid email format');
    }

    // Validate email exists (in production, check against database)
    // For security, always return success even if email doesn't exist
    
    // Generate secure reset token
    const resetToken = securityService.generatePasswordResetToken(email);
    
    // Simulate API call to send email
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In development, log the token (remove in production)
    console.log('Password reset token (demo):', resetToken.token);
    console.log('Reset link: /reset-password?token=' + resetToken.token);
    
    // Always return success for security (prevents email enumeration)
  }

  /**
   * Verify password reset token
   */
  async verifyResetToken(token: string): Promise<{ isValid: boolean; email?: string }> {
    if (!token || token.length < 32) {
      throw new Error('Invalid reset token format');
    }

    const result = securityService.verifyPasswordResetToken(token);
    
    if (!result.isValid) {
      throw new Error('Invalid or expired reset token. Please request a new password reset.');
    }

    return result;
  }

  /**
   * Reset password - Step 2: Complete reset with new password
   */
  async completePasswordReset(token: string, newPassword: string, confirmPassword: string): Promise<void> {
    // Verify token first
    const tokenResult = await this.verifyResetToken(token);
    
    if (!tokenResult.isValid || !tokenResult.email) {
      throw new Error('Invalid reset token');
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Validate new password strength
    const passwordValidation = securityService.validatePassword(newPassword, {
      email: tokenResult.email
    });

    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.feedback[0] || 'Password does not meet security requirements');
    }

    // Hash the new password (store this in production database)
    await SecurityUtils.hashPassword(newPassword);

    // In production, update the password in database
    // For demo, just mark the token as used
    securityService.completePasswordReset(token);

    // Invalidate all existing sessions for this user
    // In production, you would look up the user ID and invalidate sessions
    
    // Log the security event
    console.log('Password reset completed for:', tokenResult.email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(currentPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Rate limiting for password changes
    if (!rateLimitStorage.checkRateLimit(`change_password_${currentUser.id}`, 3, 60 * 60 * 1000)) {
      throw new Error('Too many password change attempts. Please try again in 1 hour.');
    }

    // Validate current password (in production, verify against database)
    // For demo, simulate verification
    if (currentUser.provider === 'email' && currentPassword !== 'current_password_demo') {
      throw new Error('Current password is incorrect');
    }

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
      throw new Error('New passwords do not match');
    }

    // Ensure new password is different from current
    if (currentPassword === newPassword) {
      throw new Error('New password must be different from your current password');
    }

    // Validate new password strength
    const passwordValidation = securityService.validatePassword(newPassword, {
      name: currentUser.name,
      email: currentUser.email
    });

    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.feedback[0] || 'Password does not meet security requirements');
    }

    // Hash the new password (store this in production database)
    await SecurityUtils.hashPassword(newPassword);

    // In production, update password in database
    console.log('Password changed for user:', currentUser.email);

    // Invalidate all other sessions except current one
    securityService.invalidateAllUserSessions(currentUser.id);

    // Generate new session token for security
    const newToken = SecurityUtils.generateToken();
    SessionManager.setSession(currentUser, newToken);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return SessionManager.getSession().user;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<string | null> {
    const { refreshToken } = SessionManager.getSession();
    if (!refreshToken) return null;

    try {
      // Simulate API call to refresh token
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const { accessToken, refreshToken: newRefreshToken } = await response.json();
      
      // Update stored tokens
      localStorage.setItem(SessionManager.TOKEN_KEY, accessToken);
      if (newRefreshToken) {
        localStorage.setItem(SessionManager.REFRESH_TOKEN_KEY, newRefreshToken);
      }

      return accessToken;
    } catch {
      // Clear session if refresh fails
      SessionManager.clearSession();
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();

// Type declarations for Google Sign-In
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}

declare global {
  interface ImportMeta {
    env: {
      VITE_GOOGLE_CLIENT_ID: string;
      VITE_API_URL?: string;
      [key: string]: any;
    };
  }
}
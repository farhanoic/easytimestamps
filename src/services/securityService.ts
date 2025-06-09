/**
 * Security Service
 * Implements security best practices and privacy protection
 */

import { authAnalytics } from './authAnalytics';

// Password strength requirements
export interface PasswordRequirements {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  preventCommonPasswords: boolean;
  preventPersonalInfo: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  score: number; // 0-4 (weak to very strong)
  feedback: string[];
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    notCommon: boolean;
    notPersonal: boolean;
  };
}

export interface SecuritySettings {
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  lockoutDuration: number; // minutes
  passwordExpiry: number; // days
  requireEmailVerification: boolean;
  enable2FA: boolean;
  secureSessionCookies: boolean;
}

// Common weak passwords to prevent (expanded list)
const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', 'dragon', 'master', 'login',
  'princess', 'football', 'baseball', 'freedom', 'whatever', 'superman',
  'password1', 'iloveyou', 'trustno1', 'starwars', 'michael', 'ashley',
  'jessica', 'charlie', 'robert', 'daniel', 'anthony', 'matthew',
  'joshua', 'hunter', 'welcome123', 'administrator', 'root', 'guest',
  '123123', '1234567890', 'zxcvbnm', 'asdfgh', 'qazwsx', 'password12',
  'passw0rd', 'p@ssw0rd', 'p@ssword', '12345678', '987654321',
  'qwertyuiop', 'asdfghjkl', 'zxcvbnmm', 'ninja', 'mustang', 'access',
  'shadow', 'master123', 'azerty', 'loveme', 'secret', 'god', 'sex'
];

// Additional security patterns to check
const SECURITY_PATTERNS = {
  // Sequential characters
  sequential: /(?:abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|0123|1234|2345|3456|4567|5678|6789)/i,
  
  // Repeated characters
  repeated: /(.)\1{2,}/,
  
  // Keyboard patterns
  keyboard: /(?:qwerty|asdf|zxcv|qaz|wsx|edc|rfv|tgb|yhn|ujm|ik|ol|p|1qaz|2wsx|3edc|4rfv|5tgb|6yhn|7ujm|8ik|9ol|0p)/i,
  
  // Common substitutions that don't add security
  weakSubstitutions: /^(?=.*[a@].*[a@])|(?=.*[e3].*[e3])|(?=.*[i1].*[i1])|(?=.*[o0].*[o0])|(?=.*[s5].*[s5])/i
};

// Session management
interface SessionData {
  id: string;
  userId: string;
  createdAt: number;
  lastActivity: number;
  ipAddress: string;
  userAgent: string;
  isValid: boolean;
}

class SecurityService {
  private sessions = new Map<string, SessionData>();
  private loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
  
  // Default security settings
  private securitySettings: SecuritySettings = {
    sessionTimeout: 30, // 30 minutes
    maxLoginAttempts: 5,
    lockoutDuration: 15, // 15 minutes
    passwordExpiry: 90, // 90 days
    requireEmailVerification: true,
    enable2FA: false,
    secureSessionCookies: true
  };

  // Default password requirements
  private passwordRequirements: PasswordRequirements = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSymbols: false,
    preventCommonPasswords: true,
    preventPersonalInfo: true
  };

  /**
   * Validate password strength and requirements
   */
  validatePassword(password: string, userInfo?: { name?: string; email?: string }): PasswordValidationResult {
    const feedback: string[] = [];
    const requirements = {
      length: password.length >= this.passwordRequirements.minLength,
      uppercase: !this.passwordRequirements.requireUppercase || /[A-Z]/.test(password),
      lowercase: !this.passwordRequirements.requireLowercase || /[a-z]/.test(password),
      numbers: !this.passwordRequirements.requireNumbers || /\d/.test(password),
      symbols: !this.passwordRequirements.requireSymbols || /[!@#$%^&*(),.?":{}|<>]/.test(password),
      notCommon: !this.passwordRequirements.preventCommonPasswords || !this.isCommonPassword(password),
      notPersonal: !this.passwordRequirements.preventPersonalInfo || !this.containsPersonalInfo(password, userInfo)
    };

    // Enhanced security checks
    const securityChecks = this.performAdvancedSecurityChecks(password);

    // Generate feedback
    if (!requirements.length) {
      feedback.push(`Password must be at least ${this.passwordRequirements.minLength} characters long`);
    }
    if (!requirements.uppercase) {
      feedback.push('Password must contain at least one uppercase letter');
    }
    if (!requirements.lowercase) {
      feedback.push('Password must contain at least one lowercase letter');
    }
    if (!requirements.numbers) {
      feedback.push('Password must contain at least one number');
    }
    if (!requirements.symbols) {
      feedback.push('Password must contain at least one special character');
    }
    if (!requirements.notCommon) {
      feedback.push('Password is too common. Please choose a more unique password');
    }
    if (!requirements.notPersonal) {
      feedback.push('Password should not contain personal information');
    }

    // Advanced security feedback
    if (securityChecks.hasSequential) {
      feedback.push('Avoid sequential characters (e.g., abc, 123)');
    }
    if (securityChecks.hasRepeated) {
      feedback.push('Avoid repeated characters (e.g., aaa, 111)');
    }
    if (securityChecks.hasKeyboard) {
      feedback.push('Avoid keyboard patterns (e.g., qwerty, asdf)');
    }
    if (securityChecks.hasWeakSubstitutions) {
      feedback.push('Simple character substitutions don\'t add much security');
    }

    // Calculate strength score with enhanced checks
    const score = this.calculatePasswordScore(password, requirements, securityChecks);
    const isValid = Object.values(requirements).every(req => req) && !securityChecks.hasWeakPatterns;

    // Enhanced feedback for score
    if (isValid) {
      switch (score) {
        case 0:
        case 1:
          feedback.push('Password strength: Weak - Consider making it longer and more complex');
          break;
        case 2:
          feedback.push('Password strength: Fair - Good start, could be stronger');
          break;
        case 3:
          feedback.push('Password strength: Good - Well-balanced security');
          break;
        case 4:
          feedback.push('Password strength: Excellent - Very secure password');
          break;
      }
    }

    // Add extended requirements to the result
    const extendedRequirements = {
      ...requirements,
      noSequential: !securityChecks.hasSequential,
      noRepeated: !securityChecks.hasRepeated,
      noKeyboard: !securityChecks.hasKeyboard,
      noWeakSubstitutions: !securityChecks.hasWeakSubstitutions
    };

    return {
      isValid,
      score,
      feedback,
      requirements: extendedRequirements
    };
  }

  /**
   * Check if account is locked due to failed login attempts
   */
  isAccountLocked(identifier: string): boolean {
    const attempts = this.loginAttempts.get(identifier);
    if (!attempts) return false;

    if (attempts.lockedUntil && Date.now() < attempts.lockedUntil) {
      return true;
    }

    // Reset if lockout period has expired
    if (attempts.lockedUntil && Date.now() >= attempts.lockedUntil) {
      this.loginAttempts.delete(identifier);
      return false;
    }

    return false;
  }

  /**
   * Record failed login attempt
   */
  recordFailedLogin(identifier: string): { isLocked: boolean; remainingAttempts: number; lockoutMinutes?: number } {
    const attempts = this.loginAttempts.get(identifier) || { count: 0, lastAttempt: 0 };
    const now = Date.now();

    // Reset counter if last attempt was more than lockout duration ago
    if (now - attempts.lastAttempt > this.securitySettings.lockoutDuration * 60 * 1000) {
      attempts.count = 0;
    }

    attempts.count++;
    attempts.lastAttempt = now;

    // Lock account if max attempts reached
    if (attempts.count >= this.securitySettings.maxLoginAttempts) {
      attempts.lockedUntil = now + (this.securitySettings.lockoutDuration * 60 * 1000);
      
      // Track security event
      authAnalytics.track('security_account_locked', {
        identifier: this.hashIdentifier(identifier),
        attemptCount: attempts.count,
        lockoutDuration: this.securitySettings.lockoutDuration
      });

      this.loginAttempts.set(identifier, attempts);
      return {
        isLocked: true,
        remainingAttempts: 0,
        lockoutMinutes: this.securitySettings.lockoutDuration
      };
    }

    this.loginAttempts.set(identifier, attempts);
    return {
      isLocked: false,
      remainingAttempts: this.securitySettings.maxLoginAttempts - attempts.count
    };
  }

  /**
   * Clear failed login attempts after successful login
   */
  clearFailedLogins(identifier: string): void {
    this.loginAttempts.delete(identifier);
  }

  /**
   * Create secure session
   */
  createSession(userId: string, ipAddress: string, userAgent: string): string {
    const sessionId = this.generateSecureToken();
    const now = Date.now();

    const sessionData: SessionData = {
      id: sessionId,
      userId,
      createdAt: now,
      lastActivity: now,
      ipAddress,
      userAgent,
      isValid: true
    };

    this.sessions.set(sessionId, sessionData);

    // Track session creation
    authAnalytics.track('security_session_created', {
      sessionId: this.hashIdentifier(sessionId),
      userId: this.hashIdentifier(userId),
      deviceType: this.getDeviceType(userAgent)
    });

    return sessionId;
  }

  /**
   * Validate session
   */
  validateSession(sessionId: string, ipAddress: string, userAgent: string): { isValid: boolean; userId?: string; shouldRefresh?: boolean } {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isValid) {
      return { isValid: false };
    }

    const now = Date.now();
    const sessionAge = now - session.lastActivity;
    const maxAge = this.securitySettings.sessionTimeout * 60 * 1000;

    // Check if session expired
    if (sessionAge > maxAge) {
      this.invalidateSession(sessionId);
      authAnalytics.track('security_session_expired', {
        sessionId: this.hashIdentifier(sessionId),
        sessionAge: sessionAge / 1000 / 60 // minutes
      });
      return { isValid: false };
    }

    // Check for suspicious activity (IP or user agent change)
    if (session.ipAddress !== ipAddress || session.userAgent !== userAgent) {
      this.invalidateSession(sessionId);
      authAnalytics.track('security_session_suspicious', {
        sessionId: this.hashIdentifier(sessionId),
        ipChanged: session.ipAddress !== ipAddress,
        userAgentChanged: session.userAgent !== userAgent
      });
      return { isValid: false };
    }

    // Update last activity
    session.lastActivity = now;
    this.sessions.set(sessionId, session);

    // Suggest refresh if session is more than half expired
    const shouldRefresh = sessionAge > (maxAge / 2);

    return {
      isValid: true,
      userId: session.userId,
      shouldRefresh
    };
  }

  /**
   * Invalidate session
   */
  invalidateSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isValid = false;
      authAnalytics.track('security_session_invalidated', {
        sessionId: this.hashIdentifier(sessionId)
      });
    }
    this.sessions.delete(sessionId);
  }

  /**
   * Invalidate all sessions for a user
   */
  invalidateAllUserSessions(userId: string): void {
    let invalidatedCount = 0;
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.userId === userId) {
        this.invalidateSession(sessionId);
        invalidatedCount++;
      }
    }

    authAnalytics.track('security_all_sessions_invalidated', {
      userId: this.hashIdentifier(userId),
      sessionsInvalidated: invalidatedCount
    });
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Generate email verification token
   */
  generateEmailVerificationToken(email: string): { token: string; expiresAt: string } {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    // In production, store this in a secure database
    const verificationData = {
      email,
      token,
      expiresAt,
      used: false
    };

    // Store in localStorage for demo (use secure server storage in production)
    localStorage.setItem(`email_verification_${token}`, JSON.stringify(verificationData));

    authAnalytics.track('security_email_verification_sent', {
      email: this.hashIdentifier(email)
    });

    return { token, expiresAt };
  }

  /**
   * Verify email verification token
   */
  verifyEmailToken(token: string): { isValid: boolean; email?: string } {
    try {
      const stored = localStorage.getItem(`email_verification_${token}`);
      if (!stored) return { isValid: false };

      const verificationData = JSON.parse(stored);
      
      if (verificationData.used || new Date(verificationData.expiresAt) < new Date()) {
        return { isValid: false };
      }

      // Mark as used
      verificationData.used = true;
      localStorage.setItem(`email_verification_${token}`, JSON.stringify(verificationData));

      authAnalytics.track('security_email_verified', {
        email: this.hashIdentifier(verificationData.email)
      });

      return { isValid: true, email: verificationData.email };
    } catch {
      return { isValid: false };
    }
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(email: string): { token: string; expiresAt: string } {
    const token = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    const resetData = {
      email,
      token,
      expiresAt,
      used: false
    };

    localStorage.setItem(`password_reset_${token}`, JSON.stringify(resetData));

    authAnalytics.track('security_password_reset_requested', {
      email: this.hashIdentifier(email)
    });

    return { token, expiresAt };
  }

  /**
   * Verify password reset token
   */
  verifyPasswordResetToken(token: string): { isValid: boolean; email?: string } {
    try {
      const stored = localStorage.getItem(`password_reset_${token}`);
      if (!stored) return { isValid: false };

      const resetData = JSON.parse(stored);
      
      if (resetData.used || new Date(resetData.expiresAt) < new Date()) {
        return { isValid: false };
      }

      return { isValid: true, email: resetData.email };
    } catch {
      return { isValid: false };
    }
  }

  /**
   * Complete password reset
   */
  completePasswordReset(token: string): boolean {
    try {
      const stored = localStorage.getItem(`password_reset_${token}`);
      if (!stored) return false;

      const resetData = JSON.parse(stored);
      resetData.used = true;
      localStorage.setItem(`password_reset_${token}`, JSON.stringify(resetData));

      authAnalytics.track('security_password_reset_completed', {
        email: this.hashIdentifier(resetData.email)
      });

      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if running on HTTPS
   */
  isHTTPS(): boolean {
    return window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  }

  /**
   * Validate GDPR compliance requirements
   */
  checkGDPRCompliance(): {
    hasPrivacyPolicy: boolean;
    hasTermsOfService: boolean;
    hasCookieConsent: boolean;
    hasDataExportOption: boolean;
    hasDataDeletionOption: boolean;
  } {
    return {
      hasPrivacyPolicy: this.checkPrivacyPolicyExists(),
      hasTermsOfService: this.checkTermsExists(),
      hasCookieConsent: this.checkCookieConsentExists(),
      hasDataExportOption: true, // Implemented in user profile
      hasDataDeletionOption: true // Implemented in user profile
    };
  }

  // Private helper methods
  private isCommonPassword(password: string): boolean {
    return COMMON_PASSWORDS.includes(password.toLowerCase());
  }

  private containsPersonalInfo(password: string, userInfo?: { name?: string; email?: string }): boolean {
    if (!userInfo) return false;

    const lowerPassword = password.toLowerCase();
    
    if (userInfo.name) {
      const nameParts = userInfo.name.toLowerCase().split(' ');
      for (const part of nameParts) {
        if (part.length > 2 && lowerPassword.includes(part)) {
          return true;
        }
      }
    }

    if (userInfo.email) {
      const emailPart = userInfo.email.split('@')[0].toLowerCase();
      if (emailPart.length > 2 && lowerPassword.includes(emailPart)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Perform advanced security checks on password
   */
  private performAdvancedSecurityChecks(password: string): {
    hasSequential: boolean;
    hasRepeated: boolean;
    hasKeyboard: boolean;
    hasWeakSubstitutions: boolean;
    hasWeakPatterns: boolean;
  } {
    const hasSequential = SECURITY_PATTERNS.sequential.test(password);
    const hasRepeated = SECURITY_PATTERNS.repeated.test(password);
    const hasKeyboard = SECURITY_PATTERNS.keyboard.test(password);
    const hasWeakSubstitutions = SECURITY_PATTERNS.weakSubstitutions.test(password);

    return {
      hasSequential,
      hasRepeated,
      hasKeyboard,
      hasWeakSubstitutions,
      hasWeakPatterns: hasSequential || hasRepeated || hasKeyboard
    };
  }

  private calculatePasswordScore(password: string, requirements: any, securityChecks?: any): number {
    let score = 0;

    // Base requirements
    if (requirements.length && requirements.uppercase && requirements.lowercase && requirements.numbers) {
      score = 2;
    }

    // Length bonuses
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;

    // Character variety
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    if (/[^\w\s]/.test(password)) score++; // Non-alphanumeric characters

    // Security pattern penalties
    if (securityChecks) {
      if (securityChecks.hasWeakPatterns) score = Math.max(0, score - 2);
      if (securityChecks.hasWeakSubstitutions) score = Math.max(0, score - 1);
    }

    // Bonus for meeting all requirements without weak patterns
    if (requirements.notCommon && requirements.notPersonal && (!securityChecks || !securityChecks.hasWeakPatterns)) {
      score++;
    }

    // Entropy bonus for very complex passwords
    const entropy = this.calculatePasswordEntropy(password);
    if (entropy > 60) score++;

    return Math.min(4, score);
  }

  /**
   * Calculate password entropy (rough estimate)
   */
  private calculatePasswordEntropy(password: string): number {
    let charset = 0;
    
    if (/[a-z]/.test(password)) charset += 26;
    if (/[A-Z]/.test(password)) charset += 26;
    if (/[0-9]/.test(password)) charset += 10;
    if (/[^a-zA-Z0-9]/.test(password)) charset += 32; // Special characters
    
    return Math.log2(Math.pow(charset, password.length));
  }

  private hashIdentifier(identifier: string): string {
    // Simple hash for privacy (use proper hashing in production)
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      const char = identifier.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private getDeviceType(userAgent: string): string {
    if (/tablet|ipad/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|android/i.test(userAgent)) return 'mobile';
    return 'desktop';
  }

  private checkPrivacyPolicyExists(): boolean {
    // Check if privacy policy page exists
    return document.querySelector('[href*="privacy"]') !== null;
  }

  private checkTermsExists(): boolean {
    // Check if terms of service page exists
    return document.querySelector('[href*="terms"]') !== null;
  }

  private checkCookieConsentExists(): boolean {
    // Check if cookie consent mechanism exists
    return localStorage.getItem('cookie_consent') !== null;
  }

  /**
   * Auto-logout user due to session timeout
   */
  private autoLogoutCallback?: () => void;

  /**
   * Set callback for automatic logout
   */
  setAutoLogoutCallback(callback: () => void): void {
    this.autoLogoutCallback = callback;
  }

  /**
   * Monitor session activity and handle automatic logout
   */
  monitorSessionActivity(): () => void {
    let lastActivity = Date.now();
    const timeoutDuration = this.securitySettings.sessionTimeout * 60 * 1000;
    const warningDuration = timeoutDuration - (5 * 60 * 1000); // Warn 5 minutes before timeout
    
    let warningShown = false;
    let timeoutId: number;

    const updateActivity = () => {
      lastActivity = Date.now();
      warningShown = false;
      
      // Clear existing timeout
      clearTimeout(timeoutId);
      
      // Set new timeout
      timeoutId = setTimeout(checkActivity, 60000); // Check every minute
    };

    const checkActivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;
      
      if (timeSinceActivity >= timeoutDuration) {
        // Session expired - logout
        authAnalytics.track('security_session_timeout', {
          duration: timeSinceActivity / 1000 / 60 // minutes
        });
        
        if (this.autoLogoutCallback) {
          this.autoLogoutCallback();
        }
        return;
      }
      
      if (timeSinceActivity >= warningDuration && !warningShown) {
        // Show warning
        warningShown = true;
        const remainingMinutes = Math.ceil((timeoutDuration - timeSinceActivity) / 60000);
        
        authAnalytics.track('security_session_warning', {
          remainingMinutes
        });
        
        // Show timeout warning modal
        this.showSessionWarning(remainingMinutes);
      }
      
      // Schedule next check
      timeoutId = setTimeout(checkActivity, 60000);
    };

    // Activity event listeners
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Start monitoring
    updateActivity();

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }

  /**
   * Show session timeout warning
   */
  private showSessionWarning(remainingMinutes: number): void {
    // Create and show a modal warning about session timeout
    const existingModal = document.getElementById('session-timeout-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'session-timeout-modal';
    modal.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[10000]';
    
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md mx-4 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700">
        <div class="flex items-center space-x-3 mb-4">
          <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">Session Timeout Warning</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">Your session will expire soon</p>
          </div>
        </div>
        <p class="text-gray-700 dark:text-gray-300 mb-6">
          Your session will expire in <strong>${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}</strong> 
          due to inactivity. Click "Stay Logged In" to extend your session.
        </p>
        <div class="flex space-x-3">
          <button id="extend-session" class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Stay Logged In
          </button>
          <button id="logout-now" class="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
            Logout Now
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle button clicks
    const extendButton = modal.querySelector('#extend-session');
    const logoutButton = modal.querySelector('#logout-now');

    extendButton?.addEventListener('click', () => {
      modal.remove();
      // Reset activity timestamp
      authAnalytics.track('security_session_extended', {});
    });

    logoutButton?.addEventListener('click', () => {
      modal.remove();
      if (this.autoLogoutCallback) {
        this.autoLogoutCallback();
      }
    });

    // Auto-remove modal after timeout
    setTimeout(() => {
      if (document.body.contains(modal)) {
        modal.remove();
        if (this.autoLogoutCallback) {
          this.autoLogoutCallback();
        }
      }
    }, remainingMinutes * 60 * 1000);
  }

  /**
   * Enhanced security monitoring for suspicious activity
   */
  enableSecurityMonitoring(): void {
    // Monitor for suspicious navigation patterns
    let suspiciousActivity = 0;
    
    // Track page visibility changes (potential session hijacking detection)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        authAnalytics.track('security_page_hidden', {
          timestamp: Date.now()
        });
      } else {
        authAnalytics.track('security_page_visible', {
          timestamp: Date.now()
        });
      }
    });

    // Monitor for rapid navigation (potential automated attacks)
    let navigationCount = 0;
    const navigationWindow = 10000; // 10 seconds
    
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      navigationCount++;
      
      setTimeout(() => {
        navigationCount = Math.max(0, navigationCount - 1);
      }, navigationWindow);
      
      if (navigationCount > 10) {
        authAnalytics.track('security_suspicious_navigation', {
          count: navigationCount,
          timeWindow: navigationWindow
        });
        suspiciousActivity++;
      }
      
      return originalPushState.apply(history, args);
    };

    // Monitor for developer tools (basic detection)
    let devtools = { open: false, orientation: null };
    const threshold = 160;

    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        if (!devtools.open) {
          devtools.open = true;
          authAnalytics.track('security_devtools_detected', {
            timestamp: Date.now()
          });
        }
      } else {
        devtools.open = false;
      }
    }, 500);
  }

  /**
   * Clean up expired sessions and tokens
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = this.securitySettings.sessionTimeout * 60 * 1000;

    // Clean up expired sessions
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity > maxAge) {
        this.invalidateSession(sessionId);
      }
    }

    // Clean up expired verification tokens
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('email_verification_') || key.startsWith('password_reset_'))) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || '{}');
          if (new Date(data.expiresAt) < new Date()) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key);
        }
      }
    }
  }

  /**
   * Content Security Policy (CSP) management - DISABLED FOR DEBUGGING
   */
  enableContentSecurityPolicy(): void {
    // CSP is now handled via vercel.json headers
    // This method is disabled to prevent conflicts with permissive debugging CSP
    console.log('CSP handling moved to vercel.json for debugging purposes');
  }

  /**
   * Prevent clickjacking attacks
   */
  preventClickjacking(): void {
    // Add X-Frame-Options equivalent
    if (window.self !== window.top) {
      // Potential iframe embedding detected
      authAnalytics.track('security_potential_clickjacking', {
        timestamp: Date.now(),
        referrer: document.referrer
      });
      
      // Optionally break out of iframe
      // window.top.location = window.self.location;
    }
  }

  /**
   * Input sanitization and XSS prevention
   */
  sanitizeInput(input: string): string {
    // Remove potentially dangerous characters and scripts
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .trim();
  }

  /**
   * Validate and sanitize URL inputs
   */
  sanitizeURL(url: string): string {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTP/HTTPS protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        throw new Error('Invalid protocol');
      }
      
      // Block potentially dangerous domains (you can expand this list)
      const blockedDomains = ['javascript', 'data', 'vbscript'];
      if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
        throw new Error('Blocked domain');
      }
      
      return urlObj.toString();
    } catch {
      throw new Error('Invalid URL format');
    }
  }

  /**
   * Rate limiting for API calls
   */
  private rateLimiters = new Map<string, { count: number; resetTime: number }>();

  checkRateLimit(identifier: string, maxRequests: number = 10, windowMs: number = 60000): boolean {
    const now = Date.now();
    const key = `rate_limit_${identifier}`;
    
    let limiter = this.rateLimiters.get(key);
    
    if (!limiter || now > limiter.resetTime) {
      // Create new rate limit window
      limiter = { count: 0, resetTime: now + windowMs };
      this.rateLimiters.set(key, limiter);
    }
    
    limiter.count++;
    
    if (limiter.count > maxRequests) {
      authAnalytics.track('security_rate_limit_exceeded', {
        identifier: this.hashIdentifier(identifier),
        count: limiter.count,
        windowMs
      });
      return false;
    }
    
    return true;
  }

  /**
   * CSRF token management
   */
  generateCSRFToken(): string {
    const token = this.generateSecureToken();
    sessionStorage.setItem('csrf_token', token);
    return token;
  }

  validateCSRFToken(token: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === token && token.length > 0;
  }

  /**
   * Detect and prevent automation/bot attacks
   */
  detectAutomation(): boolean {
    // Check for webdriver
    if (window.navigator.webdriver) {
      authAnalytics.track('security_webdriver_detected', {
        userAgent: navigator.userAgent
      });
      return true;
    }
    
    // Check for common automation properties
    const automationIndicators = [
      'webdriver' in window,
      'callPhantom' in window,
      '_phantom' in window,
      'phantom' in window,
      window.navigator.userAgent.includes('PhantomJS'),
      window.navigator.userAgent.includes('HeadlessChrome'),
      window.outerWidth === 0 && window.outerHeight === 0
    ];
    
    const detected = automationIndicators.some(indicator => indicator);
    
    if (detected) {
      authAnalytics.track('security_automation_detected', {
        userAgent: navigator.userAgent,
        indicators: automationIndicators.map((indicator, index) => ({ index, detected: indicator }))
      });
    }
    
    return detected;
  }

  /**
   * Monitor for suspicious form submissions
   */
  monitorFormSecurity(formElement: HTMLFormElement): void {
    let submissionCount = 0;
    const submissionWindow = 60000; // 1 minute
    let lastSubmission = 0;
    
    const handleSubmit = (event: Event) => {
      const now = Date.now();
      
      // Reset counter if window has passed
      if (now - lastSubmission > submissionWindow) {
        submissionCount = 0;
      }
      
      submissionCount++;
      lastSubmission = now;
      
      // Check for rapid submissions (potential bot activity)
      if (submissionCount > 5) {
        event.preventDefault();
        authAnalytics.track('security_rapid_form_submission', {
          count: submissionCount,
          formId: formElement.id || 'unknown',
          timeWindow: submissionWindow
        });
        
        // Show rate limit message
        this.showSecurityAlert('Too many form submissions. Please wait before trying again.');
        return false;
      }
      
      // Check if automation detected
      if (this.detectAutomation()) {
        event.preventDefault();
        authAnalytics.track('security_automated_form_submission', {
          formId: formElement.id || 'unknown'
        });
        
        // Show captcha or additional verification
        this.showSecurityAlert('Automated submission detected. Please verify you are human.');
        return false;
      }
    };
    
    formElement.addEventListener('submit', handleSubmit);
  }

  /**
   * Show security alert to user
   */
  private showSecurityAlert(message: string): void {
    // Create security alert modal
    const alertId = 'security-alert-' + Date.now();
    const alert = document.createElement('div');
    alert.id = alertId;
    alert.className = 'fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-[10001] max-w-sm';
    
    alert.innerHTML = `
      <div class="flex items-start space-x-3">
        <svg class="w-5 h-5 text-white mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <div class="flex-1">
          <h4 class="font-semibold mb-1">Security Alert</h4>
          <p class="text-sm">${message}</p>
        </div>
        <button onclick="document.getElementById('${alertId}').remove()" class="text-white hover:text-gray-200">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(alert);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (document.getElementById(alertId)) {
        alert.remove();
      }
    }, 10000);
  }

  /**
   * Initialize all security measures
   */
  initializeSecurity(): void {
    // Enable CSP
    this.enableContentSecurityPolicy();
    
    // Prevent clickjacking
    this.preventClickjacking();
    
    // Start security monitoring
    this.enableSecurityMonitoring();
    
    // Monitor all forms on the page
    document.querySelectorAll('form').forEach(form => {
      this.monitorFormSecurity(form as HTMLFormElement);
    });
    
    // Monitor for new forms added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if it's a form
            if (element.tagName === 'FORM') {
              this.monitorFormSecurity(element as HTMLFormElement);
            }
            
            // Check for forms within the added element
            element.querySelectorAll('form').forEach(form => {
              this.monitorFormSecurity(form as HTMLFormElement);
            });
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    authAnalytics.track('security_initialized', {
      timestamp: Date.now()
    });
  }
}

// Export singleton instance
export const securityService = new SecurityService();

// Auto-cleanup every 5 minutes
setInterval(() => {
  securityService.cleanup();
}, 5 * 60 * 1000);

// Initialize security measures when the service loads
if (typeof window !== 'undefined') {
  // Initialize security after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      securityService.initializeSecurity();
    });
  } else {
    securityService.initializeSecurity();
  }
}
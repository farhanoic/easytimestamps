/**
 * Professional Error Handling Service
 * Provides user-friendly error messages and logging
 */


export interface ErrorDetails {
  code: string;
  message: string;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: 'auth' | 'network' | 'validation' | 'security' | 'system';
  timestamp: string;
  context?: Record<string, any>;
}

export interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
  severity: 'info' | 'warning' | 'error' | 'success';
}

class ErrorHandlingService {
  private errorCodes: Record<string, UserFriendlyError> = {
    // Authentication Errors
    'AUTH_INVALID_CREDENTIALS': {
      title: 'Sign-in Failed',
      message: 'The email or password you entered is incorrect. Please check your credentials and try again.',
      action: 'reset-password',
      actionLabel: 'Forgot Password?',
      severity: 'error'
    },
    'AUTH_ACCOUNT_LOCKED': {
      title: 'Account Temporarily Locked',
      message: 'Your account has been temporarily locked due to multiple failed login attempts. Please try again in 15 minutes or reset your password.',
      action: 'reset-password',
      actionLabel: 'Reset Password',
      severity: 'warning'
    },
    'AUTH_EMAIL_NOT_VERIFIED': {
      title: 'Email Verification Required',
      message: 'Please verify your email address before signing in. Check your inbox for a verification link.',
      action: 'resend-verification',
      actionLabel: 'Resend Email',
      severity: 'warning'
    },
    'AUTH_SESSION_EXPIRED': {
      title: 'Session Expired',
      message: 'Your session has expired for security reasons. Please sign in again to continue.',
      action: 'signin',
      actionLabel: 'Sign In',
      severity: 'info'
    },
    'AUTH_RATE_LIMITED': {
      title: 'Too Many Attempts',
      message: 'You have made too many requests. Please wait a few minutes before trying again.',
      severity: 'warning'
    },

    // Validation Errors
    'VALIDATION_EMAIL_INVALID': {
      title: 'Invalid Email',
      message: 'Please enter a valid email address (e.g., user@example.com).',
      severity: 'error'
    },
    'VALIDATION_PASSWORD_WEAK': {
      title: 'Password Too Weak',
      message: 'Your password must be at least 8 characters long and include uppercase, lowercase, and numbers.',
      severity: 'error'
    },
    'VALIDATION_PASSWORDS_MISMATCH': {
      title: 'Passwords Don\'t Match',
      message: 'The passwords you entered don\'t match. Please check and try again.',
      severity: 'error'
    },

    // Network Errors
    'NETWORK_CONNECTION_ERROR': {
      title: 'Connection Problem',
      message: 'Unable to connect to our servers. Please check your internet connection and try again.',
      action: 'retry',
      actionLabel: 'Try Again',
      severity: 'error'
    },
    'NETWORK_TIMEOUT': {
      title: 'Request Timed Out',
      message: 'The request took too long to complete. Please check your connection and try again.',
      action: 'retry',
      actionLabel: 'Try Again',
      severity: 'warning'
    },
    'NETWORK_SERVER_ERROR': {
      title: 'Server Error',
      message: 'Something went wrong on our end. Our team has been notified and is working on a fix.',
      severity: 'error'
    },

    // Security Errors
    'SECURITY_SUSPICIOUS_ACTIVITY': {
      title: 'Suspicious Activity Detected',
      message: 'We\'ve detected unusual activity on your account. For your security, please verify your identity.',
      action: 'verify-identity',
      actionLabel: 'Verify Identity',
      severity: 'warning'
    },
    'SECURITY_CSRF_ERROR': {
      title: 'Security Verification Failed',
      message: 'A security check failed. Please refresh the page and try again.',
      action: 'refresh',
      actionLabel: 'Refresh Page',
      severity: 'warning'
    },

    // System Errors
    'SYSTEM_MAINTENANCE': {
      title: 'Maintenance Mode',
      message: 'Easy Timestamps is currently undergoing maintenance. We\'ll be back shortly.',
      severity: 'info'
    },
    'SYSTEM_FEATURE_UNAVAILABLE': {
      title: 'Feature Temporarily Unavailable',
      message: 'This feature is temporarily unavailable. Please try again later.',
      severity: 'warning'
    },

    // Default Error
    'UNKNOWN_ERROR': {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. If this continues, please contact our support team.',
      action: 'contact-support',
      actionLabel: 'Contact Support',
      severity: 'error'
    }
  };

  /**
   * Handle and transform errors into user-friendly messages
   */
  handleError(error: Error | string, context?: Record<string, any>): UserFriendlyError {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorCode = this.classifyError(errorMessage);
    
    // Log error details
    const errorDetails: ErrorDetails = {
      code: errorCode,
      message: errorMessage,
      userMessage: this.errorCodes[errorCode]?.message || errorMessage,
      severity: this.mapSeverity(this.errorCodes[errorCode]?.severity),
      category: this.categorizeError(errorCode),
      timestamp: new Date().toISOString(),
      context
    };

    this.logError(errorDetails);

    return this.errorCodes[errorCode] || this.errorCodes['UNKNOWN_ERROR'];
  }

  /**
   * Classify error message to determine error code
   */
  private classifyError(message: string): string {
    const lowerMessage = message.toLowerCase();

    // Authentication errors
    if (lowerMessage.includes('invalid') && (lowerMessage.includes('email') || lowerMessage.includes('password'))) {
      return 'AUTH_INVALID_CREDENTIALS';
    }
    if (lowerMessage.includes('account') && lowerMessage.includes('lock')) {
      return 'AUTH_ACCOUNT_LOCKED';
    }
    if (lowerMessage.includes('email') && lowerMessage.includes('verif')) {
      return 'AUTH_EMAIL_NOT_VERIFIED';
    }
    if (lowerMessage.includes('session') && lowerMessage.includes('expired')) {
      return 'AUTH_SESSION_EXPIRED';
    }
    if (lowerMessage.includes('rate limit') || lowerMessage.includes('too many')) {
      return 'AUTH_RATE_LIMITED';
    }

    // Validation errors
    if (lowerMessage.includes('email') && lowerMessage.includes('invalid')) {
      return 'VALIDATION_EMAIL_INVALID';
    }
    if (lowerMessage.includes('password') && (lowerMessage.includes('weak') || lowerMessage.includes('requirement'))) {
      return 'VALIDATION_PASSWORD_WEAK';
    }
    if (lowerMessage.includes('password') && lowerMessage.includes('match')) {
      return 'VALIDATION_PASSWORDS_MISMATCH';
    }

    // Network errors
    if (lowerMessage.includes('network') || lowerMessage.includes('connection')) {
      return 'NETWORK_CONNECTION_ERROR';
    }
    if (lowerMessage.includes('timeout')) {
      return 'NETWORK_TIMEOUT';
    }
    if (lowerMessage.includes('server') && lowerMessage.includes('error')) {
      return 'NETWORK_SERVER_ERROR';
    }

    // Security errors
    if (lowerMessage.includes('suspicious') || lowerMessage.includes('unusual')) {
      return 'SECURITY_SUSPICIOUS_ACTIVITY';
    }
    if (lowerMessage.includes('csrf') || lowerMessage.includes('security')) {
      return 'SECURITY_CSRF_ERROR';
    }

    // System errors
    if (lowerMessage.includes('maintenance')) {
      return 'SYSTEM_MAINTENANCE';
    }
    if (lowerMessage.includes('unavailable') || lowerMessage.includes('disabled')) {
      return 'SYSTEM_FEATURE_UNAVAILABLE';
    }

    return 'UNKNOWN_ERROR';
  }

  /**
   * Map UI severity to logging severity
   */
  private mapSeverity(uiSeverity?: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (uiSeverity) {
      case 'info':
      case 'success':
        return 'low';
      case 'warning':
        return 'medium';
      case 'error':
        return 'high';
      default:
        return 'medium';
    }
  }

  /**
   * Categorize error by type
   */
  private categorizeError(errorCode: string): 'auth' | 'network' | 'validation' | 'security' | 'system' {
    if (errorCode.startsWith('AUTH_')) return 'auth';
    if (errorCode.startsWith('VALIDATION_')) return 'validation';
    if (errorCode.startsWith('NETWORK_')) return 'network';
    if (errorCode.startsWith('SECURITY_')) return 'security';
    if (errorCode.startsWith('SYSTEM_')) return 'system';
    return 'system';
  }

  /**
   * Log error details for monitoring
   */
  private logError(errorDetails: ErrorDetails): void {
    // Log to console for development
    console.error('Error occurred:', {
      errorCode: errorDetails.code,
      severity: errorDetails.severity,
      category: errorDetails.category,
      message: errorDetails.message,
      context: errorDetails.context
    });

    // Console logging in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      console.group(`🚨 Error [${errorDetails.severity.toUpperCase()}]`);
      console.error('Code:', errorDetails.code);
      console.error('Message:', errorDetails.message);
      console.error('User Message:', errorDetails.userMessage);
      console.error('Category:', errorDetails.category);
      console.error('Timestamp:', errorDetails.timestamp);
      if (errorDetails.context) {
        console.error('Context:', errorDetails.context);
      }
      console.groupEnd();
    }

    // In production, send to error monitoring service
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1' && errorDetails.severity === 'critical') {
      // Send to external error monitoring (e.g., Sentry, LogRocket)
      this.sendToErrorMonitoring(errorDetails);
    }
  }

  /**
   * Send critical errors to external monitoring
   */
  private sendToErrorMonitoring(errorDetails: ErrorDetails): void {
    // Placeholder for external error monitoring integration
    // In production, integrate with services like Sentry, LogRocket, etc.
    console.log('Would send to error monitoring:', errorDetails);
  }

  /**
   * Get friendly error message for display
   */
  getFriendlyMessage(error: Error | string, context?: Record<string, any>): UserFriendlyError {
    return this.handleError(error, context);
  }

  /**
   * Create error notification for UI display
   */
  createErrorNotification(error: Error | string, context?: Record<string, any>): {
    id: string;
    type: 'error' | 'warning' | 'info' | 'success';
    title: string;
    message: string;
    action?: string;
    actionLabel?: string;
    autoClose?: boolean;
    duration?: number;
  } {
    const friendlyError = this.getFriendlyMessage(error, context);
    
    return {
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: friendlyError.severity,
      title: friendlyError.title,
      message: friendlyError.message,
      action: friendlyError.action,
      actionLabel: friendlyError.actionLabel,
      autoClose: friendlyError.severity === 'success' || friendlyError.severity === 'info',
      duration: friendlyError.severity === 'error' ? 0 : 5000 // Errors stay until dismissed
    };
  }

  /**
   * Format error for form field validation
   */
  getFieldError(fieldName: string, error: Error | string): string {
    const friendlyError = this.getFriendlyMessage(error);
    
    // Customize message based on field
    switch (fieldName) {
      case 'email':
        if (friendlyError.title.includes('Invalid Email')) {
          return 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (friendlyError.title.includes('Password')) {
          return friendlyError.message;
        }
        break;
      case 'confirmPassword':
        if (friendlyError.title.includes('Match')) {
          return 'Passwords must match';
        }
        break;
    }
    
    return friendlyError.message;
  }
}

// Export singleton instance
export const errorHandlingService = new ErrorHandlingService();
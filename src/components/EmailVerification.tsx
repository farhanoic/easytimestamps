/**
 * Email Verification Component
 * Handles email verification flow for security
 */

import React, { useState, useEffect } from 'react';
import { Mail, Check, AlertCircle, RefreshCw, Shield, Clock } from 'lucide-react';
import { securityService } from '../services/securityService';
import { authAnalytics } from '../services/authAnalytics';
// import { useTranslation } from 'react-i18next';

interface EmailVerificationProps {
  email: string;
  onVerified: () => void;
  onResendRequest: () => void;
}

export const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerified,
  onResendRequest
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  // Track component mount
  useEffect(() => {
    authAnalytics.track('security_email_verification_shown', {
      email: email.substring(0, email.indexOf('@')) + '@' + email.substring(email.indexOf('@') + 1)
    });
  }, [email]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const result = securityService.verifyEmailToken(verificationCode.trim());
      
      if (result.isValid && result.email === email) {
        setMessage('Email verified successfully!');
        authAnalytics.track('security_email_verification_success', {
          email: email.substring(0, email.indexOf('@')) + '@' + email.substring(email.indexOf('@') + 1)
        });
        
        setTimeout(() => {
          onVerified();
        }, 1500);
      } else {
        setError('Invalid or expired verification code. Please try again.');
        authAnalytics.track('security_email_verification_failed', {
          email: email.substring(0, email.indexOf('@')) + '@' + email.substring(email.indexOf('@') + 1),
          reason: 'invalid_token'
        });
      }
    } catch (error) {
      setError('Failed to verify email. Please try again.');
      authAnalytics.track('security_email_verification_error', {
        email: email.substring(0, email.indexOf('@')) + '@' + email.substring(email.indexOf('@') + 1),
        error: (error as Error).message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // Generate new verification token
      const { token } = securityService.generateEmailVerificationToken(email);
      
      // In a real app, this would send an email
      console.log('Verification code (demo):', token);
      
      setMessage('Verification code sent! Check your email.');
      setCanResend(false);
      setCountdown(60);
      
      authAnalytics.track('security_email_verification_resent', {
        email: email.substring(0, email.indexOf('@')) + '@' + email.substring(email.indexOf('@') + 1)
      });
      
      onResendRequest();
    } catch (error) {
      setError('Failed to send verification code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const maskedLocal = localPart.length > 2 
      ? localPart[0] + '*'.repeat(localPart.length - 2) + localPart[localPart.length - 1]
      : localPart;
    return `${maskedLocal}@${domain}`;
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          We've sent a verification code to
        </p>
        <p className="text-gray-900 dark:text-gray-100 font-medium">
          {maskEmail(email)}
        </p>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-2">
          <Shield className="w-4 h-4" />
          <span className="font-semibold text-sm">Why verify your email?</span>
        </div>
        <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Secure your account from unauthorized access</li>
          <li>• Recover your account if you forget your password</li>
          <li>• Receive important security notifications</li>
        </ul>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">{message}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
          <div className="flex items-center space-x-2 text-red-800 dark:text-red-200">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Verification Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 text-center text-lg tracking-widest font-mono"
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
            disabled={isLoading}
            autoComplete="one-time-code"
          />
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Check your email inbox and spam folder
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || verificationCode.length < 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              <span>Verify Email</span>
            </>
          )}
        </button>
      </form>

      {/* Resend Section */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Didn't receive the code?
        </p>
        
        {canResend ? (
          <button
            onClick={handleResend}
            disabled={isLoading}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Resend Code</span>
          </button>
        ) : (
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>Resend in {countdown}s</span>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            Having trouble?
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-gray-600 dark:text-gray-400">
              • Check your spam/junk folder
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Make sure {email} is correct
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              • Contact{' '}
              <a href="mailto:support@easytimestamps.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                support
              </a>
              {' '}if issues persist
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
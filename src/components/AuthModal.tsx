import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../hooks/useLocalization';
import Logo from './Logo';
import { authAnalytics } from '../services/authAnalytics';
import { securityService } from '../services/securityService';
import { errorHandlingService } from '../services/errorHandling';
import { TrustText, SecurityBadge } from './TrustIndicators';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

type AuthMode = 'signin' | 'signup' | 'reset';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'signin'
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passwordStrength, setPasswordStrength] = useState<any>(null);

  // Sync mode with initialMode prop when it changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        authAnalytics.trackModalEvent('closed', mode, { method: 'escape' });
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      
      // Track modal open
      authAnalytics.trackModalEvent('opened', mode);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose, mode]);

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      authAnalytics.trackModalEvent('closed', mode, { method: 'backdrop' });
      onClose();
    }
  };

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('auth.errors.emailRequired', 'Email is required');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('auth.errors.emailInvalid', 'Email is invalid');
    }

    // Password validation for signin/signup
    if (mode !== 'reset') {
      if (!formData.password) {
        newErrors.password = t('auth.errors.passwordRequired', 'Password is required');
      } else if (mode === 'signup') {
        // Enhanced password validation for signup
        const passwordValidation = securityService.validatePassword(formData.password, {
          name: formData.name,
          email: formData.email
        });
        
        if (!passwordValidation.isValid) {
          newErrors.password = passwordValidation.feedback[0] || 'Password does not meet security requirements';
        }
      }
    }

    // Name validation for signup
    if (mode === 'signup') {
      if (!formData.name) {
        newErrors.name = t('auth.errors.nameRequired', 'Name is required');
      }
      
      // Confirm password validation
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('auth.errors.passwordMismatch', 'Passwords do not match');
      }
      
      // Terms agreement validation
      if (!agreeToTerms) {
        newErrors.terms = t('auth.errors.termsRequired', 'You must agree to the Terms & Privacy Policy');
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Real-time password strength checking
  const handlePasswordChange = (password: string) => {
    setFormData({ ...formData, password });
    
    if (mode === 'signup' && password.length > 0) {
      const strength = securityService.validatePassword(password, {
        name: formData.name,
        email: formData.email
      });
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setErrors({});

    if (!validateForm()) return;

    try {
      switch (mode) {
        case 'signin':
          await signIn(formData.email, formData.password);
          setMessage({ 
            type: 'success', 
            text: t('auth.success.signedIn', 'Welcome back! Successfully signed in.') 
          });
          setTimeout(onClose, 1500);
          break;
          
        case 'signup':
          await signUp(formData.email, formData.password, formData.name);
          setMessage({ 
            type: 'success', 
            text: t('auth.success.signedUp', 'Welcome to Easy Timestamps! Account created successfully.') 
          });
          setTimeout(onClose, 1500);
          break;
          
        case 'reset':
          await resetPassword(formData.email);
          setMessage({ 
            type: 'success', 
            text: t('auth.success.resetSent', 'Password reset email sent! Check your inbox and spam folder.') 
          });
          setTimeout(() => setMode('signin'), 3000);
          break;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      
      // Use the error handling service for professional error messages
      const friendlyError = errorHandlingService.getFriendlyMessage(error, {
        mode,
        email: formData.email,
        timestamp: new Date().toISOString()
      });
      
      // Handle field-specific errors
      if (error.message.includes('Invalid email') || error.message.includes('email')) {
        const fieldError = errorHandlingService.getFieldError('email', error);
        setErrors({ email: fieldError });
        return;
      } else if (error.message.includes('password') && !error.message.includes('reset')) {
        const fieldError = errorHandlingService.getFieldError('password', error);
        setErrors({ password: fieldError });
        return;
      }
      
      // Show general error message
      setMessage({ type: 'error', text: friendlyError.message });
    }
  };

  const handleSocialSignIn = async (provider: 'google' | 'github') => {
    try {
      setMessage(null);
      setErrors({});
      
      if (provider === 'google') {
        await signInWithGoogle();
        setMessage({ 
          type: 'success', 
          text: t('auth.success.googleSignIn', 'Successfully signed in with Google!') 
        });
      } else {
        await signInWithGitHub();
        setMessage({ 
          type: 'success', 
          text: t('auth.success.githubSignIn', 'Successfully signed in with GitHub!') 
        });
      }
      
      setTimeout(onClose, 1500);
    } catch (error: any) {
      console.error(`${provider} sign-in error:`, error);
      
      // Use error handling service for social sign-in errors
      const friendlyError = errorHandlingService.getFriendlyMessage(error, {
        provider,
        action: 'social_signin',
        timestamp: new Date().toISOString()
      });
      
      setMessage({ type: 'error', text: friendlyError.message });
    }
  };

  const resetForm = () => {
    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setRememberMe(false);
    setAgreeToTerms(false);
    setErrors({});
    setMessage(null);
  };

  const switchMode = (newMode: AuthMode) => {
    authAnalytics.trackModalEvent('switched', newMode, { from: mode });
    setMode(newMode);
    resetForm();
  };

  const getTitle = () => {
    switch (mode) {
      case 'signin': return t('auth.welcomeBack', 'Welcome back');
      case 'signup': return t('auth.joinEasyTimestamps', 'Join Easy Timestamps');
      case 'reset': return t('auth.resetPassword', 'Reset Password');
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case 'signin': return t('auth.signinSubtitle', 'Sign in to your account to continue');
      case 'signup': return t('auth.signupSubtitle', 'Sign up for early access to premium features');
      case 'reset': return t('auth.resetSubtitle', 'Enter your email to reset your password');
    }
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 animate-in fade-in duration-200" 
      onClick={handleBackdropClick}
    >
      <div className={`bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8 ${isRTL ? 'rtl' : 'ltr'} transform transition-all duration-300 scale-100 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700 animate-in zoom-in duration-200`}>
        {/* Header */}
        <div className="text-center mb-8">
          {/* Close Button */}
          <button
            onClick={() => {
              authAnalytics.trackModalEvent('closed', mode, { method: 'button' });
              onClose();
            }}
            className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
          
          {/* Logo */}
          <div className="mb-6">
            <Logo size="large" showText={false} disableClick={true} />
          </div>
          
          {/* Title and Subtitle */}
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {getTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {getSubtitle()}
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400' 
              : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        {/* Benefits Message */}
        {mode === 'signup' && (
          <div className="text-center mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              {t('auth.benefitsMessage', 'Join 1000s of creators using Easy Timestamps')}
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {t('auth.earlyAccess', 'Get early access to premium features')}
            </p>
          </div>
        )}

        {/* Social Sign In */}
        {mode !== 'reset' && (
          <div className="space-y-3 mb-6">
            {/* Google Sign-In Button */}
            <button
              onClick={() => handleSocialSignIn('google')}
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center space-x-3 py-3.5 px-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            >
              {/* Google Logo */}
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              
              <div className="flex-1 text-left">
                <div className="text-gray-900 dark:text-gray-100 font-semibold">
                  {mode === 'signin' 
                    ? t('auth.signInWithGoogle', 'Sign in with Google')
                    : t('auth.signUpWithGoogle', 'Sign up with Google')
                  }
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {t('auth.googleBenefit', 'Quick & Secure')}
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              )}
            </button>

            {/* GitHub Sign-In Button */}
            <button
              onClick={() => handleSocialSignIn('github')}
              disabled={isLoading}
              className="w-full group relative flex items-center justify-center space-x-3 py-3.5 px-4 bg-gray-900 dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-700 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-700 hover:border-gray-700 dark:hover:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md"
            >
              {/* GitHub Logo */}
              <svg className="w-5 h-5 flex-shrink-0 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              
              <div className="flex-1 text-left">
                <div className="text-white font-semibold">
                  {mode === 'signin' 
                    ? t('auth.signInWithGitHub', 'Sign in with GitHub')
                    : t('auth.signUpWithGitHub', 'Sign up with GitHub')
                  }
                </div>
                <div className="text-xs text-gray-300">
                  {t('auth.githubBenefit', 'Popular with developers')}
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading && (
                <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
              )}
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 font-medium">
                  {t('auth.or', 'or')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name field for signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.name', 'Full Name')}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-200 ${
                    errors.name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  placeholder={t('auth.namePlaceholder', 'Enter your full name')}
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t('auth.email', 'Email address')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-200 ${
                  errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
                placeholder={t('auth.emailPlaceholder', 'Enter your email address')}
                disabled={isLoading}
              />
            </div>
            {errors.email ? (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.email}</span>
              </p>
            ) : (
              <div className="mt-2">
                <TrustText text="Your email is encrypted and never shared" />
              </div>
            )}
          </div>

          {/* Password field */}
          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-200 ${
                    errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                  disabled={isLoading}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password Strength Indicator for Signup */}
              {mode === 'signup' && passwordStrength && formData.password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.score === 0 ? 'w-1/4 bg-red-500' :
                          passwordStrength.score === 1 ? 'w-2/4 bg-orange-500' :
                          passwordStrength.score === 2 ? 'w-3/4 bg-yellow-500' :
                          passwordStrength.score === 3 ? 'w-full bg-green-500' :
                          'w-full bg-green-600'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordStrength.score <= 1 ? 'text-red-600 dark:text-red-400' :
                      passwordStrength.score === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                      'text-green-600 dark:text-green-400'
                    }`}>
                      {passwordStrength.score <= 1 ? 'Weak' :
                       passwordStrength.score === 2 ? 'Fair' :
                       passwordStrength.score === 3 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                  {!passwordStrength.isValid && (
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      {passwordStrength.feedback.slice(0, 2).map((feedback: string, index: number) => (
                        <li key={index} className="flex items-center space-x-1">
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          <span>{feedback}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>
          )}

          {/* Confirm Password field for signup */}
          {mode === 'signup' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.confirmPassword', 'Confirm Password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  placeholder={t('auth.confirmPasswordPlaceholder', 'Confirm your password')}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          )}

          {/* Remember Me (for signin) */}
          {mode === 'signin' && (
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {t('auth.rememberMe', 'Remember me')}
              </label>
            </div>
          )}
          
          {/* Terms Agreement (for signup) */}
          {mode === 'signup' && (
            <div>
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                  disabled={isLoading}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  {t('auth.agreeToTerms', 'I agree to the')}{' '}
                  <a href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('auth.termsOfService', 'Terms of Service')}
                  </a>
                  {' '}{t('auth.and', 'and')}{' '}
                  <a href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:underline">
                    {t('auth.privacyPolicy', 'Privacy Policy')}
                  </a>
                </label>
              </div>
              {errors.terms ? (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center space-x-1">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.terms}</span>
                </p>
              ) : (
                <div className="mt-2 flex items-center justify-between">
                  <TrustText text="GDPR compliant • No data selling • Secure encryption" showIcon={false} />
                  <SecurityBadge type="privacy" size="sm" />
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || (mode === 'signup' && !agreeToTerms)}
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>
              {mode === 'signin' && t('auth.signInButton', 'Sign In')}
              {mode === 'signup' && t('auth.signUpButton', 'Create Account')}
              {mode === 'reset' && t('auth.resetButton', 'Send Reset Email')}
            </span>
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-4">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => switchMode('reset')}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
                disabled={isLoading}
              >
                {t('auth.forgotPassword', 'Forgot your password?')}
              </button>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t('auth.noAccount', "Don't have an account?")}{' '}
                <button
                  onClick={() => switchMode('signup')}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold"
                  disabled={isLoading}
                >
                  {t('auth.signUpLink', 'Sign up')}
                </button>
              </p>
            </>
          )}

          {mode === 'signup' && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('auth.haveAccount', 'Already have an account?')}{' '}
              <button
                onClick={() => switchMode('signin')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-semibold"
                disabled={isLoading}
              >
                {t('auth.signInLink', 'Sign in')}
              </button>
            </p>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => switchMode('signin')}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium"
              disabled={isLoading}
            >
              {t('auth.backToSignIn', 'Back to sign in')}
            </button>
          )}
        </div>

        {/* Enhanced Security & Privacy Notice */}
        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
          <div className="text-center space-y-4">
            {/* Security Indicators */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">SSL Encrypted</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400">GDPR Compliant</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-xs font-medium text-purple-600 dark:text-purple-400">No Data Selling</span>
              </div>
            </div>
            
            {/* Privacy Promise */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2 text-green-800 dark:text-green-200 mb-1">
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold text-sm">Our Privacy Promise</span>
              </div>
              <p className="text-xs text-green-700 dark:text-green-300 leading-relaxed">
                We never spam, sell, or share your email with third parties. Your data is encrypted and secure.
              </p>
            </div>
            
            {/* Legal Links */}
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>
                Protected by our{' '}
                <a href="/privacy" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
                  Privacy Policy
                </a>
                {' '}&{' '}
                <a href="/terms" target="_blank" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-medium">
                  Terms of Service
                </a>
              </p>
              <p className="flex items-center justify-center space-x-1">
                <span>Secure hosting by</span>
                <span className="font-medium">AWS</span>
                <span>•</span>
                <span>256-bit encryption</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
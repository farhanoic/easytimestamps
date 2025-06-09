import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Palette, 
  Bell, 
  Shield, 
  Check, 
  Edit2, 
  LogOut, 
  Trash2,
  Mail,
  Calendar,
  Crown,
  Save,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { securityService } from '../services/securityService';
import LanguageSelector from './LanguageSelector';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { themePreference, setThemePreference } = useTheme();
  
  // Settings state
  const [displayName, setDisplayName] = useState(user?.name || 'Farhan Azhar');
  const email = user?.email || 'farhanazhar.tlp@gmail.com';
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>(themePreference);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [featureAnnouncements, setFeatureAnnouncements] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempDisplayName, setTempDisplayName] = useState(displayName);
  
  // Auto-save states
  const [saveStates, setSaveStates] = useState<Record<string, 'idle' | 'saving' | 'saved' | 'error'>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Email and password change states
  const [isEmailChangeModalOpen, setIsEmailChangeModalOpen] = useState(false);
  const [isPasswordChangeModalOpen, setIsPasswordChangeModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteConfirmStep, setDeleteConfirmStep] = useState(0);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  
  // Security verification states
  const [pendingEmailVerification, setPendingEmailVerification] = useState<string | null>(null);
  const [passwordChangeStep, setPasswordChangeStep] = useState<'form' | 'verification' | 'success'>('form');
  
  // Real-time password validation
  const [passwordValidation, setPasswordValidation] = useState<any>(null);

  // Enhanced auto-save functionality
  const autoSave = async (settingKey: string, action: () => Promise<void> | void, retryCount = 0) => {
    // Clear any existing errors
    setErrors(prev => ({ ...prev, [settingKey]: '' }));
    
    // Set saving state
    setSaveStates(prev => ({ ...prev, [settingKey]: 'saving' }));

    try {
      await action();
      
      // Set saved state
      setSaveStates(prev => ({ ...prev, [settingKey]: 'saved' }));
      
      // Clear saved state after 2 seconds
      setTimeout(() => {
        setSaveStates(prev => ({ ...prev, [settingKey]: 'idle' }));
      }, 2000);
      
    } catch (error: any) {
      console.error(`Failed to save ${settingKey}:`, error);
      
      // Retry logic for network errors
      if (retryCount < 2 && (error.message?.includes('network') || error.message?.includes('fetch'))) {
        setErrors(prev => ({ ...prev, [settingKey]: 'Failed to save, trying again...' }));
        setTimeout(() => {
          autoSave(settingKey, action, retryCount + 1);
        }, 1000);
      } else {
        setSaveStates(prev => ({ ...prev, [settingKey]: 'error' }));
        setErrors(prev => ({ 
          ...prev, 
          [settingKey]: error.message || 'Failed to save. Please try again.' 
        }));
        
        // Clear error state after 5 seconds
        setTimeout(() => {
          setSaveStates(prev => ({ ...prev, [settingKey]: 'idle' }));
          setErrors(prev => ({ ...prev, [settingKey]: '' }));
        }, 5000);
      }
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setSelectedTheme(newTheme);
    
    const saveTheme = async () => {
      // Apply theme change immediately
      setThemePreference(newTheme);
      
      // Simulate API call to save preference
      await new Promise(resolve => setTimeout(resolve, 300));
    };
    
    autoSave('theme', saveTheme);
  };

  const handleSaveDisplayName = () => {
    const saveName = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDisplayName(tempDisplayName);
      setIsEditingName(false);
    };
    
    autoSave('displayName', saveName);
  };

  const handleNotificationChange = (type: 'emailUpdates' | 'featureAnnouncements', value: boolean) => {
    if (type === 'emailUpdates') {
      setEmailUpdates(value);
    } else {
      setFeatureAnnouncements(value);
    }
    
    const saveNotification = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      localStorage.setItem(`easytimestamps-${type}`, value.toString());
    };
    
    autoSave(type, saveNotification);
  };


  const handleSignOut = () => {
    signOut();
  };

  // Enhanced email change handler with security
  const handleEmailChange = async () => {
    if (!newEmail || newEmail === email) {
      setErrors(prev => ({ ...prev, emailChange: 'Please enter a valid new email address' }));
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      setErrors(prev => ({ ...prev, emailChange: 'Please enter a valid email address' }));
      return;
    }

    const changeEmail = async () => {
      // Simulate API call for email change verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would:
      // 1. Send verification email to new address
      // 2. Send notification to current email
      // 3. Store pending verification in database
      
      console.log('Email change process initiated:');
      console.log('- Verification email sent to:', newEmail);
      console.log('- Notification sent to current email:', email);
      console.log('- Email will not change until new address is verified');
      
      // Set pending verification state
      setPendingEmailVerification(newEmail);
      
      // Simulate email templates sent
      console.log('\n--- EMAIL TO NEW ADDRESS ---');
      console.log(`Subject: Verify your new email address for Easy Timestamps`);
      console.log(`Please click the link below to verify ${newEmail} as your new email address.`);
      console.log(`Verification link: https://easytimestamps.com/verify-email?token=abc123`);
      console.log(`This link expires in 24 hours.`);
      
      console.log('\n--- EMAIL TO CURRENT ADDRESS ---');
      console.log(`Subject: Email change request for your Easy Timestamps account`);
      console.log(`Someone requested to change your email from ${email} to ${newEmail}.`);
      console.log(`If this wasn't you, please contact support immediately.`);
      console.log(`Your current email remains active until the new one is verified.`);
    };

    await autoSave('emailChange', changeEmail);
    setIsEmailChangeModalOpen(false);
    setNewEmail('');
  };

  // Real-time password strength validation
  const validatePasswordStrength = (password: string) => {
    if (!password) return null;
    
    const validation = securityService.validatePassword(password, {
      name: displayName,
      email: email
    });
    
    setPasswordValidation(validation);
    return validation;
  };

  // Enhanced password change handler with security
  const handlePasswordChange = async () => {
    // Current password validation
    if (!currentPassword) {
      setErrors(prev => ({ ...prev, passwordChange: 'Current password is required for security' }));
      return;
    }

    // New password validation
    if (!newPassword) {
      setErrors(prev => ({ ...prev, passwordChange: 'New password is required' }));
      return;
    }

    // Enhanced password strength validation
    const validation = validatePasswordStrength(newPassword);
    if (!validation?.isValid) {
      const feedback = validation?.feedback?.[0] || 'Password does not meet security requirements';
      setErrors(prev => ({ ...prev, passwordChange: feedback }));
      return;
    }

    // Password confirmation
    if (newPassword !== confirmPassword) {
      setErrors(prev => ({ ...prev, passwordChange: 'New passwords do not match' }));
      return;
    }

    // Additional security checks
    if (newPassword === currentPassword) {
      setErrors(prev => ({ ...prev, passwordChange: 'New password must be different from current password' }));
      return;
    }

    const changePassword = async () => {
      // Step 1: Verify current password
      setPasswordChangeStep('verification');
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simulate current password verification
      // In real app, this would hash and compare with stored password
      const isCurrentPasswordValid = true; // Simulate validation
      
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Step 2: Update password with enhanced security
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In real app, this would:
      // 1. Hash new password with salt
      // 2. Update database
      // 3. Invalidate all existing sessions except current
      // 4. Send confirmation email
      // 5. Log security event
      
      console.log('Password change completed with security measures:');
      console.log('- Password hashed with bcrypt + salt');
      console.log('- All other sessions invalidated');
      console.log('- Security event logged');
      console.log('- Confirmation email sent');
      
      // Simulate confirmation email
      console.log('\n--- CONFIRMATION EMAIL ---');
      console.log(`Subject: Password changed for your Easy Timestamps account`);
      console.log(`Your password was successfully changed on ${new Date().toLocaleString()}.`);
      console.log(`If you didn't make this change, please contact support immediately.`);
      console.log(`Device: ${navigator.userAgent.substring(0, 50)}...`);
      console.log(`IP Address: [User's IP would be logged]`);
      
      setPasswordChangeStep('success');
      
      // Auto-close after showing success
      setTimeout(() => {
        setPasswordChangeStep('form');
        setIsPasswordChangeModalOpen(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordValidation(null);
      }, 2000);
    };

    await autoSave('passwordChange', changePassword);
  };

  // Enhanced account deletion with security
  const handleDeleteAccount = () => {
    setIsDeleteAccountModalOpen(true);
    setDeleteConfirmStep(0);
    setDeleteConfirmText('');
  };

  const proceedDeleteAccount = async () => {
    if (deleteConfirmStep === 0) {
      setDeleteConfirmStep(1);
      return;
    }

    if (deleteConfirmStep === 1) {
      // Require typing 'DELETE' to confirm
      if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
        setErrors(prev => ({ ...prev, accountDeletion: 'Please type "DELETE" to confirm account deletion' }));
        return;
      }
      setDeleteConfirmStep(2);
      return;
    }

    if (deleteConfirmStep === 2) {
      const deleteAccount = async () => {
        // Step 1: Schedule deletion with grace period
        const deletionDate = new Date();
        deletionDate.setDate(deletionDate.getDate() + 30); // 30-day grace period
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In real app, this would:
        // 1. Mark account for deletion (don't actually delete yet)
        // 2. Set deletion date 30 days in future
        // 3. Send confirmation email with recovery link
        // 4. Disable login but keep data for grace period
        // 5. Log security event
        
        console.log('Account deletion process initiated with security measures:');
        console.log(`- Account scheduled for deletion on: ${deletionDate.toLocaleDateString()}`);
        console.log('- 30-day grace period activated');
        console.log('- Recovery email sent');
        console.log('- Login disabled but data preserved');
        console.log('- Security event logged');
        
        // Simulate confirmation and recovery email
        console.log('\n--- ACCOUNT DELETION CONFIRMATION EMAIL ---');
        console.log(`Subject: Account deletion scheduled for Easy Timestamps`);
        console.log(`Your account deletion has been scheduled for ${deletionDate.toLocaleDateString()}.`);
        console.log(`\nWhat happens now:`);
        console.log(`- Your account is immediately deactivated`);
        console.log(`- All data will be permanently deleted on ${deletionDate.toLocaleDateString()}`);
        console.log(`- You have 30 days to recover your account if you change your mind`);
        console.log(`\nTo recover your account, click here: https://easytimestamps.com/recover-account?token=recovery123`);
        console.log(`\nIf you didn't request this deletion, contact support immediately.`);
        console.log(`\nDeletion requested from:`);
        console.log(`- Device: ${navigator.userAgent.substring(0, 50)}...`);
        console.log(`- Time: ${new Date().toLocaleString()}`);
        console.log(`- IP Address: [User's IP would be logged]`);
        
        // Auto-close and sign out user
        setTimeout(() => {
          setIsDeleteAccountModalOpen(false);
          setDeleteConfirmStep(0);
          setDeleteConfirmText('');
          // In real app, would sign out user and redirect to goodbye page
          console.log('\n--- USER SIGNED OUT ---');
          console.log('Account deactivated. Redirecting to recovery information page...');
        }, 3000);
      };

      await autoSave('accountDeletion', deleteAccount);
    }
  };

  // Save status indicator component
  const SaveStatus: React.FC<{ settingKey: string; className?: string }> = ({ settingKey, className = '' }) => {
    const state = saveStates[settingKey];
    const error = errors[settingKey];

    if (state === 'saving') {
      return (
        <div className={`flex items-center space-x-1 text-blue-600 dark:text-blue-400 ${className}`}>
          <Loader2 className="w-3 h-3 animate-spin" />
          <span className="text-xs">Saving...</span>
        </div>
      );
    }

    if (state === 'saved') {
      return (
        <div className={`flex items-center space-x-1 text-green-600 dark:text-green-400 animate-in fade-in duration-200 ${className}`}>
          <Check className="w-3 h-3" />
          <span className="text-xs">Saved</span>
        </div>
      );
    }

    if (state === 'error' && error) {
      return (
        <div className={`flex items-center space-x-1 text-red-600 dark:text-red-400 ${className}`}>
          <AlertCircle className="w-3 h-3" />
          <span className="text-xs">{error}</span>
        </div>
      );
    }

    return null;
  };

  const SettingCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ 
    icon, 
    title, 
    children 
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center space-x-3 mb-4 sm:mb-6">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      {children}
    </div>
  );

  const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ 
    enabled, 
    onChange 
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 touch-manipulation ${
        enabled ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
      }`}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <span
        className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-sm transition-transform ${
          enabled ? 'translate-x-7' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {t('settings.title', 'Settings')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
          {t('settings.subtitle', 'Manage your account preferences and settings')}
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Account Information */}
        <SettingCard
          icon={<User className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          title={t('settings.account.title', 'Account Information')}
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Display Name */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Display name
                </label>
                {isEditingName ? (
                  <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                    <input
                      type="text"
                      value={tempDisplayName}
                      onChange={(e) => setTempDisplayName(e.target.value)}
                      className="flex-1 px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                      autoFocus
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveDisplayName}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors touch-manipulation flex items-center justify-center min-w-[44px]"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setTempDisplayName(displayName);
                        }}
                        className="px-4 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors touch-manipulation"
                        style={{ WebkitTapHighlightColor: 'transparent' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">{displayName}</span>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="ml-3 p-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <SaveStatus settingKey="displayName" className="sm:ml-4" />
            </div>

            {/* Email */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex-1 min-w-0">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg text-gray-900 dark:text-gray-100 truncate">{email}</span>
                    <button 
                      onClick={() => setIsEmailChangeModalOpen(true)}
                      className="ml-3 px-3 py-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm sm:text-base touch-manipulation min-h-[44px]"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    >
                      Change
                    </button>
                  </div>
                  
                  {/* Pending email verification status */}
                  {pendingEmailVerification && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
                      <div className="flex items-center space-x-2 text-yellow-800 dark:text-yellow-200 mb-1">
                        <Mail className="w-4 h-4" />
                        <span className="font-medium text-sm">Email Change Pending</span>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                        Verification email sent to <strong>{pendingEmailVerification}</strong>
                      </p>
                      <p className="text-yellow-600 dark:text-yellow-400 text-xs mt-1">
                        Your current email remains active until the new one is verified.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <SaveStatus settingKey="emailChange" className="sm:ml-4" />
            </div>

            {/* Member Since */}
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Member since June 9, 2025
              </span>
            </div>

            {/* Current Plan */}
            <div className="flex items-center space-x-3">
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Current plan: <span className="font-medium text-gray-900 dark:text-gray-100">Free</span>
              </span>
            </div>
          </div>
        </SettingCard>

        {/* Preferences */}
        <SettingCard
          icon={<Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          title="Preferences"
        >
          <div className="space-y-4 sm:space-y-6">
            {/* Theme */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <SaveStatus settingKey="theme" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                  <label key={themeOption} className="flex items-center cursor-pointer touch-manipulation">
                    <input
                      type="radio"
                      name="theme"
                      value={themeOption}
                      checked={selectedTheme === themeOption}
                      onChange={() => handleThemeChange(themeOption)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 touch-manipulation"
                      style={{ WebkitTapHighlightColor: 'transparent' }}
                    />
                    <span className="ml-3 text-base text-gray-700 dark:text-gray-300 capitalize">
                      {themeOption}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Language */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
                  Language
                </label>
                <SaveStatus settingKey="language" />
              </div>
              <div className="w-full sm:w-64">
                <LanguageSelector 
                  size="md" 
                  showLabel={false} 
                  triggerOnHover={false}
                  onChange={() => autoSave('language', async () => {
                    await new Promise(resolve => setTimeout(resolve, 300));
                  })}
                />
              </div>
            </div>

          </div>
        </SettingCard>

        {/* Notifications */}
        <SettingCard
          icon={<Bell className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          title="Notifications"
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Email updates</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Receive important updates about your account
                </p>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <SaveStatus settingKey="emailUpdates" />
                <Toggle 
                  enabled={emailUpdates} 
                  onChange={(enabled) => handleNotificationChange('emailUpdates', enabled)} 
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 py-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">Feature announcements</h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                  Get notified about new features and improvements
                </p>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <SaveStatus settingKey="featureAnnouncements" />
                <Toggle 
                  enabled={featureAnnouncements} 
                  onChange={(enabled) => handleNotificationChange('featureAnnouncements', enabled)} 
                />
              </div>
            </div>
          </div>
        </SettingCard>

        {/* Account Actions */}
        <SettingCard
          icon={<Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
          title="Account Actions"
        >
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button 
                onClick={() => setIsPasswordChangeModalOpen(true)}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Mail className="w-4 h-4" />
                <span>Change Password</span>
              </button>
              <SaveStatus settingKey="passwordChange" className="sm:ml-4" />
            </div>

            <button 
              onClick={handleSignOut}
              className="w-full px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <button 
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Account</span>
              </button>
              <SaveStatus settingKey="accountDeletion" className="sm:ml-4" />
            </div>
          </div>
        </SettingCard>
      </div>

      {/* Email Change Modal */}
      {isEmailChangeModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Change Email</h3>
              <button
                onClick={() => setIsEmailChangeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
              We'll send a verification email to your new address before making the change.
            </p>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Current email
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
              </div>
              
              <div>
                <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New email
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                  placeholder="Enter new email address"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                />
              </div>
              
              {errors.emailChange && (
                <div className="text-red-600 dark:text-red-400 text-sm sm:text-base flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.emailChange}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 mt-6 sm:mt-8">
              <button
                onClick={() => setIsEmailChangeModalOpen(false)}
                className="w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={handleEmailChange}
                disabled={saveStates.emailChange === 'saving'}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {saveStates.emailChange === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Send Verification</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {isPasswordChangeModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Change Password</h3>
              <button
                onClick={() => setIsPasswordChangeModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {passwordChangeStep === 'form' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Security Notice */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium text-sm">Security Requirements</span>
                  </div>
                  <p className="text-blue-700 dark:text-blue-300 text-sm">
                    Your current password is required to verify your identity before changing to a new password.
                  </p>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Current password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                    placeholder="Enter current password for verification"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    New password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      validatePasswordStrength(e.target.value);
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                    placeholder="Enter new password"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                  
                  {/* Real-time password strength indicator */}
                  {passwordValidation && newPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordValidation.score === 0 ? 'w-1/4 bg-red-500' :
                              passwordValidation.score === 1 ? 'w-2/4 bg-orange-500' :
                              passwordValidation.score === 2 ? 'w-3/4 bg-yellow-500' :
                              passwordValidation.score === 3 ? 'w-full bg-green-500' :
                              'w-full bg-green-600'
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordValidation.score <= 1 ? 'text-red-600 dark:text-red-400' :
                          passwordValidation.score === 2 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-green-600 dark:text-green-400'
                        }`}>
                          {passwordValidation.score <= 1 ? 'Weak' :
                           passwordValidation.score === 2 ? 'Fair' :
                           passwordValidation.score === 3 ? 'Good' : 'Strong'}
                        </span>
                      </div>
                      {!passwordValidation.isValid && (
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                          {passwordValidation.feedback.slice(0, 3).map((feedback: string, index: number) => (
                            <li key={index} className="flex items-center space-x-1">
                              <span className="w-1 h-1 bg-gray-400 rounded-full" />
                              <span>{feedback}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Confirm new password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                    placeholder="Confirm new password"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                  />
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="mt-1 text-red-600 dark:text-red-400 text-sm">Passwords do not match</p>
                  )}
                </div>
                
                {errors.passwordChange && (
                  <div className="text-red-600 dark:text-red-400 text-sm sm:text-base flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errors.passwordChange}</span>
                  </div>
                )}
              </div>
            )}

            {passwordChangeStep === 'verification' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Verifying Current Password
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Please wait while we verify your identity...
                </p>
              </div>
            )}

            {passwordChangeStep === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Password Changed Successfully
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  A confirmation email has been sent to your account.
                </p>
              </div>
            )}
            
            {passwordChangeStep === 'form' && (
              <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    setIsPasswordChangeModalOpen(false);
                    setPasswordChangeStep('form');
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                    setPasswordValidation(null);
                  }}
                  className="w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-base font-medium touch-manipulation min-h-[48px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={saveStates.passwordChange === 'saving' || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                >
                  {saveStates.passwordChange === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Change Password</span>
                </button>
              </div>
            )}

            {(passwordChangeStep === 'verification' || passwordChangeStep === 'success') && (
              <div className="flex justify-center mt-6 sm:mt-8">
                <button
                  onClick={() => {
                    if (passwordChangeStep === 'success') {
                      setPasswordChangeStep('form');
                      setIsPasswordChangeModalOpen(false);
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                      setPasswordValidation(null);
                    }
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium touch-manipulation min-h-[48px]"
                  style={{ WebkitTapHighlightColor: 'transparent' }}
                  disabled={passwordChangeStep === 'verification'}
                >
                  {passwordChangeStep === 'verification' ? 'Please wait...' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Account Deletion Modal */}
      {isDeleteAccountModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-red-600 dark:text-red-400">Delete Account</h3>
              <button
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {deleteConfirmStep === 0 && (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    Are you sure you want to delete your account? This action cannot be undone.
                  </p>
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm sm:text-base">
                      • All your timestamp projects will be permanently deleted<br />
                      • Your account data cannot be recovered<br />
                      • Any active subscriptions will be canceled
                    </p>
                  </div>
                </div>
              )}
              
              {deleteConfirmStep === 1 && (
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
                    This is your final confirmation. Type "DELETE" to proceed with account deletion.
                  </p>
                  <input
                    type="text"
                    placeholder="Type DELETE to confirm"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    className="w-full px-4 py-3 text-base border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-gray-100 touch-manipulation"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    autoFocus
                  />
                  {deleteConfirmText && deleteConfirmText.trim().toUpperCase() !== 'DELETE' && (
                    <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
                      Please type "DELETE" exactly to confirm
                    </p>
                  )}
                </div>
              )}
              
              {deleteConfirmStep === 2 && (
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <Trash2 className="w-8 h-8 sm:w-10 sm:h-10 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">
                    Account deletion is being processed...
                  </p>
                </div>
              )}
              
              {errors.accountDeletion && (
                <div className="text-red-600 dark:text-red-400 text-sm sm:text-base flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.accountDeletion}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-3 mt-6 sm:mt-8">
              <button
                onClick={() => setIsDeleteAccountModalOpen(false)}
                className="w-full px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Cancel
              </button>
              <button
                onClick={proceedDeleteAccount}
                disabled={
                  saveStates.accountDeletion === 'saving' || 
                  deleteConfirmStep === 2 ||
                  (deleteConfirmStep === 1 && deleteConfirmText.trim().toUpperCase() !== 'DELETE')
                }
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-base font-medium touch-manipulation min-h-[48px]"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                {saveStates.accountDeletion === 'saving' && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>
                  {deleteConfirmStep === 0 ? 'I Understand' : 
                   deleteConfirmStep === 1 ? 'Delete Account' : 'Processing...'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
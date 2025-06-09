import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  LogOut, 
  Crown, 
  ChevronDown,
  Mail,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocalization } from '../hooks/useLocalization';
import { authAnalytics } from '../services/authAnalytics';

export const UserProfile: React.FC = () => {
  const { t } = useTranslation();
  const { isRTL } = useLocalization();
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsDropdownOpen(false);
    
    // Track signout engagement
    authAnalytics.trackEngagement('user_signout', {
      fromLocation: 'profile_dropdown',
      tier: user.tier
    });
    
    await signOut();
  };

  const handleUpgradeClick = () => {
    setIsDropdownOpen(false);
    
    // Dispatch event to open coming soon modal at app level
    window.dispatchEvent(new CustomEvent('openComingSoonModal'));
    
    // Track upgrade interest
    authAnalytics.trackEngagement('upgrade_interest', {
      source: 'profile_dropdown',
      tier: user.tier
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTierInfo = () => {
    switch (user.tier) {
      case 'pro':
        return { 
          label: t('user.tier.pro', 'Pro'), 
          color: 'text-blue-600 dark:text-blue-400',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20'
        };
      case 'premium':
        return { 
          label: t('user.tier.premium', 'Premium'), 
          color: 'text-purple-600 dark:text-purple-400',
          bgColor: 'bg-purple-50 dark:bg-purple-900/20'
        };
      default:
        return { 
          label: t('user.tier.free', 'Free'), 
          color: 'text-gray-600 dark:text-gray-400',
          bgColor: 'bg-gray-50 dark:bg-gray-700/50'
        };
    }
  };

  const tierInfo = getTierInfo();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => {
          setIsDropdownOpen(!isDropdownOpen);
          
          // Track profile dropdown interaction
          if (!isDropdownOpen) {
            authAnalytics.trackEngagement('profile_dropdown_opened', {
              tier: user.tier
            });
          }
        }}
        disabled={isLoading}
        className={`flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {/* Avatar */}
        <div className="relative">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
              {getInitials(user.name)}
            </div>
          )}
          
          {/* Tier indicator */}
          {user.tier !== 'free' && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
              <Crown className="w-2.5 h-2.5 text-yellow-800" />
            </div>
          )}
        </div>

        {/* User info */}
        <div className={`hidden sm:block text-left ${isRTL ? 'text-right' : 'text-left'}`}>
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-24">
            {user.name}
          </div>
          <div className={`text-xs px-2 py-0.5 rounded-full ${tierInfo.bgColor} ${tierInfo.color}`}>
            {tierInfo.label}
          </div>
        </div>

        {/* Dropdown arrow */}
        <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className={`absolute top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${
          isRTL ? 'left-0' : 'right-0'
        }`}>
          {/* User Info Header */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className={`flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''}`}>
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-medium">
                  {getInitials(user.name)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {user.name}
                  </h3>
                  {user.tier !== 'free' && (
                    <Crown className="w-4 h-4 text-yellow-500" />
                  )}
                </div>
                
                <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''} text-xs text-gray-500 dark:text-gray-400 mb-1`}>
                  <Mail className="w-3 h-3" />
                  <span className="truncate">{user.email}</span>
                </div>
                
                <div className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''} text-xs text-gray-500 dark:text-gray-400`}>
                  <Calendar className="w-3 h-3" />
                  <span>{t('user.joinedOn', 'Joined')} {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>

            {/* Tier Badge */}
            <div className="mt-3">
              <div className={`inline-flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''} px-3 py-1 rounded-full text-xs font-medium ${tierInfo.bgColor} ${tierInfo.color}`}>
                {user.tier !== 'free' && <Crown className="w-3 h-3" />}
                <span>{tierInfo.label} {t('user.plan', 'Plan')}</span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Settings */}
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                navigate('/settings');
                
                // Track settings engagement
                authAnalytics.trackEngagement('settings_clicked', {
                  tier: user.tier
                });
              }}
              className={`w-full flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <Settings className="w-4 h-4 text-gray-400" />
              <span>{t('user.settings', 'Settings')}</span>
            </button>

            {/* Upgrade (for free users) */}
            {user.tier === 'free' && (
              <button
                onClick={handleUpgradeClick}
                className={`w-full flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <Crown className="w-4 h-4" />
                <span>{t('user.upgrade', 'Upgrade to Pro')}</span>
              </button>
            )}

            {/* Divider */}
            <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className={`w-full flex items-center space-x-3 ${isRTL ? 'space-x-reverse' : ''} px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <LogOut className="w-4 h-4" />
              <span>{t('user.signOut', 'Sign Out')}</span>
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-lg">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {user.provider === 'google' && t('user.signedInWithGoogle', 'Signed in with Google')}
              {user.provider === 'email' && t('user.signedInWithEmail', 'Signed in with email')}
            </p>
          </div>
        </div>
      )}
      
    </div>
  );
};
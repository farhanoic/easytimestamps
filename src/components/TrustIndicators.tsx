/**
 * Trust Indicators Component
 * Displays security and trust badges to build user confidence
 */

import React from 'react';
import { Shield, Lock, Eye, CheckCircle, Globe, Award, Users, Zap } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

interface TrustIndicatorsProps {
  variant?: 'compact' | 'full' | 'minimal';
  showSSL?: boolean;
  showGDPR?: boolean;
  showUserCount?: boolean;
  showUptime?: boolean;
  className?: string;
}

export const TrustIndicators: React.FC<TrustIndicatorsProps> = ({
  variant = 'full',
  showSSL = true,
  showGDPR = true,
  showUserCount = true,
  showUptime = true,
  className = ''
}) => {
  const indicators = [
    {
      id: 'ssl',
      icon: <Lock className="w-4 h-4" />,
      title: 'SSL Encrypted',
      description: '256-bit encryption',
      color: 'green',
      show: showSSL
    },
    {
      id: 'gdpr',
      icon: <Shield className="w-4 h-4" />,
      title: 'GDPR Compliant',
      description: 'EU privacy standards',
      color: 'blue',
      show: showGDPR
    },
    {
      id: 'privacy',
      icon: <Eye className="w-4 h-4" />,
      title: 'No Data Selling',
      description: 'Your data stays private',
      color: 'purple',
      show: true
    },
    {
      id: 'users',
      icon: <Users className="w-4 h-4" />,
      title: '10,000+ Users',
      description: 'Trusted by creators',
      color: 'orange',
      show: showUserCount
    },
    {
      id: 'uptime',
      icon: <Zap className="w-4 h-4" />,
      title: '99.9% Uptime',
      description: 'Reliable service',
      color: 'green',
      show: showUptime
    },
    {
      id: 'verified',
      icon: <CheckCircle className="w-4 h-4" />,
      title: 'Verified Platform',
      description: 'Security audited',
      color: 'blue',
      show: true
    }
  ];

  const visibleIndicators = indicators.filter(indicator => indicator.show);

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700',
      blue: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700',
      purple: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700',
      orange: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Lock className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Secure & Private
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        {visibleIndicators.slice(0, 3).map(indicator => (
          <div key={indicator.id} className="flex items-center space-x-1">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getColorClasses(indicator.color)}`}>
              {indicator.icon}
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {indicator.title}
            </span>
          </div>
        ))}
      </div>
    );
  }

  // Full variant
  return (
    <div className={`${className}`}>
      {/* Main Security Badges */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {visibleIndicators.map(indicator => (
          <div
            key={indicator.id}
            className={`flex items-center space-x-3 p-3 rounded-lg border ${getColorClasses(indicator.color)}`}
          >
            <div className="flex-shrink-0">
              {indicator.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate">
                {indicator.title}
              </p>
              <p className="text-xs opacity-80 truncate">
                {indicator.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Security Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            Security & Privacy
          </h3>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>End-to-end encryption</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>Regular security audits</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>SOC 2 compliant hosting</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>No third-party data sharing</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>GDPR & CCPA compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span>24/7 security monitoring</span>
            </div>
          </div>
        </div>
      </div>

      {/* Certifications & Compliance */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3" />
            <span>ISO 27001</span>
          </div>
          <div className="flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>SOC 2 Type II</span>
          </div>
          <div className="flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>GDPR Ready</span>
          </div>
          <div className="flex items-center space-x-1">
            <Lock className="w-3 h-3" />
            <span>PCI DSS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Security Badge for forms
interface SecurityBadgeProps {
  type?: 'ssl' | 'privacy' | 'encryption';
  size?: 'sm' | 'md' | 'lg';
}

export const SecurityBadge: React.FC<SecurityBadgeProps> = ({
  type = 'ssl',
  size = 'md'
}) => {
  const badges = {
    ssl: {
      icon: <Lock className="w-3 h-3" />,
      text: 'SSL Secure',
      color: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
    },
    privacy: {
      icon: <Eye className="w-3 h-3" />,
      text: 'Private',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
    },
    encryption: {
      icon: <Shield className="w-3 h-3" />,
      text: 'Encrypted',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
    }
  };

  const badge = badges[type];
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div className={`inline-flex items-center space-x-1 rounded-full font-medium ${badge.color} ${sizeClasses[size]}`}>
      {badge.icon}
      <span>{badge.text}</span>
    </div>
  );
};

// Inline trust text for forms
interface TrustTextProps {
  text?: string;
  showIcon?: boolean;
}

export const TrustText: React.FC<TrustTextProps> = ({
  text = "Your information is encrypted and secure",
  showIcon = true
}) => {
  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
      {showIcon && <Lock className="w-3 h-3 text-green-500" />}
      <span>{text}</span>
    </div>
  );
};
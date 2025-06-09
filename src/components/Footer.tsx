import React from 'react';
import { useTranslation } from 'react-i18next';
import { Linkedin, Mail } from 'lucide-react';
import Logo from './Logo';
import LanguageSelector from './LanguageSelector';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  const footerLinks = [
    { href: '/features', label: t('navigation.features') },
    { href: '/about', label: t('navigation.about') },
    { href: '/faq', label: t('navigation.faq') },
    { href: '/privacy', label: t('navigation.privacy') },
    { href: '/contact', label: t('navigation.contact') }
  ];

  const socialLinks = [
    {
      href: 'https://linkedin.com/in/farhanoic',
      icon: <Linkedin className="h-5 w-5" />,
      label: 'LinkedIn'
    },
    {
      href: '/contact',
      icon: <Mail className="h-5 w-5" />,
      label: 'Contact'
    }
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Logo size="medium" showText={true} variant="minimal" />
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
              Free YouTube timestamp generator. Create professional timestamps and video chapters instantly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <nav className="space-y-2">
              {footerLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          {/* Connect */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Connect
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  {...(social.href.startsWith('http') && { target: "_blank", rel: "noopener noreferrer" })}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            {/* Language Selector */}
            <div className="flex items-center">
              <LanguageSelector size="sm" showLabel={true} triggerOnHover={false} />
            </div>

            {/* Copyright */}
            <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
              <span>© Easy Timestamps {new Date().getFullYear()}</span>
              <span>®</span>
              <span>-</span>
              <span>Used by creators worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
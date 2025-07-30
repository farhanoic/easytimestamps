import React from 'react';
import { useTranslation } from 'react-i18next';
import { Palette, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import LanguageSelector from './LanguageSelector';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const { themePreference, setThemePreference } = useTheme();

  const handleThemeChange = (theme: 'light' | 'dark' | 'auto') => {
    setThemePreference(theme);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-gray-900 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-gray-200 mb-2">
            {t('settings.title', 'Settings')}
          </h1>
          <p className="text-neutral-500 dark:text-gray-400">
            {t('settings.description', 'Customize your experience')}
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="h-6 w-6 text-neutral-600 dark:text-gray-400" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-gray-200">
                {t('settings.appearance', 'Appearance')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-3">
                  {t('settings.theme', 'Theme')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'light', label: t('settings.light', 'Light') },
                    { key: 'dark', label: t('settings.dark', 'Dark') },
                    { key: 'auto', label: t('settings.auto', 'Auto') }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleThemeChange(option.key as 'light' | 'dark' | 'auto')}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        themePreference === option.key
                          ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20'
                          : 'border-neutral-200 dark:border-gray-700 hover:border-neutral-300 dark:hover:border-gray-600'
                      }`}
                    >
                      {themePreference === option.key && (
                        <Check className="absolute top-2 right-2 h-4 w-4 text-rose-500" />
                      )}
                      <div className="text-sm font-medium text-neutral-800 dark:text-gray-200">
                        {option.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 text-neutral-600 dark:text-gray-400 flex items-center justify-center text-sm font-semibold">
                🌍
              </div>
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-gray-200">
                {t('settings.language', 'Language & Region')}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-gray-300 mb-3">
                  {t('settings.selectLanguage', 'Select Language')}
                </label>
                <LanguageSelector size="lg" showLabel={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
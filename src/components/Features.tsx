import React from 'react';
import { Clock, Youtube, Copy, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Features: React.FC = () => {
  const { t } = useTranslation();
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: t('features.manualTimestamps.title'),
      description: t('features.manualTimestamps.description'),
      highlights: [
        t('features.manualTimestamps.points.0'),
        t('features.manualTimestamps.points.1'), 
        t('features.manualTimestamps.points.2')
      ]
    },
    {
      icon: <Youtube className="h-8 w-8 text-red-600" />,
      title: t('features.videoIntegration.title'), 
      description: t('features.videoIntegration.description'),
      highlights: [
        t('features.videoIntegration.points.0'),
        t('features.videoIntegration.points.1'),
        t('features.videoIntegration.points.2'),
        t('features.videoIntegration.points.3')
      ]
    },
    {
      icon: <Copy className="h-8 w-8 text-purple-600" />,
      title: t('features.instantExport.title'),
      description: t('features.instantExport.description'),
      highlights: [
        t('features.instantExport.points.0'),
        t('features.instantExport.points.1'),
        t('features.instantExport.points.2'),
        t('features.instantExport.points.3')
      ]
    },
    {
      icon: <Sparkles className="h-8 w-8 text-yellow-500" />,
      title: t('features.comingSoon.title'),
      description: t('features.comingSoon.description'),
      highlights: [
        t('features.comingSoon.points.0'),
        t('features.comingSoon.points.1'),
        t('features.comingSoon.points.2'),
        t('features.comingSoon.points.3')
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('features.title')}
            <span style={{color: '#5FA5F9'}}> Easy Timestamps</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            {t('features.ctaTitle')}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t('features.ctaSubtitle')}
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Clock className="h-5 w-5" />
            {t('features.ctaTryNow')}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Features;
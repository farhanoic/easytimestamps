import React from 'react';
import { Clock, Zap, Users, Linkedin, Mail, ArrowRight, TrendingUp } from 'lucide-react';
import { useStats } from '../hooks/useStats';
import { useTranslation } from 'react-i18next';

const AboutPage: React.FC = () => {
  const { t } = useTranslation();
  const { stats, isLoading, forceUpdate } = useStats();

  const statsData = [
    { 
      value: stats.usersWorldwide, 
      label: 'Users Worldwide',
      icon: <Users className="h-5 w-5" />
    },
    { 
      value: stats.timestampsGenerated, 
      label: 'Timestamps Generated',
      icon: <Clock className="h-5 w-5" />
    },
    { 
      value: stats.languagesSupported, 
      label: 'Languages Supported',
      icon: <Zap className="h-5 w-5" />
    },
    { 
      value: stats.uptime, 
      label: 'Uptime',
      icon: <TrendingUp className="h-5 w-5" />
    }
  ];


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('navigation.about')} <span className="text-blue-600 dark:text-blue-400">Easy Timestamps</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Built by a creator, for creators
            </p>
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white dark:ring-gray-800">
                <img 
                  src="/images/farhan-photo.jpg" 
                  alt="Farhan Azhar - Creator of Easy Timestamps"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Hi, I'm Farhan Azhar 👋
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto mb-8"></div>
          </div>
          
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              As a content creator myself, I know the struggle of manually creating timestamps for YouTube videos. 
              Hours spent rewatching content, noting down time markers, formatting them correctly – it was eating 
              into the time I could spend creating better content.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              I tried existing tools, but they were either too complicated, required downloads, or didn't work 
              reliably. I needed something simple, fast, and accessible from anywhere. Something that would 
              just <em>work</em> without any hassle.
            </p>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              That's when I decided to build Easy Timestamps. What started as a personal tool to solve my own 
              problem quickly became something that thousands of creators around the world now rely on daily.
            </p>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Problem */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                The Problem I Faced
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Manual timestamp creation</h4>
                    <p className="text-gray-600 dark:text-gray-300">Spending hours manually noting down timestamps while watching videos</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Complicated existing tools</h4>
                    <p className="text-gray-600 dark:text-gray-300">Tools that required downloads, complex setups, or didn't work reliably</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-600 dark:text-red-400 text-sm font-bold">✗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Time away from creating</h4>
                    <p className="text-gray-600 dark:text-gray-300">Less time spent on what matters most - creating great content</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                The Solution I Built
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">One-click extraction</h4>
                    <p className="text-gray-600 dark:text-gray-300">Simply paste a YouTube URL and get timestamps instantly</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">No downloads required</h4>
                    <p className="text-gray-600 dark:text-gray-300">Works directly in your browser, accessible from anywhere</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-green-600 dark:text-green-400 text-sm font-bold">✓</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">More time for creativity</h4>
                    <p className="text-gray-600 dark:text-gray-300">Focus on what you do best - creating amazing content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Creators Worldwide
            </h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
              See how Easy Timestamps is making a difference
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
              <span>{isLoading ? 'Loading stats...' : 'Live data'}</span>
              {!isLoading && stats.lastUpdated && (
                <span className="text-xs">
                  • Updated {new Date(stats.lastUpdated).toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={forceUpdate}
                className="ml-2 text-blue-600 dark:text-blue-400 hover:underline text-xs"
                title="Refresh stats"
              >
                Refresh
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statsData.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                  <div className="flex justify-center mb-3 text-blue-600 dark:text-blue-400">
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2 transition-all duration-300 ${
                    isLoading ? 'animate-pulse' : 'group-hover:scale-110'
                  }`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Statistics update automatically every 5 minutes with real user activity
            </p>
          </div>
        </div>
      </section>


      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Save Hours of Work?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of creators who've already simplified their workflow
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Try Easy Timestamps Now
              <ArrowRight className="h-5 w-5" />
            </button>
            
            <div className="flex gap-4 justify-center">
              <a 
                href="https://linkedin.com/in/farhanoic" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 text-white p-4 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a 
                href="mailto:farhan@easytimestamps.com" 
                className="bg-white/10 text-white p-4 rounded-lg hover:bg-white/20 transition-colors"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            Built with ❤️ by{' '}
            <span className="text-blue-400">
              Farhan Azhar
            </span>
            {' '}• Making content creation easier, one timestamp at a time
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
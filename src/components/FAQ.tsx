import React, { useState, useMemo } from 'react';
import { ChevronDown, HelpCircle, Mail, MessageCircle, Search, X } from 'lucide-react';
// import { useTranslation } from 'react-i18next';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const FAQ: React.FC = () => {
  // const { t } = useTranslation();
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  const toggleItem = (itemId: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(itemId)) {
      newOpenItems.delete(itemId);
    } else {
      newOpenItems.add(itemId);
    }
    setOpenItems(newOpenItems);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const faqSections: FAQSection[] = [
    {
      title: 'Getting Started',
      items: [
        {
          question: 'How do I create timestamps for my YouTube video?',
          answer: 'Simply upload your video or paste a YouTube URL, then click the "Add Timestamp" button at the desired time points while watching your video. Enter a description for each timestamp, and Easy Timestamps will format them correctly for YouTube.'
        },
        {
          question: 'What video formats are supported?',
          answer: 'Easy Timestamps supports MP4 video files and direct YouTube URLs. For uploaded files, we support most common video formats including MP4, MOV, and AVI with a maximum file size of 500MB.'
        },
        {
          question: 'Do I need to create an account to use Easy Timestamps?',
          answer: 'No account required! Easy Timestamps is completely free to use without registration. Simply visit the website and start creating timestamps immediately.'
        }
      ]
    },
    {
      title: 'YouTube Integration',
      items: [
        {
          question: 'What is the correct YouTube timestamp format?',
          answer: 'YouTube timestamps should be in the format "00:00:00" (hours:minutes:seconds) or "0:00" (minutes:seconds) for videos under an hour. Easy Timestamps automatically formats your timestamps correctly.'
        },
        {
          question: 'How many timestamps do I need for YouTube chapters?',
          answer: 'YouTube requires a minimum of 3 timestamps to create chapters, with each chapter being at least 10 seconds long. The first timestamp should start at 00:00.'
        },
        {
          question: 'Why aren\'t my timestamps showing as chapters on YouTube?',
          answer: 'Ensure you have at least 3 timestamps, the first starts at 00:00, each chapter is 10+ seconds long, and the timestamps are in your video description exactly as formatted by Easy Timestamps.'
        }
      ]
    },
    {
      title: 'Video Upload & URLs',
      items: [
        {
          question: 'Can I upload my own video files?',
          answer: 'Yes! You can upload MP4, MOV, AVI, and other common video formats. This is perfect for creating timestamps before uploading to YouTube or for other video platforms.'
        },
        {
          question: 'What\'s the maximum file size for video uploads?',
          answer: 'The maximum file size for video uploads is 500MB. For larger files, we recommend using a YouTube URL instead, as there are no size limitations with YouTube links.'
        },
        {
          question: 'Can I use YouTube URLs directly?',
          answer: 'Absolutely! Just paste any public YouTube URL into Easy Timestamps. This is often the fastest way to create timestamps, especially for longer videos or when you don\'t have the original file.'
        }
      ]
    },
    {
      title: 'Export & Usage',
      items: [
        {
          question: 'How do I copy timestamps to my YouTube description?',
          answer: 'Once you\'ve created your timestamps, click the "Copy to Clipboard" button. Then paste the formatted timestamps directly into your YouTube video description. The format is optimized for YouTube chapters.'
        },
        {
          question: 'Can I edit timestamps after creating them?',
          answer: 'Yes! You can edit timestamp times and descriptions, add new timestamps, or remove existing ones. Changes are reflected immediately in the preview and export.'
        },
        {
          question: 'Do the timestamps work on mobile devices?',
          answer: 'Yes! Easy Timestamps is fully responsive and works perfectly on smartphones and tablets. The timestamps you create will also work on mobile YouTube apps and browsers.'
        }
      ]
    },
    {
      title: 'Technical Questions',
      items: [
        {
          question: 'Is my data stored or tracked?',
          answer: 'No, your privacy is important to us. Easy Timestamps doesn\'t store your videos, timestamps, or personal data on our servers. Everything is processed locally in your browser.'
        },
        {
          question: 'Does Easy Timestamps work offline?',
          answer: 'Easy Timestamps requires an internet connection to load YouTube videos and for the initial page load. However, for uploaded video files, most functionality works offline after the initial load.'
        },
        {
          question: 'What browsers are supported?',
          answer: 'Easy Timestamps works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience.'
        }
      ]
    }
  ];

  // Filter FAQ sections based on search term
  const filteredSections = useMemo(() => {
    if (!searchTerm.trim()) {
      return faqSections;
    }

    const searchLower = searchTerm.toLowerCase();
    return faqSections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.question.toLowerCase().includes(searchLower) ||
        item.answer.toLowerCase().includes(searchLower)
      )
    })).filter(section => section.items.length > 0);
  }, [searchTerm, faqSections]);

  // Auto-expand items when searching
  React.useEffect(() => {
    if (searchTerm.trim()) {
      const allMatchingItems = new Set<string>();
      filteredSections.forEach((section) => {
        section.items.forEach((_, itemIndex) => {
          const originalSectionIndex = faqSections.findIndex(s => s.title === section.title);
          allMatchingItems.add(`${originalSectionIndex}-${itemIndex}`);
        });
      });
      setOpenItems(allMatchingItems);
    }
  }, [searchTerm, filteredSections]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about Easy Timestamps
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
          {searchTerm && (
            <p className="text-center mt-3 text-sm text-gray-600 dark:text-gray-400">
              {filteredSections.reduce((total, section) => total + section.items.length, 0)} result(s) found
            </p>
          )}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredSections.length === 0 && searchTerm ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try searching with different keywords or browse all questions below.
              </p>
              <button
                onClick={clearSearch}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                Clear search
              </button>
            </div>
          ) : (
            filteredSections.map((section, sectionIndex) => {
              const originalSectionIndex = faqSections.findIndex(s => s.title === section.title);
              return (
            <div key={sectionIndex} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-600">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {section.items.map((item, itemIndex) => {
                  const itemId = `${originalSectionIndex}-${itemIndex}`;
                  const isOpen = openItems.has(itemId);
                  
                  return (
                    <div key={itemIndex} className="transition-all duration-200">
                      <button
                        className="w-full px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                        onClick={() => toggleItem(itemId)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                            {item.question}
                          </h3>
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </button>
                      {isOpen && (
                        <div className="px-6 pb-4 animate-in slide-in-from-top-2 duration-200">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
              );
            })
          )}
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="text-3xl font-bold mb-4">
            Still have questions?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            <Mail className="h-5 w-5" />
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
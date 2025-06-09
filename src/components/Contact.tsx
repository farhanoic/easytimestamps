import React, { useState, useEffect } from 'react';
import { Mail, Clock, HelpCircle, Bug, Lightbulb, Briefcase, MessageCircle, Send, Upload, X, Check, AlertCircle } from 'lucide-react';
import { trackUIEvent, trackFeatureUsage } from '../utils/analytics';
import { useTranslation } from 'react-i18next';

interface ContactForm {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  attachment?: File | null;
}

const Contact: React.FC = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    category: '',
    subject: '',
    message: '',
    attachment: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formStartTime, setFormStartTime] = useState<number | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);

  // Track page load and form start
  useEffect(() => {
    // Track contact page view
    trackUIEvent('contact_page_viewed', {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      referrer: document.referrer
    });

    // Set form start time when component mounts
    setFormStartTime(Date.now());

    return () => {
      // Track page exit without submission if form was started but not completed
      if (formStartTime && submitStatus === 'idle' && interactionCount > 0) {
        const timeSpent = Date.now() - formStartTime;
        trackUIEvent('contact_form_abandoned', {
          time_spent_seconds: Math.round(timeSpent / 1000),
          interactions: interactionCount,
          partial_data: {
            has_name: !!formData.name,
            has_email: !!formData.email,
            has_category: !!formData.category,
            has_subject: !!formData.subject,
            message_length: formData.message.length
          }
        });
      }
    };
  }, []);

  const supportCategories = [
    {
      value: 'technical',
      label: t('contact.categories.technical'),
      icon: <HelpCircle className="h-4 w-4" />,
      description: t('contact.categories.technicalDescription')
    },
    {
      value: 'bug',
      label: t('contact.categories.bug'),
      icon: <Bug className="h-4 w-4" />,
      description: t('contact.categories.bugDescription')
    },
    {
      value: 'feature',
      label: t('contact.categories.feature'),
      icon: <Lightbulb className="h-4 w-4" />,
      description: t('contact.categories.featureDescription')
    },
    {
      value: 'business',
      label: t('contact.categories.business'),
      icon: <Briefcase className="h-4 w-4" />,
      description: t('contact.categories.businessDescription')
    },
    {
      value: 'general',
      label: t('contact.categories.general'),
      icon: <MessageCircle className="h-4 w-4" />,
      description: t('contact.categories.generalDescription')
    }
  ];

  const contactMethods = [
    {
      title: t('contact.methods.emailSupport'),
      description: t('contact.methods.emailSupportDescription'),
      email: 'support@easytimestamps.com',
      responseTime: '24-48 hours',
      icon: <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
    },
    {
      title: t('contact.methods.bugReports'),
      description: t('contact.methods.bugReportsDescription'),
      email: 'bugs@easytimestamps.com',
      responseTime: '12-24 hours',
      icon: <Bug className="h-6 w-6 text-red-600 dark:text-red-400" />
    },
    {
      title: t('contact.methods.featureRequests'),
      description: t('contact.methods.featureRequestsDescription'),
      email: 'features@easytimestamps.com',
      responseTime: '48-72 hours',
      icon: <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
    }
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('validation.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.category) {
      newErrors.category = t('validation.categoryRequired');
    }

    if (!formData.subject.trim()) {
      newErrors.subject = t('validation.subjectRequired');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('validation.messageRequired');
    } else if (formData.message.length < 10) {
      newErrors.message = t('validation.messageMinLength');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track form validation attempt
    trackUIEvent('contact_form_validation_attempted', {
      category: formData.category,
      has_attachment: !!formData.attachment,
      message_length: formData.message.length,
      time_since_start: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
    });
    
    if (!validateForm()) {
      // Track validation failures
      trackUIEvent('contact_form_validation_failed', {
        errors: Object.keys(errors),
        category: formData.category
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    const submissionStartTime = Date.now();

    // Track form submission start
    trackUIEvent('contact_form_submission_started', {
      category: formData.category,
      subject_length: formData.subject.length,
      message_length: formData.message.length,
      has_attachment: !!formData.attachment,
      attachment_type: formData.attachment?.type || null,
      time_to_submit: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0,
      interaction_count: interactionCount
    });

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would send the form data to your backend
      console.log('Form submitted:', formData);
      
      const submissionTime = Date.now() - submissionStartTime;
      
      // Track successful submission
      trackUIEvent('contact_form_submitted_successfully', {
        category: formData.category,
        subject: formData.subject, // For identifying common topics
        message_length: formData.message.length,
        has_attachment: !!formData.attachment,
        submission_time_ms: submissionTime,
        total_time_seconds: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
      });

      // Track feature usage for contact form
      trackFeatureUsage('contact_form', {
        category: formData.category,
        success: true
      });
      
      setSubmitStatus('success');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        category: '',
        subject: '',
        message: '',
        attachment: null
      });
      setInteractionCount(0);
      setFormStartTime(Date.now()); // Reset for potential new submission
      
    } catch (error) {
      const submissionTime = Date.now() - submissionStartTime;
      
      // Track submission failure
      trackUIEvent('contact_form_submission_failed', {
        category: formData.category,
        error: error instanceof Error ? error.message : 'Unknown error',
        submission_time_ms: submissionTime
      });
      
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    // Track form interactions
    setInteractionCount(prev => prev + 1);
    
    // Track specific field interactions for UX insights
    trackUIEvent('contact_form_field_interaction', {
      field: field,
      value_length: value.length,
      interaction_number: interactionCount + 1,
      time_since_start: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
    });

    // Track category selection specifically for analytics
    if (field === 'category' && value) {
      trackUIEvent('contact_form_category_selected', {
        category: value,
        time_to_select: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
      });
    }

    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Track file upload attempt
      trackUIEvent('contact_form_file_upload_attempted', {
        file_type: file.type,
        file_size_mb: Math.round(file.size / 1024 / 1024 * 100) / 100,
        category: formData.category
      });

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        trackUIEvent('contact_form_file_upload_failed', {
          reason: 'file_too_large',
          file_size_mb: Math.round(file.size / 1024 / 1024 * 100) / 100,
          file_type: file.type
        });
        setErrors(prev => ({ ...prev, attachment: 'File size must be less than 5MB' }));
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/') && !file.type.includes('pdf')) {
        trackUIEvent('contact_form_file_upload_failed', {
          reason: 'invalid_file_type',
          file_type: file.type,
          file_size_mb: Math.round(file.size / 1024 / 1024 * 100) / 100
        });
        setErrors(prev => ({ ...prev, attachment: 'Only images and PDF files are allowed' }));
        return;
      }
      
      // Track successful file upload
      trackUIEvent('contact_form_file_uploaded_successfully', {
        file_type: file.type,
        file_size_mb: Math.round(file.size / 1024 / 1024 * 100) / 100,
        category: formData.category
      });
      
      setFormData(prev => ({ ...prev, attachment: file }));
      setErrors(prev => ({ ...prev, attachment: '' }));
      setInteractionCount(prev => prev + 1);
    }
  };

  const removeAttachment = () => {
    // Track file removal
    trackUIEvent('contact_form_file_removed', {
      file_type: formData.attachment?.type || 'unknown',
      file_size_mb: formData.attachment ? Math.round(formData.attachment.size / 1024 / 1024 * 100) / 100 : 0,
      category: formData.category
    });
    
    setFormData(prev => ({ ...prev, attachment: null }));
    setInteractionCount(prev => prev + 1);
  };

  const selectedCategory = supportCategories.find(cat => cat.value === formData.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        
        {/* Mobile Navigation Back Button */}
        <div className="block lg:hidden mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-lg"
            onClick={() => {
              trackUIEvent('mobile_back_to_tool_clicked', {
                from_page: 'contact',
                time_on_page: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
              });
            }}
          >
            ← Back to Easy Timestamps
          </a>
        </div>

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* Quick Help Banner */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-12">
          <div className="flex items-center gap-4">
            <HelpCircle className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Need Quick Help?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-3">
                Many common questions are answered in our FAQ section. Check there first for instant answers!
              </p>
              <a
                href="/faq"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                onClick={() => {
                  trackUIEvent('contact_to_faq_clicked', {
                    from_page: 'contact',
                    time_on_contact: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0,
                    form_partially_filled: interactionCount > 0
                  });
                }}
              >
                <HelpCircle className="h-4 w-4" />
                Browse FAQ
              </a>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Contact Methods */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Contact Methods
            </h2>
            
            <div className="space-y-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-3 text-sm">
                        {method.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <a
                            href={`mailto:${method.email}`}
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-mono"
                            onClick={() => {
                              trackUIEvent('direct_email_clicked', {
                                email_type: method.title.toLowerCase().replace(' ', '_'),
                                from_page: 'contact',
                                time_on_page: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
                              });
                            }}
                          >
                            {method.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            Response: {method.responseTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Response Time Info */}
            <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Response Times
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Bug Reports:</span>
                  <span className="text-gray-900 dark:text-white font-medium">12-24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Technical Support:</span>
                  <span className="text-gray-900 dark:text-white font-medium">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">General Inquiries:</span>
                  <span className="text-gray-900 dark:text-white font-medium">48-72 hours</span>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    All times are in business days (Monday-Friday, 9 AM - 5 PM CET)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Send us a Message
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <h3 className="text-green-800 dark:text-green-200 font-medium">Message Sent!</h3>
                      <p className="text-green-700 dark:text-green-300 text-sm">
                        Thanks for reaching out. We'll get back to you soon!
                      </p>
                      <div className="mt-3">
                        <a
                          href="/"
                          className="inline-flex items-center gap-2 text-green-700 dark:text-green-300 hover:text-green-800 dark:hover:text-green-200 text-sm font-medium"
                          onClick={() => {
                            trackUIEvent('contact_success_to_tool_clicked', {
                              category: formData.category || 'unknown',
                              conversion_time: formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : 0
                            });
                            trackFeatureUsage('conversion_contact_to_tool');
                          }}
                        >
                          ← Try Easy Timestamps now
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <h3 className="text-red-800 dark:text-red-200 font-medium">Send Failed</h3>
                      <p className="text-red-700 dark:text-red-300 text-sm">
                        Something went wrong. Please try again or email us directly.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Notice */}
              <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    🔒
                  </div>
                  <div>
                    <h3 className="text-blue-800 dark:text-blue-200 font-medium mb-2">Your Privacy Matters</h3>
                    <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
                      <li>• We only use your information to respond to your inquiry</li>
                      <li>• Contact details are not shared with third parties</li>
                      <li>• Messages are securely stored and deleted after resolution</li>
                      <li>• See our <a href="/privacy" className="underline hover:text-blue-800 dark:hover:text-blue-200">Privacy Policy</a> for complete details</li>
                    </ul>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email */}
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.name
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="Your full name"
                      autoComplete="name"
                      inputMode="text"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                        errors.email
                          ? 'border-red-300 dark:border-red-600'
                          : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                      placeholder="your.email@example.com"
                      autoComplete="email"
                      inputMode="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 appearance-none cursor-pointer ${
                      errors.category
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.75rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                  )}
                  {selectedCategory && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {selectedCategory.description}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                      errors.subject
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Brief description of your inquiry"
                    autoComplete="off"
                    inputMode="text"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>
                  )}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={6}
                    className={`w-full px-4 py-4 text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical ${
                      errors.message
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                    placeholder="Please provide as much detail as possible..."
                    autoComplete="off"
                    inputMode="text"
                  />
                  <div className="mt-1 flex justify-between">
                    {errors.message ? (
                      <p className="text-sm text-red-600 dark:text-red-400">{errors.message}</p>
                    ) : (
                      <span></span>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {formData.message.length}/2000 characters
                    </p>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Attachment (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 sm:p-6">
                    {formData.attachment ? (
                      <div className="flex items-center gap-3">
                        <Upload className="h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {formData.attachment.name}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          ({(formData.attachment.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                        <button
                          type="button"
                          onClick={removeAttachment}
                          className="ml-auto text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <div>
                          <label className="cursor-pointer">
                            <span className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                              Choose a file
                            </span>
                            <input
                              type="file"
                              className="hidden"
                              accept="image/*,.pdf"
                              onChange={handleFileUpload}
                            />
                          </label>
                          <span className="text-gray-500 dark:text-gray-400"> or drag and drop</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Images or PDF, up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                  {errors.attachment && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.attachment}</p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-h-[56px] touch-manipulation"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
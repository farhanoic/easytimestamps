/**
 * Privacy Policy Component
 * Comprehensive privacy policy with GDPR compliance
 */

import React from 'react';
import { Shield, Lock, Eye, Download, Trash2, Globe, Mail, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('navigation.privacy')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
            <Lock className="w-5 h-5" />
            <span className="font-semibold">Our Privacy Promise</span>
          </div>
          <p className="text-green-700 dark:text-green-300 mt-2">
            We never spam, sell, or share your personal data. Your privacy is our priority.
          </p>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* Introduction */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Easy Timestamps ("we," "our," or "us") is committed to protecting your privacy. 
            This Privacy Policy explains how we collect, use, disclose, and safeguard your 
            information when you use our video timestamp creation service.
          </p>
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              GDPR Compliance
            </h3>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              This policy complies with the General Data Protection Regulation (GDPR) 
              and provides transparency about our data practices for all users, 
              especially those in the European Union.
            </p>
          </div>
        </section>

        {/* Information We Collect */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Information We Collect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Information You Provide
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Account information (name, email address)</li>
                <li>• Profile information and preferences</li>
                <li>• Video URLs and timestamp data you create</li>
                <li>• Communication with our support team</li>
                <li>• Payment information (processed securely by our payment providers)</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Automatically Collected
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Device information and browser type</li>
                <li>• IP address and general location</li>
                <li>• Usage patterns and feature interactions</li>
                <li>• Performance and error information</li>
                <li>• Cookies and similar tracking technologies</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            How We Use Your Information
          </h2>
          
          <div className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Service Provision
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Provide and maintain our timestamp creation service</li>
                <li>• Process your video URLs and generate timestamps</li>
                <li>• Save your projects and preferences</li>
                <li>• Provide customer support and respond to inquiries</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Service Improvement
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Analyze usage patterns to improve our service</li>
                <li>• Develop new features and functionality</li>
                <li>• Monitor and prevent technical issues</li>
                <li>• Ensure security and prevent fraud</li>
              </ul>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Communication (Optional)
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Send important service updates (always)</li>
                <li>• Share product updates and new features (opt-in)</li>
                <li>• Provide usage tips and best practices (opt-in)</li>
                <li>• Send promotional content (opt-in, easily unsubscribe)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Protection & Security */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Data Protection & Security
          </h2>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200 mb-3">
              <Lock className="w-5 h-5" />
              <span className="font-semibold">Security Measures</span>
            </div>
            <ul className="space-y-2 text-red-700 dark:text-red-300">
              <li>• All data transmission uses HTTPS encryption</li>
              <li>• Passwords are hashed using industry-standard algorithms</li>
              <li>• Regular security audits and vulnerability assessments</li>
              <li>• Secure cloud infrastructure with access controls</li>
              <li>• Employee access is limited and monitored</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Shield className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Encrypted</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">256-bit SSL encryption</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Secure</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">SOC 2 compliant hosting</p>
            </div>
            <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Private</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">No data selling</p>
            </div>
          </div>
        </section>

        {/* Your Rights (GDPR) */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Your Privacy Rights
          </h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Under GDPR, you have the right to:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Access Your Data</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Request a copy of all your personal data</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Trash2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Delete Your Data</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Request complete deletion of your account</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Correct Your Data</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Update or correct any inaccurate information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 dark:text-blue-100">Restrict Processing</p>
                    <p className="text-sm text-blue-800 dark:text-blue-200">Limit how we use your data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300">
            To exercise any of these rights, please contact us using the information provided below. 
            We will respond to your request within 30 days.
          </p>
        </section>

        {/* Cookies */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Cookies and Tracking
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Cookie Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Essential</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Authentication, security, basic functionality</td>
                  <td className="px-4 py-3 text-green-600 dark:text-green-400">Yes</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Analytics</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Understanding usage patterns, improving service</td>
                  <td className="px-4 py-3 text-orange-600 dark:text-orange-400">Optional</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Preferences</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Remembering your settings and preferences</td>
                  <td className="px-4 py-3 text-orange-600 dark:text-orange-400">Optional</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Data Retention */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Data Retention
          </h2>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
              How long we keep your data:
            </h3>
            <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
              <li>• Account data: Until you delete your account</li>
              <li>• Usage analytics: 2 years (anonymized after 1 year)</li>
              <li>• Support communications: 3 years</li>
              <li>• Billing records: 7 years (legal requirement)</li>
              <li>• Security logs: 1 year</li>
            </ul>
            <p className="mt-4 text-yellow-800 dark:text-yellow-200">
              When you delete your account, we permanently remove all personal data within 30 days, 
              except where we are legally required to retain certain information.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {t('common.contactUs')}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Privacy Questions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">privacy@easytimestamps.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">+1 (555) 123-4567</span>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Data Protection Officer
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="text-gray-700 dark:text-gray-300">dpo@easytimestamps.com</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  For GDPR-related requests and privacy concerns
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Policy Updates
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new Privacy Policy on this page and updating the "Last updated" 
              date. For significant changes, we will provide additional notice (such as email notification).
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
              Your continued use of our service after any changes indicates your acceptance of the 
              updated Privacy Policy.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
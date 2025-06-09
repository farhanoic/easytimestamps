/**
 * Terms of Service Component
 * Comprehensive terms of service with clear language
 */

import React from 'react';
import { FileText, Shield, AlertTriangle, Check, Mail, Gavel } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const TermsOfService: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('navigation.terms')}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
            <Check className="w-5 h-5" />
            <span className="font-semibold">Clear & Fair Terms</span>
          </div>
          <p className="text-blue-700 dark:text-blue-300 mt-2">
            We believe in transparent, easy-to-understand terms that protect both you and us.
          </p>
        </div>
      </div>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        {/* Acceptance */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            By accessing or using Easy Timestamps ("Service"), you agree to be bound by these 
            Terms of Service ("Terms"). If you disagree with any part of these terms, 
            you may not access the Service.
          </p>
          <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              What this means for you:
            </h3>
            <p className="text-green-800 dark:text-green-200 text-sm">
              By using our service, you're agreeing to follow these rules. Think of them 
              as the guidelines that help us provide you with the best possible experience.
            </p>
          </div>
        </section>

        {/* Service Description */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Description of Service
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            Easy Timestamps is a web-based tool that helps you create, manage, and export 
            timestamp data for videos. Our service includes:
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Core Features
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Video URL processing (YouTube, Vimeo, etc.)</li>
                <li>• Local video file upload and processing</li>
                <li>• Timestamp creation and editing tools</li>
                <li>• Export to various formats (SRT, VTT, etc.)</li>
                <li>• Project saving and management</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Premium Features
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Advanced export formats</li>
                <li>• Cloud storage and sync</li>
                <li>• Team collaboration tools</li>
                <li>• API access for developers</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
          </div>
        </section>

        {/* User Accounts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            User Accounts
          </h2>
          
          <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
                Account Responsibilities
              </h3>
              <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                <li>• You are responsible for maintaining the confidentiality of your account</li>
                <li>• You must provide accurate and complete registration information</li>
                <li>• You are responsible for all activities that occur under your account</li>
                <li>• You must notify us immediately of any unauthorized use</li>
                <li>• You may not share your account credentials with others</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                Account Security
              </h3>
              <ul className="space-y-2 text-yellow-800 dark:text-yellow-200">
                <li>• Use a strong, unique password for your account</li>
                <li>• Enable two-factor authentication when available</li>
                <li>• Log out from shared or public devices</li>
                <li>• Report any suspicious activity immediately</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Acceptable Use */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Acceptable Use Policy
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-green-200 dark:border-green-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  You May
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Use the service for legitimate purposes</li>
                <li>• Create timestamps for your own content</li>
                <li>• Process public videos with proper permissions</li>
                <li>• Share your projects with team members</li>
                <li>• Export data for your own use</li>
              </ul>
            </div>

            <div className="border border-red-200 dark:border-red-700 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  You May Not
                </h3>
              </div>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Upload or process copyrighted content without permission</li>
                <li>• Use the service for illegal activities</li>
                <li>• Attempt to reverse engineer or hack the service</li>
                <li>• Spam or abuse the service</li>
                <li>• Violate others' privacy or intellectual property</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Intellectual Property */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Intellectual Property Rights
          </h2>
          
          <div className="space-y-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-6">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-3">
                Our Rights
              </h3>
              <p className="text-purple-800 dark:text-purple-200">
                The Easy Timestamps service, including its design, functionality, and content, 
                is owned by us and protected by copyright, trademark, and other laws. 
                You may not copy, modify, or distribute our service without permission.
              </p>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                Your Rights
              </h3>
              <p className="text-green-800 dark:text-green-200">
                You retain all rights to the content you upload and the timestamp data you create. 
                We do not claim ownership of your projects, and you can export or delete your 
                data at any time.
              </p>
            </div>
          </div>
        </section>

        {/* Payment Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Payment and Billing
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Plan Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Billing</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900 dark:text-gray-100">Cancellation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Free</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">No charges</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Delete account anytime</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Premium</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Monthly/yearly subscription</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Cancel before next billing cycle</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-900 dark:text-gray-100">Pro</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Monthly/yearly subscription</td>
                  <td className="px-4 py-3 text-gray-700 dark:text-gray-300">Cancel before next billing cycle</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">
              Billing Terms
            </h3>
            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
              <li>• Subscriptions are billed in advance</li>
              <li>• All fees are non-refundable except as required by law</li>
              <li>• We offer a 30-day money-back guarantee for new subscriptions</li>
              <li>• Prices may change with 30 days notice</li>
              <li>• Failed payments may result in service suspension</li>
            </ul>
          </div>
        </section>

        {/* Service Availability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Service Availability
          </h2>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded-lg p-6">
            <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Service Disclaimer</span>
            </div>
            <p className="text-orange-700 dark:text-orange-300 mb-4">
              While we strive to provide reliable service, we cannot guarantee 100% uptime. 
              The service is provided "as is" without warranties of any kind.
            </p>
            <ul className="space-y-2 text-orange-800 dark:text-orange-200">
              <li>• We aim for 99.9% uptime but cannot guarantee it</li>
              <li>• Scheduled maintenance will be announced in advance</li>
              <li>• We are not liable for service interruptions</li>
              <li>• Critical issues will be addressed promptly</li>
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Limitation of Liability
          </h2>
          
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-6">
            <div className="flex items-center space-x-2 text-red-800 dark:text-red-200 mb-3">
              <Shield className="w-5 h-5" />
              <span className="font-semibold">Important Legal Notice</span>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              To the maximum extent permitted by law, Easy Timestamps shall not be liable 
              for any indirect, incidental, special, consequential, or punitive damages.
            </p>
            <ul className="space-y-2 text-red-800 dark:text-red-200">
              <li>• Our total liability is limited to the amount you paid us in the last 12 months</li>
              <li>• We are not responsible for data loss (always backup your work)</li>
              <li>• We are not liable for third-party service interruptions</li>
              <li>• Some jurisdictions may not allow these limitations</li>
            </ul>
          </div>
        </section>

        {/* Termination */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Termination
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Your Right to Terminate
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Cancel your subscription anytime</li>
                <li>• Delete your account and all data</li>
                <li>• Export your data before cancellation</li>
                <li>• Access continues until the end of billing period</li>
              </ul>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Our Right to Terminate
              </h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Terminate accounts that violate these terms</li>
                <li>• Suspend service for non-payment</li>
                <li>• Discontinue the service with 30 days notice</li>
                <li>• Preserve data for reasonable time after termination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Governing Law */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Governing Law and Disputes
          </h2>
          
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 mb-4">
              <Gavel className="w-5 h-5" />
              <span className="font-semibold">Legal Framework</span>
            </div>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                These Terms are governed by the laws of [Your Jurisdiction], without regard 
                to conflict of law principles.
              </p>
              <p>
                Any disputes arising from these Terms or your use of the Service will be 
                resolved through binding arbitration, except where prohibited by law.
              </p>
              <p>
                Before initiating any legal proceedings, you agree to attempt to resolve 
                disputes through our support channels.
              </p>
            </div>
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
                General Support
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-gray-700 dark:text-gray-300">support@easytimestamps.com</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  For questions about the service, billing, or technical issues
                </p>
              </div>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Legal Matters
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  <span className="text-gray-700 dark:text-gray-300">legal@easytimestamps.com</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  For terms of service questions, copyright issues, or legal concerns
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Changes to Terms */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Changes to These Terms
          </h2>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-6">
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
              We may update these Terms from time to time. We will provide notice of significant 
              changes by email or through the service. Your continued use of the service after 
              changes take effect constitutes acceptance of the new Terms.
            </p>
            <p className="text-blue-800 dark:text-blue-200 leading-relaxed mt-4">
              We encourage you to review these Terms periodically to stay informed about our policies.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};
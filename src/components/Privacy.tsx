import React, { useState } from 'react';
import { Shield, Eye, Lock, Globe, Mail, FileText, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Privacy: React.FC = () => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<string>('');
  console.log('Active section:', activeSection); // Suppress unused variable warning

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const tableOfContents = [
    { id: 'summary', title: 'Quick Summary' },
    { id: 'information-collected', title: 'Information We Collect' },
    { id: 'how-we-use', title: 'How We Use Information' },
    { id: 'data-storage', title: 'Data Storage & Security' },
    { id: 'third-party', title: 'Third-Party Services' },
    { id: 'your-rights', title: 'Your Privacy Rights (Multi-Jurisdiction)' },
    { id: 'cookies', title: 'Cookies & Tracking' },
    { id: 'international-transfers', title: 'International Data Transfers' },
    { id: 'changes', title: 'Changes to This Policy' },
    { id: 'contact', title: 'Contact Information' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
            <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('navigation.privacy')}
          </h1>
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Easy Timestamps
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last Updated: December 8, 2024
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Table of Contents
          </h2>
          <nav className="space-y-2">
            {tableOfContents.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="flex items-center justify-between w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 group"
              >
                <span className="text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {item.title}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="prose prose-gray dark:prose-invert max-w-none">
          
          {/* Quick Summary */}
          <section id="summary" className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              Quick Summary
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-3">
              <p className="font-medium">We respect your privacy. Here's what you need to know:</p>
              <ul className="space-y-2 ml-4">
                <li>• <strong>No personal data stored:</strong> We don't collect or store personal information</li>
                <li>• <strong>Local processing:</strong> Videos are processed in your browser, never uploaded to our servers</li>
                <li>• <strong>Anonymous analytics:</strong> We use Google Analytics for anonymous usage statistics only</li>
                <li>• <strong>No tracking:</strong> No advertising cookies or cross-site tracking</li>
                <li>• <strong>GDPR compliant:</strong> Full compliance with European data protection regulations</li>
              </ul>
            </div>
          </section>

          {/* Information We Collect */}
          <section id="information-collected" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1.1 Anonymous Analytics Data</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We collect anonymous usage statistics through Google Analytics to understand how users interact with our service:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Page views and session duration</li>
              <li>Browser type and operating system</li>
              <li>General geographic location (country/region level)</li>
              <li>Referral sources and user journey paths</li>
              <li>Feature usage patterns (anonymized)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1.2 Local Browser Data</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Some data is stored locally in your browser for functionality:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Theme preferences (light/dark mode)</li>
              <li>Language settings</li>
              <li>Recent timestamp formats</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">1.3 What We Don't Collect</h3>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Personal identification information (name, email, address)</li>
              <li>Video files or content</li>
              <li>Timestamp data or video descriptions</li>
              <li>IP addresses (beyond anonymized analytics)</li>
              <li>Social media profiles or accounts</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section id="how-we-use" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">2. How We Use Information</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2.1 Website Analytics & Improvement</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use anonymous analytics data to:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Understand which features are most useful to users</li>
              <li>Identify and fix technical issues</li>
              <li>Optimize website performance and loading times</li>
              <li>Plan future feature development</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2.2 User Experience Optimization</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Local browser data helps us:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Remember your preferred theme and language settings</li>
              <li>Provide a consistent user experience across visits</li>
              <li>Reduce the need to reconfigure settings</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">2.3 What We Don't Do</h3>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Sell or share your data with third parties</li>
              <li>Use data for advertising purposes</li>
              <li>Create user profiles or behavioral tracking</li>
              <li>Store or analyze your video content</li>
            </ul>
          </section>

          {/* Data Storage & Security */}
          <section id="data-storage" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Lock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              3. Data Storage & Security
            </h2>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                Security Overview
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Easy Timestamps is built with security and privacy as core principles. All video processing happens locally 
                in your browser, ensuring your content never leaves your device. We implement industry-standard security 
                measures to protect the minimal data we do process.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.1 Local Browser Processing</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All video file processing occurs entirely within your web browser using client-side JavaScript:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>No uploads:</strong> Video files are never transmitted to our servers</li>
              <li><strong>Local memory only:</strong> Videos are loaded into browser memory temporarily</li>
              <li><strong>Client-side processing:</strong> All timestamp creation happens on your device</li>
              <li><strong>No server dependency:</strong> Core functionality works without server communication</li>
              <li><strong>Immediate disposal:</strong> Video data is cleared when you navigate away or close the tab</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.2 HTTPS Encryption</h3>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transport Layer Security</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                All communications between your browser and our servers are protected with industry-standard encryption:
              </p>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>TLS 1.3:</strong> Latest encryption protocol for maximum security</li>
                <li><strong>Perfect Forward Secrecy:</strong> Each session uses unique encryption keys</li>
                <li><strong>HSTS (HTTP Strict Transport Security):</strong> Prevents downgrade attacks</li>
                <li><strong>Certificate Pinning:</strong> Verifies authentic SSL certificates</li>
                <li><strong>Secure Headers:</strong> Additional security headers protect against common attacks</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.3 No Server-Side Data Storage</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We have designed our architecture to minimize data collection and storage:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>No video storage:</strong> Video files are never saved on our servers</li>
              <li><strong>No timestamp storage:</strong> Created timestamps remain in your browser only</li>
              <li><strong>No user profiles:</strong> We don't create or maintain user accounts</li>
              <li><strong>No personal data:</strong> No names, emails, or identifying information collected</li>
              <li><strong>Stateless operation:</strong> Each session is independent with no persistent data</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.4 Infrastructure Security</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Hosting & Infrastructure</h4>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h5 className="font-semibold mb-2">Vercel Platform Security</h5>
                  <p>Hosted on Vercel's enterprise-grade infrastructure with automatic security updates and DDoS protection.</p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Content Delivery Network (CDN)</h5>
                  <p>Global CDN ensures fast, secure delivery with built-in attack mitigation and traffic filtering.</p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Regular Security Scanning</h5>
                  <p>Automated vulnerability scanning and dependency monitoring for timely security updates.</p>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Access Control</h5>
                  <p>Strict access controls and multi-factor authentication for deployment and infrastructure management.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.5 Security Monitoring & Updates</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We maintain continuous security monitoring and update procedures:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Automated dependency updates:</strong> Regular scanning and updating of all code dependencies</li>
              <li><strong>Security patch management:</strong> Immediate application of critical security patches</li>
              <li><strong>Real-time monitoring:</strong> 24/7 monitoring of infrastructure and application performance</li>
              <li><strong>Penetration testing:</strong> Regular security assessments by third-party security firms</li>
              <li><strong>Code security reviews:</strong> All code changes undergo security review before deployment</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.6 No Payment Processing</h3>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Free Service - No Financial Data</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Easy Timestamps is completely free to use, eliminating payment-related security risks:
              </p>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>No payment collection:</strong> We don't process credit cards or financial information</li>
                <li><strong>No billing data:</strong> No storage of payment methods or billing addresses</li>
                <li><strong>No subscription management:</strong> No recurring payments or account management</li>
                <li><strong>Reduced attack surface:</strong> Elimination of payment-related vulnerabilities</li>
                <li><strong>PCI DSS not applicable:</strong> No payment card industry compliance requirements</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.7 Data Breach Response Procedures</h3>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Incident Response Plan</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                While we process minimal data, we maintain comprehensive incident response procedures:
              </p>
              
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <div>
                  <h5 className="font-semibold mb-2">Detection & Assessment (0-2 hours)</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Automated monitoring systems detect anomalies</li>
                    <li>Security team assesses scope and severity</li>
                    <li>Immediate containment measures implemented</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Containment & Investigation (2-24 hours)</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Isolate affected systems and prevent further damage</li>
                    <li>Forensic investigation to determine cause and impact</li>
                    <li>Preserve evidence for analysis and reporting</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Notification & Communication (24-72 hours)</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>GDPR-compliant notification to supervisory authorities within 72 hours</li>
                    <li>User notification if personal data is involved</li>
                    <li>Public disclosure if required by law or severity</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-2">Recovery & Prevention (Ongoing)</h5>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Restore normal operations safely</li>
                    <li>Implement additional security measures</li>
                    <li>Update incident response procedures based on lessons learned</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">3.8 GDPR Breach Notification</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We comply with GDPR breach notification requirements:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Supervisory Authority:</strong> Notification within 72 hours of becoming aware of a breach</li>
              <li><strong>Data Subjects:</strong> Direct notification if high risk to rights and freedoms</li>
              <li><strong>Documentation:</strong> Comprehensive breach register maintained for compliance</li>
              <li><strong>Risk Assessment:</strong> Evaluation of likelihood and severity of impact</li>
              <li><strong>Mitigation Measures:</strong> Description of measures taken to address the breach</li>
            </ul>

          </section>

          {/* Third-Party Services */}
          <section id="third-party" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              4. Third-Party Services
            </h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4.1 Google Analytics</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use Google Analytics for anonymous website analytics. Google Analytics may collect:
            </p>
            <ul className="list-disc ml-6 mb-4 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Anonymized IP addresses</li>
              <li>Browser and device information</li>
              <li>Page interaction data</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              You can opt-out of Google Analytics by using browser extensions or adjusting your cookie preferences.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4.2 Vercel Hosting</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Our website is hosted on Vercel, which may collect standard web server logs for security and 
              performance monitoring. These logs do not contain personal information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">4.3 YouTube Integration</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              When you use YouTube URLs, the video content is loaded directly from YouTube's servers. 
              We do not store or process this content - it's streamed directly to your browser.
            </p>
          </section>

          {/* Your Rights (Multi-Jurisdiction) */}
          <section id="your-rights" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">5. Your Privacy Rights (Multi-Jurisdiction Compliance)</h2>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Global Privacy Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Easy Timestamps respects privacy rights worldwide. Depending on your location, you may have different rights 
                under various privacy laws. We comply with GDPR (EU), CCPA (California), PIPEDA (Canada), and international best practices.
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-semibold text-blue-600 dark:text-blue-400">🇪🇺 GDPR</div>
                  <div className="text-gray-600 dark:text-gray-400">European Union</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-semibold text-purple-600 dark:text-purple-400">🇺🇸 CCPA</div>
                  <div className="text-gray-600 dark:text-gray-400">California, USA</div>
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3">
                  <div className="font-semibold text-red-600 dark:text-red-400">🇨🇦 PIPEDA</div>
                  <div className="text-gray-600 dark:text-gray-400">Canada</div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Legal Basis for Processing</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We process data under the following legal bases defined in GDPR Article 6:
              </p>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Legitimate Interest (Article 6(1)(f)):</strong> Anonymous analytics for website improvement and security</li>
                <li><strong>Consent (Article 6(1)(a)):</strong> Optional cookies and preferences (where explicit consent is obtained)</li>
                <li><strong>Performance of Contract (Article 6(1)(b)):</strong> Essential functionality to provide our service</li>
              </ul>
            </div>

            {/* GDPR Rights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🇪🇺 European Union - GDPR Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Under the General Data Protection Regulation (GDPR), EU residents have comprehensive rights regarding their personal data:
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right of Access (Article 15)</h4>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You have the right to request:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Confirmation of whether we process your personal data</li>
              <li>Access to your personal data and information about processing</li>
              <li>A copy of your personal data in a commonly used format</li>
              <li>Information about data sources, processing purposes, and recipients</li>
            </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Rectification (Article 16)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You can request correction of inaccurate personal data. Since we process minimal data locally, 
                most corrections can be made directly in your browser settings.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Erasure/"Right to be Forgotten" (Article 17)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You can request deletion of your personal data when:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Data is no longer necessary for the original purpose</li>
                <li>You withdraw consent and no other legal ground exists</li>
                <li>Data has been unlawfully processed</li>
                <li>You object to processing and no overriding legitimate grounds exist</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Restrict Processing (Article 18)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You can request restriction of processing while we verify data accuracy, assess the lawfulness of processing, 
                or during objection procedures.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Data Portability (Article 20)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Where technically feasible, you have the right to:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Receive your personal data in a structured, commonly used, machine-readable format</li>
                <li>Transmit that data to another controller without hindrance</li>
                <li>Have data transmitted directly between controllers where technically feasible</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Object (Article 21)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have the right to object to processing based on legitimate interests or for direct marketing purposes:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Object to analytics processing by using browser "Do Not Track" settings</li>
                <li>Install Google Analytics opt-out browser extension</li>
                <li>Block analytics cookies in browser settings</li>
                <li>Contact us to request cessation of specific processing activities</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Withdraw Consent (Article 7(3))</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Where processing is based on consent, you have the right to withdraw consent at any time. 
                Withdrawal does not affect the lawfulness of processing based on consent before withdrawal. 
                You can withdraw consent by adjusting cookie settings or contacting us directly.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Lodge Complaints (Article 77)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You have the right to lodge a complaint with a supervisory authority, particularly in the EU member state 
                of your habitual residence, place of work, or where an alleged infringement occurred.
              </p>
            </div>

            {/* CCPA Rights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🇺🇸 California, USA - CCPA/CPRA Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA), California residents have specific rights:
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Know (CCPA § 1798.100)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You have the right to request information about:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li>Categories of personal information we collect</li>
                <li>Categories of sources from which we collect personal information</li>
                <li>Business or commercial purposes for collecting personal information</li>
                <li>Categories of third parties with whom we share personal information</li>
                <li>Specific pieces of personal information we have collected about you</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Delete (CCPA § 1798.105)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You have the right to request deletion of personal information we have collected from you, 
                subject to certain exceptions under CCPA.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Opt-Out of Sale (CCPA § 1798.120)</h4>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Good News:</strong> We do not sell personal information to third parties, so there is nothing to opt-out of.
                </p>
              </div>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Correct (CPRA § 1798.106)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You have the right to request correction of inaccurate personal information. Since our data processing 
                is minimal and local, most corrections can be made in your browser settings.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Limit Use and Disclosure (CPRA § 1798.121)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You have the right to limit the use and disclosure of sensitive personal information. 
                We do not collect sensitive personal information as defined by CPRA.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Non-Discrimination (CCPA § 1798.125)</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                We will not discriminate against you for exercising any of your CCPA rights, including by denying services, 
                charging different prices, or providing different levels of service quality.
              </p>
            </div>

            {/* PIPEDA Rights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🇨🇦 Canada - PIPEDA Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Under the Personal Information Protection and Electronic Documents Act (PIPEDA), Canadian residents have the following rights:
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Access</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You have the right to access your personal information in our custody or control and to be informed 
                of its use and disclosure, subject to certain exceptions.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Correct</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You can challenge the accuracy and completeness of your personal information and request amendments as appropriate.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Withdraw Consent</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                You can withdraw consent for the collection, use, or disclosure of your personal information, 
                subject to legal or contractual restrictions and reasonable notice.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Right to Complain</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You can file a complaint with the Privacy Commissioner of Canada if you believe your privacy rights have been violated:
              </p>
              <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Office of the Privacy Commissioner of Canada:</strong> <a href="https://www.priv.gc.ca" className="text-blue-600 dark:text-blue-400 hover:underline">priv.gc.ca</a></li>
                <li><strong>Complaint Process:</strong> Available online or by phone at 1-800-282-1376</li>
              </ul>
            </div>

            {/* International Rights */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                🌍 International Users - General Privacy Rights
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Regardless of your location, we respect these fundamental privacy rights:
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Transparency Rights</h4>
                  <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Clear information about data collection</li>
                    <li>Purpose specification for data use</li>
                    <li>Regular privacy policy updates</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Control Rights</h4>
                  <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Access to your personal information</li>
                    <li>Ability to correct inaccuracies</li>
                    <li>Request deletion where possible</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Security Rights</h4>
                  <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Secure data transmission</li>
                    <li>Incident notification</li>
                    <li>Responsible data handling</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Communication Rights</h4>
                  <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                    <li>Timely response to inquiries</li>
                    <li>Clear complaint procedures</li>
                    <li>Accessible privacy contacts</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Data Retention Periods</h3>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Google Analytics Data:</strong> Automatically deleted after 26 months (Google's retention period)</li>
                <li><strong>Local Browser Data:</strong> Retained until you clear browser storage or uninstall the browser</li>
                <li><strong>Server Logs:</strong> Retained for 30 days for security purposes, then automatically deleted</li>
                <li><strong>Contact Requests:</strong> Retained for 3 years to handle follow-up inquiries, then deleted</li>
                <li><strong>No Video Data:</strong> Video files are never stored on our servers</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">5.9 Exercising Your Rights - Request Procedures</h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">How to Submit Data Subject Requests</h4>
              <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  To submit a data subject request, please use our contact form and specify the type of request you're making.
                </p>
                <a 
                  href="/contact"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <Mail className="h-5 w-5" />
                  Submit Data Request
                </a>
                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  <p><strong>Response Time:</strong> We will respond within 30 days (extendable to 60 days for complex requests)</p>
                  <p><strong>No Charge:</strong> Requests are processed free of charge unless manifestly unfounded or excessive</p>
                </div>
              </div>
            </div>
          </section>

          {/* Cookies & Tracking */}
          <section id="cookies" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">6. Cookies & Tracking</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.1 Types of Cookies</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use minimal cookies for essential functionality:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Analytics Cookies:</strong> Google Analytics for anonymous usage statistics</li>
              <li><strong>Functional Cookies:</strong> Theme preferences and language settings</li>
              <li><strong>No Advertising Cookies:</strong> We do not use cookies for advertising or marketing</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">6.2 Managing Cookies</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Block all cookies (may affect functionality)</li>
              <li>Block third-party cookies only</li>
              <li>Delete existing cookies</li>
              <li>Set cookie preferences for specific websites</li>
            </ul>
          </section>

          {/* International Data Transfers */}
          <section id="international-transfers" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              7. International Data Transfers
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Cross-Border Data Handling</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Easy Timestamps operates globally and may process data across different jurisdictions. 
                We ensure appropriate safeguards are in place for all international data transfers.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7.1 GDPR International Transfers</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For EU users, we ensure GDPR-compliant international transfers through:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Adequacy Decisions:</strong> Transfers to countries with EU adequacy decisions where applicable</li>
              <li><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved contract terms for data protection</li>
              <li><strong>Binding Corporate Rules:</strong> For transfers within multinational organizations</li>
              <li><strong>Certification and Codes of Conduct:</strong> Additional safeguards as approved by EU authorities</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7.2 Data Localization</h3>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-6">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Minimal Data Movement</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our architecture minimizes international data transfers:
              </p>
              <ul className="list-disc ml-6 text-gray-700 dark:text-gray-300 space-y-1">
                <li><strong>Local Processing:</strong> Video processing happens in your browser, never crosses borders</li>
                <li><strong>CDN Distribution:</strong> Content served from geographically closest servers</li>
                <li><strong>Regional Analytics:</strong> Google Analytics respects regional data preferences</li>
                <li><strong>No User Profiles:</strong> No personal data to transfer across borders</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">7.3 Third-Party Service Compliance</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our third-party services maintain international compliance:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li><strong>Google Analytics:</strong> Operates under Google's global privacy framework and data transfer mechanisms</li>
              <li><strong>Vercel Hosting:</strong> Provides data residency options and complies with international privacy laws</li>
              <li><strong>YouTube Integration:</strong> Direct browser-to-YouTube connections, no data routing through our servers</li>
            </ul>
          </section>

          {/* Changes to Policy */}
          <section id="changes" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">8. Changes to This Policy</h2>
            
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8.1 Notification of Changes</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              When we make changes to this policy, we will:
            </p>
            <ul className="list-disc ml-6 mb-6 text-gray-700 dark:text-gray-300 space-y-1">
              <li>Update the "Last Updated" date at the top of this page</li>
              <li>Post a notice on our homepage for significant changes</li>
              <li>Maintain this policy in an easily accessible location</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">8.2 Effective Date</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Changes to this Privacy Policy become effective immediately upon posting. 
              Your continued use of Easy Timestamps after any changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact Information */}
          <section id="contact" className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              9. Contact Information
            </h2>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, 
                please contact us through our contact page.
              </p>
              
              <a 
                href="/contact"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Mail className="h-5 w-5" />
                Contact Us
              </a>
            </div>
          </section>

        </div>

        {/* Footer Notice */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <p>This Privacy Policy is effective as of December 8, 2024</p>
            <p className="mt-2">Easy Timestamps - Protecting your privacy while you create amazing content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
// Email template system for automatic responses

export interface ContactSubmission {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  ticketId: string;
  submissionTime: string;
}

// Generate unique ticket ID
export const generateTicketId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `ET-${timestamp}-${random}`.toUpperCase();
};

// Get expected response time based on category
export const getResponseTime = (category: string): string => {
  const responseTimes: Record<string, string> = {
    'technical': '24-48 hours',
    'bug': '12-24 hours',
    'feature': '48-72 hours',
    'business': '24-48 hours',
    'general': '48-72 hours'
  };
  return responseTimes[category] || '48-72 hours';
};

// Get relevant FAQ links based on inquiry type
export const getRelevantFAQs = (category: string): Array<{title: string, url: string}> => {
  const faqLinks: Record<string, Array<{title: string, url: string}>> = {
    'technical': [
      { title: 'Browser Compatibility Issues', url: 'https://easytimestamps.com/faq#browser-support' },
      { title: 'Video Loading Problems', url: 'https://easytimestamps.com/faq#video-loading' },
      { title: 'Performance Issues', url: 'https://easytimestamps.com/faq#performance' }
    ],
    'bug': [
      { title: 'Known Issues', url: 'https://easytimestamps.com/faq#known-issues' },
      { title: 'How to Report Bugs', url: 'https://easytimestamps.com/faq#bug-reporting' },
      { title: 'Troubleshooting Guide', url: 'https://easytimestamps.com/faq#troubleshooting' }
    ],
    'feature': [
      { title: 'Feature Roadmap', url: 'https://easytimestamps.com/faq#roadmap' },
      { title: 'Current Features', url: 'https://easytimestamps.com/features' },
      { title: 'How to Suggest Features', url: 'https://easytimestamps.com/faq#feature-requests' }
    ],
    'business': [
      { title: 'Partnership Opportunities', url: 'https://easytimestamps.com/faq#partnerships' },
      { title: 'API Access', url: 'https://easytimestamps.com/faq#api' },
      { title: 'Enterprise Solutions', url: 'https://easytimestamps.com/faq#enterprise' }
    ],
    'general': [
      { title: 'Getting Started Guide', url: 'https://easytimestamps.com/faq#getting-started' },
      { title: 'YouTube Integration', url: 'https://easytimestamps.com/faq#youtube' },
      { title: 'Common Questions', url: 'https://easytimestamps.com/faq#common' }
    ]
  };
  
  return faqLinks[category] || faqLinks['general'];
};

// HTML Email Template
export const generateConfirmationEmailHTML = (submission: ContactSubmission): string => {
  const responseTime = getResponseTime(submission.category);
  const relevantFAQs = getRelevantFAQs(submission.category);
  const unsubscribeUrl = `https://easytimestamps.com/unsubscribe?email=${encodeURIComponent(submission.email)}&token=${generateUnsubscribeToken(submission.email)}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Request Confirmation - Easy Timestamps</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; }
        .ticket-box { background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 6px; padding: 20px; margin: 20px 0; text-align: center; }
        .ticket-id { font-size: 24px; font-weight: bold; color: #3b82f6; font-family: monospace; }
        .category-badge { display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin: 10px 0; }
        .response-time { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 6px; padding: 15px; margin: 20px 0; }
        .faq-list { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 20px; margin: 20px 0; }
        .faq-link { display: block; color: #1e40af; text-decoration: none; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .faq-link:hover { background: #f9fafb; }
        .footer { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center; font-size: 14px; color: #6b7280; }
        .unsubscribe { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
        @media (max-width: 600px) {
          body { padding: 10px; }
          .header, .content { padding: 20px 15px; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0; font-size: 28px;">Easy Timestamps</h1>
        <p style="margin: 10px 0 0 0; opacity: 0.9;">Support Request Confirmation</p>
      </div>
      
      <div class="content">
        <h2 style="color: #1f2937; margin-top: 0;">Hi ${submission.name},</h2>
        
        <p>Thank you for contacting Easy Timestamps! We've received your support request and our team will get back to you soon.</p>
        
        <div class="ticket-box">
          <p style="margin: 0 0 10px 0; font-weight: 600; color: #374151;">Your Ticket Reference</p>
          <div class="ticket-id">${submission.ticketId}</div>
          <span class="category-badge">${getCategoryDisplayName(submission.category)}</span>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #1f2937; margin-bottom: 10px;">Request Details:</h3>
          <p><strong>Subject:</strong> ${submission.subject}</p>
          <p><strong>Category:</strong> ${getCategoryDisplayName(submission.category)}</p>
          <p><strong>Submitted:</strong> ${new Date(submission.submissionTime).toLocaleString()}</p>
        </div>
        
        <div class="response-time">
          <h3 style="margin: 0 0 10px 0; color: #059669;">📅 Expected Response Time</h3>
          <p style="margin: 0; font-weight: 600;">We aim to respond within ${responseTime} during business hours (Monday-Friday, 9 AM - 5 PM CET).</p>
        </div>
        
        <div class="faq-list">
          <h3 style="margin: 0 0 15px 0; color: #d97706;">💡 While You Wait - Helpful Resources</h3>
          <p style="margin: 0 0 15px 0;">Based on your inquiry type, these resources might help:</p>
          ${relevantFAQs.map(faq => `<a href="${faq.url}" class="faq-link">${faq.title}</a>`).join('')}
          <a href="https://easytimestamps.com/faq" class="faq-link" style="font-weight: 600;">📚 Browse All FAQs</a>
        </div>
        
        <div style="margin: 30px 0; padding: 20px; background: #f0f9ff; border-radius: 6px;">
          <h3 style="margin: 0 0 15px 0; color: #0369a1;">🚀 Try Easy Timestamps</h3>
          <p style="margin: 0 0 15px 0;">While you wait for our response, feel free to continue using Easy Timestamps:</p>
          <a href="https://easytimestamps.com" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Create Timestamps Now</a>
        </div>
        
        <p>If you have any additional information to add to this request, simply reply to this email and include your ticket reference: <strong>${submission.ticketId}</strong></p>
        
        <p>Best regards,<br>The Easy Timestamps Support Team</p>
      </div>
      
      <div class="footer">
        <p><strong>Easy Timestamps</strong><br>
        Free YouTube Timestamp & Chapter Generator</p>
        
        <p>📧 <a href="mailto:support@easytimestamps.com">support@easytimestamps.com</a> | 
        🌐 <a href="https://easytimestamps.com">easytimestamps.com</a></p>
        
        <div class="unsubscribe">
          <p>You're receiving this email because you submitted a support request.<br>
          <a href="${unsubscribeUrl}">Unsubscribe from future support communications</a> | 
          <a href="https://easytimestamps.com/privacy">Privacy Policy</a></p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Plain text version for email clients that don't support HTML
export const generateConfirmationEmailText = (submission: ContactSubmission): string => {
  const responseTime = getResponseTime(submission.category);
  const relevantFAQs = getRelevantFAQs(submission.category);
  const unsubscribeUrl = `https://easytimestamps.com/unsubscribe?email=${encodeURIComponent(submission.email)}&token=${generateUnsubscribeToken(submission.email)}`;
  
  return `
Easy Timestamps - Support Request Confirmation

Hi ${submission.name},

Thank you for contacting Easy Timestamps! We've received your support request and our team will get back to you soon.

TICKET REFERENCE: ${submission.ticketId}

Request Details:
- Subject: ${submission.subject}
- Category: ${getCategoryDisplayName(submission.category)}
- Submitted: ${new Date(submission.submissionTime).toLocaleString()}

EXPECTED RESPONSE TIME
We aim to respond within ${responseTime} during business hours (Monday-Friday, 9 AM - 5 PM CET).

HELPFUL RESOURCES
Based on your inquiry type, these resources might help:

${relevantFAQs.map(faq => `• ${faq.title}: ${faq.url}`).join('\n')}

• Browse All FAQs: https://easytimestamps.com/faq

CONTINUE USING EASY TIMESTAMPS
While you wait for our response, feel free to continue creating timestamps:
https://easytimestamps.com

If you have any additional information to add to this request, simply reply to this email and include your ticket reference: ${submission.ticketId}

Best regards,
The Easy Timestamps Support Team

---
Easy Timestamps
Free YouTube Timestamp & Chapter Generator
📧 support@easytimestamps.com
🌐 https://easytimestamps.com

You're receiving this email because you submitted a support request.
Unsubscribe: ${unsubscribeUrl}
Privacy Policy: https://easytimestamps.com/privacy
  `.trim();
};

// Helper function to get display name for categories
export const getCategoryDisplayName = (category: string): string => {
  const displayNames: Record<string, string> = {
    'technical': 'Technical Support',
    'bug': 'Bug Report',
    'feature': 'Feature Request',
    'business': 'Business Inquiry',
    'general': 'General Question'
  };
  return displayNames[category] || 'General Inquiry';
};

// Generate unsubscribe token (in production, this should be more secure)
export const generateUnsubscribeToken = (email: string): string => {
  // In production, use a proper HMAC or JWT token
  return btoa(`${email}:${Date.now()}`).replace(/[+/=]/g, '');
};

// Email configuration for different services
export interface EmailServiceConfig {
  service: 'sendgrid' | 'mailgun' | 'ses' | 'smtp';
  apiKey?: string;
  domain?: string;
  fromEmail: string;
  fromName: string;
}

// Function to send confirmation email (implementation would depend on chosen service)
export const sendConfirmationEmail = async (
  submission: ContactSubmission, 
  config: EmailServiceConfig
): Promise<{success: boolean, messageId?: string, error?: string}> => {
  const htmlContent = generateConfirmationEmailHTML(submission);
  const textContent = generateConfirmationEmailText(submission);
  
  // Example implementation for different services
  try {
    switch (config.service) {
      case 'sendgrid':
        return await sendViaEmailService({
          to: submission.email,
          from: { email: config.fromEmail, name: config.fromName },
          subject: `Support Request Confirmed - ${submission.ticketId}`,
          html: htmlContent,
          text: textContent,
          headers: {
            'X-Ticket-ID': submission.ticketId,
            'X-Category': submission.category
          }
        });
        
      default:
        throw new Error(`Email service ${config.service} not implemented`);
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Generic email sending function (to be implemented based on chosen service)
const sendViaEmailService = async (emailData: any): Promise<{success: boolean, messageId?: string}> => {
  // This would be implemented based on the chosen email service
  // For now, return a mock response
  console.log('Email would be sent:', emailData);
  return { 
    success: true, 
    messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}` 
  };
};

// Internal notification email for the support team
export const generateInternalNotificationEmail = (submission: ContactSubmission): {html: string, text: string} => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>New Support Request - ${submission.ticketId}</title>
    </head>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #dc2626;">🆘 New Support Request</h2>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>Ticket: ${submission.ticketId}</h3>
        <p><strong>From:</strong> ${submission.name} (${submission.email})</p>
        <p><strong>Category:</strong> ${getCategoryDisplayName(submission.category)}</p>
        <p><strong>Priority:</strong> ${submission.category === 'bug' ? 'HIGH' : 'NORMAL'}</p>
        <p><strong>Expected Response:</strong> ${getResponseTime(submission.category)}</p>
      </div>
      
      <div style="background: white; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px;">
        <h4>Subject: ${submission.subject}</h4>
        <div style="background: #f8fafc; padding: 15px; border-radius: 4px; margin: 15px 0;">
          <pre style="white-space: pre-wrap; font-family: inherit;">${submission.message}</pre>
        </div>
      </div>
      
      <p style="margin: 30px 0;"><strong>⏰ Submitted:</strong> ${new Date(submission.submissionTime).toLocaleString()}</p>
    </body>
    </html>
  `;
  
  const text = `
New Support Request - ${submission.ticketId}

From: ${submission.name} (${submission.email})
Category: ${getCategoryDisplayName(submission.category)}
Priority: ${submission.category === 'bug' ? 'HIGH' : 'NORMAL'}
Expected Response: ${getResponseTime(submission.category)}

Subject: ${submission.subject}

Message:
${submission.message}

Submitted: ${new Date(submission.submissionTime).toLocaleString()}
  `.trim();
  
  return { html, text };
};
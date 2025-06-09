import emailjs from '@emailjs/browser';

// EmailJS configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key';

export interface ContactFormData {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  attachment?: File | null;
}

export class EmailService {
  private static initialized = false;

  private static initialize() {
    if (!this.initialized) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
      this.initialized = true;
    }
  }

  /**
   * Send contact form email using EmailJS
   */
  static async sendContactForm(formData: ContactFormData): Promise<void> {
    this.initialize();

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      category: formData.category,
      subject: formData.subject,
      message: formData.message,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_url: window.location.href,
      // Add category-specific routing
      to_email: this.getEmailByCategory(formData.category),
    };

    try {
      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams
      );

      if (response.status !== 200) {
        throw new Error(`EmailJS failed with status: ${response.status}`);
      }

      // Track successful email send
      console.log('Email sent successfully:', response);
      
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new Error('Failed to send message. Please try again or contact us directly.');
    }
  }

  /**
   * Get appropriate email address based on category
   * All emails go to contact.puggie@gmail.com
   */
  private static getEmailByCategory(_category: string): string {
    // For now, all emails go to the main contact email
    // You can set up email filters in Gmail to organize by category
    return 'contact.puggie@gmail.com';
  }

  /**
   * Send auto-reply confirmation email to user
   */
  static async sendAutoReply(userEmail: string, userName: string, category: string): Promise<void> {
    this.initialize();

    const templateParams = {
      to_email: userEmail,
      to_name: userName,
      category: category,
      timestamp: new Date().toISOString(),
      response_time: this.getResponseTimeByCategory(category),
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        'auto_reply_template', // You'll need to create this template in EmailJS
        templateParams
      );
    } catch (error) {
      // Auto-reply failure shouldn't block the main submission
      console.warn('Auto-reply failed:', error);
    }
  }

  /**
   * Get expected response time based on category
   */
  private static getResponseTimeByCategory(category: string): string {
    const timeMap: Record<string, string> = {
      bug: '12-24 hours',
      technical: '24-48 hours',
      feature: '48-72 hours',
      business: '24-48 hours',
      general: '48-72 hours'
    };

    return timeMap[category] || '48-72 hours';
  }

  /**
   * Validate EmailJS configuration
   */
  static isConfigured(): boolean {
    return (
      EMAILJS_SERVICE_ID !== 'your_service_id' &&
      EMAILJS_TEMPLATE_ID !== 'your_template_id' &&
      EMAILJS_PUBLIC_KEY !== 'your_public_key' &&
      !!EMAILJS_SERVICE_ID &&
      !!EMAILJS_TEMPLATE_ID &&
      !!EMAILJS_PUBLIC_KEY
    );
  }

  /**
   * Get configuration status for debugging
   */
  static getConfigStatus(): {
    configured: boolean;
    serviceId: boolean;
    templateId: boolean;
    publicKey: boolean;
  } {
    return {
      configured: this.isConfigured(),
      serviceId: !!EMAILJS_SERVICE_ID && EMAILJS_SERVICE_ID !== 'your_service_id',
      templateId: !!EMAILJS_TEMPLATE_ID && EMAILJS_TEMPLATE_ID !== 'your_template_id',
      publicKey: !!EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'your_public_key',
    };
  }
}

export default EmailService;
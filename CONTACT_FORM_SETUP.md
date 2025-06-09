# Contact Form Setup Guide

This guide explains how to make the contact form functional using EmailJS.

## Quick Setup (5 minutes)

### 1. Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account (1000 emails/month)
3. Verify your email address

### 2. Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow setup instructions to connect your email
5. Note the **Service ID** (e.g., `service_abc123`)

### 3. Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template:

```html
Subject: New Contact Form Submission - {{category}}

From: {{from_name}} <{{from_email}}>
Category: {{category}}
Subject: {{subject}}

Message:
{{message}}

---
Submitted: {{timestamp}}
Page: {{page_url}}
User Agent: {{user_agent}}
```

4. Save and note the **Template ID** (e.g., `template_xyz789`)

### 4. Get Public Key
1. Go to **Account** → **General**
2. Copy your **Public Key** (e.g., `abc123def456`)

### 5. Configure Environment Variables
1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update `.env.local` with your EmailJS credentials:
```bash
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abc123def456
```

### 6. Test the Contact Form
1. Restart your development server:
```bash
npm run dev
```

2. Go to `/contact` and submit a test message
3. Check your email for the submission!

## Advanced Configuration

### Auto-Reply Template (Optional)
Create a second template for auto-replies to users:

```html
Subject: We received your message - Easy Timestamps

Hi {{to_name}},

Thank you for contacting Easy Timestamps! We've received your message about "{{category}}" and will respond within {{response_time}}.

Your submission details:
- Category: {{category}}
- Submitted: {{timestamp}}

If you have urgent questions, you can also reach us directly at support@easytimestamps.com.

Best regards,
Easy Timestamps Team
```

### Category-Based Email Routing
The contact form automatically routes emails based on category:

- **Technical Support** → support@easytimestamps.com
- **Bug Reports** → bugs@easytimestamps.com  
- **Feature Requests** → features@easytimestamps.com
- **Business Inquiries** → business@easytimestamps.com
- **General** → contact@easytimestamps.com

### File Attachments
The current setup supports:
- **File types**: Images (PNG, JPG, GIF) and PDF
- **Size limit**: 5MB maximum
- **Note**: EmailJS free plan has limitations on attachments

## Troubleshooting

### Form Shows "Demo Mode"
- Check that all environment variables are set correctly
- Ensure EmailJS service, template, and public key are valid
- Restart development server after changing `.env.local`

### Emails Not Received
- Check EmailJS dashboard for delivery status
- Verify email template is correct
- Check spam/junk folder
- Ensure email service is properly connected

### Configuration Check
Add this to see configuration status in browser console:
```javascript
import { EmailService } from './src/services/emailService';
console.log('EmailJS Config:', EmailService.getConfigStatus());
```

## Production Deployment

### Vercel Environment Variables
In Vercel dashboard:
1. Go to **Settings** → **Environment Variables**
2. Add each variable:
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID` 
   - `VITE_EMAILJS_PUBLIC_KEY`

### Security Notes
- EmailJS public key is safe to expose (client-side)
- Never expose private API keys in frontend code
- Consider rate limiting for production use
- Monitor EmailJS usage in their dashboard

## Alternative Solutions

### 1. Formspree (Simple)
```javascript
// Replace EmailJS with Formspree
<form action="https://formspree.io/f/your-form-id" method="POST">
```

### 2. Netlify Forms (If using Netlify)
```html
<form name="contact" method="POST" data-netlify="true">
```

### 3. Custom Backend
- Node.js + Express + Nodemailer
- Serverless functions (Vercel, Netlify)
- Firebase Functions

## Support
If you need help setting up the contact form, reach out to us at support@easytimestamps.com!
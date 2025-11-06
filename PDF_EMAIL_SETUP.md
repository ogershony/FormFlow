# PDF Generation & Email Notification Setup

This document describes the PDF generation and email notification features added to FormFlow.

## Features

### 1. Automatic PDF Generation
When a patient submits a registration form, a PDF is automatically generated containing all their information in a clean, professional format similar to the practice's existing forms.

### 2. Email Notifications
After each form submission, an email is automatically sent to `info@redmonddentalsmiles.com` (configurable) containing:
- Patient name and submission details
- Complete patient registration PDF as an attachment
- Link to view the full submission in the admin dashboard

### 3. Manual PDF Download
Staff can download a PDF of any submission from:
- The admin dashboard (PDF button next to each submission)
- The submission detail page (Download PDF button in the header)

## Setup Instructions

### 1. Install Dependencies

The required packages are already installed:
- `@react-pdf/renderer` - PDF generation library optimized for React/Next.js
- `resend` - Email service

### 2. Configure Resend Email Service

#### Step 1: Create a Resend Account
1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. The free tier includes:
   - 3,000 emails/month
   - 100 emails/day
   - Perfect for patient registration notifications

#### Step 2: Get Your API Key
1. Log in to [resend.com](https://resend.com/api-keys)
2. Create a new API key
3. Copy the API key (starts with `re_`)

#### Step 3: (Optional) Add Your Domain
For production use with a custom "from" email address:
1. Go to [Domains](https://resend.com/domains) in Resend
2. Add your domain (e.g., `redmonddentalsmiles.com`)
3. Add the required DNS records to your domain
4. Wait for verification (usually takes a few minutes)

**Note:** For testing, you can use Resend's default domain `onboarding@resend.dev`

#### Step 4: Update Environment Variables
Add these variables to your `.env.local` file:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_your_actual_api_key_here

# Email address to receive notifications
NOTIFICATION_EMAIL=info@redmonddentalsmiles.com

# From email address
# For testing: onboarding@resend.dev
# For production: noreply@redmonddentalsmiles.com (requires domain verification)
FROM_EMAIL=onboarding@resend.dev
```

### 3. Configure Site URL

Update the `NEXT_PUBLIC_SITE_URL` in your `.env.local`:

```bash
# Development
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Production
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
```

This URL is used in the email to create clickable links to view submissions.

## Testing

### Test Email Functionality

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Submit a test form through the patient registration page

3. Check the console logs:
   - If email is configured correctly, you'll see a success message
   - If not configured, you'll see a warning (form still submits successfully)

4. Check your email inbox for the notification with PDF attachment

### Test PDF Generation

1. Go to the admin dashboard: `http://localhost:3000/admin/dashboard`

2. Click the "PDF" button next to any submission

3. The PDF should download automatically

4. Verify that the PDF contains:
   - Practice header information
   - All patient demographics
   - Contact information
   - Insurance details
   - Medical history
   - Consent signatures (noted as "on file")

## Email Configuration Options

### Default Configuration
- **Recipient:** `info@redmonddentalsmiles.com`
- **From (Testing):** `onboarding@resend.dev`
- **From (Production):** Custom domain required

### Production Configuration

For production, you should:
1. Verify your domain in Resend
2. Update `FROM_EMAIL` to use your domain (e.g., `noreply@redmonddentalsmiles.com`)
3. Test email deliverability to ensure emails don't go to spam

Example production `.env.local`:
```bash
RESEND_API_KEY=re_your_production_api_key
NOTIFICATION_EMAIL=info@redmonddentalsmiles.com
FROM_EMAIL=noreply@redmonddentalsmiles.com
NEXT_PUBLIC_SITE_URL=https://formflow.redmonddentalsmiles.com
```

## Troubleshooting

### Emails Not Sending

**Issue:** Emails are not being received

**Solutions:**
1. Check that `RESEND_API_KEY` is set in `.env.local`
2. Verify the API key is correct in your Resend dashboard
3. Check Resend dashboard for email logs and delivery status
4. Verify the recipient email is correct
5. Check spam/junk folder

### PDF Generation Errors

**Issue:** PDF download fails or shows errors

**Solutions:**
1. Check browser console for error messages
2. Verify the submission exists (check row index)
3. Check server logs for detailed error information
4. Ensure `@react-pdf/renderer` package is installed: `npm install @react-pdf/renderer`

### "FROM_EMAIL" Domain Not Verified

**Issue:** Emails fail with domain verification error

**Solutions:**
1. Use the default `onboarding@resend.dev` for testing
2. Verify your domain in Resend dashboard
3. Add the required DNS records to your domain
4. Wait for verification (can take 5-30 minutes)

## Features in Detail

### PDF Format
The generated PDF includes:
- **Page 1:** Patient demographics, contact info, emergency contact, employment, spouse info, referral
- **Page 2:** Insurance information, dental history, medical history
- **Page 3:** Medications, allergies, medical conditions, special questions, premedication, pharmacy, consent signatures, staff notes

### Email Template
The email notification includes:
- Professional HTML template with practice branding
- Patient name and submission ID
- Submission timestamp
- Link to view full submission in admin dashboard
- PDF attachment with patient information
- Practice contact information in footer

## Cost Estimate

### Resend Pricing
- **Free Tier:** 3,000 emails/month, 100/day - $0
- **Pay As You Go:** $1 per 1,000 emails after free tier
- **Pro Plan:** $20/month for 50,000 emails

For typical dental practice volumes (5-20 new patients/month), the free tier is sufficient.

## Security Considerations

1. **API Keys:** Never commit `.env.local` to version control
2. **Email Content:** Patient information is sent via secure SMTP
3. **PDF Attachments:** Contains PHI - ensure Resend account is HIPAA compliant if required
4. **Access Control:** Only authenticated admin users can download PDFs

## Support

For issues or questions:
1. Check Resend documentation: https://resend.com/docs
2. Review server logs for detailed error messages
3. Check the Resend dashboard for email delivery logs
4. Verify all environment variables are set correctly

# Dental Patient Registration MVP - Setup Guide

This guide will help you set up and deploy the dental patient registration application.

## Prerequisites

- Node.js 18+ installed
- A Google Cloud Platform account
- A Google account for Google Sheets and Drive
- Vercel account (for deployment)

## Step 1: Google Cloud Platform Setup

### 1.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 1.2 Enable Required APIs

Enable the following APIs for your project:
- Google Sheets API
- Google Drive API

To enable:
1. Go to "APIs & Services" > "Library"
2. Search for each API and click "Enable"

### 1.3 Create a Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: `dental-registration-app`
   - Role: Editor
4. Click "Done"

### 1.4 Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose JSON format
5. Download the key file (keep this secure!)

From the downloaded JSON file, you'll need:
- `client_email`
- `private_key`

## Step 2: Google Sheets Setup

### 2.1 Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Patient Registration Submissions"
4. Create a sheet named "Submissions"
5. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[THIS-IS-YOUR-SHEET-ID]/edit
   ```

### 2.2 Share Sheet with Service Account

1. Click the "Share" button
2. Add the service account email (from the JSON key file)
3. Give it "Editor" permissions
4. Click "Send"

## Step 3: Google Drive Setup

### 3.1 Create a Folder for Insurance Cards

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named "Patient Insurance Cards"
3. Copy the folder ID from the URL:
   ```
   https://drive.google.com/drive/folders/[THIS-IS-YOUR-FOLDER-ID]
   ```

### 3.2 Share Folder with Service Account

1. Right-click the folder > "Share"
2. Add the service account email
3. Give it "Editor" permissions
4. Click "Send"

## Step 4: Local Development Setup

### 4.1 Clone and Install

```bash
cd dental-registration-mvp
npm install
```

### 4.2 Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and fill in the values:

```env
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id-here
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id-here
ADMIN_PASSWORD_HASH=$2a$10$...your-bcrypt-hash-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4.3 Generate Admin Password Hash

Run this command to generate a password hash (replace 'your-password'):

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

Copy the output and paste it as the value for `ADMIN_PASSWORD_HASH` in `.env.local`

### 4.4 Initialize Google Sheet

The Google Sheet will be automatically initialized with headers when the first form is submitted. Alternatively, you can manually add these column headers to row 1:

```
Timestamp | Status | Patient_Name | DOB | Address | City | State | Zip | Email | Phone_Home | Phone_Cell | Phone_Work | Emergency_Contact | Emergency_Phone | Insurance_Company | Insurance_Group | Insurance_ID | Subscriber_Name | Insurance_Card_Front | Insurance_Card_Back | Medical_Conditions | Medications | Allergies | Signature_Data | Notes
```

### 4.5 Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## Step 5: Testing

### 5.1 Test Patient Form

1. Go to http://localhost:3000
2. Click "Start Registration"
3. Fill out all four steps
4. Submit the form
5. Check your Google Sheet for the submission

### 5.2 Test Admin Dashboard

1. Go to http://localhost:3000/admin/login
2. Enter the admin password you configured
3. View submissions in the dashboard
4. Click on a submission to see details
5. Test the copy-to-clipboard functionality

## Step 6: Deploy to Vercel

### 6.1 Install Vercel CLI

```bash
npm i -g vercel
```

### 6.2 Login to Vercel

```bash
vercel login
```

### 6.3 Deploy

```bash
vercel --prod
```

### 6.4 Add Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Go to "Settings" > "Environment Variables"
3. Add all the environment variables from `.env.local`:
   - GOOGLE_SHEETS_CLIENT_EMAIL
   - GOOGLE_SHEETS_PRIVATE_KEY
   - GOOGLE_SHEET_ID
   - GOOGLE_DRIVE_FOLDER_ID
   - ADMIN_PASSWORD_HASH
   - NEXT_PUBLIC_SITE_URL (set to your Vercel domain)

4. Redeploy after adding variables:
   ```bash
   vercel --prod
   ```

## Step 7: Custom Domain (Optional)

### 7.1 Add Domain in Vercel

1. Go to your Vercel project
2. Go to "Settings" > "Domains"
3. Add your custom domain

### 7.2 Update DNS Records

Follow Vercel's instructions to update your DNS records

### 7.3 Update Environment Variable

Update `NEXT_PUBLIC_SITE_URL` to your custom domain

## Security Checklist

Before going live:

- [ ] Service account JSON key is stored securely (not in Git!)
- [ ] Google Sheet is only shared with service account
- [ ] Google Drive folder is only shared with service account
- [ ] Admin password is strong and securely stored
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Environment variables are set in Vercel (not exposed)
- [ ] `.env.local` is in `.gitignore`

## HIPAA Compliance

For HIPAA compliance:

1. **Use Google Workspace** instead of free Google account
2. **Sign a Business Associate Agreement (BAA)** with Google
3. **Enable 2-Factor Authentication** on all Google accounts
4. **Regular Access Audits** - review who has access to sheets/drive
5. **Regular Backups** - export sheet data periodically
6. **Access Logs** - enable Google Workspace audit logs

## Troubleshooting

### "Failed to save form data to Google Sheets"

- Verify service account email has Editor access to the sheet
- Check that GOOGLE_SHEET_ID is correct
- Verify GOOGLE_SHEETS_PRIVATE_KEY is properly formatted (with \n for newlines)

### "Failed to upload image to Google Drive"

- Verify service account has Editor access to the folder
- Check that GOOGLE_DRIVE_FOLDER_ID is correct
- Verify Google Drive API is enabled

### Admin login not working

- Verify ADMIN_PASSWORD_HASH is correctly generated
- Make sure you're using bcrypt hash, not plain password

### Form data not appearing in admin dashboard

- Check Google Sheet has correct headers
- Verify submissions are appearing in the sheet
- Check browser console for errors

## Support

For issues or questions:
1. Check the main README.md in the root directory
2. Review the Google Sheets and Drive setup
3. Check Vercel deployment logs
4. Ensure all environment variables are set correctly

## Daily Operations

### For Staff Using the App

1. **Patient arrives** - Hand them the iPad with the app open
2. **Patient completes form** - Takes 5-10 minutes
3. **Check dashboard** - Go to /admin/dashboard
4. **View submission** - Click "View Details"
5. **Copy data to Dentrix** - Use "Copy All" or individual copy buttons
6. **Mark as complete** - Change status to "Complete"

### Backing Up Data

Export your Google Sheet periodically:
1. Open the Google Sheet
2. File > Download > CSV
3. Store backup securely

### Monitoring

- Check Vercel dashboard for errors
- Review Google Sheet regularly for submissions
- Monitor Google Drive storage usage

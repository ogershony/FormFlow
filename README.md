# Dental Patient Registration MVP

> iPad-based digital patient registration system that eliminates paper forms and streamlines data entry into Dentrix.

![Status](https://img.shields.io/badge/status-MVP%20Complete-success)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Live Demo:** TBD
**Cost:** $6-12/month
**Setup Time:** ~30 minutes

---

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [Features](#-features)
- [Architecture](#-architecture)
- [Documentation](#-documentation)
- [Support](#-support)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Google account (free)
- 30 minutes for setup

### Installation

```bash
# Clone the repository
git clone https://github.com/ogershony/FormFlow.git
cd FormFlow

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials (see Configuration section)
```

### Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` to see the app!

---

## 💻 Installation

### 1. System Requirements

- **Node.js**: 18.0 or higher
- **npm**: 9.0 or higher
- **Browser**: Modern browser (Chrome, Safari, Firefox)

### 2. Install Dependencies

```bash
npm install
```

This installs:
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS (styling)
- React Hook Form + Zod (form validation)
- Google APIs (Sheets & Drive)
- bcrypt.js (password hashing)
- Additional UI components

### 3. Verify Installation

```bash
npm run build
```

If successful, you should see a `.next` folder created.

---

## ⚙️ Configuration

### Step 1: Google Cloud Setup (15 minutes)

#### 1.1 Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project"
3. Name it "Dental Registration"
4. Note your Project ID

#### 1.2 Enable APIs

Enable these APIs in your project:
- **Google Sheets API**
- **Google Drive API**

Go to: APIs & Services → Library → Search → Enable

#### 1.3 Create Service Account

1. Go to: APIs & Services → Credentials
2. Click: Create Credentials → Service Account
3. Name: `dental-registration-service`
4. Role: Editor
5. Click "Done"

#### 1.4 Generate Key

1. Click on the service account
2. Go to "Keys" tab
3. Add Key → Create New Key → JSON
4. Download and save securely ⚠️

### Step 2: Google Sheets Setup (5 minutes)

#### 2.1 Create Sheet

1. Create a new [Google Sheet](https://sheets.google.com)
2. Name it "Patient Registration Submissions"
3. Create a sheet named "Submissions"
4. Copy the Sheet ID from URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID_HERE]/edit
   ```

#### 2.2 Share with Service Account

1. Click "Share" button
2. Add the service account email (from JSON key file)
3. Grant "Editor" access
4. Click "Send"

### Step 3: Google Drive Setup (5 minutes)

#### 3.1 Create Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create folder: "Patient Insurance Cards"
3. Copy the folder ID from URL:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID_HERE]
   ```

#### 3.2 Share with Service Account

1. Right-click folder → Share
2. Add service account email
3. Grant "Editor" access
4. Click "Send"

### Step 4: Environment Variables

#### 4.1 Generate Admin Password Hash

```bash
node -e "console.log(require('bcryptjs').hashSync('YOUR_PASSWORD_HERE', 10))"
```

Copy the output (starts with `$2a$10$...`)

#### 4.2 Configure .env.local

Edit `.env.local` with your values:

```env
# Google Sheets API
GOOGLE_SHEETS_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID=your-google-sheet-id-here

# Google Drive API
GOOGLE_DRIVE_FOLDER_ID=your-google-drive-folder-id-here

# Admin Authentication
ADMIN_PASSWORD_HASH=$2a$10$...your-bcrypt-hash-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Getting values from JSON key:**
- `GOOGLE_SHEETS_CLIENT_EMAIL`: Copy `client_email` field
- `GOOGLE_SHEETS_PRIVATE_KEY`: Copy `private_key` field (keep the quotes and `\n`)

---

## 🌐 Deployment

### Deploy to Vercel (Recommended - Free)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate.

#### 3. Deploy

```bash
vercel --prod
```

#### 4. Add Environment Variables

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to: Settings → Environment Variables
4. Add each variable from `.env.local`:
   - `GOOGLE_SHEETS_CLIENT_EMAIL`
   - `GOOGLE_SHEETS_PRIVATE_KEY`
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_DRIVE_FOLDER_ID`
   - `ADMIN_PASSWORD_HASH`
   - `NEXT_PUBLIC_SITE_URL` (set to your Vercel URL)

#### 5. Redeploy

```bash
vercel --prod
```

Your app is now live! 🎉

### Custom Domain (Optional)

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` in environment variables
5. SSL certificate is automatically provisioned

---

## ✨ Features

### Patient-Facing Features
- ✅ **4-Step Progressive Form** - Easy-to-follow registration process
- ✅ **Auto-Save** - Never lose progress with automatic localStorage saves
- ✅ **Insurance Card Capture** - Take photos with device camera
- ✅ **Digital Signatures** - Canvas-based signature capture
- ✅ **iPad Optimized** - Large touch targets (44px minimum)
- ✅ **Form Validation** - Real-time error checking
- ✅ **Medical History** - Complete 50+ condition checklist
- ✅ **Mobile Responsive** - Works on all devices

### Admin Dashboard
- ✅ **Secure Login** - Password-protected admin access
- ✅ **Submissions List** - View all patient registrations
- ✅ **Status Tracking** - New → In Progress → Complete workflow
- ✅ **Copy to Clipboard** - Quick data transfer to Dentrix
- ✅ **Search & Filter** - Find patients quickly
- ✅ **Insurance Card Viewing** - View uploaded photos
- ✅ **Stats Dashboard** - Track daily submissions

### Technical Features
- ✅ **Google Sheets Integration** - All data saved automatically
- ✅ **Google Drive Storage** - Insurance cards stored securely
- ✅ **TypeScript** - Type-safe codebase
- ✅ **Zod Validation** - Schema-based form validation
- ✅ **HIPAA Ready** - Secure architecture (requires Google Workspace BAA)
- ✅ **No Database Required** - Uses Google Sheets as database
- ✅ **Zero Cost Hosting** - Free tier on Vercel

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form + Zod

**Backend:**
- Next.js API Routes (serverless)
- Google Sheets API (database)
- Google Drive API (file storage)
- bcrypt.js (authentication)

**Hosting:**
- Vercel (free tier)
- Automatic HTTPS
- Global CDN

### System Architecture

```
┌─────────────────┐
│   iPad Browser  │
│  (Patient View) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel Hosting │
│   (Next.js App) │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ Google Sheets│   │ Google Drive │
│   (Patient   │   │  (Insurance  │
│    Data)     │   │   Card Pics) │
└──────────────┘   └──────────────┘
         │                 │
         └────────┬────────┘
                  ▼
         ┌─────────────────┐
         │ Staff Dashboard │
         │ (Admin View)    │
         └─────────────────┘
```

---

## 📚 Documentation

### Project Structure

```
FormFlow/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Home/landing page
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   ├── form/                  # Patient form pages
│   │   ├── step-1-info/
│   │   ├── step-2-insurance/
│   │   ├── step-3-medical/
│   │   ├── step-4-consent/
│   │   └── complete/
│   ├── admin/                 # Admin dashboard
│   │   ├── login/
│   │   ├── dashboard/
│   │   └── submission/[id]/
│   └── api/                   # API routes
│       ├── submit-form/
│       ├── submissions/
│       ├── submission/[id]/
│       └── admin/login/
├── components/                # React components
│   ├── ui/                   # shadcn/ui components
│   └── PatientForm/          # Custom form components
├── lib/                       # Utility functions
│   ├── schemas.ts            # Zod validation schemas
│   ├── google-sheets.ts      # Google Sheets integration
│   ├── google-drive.ts       # Google Drive integration
│   ├── auth.ts               # Authentication
│   └── utils.ts              # Helpers
├── data/                      # Static data
│   ├── medical-conditions.ts
│   └── form-text.ts
├── SETUP.md                   # Detailed setup guide
├── .env.example              # Environment template
└── package.json              # Dependencies
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

See `.env.example` for all required variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GOOGLE_SHEETS_CLIENT_EMAIL` | Service account email | Yes |
| `GOOGLE_SHEETS_PRIVATE_KEY` | Service account private key | Yes |
| `GOOGLE_SHEET_ID` | Google Sheet ID | Yes |
| `GOOGLE_DRIVE_FOLDER_ID` | Google Drive folder ID | Yes |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password | Yes |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site | Yes |

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/submit-form` | POST | Submit patient registration form |
| `/api/submissions` | GET | Get all submissions |
| `/api/submission/[id]` | GET | Get single submission |
| `/api/submission/[id]` | PATCH | Update submission status |
| `/api/admin/login` | POST | Admin login |

---

## 📖 Usage

### For Patients

1. Visit the homepage
2. Click "Start Registration"
3. Complete all 4 steps:
   - Personal information
   - Insurance details
   - Medical history
   - Consent & signatures
4. Submit the form
5. Return iPad to staff

**Time:** 5-10 minutes

### For Staff

#### Daily Workflow

1. **Patient arrives** → Hand them the iPad
2. **Patient completes** → Form auto-saves every change
3. **Check dashboard** → Go to `/admin/dashboard`
4. **View submission** → Click "View Details"
5. **Copy to Dentrix** → Use individual or "Copy All" buttons
6. **Update status** → Mark as "Complete"

#### Admin Dashboard

**Login:**
- URL: `/admin/login`
- Password: Set during configuration

**Features:**
- View all submissions
- Filter by status (New/In Progress/Complete)
- Search by name, email, or phone
- Copy patient data to clipboard
- View insurance card photos
- Track daily statistics

---

## 🔒 Security & HIPAA Compliance

### Built-in Security

- ✅ HTTPS enforced (Vercel default)
- ✅ Password-protected admin access (bcrypt)
- ✅ Service account authentication for APIs
- ✅ Environment variables for secrets
- ✅ No PHI stored in browser (cleared on submit)
- ✅ HTTP-only cookies for sessions

### HIPAA Compliance Checklist

For full HIPAA compliance:

- [ ] **Upgrade to Google Workspace** (required for BAA)
- [ ] **Sign Business Associate Agreement** with Google
- [ ] **Enable 2-Factor Authentication** on all Google accounts
- [ ] **Implement Access Logs** (Google Workspace audit logs)
- [ ] **Regular Security Audits** (review access quarterly)
- [ ] **Staff Training** on PHI handling
- [ ] **Backup Strategy** (export sheet data weekly)
- [ ] **Incident Response Plan** documented

**Cost for HIPAA:** $6-12/month (Google Workspace)

---

## 💰 Cost Breakdown

| Item | Cost | Notes |
|------|------|-------|
| Vercel Hosting | **$0** | Free tier (100GB bandwidth) |
| Google Workspace | **$6-12/mo** | Required for HIPAA BAA |
| Custom Domain | **$12/year** | Optional |
| **Total Monthly** | **$6-12** | 76% cheaper than typical solutions |

**Comparison:**
- Traditional solution: $50-100/month
- This MVP: $6-12/month
- **Savings:** $44-88/month ($528-1,056/year)

---

## 🛠️ Troubleshooting

### Common Issues

#### "Failed to save form data to Google Sheets"

**Cause:** Service account doesn't have access to sheet

**Solution:**
1. Verify service account email has Editor access
2. Check `GOOGLE_SHEET_ID` is correct
3. Verify `GOOGLE_SHEETS_PRIVATE_KEY` has `\n` for newlines

#### "Failed to upload image to Google Drive"

**Cause:** Service account doesn't have access to folder

**Solution:**
1. Verify service account has Editor access to folder
2. Check `GOOGLE_DRIVE_FOLDER_ID` is correct
3. Ensure Google Drive API is enabled

#### Admin login not working

**Cause:** Incorrect password hash

**Solution:**
1. Regenerate hash: `node -e "console.log(require('bcryptjs').hashSync('password', 10))"`
2. Update `ADMIN_PASSWORD_HASH` in `.env.local`
3. Restart dev server

#### Images not displaying

**Cause:** Next.js image domain not configured

**Solution:**
1. Add `drive.google.com` to `next.config.js` domains
2. Rebuild and restart

### Getting Help

1. Check [SETUP.md](./SETUP.md) for detailed instructions
2. Review error messages in browser console
3. Check Vercel deployment logs
4. Verify all environment variables are set

---

## 🤝 Support

### Resources

- **Detailed Setup Guide:** [SETUP.md](./SETUP.md)
- **Google Cloud Console:** [console.cloud.google.com](https://console.cloud.google.com/)
- **Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)

### Contact

For questions or issues:
- Create an issue on GitHub
- Email: support@redmonddentalsmiles.com

---

## 📝 Development Checklist

### MVP Complete ✅

- [x] Set up Next.js project
- [x] Configure Tailwind CSS + shadcn/ui
- [x] Set up Google Sheets API connection
- [x] Set up Google Drive API connection
- [x] Create basic page routing
- [x] Build Step 1: Patient Info form
- [x] Build Step 2: Insurance form
- [x] Build Step 3: Medical History form
- [x] Build Step 4: Consent & Signatures
- [x] Implement form validation (Zod)
- [x] Add progress indicator
- [x] Implement auto-save to localStorage
- [x] Build admin login page
- [x] Build submissions list view
- [x] Build submission detail view
- [x] Implement copy-to-clipboard functionality
- [x] Add status update feature
- [x] Add search/filter functionality
- [x] Add insurance card image upload
- [x] Add signature capture
- [x] Optimize for iPad Safari
- [x] Deploy to Vercel

### Future Enhancements

- [ ] Email notifications for new submissions
- [ ] SMS reminders for appointments
- [ ] Multi-language support (Spanish)
- [ ] Export to Dentrix format
- [ ] Analytics dashboard
- [ ] Automated insurance verification
- [ ] Patient portal access
- [ ] Mobile app version

---

## 📄 License

MIT License - See LICENSE file for details

---

## 👏 Acknowledgments

Built for **Redmond Dental Smiles**
- Dr. Malinda Lam-Gershony, DDS
- 16710 NE 79th ST, Suite 100
- Redmond, WA 98052
- (425) 867-1484

**Technologies:**
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Vercel](https://vercel.com/)

---

<div align="center">

**Made with ❤️ for better dental care**

[⬆ Back to Top](#dental-patient-registration-mvp)

</div>

---

# Technical Specification (Original)

## **Updated Tech Stack (Simplified & Cost-Effective)**

### **Frontend**
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui (for form components)
- **Form Management:** React Hook Form + Zod validation
- **Image Handling:** Browser native Camera API / File upload
- **Hosting:** Vercel (Free tier)

**Why Next.js?**
- Free hosting on Vercel with automatic HTTPS
- Built-in API routes (no separate backend needed)
- Server-side rendering for fast initial loads
- Perfect for iPad Safari

### **Backend/Database**
- **Database:** Google Sheets (via Google Sheets API)
- **Authentication:** Simple password-protected admin dashboard
- **File Storage:** Google Drive API (for insurance card photos)
- **API Routes:** Next.js API routes (serverless functions on Vercel)

**Why Google Sheets?**
- ✅ $0 cost (free Google account)
- ✅ No database setup needed
- ✅ Staff can view/edit data in familiar interface
- ✅ Easy CSV export for backup
- ✅ Built-in search and filter
- ✅ Can share with team members
- ✅ Automatically HIPAA-compliant if using Google Workspace

### **File Management**
- **Insurance Cards:** Uploaded to Google Drive folder
- **Stored in Sheet:** Link to Drive file + thumbnail preview
- **Access:** Shared only with practice staff

---

## **System Architecture**

```
┌─────────────────┐
│   iPad Browser  │
│  (Patient View) │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  Vercel Hosting │
│   (Next.js App) │
└────────┬────────┘
         │
         ├─────────────────┐
         │                 │
         ▼                 ▼
┌──────────────┐   ┌──────────────┐
│ Google Sheets│   │ Google Drive │
│   (Patient   │   │  (Insurance  │
│    Data)     │   │   Card Pics) │
└──────────────┘   └──────────────┘
         │                 │
         └────────┬────────┘
                  ▼
         ┌─────────────────┐
         │ Staff Dashboard │
         │ (Admin View)    │
         └─────────────────┘
```

---

## **Google Sheets Structure**

### **Sheet 1: Patient Submissions**

| Column | Description | Example |
|--------|-------------|---------|
| Timestamp | Auto-generated | 2024-11-04 10:23 AM |
| Status | New/In Progress/Complete | New |
| Patient_Name | Full name | John Smith |
| DOB | Date of birth | 01/15/1980 |
| Address | Street address | 123 Main St |
| City | City | Redmond |
| State | State | WA |
| Zip | ZIP code | 98052 |
| Email | Email address | john@example.com |
| Phone_Home | Home phone | 425-555-0123 |
| Phone_Cell | Cell phone | 425-555-0124 |
| Phone_Work | Work phone | 425-555-0125 |
| Emergency_Contact | Name | Jane Smith |
| Emergency_Phone | Phone | 425-555-0126 |
| Insurance_Company | Insurance name | Delta Dental |
| Insurance_Group | Group number | 12345 |
| Insurance_ID | Member ID | ABC123456789 |
| Subscriber_Name | If different from patient | Same |
| Insurance_Card_Front | Google Drive link | drive.google.com/... |
| Insurance_Card_Back | Google Drive link | drive.google.com/... |
| Medical_Conditions | Comma-separated | Diabetes, High BP |
| Medications | Text list | Metformin 500mg, Lisinopril 10mg |
| Allergies | Comma-separated | Penicillin, Latex |
| Signature_Data | Base64 or Drive link | data:image/png... |
| Notes | Staff notes field | Verified insurance |

### **Sheet 2: Medical History Checkboxes**
*(Separate sheet to keep main sheet clean)*

| Submission_ID | Condition | Checked |
|---------------|-----------|---------|
| 001 | AIDS/HIV | No |
| 001 | Anemia | No |
| 001 | Arthritis | Yes |
| 001 | Asthma | No |
| ... | ... | ... |

---

## **Application Structure**

### **Patient-Facing Pages**

```
/
├── / (home/start page)
├── /form/step-1-info (patient info)
├── /form/step-2-insurance (insurance)
├── /form/step-3-medical (medical history)
├── /form/step-4-consent (signatures)
└── /form/complete (thank you page)
```

### **Staff-Facing Pages**

```
/admin
├── /admin/login (password protection)
├── /admin/dashboard (list all submissions)
├── /admin/submission/[id] (view single submission)
└── /admin/settings (config)
```

### **API Routes**

```
/api
├── /api/submit-form (POST - save patient data)
├── /api/upload-image (POST - upload insurance card)
├── /api/submissions (GET - fetch all submissions)
├── /api/submission/[id] (GET/PATCH - view/update status)
└── /api/sheets-health (GET - check Google Sheets connection)
```

---

## **Frontend Component Breakdown**

### **Patient Form Components**

```
<PatientForm>
  ├── <ProgressBar /> (shows step 1 of 4)
  ├── <FormStep1> (Patient Info)
  │   ├── <TextInput label="Full Legal Name" />
  │   ├── <DateInput label="Date of Birth" />
  │   ├── <AddressInput /> (auto-complete)
  │   ├── <PhoneInput /> (formatted)
  │   └── <EmailInput />
  ├── <FormStep2> (Insurance)
  │   ├── <Toggle "Do you have insurance?" />
  │   ├── <TextInput label="Insurance Company" />
  │   ├── <ImageCapture label="Front of Card" />
  │   ├── <ImageCapture label="Back of Card" />
  │   └── <SignaturePad label="Authorization" />
  ├── <FormStep3> (Medical History)
  │   ├── <CheckboxGroup conditions={CONDITIONS} />
  │   ├── <TextArea label="Current Medications" />
  │   └── <CheckboxGroup label="Allergies" />
  └── <FormStep4> (Consent)
      ├── <TextDisplay policy={FINANCIAL_POLICY} />
      ├── <TextDisplay policy={HIPAA_NOTICE} />
      └── <SignaturePad label="Patient Signature" />
```

### **Staff Dashboard Components**

```
<AdminDashboard>
  ├── <StatsBar> (Today: 3 new, 2 pending, 5 completed)
  ├── <FilterBar> (Filter by status, date, search)
  ├── <SubmissionTable>
  │   └── <SubmissionRow>
  │       ├── Status Badge
  │       ├── Patient Name
  │       ├── Timestamp
  │       ├── Quick Actions (View, Copy All, Mark Complete)
  └── <SubmissionDetail>
      ├── <CopyableField field="name" />
      ├── <CopyableField field="dob" />
      ├── <ImageViewer src={insuranceCardFront} />
      ├── <CheckboxHistory conditions={medicalHistory} />
      └── <StatusUpdater />
```

---

## **Key Features Detailed**

### **1. Progressive Form (Patient View)**

**Mobile-First Design:**
- One question per screen on mobile
- 2-3 questions per screen on tablet
- Large touch targets (minimum 44x44px)
- Auto-advance on completion

**Smart Features:**
- Auto-save to localStorage every 30 seconds
- Resume incomplete forms
- Address autocomplete (Google Places API or simple city/state)
- Phone number formatting (auto-add dashes)
- Date picker optimized for birthdays

**Insurance Card Capture:**
```javascript
// Two options for image capture
Option 1: Camera (if device has camera)
  - Native camera API
  - Preview before submit
  - Compress to <2MB

Option 2: File upload (iPad file picker)
  - Accept: image/*
  - Preview thumbnail
  - Upload to Google Drive via API
```

**Signature Capture:**
- Canvas-based signature pad
- Clear/redo option
- Save as PNG (base64 or Drive link)

### **2. Staff Dashboard**

**Main View:**
```
┌─────────────────────────────────────────────┐
│  New Patient Submissions                     │
├─────────────────────────────────────────────┤
│  🟡 John Smith    | 10:23 AM | [View] [Copy All] [Complete] │
│  🟡 Jane Doe      | 10:45 AM | [View] [Copy All] [Complete] │
│  🔵 Bob Johnson   | 9:30 AM  | [View] [Copy All] [Complete] │
│  🟢 Mary Williams | 9:00 AM  | [View]           [Completed] │
└─────────────────────────────────────────────┘
```

**Detail View (Copy-Optimized):**
```
┌─────────────────────────────────────────────┐
│  Patient: John Smith                   📋 Copy All │
├─────────────────────────────────────────────┤
│  Full Name:     John Smith            [📋]  │
│  DOB:           01/15/1980            [📋]  │
│  Address:       123 Main St           [📋]  │
│  City:          Redmond               [📋]  │
│  State:         WA                    [📋]  │
│  ZIP:           98052                 [📋]  │
│  Email:         john@example.com      [📋]  │
│  Home Phone:    (425) 555-0123        [📋]  │
│  Cell Phone:    (425) 555-0124        [📋]  │
│                                              │
│  Insurance Company: Delta Dental      [📋]  │
│  Group #:       12345                 [📋]  │
│  ID #:          ABC123456789          [📋]  │
│                                              │
│  [View Insurance Card Front]                │
│  [View Insurance Card Back]                 │
│                                              │
│  Medical Conditions:                        │
│  ✓ Diabetes                                 │
│  ✓ High Blood Pressure                      │
│                                              │
│  Current Medications:                [📋]  │
│  - Metformin 500mg daily                    │
│  - Lisinopril 10mg daily                    │
│                                              │
│  Status: [New ▼] [Mark as Complete]        │
└─────────────────────────────────────────────┘
```

**Copy All Button:**
Copies formatted text to clipboard:
```
Name: John Smith
DOB: 01/15/1980
Address: 123 Main St, Redmond, WA 98052
Email: john@example.com
Home: (425) 555-0123
Cell: (425) 555-0124
Insurance: Delta Dental
Group: 12345
ID: ABC123456789
```

---

## **Google Sheets API Integration**

### **Setup Steps**

1. **Create Google Cloud Project**
   - Enable Google Sheets API
   - Enable Google Drive API
   - Create Service Account
   - Download credentials JSON

2. **Create Google Sheet**
   - Share with service account email
   - Give "Editor" permissions
   - Note Sheet ID from URL

3. **Environment Variables** (.env.local)
```bash
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
GOOGLE_SHEETS_CLIENT_EMAIL="dental-app@project.iam.gserviceaccount.com"
GOOGLE_SHEET_ID="1abc...xyz"
GOOGLE_DRIVE_FOLDER_ID="1folder...id"
ADMIN_PASSWORD_HASH="$2a$10$..." # bcrypt hash
NEXT_PUBLIC_SITE_URL="https://patients.redmonddentalsmiles.com"
```

### **Code Example: Write to Sheets**

```javascript
// /api/submit-form.js
import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { patientData } = req.body;

  // Initialize Google Sheets API
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  // Prepare row data
  const row = [
    new Date().toISOString(),
    'New',
    patientData.fullName,
    patientData.dob,
    patientData.address,
    patientData.city,
    patientData.state,
    patientData.zip,
    patientData.email,
    patientData.phoneHome,
    patientData.phoneCell,
    patientData.phoneWork,
    patientData.emergencyContact,
    patientData.emergencyPhone,
    patientData.insuranceCompany,
    patientData.insuranceGroup,
    patientData.insuranceId,
    patientData.subscriberName,
    patientData.insuranceCardFrontUrl,
    patientData.insuranceCardBackUrl,
    patientData.medicalConditions.join(', '),
    patientData.medications,
    patientData.allergies.join(', '),
    patientData.signatureUrl,
    ''
  ];

  try {
    // Append row to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A:Z',
      valueInputOption: 'RAW',
      resource: {
        values: [row],
      },
    });

    res.status(200).json({ success: true, message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error writing to Google Sheets:', error);
    res.status(500).json({ error: 'Failed to save form data' });
  }
}
```

### **Code Example: Upload to Google Drive**

```javascript
// /api/upload-image.js
import { google } from 'googleapis';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable();
  const [fields, files] = await form.parse(req);
  const file = files.image[0];

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive'],
  });

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.create({
      requestBody: {
        name: `insurance_card_${Date.now()}.jpg`,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID],
      },
      media: {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.filepath),
      },
    });

    // Make file accessible to anyone with link
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const fileUrl = `https://drive.google.com/file/d/${response.data.id}/view`;

    res.status(200).json({ 
      success: true, 
      fileId: response.data.id,
      fileUrl: fileUrl 
    });
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
}
```

---

## **Security Considerations**

### **Authentication**
- Admin dashboard protected by password
- Simple bcrypt-hashed password check
- No user accounts needed (single practice)
- Session stored in HTTP-only cookie

### **Data Protection**
- All traffic over HTTPS (Vercel default)
- Google Sheets shared only with service account
- Google Drive folder private (accessible via links only)
- No patient data in browser localStorage (clear on submit)

### **HIPAA Compliance**
- Use Google Workspace (has BAA available)
- Sign Business Associate Agreement with Google
- Enable 2FA on Google account
- Regular access audits

---

## **Cost Breakdown**

| Item | Cost |
|------|------|
| Vercel Hosting | $0 (free tier) |
| Google Workspace (for HIPAA BAA) | $6/user/month* |
| Domain (optional) | $12/year |
| **Total Monthly** | **$6-12/month** |

*Can use free Google account initially, upgrade to Workspace for HIPAA compliance

**Compare to original estimate:** $25/month → **$6/month** (76% savings!)

---

## **Development Plan**

### **Week 1: Foundation**
- [ ] Set up Next.js project
- [ ] Configure Tailwind CSS + shadcn/ui
- [ ] Set up Google Sheets API connection
- [ ] Set up Google Drive API connection
- [ ] Create basic page routing

### **Week 2: Patient Form**
- [ ] Build Step 1: Patient Info form
- [ ] Build Step 2: Insurance form
- [ ] Build Step 3: Medical History form
- [ ] Build Step 4: Consent & Signatures
- [ ] Implement form validation (Zod)
- [ ] Add progress indicator
- [ ] Implement auto-save to localStorage

### **Week 3: Staff Dashboard**
- [ ] Build admin login page
- [ ] Build submissions list view
- [ ] Build submission detail view
- [ ] Implement copy-to-clipboard functionality
- [ ] Add status update feature
- [ ] Add search/filter functionality

### **Week 4: Polish & Testing**
- [ ] Add insurance card image upload
- [ ] Add signature capture
- [ ] Optimize for iPad Safari
- [ ] Test on actual iPad
- [ ] Deploy to Vercel
- [ ] Test with staff

---

## **File Structure**

```
dental-registration-mvp/
├── public/
│   ├── favicon.ico
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── layout.js
│   │   ├── page.js (home/start)
│   │   ├── form/
│   │   │   ├── step-1-info/page.js
│   │   │   ├── step-2-insurance/page.js
│   │   │   ├── step-3-medical/page.js
│   │   │   ├── step-4-consent/page.js
│   │   │   └── complete/page.js
│   │   ├── admin/
│   │   │   ├── login/page.js
│   │   │   ├── dashboard/page.js
│   │   │   └── submission/[id]/page.js
│   │   └── api/
│   │       ├── submit-form/route.js
│   │       ├── upload-image/route.js
│   │       ├── submissions/route.js
│   │       └── submission/[id]/route.js
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   ├── PatientForm/
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── TextInput.jsx
│   │   │   ├── PhoneInput.jsx
│   │   │   ├── DateInput.jsx
│   │   │   ├── AddressInput.jsx
│   │   │   ├── ImageCapture.jsx
│   │   │   ├── SignaturePad.jsx
│   │   │   └── CheckboxGroup.jsx
│   │   └── Admin/
│   │       ├── SubmissionTable.jsx
│   │       ├── SubmissionRow.jsx
│   │       ├── SubmissionDetail.jsx
│   │       ├── CopyableField.jsx
│   │       ├── ImageViewer.jsx
│   │       └── StatusUpdater.jsx
│   ├── lib/
│   │   ├── google-sheets.js (helper functions)
│   │   ├── google-drive.js (helper functions)
│   │   └── utils.js
│   └── data/
│       ├── medical-conditions.js
│       ├── allergies.js
│       └── form-text.js (policies, disclaimers)
├── .env.local
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## **Deployment Steps**

### **1. Vercel Setup**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

### **2. Environment Variables in Vercel**
- Go to project settings
- Add all environment variables from .env.local
- Redeploy

### **3. Custom Domain (Optional)**
- Add domain in Vercel dashboard
- Update DNS records
- SSL certificate auto-provisioned

---

## **User Guide for Staff**

### **Daily Workflow**

1. **Patient arrives**
   - Hand them iPad
   - Show them how to start: "Just tap 'Start Registration'"

2. **Patient completes form**
   - Takes 5-10 minutes
   - They return iPad when done

3. **Staff receives notification** (or checks dashboard)
   - Open admin dashboard
   - See new submission in list

4. **Staff enters into Dentrix**
   - Click "View" on submission
   - Open Dentrix
   - Click copy button for each field
   - Paste into Dentrix
   - Mark as "Complete" when done

5. **End of day**
   - Review completed submissions
   - File insurance card photos if needed

---

## **Next Steps to Start Development**

1. **Confirm requirements** with your mom
2. **Set up Google Cloud project** (15 min)
3. **Create Google Sheet** with columns above (10 min)
4. **Initialize Next.js project** (5 min)
5. **Start coding!**

---

## **Questions to Answer Before Building**

- [ ] Does the practice have iPads already, or need to purchase?
- [ ] How many concurrent patients need to fill forms? (affects # of iPads)
- [ ] What's the practice's current Google Workspace status?
- [ ] Who will maintain this after launch? (your mom's office vs you)
- [ ] Any specific medical conditions from the form that need special handling?
- [ ] Does the practice want email notifications when forms are submitted?

---

**Estimated Total Development Time:** 3-4 weeks (part-time)  
**Estimated Total Cost:** $6-12/month + one-time dev time  
**Complexity:** Low-to-Medium (perfect for MVP)

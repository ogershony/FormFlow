# Dental Patient Registration MVP - Technical Specification

## **Product Overview**
iPad-based digital patient registration system that eliminates paper forms and streamlines data entry into Dentrix.

---

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

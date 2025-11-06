import { google } from 'googleapis'
import type { CompleteFormData } from './schemas'

export async function getGoogleSheetsClient() {
  // Validate environment variables
  if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
    throw new Error('Missing GOOGLE_SHEETS_CLIENT_EMAIL environment variable')
  }
  if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
    throw new Error('Missing GOOGLE_SHEETS_PRIVATE_KEY environment variable')
  }
  if (!process.env.GOOGLE_SHEET_ID) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable')
  }

  // Handle private key formatting - support both escaped and actual newlines
  let privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY

  // If the key contains literal \n strings, replace them with actual newlines
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n')
  }

  // Validate key format
  if (!privateKey.includes('BEGIN PRIVATE KEY') || !privateKey.includes('END PRIVATE KEY')) {
    throw new Error('Invalid private key format - missing BEGIN/END markers')
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

export async function appendFormToSheet(formData: CompleteFormData) {
  const sheets = await getGoogleSheetsClient()

  const { patientInfo, insuranceInfo, medicalHistory, consentSignatures } = formData

  // Prepare comprehensive row data for Dentrix data entry
  const row = [
    // System fields
    new Date().toISOString(),
    'New',

    // Patient Demographics
    patientInfo.patientName,
    patientInfo.birthdate,
    patientInfo.age,
    patientInfo.sex,
    patientInfo.ssn || '',
    patientInfo.status,

    // Contact Information
    patientInfo.address,
    patientInfo.city,
    patientInfo.state,
    patientInfo.zip,
    patientInfo.email || '',
    patientInfo.phoneHome || '',
    patientInfo.phoneCell || '',
    patientInfo.phoneWork || '',

    // Emergency Contact
    patientInfo.emergencyContact,
    patientInfo.emergencyRelationship,
    patientInfo.emergencyPhone,

    // Employment/School
    patientInfo.employerSchool || '',
    patientInfo.occupationGrade || '',
    patientInfo.workSchoolPhone || '',

    // Spouse/Partner Information
    patientInfo.spousePartnerName || '',
    patientInfo.spouseBirthdate || '',
    patientInfo.spouseSsn || '',
    patientInfo.spouseEmployer || '',
    patientInfo.spouseWorkPhone || '',

    // Referral
    patientInfo.referralSource || '',

    // Insurance Information
    insuranceInfo.hasInsurance ? 'Yes' : 'No',
    insuranceInfo.accountResponsible || '',
    insuranceInfo.accountRelationship || '',
    insuranceInfo.insuranceCompany || '',
    insuranceInfo.insuranceGroup || '',
    insuranceInfo.insuranceId || '',
    insuranceInfo.subscriberName || '',
    insuranceInfo.subscriberBirthdate || '',
    insuranceInfo.subscriberSsn || '',
    insuranceInfo.subscriberRelationship || '',
    insuranceInfo.insuranceCardFront || '',
    insuranceInfo.insuranceCardBack || '',
    insuranceInfo.assignmentSignature || '',

    // Dental History
    medicalHistory.reasonForVisit,
    medicalHistory.formerDentist || '',
    medicalHistory.formerDentistCity || '',
    medicalHistory.lastDentalVisit || '',
    medicalHistory.currentlyInPain ? 'Yes' : 'No',
    medicalHistory.problemsWithPastDentalWork ? 'Yes' : 'No',
    medicalHistory.seriousHeadMouthInjury ? 'Yes' : 'No',
    medicalHistory.feelingsAboutSmile || '',
    medicalHistory.problemsWithAnesthetic ? 'Yes' : 'No',
    medicalHistory.anestheticDetails || '',

    // Medical History
    medicalHistory.underPhysicianCare ? 'Yes' : 'No',
    medicalHistory.physicianName || '',
    medicalHistory.physicianPhone || '',
    medicalHistory.inGoodHealth ? 'Yes' : 'No',
    medicalHistory.recentHealthChanges ? 'Yes' : 'No',
    medicalHistory.healthChangesDetails || '',
    medicalHistory.lastPhysicalExam || '',
    medicalHistory.seriousIllnessLast5Years ? 'Yes' : 'No',
    medicalHistory.illnessDetails || '',

    // Medications & Allergies
    medicalHistory.currentMedications || '',
    medicalHistory.allergies.join(', '),
    medicalHistory.otherAllergies || '',

    // Medical Conditions
    medicalHistory.medicalConditions.join(', '),

    // Special Questions
    medicalHistory.takenFenPhen ? 'Yes' : 'No',
    medicalHistory.takingFosamaxActonel ? 'Yes' : 'No',
    medicalHistory.takingBisphosphonates ? 'Yes' : 'No',
    medicalHistory.bisphosphonatesDate || '',
    medicalHistory.hasJointReplacement ? 'Yes' : 'No',
    medicalHistory.jointReplacementDate || '',
    medicalHistory.usesControlledSubstances ? 'Yes' : 'No',
    medicalHistory.usesTobacco ? 'Yes' : 'No',
    medicalHistory.drinksAlcohol ? 'Yes' : 'No',
    medicalHistory.alcoholLast24Hours || '',
    medicalHistory.alcoholPerWeek || '',

    // Premedication & Women's Health
    medicalHistory.needsPremedication ? 'Yes' : 'No',
    medicalHistory.isPregnant ? 'Yes' : 'No',
    medicalHistory.pregnancyDueDate || '',
    medicalHistory.isNursing ? 'Yes' : 'No',
    medicalHistory.takesBirthControl ? 'Yes' : 'No',

    // Pharmacy
    medicalHistory.pharmacyName || '',
    medicalHistory.pharmacyPhone || '',

    // Consent & Signatures
    consentSignatures.financialPolicyName,
    consentSignatures.financialPolicyDate,
    consentSignatures.financialPolicySignature,
    consentSignatures.hipaaName,
    consentSignatures.hipaaDate,
    consentSignatures.hipaaRelationship || '',
    consentSignatures.hipaaSignature,
    consentSignatures.hipaaDisclosureImmediate ? 'Immediate Family' : '',
    consentSignatures.hipaaDisclosureExtended ? 'Extended Family' : '',
    consentSignatures.hipaaDisclosureOther || '',

    // Notes
    '',
  ]

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A:CO',
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    })

    return response.data
  } catch (error) {
    console.error('Error appending to Google Sheets:', error)
    throw new Error('Failed to save form data to Google Sheets')
  }
}

export async function getAllSubmissions() {
  const sheets = await getGoogleSheetsClient()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A:CO',
    })

    return response.data.values || []
  } catch (error) {
    console.error('Error fetching submissions from Google Sheets:', error)
    throw new Error('Failed to fetch submissions')
  }
}

export async function getSubmissionById(rowIndex: number) {
  const sheets = await getGoogleSheetsClient()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Submissions!A${rowIndex}:CO${rowIndex}`,
    })

    return response.data.values?.[0] || null
  } catch (error) {
    console.error('Error fetching submission from Google Sheets:', error)
    throw new Error('Failed to fetch submission')
  }
}

export async function updateSubmissionStatus(rowIndex: number, status: string) {
  const sheets = await getGoogleSheetsClient()

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `Submissions!B${rowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[status]],
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error updating submission status:', error)
    throw new Error('Failed to update submission status')
  }
}

export async function deleteSubmission(rowIndex: number) {
  const sheets = await getGoogleSheetsClient()

  try {
    // Delete the row from the sheet
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: 0, // Assuming first sheet
                dimension: 'ROWS',
                startIndex: rowIndex - 1, // Convert to 0-indexed
                endIndex: rowIndex, // End index is exclusive
              },
            },
          },
        ],
      },
    })

    return { success: true }
  } catch (error) {
    console.error('Error deleting submission:', error)
    throw new Error('Failed to delete submission')
  }
}

export async function initializeSheet() {
  const sheets = await getGoogleSheetsClient()

  const headers = [
    // System Fields
    'Timestamp',
    'Status',

    // Patient Demographics
    'Patient Name',
    'Date of Birth',
    'Age',
    'Sex',
    'SSN',
    'Marital Status',

    // Contact Information
    'Address',
    'City',
    'State',
    'Zip',
    'Email',
    'Phone (Home)',
    'Phone (Cell)',
    'Phone (Work)',

    // Emergency Contact
    'Emergency Contact Name',
    'Emergency Contact Relationship',
    'Emergency Contact Phone',

    // Employment/School
    'Employer/School',
    'Occupation/Grade',
    'Work/School Phone',

    // Spouse/Partner Information
    'Spouse/Partner Name',
    'Spouse/Partner DOB',
    'Spouse/Partner SSN',
    'Spouse/Partner Employer',
    'Spouse/Partner Work Phone',

    // Referral
    'Referral Source',

    // Insurance Information
    'Has Insurance',
    'Account Responsible',
    'Account Relationship',
    'Insurance Company',
    'Insurance Group #',
    'Insurance ID #',
    'Subscriber Name',
    'Subscriber DOB',
    'Subscriber SSN',
    'Subscriber Relationship',
    'Insurance Card Front (Base64)',
    'Insurance Card Back (Base64)',
    'Insurance Assignment Signature (Base64)',

    // Dental History
    'Reason for Visit',
    'Former Dentist',
    'Former Dentist City',
    'Last Dental Visit',
    'Currently in Pain',
    'Problems with Past Dental Work',
    'Serious Head/Mouth Injury',
    'Feelings About Smile',
    'Problems with Anesthetic',
    'Anesthetic Details',

    // Medical History
    'Under Physician Care',
    'Physician Name',
    'Physician Phone',
    'In Good Health',
    'Recent Health Changes',
    'Health Changes Details',
    'Last Physical Exam',
    'Serious Illness (Last 5 Years)',
    'Illness Details',

    // Medications & Allergies
    'Current Medications',
    'Allergies',
    'Other Allergies',

    // Medical Conditions
    'Medical Conditions',

    // Special Drug Questions
    'Taken Fen-Phen',
    'Taking Fosamax/Actonel',
    'Taking Bisphosphonates',
    'Bisphosphonates Date',
    'Has Joint Replacement',
    'Joint Replacement Date',
    'Uses Controlled Substances',
    'Uses Tobacco',
    'Drinks Alcohol',
    'Alcohol (Last 24 Hours)',
    'Alcohol (Per Week)',

    // Premedication & Women\'s Health
    'Needs Premedication',
    'Is Pregnant',
    'Pregnancy Due Date',
    'Is Nursing',
    'Takes Birth Control',

    // Pharmacy
    'Pharmacy Name',
    'Pharmacy Phone',

    // Consent & Signatures
    'Financial Policy - Printed Name',
    'Financial Policy - Date',
    'Financial Policy - Signature (Base64)',
    'HIPAA - Patient Name',
    'HIPAA - Date',
    'HIPAA - Relationship',
    'HIPAA - Signature (Base64)',
    'HIPAA - Disclosure (Immediate)',
    'HIPAA - Disclosure (Extended)',
    'HIPAA - Disclosure (Other)',

    // Notes
    'Notes',
  ]

  try {
    // Always update headers to ensure they're current
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A1:CO1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers],
      },
    })

    return { success: true, message: 'Sheet initialized with comprehensive headers' }
  } catch (error) {
    console.error('Error initializing sheet:', error)
    throw new Error('Failed to initialize sheet')
  }
}

import { google } from 'googleapis'
import type { CompleteFormData } from './schemas'

export async function getGoogleSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  return google.sheets({ version: 'v4', auth })
}

export async function appendFormToSheet(formData: CompleteFormData) {
  const sheets = await getGoogleSheetsClient()

  const { patientInfo, insuranceInfo, medicalHistory, consentSignatures } = formData

  // Prepare row data matching the Google Sheets structure from README
  const row = [
    new Date().toISOString(), // Timestamp
    'New', // Status
    patientInfo.patientName,
    patientInfo.birthdate,
    patientInfo.address,
    patientInfo.city,
    patientInfo.state,
    patientInfo.zip,
    patientInfo.email || '',
    patientInfo.phoneHome || '',
    patientInfo.phoneCell || '',
    patientInfo.phoneWork || '',
    patientInfo.emergencyContact,
    patientInfo.emergencyPhone,
    insuranceInfo.insuranceCompany || '',
    insuranceInfo.insuranceGroup || '',
    insuranceInfo.insuranceId || '',
    insuranceInfo.subscriberName || '',
    insuranceInfo.insuranceCardFront || '',
    insuranceInfo.insuranceCardBack || '',
    medicalHistory.medicalConditions.join(', '),
    medicalHistory.currentMedications || '',
    medicalHistory.allergies.join(', '),
    consentSignatures.financialPolicySignature,
    '', // Notes field (empty initially)
  ]

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A:Y',
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
      range: 'Submissions!A:Y',
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
      range: `Submissions!A${rowIndex}:Y${rowIndex}`,
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

export async function initializeSheet() {
  const sheets = await getGoogleSheetsClient()

  const headers = [
    'Timestamp',
    'Status',
    'Patient_Name',
    'DOB',
    'Address',
    'City',
    'State',
    'Zip',
    'Email',
    'Phone_Home',
    'Phone_Cell',
    'Phone_Work',
    'Emergency_Contact',
    'Emergency_Phone',
    'Insurance_Company',
    'Insurance_Group',
    'Insurance_ID',
    'Subscriber_Name',
    'Insurance_Card_Front',
    'Insurance_Card_Back',
    'Medical_Conditions',
    'Medications',
    'Allergies',
    'Signature_Data',
    'Notes',
  ]

  try {
    // Check if sheet exists and has headers
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Submissions!A1:Y1',
    })

    if (!response.data.values || response.data.values.length === 0) {
      // Add headers if they don't exist
      await sheets.spreadsheets.values.update({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'Submissions!A1:Y1',
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      })
    }

    return { success: true, message: 'Sheet initialized' }
  } catch (error) {
    console.error('Error initializing sheet:', error)
    throw new Error('Failed to initialize sheet')
  }
}

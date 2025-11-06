import { NextResponse } from 'next/server'
import { appendFormToSheet, getSubmissionById } from '@/lib/google-sheets'
import { uploadImageToDrive, base64ToBuffer, getMimeTypeFromBase64 } from '@/lib/google-drive'
import type { CompleteFormData } from '@/lib/schemas'
import { generatePatientFormPDFFromRow } from '@/lib/pdf-generator'
import { sendPatientFormEmail } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const formData: CompleteFormData = await request.json()

    // Store insurance cards and signatures as base64 in the sheet
    // No Google Drive uploads (service accounts don't have storage quota)

    // Append to Google Sheets
    const response = await appendFormToSheet(formData)

    // Extract the row index from the response
    // The response.updates.updatedRange format is like "Submissions!A2:CO2"
    let submissionId = 2 // Default to 2 (first data row after header)
    if (response.updates?.updatedRange) {
      const match = response.updates.updatedRange.match(/!A(\d+):/)
      if (match) {
        submissionId = parseInt(match[1])
      }
    }

    // Generate PDF and send email in the background (don't block the response)
    // This is a fire-and-forget operation
    setImmediate(async () => {
      try {
        // Fetch the submission data
        const submission = await getSubmissionById(submissionId)
        if (!submission) {
          console.error('Could not fetch submission for PDF generation')
          return
        }

        // Generate PDF
        const pdfBuffer = generatePatientFormPDFFromRow(submission)

        // Send email with PDF attachment
        const patientName = formData.patientInfo.patientName
        const emailSent = await sendPatientFormEmail(patientName, submissionId.toString(), pdfBuffer)

        if (emailSent) {
          console.log(`Email sent successfully for submission ${submissionId}`)
        } else {
          console.error(`Failed to send email for submission ${submissionId}`)
        }
      } catch (error) {
        console.error('Error generating PDF or sending email:', error)
        // Don't throw - this is a background operation
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      submissionId,
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit form',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

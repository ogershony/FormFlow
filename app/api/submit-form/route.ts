import { NextResponse } from 'next/server'
import { appendFormToSheet, getAllSubmissions } from '@/lib/google-sheets'
import { uploadImageToDrive, base64ToBuffer, getMimeTypeFromBase64 } from '@/lib/google-drive'
import type { CompleteFormData } from '@/lib/schemas'
import { generatePatientFormPDF } from '@/lib/pdf-generator'
import { sendSubmissionEmail } from '@/lib/email-service'

export async function POST(request: Request) {
  try {
    const formData: CompleteFormData = await request.json()

    // Store insurance cards and signatures as base64 in the sheet
    // No Google Drive uploads (service accounts don't have storage quota)

    // Append to Google Sheets
    await appendFormToSheet(formData)

    // Get the row index of the newly added submission
    // The row index is the total number of rows (including header)
    const allSubmissions = await getAllSubmissions()
    const rowIndex = allSubmissions.length

    // Generate PDF for email
    const pdfBuffer = await generatePatientFormPDF({
      rowIndex,
      timestamp: new Date().toISOString(),
      formData: allSubmissions[rowIndex - 1], // Get the newly added row (0-indexed array)
    })

    // Get the site URL from environment or construct it
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const submissionUrl = `${siteUrl}/admin/submission/${rowIndex}`

    // Send email notification with PDF
    const emailResult = await sendSubmissionEmail({
      patientName: formData.patientInfo.patientName,
      submissionId: rowIndex,
      pdfBuffer,
      submissionUrl,
    })

    if (!emailResult.success) {
      console.warn('Email failed to send:', emailResult.error)
      // Don't fail the entire submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
      emailSent: emailResult.success,
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

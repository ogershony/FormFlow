import { NextResponse } from 'next/server'
import { appendFormToSheet } from '@/lib/google-sheets'
import { uploadImageToDrive, base64ToBuffer, getMimeTypeFromBase64 } from '@/lib/google-drive'
import type { CompleteFormData } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    const formData: CompleteFormData = await request.json()

    // Store insurance cards and signatures as base64 in the sheet
    // No Google Drive uploads (service accounts don't have storage quota)

    // Append to Google Sheets
    await appendFormToSheet(formData)

    return NextResponse.json({
      success: true,
      message: 'Form submitted successfully',
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

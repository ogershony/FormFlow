import { NextResponse } from 'next/server'
import { appendFormToSheet } from '@/lib/google-sheets'
import { uploadImageToDrive, base64ToBuffer, getMimeTypeFromBase64 } from '@/lib/google-drive'
import type { CompleteFormData } from '@/lib/schemas'

export async function POST(request: Request) {
  try {
    const formData: CompleteFormData = await request.json()

    // Upload insurance card images to Google Drive if they exist
    let insuranceCardFrontUrl = formData.insuranceInfo.insuranceCardFront || ''
    let insuranceCardBackUrl = formData.insuranceInfo.insuranceCardBack || ''

    if (insuranceCardFrontUrl && insuranceCardFrontUrl.startsWith('data:')) {
      try {
        const buffer = base64ToBuffer(insuranceCardFrontUrl)
        const mimeType = getMimeTypeFromBase64(insuranceCardFrontUrl)
        const fileName = `insurance_card_front_${Date.now()}.jpg`

        const result = await uploadImageToDrive(buffer, fileName, mimeType)
        insuranceCardFrontUrl = result.fileUrl
      } catch (error) {
        console.error('Error uploading front insurance card:', error)
      }
    }

    if (insuranceCardBackUrl && insuranceCardBackUrl.startsWith('data:')) {
      try {
        const buffer = base64ToBuffer(insuranceCardBackUrl)
        const mimeType = getMimeTypeFromBase64(insuranceCardBackUrl)
        const fileName = `insurance_card_back_${Date.now()}.jpg`

        const result = await uploadImageToDrive(buffer, fileName, mimeType)
        insuranceCardBackUrl = result.fileUrl
      } catch (error) {
        console.error('Error uploading back insurance card:', error)
      }
    }

    // Update form data with Drive URLs
    const updatedFormData = {
      ...formData,
      insuranceInfo: {
        ...formData.insuranceInfo,
        insuranceCardFront: insuranceCardFrontUrl,
        insuranceCardBack: insuranceCardBackUrl,
      },
    }

    // Append to Google Sheets
    await appendFormToSheet(updatedFormData)

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

import { NextResponse } from 'next/server'
import { getSubmissionById } from '@/lib/google-sheets'
import { generatePatientFormPDFFromRow } from '@/lib/pdf-generator'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const rowIndex = parseInt(id)

    if (isNaN(rowIndex)) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission ID' },
        { status: 400 }
      )
    }

    // Fetch submission data from Google Sheets
    const submission = await getSubmissionById(rowIndex)

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfBuffer = generatePatientFormPDFFromRow(submission)

    // Get patient name for filename
    const patientName = submission[2] || 'Patient'
    const sanitizedName = patientName.replace(/[^a-zA-Z0-9]/g, '-')
    const filename = `patient-form-${sanitizedName}-${id}.pdf`

    // Return PDF as response
    return new NextResponse(pdfBuffer as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

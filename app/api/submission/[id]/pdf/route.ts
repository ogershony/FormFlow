import { NextResponse } from 'next/server'
import { getSubmissionById } from '@/lib/google-sheets'
import { generatePatientFormPDF } from '@/lib/pdf-generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const rowIndex = parseInt(id)

    if (isNaN(rowIndex)) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission ID' },
        { status: 400 }
      )
    }

    const submission = await getSubmissionById(rowIndex)

    if (!submission) {
      return NextResponse.json(
        { success: false, error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfBuffer = await generatePatientFormPDF({
      rowIndex,
      timestamp: submission[0],
      formData: submission,
    })

    // Get patient name for filename
    const patientName = submission[2] || 'patient'
    const filename = `patient-registration-${patientName.replace(/\s+/g, '-')}-${rowIndex}.pdf`

    // Return PDF as download
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
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

import { NextResponse } from 'next/server'
import { getSubmissionById } from '@/lib/google-sheets'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rowId = searchParams.get('row')
    const type = searchParams.get('type') // 'financial', 'hipaa', or 'assignment'

    if (!rowId || !type) {
      return NextResponse.json(
        { error: 'Missing row or type parameter' },
        { status: 400 }
      )
    }

    // Get the submission data
    const submission = await getSubmissionById(parseInt(rowId))

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      )
    }

    // Column indices for signatures (0-indexed)
    // Based on the actual sheet structure
    const signatureIndices = {
      assignment: 40, // Insurance Assignment Signature column
      financial: 84,  // Financial Policy Signature column
      hipaa: 88,      // HIPAA Signature column
    }

    const index = signatureIndices[type as keyof typeof signatureIndices]
    const base64Data = submission[index]

    if (!base64Data || !base64Data.startsWith('data:')) {
      return NextResponse.json(
        { error: 'Signature not found or invalid' },
        { status: 404 }
      )
    }

    // Extract the base64 content and mime type
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid signature format' },
        { status: 400 }
      )
    }

    const mimeType = matches[1]
    const base64Content = matches[2]
    const buffer = Buffer.from(base64Content, 'base64')

    // Return the image
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Disposition': `inline; filename="signature-${type}-${rowId}.png"`,
      },
    })
  } catch (error) {
    console.error('Error viewing signature:', error)
    return NextResponse.json(
      {
        error: 'Failed to load signature',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

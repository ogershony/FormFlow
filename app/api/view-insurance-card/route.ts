import { NextResponse } from 'next/server'
import { getSubmissionById } from '@/lib/google-sheets'

// Force dynamic rendering
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const rowId = searchParams.get('row')
    const side = searchParams.get('side') // 'front' or 'back'

    if (!rowId || !side) {
      return NextResponse.json(
        { error: 'Missing row or side parameter' },
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

    // Column indices for insurance cards (0-indexed)
    const cardIndices = {
      front: 38, // Insurance Card Front column
      back: 39,  // Insurance Card Back column
    }

    const index = cardIndices[side as keyof typeof cardIndices]
    const base64Data = submission[index]

    if (!base64Data || !base64Data.startsWith('data:')) {
      return NextResponse.json(
        { error: 'Insurance card not found or invalid' },
        { status: 404 }
      )
    }

    // Extract the base64 content and mime type
    const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/)
    if (!matches) {
      return NextResponse.json(
        { error: 'Invalid insurance card format' },
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
        'Content-Disposition': `inline; filename="insurance-${side}-${rowId}.jpg"`,
      },
    })
  } catch (error) {
    console.error('Error viewing insurance card:', error)
    return NextResponse.json(
      {
        error: 'Failed to load insurance card',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

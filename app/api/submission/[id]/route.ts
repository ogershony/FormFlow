import { NextResponse } from 'next/server'
import { getSubmissionById, updateSubmissionStatus } from '@/lib/google-sheets'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rowIndex = parseInt(params.id)

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

    return NextResponse.json({
      success: true,
      submission,
    })
  } catch (error) {
    console.error('Error fetching submission:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const rowIndex = parseInt(params.id)
    const { status } = await request.json()

    if (isNaN(rowIndex)) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission ID' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    await updateSubmissionStatus(rowIndex, status)

    return NextResponse.json({
      success: true,
      message: 'Submission status updated',
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update submission',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

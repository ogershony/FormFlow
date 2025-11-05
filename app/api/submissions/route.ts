import { NextResponse } from 'next/server'
import { getAllSubmissions } from '@/lib/google-sheets'

export async function GET() {
  try {
    const submissions = await getAllSubmissions()

    return NextResponse.json({
      success: true,
      submissions,
    })
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch submissions',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

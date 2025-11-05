import { NextResponse } from 'next/server'
import { initializeSheet } from '@/lib/google-sheets'

export async function POST() {
  try {
    const result = await initializeSheet()

    return NextResponse.json({
      success: true,
      message: result.message,
    })
  } catch (error) {
    console.error('Error initializing sheet:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initialize sheet',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

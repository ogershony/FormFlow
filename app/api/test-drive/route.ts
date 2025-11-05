import { NextResponse } from 'next/server'
import { getGoogleDriveClient } from '@/lib/google-drive'

export async function GET() {
  try {
    const drive = await getGoogleDriveClient()

    // Try to get folder details
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID

    if (!folderId) {
      return NextResponse.json({
        success: false,
        error: 'GOOGLE_DRIVE_FOLDER_ID not set',
      }, { status: 400 })
    }

    const response = await drive.files.get({
      fileId: folderId,
      fields: 'id, name, mimeType, capabilities, permissions',
      supportsAllDrives: true,
    })

    return NextResponse.json({
      success: true,
      folder: response.data,
      canEdit: response.data.capabilities?.canAddChildren,
      serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    })
  } catch (error) {
    console.error('Error testing Drive access:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to access Google Drive folder',
        details: error instanceof Error ? error.message : 'Unknown error',
        serviceAccountEmail: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      },
      { status: 500 }
    )
  }
}

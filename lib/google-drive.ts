import { google } from 'googleapis'
import { Readable } from 'stream'

export async function getGoogleDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/drive.file'],
  })

  return google.drive({ version: 'v3', auth })
}

export async function uploadImageToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
): Promise<{ fileId: string; fileUrl: string; thumbnailUrl: string }> {
  const drive = await getGoogleDriveClient()

  try {
    // Convert buffer to readable stream
    const fileStream = Readable.from(fileBuffer)

    // Upload file to Google Drive
    const fileMetadata = {
      name: fileName,
      parents: [process.env.GOOGLE_DRIVE_FOLDER_ID!],
    }

    const media = {
      mimeType: mimeType,
      body: fileStream,
    }

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink, thumbnailLink',
    })

    const fileId = response.data.id!

    // Make file accessible to anyone with the link
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    })

    const fileUrl = `https://drive.google.com/file/d/${fileId}/view`
    const thumbnailUrl = response.data.thumbnailLink || fileUrl

    return {
      fileId,
      fileUrl,
      thumbnailUrl,
    }
  } catch (error) {
    console.error('Error uploading to Google Drive:', error)
    throw new Error('Failed to upload image to Google Drive')
  }
}

export async function deleteFileFromDrive(fileId: string): Promise<void> {
  const drive = await getGoogleDriveClient()

  try {
    await drive.files.delete({
      fileId: fileId,
    })
  } catch (error) {
    console.error('Error deleting file from Google Drive:', error)
    throw new Error('Failed to delete file from Google Drive')
  }
}

export function base64ToBuffer(base64String: string): Buffer {
  // Remove data URL prefix if present (e.g., "data:image/png;base64,")
  const base64Data = base64String.includes(',')
    ? base64String.split(',')[1]
    : base64String

  return Buffer.from(base64Data, 'base64')
}

export function getMimeTypeFromBase64(base64String: string): string {
  if (base64String.startsWith('data:')) {
    const match = base64String.match(/data:([^;]+);/)
    return match ? match[1] : 'image/jpeg'
  }
  return 'image/jpeg'
}

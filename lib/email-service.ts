import { Resend } from 'resend'

interface SendSubmissionEmailParams {
  patientName: string
  submissionId: number
  pdfBuffer: Buffer
  submissionUrl: string
}

export async function sendSubmissionEmail({
  patientName,
  submissionId,
  pdfBuffer,
  submissionUrl,
}: SendSubmissionEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured - skipping email send')
    return { success: false, error: 'Email service not configured' }
  }

  // Initialize Resend only when needed (to avoid build-time errors)
  const resend = new Resend(process.env.RESEND_API_KEY)

  // Email configuration from environment variables
  const recipientEmail = process.env.NOTIFICATION_EMAIL || 'info@redmonddentalsmiles.com'
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev' // Resend's test domain

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject: `New Patient Registration: ${patientName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #2563eb;
                color: white;
                padding: 20px;
                border-radius: 5px;
                text-align: center;
              }
              .content {
                padding: 20px;
                background-color: #f9fafb;
                border-radius: 5px;
                margin-top: 20px;
              }
              .info-row {
                padding: 10px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .info-label {
                font-weight: bold;
                color: #4b5563;
              }
              .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #ffffff;
                color: #000000;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                border: 2px solid #2563eb;
                font-weight: bold;
              }
              .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 style="margin: 0;">New Patient Registration</h1>
            </div>

            <div class="content">
              <div class="info-row">
                <span class="info-label">Patient Name:</span> ${patientName}
              </div>
              <div class="info-row">
                <span class="info-label">Submission ID:</span> ${submissionId}
              </div>
              <div class="info-row">
                <span class="info-label">Submission Time:</span> ${new Date().toLocaleString()}
              </div>

              <p style="margin-top: 20px;">
                A new patient registration has been submitted. The complete patient information is attached as a PDF.
              </p>

              <p>
                <a href="${submissionUrl}" class="button">View Full Submission</a>
              </p>
            </div>

            <div class="footer">
              <p>Malinda Lam-Gershony, DDS, PLLC</p>
              <p>16710 NE 79th ST-Suite 100, Redmond, WA 98052</p>
              <p>425.867.1484</p>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `patient-registration-${patientName.replace(/\s+/g, '-')}-${submissionId}.pdf`,
          content: pdfBuffer,
        },
      ],
    })

    return { success: true, data: result }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  text: string
  html?: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType: string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // Check if email configuration is set
    if (!process.env.EMAIL_HOST || !process.env.EMAIL_PORT || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error('Email configuration is missing. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD environment variables.')
      return false
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html || options.text,
      attachments: options.attachments,
    })

    console.log('Email sent successfully:', info.messageId)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function sendPatientFormEmail(
  patientName: string,
  submissionId: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const formUrl = `${siteUrl}/admin/submission/${submissionId}`

  const subject = `New Patient Registration: ${patientName}`

  const text = `
A new patient registration form has been submitted.

Patient Name: ${patientName}
Submission Time: ${new Date().toLocaleString()}

View full submission details:
${formUrl}

The complete patient registration form is attached as a PDF.

---
Redmond Dental Smiles
16710 NE 79th ST-Suite 100
Redmond, WA 98052
425.867.1484
  `.trim()

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 20px;
          border: 1px solid #e5e7eb;
        }
        .info-row {
          margin: 10px 0;
          padding: 10px;
          background-color: white;
          border-left: 4px solid #2563eb;
        }
        .label {
          font-weight: bold;
          color: #1f2937;
        }
        .button {
          display: inline-block;
          padding: 12px 24px;
          margin: 20px 0;
          background-color: #2563eb;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        }
        .footer {
          margin-top: 20px;
          padding-top: 20px;
          border-top: 2px solid #e5e7eb;
          text-align: center;
          color: #6b7280;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Patient Registration</h1>
        </div>
        <div class="content">
          <p>A new patient registration form has been submitted.</p>

          <div class="info-row">
            <span class="label">Patient Name:</span> ${patientName}
          </div>

          <div class="info-row">
            <span class="label">Submission Time:</span> ${new Date().toLocaleString()}
          </div>

          <div style="text-align: center;">
            <a href="${formUrl}" class="button">View Full Submission Details</a>
          </div>

          <p style="margin-top: 20px;">
            The complete patient registration form is attached as a PDF for your convenience.
          </p>
        </div>

        <div class="footer">
          <strong>Redmond Dental Smiles</strong><br>
          16710 NE 79th ST-Suite 100<br>
          Redmond, WA 98052<br>
          425.867.1484
        </div>
      </div>
    </body>
    </html>
  `

  return await sendEmail({
    to: 'info@redmonddentalsmiles.com',
    subject,
    text,
    html,
    attachments: [
      {
        filename: `patient-form-${patientName.replace(/\s+/g, '-')}-${submissionId}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  })
}

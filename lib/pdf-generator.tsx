import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'

interface SubmissionData {
  rowIndex: number
  timestamp: string
  formData: any[] // The full row data from Google Sheets
}

// Create styles - highly condensed for 2-page layout
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 7,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  subheader: {
    fontSize: 7,
    textAlign: 'center',
    marginBottom: 0.5,
  },
  divider: {
    borderBottom: '1px solid #000',
    marginVertical: 4,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 4,
    marginBottom: 2,
    textDecoration: 'underline',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  column: {
    width: '48%',
  },
  row: {
    marginBottom: 1,
  },
  fieldLabel: {
    fontWeight: 'bold',
    fontSize: 7,
  },
  fieldValue: {
    fontSize: 7,
  },
  submissionInfo: {
    fontSize: 6,
    textAlign: 'right',
    marginBottom: 2,
  },
  footer: {
    fontSize: 5,
    color: '#666',
    textAlign: 'center',
    marginTop: 6,
  },
  insuranceImage: {
    maxWidth: '100%',
    maxHeight: 80,
    marginVertical: 2,
    objectFit: 'contain',
    border: '1px solid #ccc',
  },
  signature: {
    maxWidth: 140,
    maxHeight: 35,
    marginVertical: 1,
    objectFit: 'contain',
    border: '1px solid #ccc',
  },
  imageLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    marginTop: 3,
    marginBottom: 1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginVertical: 2,
  },
  imageContainer: {
    width: '48%',
  },
})

// Helper component for a field
const Field = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.row}>
    <Text>
      <Text style={styles.fieldLabel}>{label}: </Text>
      <Text style={styles.fieldValue}>{value || 'N/A'}</Text>
    </Text>
  </View>
)

// PDF Document Component
const PatientFormDocument = ({ submission }: { submission: SubmissionData }) => {
  const data = submission.formData

  return (
    <Document>
      {/* Page 1: Patient Info & Insurance */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.header}>PATIENT REGISTRATION FORM</Text>
        <Text style={styles.subheader}>Malinda Lam-Gershony, DDS, PLLC</Text>
        <Text style={styles.subheader}>16710 NE 79th ST-Suite 100, Redmond, WA 98052 • 425.867.1484</Text>

        <View style={styles.divider} />

        <Text style={styles.submissionInfo}>
          Submitted: {new Date(data[0]).toLocaleString()} | Status: {data[1] || 'New'}
        </Text>

        {/* Two columns of sections */}
        <View style={styles.twoColumn}>
          {/* LEFT COLUMN */}
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>PATIENT DEMOGRAPHICS</Text>
            <Field label="Patient Name" value={data[2]} />
            <Field label="Date of Birth" value={data[3]} />
            <Field label="Age" value={data[4]} />
            <Field label="Sex" value={data[5]} />
            <Field label="SSN" value={data[6]} />
            <Field label="Marital Status" value={data[7]} />

            <Text style={styles.sectionHeader}>EMERGENCY CONTACT</Text>
            <Field label="Name" value={data[16]} />
            <Field label="Relationship" value={data[17]} />
            <Field label="Phone" value={data[18]} />

            <Text style={styles.sectionHeader}>SPOUSE/PARTNER</Text>
            <Field label="Name" value={data[22]} />
            <Field label="DOB" value={data[23]} />
            <Field label="SSN" value={data[24]} />
            <Field label="Employer" value={data[25]} />
            <Field label="Work Phone" value={data[26]} />

            <Text style={styles.sectionHeader}>REFERRAL</Text>
            <Field label="Referral Source" value={data[27]} />
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>CONTACT INFORMATION</Text>
            <Field label="Address" value={data[8]} />
            <Field label="City" value={data[9]} />
            <Field label="State" value={data[10]} />
            <Field label="ZIP" value={data[11]} />
            <Field label="Email" value={data[12]} />
            <Field label="Home Phone" value={data[13]} />
            <Field label="Cell Phone" value={data[14]} />
            <Field label="Work Phone" value={data[15]} />

            <Text style={styles.sectionHeader}>EMPLOYMENT/SCHOOL</Text>
            <Field label="Employer/School" value={data[19]} />
            <Field label="Occupation/Grade" value={data[20]} />
            <Field label="Phone" value={data[21]} />
          </View>
        </View>

        <Text style={styles.sectionHeader}>INSURANCE INFORMATION</Text>
        <Field label="Has Insurance" value={data[28]} />
        {data[28] === 'Yes' && (
          <>
            <View style={styles.twoColumn}>
              <View style={styles.column}>
                <Field label="Account Responsible" value={data[29]} />
                <Field label="Account Relationship" value={data[30]} />
                <Field label="Insurance Company" value={data[31]} />
                <Field label="Group #" value={data[32]} />
                <Field label="Member ID" value={data[33]} />
              </View>
              <View style={styles.column}>
                <Field label="Subscriber Name" value={data[34]} />
                <Field label="Subscriber DOB" value={data[35]} />
                <Field label="Subscriber SSN" value={data[36]} />
                <Field label="Subscriber Relationship" value={data[37]} />
              </View>
            </View>

            {/* Insurance Card Images */}
            {(data[38] || data[39]) && (
              <View style={styles.imageRow}>
                {data[38] && (
                  <View style={styles.imageContainer}>
                    <Text style={{ fontSize: 6, marginBottom: 1 }}>Insurance Card Front:</Text>
                    <Image src={data[38]} style={styles.insuranceImage} />
                  </View>
                )}
                {data[39] && (
                  <View style={styles.imageContainer}>
                    <Text style={{ fontSize: 6, marginBottom: 1 }}>Insurance Card Back:</Text>
                    <Image src={data[39]} style={styles.insuranceImage} />
                  </View>
                )}
              </View>
            )}

            {data[40] && data[40].startsWith('data:') && (
              <View>
                <Text style={styles.imageLabel}>Insurance Assignment Signature:</Text>
                <Image src={data[40]} style={styles.signature} />
              </View>
            )}
          </>
        )}
      </Page>

      {/* Page 2: Medical/Dental History & Consent */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.twoColumn}>
          {/* LEFT COLUMN */}
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>DENTAL HISTORY</Text>
            <Field label="Reason for Visit" value={data[41]} />
            <Field label="Former Dentist" value={data[42]} />
            <Field label="City" value={data[43]} />
            <Field label="Last Visit" value={data[44]} />
            <Field label="Currently in Pain" value={data[45]} />
            <Field label="Problems Past Work" value={data[46]} />
            <Field label="Head/Mouth Injury" value={data[47]} />
            <Field label="Smile Feelings" value={data[48]} />
            <Field label="Anesthetic Issues" value={data[49]} />
            <Field label="Anesthetic Details" value={data[50]} />

            <Text style={styles.sectionHeader}>MEDICATIONS & ALLERGIES</Text>
            <Field label="Current Medications" value={data[60]} />
            <Field label="Allergies" value={data[61]} />
            <Field label="Other Allergies" value={data[62]} />
            <Field label="Medical Conditions" value={data[63]} />

            <Text style={styles.sectionHeader}>SPECIAL DRUG QUESTIONS</Text>
            <Field label="Taken Fen-Phen" value={data[64]} />
            <Field label="Taking Fosamax/Actonel" value={data[65]} />
            <Field label="Taking Bisphosphonates" value={data[66]} />
            <Field label="Bisphosphonates Date" value={data[67]} />
            <Field label="Has Joint Replacement" value={data[68]} />
            <Field label="Joint Replacement Date" value={data[69]} />
            <Field label="Uses Controlled Substances" value={data[70]} />
            <Field label="Uses Tobacco" value={data[71]} />
            <Field label="Drinks Alcohol" value={data[72]} />
            <Field label="Alcohol (Last 24 Hours)" value={data[73]} />
            <Field label="Alcohol (Per Week)" value={data[74]} />

            <Text style={styles.sectionHeader}>PHARMACY</Text>
            <Field label="Pharmacy Name" value={data[80]} />
            <Field label="Pharmacy Phone" value={data[81]} />
          </View>

          {/* RIGHT COLUMN */}
          <View style={styles.column}>
            <Text style={styles.sectionHeader}>MEDICAL HISTORY</Text>
            <Field label="Under Physician Care" value={data[51]} />
            <Field label="Physician Name" value={data[52]} />
            <Field label="Physician Phone" value={data[53]} />
            <Field label="In Good Health" value={data[54]} />
            <Field label="Recent Health Changes" value={data[55]} />
            <Field label="Health Change Details" value={data[56]} />
            <Field label="Last Physical Exam" value={data[57]} />
            <Field label="Serious Illness (5yr)" value={data[58]} />
            <Field label="Illness Details" value={data[59]} />

            <Text style={styles.sectionHeader}>WOMEN'S HEALTH</Text>
            <Field label="Needs Premedication" value={data[75]} />
            <Field label="Is Pregnant" value={data[76]} />
            <Field label="Pregnancy Due Date" value={data[77]} />
            <Field label="Is Nursing" value={data[78]} />
            <Field label="Takes Birth Control" value={data[79]} />

            <Text style={styles.sectionHeader}>CONSENT & SIGNATURES</Text>
            <Text style={{ fontSize: 7, fontWeight: 'bold', marginTop: 2 }}>Financial Policy</Text>
            <Field label="Printed Name" value={data[82]} />
            <Field label="Date" value={data[83]} />
            {data[84] && data[84].startsWith('data:') && (
              <View>
                <Text style={styles.imageLabel}>Signature:</Text>
                <Image src={data[84]} style={styles.signature} />
              </View>
            )}

            <Text style={{ fontSize: 7, fontWeight: 'bold', marginTop: 4 }}>HIPAA Privacy</Text>
            <Field label="Patient Name" value={data[85]} />
            <Field label="Date" value={data[86]} />
            <Field label="Relationship" value={data[87]} />
            {data[88] && data[88].startsWith('data:') && (
              <View>
                <Text style={styles.imageLabel}>Signature:</Text>
                <Image src={data[88]} style={styles.signature} />
              </View>
            )}

            <Text style={{ fontSize: 6, fontWeight: 'bold', marginTop: 2 }}>HIPAA Disclosure:</Text>
            {data[89] && <Text style={{ fontSize: 6 }}>• Immediate: {data[89]}</Text>}
            {data[90] && <Text style={{ fontSize: 6 }}>• Extended: {data[90]}</Text>}
            {data[91] && <Text style={{ fontSize: 6 }}>• Other: {data[91]}</Text>}

            <Text style={styles.sectionHeader}>STAFF NOTES</Text>
            <Text style={{ fontSize: 7 }}>{data[92] || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          This document contains confidential patient information.
        </Text>
      </Page>
    </Document>
  )
}

export async function generatePatientFormPDF(submission: SubmissionData): Promise<Buffer> {
  const doc = <PatientFormDocument submission={submission} />
  const asPdf = pdf(doc)
  const blob = await asPdf.toBlob()
  const buffer = Buffer.from(await blob.arrayBuffer())
  return buffer
}

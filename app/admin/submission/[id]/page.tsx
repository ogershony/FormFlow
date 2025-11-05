'use client'

import { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, CheckCircle, ArrowLeft, Trash2, Download } from 'lucide-react'

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [submission, setSubmission] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [status, setStatus] = useState('New')

  useEffect(() => {
    fetchSubmission()
  }, [])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submission/${resolvedParams.id}`)
      const data = await response.json()

      if (data.success && data.submission) {
        setSubmission(data.submission)
        setStatus(data.submission[1] || 'New')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    })
  }

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/submission/${resolvedParams.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setStatus(newStatus)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const deleteSubmission = async () => {
    if (!confirm('Are you sure you want to delete this submission? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/submission/${resolvedParams.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Submission deleted successfully')
        router.push('/admin')
      } else {
        alert('Failed to delete submission')
      }
    } catch (error) {
      console.error('Error deleting submission:', error)
      alert('Error deleting submission')
    }
  }

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      size="sm"
      variant="ghost"
      onClick={() => copyToClipboard(text, field)}
      className="h-8 w-8 p-0"
    >
      {copiedField === field ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )

  const DataField = ({ label, value, field }: { label: string; value: string; field: string }) => (
    <div className="flex items-start justify-between py-2 border-b last:border-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base whitespace-pre-wrap">{value || 'N/A'}</p>
      </div>
      {value && <CopyButton text={value} field={field} />}
    </div>
  )

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {children}
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading submission...</p>
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Submission not found</p>
      </div>
    )
  }

  // Column indices based on google-sheets.ts structure
  const data = {
    // System fields (0-1)
    timestamp: submission[0],
    status: submission[1],

    // Patient Demographics (2-7)
    patientName: submission[2],
    dob: submission[3],
    age: submission[4],
    sex: submission[5],
    ssn: submission[6],
    maritalStatus: submission[7],

    // Contact Information (8-15)
    address: submission[8],
    city: submission[9],
    state: submission[10],
    zip: submission[11],
    email: submission[12],
    phoneHome: submission[13],
    phoneCell: submission[14],
    phoneWork: submission[15],

    // Emergency Contact (16-18)
    emergencyName: submission[16],
    emergencyRelationship: submission[17],
    emergencyPhone: submission[18],

    // Employment/School (19-21)
    employer: submission[19],
    occupation: submission[20],
    workPhone: submission[21],

    // Spouse/Partner (22-26)
    spouseName: submission[22],
    spouseDob: submission[23],
    spouseSsn: submission[24],
    spouseEmployer: submission[25],
    spouseWorkPhone: submission[26],

    // Referral (27)
    referralSource: submission[27],

    // Insurance (28-40)
    hasInsurance: submission[28],
    accountResponsible: submission[29],
    accountRelationship: submission[30],
    insuranceCompany: submission[31],
    insuranceGroup: submission[32],
    insuranceId: submission[33],
    subscriberName: submission[34],
    subscriberDob: submission[35],
    subscriberSsn: submission[36],
    subscriberRelationship: submission[37],
    insuranceCardFront: submission[38],
    insuranceCardBack: submission[39],
    insuranceAssignmentSig: submission[40],

    // Dental History (41-50)
    reasonForVisit: submission[41],
    formerDentist: submission[42],
    formerDentistCity: submission[43],
    lastDentalVisit: submission[44],
    currentlyInPain: submission[45],
    problemsPastWork: submission[46],
    headMouthInjury: submission[47],
    feelingsSmile: submission[48],
    problemsAnesthetic: submission[49],
    anestheticDetails: submission[50],

    // Medical History (51-59)
    underPhysicianCare: submission[51],
    physicianName: submission[52],
    physicianPhone: submission[53],
    inGoodHealth: submission[54],
    recentHealthChanges: submission[55],
    healthChangesDetails: submission[56],
    lastPhysicalExam: submission[57],
    seriousIllness: submission[58],
    illnessDetails: submission[59],

    // Medications & Allergies (60-62)
    currentMedications: submission[60],
    allergies: submission[61],
    otherAllergies: submission[62],

    // Medical Conditions (63)
    medicalConditions: submission[63],

    // Special Drug Questions (64-74)
    takenFenPhen: submission[64],
    takingFosamax: submission[65],
    takingBisphosphonates: submission[66],
    bisphosphonatesDate: submission[67],
    hasJointReplacement: submission[68],
    jointReplacementDate: submission[69],
    usesControlledSubstances: submission[70],
    usesTobacco: submission[71],
    drinksAlcohol: submission[72],
    alcoholLast24Hours: submission[73],
    alcoholPerWeek: submission[74],

    // Premedication & Women's Health (75-79)
    needsPremedication: submission[75],
    isPregnant: submission[76],
    pregnancyDueDate: submission[77],
    isNursing: submission[78],
    takesBirthControl: submission[79],

    // Pharmacy (80-81)
    pharmacyName: submission[80],
    pharmacyPhone: submission[81],

    // Consent & Signatures (82-91)
    financialPolicyName: submission[82],
    financialPolicyDate: submission[83],
    financialPolicySig: submission[84],
    hipaaName: submission[85],
    hipaaDate: submission[86],
    hipaaRelationship: submission[87],
    hipaaSig: submission[88],
    hipaaDisclosureImmediate: submission[89],
    hipaaDisclosureExtended: submission[90],
    hipaaDisclosureOther: submission[91],

    // Notes (92)
    notes: submission[92],
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button
            variant="destructive"
            onClick={deleteSubmission}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Submission
          </Button>
        </div>

        {/* Patient Name and Status */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{data.patientName}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted: {new Date(data.timestamp).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <select
                  value={status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Patient Demographics */}
        <Section title="Patient Demographics">
          <DataField label="Full Name" value={data.patientName} field="name" />
          <DataField label="Date of Birth" value={data.dob} field="dob" />
          <DataField label="Age" value={data.age} field="age" />
          <DataField label="Sex" value={data.sex} field="sex" />
          <DataField label="SSN" value={data.ssn} field="ssn" />
          <DataField label="Marital Status" value={data.maritalStatus} field="maritalStatus" />
        </Section>

        {/* Contact Information */}
        <Section title="Contact Information">
          <DataField label="Address" value={data.address} field="address" />
          <DataField label="City" value={data.city} field="city" />
          <DataField label="State" value={data.state} field="state" />
          <DataField label="ZIP Code" value={data.zip} field="zip" />
          <DataField label="Email" value={data.email} field="email" />
          <DataField label="Home Phone" value={data.phoneHome} field="phoneHome" />
          <DataField label="Cell Phone" value={data.phoneCell} field="phoneCell" />
          <DataField label="Work Phone" value={data.phoneWork} field="phoneWork" />
        </Section>

        {/* Emergency Contact */}
        <Section title="Emergency Contact">
          <DataField label="Contact Name" value={data.emergencyName} field="emergencyName" />
          <DataField label="Relationship" value={data.emergencyRelationship} field="emergencyRelationship" />
          <DataField label="Contact Phone" value={data.emergencyPhone} field="emergencyPhone" />
        </Section>

        {/* Employment/School */}
        <Section title="Employment/School">
          <DataField label="Employer/School" value={data.employer} field="employer" />
          <DataField label="Occupation/Grade" value={data.occupation} field="occupation" />
          <DataField label="Work/School Phone" value={data.workPhone} field="workPhone" />
        </Section>

        {/* Spouse/Partner Information */}
        {data.spouseName && (
          <Section title="Spouse/Partner Information">
            <DataField label="Spouse/Partner Name" value={data.spouseName} field="spouseName" />
            <DataField label="Spouse/Partner DOB" value={data.spouseDob} field="spouseDob" />
            <DataField label="Spouse/Partner SSN" value={data.spouseSsn} field="spouseSsn" />
            <DataField label="Spouse/Partner Employer" value={data.spouseEmployer} field="spouseEmployer" />
            <DataField label="Spouse/Partner Work Phone" value={data.spouseWorkPhone} field="spouseWorkPhone" />
          </Section>
        )}

        {/* Referral */}
        {data.referralSource && (
          <Section title="Referral">
            <DataField label="Referral Source" value={data.referralSource} field="referralSource" />
          </Section>
        )}

        {/* Insurance Information */}
        <Section title="Insurance Information">
          <DataField label="Has Insurance" value={data.hasInsurance} field="hasInsurance" />
          {data.hasInsurance === 'Yes' && (
            <>
              <DataField label="Account Responsible" value={data.accountResponsible} field="accountResponsible" />
              <DataField label="Account Relationship" value={data.accountRelationship} field="accountRelationship" />
              <DataField label="Insurance Company" value={data.insuranceCompany} field="insuranceCompany" />
              <DataField label="Group Number" value={data.insuranceGroup} field="insuranceGroup" />
              <DataField label="Member ID" value={data.insuranceId} field="insuranceId" />
              <DataField label="Subscriber Name" value={data.subscriberName} field="subscriberName" />
              <DataField label="Subscriber DOB" value={data.subscriberDob} field="subscriberDob" />
              <DataField label="Subscriber SSN" value={data.subscriberSsn} field="subscriberSsn" />
              <DataField label="Subscriber Relationship" value={data.subscriberRelationship} field="subscriberRelationship" />
              {data.insuranceCardFront && (
                <div className="py-2 border-b">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Insurance Card Front</p>
                  <div className="flex gap-3">
                    <a href={`/api/view-insurance-card?row=${resolvedParams.id}&side=front`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      📄 View Image
                    </a>
                    <a href={`/api/view-insurance-card?row=${resolvedParams.id}&side=front`} download={`insurance-card-front-${resolvedParams.id}.jpg`} className="text-green-600 hover:underline flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}
              {data.insuranceCardBack && (
                <div className="py-2 border-b">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Insurance Card Back</p>
                  <div className="flex gap-3">
                    <a href={`/api/view-insurance-card?row=${resolvedParams.id}&side=back`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      📄 View Image
                    </a>
                    <a href={`/api/view-insurance-card?row=${resolvedParams.id}&side=back`} download={`insurance-card-back-${resolvedParams.id}.jpg`} className="text-green-600 hover:underline flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}
              {data.insuranceAssignmentSig && data.insuranceAssignmentSig.startsWith('data:') && (
                <div className="py-2 border-b">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Insurance Assignment Signature</p>
                  <div className="flex gap-3">
                    <a href={`/api/view-signature?row=${resolvedParams.id}&type=assignment`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      ✍️ View Signature
                    </a>
                    <a href={`/api/view-signature?row=${resolvedParams.id}&type=assignment`} download={`signature-assignment-${resolvedParams.id}.png`} className="text-green-600 hover:underline flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
              )}
            </>
          )}
        </Section>

        {/* Dental History */}
        <Section title="Dental History">
          <DataField label="Reason for Visit" value={data.reasonForVisit} field="reasonForVisit" />
          <DataField label="Former Dentist" value={data.formerDentist} field="formerDentist" />
          <DataField label="Former Dentist City" value={data.formerDentistCity} field="formerDentistCity" />
          <DataField label="Last Dental Visit" value={data.lastDentalVisit} field="lastDentalVisit" />
          <DataField label="Currently in Pain" value={data.currentlyInPain} field="currentlyInPain" />
          <DataField label="Problems with Past Dental Work" value={data.problemsPastWork} field="problemsPastWork" />
          <DataField label="Serious Head/Mouth Injury" value={data.headMouthInjury} field="headMouthInjury" />
          <DataField label="Feelings About Smile" value={data.feelingsSmile} field="feelingsSmile" />
          <DataField label="Problems with Anesthetic" value={data.problemsAnesthetic} field="problemsAnesthetic" />
          {data.anestheticDetails && <DataField label="Anesthetic Details" value={data.anestheticDetails} field="anestheticDetails" />}
        </Section>

        {/* Medical History */}
        <Section title="Medical History">
          <DataField label="Under Physician Care" value={data.underPhysicianCare} field="underPhysicianCare" />
          {data.physicianName && <DataField label="Physician Name" value={data.physicianName} field="physicianName" />}
          {data.physicianPhone && <DataField label="Physician Phone" value={data.physicianPhone} field="physicianPhone" />}
          <DataField label="In Good Health" value={data.inGoodHealth} field="inGoodHealth" />
          <DataField label="Recent Health Changes" value={data.recentHealthChanges} field="recentHealthChanges" />
          {data.healthChangesDetails && <DataField label="Health Changes Details" value={data.healthChangesDetails} field="healthChangesDetails" />}
          <DataField label="Last Physical Exam" value={data.lastPhysicalExam} field="lastPhysicalExam" />
          <DataField label="Serious Illness (Last 5 Years)" value={data.seriousIllness} field="seriousIllness" />
          {data.illnessDetails && <DataField label="Illness Details" value={data.illnessDetails} field="illnessDetails" />}
        </Section>

        {/* Medications & Allergies */}
        <Section title="Medications & Allergies">
          <DataField label="Current Medications" value={data.currentMedications} field="currentMedications" />
          <DataField label="Allergies" value={data.allergies} field="allergies" />
          {data.otherAllergies && <DataField label="Other Allergies" value={data.otherAllergies} field="otherAllergies" />}
        </Section>

        {/* Medical Conditions */}
        <Section title="Medical Conditions">
          <DataField label="Medical Conditions" value={data.medicalConditions || 'None'} field="medicalConditions" />
        </Section>

        {/* Special Drug Questions */}
        <Section title="Special Drug Questions">
          <DataField label="Taken Fen-Phen" value={data.takenFenPhen} field="takenFenPhen" />
          <DataField label="Taking Fosamax/Actonel" value={data.takingFosamax} field="takingFosamax" />
          <DataField label="Taking Bisphosphonates" value={data.takingBisphosphonates} field="takingBisphosphonates" />
          {data.bisphosphonatesDate && <DataField label="Bisphosphonates Date" value={data.bisphosphonatesDate} field="bisphosphonatesDate" />}
          <DataField label="Has Joint Replacement" value={data.hasJointReplacement} field="hasJointReplacement" />
          {data.jointReplacementDate && <DataField label="Joint Replacement Date" value={data.jointReplacementDate} field="jointReplacementDate" />}
          <DataField label="Uses Controlled Substances" value={data.usesControlledSubstances} field="usesControlledSubstances" />
          <DataField label="Uses Tobacco" value={data.usesTobacco} field="usesTobacco" />
          <DataField label="Drinks Alcohol" value={data.drinksAlcohol} field="drinksAlcohol" />
          {data.alcoholLast24Hours && <DataField label="Alcohol (Last 24 Hours)" value={data.alcoholLast24Hours} field="alcoholLast24Hours" />}
          {data.alcoholPerWeek && <DataField label="Alcohol (Per Week)" value={data.alcoholPerWeek} field="alcoholPerWeek" />}
        </Section>

        {/* Premedication & Women's Health */}
        <Section title="Premedication & Women's Health">
          <DataField label="Needs Premedication" value={data.needsPremedication} field="needsPremedication" />
          <DataField label="Is Pregnant" value={data.isPregnant} field="isPregnant" />
          {data.pregnancyDueDate && <DataField label="Pregnancy Due Date" value={data.pregnancyDueDate} field="pregnancyDueDate" />}
          <DataField label="Is Nursing" value={data.isNursing} field="isNursing" />
          <DataField label="Takes Birth Control" value={data.takesBirthControl} field="takesBirthControl" />
        </Section>

        {/* Pharmacy */}
        {data.pharmacyName && (
          <Section title="Pharmacy">
            <DataField label="Pharmacy Name" value={data.pharmacyName} field="pharmacyName" />
            <DataField label="Pharmacy Phone" value={data.pharmacyPhone} field="pharmacyPhone" />
          </Section>
        )}

        {/* Consent & Signatures */}
        <Section title="Consent & Signatures">
          <DataField label="Financial Policy - Printed Name" value={data.financialPolicyName} field="financialPolicyName" />
          <DataField label="Financial Policy - Date" value={data.financialPolicyDate} field="financialPolicyDate" />
          {data.financialPolicySig && data.financialPolicySig.startsWith('data:') && (
            <div className="py-2 border-b">
              <p className="text-sm font-medium text-muted-foreground mb-2">Financial Policy Signature</p>
              <div className="flex gap-3">
                <a href={`/api/view-signature?row=${resolvedParams.id}&type=financial`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ✍️ View Signature
                </a>
                <a href={`/api/view-signature?row=${resolvedParams.id}&type=financial`} download={`signature-financial-${resolvedParams.id}.png`} className="text-green-600 hover:underline flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          )}
          <DataField label="HIPAA - Patient Name" value={data.hipaaName} field="hipaaName" />
          <DataField label="HIPAA - Date" value={data.hipaaDate} field="hipaaDate" />
          {data.hipaaRelationship && <DataField label="HIPAA - Relationship" value={data.hipaaRelationship} field="hipaaRelationship" />}
          {data.hipaaSig && data.hipaaSig.startsWith('data:') && (
            <div className="py-2 border-b">
              <p className="text-sm font-medium text-muted-foreground mb-2">HIPAA Signature</p>
              <div className="flex gap-3">
                <a href={`/api/view-signature?row=${resolvedParams.id}&type=hipaa`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ✍️ View Signature
                </a>
                <a href={`/api/view-signature?row=${resolvedParams.id}&type=hipaa`} download={`signature-hipaa-${resolvedParams.id}.png`} className="text-green-600 hover:underline flex items-center gap-1">
                  <Download className="h-4 w-4" />
                  Download
                </a>
              </div>
            </div>
          )}
          {data.hipaaDisclosureImmediate && <DataField label="HIPAA Disclosure (Immediate)" value={data.hipaaDisclosureImmediate} field="hipaaDisclosureImmediate" />}
          {data.hipaaDisclosureExtended && <DataField label="HIPAA Disclosure (Extended)" value={data.hipaaDisclosureExtended} field="hipaaDisclosureExtended" />}
          {data.hipaaDisclosureOther && <DataField label="HIPAA Disclosure (Other)" value={data.hipaaDisclosureOther} field="hipaaDisclosureOther" />}
        </Section>

        {/* Staff Notes */}
        {data.notes && (
          <Section title="Staff Notes">
            <DataField label="Notes" value={data.notes} field="notes" />
          </Section>
        )}
      </div>
    </div>
  )
}

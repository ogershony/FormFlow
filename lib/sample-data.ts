import type {
  PatientInfoFormData,
  InsuranceInfoFormData,
  MedicalHistoryFormData,
  ConsentSignaturesFormData,
  CompleteFormData
} from './schemas'

// Sample base64 signature (a simple signature image)
const SAMPLE_SIGNATURE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

export const samplePatientInfo: PatientInfoFormData = {
  patientName: "John Doe",
  ssn: "123-45-6789",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  zip: "94102",
  email: "john.doe@example.com",
  sex: "male",
  birthdate: "1990-01-15",
  age: "34",
  status: "single",
  employerSchool: "Tech Company Inc",
  occupationGrade: "Software Engineer",
  workSchoolPhone: "555-0100",
  spousePartnerName: "",
  spouseBirthdate: "",
  spouseSsn: "",
  spouseEmployer: "",
  referralSource: "Google Search",
  phoneHome: "555-0101",
  phoneWork: "555-0102",
  phoneCell: "555-0103",
  spouseWorkPhone: "",
  emergencyContact: "Jane Doe",
  emergencyRelationship: "Sister",
  emergencyPhone: "555-0104",
}

export const sampleInsuranceInfo: InsuranceInfoFormData = {
  hasInsurance: true,
  accountResponsible: "John Doe",
  accountRelationship: "Self",
  insuranceCompany: "Blue Cross Blue Shield",
  insuranceGroup: "GRP123456",
  insuranceId: "INS987654321",
  subscriberName: "John Doe",
  subscriberBirthdate: "1990-01-15",
  subscriberSsn: "123-45-6789",
  subscriberRelationship: "Self",
  insuranceCardFront: "",
  insuranceCardBack: "",
  assignmentSignature: SAMPLE_SIGNATURE,
  assignmentDate: new Date().toISOString().split('T')[0],
}

export const sampleMedicalHistory: MedicalHistoryFormData = {
  // Dental History
  reasonForVisit: "Regular checkup and cleaning",
  formerDentist: "Dr. Smith",
  formerDentistCity: "Oakland",
  lastDentalVisit: "2023-06-15",
  currentlyInPain: false,
  problemsWithPastDentalWork: false,
  seriousHeadMouthInjury: false,
  feelingsAboutSmile: "Happy with my smile",
  problemsWithAnesthetic: false,
  anestheticDetails: "",

  // Medical History
  underPhysicianCare: true,
  physicianName: "Dr. Johnson",
  physicianPhone: "555-0200",
  inGoodHealth: true,
  recentHealthChanges: false,
  healthChangesDetails: "",
  lastPhysicalExam: "2024-01-15",
  seriousIllnessLast5Years: false,
  illnessDetails: "",

  // Special Drug Questions
  takenFenPhen: false,
  takingFosamaxActonel: false,
  takingBisphosphonates: false,
  bisphosphonatesDate: "",
  hasJointReplacement: false,
  jointReplacementDate: "",
  usesControlledSubstances: false,
  usesTobacco: false,
  drinksAlcohol: false,
  alcoholLast24Hours: "",
  alcoholPerWeek: "",

  // Medical Conditions
  medicalConditions: [],

  // Premedication
  needsPremedication: false,

  // Women's Health
  isPregnant: false,
  pregnancyDueDate: "",
  isNursing: false,
  takesBirthControl: false,

  // Medications & Allergies
  currentMedications: "None",
  allergies: [],
  otherAllergies: "",
  pharmacyName: "CVS Pharmacy",
  pharmacyPhone: "555-0300",
}

export const sampleConsentSignatures: ConsentSignaturesFormData = {
  financialPolicySignature: SAMPLE_SIGNATURE,
  financialPolicyDate: new Date().toISOString().split('T')[0],
  financialPolicyName: "John Doe",

  hipaaSignature: SAMPLE_SIGNATURE,
  hipaaDate: new Date().toISOString().split('T')[0],
  hipaaName: "John Doe",
  hipaaRelationship: "Self",
  hipaaDisclosureImmediate: true,
  hipaaDisclosureExtended: false,
  hipaaDisclosureOther: "",
}

export const sampleCompleteForm: CompleteFormData = {
  patientInfo: samplePatientInfo,
  insuranceInfo: sampleInsuranceInfo,
  medicalHistory: sampleMedicalHistory,
  consentSignatures: sampleConsentSignatures,
}

// Helper function to submit sample form directly (for dev debugging)
export async function submitSampleForm() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Sample form submission is only available in development mode')
  }

  const response = await fetch('/api/submit-form', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sampleCompleteForm),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.details || 'Failed to submit sample form')
  }

  return await response.json()
}

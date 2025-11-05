import { z } from "zod"

// Step 1: Patient Information Schema
export const patientInfoSchema = z.object({
  patientName: z.string().min(1, "Patient name is required"),
  ssn: z.string().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required"),
  zip: z.string().min(5, "ZIP code is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  sex: z.enum(["male", "female", "other"]),
  birthdate: z.string().min(1, "Birthdate is required"),
  age: z.string(),
  status: z.enum(["married", "single", "widowed", "minor", "separated", "divorced", "partnered"]),
  employerSchool: z.string().optional(),
  occupationGrade: z.string().optional(),
  workSchoolPhone: z.string().optional(),
  spousePartnerName: z.string().optional(),
  spouseBirthdate: z.string().optional(),
  spouseSsn: z.string().optional(),
  spouseEmployer: z.string().optional(),
  referralSource: z.string().optional(),
  phoneHome: z.string().optional(),
  phoneWork: z.string().optional(),
  phoneCell: z.string().min(1, "At least one phone number is required"),
  spouseWorkPhone: z.string().optional(),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
  emergencyRelationship: z.string().min(1, "Emergency contact relationship is required"),
  emergencyPhone: z.string().min(1, "Emergency contact phone is required"),
})

// Step 2: Insurance Information Schema
export const insuranceInfoSchema = z.object({
  hasInsurance: z.boolean(),
  accountResponsible: z.string().optional(),
  accountRelationship: z.string().optional(),
  insuranceCompany: z.string().optional(),
  insuranceGroup: z.string().optional(),
  insuranceId: z.string().optional(),
  subscriberName: z.string().optional(),
  subscriberBirthdate: z.string().optional(),
  subscriberSsn: z.string().optional(),
  subscriberRelationship: z.string().optional(),
  insuranceCardFront: z.string().optional(), // Base64 or URL
  insuranceCardBack: z.string().optional(), // Base64 or URL
  assignmentSignature: z.string().optional(), // Base64 signature
  assignmentDate: z.string().optional(),
})

// Step 3: Medical History Schema
export const medicalHistorySchema = z.object({
  // Dental History
  reasonForVisit: z.string().min(1, "Reason for visit is required"),
  formerDentist: z.string().optional(),
  formerDentistCity: z.string().optional(),
  lastDentalVisit: z.string().optional(),
  currentlyInPain: z.boolean(),
  problemsWithPastDentalWork: z.boolean(),
  seriousHeadMouthInjury: z.boolean(),
  feelingsAboutSmile: z.string().optional(),
  problemsWithAnesthetic: z.boolean(),
  anestheticDetails: z.string().optional(),

  // Medical History
  underPhysicianCare: z.boolean(),
  physicianName: z.string().optional(),
  physicianPhone: z.string().optional(),
  inGoodHealth: z.boolean(),
  recentHealthChanges: z.boolean(),
  healthChangesDetails: z.string().optional(),
  lastPhysicalExam: z.string().optional(),
  seriousIllnessLast5Years: z.boolean(),
  illnessDetails: z.string().optional(),

  // Special Drug Questions
  takenFenPhen: z.boolean(),
  takingFosamaxActonel: z.boolean(),
  takingBisphosphonates: z.boolean(),
  bisphosphonatesDate: z.string().optional(),
  hasJointReplacement: z.boolean(),
  jointReplacementDate: z.string().optional(),
  usesControlledSubstances: z.boolean(),
  usesTobacco: z.boolean(),
  drinksAlcohol: z.boolean(),
  alcoholLast24Hours: z.string().optional(),
  alcoholPerWeek: z.string().optional(),

  // Medical Conditions (checkboxes)
  medicalConditions: z.array(z.string()),

  // Premedication
  needsPremedication: z.boolean(),

  // Women's Health
  isPregnant: z.boolean(),
  pregnancyDueDate: z.string().optional(),
  isNursing: z.boolean(),
  takesBirthControl: z.boolean(),

  // Medications & Allergies
  currentMedications: z.string().optional(),
  allergies: z.array(z.string()),
  otherAllergies: z.string().optional(),
  pharmacyName: z.string().optional(),
  pharmacyPhone: z.string().optional(),
})

// Step 4: Consent & Signatures Schema
export const consentSignaturesSchema = z.object({
  financialPolicySignature: z.string().min(1, "Financial policy signature is required"),
  financialPolicyDate: z.string().min(1, "Date is required"),
  financialPolicyName: z.string().min(1, "Printed name is required"),

  hipaaSignature: z.string().min(1, "HIPAA acknowledgment signature is required"),
  hipaaDate: z.string().min(1, "Date is required"),
  hipaaName: z.string().min(1, "Patient name is required"),
  hipaaRelationship: z.string().optional(),
  hipaaDisclosureImmediate: z.boolean(),
  hipaaDisclosureExtended: z.boolean(),
  hipaaDisclosureOther: z.string().optional(),
})

// Complete Form Schema (all steps combined)
export const completeFormSchema = z.object({
  patientInfo: patientInfoSchema,
  insuranceInfo: insuranceInfoSchema,
  medicalHistory: medicalHistorySchema,
  consentSignatures: consentSignaturesSchema,
})

export type PatientInfoFormData = z.infer<typeof patientInfoSchema>
export type InsuranceInfoFormData = z.infer<typeof insuranceInfoSchema>
export type MedicalHistoryFormData = z.infer<typeof medicalHistorySchema>
export type ConsentSignaturesFormData = z.infer<typeof consentSignaturesSchema>
export type CompleteFormData = z.infer<typeof completeFormSchema>

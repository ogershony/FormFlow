import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface SubmissionData {
  // System fields
  timestamp: string
  status: string

  // Patient Demographics
  patientName: string
  dob: string
  age: string
  sex: string
  ssn?: string
  maritalStatus: string

  // Contact Information
  address: string
  city: string
  state: string
  zip: string
  email?: string
  phoneHome?: string
  phoneCell: string
  phoneWork?: string

  // Emergency Contact
  emergencyName: string
  emergencyRelationship: string
  emergencyPhone: string

  // Employment/School
  employer?: string
  occupation?: string
  workPhone?: string

  // Spouse/Partner
  spouseName?: string
  spouseDob?: string
  spouseSsn?: string
  spouseEmployer?: string
  spouseWorkPhone?: string

  // Referral
  referralSource?: string

  // Insurance
  hasInsurance: string
  accountResponsible?: string
  accountRelationship?: string
  insuranceCompany?: string
  insuranceGroup?: string
  insuranceId?: string
  subscriberName?: string
  subscriberDob?: string
  subscriberSsn?: string
  subscriberRelationship?: string

  // Dental History
  reasonForVisit: string
  formerDentist?: string
  formerDentistCity?: string
  lastDentalVisit?: string
  currentlyInPain: string
  problemsPastWork: string
  headMouthInjury: string
  feelingsSmile?: string
  problemsAnesthetic: string
  anestheticDetails?: string

  // Medical History
  underPhysicianCare: string
  physicianName?: string
  physicianPhone?: string
  inGoodHealth: string
  recentHealthChanges: string
  healthChangesDetails?: string
  lastPhysicalExam?: string
  seriousIllness: string
  illnessDetails?: string

  // Medications & Allergies
  currentMedications?: string
  allergies?: string
  otherAllergies?: string

  // Medical Conditions
  medicalConditions?: string

  // Special Drug Questions
  takenFenPhen: string
  takingFosamax: string
  takingBisphosphonates: string
  bisphosphonatesDate?: string
  hasJointReplacement: string
  jointReplacementDate?: string
  usesControlledSubstances: string
  usesTobacco: string
  drinksAlcohol: string
  alcoholLast24Hours?: string
  alcoholPerWeek?: string

  // Premedication & Women's Health
  needsPremedication: string
  isPregnant: string
  pregnancyDueDate?: string
  isNursing: string
  takesBirthControl: string

  // Pharmacy
  pharmacyName?: string
  pharmacyPhone?: string

  // Consent
  financialPolicyName: string
  financialPolicyDate: string
  hipaaName: string
  hipaaDate: string
  hipaaRelationship?: string
  hipaaDisclosureImmediate?: string
  hipaaDisclosureExtended?: string
  hipaaDisclosureOther?: string
}

export function generatePatientFormPDF(data: SubmissionData): Buffer {
  const doc = new jsPDF()

  let yPosition = 20
  const pageWidth = doc.internal.pageSize.getWidth()
  const leftMargin = 14
  const rightMargin = pageWidth - 14
  const contentWidth = rightMargin - leftMargin

  // Helper function to add a section header
  const addSectionHeader = (title: string) => {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(title, leftMargin, yPosition)
    yPosition += 7
  }

  // Helper function to check if we need a new page
  const checkPageBreak = (neededSpace: number) => {
    if (yPosition + neededSpace > 280) {
      doc.addPage()
      yPosition = 20
      return true
    }
    return false
  }

  // Helper function to add a field
  const addField = (label: string, value: string | undefined, inline: boolean = false) => {
    checkPageBreak(inline ? 10 : 15)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    const labelWidth = doc.getTextWidth(label)
    doc.text(label, leftMargin, yPosition)

    doc.setFont('helvetica', 'normal')
    const valueText = value || 'N/A'

    if (inline) {
      doc.text(valueText, leftMargin + labelWidth + 2, yPosition)
      yPosition += 5
    } else {
      const lines = doc.splitTextToSize(valueText, contentWidth - 10)
      doc.text(lines, leftMargin + labelWidth + 2, yPosition)
      yPosition += (lines.length * 5) + 3
    }
  }

  // Header with practice information
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('MALINDA LAM-GERSHONY, DDS', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 6

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('16710 NE 79th ST-Suite 100', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 5
  doc.text('Redmond, WA 98052', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 5
  doc.text('425.867.1484', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('PATIENT REGISTRATION FORM', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 10

  // Submission Info
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text(`Submitted: ${new Date(data.timestamp).toLocaleString()}`, leftMargin, yPosition)
  doc.text(`Status: ${data.status}`, rightMargin - 40, yPosition)
  yPosition += 10

  // PATIENT INFORMATION Section
  addSectionHeader('PATIENT INFORMATION')
  addField('Patient Name: ', data.patientName, true)
  addField('Date of Birth: ', data.dob, true)
  addField('Age: ', data.age, true)
  addField('Sex: ', data.sex, true)
  if (data.ssn) addField('SSN: ', data.ssn, true)
  addField('Marital Status: ', data.maritalStatus, true)
  yPosition += 3

  addField('Address: ', data.address, true)
  addField('City: ', data.city, true)
  addField('State: ', data.state, true)
  addField('ZIP: ', data.zip, true)
  if (data.email) addField('Email: ', data.email, true)
  yPosition += 3

  // PHONE NUMBERS
  addSectionHeader('PHONE NUMBERS')
  if (data.phoneHome) addField('Home: ', data.phoneHome, true)
  addField('Cell: ', data.phoneCell, true)
  if (data.phoneWork) addField('Work: ', data.phoneWork, true)
  yPosition += 5

  // EMERGENCY CONTACT
  addSectionHeader('EMERGENCY CONTACT')
  addField('Contact Name: ', data.emergencyName, true)
  addField('Relationship: ', data.emergencyRelationship, true)
  addField('Phone: ', data.emergencyPhone, true)
  yPosition += 5

  // EMPLOYMENT/SCHOOL
  if (data.employer || data.occupation) {
    checkPageBreak(20)
    addSectionHeader('EMPLOYMENT/SCHOOL')
    if (data.employer) addField('Employer/School: ', data.employer, true)
    if (data.occupation) addField('Occupation/Grade: ', data.occupation, true)
    if (data.workPhone) addField('Work/School Phone: ', data.workPhone, true)
    yPosition += 5
  }

  // SPOUSE/PARTNER INFORMATION
  if (data.spouseName) {
    checkPageBreak(25)
    addSectionHeader('SPOUSE/PARTNER INFORMATION')
    addField('Name: ', data.spouseName, true)
    if (data.spouseDob) addField('Date of Birth: ', data.spouseDob, true)
    if (data.spouseSsn) addField('SSN: ', data.spouseSsn, true)
    if (data.spouseEmployer) addField('Employer: ', data.spouseEmployer, true)
    if (data.spouseWorkPhone) addField('Work Phone: ', data.spouseWorkPhone, true)
    yPosition += 5
  }

  // REFERRAL
  if (data.referralSource) {
    checkPageBreak(15)
    addSectionHeader('REFERRAL SOURCE')
    addField('Referred by: ', data.referralSource, true)
    yPosition += 5
  }

  // DENTAL INSURANCE
  checkPageBreak(30)
  addSectionHeader('DENTAL INSURANCE')
  addField('Has Insurance: ', data.hasInsurance, true)
  if (data.hasInsurance === 'Yes') {
    if (data.accountResponsible) addField('Responsible Party: ', data.accountResponsible, true)
    if (data.accountRelationship) addField('Relationship to Patient: ', data.accountRelationship, true)
    if (data.insuranceCompany) addField('Insurance Company: ', data.insuranceCompany, true)
    if (data.insuranceGroup) addField('Group #: ', data.insuranceGroup, true)
    if (data.insuranceId) addField('ID #: ', data.insuranceId, true)
    if (data.subscriberName) addField('Subscriber Name: ', data.subscriberName, true)
    if (data.subscriberDob) addField('Subscriber DOB: ', data.subscriberDob, true)
    if (data.subscriberSsn) addField('Subscriber SSN: ', data.subscriberSsn, true)
    if (data.subscriberRelationship) addField('Subscriber Relationship: ', data.subscriberRelationship, true)
  }
  yPosition += 5

  // DENTAL HISTORY
  checkPageBreak(40)
  addSectionHeader('DENTAL HISTORY')
  addField('Reason for Visit: ', data.reasonForVisit, false)
  if (data.formerDentist) addField('Former Dentist: ', data.formerDentist, true)
  if (data.formerDentistCity) addField('City/State: ', data.formerDentistCity, true)
  if (data.lastDentalVisit) addField('Last Visit: ', data.lastDentalVisit, true)
  addField('Currently in Pain: ', data.currentlyInPain, true)
  addField('Problems with Past Dental Work: ', data.problemsPastWork, true)
  addField('Serious Head/Mouth Injury: ', data.headMouthInjury, true)
  if (data.feelingsSmile) addField('Feelings About Smile: ', data.feelingsSmile, false)
  addField('Problems with Anesthetic: ', data.problemsAnesthetic, true)
  if (data.anestheticDetails) addField('Anesthetic Details: ', data.anestheticDetails, false)
  yPosition += 5

  // MEDICAL HISTORY
  checkPageBreak(45)
  addSectionHeader('MEDICAL HISTORY')
  addField('Under Physician Care: ', data.underPhysicianCare, true)
  if (data.physicianName) addField('Physician Name: ', data.physicianName, true)
  if (data.physicianPhone) addField('Physician Phone: ', data.physicianPhone, true)
  addField('In Good Health: ', data.inGoodHealth, true)
  addField('Recent Health Changes: ', data.recentHealthChanges, true)
  if (data.healthChangesDetails) addField('Health Changes Details: ', data.healthChangesDetails, false)
  if (data.lastPhysicalExam) addField('Last Physical Exam: ', data.lastPhysicalExam, true)
  addField('Serious Illness (Last 5 Years): ', data.seriousIllness, true)
  if (data.illnessDetails) addField('Illness Details: ', data.illnessDetails, false)
  yPosition += 5

  // MEDICATIONS & ALLERGIES
  checkPageBreak(30)
  addSectionHeader('MEDICATIONS & ALLERGIES')
  if (data.currentMedications) {
    addField('Current Medications: ', data.currentMedications, false)
  }
  if (data.allergies) {
    addField('Allergies: ', data.allergies, false)
  }
  if (data.otherAllergies) {
    addField('Other Allergies: ', data.otherAllergies, false)
  }
  yPosition += 5

  // MEDICAL CONDITIONS
  if (data.medicalConditions) {
    checkPageBreak(20)
    addSectionHeader('MEDICAL CONDITIONS')
    addField('Conditions: ', data.medicalConditions, false)
    yPosition += 5
  }

  // SPECIAL DRUG QUESTIONS
  checkPageBreak(50)
  addSectionHeader('HEALTH HISTORY - SPECIAL QUESTIONS')
  addField('Taken Fen-Phen: ', data.takenFenPhen, true)
  addField('Taking Fosamax/Actonel: ', data.takingFosamax, true)
  addField('Taking Bisphosphonates: ', data.takingBisphosphonates, true)
  if (data.bisphosphonatesDate) addField('Bisphosphonates Date: ', data.bisphosphonatesDate, true)
  addField('Has Joint Replacement: ', data.hasJointReplacement, true)
  if (data.jointReplacementDate) addField('Joint Replacement Date: ', data.jointReplacementDate, true)
  addField('Uses Controlled Substances: ', data.usesControlledSubstances, true)
  addField('Uses Tobacco: ', data.usesTobacco, true)
  addField('Drinks Alcohol: ', data.drinksAlcohol, true)
  if (data.alcoholLast24Hours) addField('Alcohol (Last 24 Hours): ', data.alcoholLast24Hours, true)
  if (data.alcoholPerWeek) addField('Alcohol (Per Week): ', data.alcoholPerWeek, true)
  yPosition += 5

  // PREMEDICATION & WOMEN'S HEALTH
  checkPageBreak(30)
  addSectionHeader("PREMEDICATION & WOMEN'S HEALTH")
  addField('Needs Premedication: ', data.needsPremedication, true)
  addField('Is Pregnant: ', data.isPregnant, true)
  if (data.pregnancyDueDate) addField('Due Date: ', data.pregnancyDueDate, true)
  addField('Is Nursing: ', data.isNursing, true)
  addField('Takes Birth Control: ', data.takesBirthControl, true)
  yPosition += 5

  // PHARMACY
  if (data.pharmacyName) {
    checkPageBreak(20)
    addSectionHeader('PHARMACY')
    addField('Pharmacy Name: ', data.pharmacyName, true)
    if (data.pharmacyPhone) addField('Pharmacy Phone: ', data.pharmacyPhone, true)
    yPosition += 5
  }

  // CONSENT & SIGNATURES
  checkPageBreak(30)
  addSectionHeader('CONSENT & SIGNATURES')
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.text('Financial Policy and HIPAA forms have been signed and acknowledged.', leftMargin, yPosition)
  yPosition += 7

  addField('Financial Policy - Name: ', data.financialPolicyName, true)
  addField('Financial Policy - Date: ', data.financialPolicyDate, true)
  yPosition += 3

  addField('HIPAA - Name: ', data.hipaaName, true)
  addField('HIPAA - Date: ', data.hipaaDate, true)
  if (data.hipaaRelationship) addField('HIPAA - Relationship: ', data.hipaaRelationship, true)
  if (data.hipaaDisclosureImmediate) addField('HIPAA Disclosure (Immediate Family): ', data.hipaaDisclosureImmediate, true)
  if (data.hipaaDisclosureExtended) addField('HIPAA Disclosure (Extended Family): ', data.hipaaDisclosureExtended, true)
  if (data.hipaaDisclosureOther) addField('HIPAA Disclosure (Other): ', data.hipaaDisclosureOther, true)

  // Footer
  checkPageBreak(20)
  yPosition += 10
  doc.setFontSize(8)
  doc.setFont('helvetica', 'italic')
  doc.text('This document contains protected health information and should be handled in accordance with HIPAA regulations.',
    pageWidth / 2, yPosition, { align: 'center' })

  // Convert to buffer
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  return pdfBuffer
}

export function generatePatientFormPDFFromRow(row: any[]): Buffer {
  // Map row data to SubmissionData structure
  const data: SubmissionData = {
    timestamp: row[0] || '',
    status: row[1] || 'New',
    patientName: row[2] || '',
    dob: row[3] || '',
    age: row[4] || '',
    sex: row[5] || '',
    ssn: row[6] || '',
    maritalStatus: row[7] || '',
    address: row[8] || '',
    city: row[9] || '',
    state: row[10] || '',
    zip: row[11] || '',
    email: row[12] || '',
    phoneHome: row[13] || '',
    phoneCell: row[14] || '',
    phoneWork: row[15] || '',
    emergencyName: row[16] || '',
    emergencyRelationship: row[17] || '',
    emergencyPhone: row[18] || '',
    employer: row[19] || '',
    occupation: row[20] || '',
    workPhone: row[21] || '',
    spouseName: row[22] || '',
    spouseDob: row[23] || '',
    spouseSsn: row[24] || '',
    spouseEmployer: row[25] || '',
    spouseWorkPhone: row[26] || '',
    referralSource: row[27] || '',
    hasInsurance: row[28] || 'No',
    accountResponsible: row[29] || '',
    accountRelationship: row[30] || '',
    insuranceCompany: row[31] || '',
    insuranceGroup: row[32] || '',
    insuranceId: row[33] || '',
    subscriberName: row[34] || '',
    subscriberDob: row[35] || '',
    subscriberSsn: row[36] || '',
    subscriberRelationship: row[37] || '',
    reasonForVisit: row[41] || '',
    formerDentist: row[42] || '',
    formerDentistCity: row[43] || '',
    lastDentalVisit: row[44] || '',
    currentlyInPain: row[45] || 'No',
    problemsPastWork: row[46] || 'No',
    headMouthInjury: row[47] || 'No',
    feelingsSmile: row[48] || '',
    problemsAnesthetic: row[49] || 'No',
    anestheticDetails: row[50] || '',
    underPhysicianCare: row[51] || 'No',
    physicianName: row[52] || '',
    physicianPhone: row[53] || '',
    inGoodHealth: row[54] || 'Yes',
    recentHealthChanges: row[55] || 'No',
    healthChangesDetails: row[56] || '',
    lastPhysicalExam: row[57] || '',
    seriousIllness: row[58] || 'No',
    illnessDetails: row[59] || '',
    currentMedications: row[60] || '',
    allergies: row[61] || '',
    otherAllergies: row[62] || '',
    medicalConditions: row[63] || '',
    takenFenPhen: row[64] || 'No',
    takingFosamax: row[65] || 'No',
    takingBisphosphonates: row[66] || 'No',
    bisphosphonatesDate: row[67] || '',
    hasJointReplacement: row[68] || 'No',
    jointReplacementDate: row[69] || '',
    usesControlledSubstances: row[70] || 'No',
    usesTobacco: row[71] || 'No',
    drinksAlcohol: row[72] || 'No',
    alcoholLast24Hours: row[73] || '',
    alcoholPerWeek: row[74] || '',
    needsPremedication: row[75] || 'No',
    isPregnant: row[76] || 'No',
    pregnancyDueDate: row[77] || '',
    isNursing: row[78] || 'No',
    takesBirthControl: row[79] || 'No',
    pharmacyName: row[80] || '',
    pharmacyPhone: row[81] || '',
    financialPolicyName: row[82] || '',
    financialPolicyDate: row[83] || '',
    hipaaName: row[85] || '',
    hipaaDate: row[86] || '',
    hipaaRelationship: row[87] || '',
    hipaaDisclosureImmediate: row[89] || '',
    hipaaDisclosureExtended: row[90] || '',
    hipaaDisclosureOther: row[91] || '',
  }

  return generatePatientFormPDF(data)
}

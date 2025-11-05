'use client'

import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { medicalHistorySchema, type MedicalHistoryFormData } from '@/lib/schemas'
import { useFormStorage } from '@/lib/use-form-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/PatientForm/ProgressBar'
import { medicalConditions, allergyOptions } from '@/data/medical-conditions'

const initialData: MedicalHistoryFormData = {
  reasonForVisit: '',
  formerDentist: '',
  formerDentistCity: '',
  lastDentalVisit: '',
  currentlyInPain: false,
  problemsWithPastDentalWork: false,
  seriousHeadMouthInjury: false,
  feelingsAboutSmile: '',
  problemsWithAnesthetic: false,
  anestheticDetails: '',
  underPhysicianCare: false,
  physicianName: '',
  physicianPhone: '',
  inGoodHealth: true,
  recentHealthChanges: false,
  healthChangesDetails: '',
  lastPhysicalExam: '',
  seriousIllnessLast5Years: false,
  illnessDetails: '',
  takenFenPhen: false,
  takingFosamaxActonel: false,
  takingBisphosphonates: false,
  bisphosphonatesDate: '',
  hasJointReplacement: false,
  jointReplacementDate: '',
  usesControlledSubstances: false,
  usesTobacco: false,
  drinksAlcohol: false,
  alcoholLast24Hours: '',
  alcoholPerWeek: '',
  medicalConditions: [],
  needsPremedication: false,
  isPregnant: false,
  pregnancyDueDate: '',
  isNursing: false,
  takesBirthControl: false,
  currentMedications: '',
  allergies: [],
  otherAllergies: '',
  pharmacyName: '',
  pharmacyPhone: '',
}

export default function Step3MedicalPage() {
  const router = useRouter()
  const { data, setData, isLoaded } = useFormStorage(initialData, 'medicalHistory')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    control,
  } = useForm<MedicalHistoryFormData>({
    resolver: zodResolver(medicalHistorySchema),
    defaultValues: data,
  })

  const onSubmit = (formData: MedicalHistoryFormData) => {
    setData(formData)
    router.push('/form/step-4-consent')
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 pb-16">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProgressBar currentStep={3} totalSteps={4} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Medical History</CardTitle>
            <CardDescription>
              Please provide your complete medical and dental history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Dental History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Dental History</h3>

                <div>
                  <Label htmlFor="reasonForVisit">Reason for Today's Visit *</Label>
                  <Input
                    id="reasonForVisit"
                    {...register('reasonForVisit')}
                    placeholder="Routine cleaning, toothache, etc."
                  />
                  {errors.reasonForVisit && (
                    <p className="text-sm text-destructive mt-1">{errors.reasonForVisit.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="formerDentist">Former Dentist</Label>
                    <Input
                      id="formerDentist"
                      {...register('formerDentist')}
                      placeholder="Dr. Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="formerDentistCity">City/State</Label>
                    <Input
                      id="formerDentistCity"
                      {...register('formerDentistCity')}
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastDentalVisit">Last Dental Visit</Label>
                  <Input
                    id="lastDentalVisit"
                    type="date"
                    {...register('lastDentalVisit')}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="currentlyInPain" {...register('currentlyInPain')} />
                    <Label htmlFor="currentlyInPain" className="cursor-pointer">
                      Are you currently in pain?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="problemsWithPastDentalWork" {...register('problemsWithPastDentalWork')} />
                    <Label htmlFor="problemsWithPastDentalWork" className="cursor-pointer">
                      Have you had any problems with past dental work?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="seriousHeadMouthInjury" {...register('seriousHeadMouthInjury')} />
                    <Label htmlFor="seriousHeadMouthInjury" className="cursor-pointer">
                      Have you had any serious head/mouth injury?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="problemsWithAnesthetic" {...register('problemsWithAnesthetic')} />
                    <Label htmlFor="problemsWithAnesthetic" className="cursor-pointer">
                      Any problems with dental anesthetic?
                    </Label>
                  </div>
                </div>

                {watch('problemsWithAnesthetic') && (
                  <div>
                    <Label htmlFor="anestheticDetails">Please describe</Label>
                    <Textarea
                      id="anestheticDetails"
                      {...register('anestheticDetails')}
                      placeholder="Describe the problem..."
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="feelingsAboutSmile">How do you feel about your smile?</Label>
                  <Input
                    id="feelingsAboutSmile"
                    {...register('feelingsAboutSmile')}
                    placeholder="Optional"
                  />
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Medical History</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="underPhysicianCare" {...register('underPhysicianCare')} />
                    <Label htmlFor="underPhysicianCare" className="cursor-pointer">
                      Are you under the care of a physician?
                    </Label>
                  </div>
                </div>

                {watch('underPhysicianCare') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="physicianName">Physician Name</Label>
                      <Input
                        id="physicianName"
                        {...register('physicianName')}
                        placeholder="Dr. Name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="physicianPhone">Physician Phone</Label>
                      <Input
                        id="physicianPhone"
                        {...register('physicianPhone')}
                        placeholder="(425) 555-0123"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="inGoodHealth" {...register('inGoodHealth')} />
                    <Label htmlFor="inGoodHealth" className="cursor-pointer">
                      Are you in good health?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="recentHealthChanges" {...register('recentHealthChanges')} />
                    <Label htmlFor="recentHealthChanges" className="cursor-pointer">
                      Has there been any changes in your general health within the last year?
                    </Label>
                  </div>
                </div>

                {watch('recentHealthChanges') && (
                  <div>
                    <Label htmlFor="healthChangesDetails">Please describe</Label>
                    <Textarea
                      id="healthChangesDetails"
                      {...register('healthChangesDetails')}
                      placeholder="Describe the changes..."
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="lastPhysicalExam">Date of Last Physical Exam</Label>
                  <Input
                    id="lastPhysicalExam"
                    type="date"
                    {...register('lastPhysicalExam')}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="seriousIllnessLast5Years" {...register('seriousIllnessLast5Years')} />
                  <Label htmlFor="seriousIllnessLast5Years" className="cursor-pointer">
                    Have you had a serious illness, operation or been hospitalized in the last 5 years?
                  </Label>
                </div>

                {watch('seriousIllnessLast5Years') && (
                  <div>
                    <Label htmlFor="illnessDetails">Please describe</Label>
                    <Textarea
                      id="illnessDetails"
                      {...register('illnessDetails')}
                      placeholder="Describe the illness, operation or hospitalization..."
                    />
                  </div>
                )}
              </div>

              {/* Special Drug Questions */}
              <div className="space-y-4 p-4 bg-yellow-50 rounded-lg">
                <h3 className="text-lg font-semibold">Important Drug Questions</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="takenFenPhen" {...register('takenFenPhen')} />
                    <Label htmlFor="takenFenPhen" className="cursor-pointer text-sm">
                      Have you ever taken "fen-phen" drugs (Lonimin, Adipex, Fastin, Pondimin, Redux)?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="takingFosamaxActonel" {...register('takingFosamaxActonel')} />
                    <Label htmlFor="takingFosamaxActonel" className="cursor-pointer text-sm">
                      Are you taking Alendronate (Fosamax) or Risedronate (Actonel) for Osteoporosis?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="takingBisphosphonates" {...register('takingBisphosphonates')} />
                    <Label htmlFor="takingBisphosphonates" className="cursor-pointer text-sm">
                      Have you been treated with intravenous bisphosphonates (Aredia or Zometa)?
                    </Label>
                  </div>

                  {watch('takingBisphosphonates') && (
                    <div className="ml-8">
                      <Label htmlFor="bisphosphonatesDate">Date treatment began</Label>
                      <Input
                        id="bisphosphonatesDate"
                        type="date"
                        {...register('bisphosphonatesDate')}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="hasJointReplacement" {...register('hasJointReplacement')} />
                    <Label htmlFor="hasJointReplacement" className="cursor-pointer text-sm">
                      Have you ever had an orthopedic total joint replacement?
                    </Label>
                  </div>

                  {watch('hasJointReplacement') && (
                    <div className="ml-8">
                      <Label htmlFor="jointReplacementDate">Date of replacement</Label>
                      <Input
                        id="jointReplacementDate"
                        type="date"
                        {...register('jointReplacementDate')}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="needsPremedication" {...register('needsPremedication')} />
                    <Label htmlFor="needsPremedication" className="cursor-pointer text-sm font-semibold">
                      Have you ever been "premedicated" with antibiotics prior to dental treatment?
                    </Label>
                  </div>
                </div>
              </div>

              {/* Substance Use */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Substance Use</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="usesControlledSubstances" {...register('usesControlledSubstances')} />
                    <Label htmlFor="usesControlledSubstances" className="cursor-pointer">
                      Do you use controlled substances (drugs)?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="usesTobacco" {...register('usesTobacco')} />
                    <Label htmlFor="usesTobacco" className="cursor-pointer">
                      Do you use tobacco (smoking, snuff, chew)?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="drinksAlcohol" {...register('drinksAlcohol')} />
                    <Label htmlFor="drinksAlcohol" className="cursor-pointer">
                      Do you drink alcoholic beverages?
                    </Label>
                  </div>
                </div>

                {watch('drinksAlcohol') && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
                    <div>
                      <Label htmlFor="alcoholLast24Hours">How much in the last 24 hours?</Label>
                      <Input
                        id="alcoholLast24Hours"
                        {...register('alcoholLast24Hours')}
                        placeholder="Number of drinks"
                      />
                    </div>

                    <div>
                      <Label htmlFor="alcoholPerWeek">How much typically per week?</Label>
                      <Input
                        id="alcoholPerWeek"
                        {...register('alcoholPerWeek')}
                        placeholder="Number of drinks"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Conditions */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Medical Conditions</h3>
                <p className="text-sm text-muted-foreground">
                  Please check all conditions that apply to you:
                </p>

                <Controller
                  name="medicalConditions"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-4 border rounded-lg">
                      {medicalConditions.map((condition) => (
                        <div key={condition} className="flex items-center space-x-2">
                          <Checkbox
                            id={`condition-${condition}`}
                            checked={field.value?.includes(condition)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), condition]
                                : field.value?.filter((c) => c !== condition) || []
                              field.onChange(updatedValue)
                            }}
                          />
                          <Label
                            htmlFor={`condition-${condition}`}
                            className="text-sm cursor-pointer"
                          >
                            {condition}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </div>

              {/* Women's Health */}
              <div className="space-y-4 p-4 bg-pink-50 rounded-lg">
                <h3 className="text-lg font-semibold">For Women Only</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="isPregnant" {...register('isPregnant')} />
                    <Label htmlFor="isPregnant" className="cursor-pointer">
                      Are you pregnant?
                    </Label>
                  </div>

                  {watch('isPregnant') && (
                    <div className="ml-8">
                      <Label htmlFor="pregnancyDueDate">Due date</Label>
                      <Input
                        id="pregnancyDueDate"
                        type="date"
                        {...register('pregnancyDueDate')}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox id="isNursing" {...register('isNursing')} />
                    <Label htmlFor="isNursing" className="cursor-pointer">
                      Are you nursing?
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="takesBirthControl" {...register('takesBirthControl')} />
                    <Label htmlFor="takesBirthControl" className="cursor-pointer">
                      Are you taking birth control pills?
                    </Label>
                  </div>
                </div>
              </div>

              {/* Medications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Current Medications</h3>

                <div>
                  <Label htmlFor="currentMedications">
                    List all medications you are currently taking (include dosage if known)
                  </Label>
                  <Textarea
                    id="currentMedications"
                    {...register('currentMedications')}
                    placeholder="Example: Metformin 500mg daily, Lisinopril 10mg daily"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="pharmacyName">Pharmacy Name</Label>
                    <Input
                      id="pharmacyName"
                      {...register('pharmacyName')}
                      placeholder="Pharmacy name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="pharmacyPhone">Pharmacy Phone</Label>
                    <Input
                      id="pharmacyPhone"
                      {...register('pharmacyPhone')}
                      placeholder="(425) 555-0123"
                    />
                  </div>
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Allergies</h3>
                <p className="text-sm text-muted-foreground">
                  Please check all allergies that apply to you:
                </p>

                <Controller
                  name="allergies"
                  control={control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {allergyOptions.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-2">
                          <Checkbox
                            id={`allergy-${allergy}`}
                            checked={field.value?.includes(allergy)}
                            onCheckedChange={(checked) => {
                              const updatedValue = checked
                                ? [...(field.value || []), allergy]
                                : field.value?.filter((a) => a !== allergy) || []
                              field.onChange(updatedValue)
                            }}
                          />
                          <Label
                            htmlFor={`allergy-${allergy}`}
                            className="text-sm cursor-pointer"
                          >
                            {allergy}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}
                />

                {watch('allergies')?.includes('Other') && (
                  <div>
                    <Label htmlFor="otherAllergies">Please specify other allergies</Label>
                    <Input
                      id="otherAllergies"
                      {...register('otherAllergies')}
                      placeholder="List other allergies"
                    />
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/form/step-2-insurance')}
                  className="flex-1"
                >
                  Back to Insurance
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Continue to Consent Forms
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                * Required fields • Your progress is automatically saved
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

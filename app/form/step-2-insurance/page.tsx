'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { insuranceInfoSchema, type InsuranceInfoFormData } from '@/lib/schemas'
import { useFormStorage } from '@/lib/use-form-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/PatientForm/ProgressBar'
import { ImageCapture } from '@/components/PatientForm/ImageCapture'
import { SignaturePad } from '@/components/PatientForm/SignaturePad'
import { INSURANCE_ASSIGNMENT } from '@/data/form-text'

const initialData: InsuranceInfoFormData = {
  hasInsurance: true,
  accountResponsible: '',
  accountRelationship: '',
  insuranceCompany: '',
  insuranceGroup: '',
  insuranceId: '',
  subscriberName: '',
  subscriberBirthdate: '',
  subscriberSsn: '',
  subscriberRelationship: '',
  insuranceCardFront: '',
  insuranceCardBack: '',
  assignmentSignature: '',
  assignmentDate: new Date().toISOString().split('T')[0],
}

export default function Step2InsurancePage() {
  const router = useRouter()
  const { data, setData, isLoaded } = useFormStorage(initialData, 'insuranceInfo')
  const [showInsuranceFields, setShowInsuranceFields] = useState(data.hasInsurance)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<InsuranceInfoFormData>({
    resolver: zodResolver(insuranceInfoSchema),
    defaultValues: data,
  })

  const onSubmit = (formData: InsuranceInfoFormData) => {
    setData(formData)
    router.push('/form/step-3-medical')
  }

  const hasInsurance = watch('hasInsurance')
  if (hasInsurance !== showInsuranceFields) {
    setShowInsuranceFields(hasInsurance)
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProgressBar currentStep={2} totalSteps={4} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Insurance Information</CardTitle>
            <CardDescription>
              Please provide your dental insurance details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Has Insurance Question */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="hasInsurance"
                    {...register('hasInsurance')}
                    className="h-6 w-6 rounded border-input"
                  />
                  <Label htmlFor="hasInsurance" className="text-lg cursor-pointer">
                    I have dental insurance
                  </Label>
                </div>
              </div>

              {showInsuranceFields && (
                <>
                  {/* Account Responsibility */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Account Responsibility</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accountResponsible">Who is responsible for the account?</Label>
                        <Input
                          id="accountResponsible"
                          {...register('accountResponsible')}
                          placeholder="Patient or Guardian Name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="accountRelationship">Relationship to Patient</Label>
                        <select
                          id="accountRelationship"
                          {...register('accountRelationship')}
                          className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
                        >
                          <option value="">Select relationship</option>
                          <option value="self">Self</option>
                          <option value="spouse">Spouse</option>
                          <option value="parent">Parent</option>
                          <option value="guardian">Guardian</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Insurance Details</h3>

                    <div>
                      <Label htmlFor="insuranceCompany">Insurance Company</Label>
                      <Input
                        id="insuranceCompany"
                        {...register('insuranceCompany')}
                        placeholder="Delta Dental, Cigna, etc."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="insuranceGroup">Group Number</Label>
                        <Input
                          id="insuranceGroup"
                          {...register('insuranceGroup')}
                          placeholder="12345"
                        />
                      </div>

                      <div>
                        <Label htmlFor="insuranceId">Member/ID Number</Label>
                        <Input
                          id="insuranceId"
                          {...register('insuranceId')}
                          placeholder="ABC123456789"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subscriber Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Subscriber Information</h3>
                    <p className="text-sm text-muted-foreground">
                      (If different from patient)
                    </p>

                    <div>
                      <Label htmlFor="subscriberName">Subscriber Name</Label>
                      <Input
                        id="subscriberName"
                        {...register('subscriberName')}
                        placeholder="Leave blank if patient is subscriber"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="subscriberBirthdate">Birthdate</Label>
                        <Input
                          id="subscriberBirthdate"
                          type="date"
                          {...register('subscriberBirthdate')}
                        />
                      </div>

                      <div>
                        <Label htmlFor="subscriberSsn">SSN/ID</Label>
                        <Input
                          id="subscriberSsn"
                          {...register('subscriberSsn')}
                          placeholder="XXX-XX-XXXX"
                        />
                      </div>

                      <div>
                        <Label htmlFor="subscriberRelationship">Relationship to Patient</Label>
                        <select
                          id="subscriberRelationship"
                          {...register('subscriberRelationship')}
                          className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
                        >
                          <option value="">Select relationship</option>
                          <option value="self">Self</option>
                          <option value="spouse">Spouse</option>
                          <option value="parent">Parent</option>
                          <option value="child">Child</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Insurance Card Photos */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Insurance Card Photos</h3>
                    <p className="text-sm text-muted-foreground">
                      Please take photos of the front and back of your insurance card
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageCapture
                        label="Front of Insurance Card"
                        value={watch('insuranceCardFront')}
                        onChange={(value) => setValue('insuranceCardFront', value)}
                      />

                      <ImageCapture
                        label="Back of Insurance Card"
                        value={watch('insuranceCardBack')}
                        onChange={(value) => setValue('insuranceCardBack', value)}
                      />
                    </div>
                  </div>

                  {/* Assignment and Release */}
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="text-lg font-semibold">Assignment and Release</h3>

                    <div className="bg-white p-4 rounded border max-h-64 overflow-y-auto text-sm">
                      <pre className="whitespace-pre-wrap font-sans">{INSURANCE_ASSIGNMENT}</pre>
                    </div>

                    <SignaturePad
                      label="Your Signature *"
                      value={watch('assignmentSignature')}
                      onChange={(value) => setValue('assignmentSignature', value)}
                      error={errors.assignmentSignature?.message}
                    />

                    <div>
                      <Label htmlFor="assignmentDate">Date</Label>
                      <Input
                        id="assignmentDate"
                        type="date"
                        {...register('assignmentDate')}
                      />
                    </div>
                  </div>
                </>
              )}

              {!showInsuranceFields && (
                <div className="p-8 text-center bg-blue-50 rounded-lg">
                  <p className="text-muted-foreground">
                    No insurance information will be collected. You can proceed to the next step.
                  </p>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/form/step-1-info')}
                  className="flex-1"
                >
                  Back to Patient Info
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Continue to Medical History
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Your progress is automatically saved
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consentSignaturesSchema, type ConsentSignaturesFormData } from '@/lib/schemas'
import { useFormStorage } from '@/lib/use-form-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/PatientForm/ProgressBar'
import { SignaturePad } from '@/components/PatientForm/SignaturePad'
import { FINANCIAL_POLICY, HIPAA_NOTICE } from '@/data/form-text'

const initialData: ConsentSignaturesFormData = {
  financialPolicySignature: '',
  financialPolicyDate: new Date().toISOString().split('T')[0],
  financialPolicyName: '',
  hipaaSignature: '',
  hipaaDate: new Date().toISOString().split('T')[0],
  hipaaName: '',
  hipaaRelationship: 'self',
  hipaaDisclosureImmediate: false,
  hipaaDisclosureExtended: false,
  hipaaDisclosureOther: '',
}

export default function Step4ConsentPage() {
  const router = useRouter()
  const { data, setData, clearStorage, getAllData, isLoaded } = useFormStorage(initialData, 'consentSignatures')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ConsentSignaturesFormData>({
    resolver: zodResolver(consentSignaturesSchema),
    defaultValues: data,
  })

  const onSubmit = async (formData: ConsentSignaturesFormData) => {
    setIsSubmitting(true)

    try {
      // Get all form data from localStorage
      const allFormData = getAllData()

      // Combine all steps
      const completeFormData = {
        patientInfo: allFormData.patientInfo,
        insuranceInfo: allFormData.insuranceInfo,
        medicalHistory: allFormData.medicalHistory,
        consentSignatures: formData,
      }

      // Submit to API
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(completeFormData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      // Clear localStorage after successful submission
      clearStorage()

      // Navigate to completion page
      router.push('/form/complete')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('There was an error submitting your form. Please try again or ask for assistance.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8 pb-16">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProgressBar currentStep={4} totalSteps={4} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Consent & Signatures</CardTitle>
            <CardDescription>
              Please review and sign the following documents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Financial Policy */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Financial Policy</h3>

                <div className="bg-white p-6 rounded border max-h-96 overflow-y-auto text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{FINANCIAL_POLICY}</pre>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                  <p className="font-medium">
                    I have reviewed the payment/cancellation policy above and agree to the terms.
                  </p>

                  <SignaturePad
                    label="Your Signature *"
                    value={watch('financialPolicySignature')}
                    onChange={(value) => setValue('financialPolicySignature', value)}
                    error={errors.financialPolicySignature?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="financialPolicyName">Printed Name *</Label>
                      <Input
                        id="financialPolicyName"
                        {...register('financialPolicyName')}
                        placeholder="Your full name"
                      />
                      {errors.financialPolicyName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.financialPolicyName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="financialPolicyDate">Date *</Label>
                      <Input
                        id="financialPolicyDate"
                        type="date"
                        {...register('financialPolicyDate')}
                      />
                      {errors.financialPolicyDate && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.financialPolicyDate.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* HIPAA Privacy Practices */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">HIPAA Privacy Practices</h3>

                <div className="bg-white p-6 rounded border max-h-96 overflow-y-auto text-sm">
                  <pre className="whitespace-pre-wrap font-sans">{HIPAA_NOTICE}</pre>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg space-y-4">
                  <SignaturePad
                    label="Your Signature *"
                    value={watch('hipaaSignature')}
                    onChange={(value) => setValue('hipaaSignature', value)}
                    error={errors.hipaaSignature?.message}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hipaaName">Patient Name *</Label>
                      <Input
                        id="hipaaName"
                        {...register('hipaaName')}
                        placeholder="Patient's full name"
                      />
                      {errors.hipaaName && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.hipaaName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="hipaaDate">Date *</Label>
                      <Input
                        id="hipaaDate"
                        type="date"
                        {...register('hipaaDate')}
                      />
                      {errors.hipaaDate && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.hipaaDate.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="hipaaRelationship">Relationship to Patient (if not self)</Label>
                    <select
                      id="hipaaRelationship"
                      {...register('hipaaRelationship')}
                      className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
                    >
                      <option value="self">Self</option>
                      <option value="parent">Parent</option>
                      <option value="guardian">Guardian</option>
                      <option value="spouse">Spouse</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Health Information Disclosure Authorization */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Health Information Disclosure Authorization
                </h3>
                <p className="text-sm text-muted-foreground">
                  I hereby specifically authorize disclosure of my Protected Healthcare Information to:
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hipaaDisclosureImmediate"
                      {...register('hipaaDisclosureImmediate')}
                    />
                    <Label htmlFor="hipaaDisclosureImmediate" className="cursor-pointer">
                      Any Immediate Family
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hipaaDisclosureExtended"
                      {...register('hipaaDisclosureExtended')}
                    />
                    <Label htmlFor="hipaaDisclosureExtended" className="cursor-pointer">
                      Any Extended Family
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="hipaaDisclosureOther">Other (please specify)</Label>
                    <Input
                      id="hipaaDisclosureOther"
                      {...register('hipaaDisclosureOther')}
                      placeholder="Specify other authorized persons"
                    />
                  </div>
                </div>
              </div>

              {/* Important Notice */}
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <h4 className="font-semibold mb-2">Before Submitting:</h4>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Please review all information for accuracy</li>
                  <li>Ensure all required signatures are complete</li>
                  <li>Make sure insurance card photos are clear (if applicable)</li>
                  <li>Click "Submit Registration" to complete the process</li>
                </ul>
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/form/step-3-medical')}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Back to Medical History
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                * Required fields • By submitting, you agree to all policies above
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

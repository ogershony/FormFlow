'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { patientInfoSchema, type PatientInfoFormData } from '@/lib/schemas'
import { useFormStorage } from '@/lib/use-form-storage'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProgressBar } from '@/components/PatientForm/ProgressBar'
import { formatPhoneNumber } from '@/lib/utils'
import { samplePatientInfo } from '@/lib/sample-data'

const initialData: PatientInfoFormData = {
  patientName: '',
  ssn: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  email: '',
  sex: 'male',
  birthdate: '',
  age: '',
  status: 'single',
  employerSchool: '',
  occupationGrade: '',
  workSchoolPhone: '',
  spousePartnerName: '',
  spouseBirthdate: '',
  spouseSsn: '',
  spouseEmployer: '',
  referralSource: '',
  phoneHome: '',
  phoneWork: '',
  phoneCell: '',
  spouseWorkPhone: '',
  emergencyContact: '',
  emergencyRelationship: '',
  emergencyPhone: '',
}

export default function Step1InfoPage() {
  const router = useRouter()
  const { data, setData, isLoaded } = useFormStorage(initialData, 'patientInfo')
  const [showSpouseFields, setShowSpouseFields] = useState(
    data.status === 'married' || data.status === 'partnered'
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<PatientInfoFormData>({
    resolver: zodResolver(patientInfoSchema),
    defaultValues: data,
  })

  const onSubmit = (formData: PatientInfoFormData) => {
    setData(formData)
    router.push('/form/step-2-insurance')
  }

  // Dev-only: Auto-fill with sample data
  const fillSampleData = () => {
    Object.entries(samplePatientInfo).forEach(([key, value]) => {
      setValue(key as keyof PatientInfoFormData, value)
    })
  }

  // Watch status field to show/hide spouse fields
  const statusValue = watch('status')
  if ((statusValue === 'married' || statusValue === 'partnered') && !showSpouseFields) {
    setShowSpouseFields(true)
  } else if (statusValue !== 'married' && statusValue !== 'partnered' && showSpouseFields) {
    setShowSpouseFields(false)
  }

  // Auto-calculate age from birthdate
  const birthdateValue = watch('birthdate')
  if (birthdateValue) {
    const today = new Date()
    const birthDate = new Date(birthdateValue)
    const age = today.getFullYear() - birthDate.getFullYear()
    setValue('age', age.toString())
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ProgressBar currentStep={1} totalSteps={4} />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl">Patient Information</CardTitle>
            <CardDescription>
              Please provide your personal and contact information
            </CardDescription>
            {process.env.NODE_ENV === 'development' && (
              <Button
                type="button"
                variant="outline"
                onClick={fillSampleData}
                className="mt-4"
              >
                🔧 Fill Sample Data (Dev Only)
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div>
                  <Label htmlFor="patientName">Full Legal Name *</Label>
                  <Input
                    id="patientName"
                    {...register('patientName')}
                    placeholder="John Smith"
                  />
                  {errors.patientName && (
                    <p className="text-sm text-destructive mt-1">{errors.patientName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="birthdate">Date of Birth *</Label>
                    <Input
                      id="birthdate"
                      type="date"
                      {...register('birthdate')}
                    />
                    {errors.birthdate && (
                      <p className="text-sm text-destructive mt-1">{errors.birthdate.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      {...register('age')}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sex">Sex *</Label>
                    <select
                      id="sex"
                      {...register('sex')}
                      className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="ssn">Social Security Number (Optional)</Label>
                  <Input
                    id="ssn"
                    {...register('ssn')}
                    placeholder="XXX-XX-XXXX"
                    maxLength={11}
                  />
                </div>

                <div>
                  <Label htmlFor="status">Marital Status *</Label>
                  <select
                    id="status"
                    {...register('status')}
                    className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
                  >
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="partnered">Partnered</option>
                    <option value="divorced">Divorced</option>
                    <option value="separated">Separated</option>
                    <option value="widowed">Widowed</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    {...register('address')}
                    placeholder="123 Main Street"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-1">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" {...register('city')} placeholder="Redmond" />
                    {errors.city && (
                      <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input id="state" {...register('state')} placeholder="WA" maxLength={2} />
                    {errors.state && (
                      <p className="text-sm text-destructive mt-1">{errors.state.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="zip">ZIP Code *</Label>
                    <Input id="zip" {...register('zip')} placeholder="98052" maxLength={10} />
                    {errors.zip && (
                      <p className="text-sm text-destructive mt-1">{errors.zip.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="phoneHome">Home Phone</Label>
                    <Input
                      id="phoneHome"
                      {...register('phoneHome')}
                      placeholder="(425) 555-0123"
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setValue('phoneHome', formatted)
                      }}
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneCell">Cell Phone *</Label>
                    <Input
                      id="phoneCell"
                      {...register('phoneCell')}
                      placeholder="(425) 555-0123"
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setValue('phoneCell', formatted)
                      }}
                    />
                    {errors.phoneCell && (
                      <p className="text-sm text-destructive mt-1">{errors.phoneCell.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phoneWork">Work Phone</Label>
                    <Input
                      id="phoneWork"
                      {...register('phoneWork')}
                      placeholder="(425) 555-0123"
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setValue('phoneWork', formatted)
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Employment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Employment/School Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="employerSchool">Employer/School</Label>
                    <Input
                      id="employerSchool"
                      {...register('employerSchool')}
                      placeholder="Company or School Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="occupationGrade">Occupation/Grade</Label>
                    <Input
                      id="occupationGrade"
                      {...register('occupationGrade')}
                      placeholder="Software Engineer or Grade 10"
                    />
                  </div>
                </div>
              </div>

              {/* Spouse/Partner Information */}
              {showSpouseFields && (
                <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold">Spouse/Partner Information</h3>

                  <div>
                    <Label htmlFor="spousePartnerName">Spouse/Partner Name</Label>
                    <Input
                      id="spousePartnerName"
                      {...register('spousePartnerName')}
                      placeholder="Jane Smith"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="spouseBirthdate">Birthdate</Label>
                      <Input
                        id="spouseBirthdate"
                        type="date"
                        {...register('spouseBirthdate')}
                      />
                    </div>

                    <div>
                      <Label htmlFor="spouseSsn">SSN</Label>
                      <Input
                        id="spouseSsn"
                        {...register('spouseSsn')}
                        placeholder="XXX-XX-XXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="spouseEmployer">Spouse/Partner Employer</Label>
                    <Input
                      id="spouseEmployer"
                      {...register('spouseEmployer')}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
              )}

              {/* Emergency Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Emergency Contact *</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="emergencyContact">Contact Name *</Label>
                    <Input
                      id="emergencyContact"
                      {...register('emergencyContact')}
                      placeholder="Jane Doe"
                    />
                    {errors.emergencyContact && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.emergencyContact.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="emergencyRelationship">Relationship *</Label>
                    <Input
                      id="emergencyRelationship"
                      {...register('emergencyRelationship')}
                      placeholder="Spouse, Parent, Sibling, etc."
                    />
                    {errors.emergencyRelationship && (
                      <p className="text-sm text-destructive mt-1">
                        {errors.emergencyRelationship.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    {...register('emergencyPhone')}
                    placeholder="(425) 555-0123"
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      setValue('emergencyPhone', formatted)
                    }}
                  />
                  {errors.emergencyPhone && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.emergencyPhone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Referral */}
              <div>
                <Label htmlFor="referralSource">How did you hear about us?</Label>
                <Input
                  id="referralSource"
                  {...register('referralSource')}
                  placeholder="Friend, Google, Insurance, etc."
                />
              </div>

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button type="submit" className="flex-1 bg-primary">
                  Continue to Insurance Information
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

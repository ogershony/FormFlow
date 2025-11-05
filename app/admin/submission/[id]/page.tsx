'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Copy, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [submission, setSubmission] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [status, setStatus] = useState('New')

  useEffect(() => {
    fetchSubmission()
  }, [])

  const fetchSubmission = async () => {
    try {
      const response = await fetch(`/api/submission/${params.id}`)
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

  const copyAllData = () => {
    if (!submission) return

    const text = `Patient Registration Data

Name: ${submission[2]}
DOB: ${submission[3]}
Address: ${submission[4]}, ${submission[5]}, ${submission[6]} ${submission[7]}
Email: ${submission[8]}
Home Phone: ${submission[9]}
Cell Phone: ${submission[10]}
Work Phone: ${submission[11]}

Emergency Contact: ${submission[12]}
Emergency Phone: ${submission[13]}

Insurance Company: ${submission[14]}
Group#: ${submission[15]}
ID#: ${submission[16]}
Subscriber Name: ${submission[17]}

Medical Conditions: ${submission[20]}
Current Medications: ${submission[21]}
Allergies: ${submission[22]}`

    copyToClipboard(text, 'all')
  }

  const updateStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/submission/${params.id}`, {
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
    <div className="flex items-start justify-between py-2 border-b">
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base">{value || 'N/A'}</p>
      </div>
      <CopyButton text={value || ''} field={field} />
    </div>
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
            onClick={copyAllData}
            variant="default"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy All Data
          </Button>
        </div>

        {/* Patient Name and Status */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{submission[2]}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Submitted: {new Date(submission[0]).toLocaleString()}
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

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <DataField label="Full Name" value={submission[2]} field="name" />
            <DataField label="Date of Birth" value={submission[3]} field="dob" />
            <DataField label="Address" value={submission[4]} field="address" />
            <DataField label="City" value={submission[5]} field="city" />
            <DataField label="State" value={submission[6]} field="state" />
            <DataField label="ZIP Code" value={submission[7]} field="zip" />
            <DataField label="Email" value={submission[8]} field="email" />
            <DataField label="Home Phone" value={submission[9]} field="phoneHome" />
            <DataField label="Cell Phone" value={submission[10]} field="phoneCell" />
            <DataField label="Work Phone" value={submission[11]} field="phoneWork" />
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <DataField label="Contact Name" value={submission[12]} field="emergencyContact" />
            <DataField label="Contact Phone" value={submission[13]} field="emergencyPhone" />
          </CardContent>
        </Card>

        {/* Insurance Information */}
        <Card>
          <CardHeader>
            <CardTitle>Insurance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <DataField label="Insurance Company" value={submission[14]} field="insuranceCompany" />
              <DataField label="Group Number" value={submission[15]} field="insuranceGroup" />
              <DataField label="Member ID" value={submission[16]} field="insuranceId" />
              <DataField label="Subscriber Name" value={submission[17]} field="subscriberName" />
            </div>

            {/* Insurance Card Images */}
            {(submission[18] || submission[19]) && (
              <div className="space-y-4 pt-4">
                <h4 className="font-semibold">Insurance Card Photos</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {submission[18] && (
                    <div>
                      <p className="text-sm font-medium mb-2">Front</p>
                      <a
                        href={submission[18]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative h-48 border rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={submission[18]}
                          alt="Insurance Card Front"
                          fill
                          className="object-contain bg-gray-100"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </a>
                    </div>
                  )}

                  {submission[19] && (
                    <div>
                      <p className="text-sm font-medium mb-2">Back</p>
                      <a
                        href={submission[19]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative h-48 border rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={submission[19]}
                          alt="Insurance Card Back"
                          fill
                          className="object-contain bg-gray-100"
                          unoptimized
                        />
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Medical History */}
        <Card>
          <CardHeader>
            <CardTitle>Medical History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <DataField label="Medical Conditions" value={submission[20]} field="medicalConditions" />
            <DataField label="Current Medications" value={submission[21]} field="medications" />
            <DataField label="Allergies" value={submission[22]} field="allergies" />
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <DataField label="Notes" value={submission[24] || ''} field="notes" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

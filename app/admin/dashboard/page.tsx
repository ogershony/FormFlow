'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Users, Clock, CheckCircle, FileText, Download } from 'lucide-react'

interface Submission {
  timestamp: string
  status: string
  patientName: string
  dob: string
  email: string
  phone: string
  rowIndex: number
}

export default function AdminDashboardPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  useEffect(() => {
    filterSubmissions()
  }, [searchTerm, statusFilter, submissions])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()

      if (data.success && data.submissions) {
        // Transform the raw data from Google Sheets
        // Skip header row (index 0)
        const transformed = data.submissions.slice(1).map((row: any[], index: number) => ({
          timestamp: row[0] || '',
          status: row[1] || 'New',
          patientName: row[2] || '',
          dob: row[3] || '',
          email: row[8] || '',
          phone: row[10] || row[9] || '', // Cell phone or home phone
          rowIndex: index + 2, // +2 because we skip header and arrays are 0-indexed
        }))

        setSubmissions(transformed.reverse()) // Show newest first
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterSubmissions = () => {
    let filtered = submissions

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((sub) =>
        sub.status.toLowerCase() === statusFilter.toLowerCase()
      )
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((sub) =>
        sub.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.phone.includes(searchTerm)
      )
    }

    setFilteredSubmissions(filtered)
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'complete':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const stats = {
    total: submissions.length,
    new: submissions.filter((s) => s.status.toLowerCase() === 'new').length,
    inProgress: submissions.filter((s) => s.status.toLowerCase() === 'in progress').length,
    complete: submissions.filter((s) => s.status.toLowerCase() === 'complete').length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patient Submissions</h1>
            <p className="text-muted-foreground">Redmond Dental Smiles - Admin Dashboard</p>
          </div>
          <Button onClick={fetchSubmissions} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New</CardTitle>
              <FileText className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.new}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Complete</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.complete}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific patient submissions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex h-14 w-full rounded-md border border-input bg-background px-4 py-2 text-base"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="in progress">In Progress</option>
                <option value="complete">Complete</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>
              Submissions ({filteredSubmissions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSubmissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No submissions found
              </p>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.rowIndex}
                    className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{submission.patientName}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeColor(
                            submission.status
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        DOB: {submission.dob} • {submission.email || submission.phone}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted: {new Date(submission.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-3 md:mt-0 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`/api/submission/${submission.rowIndex}/pdf`, '_blank')}
                        className="flex items-center gap-1"
                      >
                        <Download className="h-3 w-3" />
                        PDF
                      </Button>
                      <Link href={`/admin/submission/${submission.rowIndex}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

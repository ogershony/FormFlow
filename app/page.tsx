import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Clock, Shield } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 pt-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Redmond Dental Smiles
          </h1>
          <p className="text-xl text-muted-foreground">
            Dr. Malinda Lam-Gershony, DDS
          </p>
          <p className="text-muted-foreground">
            16710 NE 79th ST, Suite 100 • Redmond, WA 98052
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Welcome!</CardTitle>
            <CardDescription className="text-base">
              Thank you for choosing Redmond Dental Smiles for your dental care
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-center text-muted-foreground">
              Please complete the new patient registration form on this iPad.
              It should take approximately 5-10 minutes.
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-blue-50">
                <FileText className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Complete Forms</h3>
                <p className="text-sm text-muted-foreground">
                  Fill out all required information
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-blue-50">
                <Clock className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">5-10 Minutes</h3>
                <p className="text-sm text-muted-foreground">
                  Quick and easy process
                </p>
              </div>

              <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg bg-blue-50">
                <Shield className="h-10 w-10 text-primary" />
                <h3 className="font-semibold">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Your information is protected
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                The form includes:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
                <li>Personal and contact information</li>
                <li>Dental insurance details and card photos</li>
                <li>Medical history and current medications</li>
                <li>Consent forms and signatures</li>
              </ul>
            </div>

            <Link href="/form/step-1-info" className="block">
              <Button size="lg" className="w-full text-lg h-16">
                Start Registration
              </Button>
            </Link>

            <p className="text-xs text-center text-muted-foreground">
              Your progress will be automatically saved. You can take breaks if needed.
            </p>
          </CardContent>
        </Card>

        {/* Help Text */}
        <p className="text-center text-sm text-muted-foreground pb-8">
          If you need assistance, please ask our front desk staff.
        </p>
      </div>
    </div>
  )
}

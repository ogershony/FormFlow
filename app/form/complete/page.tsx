import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2 } from 'lucide-react'

export default function CompletePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8 pt-12">
        <Card className="border-2 border-green-200">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-20 w-20 text-green-600" />
            </div>
            <CardTitle className="text-3xl md:text-4xl text-green-700">
              Registration Complete!
            </CardTitle>
            <CardDescription className="text-lg">
              Thank you for completing your patient registration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4 p-6 bg-green-50 rounded-lg">
              <h3 className="text-lg font-semibold">What happens next?</h3>
              <ul className="text-left space-y-3 max-w-md mx-auto">
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">1.</span>
                  <span>Please return the iPad to our front desk staff</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">2.</span>
                  <span>Our team will review your information</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-600 font-bold">3.</span>
                  <span>We'll call you when we're ready for your appointment</span>
                </li>
              </ul>
            </div>

            <div className="pt-4">
              <p className="text-muted-foreground mb-4">
                Your information has been securely saved.
              </p>
              <p className="text-sm text-muted-foreground">
                If you have any questions, please don't hesitate to ask our staff.
              </p>
            </div>

            <div className="pt-6">
              <Link href="/">
                <Button variant="outline" size="lg">
                  Return to Home
                </Button>
              </Link>
            </div>

            <div className="pt-8 border-t">
              <p className="text-xl font-semibold text-primary mb-2">
                Redmond Dental Smiles
              </p>
              <p className="text-sm text-muted-foreground">
                Dr. Malinda Lam-Gershony, DDS
              </p>
              <p className="text-sm text-muted-foreground">
                16710 NE 79th ST, Suite 100 • Redmond, WA 98052
              </p>
              <p className="text-sm text-muted-foreground">
                425.867.1484
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

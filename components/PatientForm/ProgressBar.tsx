'use client'

import { Progress } from "@/components/ui/progress"

interface ProgressBarProps {
  currentStep: number
  totalSteps: number
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100
  const steps = ["Patient Info", "Insurance", "Medical History", "Consent"]

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm font-medium">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}% Complete</span>
      </div>

      <Progress value={percentage} max={100} className="h-3" />

      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div
            key={index}
            className={`text-xs md:text-sm ${
              index + 1 <= currentStep
                ? "text-primary font-semibold"
                : "text-muted-foreground"
            }`}
          >
            {step}
          </div>
        ))}
      </div>
    </div>
  )
}

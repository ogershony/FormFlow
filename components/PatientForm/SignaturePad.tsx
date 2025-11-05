'use client'

import { useRef, useEffect } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

interface SignaturePadProps {
  label: string
  value?: string
  onChange: (signature: string) => void
  error?: string
}

export function SignaturePad({ label, value, onChange, error }: SignaturePadProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)

  useEffect(() => {
    if (value && sigCanvas.current) {
      sigCanvas.current.fromDataURL(value)
    }
  }, [value])

  const clear = () => {
    sigCanvas.current?.clear()
    onChange('')
  }

  const save = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL()
      onChange(dataURL)
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-input rounded-lg overflow-hidden">
        <SignatureCanvas
          ref={sigCanvas}
          canvasProps={{
            className: 'w-full h-40 md:h-48 bg-white touch-action-none',
          }}
          onEnd={save}
        />
      </div>
      <div className="flex gap-2">
        <Button type="button" variant="outline" onClick={clear} size="sm">
          Clear Signature
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

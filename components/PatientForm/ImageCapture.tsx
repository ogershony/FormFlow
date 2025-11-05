'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Camera, Upload, X } from 'lucide-react'
import Image from 'next/image'

interface ImageCaptureProps {
  label: string
  value?: string
  onChange: (image: string) => void
  error?: string
}

export function ImageCapture({ label, value, onChange, error }: ImageCaptureProps) {
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }

          // Calculate new dimensions (max 1200px width, maintain aspect ratio)
          let width = img.width
          let height = img.height
          const maxWidth = 1200
          const maxHeight = 1200

          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height
              height = maxHeight
            }
          }

          canvas.width = width
          canvas.height = height

          // Draw and compress image
          ctx.drawImage(img, 0, 0, width, height)

          // Convert to JPEG with 80% quality to reduce size
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8)

          // Check if compressed size is still too large (Google Sheets has 50k char limit)
          if (compressedBase64.length > 45000) {
            // Try again with lower quality
            const veryCompressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
            resolve(veryCompressedBase64)
          } else {
            resolve(compressedBase64)
          }
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
      // Compress and convert to base64
      const base64String = await compressImage(file)
      setPreview(base64String)
      onChange(base64String)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try another file.')
    }
  }

  const handleCameraCapture = () => {
    cameraInputRef.current?.click()
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = () => {
    setPreview(null)
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {preview ? (
        <div className="relative w-full h-48 border-2 border-input rounded-lg overflow-hidden bg-muted">
          <Image
            src={preview}
            alt={label}
            fill
            className="object-contain"
            unoptimized
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-input rounded-lg p-8 text-center space-y-4">
          <div className="flex flex-col items-center gap-2">
            <Camera className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Take a photo or upload an image
            </p>
          </div>

          {/* Hidden input for camera */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Hidden input for file upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleCameraCapture}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Take Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleFileUpload}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Image
            </Button>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'dental-patient-registration-form'

export function useFormStorage<T extends object>(initialData: T, step: string) {
  const [data, setData] = useState<T>(initialData)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed[step]) {
          setData({ ...initialData, ...parsed[step] })
        }
      }
    } catch (error) {
      console.error('Error loading form data from localStorage:', error)
    } finally {
      setIsLoaded(true)
    }
  }, []) // Only run once on mount

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoaded) return // Don't save until we've loaded

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const existingData = stored ? JSON.parse(stored) : {}

      const updatedData = {
        ...existingData,
        [step]: data,
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData))
    } catch (error) {
      console.error('Error saving form data to localStorage:', error)
    }
  }, [data, step, isLoaded])

  const clearStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Error clearing form data from localStorage:', error)
    }
  }

  const getAllData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : {}
    } catch (error) {
      console.error('Error getting all form data:', error)
      return {}
    }
  }

  return { data, setData, clearStorage, getAllData, isLoaded }
}

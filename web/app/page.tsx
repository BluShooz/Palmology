'use client'

import { useState, useRef, useCallback } from 'react'
import CameraCapture from '@/components/CameraCapture'
import ScanningOverlay from '@/components/ScanningOverlay'
import ResultCard from '@/components/ResultCard'

export default function Home() {
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string>('')
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleCapture = useCallback(async (imageBlob: Blob) => {
    setIsScanning(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', imageBlob, 'palm.jpg')

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.message || 'Analysis failed')
      }
    } catch (err) {
      setError('Failed to connect to analysis server')
      console.error(err)
    } finally {
      setIsScanning(false)
    }
  }, [])

  const handleReset = () => {
    setResult(null)
    setError('')
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-dark-bg to-dark-card">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 neon-text text-neon-cyan">
            Palm Insight AI
          </h1>
          <p className="text-gray-400 text-lg">
            Biometric Personality Analysis
          </p>
        </div>

        {/* Main Content */}
        {!result ? (
          <div className="relative">
            <CameraCapture
              videoRef={videoRef}
              onCapture={handleCapture}
              isScanning={isScanning}
            />
            {isScanning && <ScanningOverlay />}
          </div>
        ) : (
          <ResultCard data={result} onReset={handleReset} />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-center">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Instructions */}
        {!result && !isScanning && (
          <div className="mt-6 text-center text-gray-400">
            <p className="mb-2">
              Position your palm clearly in the frame with good lighting
            </p>
            <p className="text-sm">
              Keep your hand steady and ensure all fingers are visible
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

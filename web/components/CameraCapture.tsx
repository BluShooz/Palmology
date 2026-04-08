'use client'

import { useState, useEffect, useRef } from 'react'

interface CameraCaptureProps {
  videoRef: React.RefObject<HTMLVideoElement>
  onCapture: (blob: Blob) => void
  isScanning: boolean
}

export default function CameraCapture({
  videoRef,
  onCapture,
  isScanning,
}: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string>('')
  const [isReady, setIsReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let mounted = true
    let mediaStream: MediaStream | null = null

    async function initCamera() {
      try {
        console.log('🎥 Initializing camera...')

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser')
        }

        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 1280, height: 720 },
          audio: false,
        })

        if (!mounted) {
          mediaStream.getTracks().forEach(t => t.stop())
          return
        }

        console.log('✅ Camera stream obtained')
        setStream(mediaStream)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream

          videoRef.current.onloadedmetadata = () => {
            if (!mounted || !videoRef.current) return

            console.log('📹 Video metadata loaded')

            videoRef.current.play()
              .then(() => {
                console.log('▶️ Video playing')
                if (mounted) {
                  setIsReady(true)
                  setError('')
                }
              })
              .catch((err) => {
                console.error('❌ Play failed:', err)
                if (mounted) {
                  setError('Could not start video: ' + err.message)
                }
              })
          }
        }

      } catch (err: any) {
        console.error('❌ Camera error:', err)

        if (!mounted) return

        let errorMsg = 'Camera error'
        if (err.name === 'NotAllowedError') {
          errorMsg = 'Camera access denied. Please allow camera permissions.'
        } else if (err.name === 'NotFoundError') {
          errorMsg = 'No camera found on this device.'
        } else if (err.name === 'NotReadableError') {
          errorMsg = 'Camera is already in use by another app.'
        } else {
          errorMsg = err.message || 'Unknown camera error'
        }

        setError(errorMsg)
        setIsReady(false)
      }
    }

    initCamera()

    return () => {
      mounted = false
      if (mediaStream) {
        mediaStream.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isReady) {
      console.error('Camera not ready')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        console.log('📸 Image captured')
        onCapture(blob)
      }
    }, 'image/jpeg', 0.95)
  }

  // Debug logging
  useEffect(() => {
    console.log('🔍 isScanning state:', isScanning)
  }, [isScanning])

  // Error state
  if (error) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-red-500 p-8">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-red-400 font-semibold mb-2">Camera Error</p>
        <p className="text-gray-400 text-sm text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-neon-cyan text-dark-bg rounded-lg hover:bg-neon-blue font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden neon-border" style={{ minHeight: '400px' }}>
        {!isReady && !isScanning && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-card z-10">
            <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            <p className="absolute mt-24 text-gray-400">Starting camera...</p>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Corner Guides */}
        {isReady && !isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-neon-cyan rounded-tl-lg" />
            <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-neon-cyan rounded-tr-lg" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-neon-cyan rounded-bl-lg" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-neon-cyan rounded-br-lg" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 border-2 border-neon-cyan/50 rounded-lg" />
            </div>
          </div>
        )}

        {/* Ready indicator */}
        {isReady && !isScanning && (
          <div className="absolute top-4 left-4 right-4 bg-green-900/90 text-green-200 px-4 py-2 rounded-lg text-sm border border-green-500 text-center">
            ✅ Camera ready! Position your palm and tap to capture
          </div>
        )}

        {/* SCANNING OVERLAY - EXTREMELY VISIBLE */}
        {isScanning && (
          <div
            className="absolute inset-0 z-50"
            style={{
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              border: '4px solid #00ffff',
            }}
          >
            {/* DEBUG: Add text to show it's scanning */}
            <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded font-bold text-xl z-50">
              🔴 SCANNING MODE ACTIVE
            </div>

            {/* Bright Scan Line - Very Visible */}
            <div
              className="absolute left-0 right-0 z-50"
              style={{
                height: '8px',
                background: 'linear-gradient(to right, transparent, #00ffff, #00ffff, transparent)',
                boxShadow: '0 0 30px #00ffff, 0 0 60px #00ffff, 0 0 90px rgba(0, 255, 255, 0.8)',
                animation: 'scanLine 1.5s linear infinite',
                position: 'absolute',
              }}
            />

            {/* Horizontal sweep beam */}
            <div
              className="absolute inset-0 z-40"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(0, 255, 255, 0.3), transparent)',
                animation: 'pulse 1s ease-in-out infinite',
              }}
            />

            {/* Massive corner brackets */}
            <div className="absolute top-8 left-8 w-32 h-32 border-t-8 border-l-8 border-yellow-400 rounded-tl-3xl z-40 animate-bounce" />
            <div className="absolute top-8 right-8 w-32 h-32 border-t-8 border-r-8 border-yellow-400 rounded-tr-3xl z-40 animate-bounce" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-8 left-8 w-32 h-32 border-b-8 border-l-8 border-yellow-400 rounded-bl-3xl z-40 animate-bounce" style={{ animationDelay: '0.6s' }} />
            <div className="absolute bottom-8 right-8 w-32 h-32 border-b-8 border-r-8 border-yellow-400 rounded-br-3xl z-40 animate-bounce" style={{ animationDelay: '0.9s' }} />

            {/* Giant center circle */}
            <div className="absolute inset-0 flex items-center justify-center z-40">
              <div
                className="w-64 h-64 border-8 border-green-400 rounded-full animate-ping z-40"
                style={{ boxShadow: '0 0 50px #00ff00' }}
              />
              <div
                className="absolute w-48 h-48 border-4 border-cyan-400 rounded-full animate-pulse z-40"
                style={{ boxShadow: '0 0 40px #00ffff' }}
              />
            </div>

            {/* Giant bouncing particles */}
            <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-red-500 rounded-full animate-ping z-40" />
            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-yellow-500 rounded-full animate-ping z-40" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-8 h-8 bg-green-500 rounded-full animate-ping z-40" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 right-1/3 w-8 h-8 bg-purple-500 rounded-full animate-bounce z-40" />
            <div className="absolute bottom-1/3 left-1/2 w-8 h-8 bg-pink-500 rounded-full animate-bounce z-40" style={{ animationDelay: '0.7s' }} />

            {/* Status box - Cannot miss this */}
            <div
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50"
              style={{
                backgroundColor: '#000000',
                border: '4px solid #00ffff',
                borderRadius: '16px',
                padding: '24px 32px',
                boxShadow: '0 0 40px #00ffff, 0 0 80px rgba(0, 255, 255, 0.5)',
              }}
            >
              <p className="text-cyan-400 text-3xl font-bold mb-4 text-center" style={{ textShadow: '0 0 20px #00ffff' }}>
                🔍 SCANNING...
              </p>
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" />
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-4 h-4 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <p className="text-white text-lg text-center">
                Extracting biometric features...
              </p>
              <p className="text-gray-400 text-base text-center mt-2">
                Generating AI insights
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCapture}
          disabled={isScanning || !isReady}
          className={`relative w-20 h-20 bg-neon-cyan rounded-full hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
            isReady && !isScanning ? 'glow-effect' : ''
          }`}
        >
          <div className="absolute inset-2 bg-dark-bg rounded-full" />
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Debug info */}
      {isScanning && (
        <div className="mt-4 p-4 bg-yellow-900/50 border-2 border-yellow-400 rounded-lg">
          <p className="text-yellow-300 font-bold">⚠️ SCANNING STATE IS ACTIVE</p>
          <p className="text-white text-sm mt-2">The scan overlay should be visible now</p>
        </div>
      )}
    </div>
  )
}

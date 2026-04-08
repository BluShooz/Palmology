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

        // Check browser support
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser')
        }

        // Get camera stream
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

        // Attach to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream

          // Wait for video to be ready
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
  }, []) // Run once on mount

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
      <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden neon-border">
        {!isReady && (
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

        {/* Corner Guides - only show when ready */}
        {isReady && (
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
        {isReady && (
          <div className="absolute top-4 left-4 right-4 bg-green-900/90 text-green-200 px-4 py-2 rounded-lg text-sm border border-green-500 text-center">
            ✅ Camera ready! Position your palm and tap to capture
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCapture}
          disabled={isScanning || !isReady}
          className={`relative w-20 h-20 bg-neon-cyan rounded-full hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ${
            isReady ? 'glow-effect' : ''
          }`}
        >
          <div className="absolute inset-2 bg-dark-bg rounded-full" />
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

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

        {/* Corner Guides - only show when ready */}
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

        {/* SCANNING OVERLAY - Now inside CameraCapture */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none z-30 bg-neon-cyan/5">
            {/* Bright Scan Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"
                 style={{
                   boxShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px rgba(0, 255, 255, 0.5)',
                   animation: 'scanLine 2s linear infinite'
                 }}
            />

            {/* Horizontal scan beam */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-pulse" />

            {/* Corner brackets */}
            <div className="absolute top-4 left-4 w-24 h-24 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl animate-pulse" />
            <div className="absolute top-4 right-4 w-24 h-24 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="absolute bottom-4 left-4 w-24 h-24 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl animate-pulse" style={{ animationDelay: '0.4s' }} />
            <div className="absolute bottom-4 right-4 w-24 h-24 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl animate-pulse" style={{ animationDelay: '0.6s' }} />

            {/* Center reticle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 border-2 border-cyan-400/40 rounded-lg animate-pulse" />
              <div className="absolute w-36 h-36 border border-cyan-400/30 rounded-lg animate-ping" />
            </div>

            {/* Scanning particles */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
            <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '0.7s' }} />
            <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
            <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
              }} />
            </div>

            {/* Status text */}
            <div className="absolute bottom-6 left-0 right-0 text-center z-40">
              <div className="inline-block bg-black/80 backdrop-blur-sm px-8 py-4 rounded-xl border-2 border-cyan-400">
                <p className="text-cyan-400 text-xl font-bold mb-2 animate-pulse">
                  🔍 SCANNING PALM...
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <p className="text-cyan-300 text-sm">
                  Extracting biometric features...
                </p>
                <p className="text-cyan-400/80 text-xs mt-1">
                  Generating AI personality insights
                </p>
              </div>
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
    </div>
  )
}

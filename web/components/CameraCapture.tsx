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
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string>('')
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const initializationTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    let mounted = true
    let mediaStream: MediaStream | null = null

    async function setupCamera() {
      setIsInitializing(true)
      setError('')

      // Check if browser supports mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Your browser does not support camera access')
        setHasPermission(false)
        setIsInitializing(false)
        return
      }

      try {
        console.log('Requesting camera access...')

        // Request camera access with fallback options
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        })

        if (!mounted) {
          mediaStream.getTracks().forEach(track => track.stop())
          return
        }

        console.log('Camera access granted, setting up stream...')

        setStream(mediaStream)
        setHasPermission(true)

        // Set video source and wait for it to be ready
        if (videoRef.current) {
          const video = videoRef.current
          video.srcObject = mediaStream

          // Set up timeout for initialization
          initializationTimeoutRef.current = setTimeout(() => {
            if (mounted && !isVideoReady) {
              console.error('Camera initialization timeout')
              setError('Camera initialization timeout. Please refresh or try a different browser.')
              setIsInitializing(false)
            }
          }, 10000) // 10 second timeout

          video.onloadedmetadata = () => {
            console.log('Video metadata loaded, playing video...')

            if (!mounted) return

            video.play()
              .then(() => {
                console.log('Video playing successfully')
                if (mounted) {
                  setIsVideoReady(true)
                  setIsInitializing(false)
                  setError('')
                  if (initializationTimeoutRef.current) {
                    clearTimeout(initializationTimeoutRef.current)
                  }
                }
              })
              .catch((err) => {
                console.error('Error playing video:', err)
                if (mounted) {
                  setError('Failed to start camera: ' + err.message)
                  setIsInitializing(false)
                }
              })
          }

          video.onerror = (e) => {
            console.error('Video error:', e)
            if (mounted) {
              setError('Video element error. Please try a different browser.')
              setIsInitializing(false)
            }
          }
        }
      } catch (err: any) {
        console.error('Camera access error:', err)

        if (!mounted) return

        // Provide more specific error messages
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera access denied. Please allow camera permissions in your browser settings and refresh the page.')
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera found on this device. Please connect a camera and try again.')
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is already in use by another application. Please close other apps using the camera.')
        } else {
          setError(`Camera error: ${err.message || 'Unknown error'}`)
        }

        setHasPermission(false)
        setIsInitializing(false)
      }
    }

    setupCamera()

    return () => {
      mounted = false
      if (initializationTimeoutRef.current) {
        clearTimeout(initializationTimeoutRef.current)
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop())
      }
    }
  }, []) // Empty dependency array - run once on mount

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current || !isVideoReady) {
      setError('Camera not ready. Please wait for video to load.')
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      setError('Failed to capture image')
      return
    }

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          console.log('Image captured successfully')
          onCapture(blob)
        } else {
          setError('Failed to capture image')
        }
      },
      'image/jpeg',
      0.95
    )
  }

  const handleRetry = () => {
    // Reset state
    setIsVideoReady(false)
    setIsInitializing(true)
    setError('')
    setHasPermission(null)

    // Stop current stream
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }

    // Reload page
    window.location.reload()
  }

  // Loading/Initializing state
  if (isInitializing || hasPermission === null) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-dark-border p-8">
        <div className="animate-pulse mb-4">
          <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="text-gray-400 font-semibold">Initializing camera...</p>
        <p className="text-gray-500 text-sm mt-2 text-center">
          Please allow camera permissions when prompted
        </p>
        <div className="mt-4 text-gray-600 text-xs text-center">
          <p>If this takes more than 10 seconds, try:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Refreshing the page</li>
            <li>Checking browser permissions</li>
            <li>Trying a different browser</li>
            <li>Ensuring no other app is using the camera</li>
          </ul>
        </div>
        <button
          onClick={handleRetry}
          className="mt-6 px-6 py-2 bg-neon-cyan text-dark-bg rounded-lg hover:bg-neon-blue transition-colors font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  // Error state
  if (hasPermission === false) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-red-500 p-8">
        <div className="text-6xl mb-4">📷</div>
        <p className="text-red-400 font-semibold mb-2">Camera Not Available</p>
        <p className="text-gray-400 text-sm text-center mb-4 max-w-md">{error}</p>
        <div className="text-gray-500 text-xs space-y-1 mb-6">
          <p className="font-semibold">Quick fixes:</p>
          <ul className="list-disc list-inside space-y-1 mt-2">
            <li>Allow camera permissions in browser (click lock icon 🔒)</li>
            <li>Close Zoom, Teams, or other apps using camera</li>
            <li>Try Chrome, Firefox, or Safari browsers</li>
            <li>Use localhost:3000 (not 127.0.0.1:3000)</li>
            <li>Check if camera is connected and working</li>
          </ul>
        </div>
        <button
          onClick={handleRetry}
          className="px-6 py-2 bg-neon-cyan text-dark-bg rounded-lg hover:bg-neon-blue transition-colors font-semibold"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden neon-border camera-overlay">
        {!isVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-card z-10">
            <div className="animate-pulse">
              <div className="w-16 h-16 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            !isVideoReady ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Corner Guides */}
        {isVideoReady && (
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

        {/* Error Message Overlay */}
        {error && (
          <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-red-200 px-4 py-3 rounded-lg text-sm border border-red-500">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Success Message */}
        {isVideoReady && !error && (
          <div className="absolute top-4 left-4 right-4 bg-green-900/90 text-green-200 px-4 py-2 rounded-lg text-sm border border-green-500">
            ✅ Camera ready! Position your palm and tap to capture
          </div>
        )}
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCapture}
          disabled={isScanning || !isVideoReady}
          className={`relative w-20 h-20 bg-neon-cyan rounded-full hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-effect ${
            !isVideoReady ? 'animate-pulse' : ''
          }`}
        >
          <div className="absolute inset-2 bg-dark-bg rounded-full" />
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-center text-gray-400 text-sm">
        {!isVideoReady ? (
          <p className="animate-pulse">Initializing camera...</p>
        ) : (
          <p>Position your palm in the frame and tap to capture</p>
        )}
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

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
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        setStream(mediaStream)
        setHasPermission(true)

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error('Camera access denied:', err)
        setHasPermission(false)
      }
    }

    setupCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [videoRef])

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    if (!ctx) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    ctx.drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
      if (blob) {
        onCapture(blob)
      }
    }, 'image/jpeg', 0.95)
  }

  if (hasPermission === null) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex items-center justify-center border-2 border-dark-border">
        <p className="text-gray-400">Requesting camera access...</p>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div className="w-full aspect-video bg-dark-card rounded-lg flex flex-col items-center justify-center border-2 border-red-500">
        <p className="text-red-400 mb-2">Camera access denied</p>
        <p className="text-gray-400 text-sm">
          Please enable camera access in your browser settings
        </p>
      </div>
    )
  }

  return (
    <div className="relative w-full">
      {/* Video Container */}
      <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden neon-border camera-overlay">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {/* Corner Guides */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-8 w-16 h-16 border-t-4 border-l-4 border-neon-cyan rounded-tl-lg" />
          <div className="absolute top-8 right-8 w-16 h-16 border-t-4 border-r-4 border-neon-cyan rounded-tr-lg" />
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-4 border-l-4 border-neon-cyan rounded-bl-lg" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-4 border-r-4 border-neon-cyan rounded-br-lg" />
        </div>

        {/* Center Focus Area */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-64 h-64 border-2 border-neon-cyan/50 rounded-lg" />
        </div>
      </div>

      {/* Capture Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleCapture}
          disabled={isScanning}
          className="relative w-20 h-20 bg-neon-cyan rounded-full hover:bg-neon-blue disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 glow-effect"
        >
          <div className="absolute inset-2 bg-dark-bg rounded-full" />
        </button>
      </div>

      {/* Hidden Canvas */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}

'use client'

export default function ScanningOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Scanning Line */}
      <div className="scan-line" />

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-neon-cyan/5" />

      {/* Scanning Text */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-neon-cyan text-lg font-semibold animate-pulse">
          Analyzing...
        </p>
        <p className="text-gray-400 text-sm mt-1">
          Extracting biometric features
        </p>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>
    </div>
  )
}

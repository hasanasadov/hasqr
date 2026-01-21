"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { type QRStyle } from "./qr-customizer"
import { cn } from "@/lib/utils"
import { Loader2, AlertCircle } from "lucide-react"

interface QRDisplayProps {
  data: string
  style: QRStyle
  className?: string
}

export function QRDisplay({ data, style, className }: QRDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !data) return
      
      setIsLoading(true)
      setError(null)

      try {
        await QRCode.toCanvas(canvasRef.current, data, {
          width: style.size,
          margin: style.margin,
          color: {
            dark: style.fgColor,
            light: style.bgColor,
          },
          errorCorrectionLevel: style.errorCorrection,
        })
      } catch (err) {
        console.error("[v0] QR generation error:", err)
        setError("Failed to generate QR code")
      } finally {
        setIsLoading(false)
      }
    }

    generateQR()
  }, [data, style])

  if (!data) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50",
          className
        )}
        style={{ width: style.size, height: style.size }}
      >
        <div className="w-16 h-16 rounded-xl bg-secondary/50 flex items-center justify-center mb-3">
          <svg
            className="w-8 h-8 text-muted-foreground/50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
            />
          </svg>
        </div>
        <p className="text-sm text-muted-foreground text-center px-4">
          Fill in the form to generate your QR code
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-destructive/50 bg-destructive/10",
          className
        )}
        style={{ width: style.size, height: style.size }}
      >
        <AlertCircle className="w-8 h-8 text-destructive mb-2" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-card/80 rounded-2xl"
          style={{ width: style.size, height: style.size }}
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="rounded-2xl shadow-2xl shadow-black/20"
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  )
}

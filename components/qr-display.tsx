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
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Generate base QR code
        await QRCode.toCanvas(canvas, data, {
          width: style.size,
          margin: style.margin,
          color: {
            dark: style.fgColor,
            light: style.bgColor,
          },
          errorCorrectionLevel: style.errorCorrection,
        })

        // Apply dot style if not square
        if (style.dotStyle && style.dotStyle !== "square") {
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const moduleSize = canvas.width / (Math.sqrt(imageData.data.length / 4))
          
          // Get the QR data to find module positions
          const qrData = await QRCode.create(data, {
            errorCorrectionLevel: style.errorCorrection,
          })
          
          const modules = qrData.modules
          const moduleCount = modules.size
          const cellSize = (canvas.width - style.margin * 2 * (canvas.width / style.size)) / moduleCount
          const offset = style.margin * (canvas.width / style.size)
          
          // Clear and redraw with custom dot style
          ctx.fillStyle = style.bgColor
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          ctx.fillStyle = style.fgColor
          
          for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
              if (modules.get(row, col)) {
                const x = offset + col * cellSize
                const y = offset + row * cellSize
                
                if (style.dotStyle === "dots") {
                  // Draw circles
                  ctx.beginPath()
                  ctx.arc(
                    x + cellSize / 2,
                    y + cellSize / 2,
                    cellSize / 2 * 0.85,
                    0,
                    Math.PI * 2
                  )
                  ctx.fill()
                } else if (style.dotStyle === "rounded") {
                  // Draw rounded rectangles
                  const radius = cellSize * 0.3
                  const size = cellSize * 0.9
                  const offsetAdjust = (cellSize - size) / 2
                  ctx.beginPath()
                  ctx.roundRect(x + offsetAdjust, y + offsetAdjust, size, size, radius)
                  ctx.fill()
                }
              }
            }
          }
        }

        // Add logo if provided
        if (style.logo) {
          const logoSize = (style.logoSize || 20) / 100
          const logoWidth = canvas.width * logoSize
          const logoHeight = canvas.height * logoSize
          const logoX = (canvas.width - logoWidth) / 2
          const logoY = (canvas.height - logoHeight) / 2

          // Create white background for logo
          const padding = logoWidth * 0.15
          ctx.fillStyle = style.bgColor
          ctx.beginPath()
          ctx.roundRect(
            logoX - padding,
            logoY - padding,
            logoWidth + padding * 2,
            logoHeight + padding * 2,
            8
          )
          ctx.fill()

          // Load and draw logo
          const logoImg = new Image()
          logoImg.crossOrigin = "anonymous"
          logoImg.src = style.logo
          
          await new Promise<void>((resolve, reject) => {
            logoImg.onload = () => {
              ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
              resolve()
            }
            logoImg.onerror = () => {
              console.error("[v0] Failed to load logo")
              resolve() // Still resolve to show QR without logo
            }
          })
        }
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

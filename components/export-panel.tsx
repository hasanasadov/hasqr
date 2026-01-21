"use client"

import { useState } from "react"
import QRCode from "qrcode"
import { type QRStyle } from "./qr-customizer"
import { Button } from "@/components/ui/button"
import {
  Download,
  ImageIcon,
  FileCode,
  Copy,
  Check,
  FileImage,
  Printer,
  Link2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ExportPanelProps {
  data: string
  style: QRStyle
}

type ExportFormat = "png" | "svg" | "jpeg" | "webp"

const exportOptions: { format: ExportFormat; label: string; icon: typeof ImageIcon }[] = [
  { format: "png", label: "PNG", icon: ImageIcon },
  { format: "svg", label: "SVG", icon: FileCode },
  { format: "jpeg", label: "JPEG", icon: FileImage },
  { format: "webp", label: "WebP", icon: FileImage },
]

export function ExportPanel({ data, style }: ExportPanelProps) {
  const [copied, setCopied] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [downloading, setDownloading] = useState<ExportFormat | null>(null)

  const downloadQR = async (format: ExportFormat) => {
    if (!data) return
    
    setDownloading(format)

    try {
      let dataUrl: string
      let filename = `qrcode-${Date.now()}`

      if (format === "svg") {
        const svgString = await QRCode.toString(data, {
          type: "svg",
          margin: style.margin,
          color: {
            dark: style.fgColor,
            light: style.bgColor,
          },
          errorCorrectionLevel: style.errorCorrection,
          width: style.size,
        })
        
        const blob = new Blob([svgString], { type: "image/svg+xml" })
        dataUrl = URL.createObjectURL(blob)
        filename += ".svg"
      } else {
        const canvas = document.createElement("canvas")
        await QRCode.toCanvas(canvas, data, {
          width: style.size * 2, // Higher resolution for export
          margin: style.margin,
          color: {
            dark: style.fgColor,
            light: style.bgColor,
          },
          errorCorrectionLevel: style.errorCorrection,
        })

        const mimeType = format === "png" ? "image/png" : format === "jpeg" ? "image/jpeg" : "image/webp"
        dataUrl = canvas.toDataURL(mimeType, 0.95)
        filename += `.${format}`
      }

      const link = document.createElement("a")
      link.download = filename
      link.href = dataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      if (format === "svg") {
        URL.revokeObjectURL(dataUrl)
      }
    } catch (err) {
      console.error("[v0] Export error:", err)
    } finally {
      setDownloading(null)
    }
  }

  const copyToClipboard = async () => {
    if (!data) return

    try {
      const canvas = document.createElement("canvas")
      await QRCode.toCanvas(canvas, data, {
        width: style.size * 2,
        margin: style.margin,
        color: {
          dark: style.fgColor,
          light: style.bgColor,
        },
        errorCorrectionLevel: style.errorCorrection,
      })

      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      })
    } catch (err) {
      console.error("[v0] Copy error:", err)
    }
  }

  const copyLink = async () => {
    if (!data) return

    try {
      await navigator.clipboard.writeText(data)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    } catch (err) {
      console.error("[v0] Copy link error:", err)
    }
  }

  const printQR = async () => {
    if (!data) return

    try {
      const canvas = document.createElement("canvas")
      await QRCode.toCanvas(canvas, data, {
        width: style.size * 3,
        margin: style.margin,
        color: {
          dark: style.fgColor,
          light: style.bgColor,
        },
        errorCorrectionLevel: style.errorCorrection,
      })

      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Print QR Code</title>
              <style>
                body {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  min-height: 100vh;
                  margin: 0;
                  background: white;
                }
                img {
                  max-width: 80vmin;
                  max-height: 80vmin;
                }
              </style>
            </head>
            <body>
              <img src="${canvas.toDataURL("image/png")}" />
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.focus()
        printWindow.print()
      }
    } catch (err) {
      console.error("[v0] Print error:", err)
    }
  }

  const isDisabled = !data

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Download className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Export Options</h3>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {exportOptions.map(({ format, label, icon: Icon }) => (
          <Button
            key={format}
            variant="outline"
            size="sm"
            onClick={() => downloadQR(format)}
            disabled={isDisabled || downloading === format}
            className={cn(
              "h-12 flex flex-col items-center justify-center gap-1",
              "bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
            )}
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs">{label}</span>
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={copyToClipboard}
          disabled={isDisabled}
          className="h-12 flex flex-col items-center justify-center gap-1 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy QR</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={copyLink}
          disabled={isDisabled}
          className="h-12 flex flex-col items-center justify-center gap-1 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span className="text-xs">Copy Link</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={printQR}
          disabled={isDisabled}
          className="h-12 flex flex-col items-center justify-center gap-1 bg-secondary/50 border-border hover:bg-secondary hover:border-primary/50"
        >
          <Printer className="w-4 h-4" />
          <span className="text-xs">Print</span>
        </Button>
      </div>

      <div className="pt-3 border-t border-border">
        <Button
          onClick={() => downloadQR("png")}
          disabled={isDisabled}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          Download High-Res PNG
        </Button>
      </div>
    </div>
  )
}

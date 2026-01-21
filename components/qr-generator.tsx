"use client"

import { useState, useMemo } from "react"
import { QR_TYPES, generateQRData } from "@/lib/qr-types"
import { QRTypeSelector } from "./qr-type-selector"
import { QRForm } from "./qr-form"
import { QRDisplay } from "./qr-display"
import { QRCustomizer, type QRStyle } from "./qr-customizer"
import { ExportPanel } from "./export-panel"
import { cn } from "@/lib/utils"
import { Settings2, Wand2, ChevronDown, ChevronUp } from "lucide-react"

export function QRGenerator() {
  const [selectedType, setSelectedType] = useState(QR_TYPES[0])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showTypeSelector, setShowTypeSelector] = useState(true)
  const [style, setStyle] = useState<QRStyle>({
    fgColor: "#000000",
    bgColor: "#FFFFFF",
    size: 256,
    cornerRadius: 0,
    margin: 2,
    errorCorrection: "M",
  })

  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type)
    setFormData({})
    // Auto-collapse type selector on mobile after selection
    if (window.innerWidth < 1024) {
      setShowTypeSelector(false)
    }
  }

  const qrData = useMemo(() => {
    return generateQRData(selectedType.id, formData)
  }, [selectedType.id, formData])

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground tracking-tight text-balance">
            Generate QR Codes
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty px-2">
            Create professional QR codes for social media, WiFi, contacts, locations, and more.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Panel - Type Selection */}
          <div className="lg:col-span-4">
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl overflow-hidden">
              {/* Collapsible header for mobile */}
              <button
                onClick={() => setShowTypeSelector(!showTypeSelector)}
                className="lg:hidden w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    {(() => {
                      const Icon = selectedType.icon
                      return <Icon className="w-4 h-4 text-primary" />
                    })()}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Selected type</p>
                    <p className="text-sm font-medium text-foreground">{selectedType.name}</p>
                  </div>
                </div>
                {showTypeSelector ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
              
              {/* Desktop header */}
              <div className="hidden lg:block p-5 pb-0">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Select QR Type
                </h2>
              </div>

              {/* Type selector content */}
              <div className={cn(
                "transition-all duration-300 ease-in-out overflow-hidden",
                showTypeSelector ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
              )}>
                <div className="p-4 sm:p-5 pt-0 lg:pt-0">
                  <QRTypeSelector
                    selectedType={selectedType}
                    onSelectType={handleTypeChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Form & Preview */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            {/* Form */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <QRForm
                type={selectedType}
                formData={formData}
                onFormChange={setFormData}
              />
            </div>

            {/* QR Preview (Mobile) */}
            <div className="lg:hidden bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <div className="flex flex-col items-center">
                <QRDisplay
                  data={qrData}
                  style={style}
                  className="mb-4 sm:mb-6"
                />
                <div className="w-full">
                  <ExportPanel data={qrData} style={style} />
                </div>
              </div>
            </div>

            {/* Customizer Toggle (Mobile) */}
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={cn(
                "lg:hidden w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
                showCustomizer
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary border border-border text-foreground hover:bg-secondary/80"
              )}
            >
              <Settings2 className="w-4 h-4" />
              {showCustomizer ? "Hide Customization" : "Customize QR Style"}
            </button>

            {/* Mobile Customizer */}
            <div className={cn(
              "lg:hidden transition-all duration-300 ease-in-out overflow-hidden",
              showCustomizer ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
            )}>
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <QRCustomizer style={style} onStyleChange={setStyle} />
              </div>
            </div>
          </div>

          {/* Right Panel - Preview & Export (Desktop) */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* QR Preview */}
            <div className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center sticky top-24">
              <QRDisplay
                data={qrData}
                style={style}
                className="mb-6"
              />
              
              <div className="w-full mb-6">
                <ExportPanel data={qrData} style={style} />
              </div>

              {/* Desktop Customizer Toggle */}
              <button
                onClick={() => setShowCustomizer(!showCustomizer)}
                className={cn(
                  "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all",
                  showCustomizer
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary border border-border text-foreground hover:bg-secondary/80"
                )}
              >
                <Wand2 className="w-4 h-4" />
                Customize Style
              </button>

              {/* Desktop Customizer */}
              {showCustomizer && (
                <div className="w-full mt-6 pt-6 border-t border-border">
                  <QRCustomizer style={style} onStyleChange={setStyle} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-8 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          {[
            { title: "20+ QR Types", desc: "Social media, WiFi, contacts, and more" },
            { title: "Fully Customizable", desc: "Colors, sizes, and error correction" },
            { title: "Multiple Exports", desc: "PNG, SVG, JPEG, WebP formats" },
            { title: "Free & Unlimited", desc: "No watermarks, no sign-up required" },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-card/50 border border-border rounded-lg sm:rounded-xl p-3 sm:p-4 text-center"
            >
              <h3 className="text-xs sm:text-sm font-semibold text-foreground">{feature.title}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 hidden sm:block">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

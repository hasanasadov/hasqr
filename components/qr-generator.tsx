"use client"

import { useState, useMemo } from "react"
import { QR_TYPES, generateQRData, generateMultiLinkQR, type MultiLinkItem } from "@/lib/qr-types"
import { QRTypeSelector } from "./qr-type-selector"
import { QRForm } from "./qr-form"
import { QRDisplay } from "./qr-display"
import { QRCustomizer, type QRStyle } from "./qr-customizer"
import { ExportPanel } from "./export-panel"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { 
  Settings2, 
  Wand2, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Trash2, 
  LayoutGrid,
  QrCode,
  GripVertical
} from "lucide-react"

type Mode = "single" | "multilink"

export function QRGenerator() {
  const [mode, setMode] = useState<Mode>("single")
  const [selectedType, setSelectedType] = useState(QR_TYPES[0])
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [showCustomizer, setShowCustomizer] = useState(false)
  const [showTypeSelector, setShowTypeSelector] = useState(true)
  
  // Multi-link state
  const [multiLinkTitle, setMultiLinkTitle] = useState("")
  const [multiLinkDescription, setMultiLinkDescription] = useState("")
  const [multiLinks, setMultiLinks] = useState<MultiLinkItem[]>([])
  
  const [style, setStyle] = useState<QRStyle>({
    fgColor: "#000000",
    bgColor: "#FFFFFF",
    size: 256,
    cornerRadius: 0,
    margin: 2,
    errorCorrection: "M",
    dotStyle: "square",
    logoSize: 20,
  })

  const handleTypeChange = (type: typeof selectedType) => {
    setSelectedType(type)
    setFormData({})
    if (window.innerWidth < 1024) {
      setShowTypeSelector(false)
    }
  }

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode)
    setFormData({})
    setMultiLinks([])
    setMultiLinkTitle("")
    setMultiLinkDescription("")
  }

  const addToMultiLink = () => {
    const url = generateQRData(selectedType.id, formData)
    if (!url) return
    
    // Generate a display title based on the form data
    let title = ""
    if (formData.username) title = formData.username
    else if (formData.phone) title = formData.phone
    else if (formData.email) title = formData.email
    else if (formData.url) title = formData.url
    else if (formData.ssid) title = formData.ssid
    else if (formData.firstName) title = `${formData.firstName} ${formData.lastName || ""}`
    else if (formData.title) title = formData.title
    else if (formData.text) title = formData.text.substring(0, 30)
    else title = selectedType.name
    
    const newLink: MultiLinkItem = {
      id: Date.now().toString(),
      typeId: selectedType.id,
      typeName: selectedType.name,
      typeIcon: selectedType.id,
      title: title.trim(),
      url,
    }
    
    setMultiLinks([...multiLinks, newLink])
    setFormData({})
  }

  const removeFromMultiLink = (id: string) => {
    setMultiLinks(multiLinks.filter(l => l.id !== id))
  }

  const qrData = useMemo(() => {
    if (mode === "multilink") {
      return generateMultiLinkQR(multiLinkTitle, multiLinkDescription, multiLinks)
    }
    return generateQRData(selectedType.id, formData)
  }, [mode, selectedType.id, formData, multiLinkTitle, multiLinkDescription, multiLinks])

  const canAddLink = useMemo(() => {
    return generateQRData(selectedType.id, formData) !== ""
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

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="inline-flex bg-secondary/50 border border-border rounded-xl p-1">
            <button
              onClick={() => handleModeChange("single")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                mode === "single" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <QrCode className="w-4 h-4" />
              Single QR
            </button>
            <button
              onClick={() => handleModeChange("multilink")}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                mode === "multilink" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              Multi-Link
            </button>
          </div>
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
                  {mode === "multilink" ? "Add Link Type" : "Select QR Type"}
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
            {/* Multi-Link Info Section */}
            {mode === "multilink" && (
              <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
                <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <LayoutGrid className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Multi-Link Page</h3>
                    <p className="text-sm text-muted-foreground">Create a page with multiple links</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="multilink-title" className="text-sm font-medium text-foreground">
                      Page Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="multilink-title"
                      value={multiLinkTitle}
                      onChange={(e) => setMultiLinkTitle(e.target.value)}
                      placeholder="My Links"
                      className="bg-secondary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="multilink-desc" className="text-sm font-medium text-foreground">
                      Description
                    </Label>
                    <Input
                      id="multilink-desc"
                      value={multiLinkDescription}
                      onChange={(e) => setMultiLinkDescription(e.target.value)}
                      placeholder="All my important links in one place"
                      className="bg-secondary/50"
                    />
                  </div>
                </div>

                {/* Added Links */}
                {multiLinks.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <Label className="text-sm font-medium text-foreground mb-3 block">
                      Added Links ({multiLinks.length})
                    </Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {multiLinks.map((link) => {
                        const typeInfo = QR_TYPES.find(t => t.id === link.typeId)
                        const Icon = typeInfo?.icon || QrCode
                        return (
                          <div
                            key={link.id}
                            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg group"
                          >
                            <GripVertical className="w-4 h-4 text-muted-foreground/50" />
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{link.title}</p>
                              <p className="text-xs text-muted-foreground">{link.typeName}</p>
                            </div>
                            <button
                              onClick={() => removeFromMultiLink(link.id)}
                              className="p-1.5 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Form */}
            <div className="bg-card border border-border rounded-xl sm:rounded-2xl p-4 sm:p-5">
              <QRForm
                type={selectedType}
                formData={formData}
                onFormChange={setFormData}
              />
              
              {/* Add to Multi-Link Button */}
              {mode === "multilink" && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    onClick={addToMultiLink}
                    disabled={!canAddLink}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add {selectedType.name} to Links
                  </Button>
                </div>
              )}
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
              {mode === "multilink" && multiLinks.length === 0 && (
                <div className="text-center text-muted-foreground text-sm mb-4">
                  Add links to generate QR
                </div>
              )}
              
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
            { title: "Multi-Link Pages", desc: "Combine multiple links in one QR" },
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

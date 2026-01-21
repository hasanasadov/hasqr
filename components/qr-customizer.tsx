"use client"

import React from "react"

import { useRef, useState } from "react"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Palette, ImageIcon, X, Upload, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface QRStyle {
  fgColor: string
  bgColor: string
  size: number
  cornerRadius: number
  margin: number
  errorCorrection: "L" | "M" | "Q" | "H"
  logo?: string
  logoSize?: number
  dotStyle?: "square" | "dots" | "rounded"
}

interface QRCustomizerProps {
  style: QRStyle
  onStyleChange: (style: QRStyle) => void
}

const presetColors = [
  { name: "Classic", fg: "#000000", bg: "#FFFFFF" },
  { name: "Inverted", fg: "#FFFFFF", bg: "#000000" },
  { name: "Emerald", fg: "#10b981", bg: "#FFFFFF" },
  { name: "Ocean", fg: "#0ea5e9", bg: "#FFFFFF" },
  { name: "Sunset", fg: "#f97316", bg: "#FFFFFF" },
  { name: "Berry", fg: "#ec4899", bg: "#FFFFFF" },
  { name: "Dark Emerald", fg: "#10b981", bg: "#0a0a0a" },
  { name: "Dark Ocean", fg: "#0ea5e9", bg: "#0a0a0a" },
]

const dotStyles = [
  { id: "square", name: "Square", preview: "rounded-none" },
  { id: "dots", name: "Dots", preview: "rounded-full" },
  { id: "rounded", name: "Rounded", preview: "rounded-sm" },
]

export function QRCustomizer({ style, onStyleChange }: QRCustomizerProps) {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const handleChange = <K extends keyof QRStyle>(key: K, value: QRStyle[K]) => {
    onStyleChange({ ...style, [key]: value })
  }

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      // Convert to data URL for local use
      const reader = new FileReader()
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string
        handleChange("logo", dataUrl)
        // Auto-set error correction to high when adding logo
        if (style.errorCorrection !== "H" && style.errorCorrection !== "Q") {
          handleChange("errorCorrection", "H")
        }
        setUploading(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("[v0] Logo upload error:", error)
      setUploading(false)
    }
  }

  const removeLogo = () => {
    handleChange("logo", undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <Palette className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Customize Style</h3>
      </div>

      {/* Color Presets */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Color Presets</Label>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                handleChange("fgColor", preset.fg)
                handleChange("bgColor", preset.bg)
              }}
              className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-colors"
              title={preset.name}
            >
              <div className="absolute inset-0" style={{ backgroundColor: preset.bg }}>
                <div 
                  className="absolute inset-2 rounded-sm"
                  style={{ backgroundColor: preset.fg }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Foreground</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.fgColor}
              onChange={(e) => handleChange("fgColor", e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.fgColor}
              onChange={(e) => handleChange("fgColor", e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground uppercase"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Background</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={style.bgColor}
              onChange={(e) => handleChange("bgColor", e.target.value)}
              className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={style.bgColor}
              onChange={(e) => handleChange("bgColor", e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-secondary/50 border border-border rounded-lg text-foreground uppercase"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Size</Label>
          <span className="text-xs font-medium text-foreground">{style.size}px</span>
        </div>
        <Slider
          value={[style.size]}
          onValueChange={([value]) => handleChange("size", value)}
          min={128}
          max={512}
          step={32}
          className="w-full"
        />
      </div>

      {/* Margin */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Margin</Label>
          <span className="text-xs font-medium text-foreground">{style.margin}</span>
        </div>
        <Slider
          value={[style.margin]}
          onValueChange={([value]) => handleChange("margin", value)}
          min={0}
          max={6}
          step={1}
          className="w-full"
        />
      </div>

      {/* Error Correction */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Error Correction</Label>
        <Select
          value={style.errorCorrection}
          onValueChange={(value: "L" | "M" | "Q" | "H") => handleChange("errorCorrection", value)}
        >
          <SelectTrigger className="bg-secondary/50 border-border">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="L">Low (~7%)</SelectItem>
            <SelectItem value="M">Medium (~15%)</SelectItem>
            <SelectItem value="Q">Quartile (~25%)</SelectItem>
            <SelectItem value="H">High (~30%)</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Higher correction allows more damage tolerance but increases QR density.
        </p>
      </div>

      {/* Dot Style */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Dot Style</Label>
        <div className="grid grid-cols-3 gap-2">
          {dotStyles.map((dotStyle) => (
            <button
              key={dotStyle.id}
              onClick={() => handleChange("dotStyle", dotStyle.id as "square" | "dots" | "rounded")}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg border transition-all",
                style.dotStyle === dotStyle.id || (!style.dotStyle && dotStyle.id === "square")
                  ? "bg-primary/10 border-primary/50"
                  : "bg-secondary/50 border-border hover:border-primary/30"
              )}
            >
              <div className="flex gap-0.5">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={cn("w-2 h-2 bg-foreground", dotStyle.preview)}
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-foreground">{dotStyle.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-3">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Center Logo</Label>
        
        {!style.logo ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors",
              "hover:border-primary/50 hover:bg-primary/5 border-border"
            )}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Click to add logo</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-card border border-border overflow-hidden flex items-center justify-center">
                <img 
                  src={style.logo || "/placeholder.svg"} 
                  alt="Logo preview" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">Logo added</p>
                <p className="text-xs text-muted-foreground">High error correction enabled</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={removeLogo}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Logo Size */}
        {style.logo && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">Logo Size</Label>
              <span className="text-xs font-medium text-foreground">{style.logoSize || 20}%</span>
            </div>
            <Slider
              value={[style.logoSize || 20]}
              onValueChange={([value]) => handleChange("logoSize", value)}
              min={10}
              max={30}
              step={2}
              className="w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}

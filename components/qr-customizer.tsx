"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Palette, Square, Circle, Hexagon } from "lucide-react"

export interface QRStyle {
  fgColor: string
  bgColor: string
  size: number
  cornerRadius: number
  margin: number
  errorCorrection: "L" | "M" | "Q" | "H"
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

export function QRCustomizer({ style, onStyleChange }: QRCustomizerProps) {
  const handleChange = <K extends keyof QRStyle>(key: K, value: QRStyle[K]) => {
    onStyleChange({ ...style, [key]: value })
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
    </div>
  )
}

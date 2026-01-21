"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { QR_TYPES, type QRType } from "@/lib/qr-types"
import { Search, Layers, Share2, Briefcase, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"

interface QRTypeSelectorProps {
  selectedType: QRType
  onSelectType: (type: QRType) => void
}

const categories = [
  { id: "all", label: "All Types", icon: Layers },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "utility", label: "Utilities", icon: Layers },
  { id: "business", label: "Business", icon: Briefcase },
  { id: "files", label: "Files", icon: FolderOpen },
]

export function QRTypeSelector({ selectedType, onSelectType }: QRTypeSelectorProps) {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTypes = QR_TYPES.filter((type) => {
    const matchesSearch = type.name.toLowerCase().includes(search.toLowerCase()) ||
      type.description.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === "all" || type.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search QR types..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50 border-border"
        />
      </div>

      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === category.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
              )}
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">{category.label}</span>
              <span className="xs:hidden">{category.label.split(' ')[0]}</span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] sm:max-h-[400px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredTypes.map((type) => {
          const Icon = type.icon
          const isSelected = selectedType.id === type.id
          return (
            <button
              key={type.id}
              onClick={() => onSelectType(type)}
              className={cn(
                "flex flex-col items-start gap-1.5 sm:gap-2 p-2.5 sm:p-3 rounded-lg sm:rounded-xl border text-left transition-all",
                isSelected
                  ? "bg-primary/10 border-primary/50 ring-1 ring-primary/30"
                  : "bg-card border-border hover:bg-secondary/50 hover:border-border"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition-colors",
                  isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div>
                <p className={cn("text-xs sm:text-sm font-medium leading-tight", isSelected ? "text-foreground" : "text-foreground/80")}>
                  {type.name}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1 hidden sm:block">{type.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

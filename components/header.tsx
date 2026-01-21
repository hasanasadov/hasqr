"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { QrCode, Sparkles, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    const currentTheme = resolvedTheme || theme
    if (currentTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-semibold text-foreground tracking-tight">HASQR</span>
              <span className="text-[10px] sm:text-xs text-muted-foreground -mt-0.5 hidden sm:block">Professional QR Generator</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">Free & Unlimited</span>
            </div>

            <Button 
              variant="outline" 
              size="icon" 
              onClick={toggleTheme}
              className="h-9 w-9 bg-transparent border-border relative"
            >
              {mounted ? (
                resolvedTheme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

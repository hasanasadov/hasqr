"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ExternalLink, Link2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LinkData {
  title: string
  description?: string
  links: { title: string; url: string; type?: string }[]
}

export default function MultiLinkPage() {
  const params = useParams()
  const [data, setData] = useState<LinkData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const encodedData = params.data as string
      const decoded = decodeURIComponent(atob(encodedData))
      const parsed = JSON.parse(decoded) as LinkData
      setData(parsed)
    } catch (err) {
      console.error("[v0] Failed to decode link data:", err)
      setError("Invalid or expired link")
    } finally {
      setLoading(false)
    }
  }, [params.data])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <Link2 className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-2">Link Not Found</h1>
          <p className="text-muted-foreground">{error || "This link page doesn't exist or has expired."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Link2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{data.title}</h1>
          {data.description && (
            <p className="text-muted-foreground">{data.description}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-3">
          {data.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-between p-4 rounded-xl",
                "bg-card border border-border",
                "hover:bg-secondary/50 hover:border-primary/30",
                "transition-all duration-200 group"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <LinkIcon url={link.url} type={link.type} />
                </div>
                <span className="font-medium text-foreground">{link.title}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground">
            Powered by{" "}
            <a href="/" className="text-primary hover:underline">
              hasQR
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// Helper component to show appropriate icon based on type or URL
function LinkIcon({ url, type }: { url: string; type?: string }) {
  const getIconType = () => {
    // First check if we have a type from the QR generator
    if (type) {
      return type
    }
    
    // Fallback to URL detection
    const domain = url.toLowerCase()
    
    if (domain.includes("instagram")) return "instagram"
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter"
    if (domain.includes("facebook")) return "facebook"
    if (domain.includes("linkedin")) return "linkedin"
    if (domain.includes("youtube")) return "youtube"
    if (domain.includes("tiktok")) return "tiktok"
    if (domain.includes("github")) return "github"
    if (domain.includes("discord")) return "discord"
    if (domain.includes("spotify")) return "spotify"
    if (domain.includes("whatsapp") || domain.includes("wa.me")) return "whatsapp"
    if (domain.includes("telegram") || domain.includes("t.me")) return "telegram"
    if (domain.includes("snapchat")) return "snapchat"
    if (domain.includes("paypal")) return "paypal"
    if (domain.startsWith("tel:")) return "phone"
    if (domain.startsWith("mailto:")) return "email"
    if (domain.startsWith("sms:")) return "sms"
    if (domain.startsWith("geo:")) return "location"
    if (domain.startsWith("wifi:")) return "wifi"
    
    return "url"
  }

  const iconType = getIconType()

  // Colors for different link types
  const iconColors: Record<string, string> = {
    instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
    twitter: "bg-foreground",
    facebook: "bg-blue-600",
    linkedin: "bg-blue-700",
    youtube: "bg-red-600",
    tiktok: "bg-foreground",
    github: "bg-foreground",
    discord: "bg-indigo-500",
    spotify: "bg-green-500",
    whatsapp: "bg-green-600",
    telegram: "bg-blue-500",
    snapchat: "bg-yellow-400",
    paypal: "bg-blue-800",
    phone: "bg-green-500",
    email: "bg-red-500",
    sms: "bg-blue-500",
    location: "bg-red-600",
    wifi: "bg-blue-600",
    vcard: "bg-indigo-600",
    event: "bg-orange-500",
    text: "bg-gray-600",
    url: "bg-primary",
  }

  return (
    <div className={cn("w-6 h-6 rounded", iconColors[iconType] || "bg-primary")} />
  )
}

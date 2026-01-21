import {
  Link,
  Wifi,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  User,
  Calendar,
  CreditCard,
  FileText,
  ImageIcon,
  Video,
  Music,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Social Media Icons (using Lucide placeholders, will use custom SVGs)
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Github,
  Music2,
  MessageCircle,
  Send,
  Hash,
} from "lucide-react"

export interface QRType {
  id: string
  name: string
  description: string
  icon: LucideIcon
  category: "social" | "utility" | "business" | "files"
  fields: QRField[]
}

export interface QRField {
  name: string
  label: string
  type: "text" | "url" | "email" | "tel" | "textarea" | "select" | "datetime-local" | "file"
  placeholder?: string
  required?: boolean
  options?: { value: string; label: string }[]
  accept?: string
}

export const QR_TYPES: QRType[] = [
  // Utility Types
  {
    id: "url",
    name: "URL / Link",
    description: "Link to any website or webpage",
    icon: Link,
    category: "utility",
    fields: [
      { name: "url", label: "Website URL", type: "url", placeholder: "https://example.com", required: true },
    ],
  },
  {
    id: "wifi",
    name: "WiFi Network",
    description: "Share WiFi credentials instantly",
    icon: Wifi,
    category: "utility",
    fields: [
      { name: "ssid", label: "Network Name (SSID)", type: "text", placeholder: "MyNetwork", required: true },
      { name: "password", label: "Password", type: "password", placeholder: "••••••••" },
      {
        name: "encryption",
        label: "Security Type",
        type: "select",
        placeholder: "Select encryption",
        options: [
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "None" },
        ],
      },
    ],
  },
  {
    id: "phone",
    name: "Phone Number",
    description: "Quick dial a phone number",
    icon: Phone,
    category: "utility",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 234 567 8900", required: true },
    ],
  },
  {
    id: "email",
    name: "Email",
    description: "Pre-compose an email message",
    icon: Mail,
    category: "utility",
    fields: [
      { name: "email", label: "Email Address", type: "email", placeholder: "hello@example.com", required: true },
      { name: "subject", label: "Subject", type: "text", placeholder: "Hello!" },
      { name: "body", label: "Message", type: "textarea", placeholder: "Your message here..." },
    ],
  },
  {
    id: "sms",
    name: "SMS Message",
    description: "Send a pre-filled text message",
    icon: MessageSquare,
    category: "utility",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", placeholder: "+1 234 567 8900", required: true },
      { name: "message", label: "Message", type: "textarea", placeholder: "Your message..." },
    ],
  },
  {
    id: "location",
    name: "Map Location",
    description: "Share GPS coordinates or address",
    icon: MapPin,
    category: "utility",
    fields: [
      { name: "latitude", label: "Latitude", type: "text", placeholder: "40.7128", required: true },
      { name: "longitude", label: "Longitude", type: "text", placeholder: "-74.0060", required: true },
      { name: "name", label: "Location Name", type: "text", placeholder: "New York City" },
    ],
  },
  {
    id: "vcard",
    name: "Contact Card",
    description: "Share full contact information",
    icon: User,
    category: "business",
    fields: [
      { name: "firstName", label: "First Name", type: "text", placeholder: "John", required: true },
      { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe", required: true },
      { name: "phone", label: "Phone", type: "tel", placeholder: "+1 234 567 8900" },
      { name: "email", label: "Email", type: "email", placeholder: "john@example.com" },
      { name: "company", label: "Company", type: "text", placeholder: "Acme Inc." },
      { name: "title", label: "Job Title", type: "text", placeholder: "Software Engineer" },
      { name: "website", label: "Website", type: "url", placeholder: "https://johndoe.com" },
    ],
  },
  {
    id: "event",
    name: "Calendar Event",
    description: "Create a calendar event",
    icon: Calendar,
    category: "business",
    fields: [
      { name: "title", label: "Event Title", type: "text", placeholder: "Meeting", required: true },
      { name: "location", label: "Location", type: "text", placeholder: "Conference Room A" },
      { name: "startDate", label: "Start Date & Time", type: "text", placeholder: "2024-12-25T10:00" },
      { name: "endDate", label: "End Date & Time", type: "text", placeholder: "2024-12-25T11:00" },
      { name: "description", label: "Description", type: "textarea", placeholder: "Event details..." },
    ],
  },
  {
    id: "text",
    name: "Plain Text",
    description: "Any text content",
    icon: FileText,
    category: "utility",
    fields: [
      { name: "text", label: "Text Content", type: "textarea", placeholder: "Enter your text...", required: true },
    ],
  },
  // Social Media Types
  {
    id: "twitter",
    name: "Twitter / X",
    description: "Link to your Twitter profile",
    icon: Twitter,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "@username", required: true },
    ],
  },
  {
    id: "instagram",
    name: "Instagram",
    description: "Link to your Instagram profile",
    icon: Instagram,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username", required: true },
    ],
  },
  {
    id: "facebook",
    name: "Facebook",
    description: "Link to your Facebook page",
    icon: Facebook,
    category: "social",
    fields: [
      { name: "username", label: "Username or Page ID", type: "text", placeholder: "username", required: true },
    ],
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Link to your LinkedIn profile",
    icon: Linkedin,
    category: "social",
    fields: [
      { name: "username", label: "Profile URL or Username", type: "text", placeholder: "in/username", required: true },
    ],
  },
  {
    id: "youtube",
    name: "YouTube",
    description: "Link to your YouTube channel",
    icon: Youtube,
    category: "social",
    fields: [
      { name: "channel", label: "Channel URL or ID", type: "text", placeholder: "@channelname", required: true },
    ],
  },
  {
    id: "tiktok",
    name: "TikTok",
    description: "Link to your TikTok profile",
    icon: Music2,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "@username", required: true },
    ],
  },
  {
    id: "github",
    name: "GitHub",
    description: "Link to your GitHub profile",
    icon: Github,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username", required: true },
    ],
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Start a WhatsApp conversation",
    icon: MessageCircle,
    category: "social",
    fields: [
      { name: "phone", label: "Phone Number (with country code)", type: "tel", placeholder: "+1234567890", required: true },
      { name: "message", label: "Pre-filled Message", type: "textarea", placeholder: "Hello!" },
    ],
  },
  {
    id: "telegram",
    name: "Telegram",
    description: "Link to your Telegram profile",
    icon: Send,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username", required: true },
    ],
  },
  {
    id: "discord",
    name: "Discord",
    description: "Link to your Discord server",
    icon: Hash,
    category: "social",
    fields: [
      { name: "inviteCode", label: "Invite Code or Server URL", type: "text", placeholder: "discord.gg/invite", required: true },
    ],
  },
  {
    id: "snapchat",
    name: "Snapchat",
    description: "Add on Snapchat",
    icon: MessageCircle,
    category: "social",
    fields: [
      { name: "username", label: "Username", type: "text", placeholder: "username", required: true },
    ],
  },
  {
    id: "spotify",
    name: "Spotify",
    description: "Share your Spotify profile or playlist",
    icon: Music2,
    category: "social",
    fields: [
      { name: "uri", label: "Spotify URI or URL", type: "text", placeholder: "spotify:user:username", required: true },
    ],
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Request payment via PayPal",
    icon: CreditCard,
    category: "business",
    fields: [
      { name: "email", label: "PayPal Email or Username", type: "text", placeholder: "email@example.com", required: true },
      { name: "amount", label: "Amount (optional)", type: "text", placeholder: "10.00" },
      { name: "currency", label: "Currency", type: "select", placeholder: "Select currency", options: [
        { value: "USD", label: "USD" },
        { value: "EUR", label: "EUR" },
        { value: "GBP", label: "GBP" },
      ]},
    ],
  },
  // File Types - Upload
  {
    id: "photo",
    name: "Photo / Image",
    description: "Upload an image file",
    icon: ImageIcon,
    category: "files",
    fields: [
      { name: "file", label: "Upload Image", type: "file", placeholder: "Choose image file", required: true, accept: "image/*" },
    ],
  },
  {
    id: "video",
    name: "Video",
    description: "Upload a video file",
    icon: Video,
    category: "files",
    fields: [
      { name: "file", label: "Upload Video", type: "file", placeholder: "Choose video file", required: true, accept: "video/*" },
    ],
  },
  {
    id: "music",
    name: "Music / Audio",
    description: "Upload an audio file",
    icon: Music,
    category: "files",
    fields: [
      { name: "file", label: "Upload Audio", type: "file", placeholder: "Choose audio file", required: true, accept: "audio/*" },
    ],
  },
  {
    id: "document",
    name: "Document / PDF",
    description: "Upload a PDF document",
    icon: FileText,
    category: "files",
    fields: [
      { name: "file", label: "Upload Document", type: "file", placeholder: "Choose PDF file", required: true, accept: "application/pdf" },
    ],
  },
]

export function generateQRData(typeId: string, formData: Record<string, string>): string {
  // Helper to safely get string values
  const get = (key: string): string => formData[key] || ""
  
  switch (typeId) {
    case "url":
      return get("url")
    
    case "wifi": {
      const encryption = get("encryption") || "WPA"
      const hidden = "false"
      const ssid = get("ssid")
      if (!ssid) return ""
      return `WIFI:T:${encryption};S:${ssid};P:${get("password")};H:${hidden};;`
    }
    
    case "phone": {
      const phone = get("phone")
      if (!phone) return ""
      return `tel:${phone}`
    }
    
    case "email": {
      const email = get("email")
      if (!email) return ""
      let emailStr = `mailto:${email}`
      const emailParams: string[] = []
      if (get("subject")) emailParams.push(`subject=${encodeURIComponent(get("subject"))}`)
      if (get("body")) emailParams.push(`body=${encodeURIComponent(get("body"))}`)
      if (emailParams.length) emailStr += `?${emailParams.join("&")}`
      return emailStr
    }
    
    case "sms": {
      const phone = get("phone")
      if (!phone) return ""
      let smsStr = `sms:${phone}`
      if (get("message")) smsStr += `?body=${encodeURIComponent(get("message"))}`
      return smsStr
    }
    
    case "location": {
      const lat = get("latitude")
      const lng = get("longitude")
      if (!lat || !lng) return ""
      return `geo:${lat},${lng}${get("name") ? `?q=${encodeURIComponent(get("name"))}` : ""}`
    }
    
    case "vcard": {
      const firstName = get("firstName")
      const lastName = get("lastName")
      if (!firstName || !lastName) return ""
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${lastName};${firstName}`,
        `FN:${firstName} ${lastName}`,
      ]
      if (get("phone")) lines.push(`TEL:${get("phone")}`)
      if (get("email")) lines.push(`EMAIL:${get("email")}`)
      if (get("company")) lines.push(`ORG:${get("company")}`)
      if (get("title")) lines.push(`TITLE:${get("title")}`)
      if (get("website")) lines.push(`URL:${get("website")}`)
      lines.push("END:VCARD")
      return lines.join("\n")
    }
    
    case "event": {
      const title = get("title")
      if (!title) return ""
      const formatDate = (date: string) => date ? date.replace(/[-:]/g, "").replace("T", "T") + "00" : ""
      const lines = ["BEGIN:VEVENT", `SUMMARY:${title}`]
      if (get("location")) lines.push(`LOCATION:${get("location")}`)
      if (get("startDate")) lines.push(`DTSTART:${formatDate(get("startDate"))}`)
      if (get("endDate")) lines.push(`DTEND:${formatDate(get("endDate"))}`)
      if (get("description")) lines.push(`DESCRIPTION:${get("description")}`)
      lines.push("END:VEVENT")
      return lines.join("\n")
    }
    
    case "text":
      return get("text")
    
    // Social Media
    case "twitter": {
      const username = get("username")
      if (!username) return ""
      return `https://twitter.com/${username.replace("@", "")}`
    }
    case "instagram": {
      const username = get("username")
      if (!username) return ""
      return `https://instagram.com/${username.replace("@", "")}`
    }
    case "facebook": {
      const username = get("username")
      if (!username) return ""
      return `https://facebook.com/${username}`
    }
    case "linkedin": {
      const username = get("username")
      if (!username) return ""
      return username.startsWith("http") ? username : `https://linkedin.com/${username}`
    }
    case "youtube": {
      const channel = get("channel")
      if (!channel) return ""
      return channel.startsWith("http") ? channel : `https://youtube.com/${channel}`
    }
    case "tiktok": {
      const username = get("username")
      if (!username) return ""
      return `https://tiktok.com/@${username.replace("@", "")}`
    }
    case "github": {
      const username = get("username")
      if (!username) return ""
      return `https://github.com/${username}`
    }
    case "whatsapp": {
      const phone = get("phone")
      if (!phone) return ""
      let waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, "")}`
      if (get("message")) waUrl += `?text=${encodeURIComponent(get("message"))}`
      return waUrl
    }
    case "telegram": {
      const username = get("username")
      if (!username) return ""
      return `https://t.me/${username}`
    }
    case "discord": {
      const inviteCode = get("inviteCode")
      if (!inviteCode) return ""
      return inviteCode.startsWith("http") ? inviteCode : `https://discord.gg/${inviteCode}`
    }
    case "snapchat": {
      const username = get("username")
      if (!username) return ""
      return `https://snapchat.com/add/${username}`
    }
    case "spotify": {
      const uri = get("uri")
      if (!uri) return ""
      return uri.startsWith("http") ? uri : `https://open.spotify.com/user/${uri}`
    }
    case "paypal": {
      const email = get("email")
      if (!email) return ""
      let paypalUrl = `https://paypal.me/${email}`
      if (get("amount")) paypalUrl += `/${get("amount")}${get("currency") || "USD"}`
      return paypalUrl
    }
    
    // File Types (uploaded files return their URL)
    case "photo":
    case "video":
    case "music":
    case "document": {
      const url = get("file")
      if (!url) return ""
      return url
    }
    
    default:
      return ""
  }
}

"use client"

import React from "react"

import { useState, useRef } from "react"
import { type QRType } from "@/lib/qr-types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, X, FileIcon, ImageIcon, Video, Music, Loader2, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface QRFormProps {
  type: QRType
  formData: Record<string, string>
  onFormChange: (data: Record<string, string>) => void
}

interface UploadedFile {
  name: string
  url: string
  type: string
  size: number
}

export function QRForm({ type, formData, onFormChange }: QRFormProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (name: string, value: string) => {
    onFormChange({ ...formData, [name]: value })
  }

  const handleFileUpload = async (file: File, fieldName: string) => {
    setUploading(true)
    setUploadError(null)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Upload failed")
      }

      setUploadedFile({
        name: result.filename,
        url: result.url,
        type: result.type,
        size: result.size,
      })

      handleChange(fieldName, result.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file, fieldName)
    }
  }

  const removeFile = (fieldName: string) => {
    setUploadedFile(null)
    handleChange(fieldName, "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return ImageIcon
    if (type.startsWith("video/")) return Video
    if (type.startsWith("audio/")) return Music
    return FileIcon
  }

  // Reset uploaded file when type changes
  const prevTypeId = useRef(type.id)
  if (prevTypeId.current !== type.id) {
    prevTypeId.current = type.id
    if (uploadedFile) {
      setUploadedFile(null)
      setUploadError(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <type.icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">{type.name}</h3>
          <p className="text-sm text-muted-foreground">{type.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        {type.fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-primary ml-1">*</span>}
            </Label>

            {field.type === "file" ? (
              <div className="space-y-3">
                {!uploadedFile && !uploading && (
                  <div
                    className={cn(
                      "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
                      "hover:border-primary/50 hover:bg-primary/5",
                      uploadError ? "border-destructive/50 bg-destructive/5" : "border-border"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept={field.accept}
                      onChange={(e) => handleFileSelect(e, field.name)}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm font-medium text-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {field.accept === "image/*" && "PNG, JPG, GIF, WebP up to 50MB"}
                      {field.accept === "video/*" && "MP4, WebM, MOV up to 50MB"}
                      {field.accept === "audio/*" && "MP3, WAV, OGG up to 50MB"}
                      {field.accept === "application/pdf" && "PDF documents up to 50MB"}
                    </p>
                  </div>
                )}

                {uploading && (
                  <div className="border border-border rounded-xl p-6 text-center bg-secondary/30">
                    <Loader2 className="w-8 h-8 mx-auto mb-3 text-primary animate-spin" />
                    <p className="text-sm font-medium text-foreground">Uploading...</p>
                    <p className="text-xs text-muted-foreground">Please wait while your file is being uploaded</p>
                  </div>
                )}

                {uploadedFile && (
                  <div className="border border-primary/30 bg-primary/5 rounded-xl p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icon = getFileIcon(uploadedFile.type)
                          return <Icon className="w-5 h-5 text-primary" />
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(uploadedFile.size)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-primary" />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeFile(field.name)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {uploadError && (
                  <p className="text-sm text-destructive">{uploadError}</p>
                )}
              </div>
            ) : field.type === "textarea" ? (
              <Textarea
                id={field.name}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="bg-secondary/50 border-border resize-none"
                rows={3}
              />
            ) : field.type === "select" ? (
              <Select
                value={formData[field.name] || ""}
                onValueChange={(value) => handleChange(field.name, value)}
              >
                <SelectTrigger className="bg-secondary/50 border-border">
                  <SelectValue placeholder={field.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={field.name}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ""}
                onChange={(e) => handleChange(field.name, e.target.value)}
                className="bg-secondary/50 border-border"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

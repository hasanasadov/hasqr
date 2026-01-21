"use client"

import React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { MapPin, Search, Crosshair, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationPickerProps {
  latitude: string
  longitude: string
  locationName: string
  onLocationChange: (lat: string, lng: string, name: string) => void
}

interface SearchResult {
  lat: string
  lon: string
  display_name: string
}

export function LocationPicker({
  latitude,
  longitude,
  locationName,
  onLocationChange,
}: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mapLat, setMapLat] = useState(latitude || "40.7128")
  const [mapLng, setMapLng] = useState(longitude || "-74.0060")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [tempName, setTempName] = useState(locationName || "")
  const mapRef = useRef<HTMLDivElement>(null)
  const markerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Update internal state when props change
  useEffect(() => {
    if (latitude) setMapLat(latitude)
    if (longitude) setMapLng(longitude)
    if (locationName) setTempName(locationName)
  }, [latitude, longitude, locationName])

  // Search for locations using Nominatim API
  const searchLocation = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
        {
          headers: {
            "Accept-Language": "en",
          },
        }
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("[v0] Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude.toFixed(6)
        const lng = position.coords.longitude.toFixed(6)
        setMapLat(lat)
        setMapLng(lng)

        // Reverse geocode to get location name
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
            {
              headers: {
                "Accept-Language": "en",
              },
            }
          )
          const data = await response.json()
          if (data.display_name) {
            const shortName = data.display_name.split(",").slice(0, 3).join(",")
            setTempName(shortName)
          }
        } catch (error) {
          console.error("[v0] Reverse geocode error:", error)
        }

        setIsLocating(false)
      },
      (error) => {
        console.error("[v0] Geolocation error:", error)
        alert("Unable to retrieve your location")
        setIsLocating(false)
      },
      { enableHighAccuracy: true }
    )
  }

  // Select a search result
  const selectResult = (result: SearchResult) => {
    setMapLat(parseFloat(result.lat).toFixed(6))
    setMapLng(parseFloat(result.lon).toFixed(6))
    const shortName = result.display_name.split(",").slice(0, 3).join(",")
    setTempName(shortName)
    setSearchResults([])
    setSearchQuery("")
  }

  // Handle map click to update coordinates
  const handleMapInteraction = useCallback((e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!mapRef.current) return
    
    const rect = mapRef.current.getBoundingClientRect()
    let clientX: number, clientY: number
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }
    
    const x = clientX - rect.left
    const y = clientY - rect.top

    // Convert pixel position to lat/lng offset (simplified projection)
    const centerLat = parseFloat(mapLat)
    const centerLng = parseFloat(mapLng)
    
    // Calculate offset from center
    const offsetX = (x - rect.width / 2) / rect.width
    const offsetY = (rect.height / 2 - y) / rect.height
    
    // Approximate degrees per pixel at current zoom (rough estimate)
    const latRange = 0.02 // approximately 2km range
    const lngRange = 0.02
    
    const newLat = (centerLat + offsetY * latRange).toFixed(6)
    const newLng = (centerLng + offsetX * lngRange).toFixed(6)
    
    setMapLat(newLat)
    setMapLng(newLng)
  }, [mapLat, mapLng])

  // Confirm selection
  const confirmSelection = () => {
    onLocationChange(mapLat, mapLng, tempName)
    setIsOpen(false)
  }

  // Generate map tile URL
  const getMapTileUrl = () => {
    const lat = parseFloat(mapLat) || 40.7128
    const lng = parseFloat(mapLng) || -74.006
    const zoom = 15
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01}%2C${lat - 0.01}%2C${lng + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lng}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full bg-secondary/50 border-border hover:bg-secondary justify-start gap-2"
        >
          <MapPin className="w-4 h-4 text-primary" />
          {latitude && longitude ? (
            <span className="truncate text-foreground">
              {locationName || `${latitude}, ${longitude}`}
            </span>
          ) : (
            <span className="text-muted-foreground">Pick location from map</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Select Location
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search for a location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchLocation()}
                className="pl-10 bg-secondary/50 border-border"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={searchLocation}
              disabled={isSearching}
              className="border-border bg-transparent"
            >
              {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={getCurrentLocation}
              disabled={isLocating}
              className="border-border bg-transparent"
              title="Use my current location"
            >
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="absolute z-50 w-[calc(100%-3rem)] bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {searchResults.map((result, index) => (
                <button
                  key={index}
                  onClick={() => selectResult(result)}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 border-b border-border last:border-0 flex items-start gap-2"
                >
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-foreground line-clamp-2">{result.display_name}</span>
                </button>
              ))}
            </div>
          )}

          {/* Map Container */}
          <div
            ref={mapRef}
            className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-border bg-secondary/30"
          >
            <iframe
              src={getMapTileUrl()}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none"
            />
            {/* Overlay for click interaction */}
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={handleMapInteraction}
              onTouchStart={handleMapInteraction}
            >
              {/* Center marker indicator */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none">
                <div className="flex flex-col items-center">
                  <MapPin className="w-8 h-8 text-primary drop-shadow-lg" fill="currentColor" />
                  <div className="w-2 h-2 bg-primary rounded-full -mt-1 shadow-lg" />
                </div>
              </div>
            </div>
            
            {/* Instructions overlay */}
            <div className="absolute bottom-2 left-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground text-center">
              Click anywhere on the map to refine the location
            </div>
          </div>

          {/* Coordinates Display */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Latitude
              </Label>
              <Input
                value={mapLat}
                onChange={(e) => setMapLat(e.target.value)}
                placeholder="40.7128"
                className="bg-secondary/50 border-border font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground uppercase tracking-wider">
                Longitude
              </Label>
              <Input
                value={mapLng}
                onChange={(e) => setMapLng(e.target.value)}
                placeholder="-74.0060"
                className="bg-secondary/50 border-border font-mono text-sm"
              />
            </div>
          </div>

          {/* Location Name */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase tracking-wider">
              Location Name (optional)
            </Label>
            <Input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="e.g., Central Park, New York"
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 border-border"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmSelection}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

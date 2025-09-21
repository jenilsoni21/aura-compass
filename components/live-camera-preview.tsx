"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, CameraOff, AlertCircle } from "lucide-react"
import { useFaceDetection } from "@/hooks/use-face-detection"
import { cn } from "@/lib/utils"

interface LiveCameraPreviewProps {
  className?: string
  onEmotionChange?: (emotion: string | null) => void
}

const emotionEmojis: Record<string, string> = {
  happy: "😊",
  sad: "😔",
  angry: "😠",
  surprised: "😲",
  neutral: "😐",
  fear: "😨",
  disgust: "🤢",
}

export function LiveCameraPreview({ className, onEmotionChange }: LiveCameraPreviewProps) {
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const { isEnabled, isLoading, error, currentEmotion, confidence, videoElement, toggleDetection } = useFaceDetection()

  // Update video preview when video element changes
  useEffect(() => {
    if (videoPreviewRef.current && videoElement) {
      videoPreviewRef.current.srcObject = videoElement.srcObject
    }
  }, [videoElement])

  // Notify parent of emotion changes
  useEffect(() => {
    onEmotionChange?.(currentEmotion)
  }, [currentEmotion, onEmotionChange])

  const getBorderColor = () => {
    if (error) return "border-red-500"
    if (isEnabled && !isLoading) return "border-green-500"
    if (isLoading) return "border-yellow-500"
    return "border-gray-300"
  }

  return (
    <Card
      className={cn(
        "fixed top-4 right-4 w-48 h-36 z-50 overflow-hidden transition-all duration-300",
        getBorderColor(),
        "border-2",
        className,
      )}
    >
      <div className="relative w-full h-full">
        {/* Video Preview */}
        {isEnabled && !error && (
          <video ref={videoPreviewRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 bg-red-50 flex flex-col items-center justify-center p-2">
            <AlertCircle className="h-6 w-6 text-red-500 mb-1" />
            <p className="text-xs text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Placeholder when disabled */}
        {!isEnabled && !isLoading && !error && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
            <CameraOff className="h-8 w-8 text-gray-400" />
          </div>
        )}

        {/* Controls Overlay */}
        <div className="absolute top-2 left-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={toggleDetection}
            className="h-6 w-6 p-0 bg-black/20 hover:bg-black/40 text-white"
            disabled={isLoading}
          >
            {isEnabled ? <CameraOff className="h-3 w-3" /> : <Camera className="h-3 w-3" />}
          </Button>
        </div>

        {/* Emotion Display */}
        {isEnabled && currentEmotion && !error && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <span>{emotionEmojis[currentEmotion] || "😐"}</span>
                <span className="capitalize">{currentEmotion}</span>
              </span>
              <span className="text-gray-300">{Math.round(confidence * 100)}%</span>
            </div>
          </div>
        )}

        {/* Status Indicator */}
        <div
          className={cn(
            "absolute top-2 right-2 w-2 h-2 rounded-full",
            isEnabled && !error ? "bg-green-500" : error ? "bg-red-500" : "bg-gray-400",
          )}
        />
      </div>
    </Card>
  )
}

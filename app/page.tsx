"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DynamicAvatar } from "@/components/dynamic-avatar"
import { EmotionEnvironment } from "@/components/emotion-environment"
import { LiveCameraPreview } from "@/components/live-camera-preview"
import { CrisisGuardian } from "@/components/crisis-guardian"
import { SessionStorage } from "@/lib/session-storage"
import { mapFaceEmotionToAvatarState, mapFaceEmotionToEnvironment } from "@/lib/face-detection"
import { useFaceDetection } from "@/hooks/use-face-detection"
import Link from "next/link"

type AvatarState = "neutral" | "stressed" | "calm" | "happy" | "anxious" | "foggy" | "glowing"

export default function HomePage() {
  const [avatarState, setAvatarState] = useState<AvatarState>("neutral")
  const [currentEmotion, setCurrentEmotion] = useState<string>("neutral")
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false)
  const [detectedFaceEmotion, setDetectedFaceEmotion] = useState<string | null>(null)
  const [showCrisisGuardian, setShowCrisisGuardian] = useState(false)
  const [crisisMessage, setCrisisMessage] = useState("")

  const { onCrisisDetected } = useFaceDetection()

  useEffect(() => {
    const unsubscribe = onCrisisDetected((message: string, emotion: string) => {
      setCrisisMessage(message)
      setShowCrisisGuardian(true)
      setCurrentEmotion("stressed")
      setAvatarState("foggy")
    })

    return unsubscribe
  }, [onCrisisDetected])

  useEffect(() => {
    // Load current emotional state from session storage
    const savedEmotion = SessionStorage.getCurrentEmotionalState()
    setCurrentEmotion(savedEmotion)
    setAvatarState(savedEmotion as AvatarState)
  }, [])

  const handleFaceEmotionChange = (faceEmotion: string | null) => {
    setDetectedFaceEmotion(faceEmotion)

    if (faceEmotion && faceDetectionEnabled) {
      const newAvatarState = mapFaceEmotionToAvatarState(faceEmotion as any)
      const newEnvironmentState = mapFaceEmotionToEnvironment(faceEmotion as any)

      setAvatarState(newAvatarState as AvatarState)
      setCurrentEmotion(newEnvironmentState)
      SessionStorage.setCurrentEmotionalState(newAvatarState)
    }
  }

  const handleAvatarDemo = (state: AvatarState) => {
    // Only allow manual demo if face detection is disabled
    if (!faceDetectionEnabled) {
      setAvatarState(state)
      setCurrentEmotion(state)
      SessionStorage.setCurrentEmotionalState(state)
    }
  }

  const handleStartFaceDetection = () => {
    setFaceDetectionEnabled(true)
  }

  return (
    <EmotionEnvironment emotionalState={currentEmotion as any}>
      <LiveCameraPreview onEmotionChange={handleFaceEmotionChange} />

      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              AuraCompass
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 font-medium">
              Not just an app — your mirror, mentor, and mental co-pilot.
            </p>
          </div>

          <div className="flex justify-center py-8">
            <DynamicAvatar state={avatarState} size="xl" />
          </div>

          {faceDetectionEnabled && detectedFaceEmotion && (
            <div className="bg-card/50 backdrop-blur-sm rounded-lg p-4 mx-auto max-w-md">
              <p className="text-sm text-muted-foreground mb-2">Live Emotion Detection Active</p>
              <p className="text-lg font-medium">
                Detected: <span className="capitalize text-primary">{detectedFaceEmotion}</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Your avatar and environment update in real-time based on your facial expressions
              </p>
            </div>
          )}

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAvatarDemo("neutral")}
              disabled={faceDetectionEnabled}
              className="hover:bg-muted hover:border-primary/50"
            >
              Neutral
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAvatarDemo("stressed")}
              disabled={faceDetectionEnabled}
              className="hover:bg-gray-50 hover:border-gray-300"
            >
              Stressed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAvatarDemo("calm")}
              disabled={faceDetectionEnabled}
              className="hover:bg-emerald-50 hover:border-emerald-300"
            >
              Calm
            </Button>
          </div>

          {!faceDetectionEnabled && (
            <div className="mb-8">
              <Button
                onClick={handleStartFaceDetection}
                size="lg"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3"
              >
                Start Live Emotion Detection
              </Button>
              <p className="text-sm text-muted-foreground mt-2">
                Enable your camera to see real-time avatar and environment changes
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mirror">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 group px-8 py-3"
              >
                Start Journaling
              </Button>
            </Link>
            <Link href="/progress">
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 hover:bg-primary/5 hover:border-primary transition-all duration-300 group bg-transparent px-8 py-3"
              >
                Explore My Journey
              </Button>
            </Link>
          </div>

          <div className="mt-16 text-center">
            <p className="text-muted-foreground text-sm animate-fade-in">
              {faceDetectionEnabled
                ? "Your environment responds to both your emotions and facial expressions"
                : "Experience how your environment responds to your emotions"}
            </p>
          </div>
        </div>
      </div>

      <CrisisGuardian
        isVisible={showCrisisGuardian}
        onClose={() => setShowCrisisGuardian(false)}
        triggerText={crisisMessage}
        faceEmotion={detectedFaceEmotion}
      />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
      `}</style>
    </EmotionEnvironment>
  )
}

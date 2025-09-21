"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Lightbulb, Heart, Save, Camera, CameraOff } from "lucide-react"
import Link from "next/link"
import { DynamicAvatar } from "@/components/dynamic-avatar"
import { EmotionEnvironment } from "@/components/emotion-environment"
import { LiveCameraPreview } from "@/components/live-camera-preview"
import { detectEmotion, detectCrisis, getEmotionAdvice, type EmotionalState } from "@/lib/emotion-detector"
import { SessionStorage, type JournalEntry } from "@/lib/session-storage"
import { CrisisGuardian } from "@/components/crisis-guardian"
import { mapFaceEmotionToEnvironment } from "@/lib/face-detection"
import { useFaceDetection } from "@/hooks/use-face-detection"

export default function MirrorModePage() {
  const [journalText, setJournalText] = useState("")
  const [currentEmotion, setCurrentEmotion] = useState<EmotionalState>("neutral")
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [showCrisisGuardian, setShowCrisisGuardian] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false)
  const [detectedFaceEmotion, setDetectedFaceEmotion] = useState<string | null>(null)
  const [textEmotion, setTextEmotion] = useState<EmotionalState>("neutral")
  const [blendedEmotion, setBlendedEmotion] = useState<EmotionalState>("neutral")
  const [crisisMessage, setCrisisMessage] = useState("")

  const { onCrisisDetected } = useFaceDetection()

  useEffect(() => {
    const unsubscribe = onCrisisDetected((message: string, emotion: string) => {
      setCrisisMessage(message)
      setShowCrisisGuardian(true)
      setCurrentEmotion("stressed")
      setAiSuggestion("I'm very concerned about you right now. Please reach out for immediate support.")
    })

    return unsubscribe
  }, [onCrisisDetected])

  const analyzeText = (text: string) => {
    if (!text.trim()) {
      setAiSuggestion("")
      setTextEmotion("neutral")
      return
    }

    if (detectCrisis(text)) {
      setShowCrisisGuardian(true)
      const crisisEmotion = "stressed"
      setTextEmotion(crisisEmotion)
      setCurrentEmotion(crisisEmotion)
      setAiSuggestion(
        "I'm concerned about you. Please reach out for immediate support - you don't have to go through this alone.",
      )
      SessionStorage.setCurrentEmotionalState(crisisEmotion)
      return
    }

    const emotion = detectEmotion(text)
    setTextEmotion(emotion)

    if (faceDetectionEnabled && detectedFaceEmotion) {
      const blended = blendEmotions(emotion, detectedFaceEmotion)
      setBlendedEmotion(blended)
      setCurrentEmotion(blended)
      setAiSuggestion(getBlendedEmotionAdvice(emotion, detectedFaceEmotion, blended))
    } else {
      setCurrentEmotion(emotion)
      setAiSuggestion(getEmotionAdvice(emotion))
    }

    SessionStorage.setCurrentEmotionalState(currentEmotion)
  }

  const blendEmotions = (textEmotion: EmotionalState, faceEmotion: string): EmotionalState => {
    const emotionPriority: Record<string, number> = {
      stressed: 5,
      anxious: 4,
      sad: 3,
      angry: 3,
      neutral: 2,
      calm: 1,
      happy: 1,
      resilient: 1,
    }

    const textPriority = emotionPriority[textEmotion] || 2
    const facePriority = emotionPriority[faceEmotion] || 2

    if (textEmotion === "calm" && (faceEmotion === "sad" || faceEmotion === "angry")) {
      return "anxious"
    }

    if (textEmotion === "happy" && faceEmotion === "sad") {
      return "neutral"
    }

    if (facePriority > textPriority) {
      return mapFaceEmotionToEnvironment(faceEmotion as any) as EmotionalState
    }

    return textEmotion
  }

  const getBlendedEmotionAdvice = (
    textEmotion: EmotionalState,
    faceEmotion: string,
    blendedEmotion: EmotionalState,
  ): string => {
    if (textEmotion !== blendedEmotion) {
      return `I notice your words express ${textEmotion} feelings, but your face shows ${faceEmotion}. This mixed state is completely normal. ${getEmotionAdvice(blendedEmotion)}`
    }

    return `Your words and facial expression both show ${blendedEmotion} - you're in harmony. ${getEmotionAdvice(blendedEmotion)}`
  }

  const handleFaceEmotionChange = (faceEmotion: string | null) => {
    setDetectedFaceEmotion(faceEmotion)

    if (faceEmotion && faceDetectionEnabled) {
      if (journalText.trim()) {
        analyzeText(journalText)
      } else {
        const mappedEmotion = mapFaceEmotionToEnvironment(faceEmotion as any) as EmotionalState
        setCurrentEmotion(mappedEmotion)
        setAiSuggestion(`I can see you're feeling ${faceEmotion}. ${getEmotionAdvice(mappedEmotion)}`)
      }
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (journalText.trim()) {
        analyzeText(journalText)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [journalText, faceDetectionEnabled, detectedFaceEmotion])

  const handleSaveEntry = async () => {
    if (!journalText.trim()) return

    setIsSaving(true)

    const entry: JournalEntry = {
      id: Date.now().toString(),
      content: journalText,
      emotion: currentEmotion,
      timestamp: new Date(),
      aiAdvice: aiSuggestion,
      faceEmotion: detectedFaceEmotion,
      blendedEmotion: faceDetectionEnabled ? blendedEmotion : undefined,
    }

    SessionStorage.saveJournalEntry(entry)

    setTimeout(() => {
      setIsSaving(false)
      setJournalText("")
      setAiSuggestion("")
      setCurrentEmotion("neutral")
      setTextEmotion("neutral")
      setBlendedEmotion("neutral")
    }, 1000)
  }

  const getAvatarState = (emotion: EmotionalState) => {
    switch (emotion) {
      case "stressed":
        return "foggy"
      case "anxious":
        return "anxious"
      case "calm":
        return "glowing"
      case "happy":
        return "happy"
      case "resilient":
        return "glowing"
      default:
        return "neutral"
    }
  }

  return (
    <EmotionEnvironment emotionalState={currentEmotion}>
      {faceDetectionEnabled && <LiveCameraPreview onEmotionChange={handleFaceEmotionChange} />}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Mirror Mode
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  How are you feeling today?
                </CardTitle>
                <div className="flex items-center gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    {faceDetectionEnabled ? (
                      <Camera className="h-4 w-4 text-primary" />
                    ) : (
                      <CameraOff className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="text-sm text-muted-foreground">Face Detection</span>
                  </div>
                  <Switch checked={faceDetectionEnabled} onCheckedChange={setFaceDetectionEnabled} />
                  <span className="text-xs text-muted-foreground">
                    {faceDetectionEnabled ? "Blending face + text emotions" : "Text emotions only"}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing about your thoughts and feelings... Watch as your environment responds to your emotions."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="min-h-[300px] resize-none border-primary/20 focus:border-primary/50 transition-colors bg-background/50"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-muted-foreground">{journalText.length} characters</span>
                  <Button
                    onClick={handleSaveEntry}
                    disabled={!journalText.trim() || isSaving}
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save Entry"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {aiSuggestion && (
              <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-2">AI Companion Suggestion</h3>
                      <p className="text-sm text-foreground/80 leading-relaxed">{aiSuggestion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-center">Your Emotional Mirror</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="flex justify-center">
                  <DynamicAvatar state={getAvatarState(currentEmotion) as any} size="lg" />
                </div>

                <div className="space-y-2">
                  <p className="text-lg font-medium capitalize">{currentEmotion}</p>
                  <p className="text-sm text-muted-foreground">Your environment reflects your emotional state</p>

                  {faceDetectionEnabled && (textEmotion !== currentEmotion || detectedFaceEmotion) && (
                    <div className="pt-3 border-t border-border/50">
                      <div className="text-xs space-y-1">
                        {journalText.trim() && (
                          <p className="text-muted-foreground">
                            Text: <span className="capitalize text-foreground">{textEmotion}</span>
                          </p>
                        )}
                        {detectedFaceEmotion && (
                          <p className="text-muted-foreground">
                            Face: <span className="capitalize text-foreground">{detectedFaceEmotion}</span>
                          </p>
                        )}
                        {(textEmotion !== currentEmotion ||
                          (detectedFaceEmotion && detectedFaceEmotion !== currentEmotion)) && (
                          <p className="text-primary font-medium">
                            Blended: <span className="capitalize">{currentEmotion}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-3">Environment Response</h4>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {currentEmotion === "stressed" && <p>🌩️ Stormy atmosphere with subtle lightning</p>}
                    {currentEmotion === "anxious" && <p>🌫️ Trembling fog animation</p>}
                    {currentEmotion === "calm" && <p>🌅 Sunrise gradient with gentle blossoms</p>}
                    {currentEmotion === "happy" && <p>☀️ Bright, warm environment</p>}
                    {currentEmotion === "resilient" && <p>🌈 Radiant gradient with aurora effects</p>}
                    {currentEmotion === "neutral" && <p>🌸 Peaceful, balanced atmosphere</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/progress">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    View Progress
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    Wellness Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-transparent"
                  onClick={() => {
                    setAiSuggestion("Take a deep breath in for 4 counts, hold for 7, exhale for 8. Repeat 3 times.")
                  }}
                >
                  Breathing Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CrisisGuardian
        isVisible={showCrisisGuardian}
        onClose={() => setShowCrisisGuardian(false)}
        triggerText={crisisMessage || journalText}
        faceEmotion={detectedFaceEmotion}
      />
    </EmotionEnvironment>
  )
}

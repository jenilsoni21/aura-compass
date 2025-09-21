"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Phone, Heart, MessageCircle, X, Shield } from "lucide-react"

interface CrisisGuardianProps {
  isVisible: boolean
  onClose: () => void
  triggerText?: string
  faceEmotion?: string | null
}

export function CrisisGuardian({ isVisible, onClose, triggerText, faceEmotion }: CrisisGuardianProps) {
  const [showBreathingExercise, setShowBreathingExercise] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState<"inhale" | "hold" | "exhale">("inhale")
  const [breathingCount, setBreathingCount] = useState(4)

  const crisisHotlines = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "24/7 text-based crisis support",
    },
    {
      name: "SAMHSA National Helpline",
      number: "1-800-662-4357",
      description: "Mental health and substance abuse",
    },
  ]

  const startBreathingExercise = () => {
    setShowBreathingExercise(true)
    // Simple breathing exercise timer
    const breathingCycle = () => {
      setBreathingPhase("inhale")
      setBreathingCount(4)

      const countdown = setInterval(() => {
        setBreathingCount((prev) => {
          if (prev <= 1) {
            clearInterval(countdown)
            setBreathingPhase("hold")

            // Hold phase
            setTimeout(() => {
              setBreathingPhase("exhale")
              setBreathingCount(4)

              const exhaleCountdown = setInterval(() => {
                setBreathingCount((prev) => {
                  if (prev <= 1) {
                    clearInterval(exhaleCountdown)
                    // Restart cycle
                    setTimeout(breathingCycle, 1000)
                    return 4
                  }
                  return prev - 1
                })
              }, 1000)

              return 4
            }, 4000)

            return 4
          }
          return prev - 1
        })
      }, 1000)
    }

    breathingCycle()
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-red-200 shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Crisis Guardian Alert
                </CardTitle>
                <p className="text-sm text-red-600 mt-1">We're here to support you through this difficult moment</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-red-600 hover:bg-red-100">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {!showBreathingExercise ? (
            <div className="space-y-6">
              {/* Alert Message */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium mb-2">
                  {faceEmotion
                    ? "We've detected concerning emotional patterns in your facial expressions and recent activity."
                    : "We've noticed distressing language in your recent activity."}
                </p>
                <p className="text-red-700 text-sm">
                  {faceEmotion && <>Your face has shown signs of distress ({faceEmotion}) for an extended period. </>}
                  Your safety and wellbeing are our top priority. Please know that you're not alone, and help is
                  available.
                </p>
                {triggerText && triggerText.length > 50 && (
                  <div className="mt-3 p-3 bg-red-100 rounded border-l-4 border-red-400">
                    <p className="text-red-800 text-sm italic">"{triggerText}"</p>
                  </div>
                )}
              </div>

              {/* Immediate Actions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Immediate Support Options:</h3>

                <div className="grid gap-3">
                  <Button
                    className="bg-red-600 hover:bg-red-700 text-white justify-start h-auto p-4"
                    onClick={() => window.open("tel:988")}
                  >
                    <Phone className="h-5 w-5 mr-3 flex-shrink-0" />
                    <div className="text-left">
                      <div className="font-medium">Call Crisis Hotline (988)</div>
                      <div className="text-sm opacity-90">Speak with a trained counselor immediately</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-primary hover:bg-primary/5 justify-start h-auto p-4 bg-transparent"
                    onClick={startBreathingExercise}
                  >
                    <Heart className="h-5 w-5 mr-3 flex-shrink-0 text-primary" />
                    <div className="text-left">
                      <div className="font-medium">Try Calming Exercise</div>
                      <div className="text-sm text-muted-foreground">Guided breathing to help you feel grounded</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    className="border-accent hover:bg-accent/5 justify-start h-auto p-4 bg-transparent"
                  >
                    <MessageCircle className="h-5 w-5 mr-3 flex-shrink-0 text-accent" />
                    <div className="text-left">
                      <div className="font-medium">Talk to AI Coach</div>
                      <div className="text-sm text-muted-foreground">Get immediate emotional support and guidance</div>
                    </div>
                  </Button>
                </div>
              </div>

              {/* Crisis Resources */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3 text-foreground">Additional Crisis Resources:</h4>
                <div className="space-y-2">
                  {crisisHotlines.map((hotline, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{hotline.name}</p>
                        <p className="text-xs text-muted-foreground">{hotline.description}</p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {hotline.number}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reassurance */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>Remember:</strong> These feelings are temporary. You matter, your life has value, and there
                  are people who want to help you through this difficult time.
                </p>
              </div>
            </div>
          ) : (
            /* Breathing Exercise */
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Guided Breathing Exercise</h3>
                <p className="text-muted-foreground">Follow along to help calm your nervous system</p>
              </div>

              <div className="relative">
                <div
                  className={`w-32 h-32 mx-auto rounded-full border-4 transition-all duration-1000 flex items-center justify-center ${
                    breathingPhase === "inhale"
                      ? "border-blue-400 bg-blue-50 scale-110"
                      : breathingPhase === "hold"
                        ? "border-purple-400 bg-purple-50 scale-110"
                        : "border-green-400 bg-green-50 scale-90"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl font-bold">{breathingCount}</div>
                    <div className="text-sm capitalize">{breathingPhase}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-medium capitalize">{breathingPhase}</p>
                <p className="text-sm text-muted-foreground">
                  {breathingPhase === "inhale" && "Breathe in slowly through your nose"}
                  {breathingPhase === "hold" && "Hold your breath gently"}
                  {breathingPhase === "exhale" && "Breathe out slowly through your mouth"}
                </p>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={() => setShowBreathingExercise(false)}>
                  Back to Options
                </Button>
                <Button onClick={onClose}>I'm Feeling Better</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

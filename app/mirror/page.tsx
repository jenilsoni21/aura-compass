"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Lightbulb, Heart } from "lucide-react"
import Link from "next/link"
import { CrisisGuardian } from "@/components/crisis-guardian"

type AvatarMood = "happy" | "stressed" | "calm" | "anxious" | "sad"

export default function MirrorModePage() {
  const [journalText, setJournalText] = useState("")
  const [avatarMood, setAvatarMood] = useState<AvatarMood>("calm")
  const [aiSuggestion, setAiSuggestion] = useState("")
  const [showCrisisGuardian, setShowCrisisGuardian] = useState(false)

  const getAvatarContent = (mood: AvatarMood) => {
    switch (mood) {
      case "happy":
        return {
          emoji: "😊",
          bg: "bg-gradient-to-br from-green-400 to-emerald-500",
          glow: "shadow-green-400/50 shadow-2xl",
          animation: "animate-pulse",
        }
      case "stressed":
        return {
          emoji: "😰",
          bg: "bg-gradient-to-br from-gray-400 to-gray-600",
          glow: "shadow-gray-400/30 shadow-lg",
          animation: "animate-bounce",
        }
      case "anxious":
        return {
          emoji: "😟",
          bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
          glow: "shadow-yellow-400/40 shadow-xl",
          animation: "animate-spin-slow",
        }
      case "sad":
        return {
          emoji: "😢",
          bg: "bg-gradient-to-br from-blue-400 to-blue-600",
          glow: "shadow-blue-400/30 shadow-lg",
          animation: "",
        }
      case "calm":
        return {
          emoji: "😌",
          bg: "bg-gradient-to-br from-emerald-300 to-green-400",
          glow: "shadow-emerald-400/40 shadow-xl",
          animation: "animate-pulse",
        }
    }
  }

  const analyzeText = (text: string) => {
    const lowerText = text.toLowerCase()

    const crisisKeywords = [
      "kill myself",
      "end it all",
      "don't want to live",
      "suicide",
      "hurt myself",
      "self harm",
      "no point in living",
      "better off dead",
      "can't go on",
      "want to die",
    ]

    // Check for crisis indicators first
    const hasCrisisLanguage = crisisKeywords.some((keyword) => lowerText.includes(keyword))
    if (hasCrisisLanguage) {
      setShowCrisisGuardian(true)
      setAvatarMood("sad")
      setAiSuggestion(
        "I'm concerned about you. Please reach out for immediate support - you don't have to go through this alone.",
      )
      return
    }

    // Stress indicators
    if (lowerText.includes("stressed") || lowerText.includes("overwhelmed") || lowerText.includes("pressure")) {
      setAvatarMood("stressed")
      setAiSuggestion("Take a 5-minute break and breathe deeply. Try the 4-7-8 breathing technique.")
    }
    // Anxiety indicators
    else if (lowerText.includes("anxious") || lowerText.includes("worried") || lowerText.includes("nervous")) {
      setAvatarMood("anxious")
      setAiSuggestion(
        "Ground yourself with the 5-4-3-2-1 technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
      )
    }
    // Sadness indicators
    else if (lowerText.includes("sad") || lowerText.includes("down") || lowerText.includes("depressed")) {
      setAvatarMood("sad")
      setAiSuggestion(
        "Your feelings are valid. Consider reaching out to a friend or doing something kind for yourself today.",
      )
    }
    // Happy indicators
    else if (
      lowerText.includes("happy") ||
      lowerText.includes("great") ||
      lowerText.includes("excited") ||
      lowerText.includes("good")
    ) {
      setAvatarMood("happy")
      setAiSuggestion("Wonderful! Savor this positive moment and consider what contributed to these good feelings.")
    }
    // Default calm state
    else if (text.length > 10) {
      setAvatarMood("calm")
      setAiSuggestion("Thank you for sharing. Reflecting on your thoughts is a powerful step toward self-awareness.")
    } else {
      setAiSuggestion("")
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (journalText.trim()) {
        analyzeText(journalText)
      }
    }, 1000) // Analyze after 1 second of no typing

    return () => clearTimeout(timeoutId)
  }, [journalText])

  const avatarContent = getAvatarContent(avatarMood)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
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
          {/* Journaling Area */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  How are you feeling today?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Start writing about your thoughts and feelings... I'll listen and adapt to support you."
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  className="min-h-[300px] resize-none border-primary/20 focus:border-primary/50 transition-colors"
                />
                <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
                  <span>{journalText.length} characters</span>
                  <span>Your thoughts are safe and private</span>
                </div>
              </CardContent>
            </Card>

            {/* AI Suggestion Box */}
            {aiSuggestion && (
              <Card className="border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <Lightbulb className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-primary mb-2">AI Companion Suggestion</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{aiSuggestion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Avatar & Mood Display */}
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-center">Your Emotional Mirror</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Avatar
                      className={`w-24 h-24 ${avatarContent.bg} ${avatarContent.glow} ${avatarContent.animation} transition-all duration-1000 ease-in-out`}
                    >
                      <AvatarFallback className="text-4xl bg-transparent">{avatarContent.emoji}</AvatarFallback>
                    </Avatar>

                    {/* Mood-based effects */}
                    {avatarMood === "stressed" && (
                      <div className="absolute inset-0 rounded-full bg-gray-400/20 animate-ping"></div>
                    )}
                    {avatarMood === "anxious" && (
                      <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-pulse"></div>
                    )}
                  </div>
                </div>

                {/* Mood Label */}
                <div className="space-y-2">
                  <p className="text-lg font-medium capitalize">{avatarMood}</p>
                  <p className="text-sm text-muted-foreground">I'm reflecting your emotional state as you write</p>
                </div>

                {/* Mood History */}
                <div className="pt-4 border-t border-border">
                  <h4 className="text-sm font-medium mb-3">Recent Moods</h4>
                  <div className="flex justify-center gap-2">
                    {["😌", "😊", "😰", "😟"].map((emoji, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sm opacity-60"
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Save Entry
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  View Past Entries
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Breathing Exercise
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Crisis Guardian Modal */}
      <CrisisGuardian
        isVisible={showCrisisGuardian}
        onClose={() => setShowCrisisGuardian(false)}
        triggerText={journalText}
      />
    </div>
  )
}

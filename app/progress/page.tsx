"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Trophy, Star, Flame, Heart, Brain, Target, Camera, CameraOff } from "lucide-react"
import Link from "next/link"
import { DynamicAvatar } from "@/components/dynamic-avatar"
import { EmotionEnvironment } from "@/components/emotion-environment"
import { LiveCameraPreview } from "@/components/live-camera-preview"
import { CrisisGuardian } from "@/components/crisis-guardian"
import { SessionStorage, type UserProgress } from "@/lib/session-storage"
import { mapFaceEmotionToEnvironment } from "@/lib/face-detection"
import { useFaceDetection } from "@/hooks/use-face-detection"

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  earned: boolean
  earnedDate?: string
  progress?: number
  maxProgress?: number
}

interface TimelineEvent {
  date: string
  mood: "foggy" | "improving" | "stable" | "glowing"
  description: string
  milestone?: string
}

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "all">("month")
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    streaks: { journaling: 0, lastJournalDate: "" },
    achievements: [],
    totalEntries: 0,
  })
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
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
    })

    return unsubscribe
  }, [onCrisisDetected])

  const motivationalQuotes = [
    "Every small step forward is progress worth celebrating.",
    "Your mental health journey is unique and valuable.",
    "Healing isn't linear, but every day you show up matters.",
    "You're stronger than you know and braver than you feel.",
    "Progress, not perfection, is the goal.",
    "Each journal entry is a gift to your future self.",
    "Your courage to grow inspires others around you.",
  ]

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

  useEffect(() => {
    const progress = SessionStorage.getUserProgress()
    const emotion = SessionStorage.getCurrentEmotionalState()
    setUserProgress(progress)
    setCurrentEmotion(emotion)
  }, [])

  const handleFaceEmotionChange = (faceEmotion: string | null) => {
    setDetectedFaceEmotion(faceEmotion)

    if (faceEmotion && faceDetectionEnabled) {
      const mappedEmotion = mapFaceEmotionToEnvironment(faceEmotion as any)
      setCurrentEmotion(mappedEmotion)
    }
  }

  const achievements: Achievement[] = [
    {
      id: "first-entry",
      title: "First Steps",
      description: "Completed your first journal entry",
      icon: Star,
      earned: userProgress.achievements.includes("First Steps"),
      earnedDate: userProgress.achievements.includes("First Steps") ? "Recently" : undefined,
    },
    {
      id: "streak-7",
      title: "7-Day Journaling Streak",
      description: "Journaled for 7 consecutive days",
      icon: Flame,
      earned: userProgress.achievements.includes("7-Day Journaling Streak"),
      earnedDate: userProgress.achievements.includes("7-Day Journaling Streak") ? "Recently" : undefined,
      progress: Math.min(userProgress.streaks.journaling, 7),
      maxProgress: 7,
    },
    {
      id: "reflection-master",
      title: "Reflection Master",
      description: "Completed 10 journal entries",
      icon: Brain,
      earned: userProgress.achievements.includes("Reflection Master"),
      earnedDate: userProgress.achievements.includes("Reflection Master") ? "Recently" : undefined,
      progress: Math.min(userProgress.totalEntries, 10),
      maxProgress: 10,
    },
    {
      id: "journey-explorer",
      title: "Journey Explorer",
      description: "Completed 50 journal entries",
      icon: Target,
      earned: userProgress.achievements.includes("Journey Explorer"),
      earnedDate: userProgress.achievements.includes("Journey Explorer") ? "Recently" : undefined,
      progress: Math.min(userProgress.totalEntries, 50),
      maxProgress: 50,
    },
    {
      id: "monthly-warrior",
      title: "Monthly Warrior",
      description: "30-day journaling streak",
      icon: Trophy,
      earned: userProgress.achievements.includes("Monthly Warrior"),
      earnedDate: userProgress.achievements.includes("Monthly Warrior") ? "Recently" : undefined,
      progress: Math.min(userProgress.streaks.journaling, 30),
      maxProgress: 30,
    },
    {
      id: "level-5-navigator",
      title: "Level 5 Navigator",
      description: "Reached level 5 in your journey",
      icon: Heart,
      earned: userProgress.achievements.includes("Level 5 Navigator"),
      earnedDate: userProgress.achievements.includes("Level 5 Navigator") ? "Recently" : undefined,
      progress: Math.min(userProgress.level, 5),
      maxProgress: 5,
    },
  ]

  const generateTimeline = (): TimelineEvent[] => {
    const timeline: TimelineEvent[] = []

    if (userProgress.totalEntries === 0) {
      timeline.push({
        date: "Today",
        mood: "foggy",
        description: "Ready to begin your emotional wellness journey",
        milestone: "Welcome to AuraCompass!",
      })
    } else {
      const currentMood =
        currentEmotion === "calm" || currentEmotion === "happy"
          ? "glowing"
          : currentEmotion === "neutral"
            ? "stable"
            : currentEmotion === "stressed" || currentEmotion === "anxious"
              ? "improving"
              : "foggy"

      timeline.push({
        date: "Today",
        mood: currentMood,
        description: `Feeling ${currentEmotion} and continuing the journey`,
        milestone:
          userProgress.streaks.journaling > 0 ? `${userProgress.streaks.journaling}-day streak active` : undefined,
      })

      if (userProgress.achievements.includes("7-Day Journaling Streak")) {
        timeline.push({
          date: "Recently",
          mood: "stable",
          description: "Consistent journaling is building emotional awareness",
          milestone: "7-day streak achieved!",
        })
      }

      if (userProgress.achievements.includes("Reflection Master")) {
        timeline.push({
          date: "Earlier",
          mood: "improving",
          description: "Regular reflection is creating positive changes",
          milestone: "10 journal entries completed",
        })
      }

      timeline.push({
        date: "Beginning",
        mood: "foggy",
        description: "Started the journey with hope and uncertainty",
        milestone: "First journal entry",
      })
    }

    return timeline
  }

  const timelineEvents = generateTimeline()
  const nextLevelXp = userProgress.level * 100
  const currentLevelXp = (userProgress.level - 1) * 100
  const progressInLevel = userProgress.xp - currentLevelXp

  const getAvatarState = (mood: string) => {
    switch (mood) {
      case "foggy":
        return "foggy"
      case "improving":
        return "neutral"
      case "stable":
        return "calm"
      case "glowing":
        return "glowing"
      default:
        return "neutral"
    }
  }

  return (
    <EmotionEnvironment emotionalState={currentEmotion as any}>
      {faceDetectionEnabled && <LiveCameraPreview onEmotionChange={handleFaceEmotionChange} />}

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Progress Journey
              </h1>
              <p className="text-foreground/80 mt-1">Celebrating your growth and achievements</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {faceDetectionEnabled ? (
                  <Camera className="h-4 w-4 text-primary" />
                ) : (
                  <CameraOff className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm text-muted-foreground">Live Detection</span>
              </div>
              <Switch checked={faceDetectionEnabled} onCheckedChange={setFaceDetectionEnabled} />
            </div>

            <div className="flex gap-2">
              <Button
                variant={selectedPeriod === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("week")}
              >
                Week
              </Button>
              <Button
                variant={selectedPeriod === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("month")}
              >
                Month
              </Button>
              <Button
                variant={selectedPeriod === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedPeriod("all")}
              >
                All Time
              </Button>
            </div>
          </div>
        </div>

        {faceDetectionEnabled && detectedFaceEmotion && (
          <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Real-time Emotion: <span className="capitalize text-primary">{detectedFaceEmotion}</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your progress environment adapts to your current emotional state
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Level {userProgress.level} - Wellness Explorer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {progressInLevel} / {nextLevelXp - currentLevelXp} XP
                  </span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {nextLevelXp - userProgress.xp} XP to next level
                  </Badge>
                </div>
                <Progress value={(progressInLevel / (nextLevelXp - currentLevelXp)) * 100} className="h-3" />

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userProgress.streaks.journaling}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{userProgress.totalEntries}</div>
                    <div className="text-xs text-muted-foreground">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{userProgress.level}</div>
                    <div className="text-xs text-muted-foreground">Current Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Avatar Evolution Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">Watch your emotional journey unfold</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <DynamicAvatar state={getAvatarState(event.mood) as any} size="sm" />
                        {index < timelineEvents.length - 1 && (
                          <div className="w-0.5 h-8 bg-gradient-to-b from-primary/50 to-muted mt-2"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{event.date}</span>
                          <Badge variant="outline" className="text-xs capitalize">
                            {event.mood}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                        {event.milestone && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                            <Star className="h-3 w-3 mr-1" />
                            {event.milestone}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievement Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-3 rounded-lg border transition-all ${
                      achievement.earned
                        ? "bg-green-50 border-green-200"
                        : "bg-muted/30 border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          achievement.earned ? "bg-green-500" : "bg-muted-foreground/20"
                        }`}
                      >
                        <achievement.icon
                          className={`h-4 w-4 ${achievement.earned ? "text-white" : "text-muted-foreground"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>

                        {achievement.earned ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs mt-2">
                            Earned {achievement.earnedDate}
                          </Badge>
                        ) : achievement.progress !== undefined ? (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>
                                {achievement.progress} / {achievement.maxProgress}
                              </span>
                              <span>{Math.round((achievement.progress / achievement.maxProgress!) * 100)}%</span>
                            </div>
                            <Progress value={(achievement.progress / achievement.maxProgress!) * 100} className="h-1" />
                          </div>
                        ) : (
                          <Badge variant="outline" className="text-xs mt-2">
                            Locked
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/mirror">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Brain className="h-4 w-4 mr-2" />
                    Continue Journaling
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Check Wellness
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Heart className="h-4 w-4 mr-2" />
                    Support Others
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CrisisGuardian
        isVisible={showCrisisGuardian}
        onClose={() => setShowCrisisGuardian(false)}
        triggerText={crisisMessage}
        faceEmotion={detectedFaceEmotion}
      />
    </EmotionEnvironment>
  )
}

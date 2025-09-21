"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Brain,
  Moon,
  Smartphone,
  Clock,
  Activity,
  TrendingUp,
  Lightbulb,
  Target,
  Camera,
  CameraOff,
} from "lucide-react"
import Link from "next/link"
import { EmotionEnvironment } from "@/components/emotion-environment"
import { LiveCameraPreview } from "@/components/live-camera-preview"
import { SessionStorage, type WellnessMetrics } from "@/lib/session-storage"
import { mapFaceEmotionToEnvironment } from "@/lib/face-detection"

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<WellnessMetrics>({
    sleep: 7,
    screenTime: 6,
    workHours: 8,
    physicalActivity: 3,
    lastUpdated: new Date(),
  })
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false)
  const [detectedFaceEmotion, setDetectedFaceEmotion] = useState<string | null>(null)

  useEffect(() => {
    // Load saved metrics
    const savedMetrics = SessionStorage.getWellnessMetrics()
    setMetrics(savedMetrics)

    // Load current emotional state
    const savedEmotion = SessionStorage.getCurrentEmotionalState()
    setCurrentEmotion(savedEmotion)
  }, [])

  const handleFaceEmotionChange = (faceEmotion: string | null) => {
    setDetectedFaceEmotion(faceEmotion)

    if (faceEmotion && faceDetectionEnabled) {
      const mappedEmotion = mapFaceEmotionToEnvironment(faceEmotion as any)
      setCurrentEmotion(mappedEmotion)

      // Add contextual AI recommendations based on detected stress
      if (faceEmotion === "stressed" || faceEmotion === "angry") {
        // This will trigger updated recommendations in the next render
      }
    }
  }

  const getAIRecommendations = () => {
    const recommendations = []

    if (faceDetectionEnabled && detectedFaceEmotion) {
      if (detectedFaceEmotion === "stressed" || detectedFaceEmotion === "angry") {
        recommendations.push({
          icon: Brain,
          title: "Stress Detected",
          suggestion: "I notice you look stressed while browsing. Take a deep breath - you've got this.",
          priority: "high" as const,
        })
      } else if (detectedFaceEmotion === "sad") {
        recommendations.push({
          icon: Activity,
          title: "Emotional Support",
          suggestion: "Your face shows you might be feeling down. Consider reaching out to someone you trust.",
          priority: "medium" as const,
        })
      }
    }

    if (metrics.sleep < 6) {
      recommendations.push({
        icon: Moon,
        title: "Sleep Priority",
        suggestion: "Phone-free 30 min before bed. Your sleep is critically low.",
        priority: "high" as const,
      })
    } else if (metrics.sleep < 7) {
      recommendations.push({
        icon: Moon,
        title: "Sleep Improvement",
        suggestion: "Try a consistent bedtime routine to reach 7-8 hours.",
        priority: "medium" as const,
      })
    }

    if (metrics.screenTime > 8) {
      recommendations.push({
        icon: Smartphone,
        title: "Screen Time Alert",
        suggestion: "15-min offline walk. High screen time detected.",
        priority: "high" as const,
      })
    } else if (metrics.screenTime > 6) {
      recommendations.push({
        icon: Smartphone,
        title: "Digital Balance",
        suggestion: "Consider screen breaks every hour.",
        priority: "medium" as const,
      })
    }

    if (metrics.workHours > 10) {
      recommendations.push({
        icon: Clock,
        title: "Work-Life Balance",
        suggestion: "Take short breaks. Long work hours detected.",
        priority: "high" as const,
      })
    } else if (metrics.workHours > 8) {
      recommendations.push({
        icon: Clock,
        title: "Break Reminder",
        suggestion: "Schedule regular 5-minute breaks.",
        priority: "medium" as const,
      })
    }

    if (metrics.physicalActivity < 2) {
      recommendations.push({
        icon: Activity,
        title: "Movement Needed",
        suggestion: "Start with 10-minute daily walks.",
        priority: "high" as const,
      })
    } else if (metrics.physicalActivity < 4) {
      recommendations.push({
        icon: Activity,
        title: "Activity Boost",
        suggestion: "Great start! Try adding 15 more minutes.",
        priority: "medium" as const,
      })
    }

    if (recommendations.length === 0) {
      recommendations.push({
        icon: Target,
        title: "Excellent Balance",
        suggestion: "Your routine looks great! Keep up the good work.",
        priority: "low" as const,
      })
    }

    return recommendations
  }

  const calculateResilienceLevel = () => {
    let score = 0

    // Sleep score (0-25 points)
    if (metrics.sleep >= 7 && metrics.sleep <= 9) score += 25
    else if (metrics.sleep >= 6 || metrics.sleep <= 10) score += 15
    else score += 5

    // Screen time score (0-25 points) - lower is better
    if (metrics.screenTime <= 4) score += 25
    else if (metrics.screenTime <= 6) score += 15
    else if (metrics.screenTime <= 8) score += 10
    else score += 5

    // Work hours score (0-25 points)
    if (metrics.workHours >= 6 && metrics.workHours <= 8) score += 25
    else if (metrics.workHours >= 4 && metrics.workHours <= 10) score += 15
    else score += 5

    // Physical activity score (0-25 points)
    if (metrics.physicalActivity >= 4) score += 25
    else if (metrics.physicalActivity >= 3) score += 15
    else if (metrics.physicalActivity >= 2) score += 10
    else score += 5

    return Math.min(score, 100)
  }

  const handleMetricChange = (metric: keyof WellnessMetrics, value: number[]) => {
    const newMetrics = { ...metrics, [metric]: value[0], lastUpdated: new Date() }
    setMetrics(newMetrics)
    SessionStorage.saveWellnessMetrics(newMetrics)
  }

  const resilienceLevel = calculateResilienceLevel()
  const recommendations = getAIRecommendations()

  return (
    <EmotionEnvironment emotionalState={currentEmotion as any}>
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
            Routine AI Dashboard
          </h1>
          <div className="ml-auto flex items-center gap-3">
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
        </div>

        {faceDetectionEnabled && detectedFaceEmotion && (
          <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-6">
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
                    Your environment adapts to your current emotional state
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-primary/20 bg-card/80 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Resilience Level
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">{resilienceLevel}%</span>
                <Badge
                  variant="secondary"
                  className={
                    resilienceLevel >= 80
                      ? "bg-green-100 text-green-700"
                      : resilienceLevel >= 60
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }
                >
                  {resilienceLevel >= 80 ? "Excellent" : resilienceLevel >= 60 ? "Good" : "Needs Work"}
                </Badge>
              </div>
              <Progress value={resilienceLevel} className="h-3" />
              <p className="text-sm text-muted-foreground">
                Based on your sleep, screen time, work balance, and physical activity
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sleep Hours */}
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-500" />
                    Sleep Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold">{metrics.sleep}h</span>
                    </div>
                    <Slider
                      value={[metrics.sleep]}
                      onValueChange={(value) => handleMetricChange("sleep", value)}
                      max={12}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">Recommended: 7-9 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Screen Time */}
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-orange-500" />
                    Screen Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold">{metrics.screenTime}h</span>
                    </div>
                    <Slider
                      value={[metrics.screenTime]}
                      onValueChange={(value) => handleMetricChange("screenTime", value)}
                      max={16}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">Recommended: Under 6 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Work/Study Hours */}
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Work/Study Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold">{metrics.workHours}h</span>
                    </div>
                    <Slider
                      value={[metrics.workHours]}
                      onValueChange={(value) => handleMetricChange("workHours", value)}
                      max={16}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">Recommended: 6-8 hours</p>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Activity */}
              <Card className="border-primary/20 bg-card/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Physical Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <span className="text-2xl font-bold">{metrics.physicalActivity}h</span>
                    </div>
                    <Slider
                      value={[metrics.physicalActivity]}
                      onValueChange={(value) => handleMetricChange("physicalActivity", value)}
                      max={8}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-center">Recommended: 3+ hours</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg bg-white/50 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          rec.priority === "high"
                            ? "bg-red-100"
                            : rec.priority === "medium"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                        }`}
                      >
                        <rec.icon
                          className={`h-4 w-4 ${
                            rec.priority === "high"
                              ? "text-red-600"
                              : rec.priority === "medium"
                                ? "text-yellow-600"
                                : "text-green-600"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.suggestion}</p>
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
                    Journal Check-in
                  </Button>
                </Link>
                <Link href="/progress">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    View Progress
                  </Button>
                </Link>
                <Link href="/community">
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                    <Activity className="h-4 w-4 mr-2" />
                    Community Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </EmotionEnvironment>
  )
}

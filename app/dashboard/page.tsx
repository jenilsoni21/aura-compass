"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Brain, Moon, Smartphone, Clock, Activity, TrendingUp, Lightbulb, Target } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week")

  // Mock data for demonstration
  const metrics = {
    sleep: { current: 7.2, target: 8, unit: "hours", trend: "+0.3" },
    screenTime: { current: 4.8, target: 4, unit: "hours", trend: "-0.5" },
    workHours: { current: 6.5, target: 8, unit: "hours", trend: "+1.2" },
    activity: { current: 8500, target: 10000, unit: "steps", trend: "+500" },
  }

  const wellnessScores = {
    resilience: 78,
    emotionalStability: 65,
    overallWellness: 72,
  }

  const aiRecommendations = [
    {
      icon: Moon,
      title: "Sleep Optimization",
      suggestion: "Try going phone-free 30 minutes before bed to improve sleep quality.",
      priority: "high",
    },
    {
      icon: Activity,
      title: "Movement Break",
      suggestion: "Take a 10-minute walk every 2 hours to boost energy and focus.",
      priority: "medium",
    },
    {
      icon: Brain,
      title: "Mindfulness",
      suggestion: "Your stress levels seem elevated. Consider a 5-minute breathing exercise.",
      priority: "high",
    },
  ]

  const getMetricColor = (current: number, target: number) => {
    const percentage = (current / target) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return "bg-green-500"
    if (value >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Routine AI Dashboard
            </h1>
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === "week" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("week")}
            >
              This Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
          </div>
        </div>

        {/* Wellness Scores */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Resilience Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{wellnessScores.resilience}%</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +5% this week
                  </Badge>
                </div>
                <Progress value={wellnessScores.resilience} className="h-2" />
                <p className="text-xs text-muted-foreground">Your ability to bounce back from challenges</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                Emotional Stability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{wellnessScores.emotionalStability}%</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                    -2% this week
                  </Badge>
                </div>
                <Progress value={wellnessScores.emotionalStability} className="h-2" />
                <p className="text-xs text-muted-foreground">Consistency in your emotional responses</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Overall Wellness
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{wellnessScores.overallWellness}%</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    +1% this week
                  </Badge>
                </div>
                <Progress value={wellnessScores.overallWellness} className="h-2" />
                <p className="text-xs text-muted-foreground">Combined health and wellness metrics</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Metrics Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Sleep Metric */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4 text-blue-500" />
                    Sleep Quality
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${getMetricColor(metrics.sleep.current, metrics.sleep.target)}`}
                      >
                        {metrics.sleep.current}h
                      </span>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {metrics.sleep.trend}h
                      </Badge>
                    </div>
                    <Progress value={(metrics.sleep.current / metrics.sleep.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: {metrics.sleep.target} hours per night</p>
                  </div>
                </CardContent>
              </Card>

              {/* Screen Time Metric */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-orange-500" />
                    Screen Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${getMetricColor(metrics.screenTime.target, metrics.screenTime.current)}`}
                      >
                        {metrics.screenTime.current}h
                      </span>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {metrics.screenTime.trend}h
                      </Badge>
                    </div>
                    <Progress
                      value={100 - (metrics.screenTime.current / metrics.screenTime.target) * 100}
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Target: Under {metrics.screenTime.target} hours daily
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Work Hours Metric */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-500" />
                    Study/Work Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${getMetricColor(metrics.workHours.current, metrics.workHours.target)}`}
                      >
                        {metrics.workHours.current}h
                      </span>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {metrics.workHours.trend}h
                      </Badge>
                    </div>
                    <Progress value={(metrics.workHours.current / metrics.workHours.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">Target: {metrics.workHours.target} hours daily</p>
                  </div>
                </CardContent>
              </Card>

              {/* Physical Activity Metric */}
              <Card className="border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    Physical Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold ${getMetricColor(metrics.activity.current, metrics.activity.target)}`}
                      >
                        {metrics.activity.current.toLocaleString()}
                      </span>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        +{metrics.activity.trend}
                      </Badge>
                    </div>
                    <Progress value={(metrics.activity.current / metrics.activity.target) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      Target: {metrics.activity.target.toLocaleString()} steps daily
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="space-y-6">
            <Card className="border-accent/30 bg-gradient-to-br from-accent/5 to-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiRecommendations.map((rec, index) => (
                  <div key={index} className="space-y-3 p-3 rounded-lg bg-white/50 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          rec.priority === "high" ? "bg-red-100" : "bg-yellow-100"
                        }`}
                      >
                        <rec.icon
                          className={`h-4 w-4 ${rec.priority === "high" ? "text-red-600" : "text-yellow-600"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{rec.suggestion}</p>
                        <Badge
                          variant="outline"
                          className={`mt-2 text-xs ${
                            rec.priority === "high"
                              ? "border-red-200 text-red-600"
                              : "border-yellow-200 text-yellow-600"
                          }`}
                        >
                          {rec.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Moon className="h-4 w-4 mr-2" />
                  Sleep Tracker
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Activity className="h-4 w-4 mr-2" />
                  Log Activity
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Brain className="h-4 w-4 mr-2" />
                  Mood Check-in
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Trends
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Trophy, Star, Flame, Heart, Brain, Target, Quote } from "lucide-react"
import Link from "next/link"

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

  const motivationalQuotes = [
    "Every small step forward is progress worth celebrating.",
    "Your mental health journey is unique and valuable.",
    "Healing isn't linear, but every day you show up matters.",
    "You're stronger than you know and braver than you feel.",
    "Progress, not perfection, is the goal.",
  ]

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)])

  const achievements: Achievement[] = [
    {
      id: "streak-7",
      title: "7-Day Journaling Streak",
      description: "Journaled for 7 consecutive days",
      icon: Flame,
      earned: true,
      earnedDate: "3 days ago",
    },
    {
      id: "first-entry",
      title: "First Steps",
      description: "Completed your first journal entry",
      icon: Star,
      earned: true,
      earnedDate: "2 weeks ago",
    },
    {
      id: "community-support",
      title: "Community Helper",
      description: "Supported 5 community members",
      icon: Heart,
      earned: true,
      earnedDate: "1 week ago",
    },
    {
      id: "mindful-moments",
      title: "Mindful Moments",
      description: "Completed 10 breathing exercises",
      icon: Brain,
      earned: false,
      progress: 7,
      maxProgress: 10,
    },
    {
      id: "consistency-champion",
      title: "Consistency Champion",
      description: "30-day journaling streak",
      icon: Trophy,
      earned: false,
      progress: 12,
      maxProgress: 30,
    },
    {
      id: "wellness-warrior",
      title: "Wellness Warrior",
      description: "Maintained 80% wellness score for a month",
      icon: Target,
      earned: false,
      progress: 18,
      maxProgress: 30,
    },
  ]

  const timelineEvents: TimelineEvent[] = [
    {
      date: "Today",
      mood: "glowing",
      description: "Feeling more balanced and self-aware",
      milestone: "Completed breathing exercise",
    },
    {
      date: "3 days ago",
      mood: "stable",
      description: "Consistent journaling is helping with clarity",
      milestone: "7-day streak achieved!",
    },
    {
      date: "1 week ago",
      mood: "improving",
      description: "Started connecting with the community",
    },
    {
      date: "2 weeks ago",
      mood: "foggy",
      description: "Beginning the journey, feeling uncertain but hopeful",
      milestone: "First journal entry",
    },
  ]

  const getMoodAvatar = (mood: string) => {
    switch (mood) {
      case "foggy":
        return {
          emoji: "😶‍🌫️",
          bg: "bg-gradient-to-br from-gray-300 to-gray-500",
          glow: "shadow-gray-300/30",
        }
      case "improving":
        return {
          emoji: "🙂",
          bg: "bg-gradient-to-br from-yellow-300 to-yellow-500",
          glow: "shadow-yellow-300/40",
        }
      case "stable":
        return {
          emoji: "😌",
          bg: "bg-gradient-to-br from-blue-300 to-blue-500",
          glow: "shadow-blue-300/50",
        }
      case "glowing":
        return {
          emoji: "✨",
          bg: "bg-gradient-to-br from-green-400 to-emerald-500",
          glow: "shadow-green-400/60 shadow-2xl",
        }
      default:
        return {
          emoji: "😌",
          bg: "bg-gradient-to-br from-emerald-300 to-green-400",
          glow: "shadow-emerald-400/40",
        }
    }
  }

  const overallProgress = {
    level: 3,
    xp: 1250,
    nextLevelXp: 2000,
    streakDays: 12,
    totalEntries: 28,
    wellnessScore: 78,
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
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Your Progress Journey
              </h1>
              <p className="text-muted-foreground mt-1">Celebrating your growth and achievements</p>
            </div>
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

        {/* Motivational Quote */}
        <Card className="mb-8 border-accent/30 bg-gradient-to-r from-accent/5 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Quote className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-primary italic">"{currentQuote}"</p>
                <p className="text-sm text-muted-foreground mt-1">Daily Inspiration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Level & XP */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Level {overallProgress.level} - Wellness Explorer
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {overallProgress.xp} / {overallProgress.nextLevelXp} XP
                  </span>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {overallProgress.nextLevelXp - overallProgress.xp} XP to next level
                  </Badge>
                </div>
                <Progress value={(overallProgress.xp / overallProgress.nextLevelXp) * 100} className="h-3" />

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{overallProgress.streakDays}</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{overallProgress.totalEntries}</div>
                    <div className="text-xs text-muted-foreground">Total Entries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{overallProgress.wellnessScore}%</div>
                    <div className="text-xs text-muted-foreground">Wellness Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Visualization */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Avatar Evolution Timeline</CardTitle>
                <p className="text-sm text-muted-foreground">Watch your emotional journey unfold</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {timelineEvents.map((event, index) => {
                    const avatarContent = getMoodAvatar(event.mood)
                    return (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <Avatar
                            className={`w-12 h-12 ${avatarContent.bg} ${avatarContent.glow} transition-all duration-500`}
                          >
                            <AvatarFallback className="text-lg bg-transparent">{avatarContent.emoji}</AvatarFallback>
                          </Avatar>
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
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  Achievements
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
                              <span>{Math.round((achievement.progress! / achievement.maxProgress!) * 100)}%</span>
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

            {/* Quick Stats */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-sm">This Week's Highlights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Journal Entries</span>
                  <Badge variant="secondary">5 entries</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Community Interactions</span>
                  <Badge variant="secondary">3 supports</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Breathing Exercises</span>
                  <Badge variant="secondary">2 sessions</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mood Improvement</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    +15%
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

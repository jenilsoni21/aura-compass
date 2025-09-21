"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles, BookOpen, TrendingUp, Trophy } from "lucide-react"
import Link from "next/link"

type AvatarMood = "happy" | "stressed" | "calm"

export default function HomePage() {
  const [avatarMood, setAvatarMood] = useState<AvatarMood>("calm")

  const getAvatarContent = (mood: AvatarMood) => {
    switch (mood) {
      case "happy":
        return { emoji: "😊", bg: "bg-gradient-to-br from-green-400 to-emerald-500", glow: "shadow-green-400/50" }
      case "stressed":
        return { emoji: "😰", bg: "bg-gradient-to-br from-gray-400 to-gray-600", glow: "shadow-gray-400/30" }
      case "calm":
        return { emoji: "😌", bg: "bg-gradient-to-br from-emerald-300 to-green-400", glow: "shadow-emerald-400/40" }
    }
  }

  const avatarContent = getAvatarContent(avatarMood)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse">
              AuraCompass
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Your mirror, mentor, and mental co-pilot.
            </p>
          </div>

          {/* Avatar */}
          <div className="flex justify-center py-8">
            <div className="relative">
              <Avatar
                className={`w-32 h-32 md:w-40 md:h-40 ${avatarContent.bg} ${avatarContent.glow} shadow-2xl transition-all duration-700 ease-in-out hover:scale-110`}
              >
                <AvatarFallback className="text-6xl md:text-7xl bg-transparent">{avatarContent.emoji}</AvatarFallback>
              </Avatar>

              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-spin-slow blur-sm"></div>
            </div>
          </div>

          {/* Mood Demo Buttons */}
          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAvatarMood("happy")}
              className="hover:bg-green-50 hover:border-green-300"
            >
              Happy
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAvatarMood("stressed")}
              className="hover:bg-gray-50 hover:border-gray-300"
            >
              Stressed
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAvatarMood("calm")}
              className="hover:bg-emerald-50 hover:border-emerald-300"
            >
              Calm
            </Button>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/mirror">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <BookOpen className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                Start Journaling
              </Button>
            </Link>
            <Link href="/progress">
              <Button
                variant="outline"
                size="lg"
                className="border-primary/50 hover:bg-primary/5 hover:border-primary transition-all duration-300 group bg-transparent"
              >
                <Trophy className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                View Progress
              </Button>
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <Link href="/mirror">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Mirror Mode</h3>
                <p className="text-muted-foreground text-sm">
                  Reflect on your emotions with AI-guided journaling that adapts to your mood.
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Routine AI</h3>
                <p className="text-muted-foreground text-sm">
                  Get personalized insights and recommendations for better mental wellness.
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Peer Support</h3>
                <p className="text-muted-foreground text-sm">
                  Connect with a supportive community in a safe, moderated environment.
                </p>
              </div>
            </Card>
          </Link>

          <Link href="/progress">
            <Card className="p-6 hover:shadow-lg transition-all duration-300 border-primary/10 hover:border-primary/30 group cursor-pointer">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold">Progress Journey</h3>
                <p className="text-muted-foreground text-sm">
                  Track your growth with achievements, streaks, and visual progress.
                </p>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}

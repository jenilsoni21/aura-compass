"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useEffect, useState } from "react"

type AvatarState = "neutral" | "stressed" | "anxious" | "calm" | "happy" | "foggy" | "glowing"

interface DynamicAvatarProps {
  state: AvatarState
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function DynamicAvatar({ state, size = "md", className = "" }: DynamicAvatarProps) {
  const [currentState, setCurrentState] = useState<AvatarState>("neutral")

  useEffect(() => {
    setCurrentState(state)
  }, [state])

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "w-16 h-16"
      case "md":
        return "w-24 h-24"
      case "lg":
        return "w-32 h-32"
      case "xl":
        return "w-40 h-40"
      default:
        return "w-24 h-24"
    }
  }

  const getAvatarContent = (state: AvatarState) => {
    switch (state) {
      case "happy":
        return {
          emoji: "😊",
          bg: "bg-gradient-to-br from-yellow-400 to-orange-500",
          glow: "shadow-yellow-400/50 shadow-2xl",
          animation: "animate-bounce",
        }
      case "stressed":
        return {
          emoji: "😰",
          bg: "bg-gradient-to-br from-gray-400 to-gray-600",
          glow: "shadow-gray-400/30 shadow-lg",
          animation: "animate-pulse",
        }
      case "anxious":
        return {
          emoji: "😟",
          bg: "bg-gradient-to-br from-yellow-600 to-orange-700",
          glow: "shadow-yellow-600/40 shadow-lg",
          animation: "animate-bounce",
        }
      case "calm":
        return {
          emoji: "😌",
          bg: "bg-gradient-to-br from-emerald-300 to-green-400",
          glow: "shadow-emerald-400/40 shadow-xl",
          animation: "",
        }
      case "foggy":
        return {
          emoji: "😶‍🌫️",
          bg: "bg-gradient-to-br from-gray-500 to-gray-700",
          glow: "shadow-gray-500/20 shadow-sm",
          animation: "animate-pulse opacity-70",
        }
      case "glowing":
        return {
          emoji: "✨",
          bg: "bg-gradient-to-br from-purple-400 to-pink-500",
          glow: "shadow-purple-400/60 shadow-2xl",
          animation: "animate-pulse",
        }
      default:
        return {
          emoji: "😐",
          bg: "bg-gradient-to-br from-muted to-muted-foreground/20",
          glow: "shadow-muted/30 shadow-md",
          animation: "",
        }
    }
  }

  const avatarContent = getAvatarContent(currentState)
  const sizeClasses = getSizeClasses(size)

  return (
    <div className="relative">
      <Avatar
        className={`${sizeClasses} ${avatarContent.bg} ${avatarContent.glow} ${avatarContent.animation} transition-all duration-700 ease-in-out hover:scale-110 ${className}`}
      >
        <AvatarFallback className="text-4xl bg-transparent">{avatarContent.emoji}</AvatarFallback>
      </Avatar>

      {/* Glowing ring effect for special states */}
      {(currentState === "glowing" || currentState === "calm") && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 animate-spin-slow blur-sm"></div>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { useEffect, useState } from "react"

type EmotionalState = "neutral" | "stressed" | "anxious" | "calm" | "resilient"

interface EmotionEnvironmentProps {
  emotionalState: EmotionalState
  children: React.ReactNode
}

export function EmotionEnvironment({ emotionalState, children }: EmotionEnvironmentProps) {
  const [currentState, setCurrentState] = useState<EmotionalState>("neutral")

  useEffect(() => {
    setCurrentState(emotionalState)
  }, [emotionalState])

  const getEnvironmentStyles = (state: EmotionalState) => {
    switch (state) {
      case "stressed":
        return {
          background: "bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900",
          overlay: "bg-gradient-to-t from-red-900/20 via-transparent to-gray-800/30",
          animation: "animate-pulse",
        }
      case "anxious":
        return {
          background: "bg-gradient-to-br from-gray-600 via-gray-500 to-gray-700",
          overlay: "bg-gradient-to-t from-yellow-800/20 via-transparent to-gray-600/40",
          animation: "animate-bounce",
        }
      case "calm":
        return {
          background: "bg-gradient-to-br from-emerald-200 via-green-300 to-teal-400",
          overlay: "bg-gradient-to-t from-green-400/30 via-transparent to-emerald-200/20",
          animation: "",
        }
      case "resilient":
        return {
          background: "bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400",
          overlay: "bg-gradient-to-t from-purple-500/20 via-transparent to-orange-300/30",
          animation: "animate-pulse",
        }
      default:
        return {
          background: "bg-gradient-to-br from-background via-muted/30 to-background",
          overlay: "bg-transparent",
          animation: "",
        }
    }
  }

  const styles = getEnvironmentStyles(currentState)

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${styles.background}`}>
      <div className={`absolute inset-0 ${styles.overlay} ${styles.animation} transition-all duration-1000`} />
      <div className="relative z-10">{children}</div>

      {/* Environmental effects */}
      {currentState === "stressed" && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white/10 rounded-full animate-ping"
                style={{
                  left: `${20 + i * 30}%`,
                  top: `${10 + i * 20}%`,
                  width: `${10 + i * 5}px`,
                  height: `${10 + i * 5}px`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {currentState === "calm" && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-300/40 rounded-full animate-bounce"
              style={{
                left: `${10 + i * 20}%`,
                top: "-10px",
                animationDelay: `${i * 0.8}s`,
                animationDuration: "3s",
                animationIterationCount: "infinite",
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

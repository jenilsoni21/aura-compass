"use client"

import * as faceapi from "face-api.js"

export type FaceEmotion = "happy" | "sad" | "angry" | "surprised" | "neutral" | "fear" | "disgust"

export interface EmotionDetectionResult {
  emotion: FaceEmotion
  confidence: number
  timestamp: number
}

export interface FaceDetectionState {
  isEnabled: boolean
  isLoading: boolean
  error: string | null
  currentEmotion: FaceEmotion | null
  confidence: number
  recentEmotions: EmotionDetectionResult[]
}

class FaceDetectionService {
  private isInitialized = false
  private videoElement: HTMLVideoElement | null = null
  private stream: MediaStream | null = null
  private detectionInterval: NodeJS.Timeout | null = null
  private callbacks: ((result: EmotionDetectionResult) => void)[] = []

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      const MODEL_URL = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ])

      this.isInitialized = true
      console.log("[v0] Face detection models loaded successfully")
    } catch (error) {
      console.error("Failed to initialize face detection:", error)
      throw new Error("Failed to load face detection models")
    }
  }

  async startCamera(): Promise<HTMLVideoElement> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      })

      this.videoElement = document.createElement("video")
      this.videoElement.srcObject = this.stream
      this.videoElement.autoplay = true
      this.videoElement.muted = true
      this.videoElement.playsInline = true

      return new Promise((resolve, reject) => {
        if (!this.videoElement) {
          reject(new Error("Video element not created"))
          return
        }

        this.videoElement.onloadedmetadata = () => {
          console.log("[v0] Camera started successfully")
          resolve(this.videoElement!)
        }

        this.videoElement.onerror = () => {
          reject(new Error("Failed to load video stream"))
        }
      })
    } catch (error) {
      console.error("Failed to start camera:", error)
      throw new Error("Camera access denied or not available")
    }
  }

  startDetection(intervalMs = 2000): void {
    if (!this.videoElement || this.detectionInterval) return

    this.detectionInterval = setInterval(async () => {
      await this.detectEmotion()
    }, intervalMs)
  }

  stopDetection(): void {
    if (this.detectionInterval) {
      clearInterval(this.detectionInterval)
      this.detectionInterval = null
    }
  }

  stopCamera(): void {
    this.stopDetection()

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop())
      this.stream = null
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null
      this.videoElement = null
    }
  }

  private async detectEmotion(): Promise<void> {
    if (!this.videoElement || !this.isInitialized) return

    try {
      const detections = await faceapi
        .detectAllFaces(this.videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()

      if (detections.length > 0) {
        // Use the largest face (closest to camera)
        const detection = detections.reduce((prev, current) =>
          prev.detection.box.area > current.detection.box.area ? prev : current,
        )

        const expressions = detection.expressions
        const dominantEmotion = this.getDominantEmotion(expressions)
        const confidence = expressions[dominantEmotion as keyof typeof expressions]

        const result: EmotionDetectionResult = {
          emotion: this.mapToFaceEmotion(dominantEmotion),
          confidence,
          timestamp: Date.now(),
        }

        console.log("[v0] Detected emotion:", result.emotion, "confidence:", result.confidence.toFixed(2))

        // Notify all callbacks
        this.callbacks.forEach((callback) => callback(result))
      }
    } catch (error) {
      console.error("Face detection error:", error)
    }
  }

  private getDominantEmotion(expressions: faceapi.FaceExpressions): string {
    let maxEmotion = "neutral"
    let maxValue = 0

    Object.entries(expressions).forEach(([emotion, value]) => {
      if (value > maxValue) {
        maxValue = value
        maxEmotion = emotion
      }
    })

    return maxEmotion
  }

  private mapToFaceEmotion(emotion: string): FaceEmotion {
    const mapping: Record<string, FaceEmotion> = {
      happy: "happy",
      sad: "sad",
      angry: "angry",
      surprised: "surprised",
      neutral: "neutral",
      fearful: "fear",
      disgusted: "disgust",
    }

    return mapping[emotion] || "neutral"
  }

  onEmotionDetected(callback: (result: EmotionDetectionResult) => void): () => void {
    this.callbacks.push(callback)

    // Return unsubscribe function
    return () => {
      const index = this.callbacks.indexOf(callback)
      if (index > -1) {
        this.callbacks.splice(index, 1)
      }
    }
  }

  getVideoElement(): HTMLVideoElement | null {
    return this.videoElement
  }

  isActive(): boolean {
    return this.videoElement !== null && this.detectionInterval !== null
  }
}

// Singleton instance
export const faceDetectionService = new FaceDetectionService()

// Utility function to get majority emotion from recent detections
export function getMajorityEmotion(emotions: EmotionDetectionResult[], windowMs = 10000): FaceEmotion | null {
  const now = Date.now()
  const recentEmotions = emotions.filter((e) => now - e.timestamp < windowMs)

  if (recentEmotions.length === 0) return null

  const emotionCounts: Record<FaceEmotion, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    surprised: 0,
    neutral: 0,
    fear: 0,
    disgust: 0,
  }

  recentEmotions.forEach((result) => {
    emotionCounts[result.emotion]++
  })

  let maxEmotion: FaceEmotion = "neutral"
  let maxCount = 0

  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    if (count > maxCount) {
      maxCount = count
      maxEmotion = emotion as FaceEmotion
    }
  })

  return maxEmotion
}

// Map face emotions to avatar states
export function mapFaceEmotionToAvatarState(emotion: FaceEmotion): string {
  const mapping: Record<FaceEmotion, string> = {
    happy: "happy",
    sad: "foggy",
    angry: "stressed",
    surprised: "glowing",
    neutral: "neutral",
    fear: "anxious",
    disgust: "stressed",
  }

  return mapping[emotion] || "neutral"
}

// Map face emotions to environment states
export function mapFaceEmotionToEnvironment(emotion: FaceEmotion): string {
  const mapping: Record<FaceEmotion, string> = {
    happy: "calm",
    sad: "stressed",
    angry: "stressed",
    surprised: "resilient",
    neutral: "neutral",
    fear: "anxious",
    disgust: "anxious",
  }

  return mapping[emotion] || "neutral"
}

export function detectCrisisFromFaceEmotions(emotions: EmotionDetectionResult[], durationMs = 300000): boolean {
  const now = Date.now()
  const recentEmotions = emotions.filter((e) => now - e.timestamp < durationMs)

  if (recentEmotions.length < 5) return false // Need at least 5 detections

  // Count negative emotions in the recent window
  const negativeEmotions = recentEmotions.filter(
    (e) => e.emotion === "sad" || e.emotion === "angry" || e.emotion === "fear" || e.emotion === "disgust",
  )

  // If 80% or more of recent emotions are negative, trigger crisis detection
  const negativeRatio = negativeEmotions.length / recentEmotions.length

  // Also check for prolonged sadness specifically
  const prolongedSadness = recentEmotions.filter((e) => e.emotion === "sad").length >= 4

  return negativeRatio >= 0.8 || prolongedSadness
}

export function getCrisisInterventionMessage(dominantEmotion: FaceEmotion): string {
  const messages: Record<FaceEmotion, string> = {
    sad: "I've noticed you've been looking very sad for a while. Your wellbeing matters deeply to me.",
    angry: "I can see you've been feeling intense anger. Let's find healthy ways to process these feelings.",
    fear: "I notice signs of fear or distress in your expressions. You're safe here, and help is available.",
    disgust: "I can see you're experiencing difficult emotions. Please know that you're not alone in this.",
    happy: "I'm glad to see positive emotions, but I'm still concerned about your recent distress.",
    surprised: "I notice mixed emotions. It's important we address any underlying concerns.",
    neutral: "Even though you appear calm now, I'm concerned about your recent emotional state.",
  }

  return messages[dominantEmotion] || messages.neutral
}

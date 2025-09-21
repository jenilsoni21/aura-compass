"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  faceDetectionService,
  type EmotionDetectionResult,
  type FaceDetectionState,
  getMajorityEmotion,
  detectCrisisFromFaceEmotions,
  getCrisisInterventionMessage,
} from "@/lib/face-detection"

export function useFaceDetection() {
  const [state, setState] = useState<FaceDetectionState>({
    isEnabled: false,
    isLoading: false,
    error: null,
    currentEmotion: null,
    confidence: 0,
    recentEmotions: [],
  })

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const unsubscribeRef = useRef<(() => void) | null>(null)
  const crisisCallbackRef = useRef<((message: string, emotion: string) => void) | null>(null)

  const handleEmotionDetected = useCallback((result: EmotionDetectionResult) => {
    setState((prev) => {
      const newRecentEmotions = [...prev.recentEmotions, result]
        .slice(-20) // Keep last 20 detections for crisis analysis
        .filter((e) => Date.now() - e.timestamp < 600000) // Keep only last 10 minutes

      const majorityEmotion = getMajorityEmotion(newRecentEmotions, 10000)

      const isCrisis = detectCrisisFromFaceEmotions(newRecentEmotions)
      if (isCrisis && crisisCallbackRef.current) {
        const dominantEmotion = majorityEmotion || result.emotion
        const message = getCrisisInterventionMessage(dominantEmotion)
        crisisCallbackRef.current(message, dominantEmotion)
      }

      return {
        ...prev,
        currentEmotion: majorityEmotion || result.emotion,
        confidence: result.confidence,
        recentEmotions: newRecentEmotions,
      }
    })
  }, [])

  const startDetection = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    try {
      const videoElement = await faceDetectionService.startCamera()
      videoRef.current = videoElement

      // Subscribe to emotion detection results
      unsubscribeRef.current = faceDetectionService.onEmotionDetected(handleEmotionDetected)

      // Start detection with 2-3 FPS (every 2-3 seconds)
      faceDetectionService.startDetection(2500)

      setState((prev) => ({
        ...prev,
        isEnabled: true,
        isLoading: false,
        error: null,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isEnabled: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }))
    }
  }, [handleEmotionDetected])

  const stopDetection = useCallback(() => {
    faceDetectionService.stopCamera()

    if (unsubscribeRef.current) {
      unsubscribeRef.current()
      unsubscribeRef.current = null
    }

    videoRef.current = null

    setState({
      isEnabled: false,
      isLoading: false,
      error: null,
      currentEmotion: null,
      confidence: 0,
      recentEmotions: [],
    })
  }, [])

  const toggleDetection = useCallback(() => {
    if (state.isEnabled) {
      stopDetection()
    } else {
      startDetection()
    }
  }, [state.isEnabled, startDetection, stopDetection])

  const onCrisisDetected = useCallback((callback: (message: string, emotion: string) => void) => {
    crisisCallbackRef.current = callback

    return () => {
      crisisCallbackRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopDetection()
    }
  }, [stopDetection])

  return {
    ...state,
    videoElement: videoRef.current,
    startDetection,
    stopDetection,
    toggleDetection,
    onCrisisDetected,
    isActive: faceDetectionService.isActive(),
  }
}

export type EmotionalState = "neutral" | "stressed" | "anxious" | "calm" | "happy" | "resilient"

export function detectEmotion(text: string): EmotionalState {
  const lowerText = text.toLowerCase()

  // Crisis keywords (handled separately)
  const crisisKeywords = ["suicide", "die", "give up", "end it all", "kill myself", "want to die"]
  if (crisisKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "stressed" // Will trigger crisis intervention
  }

  // Stress indicators
  const stressKeywords = ["stressed", "overwhelmed", "tired", "exhausted", "pressure", "burden", "can't cope"]
  if (stressKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "stressed"
  }

  // Anxiety indicators
  const anxietyKeywords = ["anxious", "nervous", "worried", "panic", "fear", "scared", "uncertain"]
  if (anxietyKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "anxious"
  }

  // Positive/calm indicators
  const calmKeywords = ["calm", "peaceful", "relaxed", "content", "serene", "balanced", "centered"]
  if (calmKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "calm"
  }

  // Happy indicators
  const happyKeywords = ["happy", "joy", "excited", "great", "amazing", "wonderful", "fantastic", "love"]
  if (happyKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "happy"
  }

  // Resilient indicators
  const resilientKeywords = ["strong", "confident", "determined", "motivated", "empowered", "capable"]
  if (resilientKeywords.some((keyword) => lowerText.includes(keyword))) {
    return "resilient"
  }

  return "neutral"
}

export function detectCrisis(text: string): boolean {
  const lowerText = text.toLowerCase()
  const crisisKeywords = [
    "suicide",
    "die",
    "give up",
    "end it all",
    "kill myself",
    "want to die",
    "no point",
    "worthless",
  ]
  return crisisKeywords.some((keyword) => lowerText.includes(keyword))
}

export function getEmotionAdvice(emotion: EmotionalState): string {
  switch (emotion) {
    case "stressed":
      return "Take a deep breath. Try a 5-minute break and remember: this feeling is temporary."
    case "anxious":
      return "Ground yourself with the 5-4-3-2-1 technique: 5 things you see, 4 you hear, 3 you touch, 2 you smell, 1 you taste."
    case "calm":
      return "Beautiful! You're in a peaceful state. Consider journaling about what's working well for you."
    case "happy":
      return "Wonderful energy! Share this positivity - maybe reach out to someone you care about."
    case "resilient":
      return "You're showing incredible strength. Remember this feeling for challenging times ahead."
    default:
      return "Take a moment to check in with yourself. How are you really feeling right now?"
  }
}

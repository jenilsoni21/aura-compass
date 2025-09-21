export interface JournalEntry {
  id: string
  content: string
  emotion: string
  timestamp: Date
  aiAdvice: string
}

export interface UserProgress {
  level: number
  xp: number
  streaks: {
    journaling: number
    lastJournalDate: string
  }
  achievements: string[]
  totalEntries: number
}

export interface WellnessMetrics {
  sleep: number
  screenTime: number
  workHours: number
  physicalActivity: number
  lastUpdated: Date
}

export class SessionStorage {
  static getJournalEntries(): JournalEntry[] {
    if (typeof window === "undefined") return []
    const entries = localStorage.getItem("auracompass_journal_entries")
    return entries ? JSON.parse(entries) : []
  }

  static saveJournalEntry(entry: JournalEntry): void {
    if (typeof window === "undefined") return
    const entries = this.getJournalEntries()
    entries.push(entry)
    localStorage.setItem("auracompass_journal_entries", JSON.stringify(entries))

    // Update progress
    this.updateProgress()
  }

  static getUserProgress(): UserProgress {
    if (typeof window === "undefined") return this.getDefaultProgress()
    const progress = localStorage.getItem("auracompass_user_progress")
    return progress ? JSON.parse(progress) : this.getDefaultProgress()
  }

  static updateProgress(): void {
    if (typeof window === "undefined") return
    const progress = this.getUserProgress()
    const entries = this.getJournalEntries()

    // Update total entries and XP
    progress.totalEntries = entries.length
    progress.xp = entries.length * 10
    progress.level = Math.floor(progress.xp / 100) + 1

    // Update journaling streak
    const today = new Date().toDateString()
    const lastEntry = entries[entries.length - 1]

    if (lastEntry && new Date(lastEntry.timestamp).toDateString() === today) {
      if (progress.streaks.lastJournalDate !== today) {
        progress.streaks.journaling += 1
        progress.streaks.lastJournalDate = today
      }
    }

    // Update achievements
    this.updateAchievements(progress)

    localStorage.setItem("auracompass_user_progress", JSON.stringify(progress))
  }

  static updateAchievements(progress: UserProgress): void {
    const achievements = new Set(progress.achievements)

    if (progress.streaks.journaling >= 7) achievements.add("7-Day Journaling Streak")
    if (progress.streaks.journaling >= 30) achievements.add("Monthly Warrior")
    if (progress.totalEntries >= 10) achievements.add("Reflection Master")
    if (progress.totalEntries >= 50) achievements.add("Journey Explorer")
    if (progress.level >= 5) achievements.add("Level 5 Navigator")

    progress.achievements = Array.from(achievements)
  }

  static getWellnessMetrics(): WellnessMetrics {
    if (typeof window === "undefined") return this.getDefaultMetrics()
    const metrics = localStorage.getItem("auracompass_wellness_metrics")
    return metrics ? JSON.parse(metrics) : this.getDefaultMetrics()
  }

  static saveWellnessMetrics(metrics: WellnessMetrics): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auracompass_wellness_metrics", JSON.stringify(metrics))
  }

  static getCurrentEmotionalState(): string {
    if (typeof window === "undefined") return "neutral"
    return localStorage.getItem("auracompass_current_emotion") || "neutral"
  }

  static setCurrentEmotionalState(emotion: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auracompass_current_emotion", emotion)
  }

  private static getDefaultProgress(): UserProgress {
    return {
      level: 1,
      xp: 0,
      streaks: {
        journaling: 0,
        lastJournalDate: "",
      },
      achievements: [],
      totalEntries: 0,
    }
  }

  private static getDefaultMetrics(): WellnessMetrics {
    return {
      sleep: 7,
      screenTime: 6,
      workHours: 8,
      physicalActivity: 3,
      lastUpdated: new Date(),
    }
  }
}

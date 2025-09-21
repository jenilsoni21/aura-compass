"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Shield,
  Users,
  Send,
  Bot,
  CheckCircle,
  AlertTriangle,
  Camera,
  CameraOff,
} from "lucide-react"
import Link from "next/link"
import { EmotionEnvironment } from "@/components/emotion-environment"
import { LiveCameraPreview } from "@/components/live-camera-preview"
import { CrisisGuardian } from "@/components/crisis-guardian"
import { SessionStorage } from "@/lib/session-storage"
import { mapFaceEmotionToEnvironment } from "@/lib/face-detection"
import { useFaceDetection } from "@/hooks/use-face-detection"

interface Post {
  id: string
  content: string
  timestamp: string
  mood: "struggling" | "hopeful" | "grateful" | "anxious" | "lonely" | "tired"
  likes: number
  aiResponse?: string
  isModerated: boolean
  hasWarning?: boolean
}

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [currentEmotion, setCurrentEmotion] = useState("neutral")
  const [faceDetectionEnabled, setFaceDetectionEnabled] = useState(false)
  const [detectedFaceEmotion, setDetectedFaceEmotion] = useState<string | null>(null)
  const [showCrisisGuardian, setShowCrisisGuardian] = useState(false)
  const [crisisMessage, setCrisisMessage] = useState("")
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content: "I feel so alone today. Nobody seems to understand what I'm going through.",
      timestamp: "2 hours ago",
      mood: "lonely",
      likes: 12,
      aiResponse: "You're not alone 💙. This community sees you and supports you.",
      isModerated: true,
    },
    {
      id: "2",
      content: "I'm so tired and stressed from work. Everything feels overwhelming.",
      timestamp: "4 hours ago",
      mood: "tired",
      likes: 18,
      aiResponse: "Rest and recharge — you deserve it. Take things one step at a time.",
      isModerated: true,
    },
    {
      id: "3",
      content: "Had a breakthrough in therapy today. Feeling hopeful about my healing journey.",
      timestamp: "6 hours ago",
      mood: "hopeful",
      likes: 35,
      aiResponse: "Your courage to heal is inspiring. Keep taking those brave steps forward.",
      isModerated: true,
    },
    {
      id: "4",
      content: "Grateful for this community. You all make me feel less alone in my struggles.",
      timestamp: "8 hours ago",
      mood: "grateful",
      likes: 28,
      aiResponse: "Your gratitude creates ripples of positivity. Thank you for being here.",
      isModerated: true,
    },
  ])

  const { onCrisisDetected } = useFaceDetection()

  useEffect(() => {
    const unsubscribe = onCrisisDetected((message: string, emotion: string) => {
      setCrisisMessage(message)
      setShowCrisisGuardian(true)
      setCurrentEmotion("stressed")
    })

    return unsubscribe
  }, [onCrisisDetected])

  useEffect(() => {
    const savedEmotion = SessionStorage.getCurrentEmotionalState()
    setCurrentEmotion(savedEmotion)
  }, [])

  const handleFaceEmotionChange = (faceEmotion: string | null) => {
    setDetectedFaceEmotion(faceEmotion)

    if (faceEmotion && faceDetectionEnabled) {
      const mappedEmotion = mapFaceEmotionToEnvironment(faceEmotion as any)
      setCurrentEmotion(mappedEmotion)
    }
  }

  const generateAIResponse = (content: string): string => {
    const lowerContent = content.toLowerCase()

    let baseResponse = ""

    const crisisKeywords = ["kill myself", "end it all", "want to die", "suicide", "hurt myself", "no point living"]
    if (crisisKeywords.some((keyword) => lowerContent.includes(keyword))) {
      setShowCrisisGuardian(true)
      setCrisisMessage("Crisis language detected in community post")
      return "I'm very concerned about you. Please reach out for immediate support - you don't have to go through this alone."
    }

    if (lowerContent.includes("alone") || lowerContent.includes("lonely") || lowerContent.includes("isolated")) {
      baseResponse = "You're not alone 💙. This community sees you and supports you."
    } else if (lowerContent.includes("sad") || lowerContent.includes("depressed") || lowerContent.includes("down")) {
      baseResponse = "Your feelings are valid. Sending you strength and virtual hugs 🤗."
    } else if (
      lowerContent.includes("tired") ||
      lowerContent.includes("stress") ||
      lowerContent.includes("overwhelmed")
    ) {
      baseResponse = "Rest and recharge — you deserve it. Take things one step at a time."
    } else if (
      lowerContent.includes("anxious") ||
      lowerContent.includes("worried") ||
      lowerContent.includes("nervous")
    ) {
      baseResponse = "Take a deep breath. You're stronger than your anxiety, and we believe in you."
    } else if (lowerContent.includes("better") || lowerContent.includes("hope") || lowerContent.includes("progress")) {
      baseResponse = "Your resilience is inspiring. Keep moving forward, one day at a time."
    } else if (
      lowerContent.includes("grateful") ||
      lowerContent.includes("thankful") ||
      lowerContent.includes("appreciate")
    ) {
      baseResponse = "Your gratitude creates ripples of positivity. Thank you for sharing your light."
    } else {
      baseResponse = "Thank you for sharing with our community. Your openness helps create a safe space for everyone."
    }

    if (faceDetectionEnabled && detectedFaceEmotion) {
      if (detectedFaceEmotion === "stressed" && !lowerContent.includes("stress")) {
        baseResponse += " I also notice you might be feeling stressed right now - take a moment to breathe."
      } else if (detectedFaceEmotion === "sad" && !lowerContent.includes("sad")) {
        baseResponse += " Your face shows you're going through a tough time - we're here for you."
      }
    }

    return baseResponse
  }

  const checkForToxicContent = (content: string): boolean => {
    const toxicKeywords = [
      "hate",
      "stupid",
      "worthless",
      "pathetic",
      "loser",
      "failure",
      "kill yourself",
      "die",
      "harm",
      "violence",
    ]

    const lowerContent = content.toLowerCase()
    return toxicKeywords.some((keyword) => lowerContent.includes(keyword))
  }

  const getMoodFromContent = (content: string): Post["mood"] => {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes("alone") || lowerContent.includes("lonely")) return "lonely"
    if (lowerContent.includes("tired") || lowerContent.includes("stress")) return "tired"
    if (lowerContent.includes("anxious") || lowerContent.includes("worried")) return "anxious"
    if (lowerContent.includes("grateful") || lowerContent.includes("thankful")) return "grateful"
    if (lowerContent.includes("hope") || lowerContent.includes("better")) return "hopeful"

    return "struggling"
  }

  const handleSubmitPost = () => {
    if (!newPost.trim()) return

    const hasToxicContent = checkForToxicContent(newPost)
    const mood = getMoodFromContent(newPost)
    const aiResponse = generateAIResponse(newPost)

    const post: Post = {
      id: Date.now().toString(),
      content: newPost,
      timestamp: "Just now",
      mood,
      likes: 0,
      aiResponse,
      isModerated: true,
      hasWarning: hasToxicContent,
    }

    setPosts([post, ...posts])
    setNewPost("")
  }

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case "struggling":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "hopeful":
        return "bg-green-100 text-green-700 border-green-200"
      case "grateful":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "anxious":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "lonely":
        return "bg-indigo-100 text-indigo-700 border-indigo-200"
      case "tired":
        return "bg-gray-100 text-gray-700 border-gray-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "struggling":
        return "💙"
      case "hopeful":
        return "🌱"
      case "grateful":
        return "🙏"
      case "anxious":
        return "🤗"
      case "lonely":
        return "🫂"
      case "tired":
        return "😴"
      default:
        return "💭"
    }
  }

  return (
    <EmotionEnvironment emotionalState={currentEmotion as any}>
      {faceDetectionEnabled && <LiveCameraPreview onEmotionChange={handleFaceEmotionChange} />}

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Peer Support Feed
            </h1>
            <p className="text-foreground/80 mt-1">A safe space to share, connect, and support each other</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            AI Moderated
          </Badge>
          <div className="flex items-center gap-3">
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
          <Card className="mb-6 border-primary/20 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    I notice you look <span className="capitalize text-primary">{detectedFaceEmotion}</span> while
                    browsing
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {detectedFaceEmotion === "stressed" && "Take a deep breath - you've got this."}
                    {detectedFaceEmotion === "sad" && "Remember, this community is here to support you."}
                    {detectedFaceEmotion === "happy" && "Your positive energy brightens this space."}
                    {!["stressed", "sad", "happy"].includes(detectedFaceEmotion) &&
                      "Your environment adapts to support you."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mb-6 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary mb-2">Community Guidelines</h3>
                <p className="text-sm text-foreground/80">
                  Share how you feel today. All posts are anonymous and monitored by AI for safety. Our AI companion
                  provides empathetic responses to support you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg">Share how you feel today</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Share your thoughts, feelings, or what's on your mind today..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none border-primary/20 focus:border-primary/50 bg-background/50"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Posts are anonymous and AI-moderated for safety</p>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Post Anonymously
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="border-primary/10 hover:border-primary/20 transition-colors bg-card/80 backdrop-blur-sm"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-muted to-muted-foreground/20">
                      <AvatarFallback className="text-xs bg-transparent">{getMoodEmoji(post.mood)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Anonymous</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getMoodColor(post.mood)}>
                      {post.mood}
                    </Badge>
                    {post.hasWarning && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Support resources recommended
                      </Badge>
                    )}
                    {post.isModerated && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Safe
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm leading-relaxed mb-4 text-foreground">{post.content}</p>

                {post.aiResponse && (
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 mb-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">AI Empathy Response</p>
                        <p className="text-sm text-foreground/80 leading-relaxed">{post.aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <Heart className="h-4 w-4 mr-2" />
                    {post.likes} Support
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Respond
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/5 bg-transparent">
            Load More Posts
          </Button>
        </div>
      </div>

      <CrisisGuardian
        isVisible={showCrisisGuardian}
        onClose={() => setShowCrisisGuardian(false)}
        triggerText={crisisMessage || newPost}
        faceEmotion={detectedFaceEmotion}
      />
    </EmotionEnvironment>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, MessageCircle, Shield, Users, Send, Bot, CheckCircle } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  content: string
  timestamp: string
  mood: "struggling" | "hopeful" | "grateful" | "anxious"
  likes: number
  aiResponse?: string
  isModerated: boolean
}

export default function CommunityPage() {
  const [newPost, setNewPost] = useState("")
  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      content:
        "I feel alone today. It's been really hard to connect with people lately, and I'm not sure how to reach out.",
      timestamp: "2 hours ago",
      mood: "struggling",
      likes: 12,
      aiResponse:
        "Your feelings are completely valid, and reaching out here shows incredible courage. Remember that feeling alone doesn't mean you are alone - this community sees you and supports you. Small steps like a text to a friend or a walk outside can help break the isolation.",
      isModerated: true,
    },
    {
      id: "2",
      content: "Had my first therapy session today. Nervous but hopeful about this journey of healing.",
      timestamp: "4 hours ago",
      mood: "hopeful",
      likes: 28,
      aiResponse:
        "Taking that first step into therapy is incredibly brave and shows your commitment to your wellbeing. It's completely normal to feel nervous - you're embarking on a meaningful journey of self-discovery and growth. Be patient and kind with yourself through this process.",
      isModerated: true,
    },
    {
      id: "3",
      content: "Grateful for small moments today - my morning coffee tasted perfect and I saw a beautiful sunrise.",
      timestamp: "6 hours ago",
      mood: "grateful",
      likes: 35,
      aiResponse:
        "What a beautiful reminder that joy can be found in simple moments! Practicing gratitude for these small pleasures is a powerful way to nurture your mental wellbeing. Thank you for sharing this positivity with our community.",
      isModerated: true,
    },
    {
      id: "4",
      content:
        "Work stress is overwhelming me. I can't seem to find balance and I'm constantly anxious about deadlines.",
      timestamp: "8 hours ago",
      mood: "anxious",
      likes: 18,
      aiResponse:
        "Work stress can feel all-consuming, but remember that your worth isn't defined by your productivity. Consider setting small, manageable boundaries - even 5-minute breaks can help reset your nervous system. You're doing better than you think.",
      isModerated: true,
    },
  ])

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
      default:
        return "💭"
    }
  }

  const handleSubmitPost = () => {
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now().toString(),
        content: newPost,
        timestamp: "Just now",
        mood: "hopeful", // Default mood
        likes: 0,
        aiResponse:
          "Thank you for sharing with our community. Your openness helps create a safe space for others to express themselves too. Remember, you're not alone in this journey.",
        isModerated: true,
      }
      setPosts([post, ...posts])
      setNewPost("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Peer Support Community
            </h1>
            <p className="text-muted-foreground mt-1">A safe space to share, connect, and support each other</p>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Shield className="h-3 w-3 mr-1" />
            Moderated
          </Badge>
        </div>

        {/* Community Guidelines */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-primary mb-2">Community Guidelines</h3>
                <p className="text-sm text-muted-foreground">
                  This is a safe, supportive space. All posts are anonymous and moderated by AI for safety. Share your
                  feelings, support others, and remember - you're not alone in your journey.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* New Post */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Share with the Community</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="How are you feeling today? Share your thoughts, struggles, or victories - this community is here to support you..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] resize-none border-primary/20 focus:border-primary/50"
            />
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Your post will be anonymous and reviewed for safety</p>
              <Button
                onClick={handleSubmitPost}
                disabled={!newPost.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                <Send className="h-4 w-4 mr-2" />
                Share Anonymously
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Posts Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <Card key={post.id} className="border-primary/10 hover:border-primary/20 transition-colors">
              <CardContent className="pt-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 bg-gradient-to-br from-muted to-muted-foreground/20">
                      <AvatarFallback className="text-xs bg-transparent">{getMoodEmoji(post.mood)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">Anonymous Community Member</p>
                      <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getMoodColor(post.mood)}>
                      {post.mood}
                    </Badge>
                    {post.isModerated && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Safe
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Post Content */}
                <p className="text-sm leading-relaxed mb-4 text-foreground">{post.content}</p>

                {/* AI Response */}
                {post.aiResponse && (
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 mb-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1">AI Companion Response</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">{post.aiResponse}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Post Actions */}
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

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline" className="border-primary/50 hover:bg-primary/5 bg-transparent">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  )
}

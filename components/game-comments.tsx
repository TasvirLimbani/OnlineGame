"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { ThumbsUp, ThumbsDown, Flag, User } from "lucide-react"

interface GameCommentsProps {
  gameSlug: string
}

interface Comment {
  id: string
  userId: string
  userName: string
  userPhotoURL: string | null
  text: string
  createdAt: any
  likes: number
  dislikes: number
}

export default function GameComments({ gameSlug }: GameCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // In a real app, you would fetch comments from Firestore
        // For now, we'll create placeholder data

        const placeholderComments: Comment[] = [
          {
            id: "1",
            userId: "user1",
            userName: "Rahul Singh",
            userPhotoURL: null,
            text: "This game is amazing! I've been playing for hours and can't get enough.",
            createdAt: { toDate: () => new Date(Date.now() - 3600000) },
            likes: 12,
            dislikes: 2,
          },
          {
            id: "2",
            userId: "user2",
            userName: "Priya Patel",
            userPhotoURL: null,
            text: "The graphics are stunning and the gameplay is smooth. Definitely recommend!",
            createdAt: { toDate: () => new Date(Date.now() - 7200000) },
            likes: 8,
            dislikes: 0,
          },
          {
            id: "3",
            userId: "user3",
            userName: "Amit Kumar",
            userPhotoURL: null,
            text: "I found a bug in level 3. The character gets stuck when jumping near the wall.",
            createdAt: { toDate: () => new Date(Date.now() - 86400000) },
            likes: 3,
            dislikes: 1,
          },
        ]

        setComments(placeholderComments)
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [gameSlug])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add a comment",
      })
      return
    }

    if (!newComment.trim()) return

    setSubmitting(true)

    try {
      // In a real app, you would add the comment to Firestore
      // For now, we'll just update the local state

      const newCommentObj: Comment = {
        id: Date.now().toString(),
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userPhotoURL: user.photoURL,
        text: newComment.trim(),
        createdAt: { toDate: () => new Date() },
        likes: 0,
        dislikes: 0,
      }

      setComments([newCommentObj, ...comments])
      setNewComment("")

      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      })
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Comments</h2>

      <form onSubmit={handleSubmitComment} className="space-y-4">
        <Textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={!user || submitting}
        />
        <Button type="submit" disabled={!user || !newComment.trim() || submitting}>
          {submitting ? "Posting..." : "Post Comment"}
        </Button>
      </form>

      <div className="space-y-4 mt-6">
        {comments.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4 p-4 border rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src={comment.userPhotoURL || ""} alt={comment.userName} />
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{comment.userName}</h3>
                  <span className="text-xs text-muted-foreground">
                    {comment.createdAt?.toDate
                      ? new Date(comment.createdAt.toDate()).toLocaleString()
                      : new Date().toLocaleString()}
                  </span>
                </div>
                <p className="mt-1 text-muted-foreground">{comment.text}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <ThumbsUp className="h-3 w-3" />
                    <span>{comment.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <ThumbsDown className="h-3 w-3" />
                    <span>{comment.dislikes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                    <Flag className="h-3 w-3" />
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}


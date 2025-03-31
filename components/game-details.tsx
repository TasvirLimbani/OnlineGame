"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Heart, Share2, Award, Calendar, Users, Clock, Info } from "lucide-react"
// Import the utility functions at the top of the file
import { handleFirebaseError } from "@/lib/firebase-utils"

interface GameDetailsProps {
  slug: string
}

interface Game {
  id: string
  title: string
  description: string
  instructions: string
  thumbnail: string
  gameUrl: string
  category: string
  tags: string[]
  playCount: number
  rating: number
  createdAt: any
  multiplayer: boolean
  playTime: string
}

export default function GameDetails({ slug }: GameDetailsProps) {
  const [game, setGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const { toast } = useToast()
  const { user, userData, addToFavorites, removeFromFavorites } = useAuth()

  useEffect(() => {
    const fetchGame = async () => {
      try {
        // In a real app, you would query by slug
        // For now, we'll simulate fetching a game

        // Placeholder game data
        const placeholderGame: Game = {
          id: "1",
          title: slug
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
          description:
            "This is an exciting game that challenges your skills and reflexes. Enjoy hours of fun gameplay with friends or solo.",
          instructions:
            "Use arrow keys to move, spacebar to jump, and mouse to aim and shoot. Collect power-ups to enhance your abilities.",
          thumbnail: "/placeholder.svg?height=600&width=800",
          gameUrl: "https://example.com/game",
          category: "Action",
          tags: ["Adventure", "Multiplayer", "Strategy"],
          playCount: 12500,
          rating: 4.5,
          createdAt: { toDate: () => new Date() },
          multiplayer: true,
          playTime: "5-10 min",
        }

        setGame(placeholderGame)

        // Check if game is in favorites
        if (userData) {
          setIsFavorite(userData.favorites.includes(placeholderGame.id))
        }

        // In a real app, you would increment the play count
        // await updateDoc(doc(db, "games", game.id), {
        //   playCount: increment(1)
        // });
      } catch (error) {
        console.error("Error fetching game:", error)
        toast({
          title: "Error",
          description: "Failed to load game details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchGame()
  }, [slug, toast, userData])

  // Update the toggleFavorite function
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to add games to favorites",
      })
      return
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(game!.id)
        setIsFavorite(false)
        toast({
          title: "Removed from favorites",
          description: `${game!.title} has been removed from your favorites`,
        })
      } else {
        await addToFavorites(game!.id)
        setIsFavorite(true)
        toast({
          title: "Added to favorites",
          description: `${game!.title} has been added to your favorites`,
        })
      }
    } catch (error) {
      console.error("Error updating favorites:", error)
      toast({
        title: "Error",
        description: handleFirebaseError(error, "Failed to update favorites"),
        variant: "destructive",
      })
    }
  }

  const shareGame = () => {
    if (navigator.share) {
      navigator
        .share({
          title: game?.title,
          text: game?.description,
          url: window.location.href,
        })
        .catch((error) => {
          console.error("Error sharing:", error)
        })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Game link copied to clipboard",
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-1/3" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="aspect-video w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Game Not Found</h2>
        <p className="text-muted-foreground">The game you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold">{game.title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className={isFavorite ? "text-red-500" : ""} onClick={toggleFavorite}>
            <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Favorited" : "Add to Favorites"}
          </Button>
          <Button variant="outline" size="sm" onClick={shareGame}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-lg overflow-hidden border">
            <iframe
              src="/placeholder.svg?height=600&width=800"
              className="game-frame"
              title={game.title}
              allowFullScreen
            ></iframe>
          </div>

          <Tabs defaultValue="about" className="mt-6">
            <TabsList>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="p-4 border rounded-lg mt-2">
              <p className="text-muted-foreground">{game.description}</p>
            </TabsContent>
            <TabsContent value="instructions" className="p-4 border rounded-lg mt-2">
              <p className="text-muted-foreground">{game.instructions}</p>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image src={game.thumbnail || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="secondary">{game.category}</Badge>
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Rating: {game.rating}/5</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Added:{" "}
                    {game.createdAt?.toDate
                      ? new Date(game.createdAt.toDate()).toLocaleDateString()
                      : new Date().toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{game.multiplayer ? "Multiplayer" : "Single Player"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Play Time: {game.playTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{game.playCount.toLocaleString()} plays</span>
                </div>
              </div>

              <Button className="w-full mt-4">Play Fullscreen</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


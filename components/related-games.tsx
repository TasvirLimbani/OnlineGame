"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"

interface RelatedGamesProps {
  currentSlug: string
}

interface Game {
  id: string
  title: string
  slug: string
  thumbnail: string
  category: string
}

export default function RelatedGames({ currentSlug }: RelatedGamesProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user, addToRecentlyPlayed } = useAuth()

  useEffect(() => {
    const fetchRelatedGames = async () => {
      try {
        // In a real app, you would fetch related games from Firestore
        // For now, we'll create placeholder data

        const placeholderGames: Game[] = [
          {
            id: "1",
            title: "Similar Game 1",
            slug: "similar-game-1",
            thumbnail: "/placeholder.svg?height=300&width=400",
            category: "Action",
          },
          {
            id: "2",
            title: "Similar Game 2",
            slug: "similar-game-2",
            thumbnail: "/placeholder.svg?height=300&width=400",
            category: "Adventure",
          },
          {
            id: "3",
            title: "Similar Game 3",
            slug: "similar-game-3",
            thumbnail: "/placeholder.svg?height=300&width=400",
            category: "Puzzle",
          },
          {
            id: "4",
            title: "Similar Game 4",
            slug: "similar-game-4",
            thumbnail: "/placeholder.svg?height=300&width=400",
            category: "Racing",
          },
        ]

        setGames(placeholderGames)
      } catch (error) {
        console.error("Error fetching related games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelatedGames()
  }, [currentSlug])

  const handleGameClick = (gameId: string) => {
    if (user) {
      addToRecentlyPlayed(gameId)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Related Games</h2>
        <div className="space-y-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-2">
                    <Skeleton className="h-4 w-3/4 mb-1" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Related Games</h2>
      <div className="space-y-4">
        {games.map((game) => (
          <Link key={game.id} href={`/games/${game.slug}`} onClick={() => handleGameClick(game.id)}>
            <Card className="overflow-hidden game-card">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image src={game.thumbnail || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                </div>
                <div className="p-2">
                  <h3 className="font-semibold text-sm line-clamp-1">{game.title}</h3>
                  <p className="text-xs text-muted-foreground">{game.category}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


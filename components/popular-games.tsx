"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Flame } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
// Update the import line to include 'where'
import { collection, getDocs, limit, query, orderBy, where } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

// Import the utility functions at the top of the file
import { isPermissionError } from "@/lib/firebase-utils"

interface Game {
  id: string
  title: string
  slug: string
  thumbnaill: string
  category: string
  games: string
  url: string
  hoverVideo?: string
  createdAt: number
}

export default function PopularGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user, addToRecentlyPlayed } = useAuth()

  // Update the useEffect hook
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          orderBy("createdAt", "desc"),
           // Increased limit to ensure we get enough popular games
        )
        const querySnapshot = await getDocs(q)
        const gamesData = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((game): game is Game => {
            const gameData = game as Partial<Game>;
            return gameData.games?.toLowerCase() === "popular";
          })
          .slice(0, 8) as Game[]
    
        setGames(gamesData)
      } catch (error) {
        console.error("Error fetching games:", error)
        if (isPermissionError(error)) {
          setGames([
            {
              id: "1",
              title: "Ludo King",
              slug: "ludo-king",
              thumbnaill: "/placeholder.svg?height=300&width=400",
              category: "Board",
              games: "popular",
              url: "",
              createdAt: Date.now()
            },
            {
              id: "2", 
              title: "Carrom Pool",
              slug: "carrom-pool", 
              thumbnaill: "/placeholder.svg?height=300&width=400",
              category: "Sports",
              games: "popular",
              url: "",
              createdAt: Date.now()
            },
            {
              id: "3",
              title: "Rummy Circle",
              slug: "rummy-circle",
              thumbnaill: "/placeholder.svg?height=300&width=400",
              category: "Card",
              games: "popular",
              url: "",
              createdAt: Date.now()
            }
          ] as Game[])
        }
      } finally {
        setLoading(false)
      }
    }
  
    fetchGames()
  }, [])

  const handleGameClick = (gameId: string) => {
    if (user) {
      addToRecentlyPlayed(gameId)
    }
  }

  // If no games are fetched yet, use placeholder data
  if (loading) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Popular Games</h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/popular">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  // If no games are available in the database, show placeholder games
  if (games.length === 0) {
    const placeholderGames = [
      {
        id: "1",
        title: "Ludo King",
        slug: "ludo-king",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Board",
      },
      {
        id: "2",
        title: "Carrom Pool",
        slug: "carrom-pool",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Sports",
      },
      {
        id: "3",
        title: "Rummy Circle",
        slug: "rummy-circle",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Card",
      },
      {
        id: "4",
        title: "Teen Patti",
        slug: "teen-patti",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Card",
      },
      {
        id: "5",
        title: "Subway Surfers Mumbai",
        slug: "subway-surfers-mumbai",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Running",
      },
      {
        id: "6",
        title: "Candy Crush Desi",
        slug: "candy-crush-desi",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Puzzle",
      },
      {
        id: "7",
        title: "Free Fire India",
        slug: "free-fire-india",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Action",
      },
      {
        id: "8",
        title: "Chess Master",
        slug: "chess-master",
        thumbnaill: "/placeholder.svg?height=300&width=400",
        category: "Board",
      },
    ]

    setGames(placeholderGames as Game[])
  }

  // Update the game card rendering
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Popular Games</h2>
        <Button variant="link" size="sm" asChild>
          <Link href="/popular">
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map((game, index) => (
          <Link 
            key={game.id} 
            href={game.url || `/games/${game.slug}`} 
            onClick={() => handleGameClick(game.id)} 
            target={game.url ? "_blank" : undefined} 
            rel={game.url ? "noopener noreferrer" : undefined}
          >
            <Card className="overflow-hidden game-card group">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={game.thumbnaill || "/placeholder.svg?height=300&width=400"}
                    alt={game.title}
                    fill
                    className="object-cover transition-opacity duration-300 group-hover:opacity-0"
                  />
                  {game.hoverVideo && (
                    <video
                      src={game.hoverVideo}
                      muted
                      playsInline
                      loop
                      preload="auto"
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onMouseEnter={(e) => {
                        const video = e.currentTarget;
                        setTimeout(() => {
                          if (video.paused) {
                            video.play().catch(() => {});
                          }
                        }, 100);
                      }}
                      onMouseLeave={(e) => {
                        const video = e.currentTarget;
                        setTimeout(() => {
                          video.pause();
                          video.currentTime = 0;
                        }, 100);
                      }}
                    />
                  )}
                  {index < 3 && (
                    <div className="absolute top-2 right-2 z-10">
                      <Badge variant="secondary" className="flex items-center gap-1 bg-primary text-primary-foreground">
                        <Flame className="h-3 w-3" />
                        Hot
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-1">{game.title}</h3>
                  <p className="text-sm text-muted-foreground">{game.category}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}


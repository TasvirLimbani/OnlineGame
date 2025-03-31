"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { db } from "@/lib/firebase"
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore"
import { Skeleton } from "@/components/ui/skeleton"

// Import the utility function to check permission errors
import { isPermissionError } from "@/lib/firebase-utils"

interface Game {
  id: string
  title: string
  slug: string
  thumbnaill: string
  category: string
  featured: string
  url: string
  hoverVideo?: string  // Changed from hoverImage to hoverVideo
  createdAt: number
}

export default function FeaturedGames() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user, addToRecentlyPlayed } = useAuth()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          orderBy("createdAt", "desc"), // Ensures the latest games appear first
          limit(6)
        )

        const querySnapshot = await getDocs(q)
        const gamesData: Game[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[]

        setGames(gamesData)
      } catch (error) {
        console.error("Error fetching games:", error)

        // Handle permission errors by showing placeholder games
        if (isPermissionError(error)) {
          setGames(placeholderGames)
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

  const placeholderGames: Game[] = [
    {
      id: "1",
      title: "Traffic Rider",
      slug: "traffic-rider",
      url: "https://www.crazygames.com/game/traffic-rider-vvq",
      thumbnaill: "https://imgs.crazygames.com/traffic-rider-vvq_16x9/20250320102250/traffic-rider-vvq_16x9-cover",
      category: "Sports",
      featured: "featured",
      createdAt: Date.now(),
    },
    {
      id: "2",
      title: "Bollywood Quiz",
      slug: "bollywood-quiz",
      url: "#",
      thumbnaill: "/placeholder.svg?height=300&width=400",
      category: "Puzzle",
      featured: "featured",
      createdAt: Date.now(),
    },
    {
      id: "3",
      title: "Mumbai Racer",
      slug: "mumbai-racer",
      url: "#",
      thumbnaill: "/placeholder.svg?height=300&width=400",
      category: "Racing",
      featured: "featured",
      createdAt: Date.now(),
    },
    {
      id: "4",
      title: "Temple Run India",
      slug: "temple-run-india",
      url: "#",
      thumbnaill: "/placeholder.svg?height=300&width=400",
      category: "Adventure",
      featured: "featured",
      createdAt: Date.now(),
    },
    {
      id: "5",
      title: "Kabaddi Stars",
      slug: "kabaddi-stars",
      url: "#",
      thumbnaill: "/placeholder.svg?height=300&width=400",
      category: "Sports",
      featured: "featured",
      createdAt: Date.now(),
    },
    {
      id: "6",
      title: "Diwali Blast",
      slug: "diwali-blast",
      url: "#",
      thumbnaill: "/placeholder.svg?height=300&width=400",
      category: "Action",
      featured: "featured",
      createdAt: Date.now(),
    },
  ]

  if (loading) {
    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Featured Games</h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/featured">
              View all
              <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6)
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

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold tracking-tight">Featured Games</h2>
        <Button variant="link" size="sm" asChild>
          <Link href="/featured">  {/* Updated from "/featured" */}
            View all
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {games.map((game) => (
          <Link key={game.id} href={game.url} onClick={() => handleGameClick(game.id)} target="_blank" rel="noopener noreferrer">
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
                      className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause()
                        e.currentTarget.currentTime = 0
                      }}
                    />
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

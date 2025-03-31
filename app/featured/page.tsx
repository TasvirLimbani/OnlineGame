"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore"
// Update the Game import to include hoverVideo
import { Game } from "@/components/featured-games"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"

export default function FeaturedGamesPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user, addToRecentlyPlayed } = useAuth()

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          orderBy("createdAt", "desc"),
          limit(30)  // Add limit to fetch only top 50 games
        )
        const querySnapshot = await getDocs(q)
        const gamesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[]

        setGames(gamesData)
      } catch (error) {
        console.error("Error fetching games:", error)
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

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Featured Games</h1>
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
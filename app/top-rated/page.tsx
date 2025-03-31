"use client"

import { useState, useEffect } from "react"
import { Shell } from "@/components/shells/shell"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, limit, getDocs, where } from "firebase/firestore"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"

interface Game {
  id: string
  title: string
  slug: string
  thumbnaill: string
  category: string
  url: string
  hoverVideo?: string
  rating: number
}

export default function TopRatedPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const gamesQuery = query(
          collection(db, "games"),
          where("games", "==", "top")
        )
        
        const querySnapshot = await getDocs(gamesQuery)
        const gamesData = querySnapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => (b.rating || 0) - (a.rating || 0)) as Game[]

        setGames(gamesData)
      } catch (error) {
        console.error("Error fetching top rated games:", error)
        setGames([])
      } finally {
        setLoading(false)
      }
    }

    fetchTopRated()
  }, [])

  return (
    <Shell>
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Top Rated Games</h1>
        <p className="text-muted-foreground">The highest rated games on our platform</p>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array(8).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="aspect-[4/3] w-full animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                <div className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                  <Skeleton className="h-3 w-1/2 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <Link key={game.id} href={game.url || `/games/${game.slug}`} target={game.url ? "_blank" : undefined}>
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
                        onMouseOver={(e) => {
                          const video = e.currentTarget
                          video.play().catch(() => {})
                        }}
                        onMouseLeave={(e) => {
                          const video = e.currentTarget
                          video.pause()
                          video.currentTime = 0
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
      )}
    </Shell>
  )
}
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"

interface Game {
  id: string
  title: string
  slug: string
  thumbnail: string
  category: string
}

export default function UserGames() {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([])
  const [recentGames, setRecentGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { userData } = useAuth()

  useEffect(() => {
    const fetchGames = async () => {
      if (!userData) return

      try {
        // In a real app, you would fetch the actual games from Firestore
        // For now, we'll create placeholder data based on the IDs in userData

        const favoritePlaceholders: Game[] = userData.favorites.map((id, index) => ({
          id,
          title: `Favorite Game ${index + 1}`,
          slug: `favorite-game-${index + 1}`,
          thumbnail: `/placeholder.svg?height=300&width=400`,
          category: ["Action", "Adventure", "Puzzle", "Racing", "Sports"][Math.floor(Math.random() * 5)],
        }))

        const recentPlaceholders: Game[] = userData.recentlyPlayed.map((id, index) => ({
          id,
          title: `Recent Game ${index + 1}`,
          slug: `recent-game-${index + 1}\`,  => ({
          id,
          title: \`Recent Game ${index + 1}`,
          slug: `recent-game-${index + 1}`,
          thumbnail: `/placeholder.svg?height=300&width=400`,
          category: ["Action", "Adventure", "Puzzle", "Racing", "Sports"][Math.floor(Math.random() * 5)],
        }))

        setFavoriteGames(favoritePlaceholders)
        setRecentGames(recentPlaceholders)
      } catch (error) {
        console.error("Error fetching games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
  }, [userData])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-[200px]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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

  // If no data is available, show placeholder message
  if (!userData || (favoriteGames.length === 0 && recentGames.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h2 className="text-2xl font-bold mb-2">No Games Yet</h2>
        <p className="text-muted-foreground mb-4">
          Start playing games to see your history or add games to your favorites.
        </p>
        <Link href="/" className="text-primary hover:underline">
          Browse Games
        </Link>
      </div>
    )
  }

  return (
    <Tabs defaultValue="recent">
      <TabsList className="mb-4">
        <TabsTrigger value="recent">Recently Played</TabsTrigger>
        <TabsTrigger value="favorites">Favorites</TabsTrigger>
      </TabsList>

      <TabsContent value="recent">
        {recentGames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't played any games yet.</p>
            <Link href="/" className="text-primary hover:underline block mt-2">
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {recentGames.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <Card className="overflow-hidden game-card">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={game.thumbnail || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
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
      </TabsContent>

      <TabsContent value="favorites">
        {favoriteGames.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You haven't added any games to your favorites yet.</p>
            <Link href="/" className="text-primary hover:underline block mt-2">
              Browse Games
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {favoriteGames.map((game) => (
              <Link key={game.id} href={`/games/${game.slug}`}>
                <Card className="overflow-hidden game-card">
                  <CardContent className="p-0">
                    <div className="relative aspect-[4/3]">
                      <Image
                        src={game.thumbnail || "/placeholder.svg"}
                        alt={game.title}
                        fill
                        className="object-cover"
                      />
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
      </TabsContent>
    </Tabs>
  )
}


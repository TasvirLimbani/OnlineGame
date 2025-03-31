"use client"
"use client"

import { db } from "@/lib/firebase"
import { collection, getDocs, limit, query, orderBy } from "firebase/firestore"
import { isPermissionError } from "@/lib/firebase-utils"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/lib/auth-context"

interface CategoryGamesProps {
  category: string
}

interface Game {
  id: string
  title: string
  slug: string
  thumbnaill: string
  category: string
  playCount: number
}

export default function CategoryGames({ category }: CategoryGamesProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const { user, addToRecentlyPlayed } = useAuth()

  useEffect(() => {

    const fetchGames = async () => {
      try {
        const q = query(
          collection(db, "games"),
          orderBy("createdAt", "desc") // Ensures the latest games appear first
        );
    
        const querySnapshot = await getDocs(q);
        const gamesData: Game[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];
    
        // Filter games based on category
        const filteredGames = gamesData.filter(game => 
          game.category.toLowerCase() === category.toLowerCase()
        );
    
        // Show only the first 15 games
        const limitedGames = filteredGames.slice(0, 15);
    
        // Update the state with the first 15 games
        setGames(limitedGames);
    
      } catch (error) {
        console.error("Error fetching games:", error);
    
        // Handle permission errors by showing placeholder games
        if (isPermissionError(error)) {
          setGames(placeholderGames);
        }
      } finally {
        setLoading(false);
      }
    };
    
    
    const fetchCategoryGames = async () => {
      try {
        // In a real app, you would fetch games by category from Firestore
        // For now, we'll create placeholder data

        const placeholderGames: Game[] = Array(0)
          .fill(0)
          .map((_, index) => ({
            id: `${index + 1}`,
            title: `${category.charAt(0).toUpperCase() + category.slice(1)} Game ${index + 1}`,
            slug: `${category}-game-${index + 1}`,
            thumbnail: "/placeholder.svg?height=300&width=400",
            category: category.charAt(0).toUpperCase() + category.slice(1),
            playCount: Math.floor(Math.random() * 10000),
          }))

        setGames(placeholderGames)
      } catch (error) {
        console.error("Error fetching category games:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
    fetchCategoryGames()
  }, [category])

  const handleGameClick = (gameId: string) => {
    if (user) {
      addToRecentlyPlayed(gameId)
    }
  }

  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{formatCategoryName(category)} Games</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12)
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
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{formatCategoryName(category)} Games</h1>

      {games.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-bold mb-2">No Games Found</h2>
          <p className="text-muted-foreground">We couldn't find any games in this category.</p>
          <Link href="/" className="text-primary hover:underline mt-4">
            Browse All Games
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.slug}`} onClick={() => handleGameClick(game.id)}>
              <Card className="overflow-hidden game-card">
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3]">
                    <Image src={game.thumbnaill || "/placeholder.svg"} alt={game.title} fill className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{game.title}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-sm text-muted-foreground">{game.category}</p>
                      </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}


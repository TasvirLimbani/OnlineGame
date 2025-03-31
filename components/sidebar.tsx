"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Home,
  Zap,
  Clock,
  Award,
  Users,
  Sword,
  Mountain,
  Trophy,
  Puzzle,
  Car,
  Dices,
  Shirt,
  Bike,
  Bomb,
  Rocket,
  Skull,
  Joystick,
} from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const mainLinks = [
    { href: "/", label: "Home", icon: <Home className="h-5 w-5" /> },
    { href: "/trending", label: "Trending", icon: <Zap className="h-5 w-5" /> },
    { href: "/recently-played", label: "Recently Played", icon: <Clock className="h-5 w-5" /> },
    { href: "/top-rated", label: "Top Rated", icon: <Award className="h-5 w-5" /> },
    { href: "/multiplayer", label: "Multiplayer", icon: <Users className="h-5 w-5" /> },
  ]

  const categoryLinks = [
    { href: "/categories/action", label: "Action", icon: <Sword className="h-5 w-5" /> },
    { href: "/categories/adventure", label: "Adventure", icon: <Mountain className="h-5 w-5" /> },
    { href: "/categories/sports", label: "Sports", icon: <Trophy className="h-5 w-5" /> },
    { href: "/categories/puzzle", label: "Puzzle", icon: <Puzzle className="h-5 w-5" /> },
    { href: "/categories/racing", label: "Racing", icon: <Car className="h-5 w-5" /> },
    { href: "/categories/casual", label: "Casual", icon: <Dices className="h-5 w-5" /> },
    { href: "/categories/dress-up", label: "Dress Up", icon: <Shirt className="h-5 w-5" /> },
    { href: "/categories/bike", label: "Bike", icon: <Bike className="h-5 w-5" /> },
    { href: "/categories/shooting", label: "Shooting", icon: <Bomb className="h-5 w-5" /> },
    { href: "/categories/space", label: "Space", icon: <Rocket className="h-5 w-5" /> },
    { href: "/categories/horror", label: "Horror", icon: <Skull className="h-5 w-5" /> },
    { href: "/categories/arcade", label: "Arcade", icon: <Joystick className="h-5 w-5" /> },
  ]

  return (
    <aside className="hidden border-r bg-background md:block md:w-64 lg:w-72">
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="flex flex-col gap-1 p-4">
          <div className="mb-2">
            <h2 className="px-4 text-lg font-semibold tracking-tight">Main</h2>
            <nav className="flex flex-col gap-1 mt-2">
              {mainLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mb-2">
            <h2 className="px-4 text-lg font-semibold tracking-tight">Categories</h2>
            <nav className="flex flex-col gap-1 mt-2">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </ScrollArea>
    </aside>
  )
}


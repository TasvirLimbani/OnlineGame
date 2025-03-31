"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Menu, LogIn, User, Heart, LogOut, Gamepad2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import LoginDialog from "./login-dialog"

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, userData, logout } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
                <Gamepad2 className="h-5 w-5 text-primary" />
                GameVerse India
              </Link>
              <Link href="/" className={`sidebar-link ${pathname === "/" ? "active" : ""}`}>
                Home
              </Link>
              <Link
                href="/categories/action"
                className={`sidebar-link ${pathname.startsWith("/categories/action") ? "active" : ""}`}
              >
                Action
              </Link>
              <Link
                href="/categories/adventure"
                className={`sidebar-link ${pathname.startsWith("/categories/adventure") ? "active" : ""}`}
              >
                Adventure
              </Link>
              <Link
                href="/categories/sports"
                className={`sidebar-link ${pathname.startsWith("/categories/sports") ? "active" : ""}`}
              >
                Sports
              </Link>
              <Link
                href="/categories/puzzle"
                className={`sidebar-link ${pathname.startsWith("/categories/puzzle") ? "active" : ""}`}
              >
                Puzzle
              </Link>
              <Link
                href="/categories/multiplayer"
                className={`sidebar-link ${pathname.startsWith("/categories/multiplayer") ? "active" : ""}`}
              >
                Multiplayer
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 ml-2 md:ml-0">
          <Gamepad2 className="h-6 w-6 text-primary" />
          <span className="hidden font-bold sm:inline-block text-xl">GameVerse India</span>
        </Link>
        <div className="flex items-center ml-auto">
          <form onSubmit={handleSearch} className="relative w-full max-w-sm mr-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search games..."
              className="w-full pl-8 bg-muted"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{userData?.coins || 0} coins</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/favorites" className="cursor-pointer">
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" onClick={() => setIsLoginOpen(true)}>
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Button>
          )}
        </div>
      </div>
      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  )
}


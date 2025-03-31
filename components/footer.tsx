import Link from "next/link"
import { Gamepad2 } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">GameVerse India</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              The best free online gaming platform in India. Play thousands of games instantly without downloads.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories/action" className="text-muted-foreground hover:text-primary">
                  Action Games
                </Link>
              </li>
              <li>
                <Link href="/categories/adventure" className="text-muted-foreground hover:text-primary">
                  Adventure Games
                </Link>
              </li>
              <li>
                <Link href="/categories/sports" className="text-muted-foreground hover:text-primary">
                  Sports Games
                </Link>
              </li>
              <li>
                <Link href="/categories/puzzle" className="text-muted-foreground hover:text-primary">
                  Puzzle Games
                </Link>
              </li>
              <li>
                <Link href="/categories/multiplayer" className="text-muted-foreground hover:text-primary">
                  Multiplayer Games
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="https://facebook.com" className="text-muted-foreground hover:text-primary">
                  Facebook
                </Link>
              </li>
              <li>
                <Link href="https://twitter.com" className="text-muted-foreground hover:text-primary">
                  Twitter
                </Link>
              </li>
              <li>
                <Link href="https://instagram.com" className="text-muted-foreground hover:text-primary">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="https://youtube.com" className="text-muted-foreground hover:text-primary">
                  YouTube
                </Link>
              </li>
              <li>
                <Link href="https://discord.com" className="text-muted-foreground hover:text-primary">
                  Discord
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GameVerse India. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}


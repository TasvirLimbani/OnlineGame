import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import FirebaseAuthProvider from "@/components/firebase-auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GameVerse India - Play Free Online Games",
  description:
    "Play thousands of free online games for all ages. GameVerse India offers the best collection of action, adventure, sports, and multiplayer games.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
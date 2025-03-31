import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Trending Games",
  description: "Discover the most trending games right now",
}

export default function TrendingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
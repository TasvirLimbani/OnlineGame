import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import FeaturedGames from "@/components/featured-games"
import PopularGames from "@/components/popular-games"
import NewGames from "@/components/new-games"
import WelcomeBanner from "@/components/welcome-banner"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <WelcomeBanner />
          <FeaturedGames />
          <PopularGames />
          <NewGames />
        </main>
      </div>
      <Footer />
    </div>
  )
}


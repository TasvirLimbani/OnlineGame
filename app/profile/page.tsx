import { Suspense } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import UserProfile from "@/components/user-profile"
import UserGames from "@/components/user-games"
import UserCoins from "@/components/user-coins"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default async function ProfilePage() {
  // In a real implementation, you would check the session server-side
  // For now, we'll redirect in the client component if not logged in

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Suspense fallback={<Skeleton className="w-full h-[300px] rounded-lg" />}>
                <UserProfile />
              </Suspense>
              <div className="mt-6">
                <Suspense fallback={<Skeleton className="w-full h-[150px] rounded-lg" />}>
                  <UserCoins />
                </Suspense>
              </div>
            </div>
            <div className="lg:col-span-2">
              <Suspense fallback={<Skeleton className="w-full h-[500px] rounded-lg" />}>
                <UserGames />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}


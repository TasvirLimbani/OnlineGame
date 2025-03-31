import { Suspense } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import CategoryGames from "@/components/category-games"
import Footer from "@/components/footer"
import { Skeleton } from "@/components/ui/skeleton"

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const category = await params.category

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Suspense fallback={<Skeleton className="w-full h-[600px] rounded-lg" />}>
            <CategoryGames category={category} />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  )
}


import { Gamepad2, Download, Monitor, Users, Zap } from "lucide-react"

export default function WelcomeBanner() {
  return (
    <div className="relative overflow-hidden rounded-lg border bg-gradient-to-r from-orange-500/20 via-amber-500/20 to-yellow-500/20 p-6 mb-8">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="flex items-center justify-center bg-primary/10 p-3 rounded-full">
          <Gamepad2 className="h-10 w-10 text-primary" />
        </div>
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-3xl font-bold tracking-tighter">Welcome to GameVerse India</h1>
          <p className="text-muted-foreground max-w-[600px]">
            Play thousands of free online games for all ages. The best collection of Indian and global games.
          </p>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 p-3 text-center">
          <Zap className="h-6 w-6 text-primary" />
          <div className="text-sm font-medium">4000+ Games</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 p-3 text-center">
          <Download className="h-6 w-6 text-primary" />
          <div className="text-sm font-medium">No Install Needed</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 p-3 text-center">
          <Monitor className="h-6 w-6 text-primary" />
          <div className="text-sm font-medium">On Any Device</div>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-lg bg-background/50 p-3 text-center">
          <Users className="h-6 w-6 text-primary" />
          <div className="text-sm font-medium">Play with Friends</div>
        </div>
      </div>
    </div>
  )
}


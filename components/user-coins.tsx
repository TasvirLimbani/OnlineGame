"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { Coins, Gift, Clock } from "lucide-react"

// Import the utility functions at the top of the file
import { handleFirebaseError } from "@/lib/firebase-utils"

export default function UserCoins() {
  const { userData, addCoins } = useAuth()
  const [dailyRewardClaimed, setDailyRewardClaimed] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  // Update the handleDailyReward function
  const handleDailyReward = async () => {
    try {
      await addCoins(50)
      setDailyRewardClaimed(true)
      setDialogOpen(false)

      toast({
        title: "Daily reward claimed",
        description: "50 coins have been added to your account",
      })
    } catch (error) {
      console.error("Error claiming daily reward:", error)
      toast({
        title: "Error",
        description: handleFirebaseError(error, "Failed to claim daily reward"),
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Your Coins</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center gap-2">
            <Coins className="h-8 w-8 text-yellow-500" />
            <span className="text-3xl font-bold">{userData?.coins || 0}</span>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Use coins to unlock premium games and special features
          </p>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" disabled={dailyRewardClaimed}>
                {dailyRewardClaimed ? (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Claimed Today
                  </>
                ) : (
                  <>
                    <Gift className="mr-2 h-4 w-4" />
                    Claim Daily Reward
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Daily Reward</DialogTitle>
                <DialogDescription>Claim your daily reward of 50 coins!</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center py-4">
                <Coins className="h-16 w-16 text-yellow-500 mb-4" />
                <p className="text-2xl font-bold">50 Coins</p>
                <p className="text-sm text-muted-foreground mt-2">Come back tomorrow for another reward</p>
              </div>
              <Button onClick={handleDailyReward}>Claim Reward</Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  )
}


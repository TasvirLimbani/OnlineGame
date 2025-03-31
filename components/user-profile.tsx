"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { updateProfile } from "firebase/auth"
import { doc, updateDoc } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Pencil, Save, User } from "lucide-react"
// Import the utility functions at the top of the file
import { handleFirebaseError } from "@/lib/firebase-utils"

export default function UserProfile() {
  const { user, userData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.displayName || "")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  if (!user) {
    router.push("/")
    return null
  }

  // Update the handleSave function
  const handleSave = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, {
        displayName: displayName,
      })

      try {
        // Update Firestore document
        const userDocRef = doc(db, "users", user.uid)
        await updateDoc(userDocRef, {
          displayName: displayName,
        })
      } catch (error) {
        console.error("Error updating Firestore profile:", error)
        // Continue since we at least updated Auth profile
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      })

      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: handleFirebaseError(error, "Failed to update profile"),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || "User"} />
            <AvatarFallback className="text-2xl">
              <User className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>

          {isEditing ? (
            <div className="w-full space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDisplayName(user?.displayName || "")
                    setIsEditing(false)
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="text-center">
                <h3 className="text-xl font-bold">{user?.displayName || "User"}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </>
          )}

          <div className="w-full pt-4 border-t">
            <div className="flex justify-between text-sm">
              <div>
                <p className="text-muted-foreground">Member since</p>
                <p className="font-medium">
                  {user?.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Last login</p>
                <p className="font-medium">
                  {user?.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


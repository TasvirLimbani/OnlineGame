"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import {
  type User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth"
import { auth, db } from "./firebase"
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore"

interface UserData {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  coins: number
  favorites: string[]
  recentlyPlayed: string[]
}

interface AuthContextType {
  user: User | null
  userData: UserData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  addCoins: (amount: number) => Promise<void>
  addToFavorites: (gameId: string) => Promise<void>
  removeFromFavorites: (gameId: string) => Promise<void>
  addToRecentlyPlayed: (gameId: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)

  // Update the useEffect hook that fetches user data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)

      if (user) {
        try {
          // Fetch user data from Firestore
          const userDocRef = doc(db, "users", user.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData)
          } else {
            // Create user data if it doesn't exist
            const newUserData: UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
              coins: 100, // Starting coins
              favorites: [],
              recentlyPlayed: [],
            }

            try {
              await setDoc(userDocRef, newUserData)
              setUserData(newUserData)
            } catch (error) {
              console.error("Error creating user data:", error)
              // Still set the user data in memory even if we can't save to Firestore
              setUserData(newUserData)
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
          // Create a fallback user data object
          const fallbackUserData: UserData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            coins: 100,
            favorites: [],
            recentlyPlayed: [],
          }
          setUserData(fallbackUserData)
        }
      } else {
        setUserData(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUp = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Update profile with display name
    await updateProfile(userCredential.user, {
      displayName: name,
    })

    // Create user document in Firestore
    const userDocRef = doc(db, "users", userCredential.user.uid)
    await setDoc(userDocRef, {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: name,
      photoURL: null,
      coins: 100, // Starting coins
      favorites: [],
      recentlyPlayed: [],
      createdAt: serverTimestamp(),
    })
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const userCredential = await signInWithPopup(auth, provider)

    // Check if user document exists
    const userDocRef = doc(db, "users", userCredential.user.uid)
    const userDoc = await getDoc(userDocRef)

    if (!userDoc.exists()) {
      // Create user document in Firestore
      await setDoc(userDocRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        coins: 100, // Starting coins
        favorites: [],
        recentlyPlayed: [],
        createdAt: serverTimestamp(),
      })
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  // Update the addCoins function to handle errors
  const addCoins = async (amount: number) => {
    if (!user || !userData) return

    const newCoins = userData.coins + amount

    // Update local state first for immediate feedback
    setUserData({
      ...userData,
      coins: newCoins,
    })

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        coins: newCoins,
      })
    } catch (error) {
      console.error("Error updating coins:", error)
      // We already updated the UI, so no need to revert unless you want to
    }
  }

  // Update the addToFavorites function to handle errors
  const addToFavorites = async (gameId: string) => {
    if (!user || !userData) return

    const newFavorites = [...userData.favorites, gameId]

    // Update local state first
    setUserData({
      ...userData,
      favorites: newFavorites,
    })

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        favorites: newFavorites,
      })
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  // Update the removeFromFavorites function to handle errors
  const removeFromFavorites = async (gameId: string) => {
    if (!user || !userData) return

    const newFavorites = userData.favorites.filter((id) => id !== gameId)

    // Update local state first
    setUserData({
      ...userData,
      favorites: newFavorites,
    })

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        favorites: newFavorites,
      })
    } catch (error) {
      console.error("Error updating favorites:", error)
    }
  }

  // Update the addToRecentlyPlayed function to handle errors
  const addToRecentlyPlayed = async (gameId: string) => {
    if (!user || !userData) return

    // Remove the game if it already exists in the list
    const filteredRecent = userData.recentlyPlayed.filter((id) => id !== gameId)

    // Add the game to the beginning of the list
    const newRecentlyPlayed = [gameId, ...filteredRecent].slice(0, 10) // Keep only the 10 most recent

    // Update local state first
    setUserData({
      ...userData,
      recentlyPlayed: newRecentlyPlayed,
    })

    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, {
        recentlyPlayed: newRecentlyPlayed,
      })
    } catch (error) {
      console.error("Error updating recently played:", error)
    }
  }

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    addCoins,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyPlayed,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


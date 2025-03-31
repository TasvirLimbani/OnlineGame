import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
let app
let auth
let db
let storage

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)

  // Use local emulators if in development
  if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
    try {
      // Uncomment these lines if you're using Firebase emulators
      // connectAuthEmulator(auth, 'http://localhost:9099');
      // connectFirestoreEmulator(db, 'localhost', 8080);
      // connectStorageEmulator(storage, 'localhost', 9199);
    } catch (error) {
      console.error("Error connecting to Firebase emulators:", error)
    }
  }
} catch (error) {
  console.error("Error initializing Firebase:", error)

  // Create fallback instances if initialization fails
  if (!app) app = {} as any
  if (!auth) auth = {} as any
  if (!db) db = {} as any
  if (!storage) storage = {} as any
}

export { app, auth, db, storage }


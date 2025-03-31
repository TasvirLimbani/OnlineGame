import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyAfjefH_NIbRlBj9Xpr4IyY5TIp_Gp23_g",
  authDomain: "crazygamesin1.firebaseapp.com",
  projectId: "crazygamesin1",
  storageBucket: "crazygamesin1.firebasestorage.app",
  messagingSenderId: "26057354138",
  appId: "1:26057354138:web:8c8add22840a8041afe823",
  measurementId: "G-25TJS8XJ3D"
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


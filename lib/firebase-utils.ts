import { FirebaseError } from "firebase/app"

export function handleFirebaseError(error: unknown, fallbackMessage = "An error occurred"): string {
  if (error instanceof FirebaseError) {
    console.error(`Firebase error [${error.code}]: ${error.message}`)

    // Handle specific Firebase error codes
    if (error.code === "permission-denied") {
      return "Database access denied. Please check your Firebase security rules."
    }

    return error.message
  }

  console.error("Unknown error:", error)
  return fallbackMessage
}

export function isPermissionError(error: unknown): boolean {
  return error instanceof FirebaseError && error.code === "permission-denied"
}


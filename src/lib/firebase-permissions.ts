import { auth } from './firebase'
import { FirebaseConnectionManager } from './firebase'

/**
 * Check if the current user is authenticated and has permission to access Firestore
 */
export function canAccessFirestore(): boolean {
  try {
    const user = auth.currentUser
    const isOnline = FirebaseConnectionManager.getConnectionStatus()
    
    // Allow access if user is authenticated, even in offline mode
    // Firebase will handle offline operations automatically
    return !!user
  } catch (error) {
    console.warn('Error checking Firebase auth state:', error)
    return false
  }
}

/**
 * Check if the app is currently online
 */
export function isOnline(): boolean {
  try {
    return FirebaseConnectionManager.getConnectionStatus()
  } catch (error) {
    console.warn('Error checking connection status:', error)
    return true // Default to online if we can't check
  }
}

/**
 * Get the current user ID if authenticated
 */
export function getCurrentUserId(): string | null {
  try {
    const user = auth.currentUser
    return user?.uid || null
  } catch (error) {
    console.warn('Error getting current user ID:', error)
    return null
  }
}

/**
 * Wait for authentication to be ready
 */
export function waitForAuth(): Promise<boolean> {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(!!user)
    })
  })
}

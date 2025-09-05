import { initializeApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyBQXPhsNyuXdAg6CDBhKnBIE41rQTnCPh4",
  authDomain: "ev-rescue-premium.firebaseapp.com",
  projectId: "ev-rescue-premium",
  storageBucket: "ev-rescue-premium.firebasestorage.app",
  messagingSenderId: "1036918405847",
  appId: "1:1036918405847:web:879a517668cf00ee6cce92",
  measurementId: "G-WC06JBC4NG"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics (only in browser environment)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

// Firebase connection management
export class FirebaseConnectionManager {
  private static isOnline = true
  private static connectionListeners: Array<(isOnline: boolean) => void> = []

  static async initialize() {
    if (typeof window === 'undefined') return

    // Check initial connection status
    this.isOnline = navigator.onLine

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.isOnline = true
      this.notifyListeners(true)
      this.enableFirestore()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      this.notifyListeners(false)
      this.disableFirestore()
    })

    // Set initial Firestore state
    if (!this.isOnline) {
      await this.disableFirestore()
    } else {
      // Give Firebase a moment to initialize before enabling network
      setTimeout(() => {
        this.enableFirestore()
      }, 1000)
    }
  }

  static addConnectionListener(listener: (isOnline: boolean) => void) {
    this.connectionListeners.push(listener)
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener)
    }
  }

  private static notifyListeners(isOnline: boolean) {
    this.connectionListeners.forEach(listener => listener(isOnline))
  }

  private static async enableFirestore() {
    try {
      await enableNetwork(db)
      console.log('✅ Firestore network enabled')
    } catch (error) {
      console.warn('Failed to enable Firestore network:', error)
    }
  }

  private static async disableFirestore() {
    try {
      await disableNetwork(db)
      console.log('⚠️ Firestore network disabled - operating in offline mode')
    } catch (error) {
      console.warn('Failed to disable Firestore network:', error)
    }
  }

  static getConnectionStatus() {
    return this.isOnline
  }

  static isFirebaseInitialized() {
    try {
      // Check if Firebase services are available
      return !!(auth && db && typeof window !== 'undefined')
    } catch (error) {
      return false
    }
  }
}

// Initialize connection manager
if (typeof window !== 'undefined') {
  FirebaseConnectionManager.initialize()
}

export default app

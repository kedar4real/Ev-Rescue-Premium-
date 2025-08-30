import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
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

export default app

import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'

let adminApp: App | null = null

export function getFirebaseAdmin() {
  if (!adminApp) {
    // Only initialize if environment variables are available (runtime, not build time)
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      if (!getApps().length) {
        adminApp = initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          }),
        })
      } else {
        adminApp = getApps()[0]
      }
    } else {
      throw new Error('Firebase Admin environment variables not configured')
    }
  }
  return adminApp
}

export function getFirebaseAuth() {
  const app = getFirebaseAdmin()
  return getAuth(app)
}

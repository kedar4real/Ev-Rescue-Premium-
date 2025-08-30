# Firebase Deployment Script for EV Rescue Premium
# Run this script to deploy security rules and configuration

Write-Host "🔥 Deploying Firebase Security Rules..." -ForegroundColor Green

# Check if Firebase CLI is installed
try {
    $firebaseVersion = firebase --version
    Write-Host "✅ Firebase CLI found: $firebaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Firebase CLI not found. Installing..." -ForegroundColor Red
    npm install -g firebase-tools
}

# Login to Firebase (if not already logged in)
Write-Host "🔐 Logging into Firebase..." -ForegroundColor Yellow
firebase login

# Initialize Firebase project (if not already initialized)
if (-not (Test-Path ".firebaserc")) {
    Write-Host "🚀 Initializing Firebase project..." -ForegroundColor Yellow
    firebase init firestore
    firebase init storage
}

# Deploy Firestore security rules
Write-Host "📜 Deploying Firestore security rules..." -ForegroundColor Yellow
firebase deploy --only firestore:rules

# Deploy Storage security rules
Write-Host "🗄️ Deploying Storage security rules..." -ForegroundColor Yellow
firebase deploy --only storage

# Deploy Firestore indexes
Write-Host "🔍 Deploying Firestore indexes..." -ForegroundColor Yellow
firebase deploy --only firestore:indexes

Write-Host "✅ Firebase security rules deployed successfully!" -ForegroundColor Green
Write-Host "🌐 Visit https://console.firebase.google.com/project/ev-rescue-premium to verify" -ForegroundColor Cyan

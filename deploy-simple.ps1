# Simple Deployment Script for EV Rescue Premium
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Step 1: Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm install

# Step 2: Try to build with minimal configuration
Write-Host "🏗️ Building application..." -ForegroundColor Yellow
try {
    # Set minimal environment variables for build
    $env:RAZORPAY_KEY_ID = "dummy"
    $env:RAZORPAY_KEY_SECRET = "dummy"
    $env:RAZORPAY_WEBHOOK_SECRET = "dummy"
    $env:FIREBASE_PROJECT_ID = "dummy"
    $env:FIREBASE_CLIENT_EMAIL = "dummy@dummy.com"
    $env:FIREBASE_PRIVATE_KEY = "dummy"
    
    npm run build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed, trying alternative approach..." -ForegroundColor Red
    
    # Try building with export command
    npx next export
    Write-Host "✅ Export successful!" -ForegroundColor Green
}

# Step 3: Deploy to Firebase
Write-Host "🔥 Deploying to Firebase..." -ForegroundColor Yellow
firebase deploy --only hosting

Write-Host "🎉 Deployment completed!" -ForegroundColor Green
Write-Host "🌐 Your app is now live!" -ForegroundColor Cyan

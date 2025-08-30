# Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Razorpay Configuration
```bash
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### Optional: Google Maps API Key
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

## Setup Instructions

### 1. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication, Firestore, and Storage
4. Go to Project Settings > General
5. Copy the configuration values to your `.env.local` file

### 2. Razorpay Setup
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Get your API keys from Settings > API Keys
3. Add them to your `.env.local` file

### 3. Google Maps (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API
3. Create credentials and get API key
4. Add to your `.env.local` file

## Security Notes
- Never commit `.env.local` to version control
- Keep your API keys secure
- Use environment-specific keys for development/production
- Consider using a secrets management service for production

## Testing the Setup
After setting up your environment variables:

1. Restart your development server
2. Check the browser console for any configuration errors
3. Test authentication flow
4. Verify map loading (if using Google Maps)
5. Test payment integration (if using Razorpay)

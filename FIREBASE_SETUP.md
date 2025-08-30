# 🔥 Firebase Setup Guide for EV Rescue Premium

## Prerequisites
- Google account
- Firebase project (free tier available)

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ev-rescue-premium`
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable the following providers:
   - **Email/Password** ✅
   - **Google** ✅
   - **Facebook** ✅ (requires Facebook App setup)
   - **Twitter** ✅ (requires Twitter App setup)

### Email/Password Setup
- Click "Email/Password"
- Enable "Email/Password"
- Enable "Email link (passwordless sign-in)" (optional)

### Google Setup
- Click "Google"
- Enable Google sign-in
- Add your authorized domain (localhost for development)

### Facebook Setup (Optional)
- Create Facebook App at [developers.facebook.com](https://developers.facebook.com/)
- Add Facebook App ID and App Secret to Firebase

### Twitter Setup (Optional)
- Create Twitter App at [developer.twitter.com](https://developer.twitter.com/)
- Add Twitter API Key and API Secret to Firebase

## Step 3: Enable Firestore Database

1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select location closest to your users
4. Click "Done"

## Step 4: Enable Storage

1. Go to "Storage" → "Get started"
2. Choose "Start in test mode" (for development)
3. Select location closest to your users
4. Click "Done"

## Step 5: Get Configuration

1. Click the gear icon ⚙️ → "Project settings"
2. Scroll down to "Your apps"
3. Click the web app icon (</>)
4. Register app with name: `ev-rescue-premium-web`
5. Copy the configuration object

## Step 6: Environment Variables

1. Copy `env.example` to `.env.local`
2. Fill in your Firebase configuration:

```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Step 7: Security Rules

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Emergency requests - users can create, read their own
    match /emergencyRequests/{requestId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.providerId == request.auth.uid);
    }
    
    // Service providers can read emergency requests
    match /emergencyRequests/{requestId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'provider';
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Users can upload profile images
    match /users/{userId}/profile.jpg {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Emergency request images
    match /emergencyRequests/{requestId}/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 8: Test Authentication

1. Start your development server: `npm run dev`
2. Go to `/login` page
3. Try creating an account
4. Test sign in/sign out
5. Check Firebase Console → Authentication → Users

## Step 9: Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
firebase deploy --only storage
```

## Troubleshooting

### Common Issues:

1. **"Firebase App named '[DEFAULT]' already exists"**
   - Check if you have multiple Firebase configs
   - Ensure only one `initializeApp()` call

2. **"Permission denied" errors**
   - Check Firestore security rules
   - Verify user authentication state

3. **Social login popup blocked**
   - Check browser popup blocker
   - Verify authorized domains in Firebase Console

4. **Environment variables not loading**
   - Restart development server after adding `.env.local`
   - Check variable names start with `NEXT_PUBLIC_`

## Production Considerations

1. **Security Rules**: Update rules for production use
2. **Authorized Domains**: Add your production domain to Firebase
3. **API Keys**: Restrict API keys to your domains
4. **Monitoring**: Enable Firebase Performance Monitoring
5. **Analytics**: Set up Firebase Analytics for user insights

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)

---

**Note**: This setup provides a secure, scalable authentication system for EV Rescue Premium. All user data is stored securely in Firebase with proper access controls.

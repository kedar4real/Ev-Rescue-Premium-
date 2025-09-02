# 🚀 **EV Rescue Premium - Launch Setup Guide**

## **Step 1: Environment Variables (5 minutes)**

Create a `.env.local` file in your project root with these variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----\n"

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EV Rescue Premium
```

## **Step 2: Firebase Setup (15 minutes)**

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name: `ev-rescue-premium`
4. Enable Google Analytics
5. Create project

### 2.2 Enable Services
1. **Authentication**: Enable Email/Password
2. **Firestore**: Create database in test mode
3. **Storage**: Enable for file uploads
4. **Analytics**: Already enabled

### 2.3 Get Configuration
1. Project Settings → General → Your apps
2. Add web app: `ev-rescue-premium-web`
3. Copy config object to `.env.local`

### 2.4 Create Service Account
1. Project Settings → Service accounts
2. Generate new private key
3. Download JSON file
4. Extract values for Admin SDK

## **Step 3: Razorpay Setup (10 minutes)**

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up and complete KYC
3. Go to Settings → API Keys
4. Generate new API keys
5. Copy to `.env.local`

## **Step 4: Test Your App (5 minutes)**

```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- ✅ User registration/login
- ✅ Emergency request creation
- ✅ Payment flow
- ✅ Dashboard with real data

## **Step 5: Deploy to Production (30 minutes)**

### Option A: Vercel (Recommended)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Option B: Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

### Production Environment Variables
Update these in your hosting platform:
- `NEXT_PUBLIC_APP_URL=https://yourdomain.com`
- Add your domain to Firebase authorized domains

## **Step 6: Database Security Rules (10 minutes)**

Deploy these Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /emergencyRequests/{requestId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         resource.data.assignedProvider.id == request.auth.uid);
    }
    
    match /fleetVehicles/{vehicleId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['provider', 'admin'];
    }
    
    match /chargingStations/{stationId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

## **🎯 Your App is Ready!**

### **What You Have:**
- ✅ **Real Database**: Firestore with proper schemas
- ✅ **Secure APIs**: Authentication and authorization
- ✅ **Payment System**: Razorpay integration
- ✅ **Analytics**: Comprehensive tracking
- ✅ **Real-time Updates**: Live data synchronization
- ✅ **Professional UI**: Consistent design system
- ✅ **Mobile Responsive**: Works on all devices

### **Revenue Streams:**
1. **Subscription Plans**: Basic, Premium, Enterprise
2. **Per-Request Fees**: Emergency service charges
3. **Provider Commissions**: Fleet management fees
4. **Premium Features**: Advanced analytics, priority support

### **Next Features to Add:**
1. **Push Notifications**: Real-time alerts
2. **SMS Integration**: Emergency notifications
3. **Mobile App**: React Native version
4. **AI Chatbot**: Customer support automation
5. **Advanced Analytics**: Business intelligence dashboard

## **🚀 Launch Checklist:**

- [ ] Environment variables configured
- [ ] Firebase project set up
- [ ] Razorpay account created
- [ ] App tested locally
- [ ] Deployed to production
- [ ] Domain configured
- [ ] Security rules deployed
- [ ] Payment flow tested
- [ ] Analytics working
- [ ] Mobile responsive verified

**Your EV Rescue Premium app is now ready to serve real customers and generate revenue! 🎉**

---

**Need help with any step? Check the detailed `ENVIRONMENT_SETUP.md` file or ask for assistance!**

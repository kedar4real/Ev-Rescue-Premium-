# 🔧 Environment Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-private-key-here\n-----END PRIVATE KEY-----\n"

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EV Rescue Premium

# Optional: Google Maps API (for enhanced mapping)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Optional: Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key

# Optional: Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-measurement-id
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `ev-rescue-premium`
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. Go to "Authentication" → "Sign-in method"
2. Enable Email/Password
3. Enable Google (optional)
4. Add authorized domains

### 3. Enable Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (for development)
3. Select location closest to your users

### 4. Enable Storage
1. Go to "Storage" → "Get started"
2. Choose "Start in test mode"
3. Select location closest to your users

### 5. Get Web App Configuration
1. Click gear icon → "Project settings"
2. Scroll to "Your apps"
3. Click web app icon (</>)
4. Register app with name: `ev-rescue-premium-web`
5. Copy the configuration object

### 6. Create Service Account (for Admin SDK)
1. Go to "Project settings" → "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the values for `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY`

## 💳 Razorpay Setup

### 1. Create Razorpay Account
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up for an account
3. Complete KYC verification

### 2. Get API Keys
1. Go to "Settings" → "API Keys"
2. Generate new API keys
3. Copy `Key ID` and `Key Secret`

### 3. Configure Webhooks (Optional)
1. Go to "Settings" → "Webhooks"
2. Add webhook URL: `https://yourdomain.com/api/razorpay/webhook`
3. Select events: `payment.captured`, `payment.failed`

## 🗄️ Database Schema Setup

### Firestore Collections Structure

```typescript
// users/{userId}
{
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string
  role: 'user' | 'provider' | 'admin'
  vehicleType: 'car' | 'motorcycle' | 'scooter' | 'truck'
  vehicleModel: string
  vehicleYear: number
  batteryCapacity: number
  currentLocation: {
    lat: number
    lng: number
    address: string
    lastUpdated: Timestamp
  }
  isProvider: boolean
  rating: number
  totalRescues: number
  subscription: {
    plan: 'basic' | 'premium' | 'enterprise'
    status: 'active' | 'inactive' | 'cancelled'
    startDate: Timestamp
    endDate: Timestamp
    requestsUsed: number
    requestsLimit: number
  }
  preferences: {
    notifications: boolean
    locationTracking: boolean
    emergencyContacts: string[]
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

// emergencyRequests/{requestId}
{
  id: string
  userId: string
  userInfo: {
    name: string
    phone: string
    email: string
  }
  location: {
    lat: number
    lng: number
    address: string
  }
  vehicleInfo: {
    type: string
    model: string
    batteryLevel: number
  }
  requestType: 'charging' | 'towing' | 'jump_start' | 'tire_change' | 'other'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
  assignedProvider?: {
    id: string
    name: string
    phone: string
    vehicleId: string
  }
  estimatedArrival?: Timestamp
  actualArrival?: Timestamp
  completionTime?: Timestamp
  notes: string
  images: string[]
  cost: number
  rating?: number
  feedback?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}

// fleetVehicles/{vehicleId}
{
  id: string
  name: string
  type: 'mobile_charger' | 'tow_truck' | 'service_van'
  status: 'available' | 'busy' | 'maintenance' | 'offline'
  location: {
    lat: number
    lng: number
    address: string
    lastUpdated: Timestamp
  }
  driver: {
    id: string
    name: string
    phone: string
    license: string
  }
  equipment: {
    chargingCapacity: number
    batteryLevel: number
    tools: string[]
  }
  currentRequest?: string
  totalServices: number
  rating: number
  lastMaintenance: Timestamp
  nextMaintenance: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}

// chargingStations/{stationId}
{
  id: string
  name: string
  location: {
    lat: number
    lng: number
    address: string
  }
  operator: string
  connectors: {
    type: 'CCS' | 'CHAdeMO' | 'Type2' | 'Tesla'
    power: number
    status: 'available' | 'occupied' | 'out_of_order'
  }[]
  pricing: {
    perKwh: number
    perMinute: number
    parkingFee: number
  }
  amenities: string[]
  rating: number
  totalReviews: number
  isVerified: boolean
  lastUpdated: Timestamp
}

// notifications/{notificationId}
{
  id: string
  userId: string
  type: 'emergency' | 'service_update' | 'payment' | 'promotion' | 'system'
  title: string
  message: string
  data?: any
  isRead: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: Timestamp
  expiresAt?: Timestamp
}

// analytics/{date}
{
  id: string
  date: string
  metrics: {
    totalUsers: number
    activeUsers: number
    newUsers: number
    totalRequests: number
    completedRequests: number
    averageResponseTime: number
    revenue: number
    fleetUtilization: number
    userSatisfaction: number
  }
  breakdown: {
    requestTypes: Record<string, number>
    userSegments: Record<string, number>
    geographic: Record<string, number>
    timeOfDay: Record<string, number>
  }
  createdAt: Timestamp
}
```

## 🔒 Security Rules

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
         resource.data.assignedProvider.id == request.auth.uid);
    }
    
    // Service providers can read emergency requests
    match /emergencyRequests/{requestId} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['provider', 'admin'];
    }
    
    // Fleet vehicles - providers and admins only
    match /fleetVehicles/{vehicleId} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['provider', 'admin'];
    }
    
    // Charging stations - public read, admin write
    match /chargingStations/{stationId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Notifications - users can read their own
    match /notifications/{notificationId} {
      allow read, update: if request.auth != null && 
        resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
    
    // Analytics - admin only
    match /analytics/{date} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
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
    
    // Fleet vehicle images
    match /fleetVehicles/{vehicleId}/{fileName} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['provider', 'admin'];
    }
  }
}
```

## 🚀 Deployment Checklist

### Before Deploying:
- [ ] Set up all environment variables
- [ ] Configure Firebase project
- [ ] Set up Razorpay account
- [ ] Deploy Firestore security rules
- [ ] Deploy Storage security rules
- [ ] Test all API endpoints
- [ ] Verify payment flow
- [ ] Test real-time features

### Production Environment Variables:
```bash
# Update these for production
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
# Add your production domain to Firebase authorized domains
```

## 🧪 Testing

### Test API Endpoints:
```bash
# Test emergency request creation
curl -X POST http://localhost:3000/api/emergency-requests/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"location":{"lat":40.7128,"lng":-74.0060,"address":"New York, NY"},"vehicleInfo":{"type":"car","model":"Tesla Model 3","batteryLevel":20},"requestType":"charging","priority":"high"}'

# Test analytics
curl -X GET http://localhost:3000/api/analytics/dashboard?period=7d \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📞 Support

If you need help with setup:
1. Check Firebase documentation
2. Check Razorpay documentation
3. Review the error logs in your browser console
4. Check the server logs in your terminal

---

**Your EV Rescue Premium app is now ready for production with real databases and analytics! 🚀**
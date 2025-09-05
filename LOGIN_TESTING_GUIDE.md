# Login Testing Guide - EV Rescue Premium

## How to Test Login Functionality

### 1. **Visual Debugging with AuthDebugger**
- The AuthDebugger component is now added to your app (bottom-right corner)
- It shows real-time authentication status, user data, and storage information
- Only visible in development mode (not in production)

### 2. **Testing Steps**

#### **Step 1: Check Initial State**
1. Open your app in the browser
2. Look at the AuthDebugger in the bottom-right corner
3. Verify:
   - Status: "Not Authenticated"
   - Loading: "No"
   - No user data displayed

#### **Step 2: Test Registration**
1. Go to `/register` page
2. Fill out the registration form with test data:
   ```
   Email: test@example.com
   Password: testpassword123
   First Name: Test
   Last Name: User
   Phone: +1234567890
   Address: 123 Test Street, Test City
   ```
3. Submit the form
4. Check AuthDebugger for:
   - Status: "Authenticated"
   - User ID: Should show a Firebase UID
   - Email: test@example.com
   - Profile data should be populated

#### **Step 3: Test Login**
1. Sign out (if logged in)
2. Go to `/login` page
3. Use the same credentials from registration
4. Check AuthDebugger for successful authentication

#### **Step 4: Test Data Persistence**
1. After successful login, refresh the page
2. Check if user remains authenticated
3. Verify user profile data is still loaded
4. Check browser's localStorage and sessionStorage:
   - Open Developer Tools (F12)
   - Go to Application tab
   - Check Local Storage and Session Storage for Firebase data

### 3. **Browser Storage Verification**

#### **Local Storage Check:**
```javascript
// In browser console
console.log('Firebase Auth in localStorage:', localStorage.getItem('firebase:authUser'))
console.log('All localStorage keys:', Object.keys(localStorage))
```

#### **Session Storage Check:**
```javascript
// In browser console
console.log('Firebase Auth in sessionStorage:', sessionStorage.getItem('firebase:authUser'))
console.log('All sessionStorage keys:', Object.keys(sessionStorage))
```

### 4. **Firebase Console Verification**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `ev-rescue-premium`
3. Go to **Authentication** → **Users**
4. Verify your test user appears in the list
5. Go to **Firestore Database** → **users** collection
6. Verify user profile document exists with all the data

### 5. **Common Issues & Solutions**

#### **Issue: User not persisting after refresh**
- **Check:** Firebase configuration in `src/lib/firebase.ts`
- **Check:** AuthProvider is wrapping the app in `src/app/layout.tsx`
- **Check:** Browser console for Firebase errors

#### **Issue: Registration fails**
- **Check:** Firebase project settings
- **Check:** Authentication methods enabled in Firebase Console
- **Check:** Network tab in Developer Tools for API errors

#### **Issue: Login fails**
- **Check:** User exists in Firebase Authentication
- **Check:** Password is correct
- **Check:** Email is verified (if email verification is required)

### 6. **Testing Different Scenarios**

#### **Valid Login:**
- Use registered credentials
- Should redirect to dashboard
- AuthDebugger should show "Authenticated"

#### **Invalid Login:**
- Wrong email: Should show "No account found with this email address"
- Wrong password: Should show "Incorrect password"
- AuthDebugger should show error details

#### **Social Login:**
- Test Google, Facebook, Twitter login buttons
- Check if popup opens and authentication completes
- Verify user profile is created in Firestore

### 7. **Network Monitoring**

1. Open Developer Tools → Network tab
2. Try logging in
3. Look for Firebase API calls:
   - `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword`
   - `https://firestore.googleapis.com/v1/projects/ev-rescue-premium/databases/(default)/documents`

### 8. **Console Logging**

The authentication system includes console logging. Check browser console for:
- Authentication state changes
- User profile loading
- Error messages
- Firebase API responses

### 9. **Expected Behavior**

#### **Successful Login:**
- User redirected to dashboard
- AuthDebugger shows authenticated state
- User profile data loaded
- Firebase auth token stored in browser
- User data persisted in Firestore

#### **Failed Login:**
- Error message displayed
- User stays on login page
- AuthDebugger shows error details
- No authentication state change

### 10. **Production Testing**

Before deploying:
1. Test with real email addresses
2. Test password reset functionality
3. Test social login with real accounts
4. Verify all error messages are user-friendly
5. Test on different browsers and devices

## Quick Test Commands

```bash
# Start development server
npm run dev

# Check for TypeScript errors
npm run build

# Run linting
npm run lint
```

## Firebase Project Details

- **Project ID:** ev-rescue-premium
- **Auth Domain:** ev-rescue-premium.firebaseapp.com
- **Database:** Firestore
- **Storage:** Firebase Storage

## Support

If you encounter issues:
1. Check the AuthDebugger for real-time status
2. Check browser console for errors
3. Verify Firebase project configuration
4. Check network requests in Developer Tools

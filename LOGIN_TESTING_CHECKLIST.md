# 🔐 Login & Authorization Testing Checklist

## ✅ **Step-by-Step Testing Guide**

### **1. Initial Setup Check**
- [ ] Development server is running (`npm run dev`)
- [ ] App opens at `http://localhost:3000`
- [ ] AuthDebugger appears in bottom-right corner (development only)
- [ ] No console errors on page load

### **2. Pre-Login State Verification**
- [ ] AuthDebugger shows "Not Authenticated"
- [ ] AuthDebugger shows "Loading: No"
- [ ] No user data displayed in AuthDebugger
- [ ] Login page accessible at `/login`

### **3. Registration Testing**
- [ ] Navigate to `/register`
- [ ] Fill registration form with test data:
  ```
  Email: testuser@example.com
  Password: TestPassword123!
  First Name: Test
  Last Name: User
  Phone: +1234567890
  Address: 123 Test Street, Test City
  ```
- [ ] Submit form successfully
- [ ] AuthDebugger shows "Authenticated" status
- [ ] User ID appears in AuthDebugger
- [ ] Email shows in AuthDebugger
- [ ] Profile data populated in AuthDebugger

### **4. Login Testing**
- [ ] Sign out (if logged in)
- [ ] Navigate to `/login`
- [ ] Use registered credentials:
  ```
  Email: testuser@example.com
  Password: TestPassword123!
  ```
- [ ] Login successful
- [ ] AuthDebugger shows "Authenticated"
- [ ] Redirected to dashboard or appropriate page

### **5. Data Persistence Testing**
- [ ] After successful login, refresh the page (F5)
- [ ] User remains authenticated after refresh
- [ ] User profile data still loaded
- [ ] AuthDebugger still shows "Authenticated"

### **6. Browser Storage Verification**
- [ ] Open Developer Tools (F12)
- [ ] Go to Application tab
- [ ] Check Local Storage for Firebase data
- [ ] Check Session Storage for Firebase data
- [ ] Run in console:
  ```javascript
  console.log('Firebase Auth:', localStorage.getItem('firebase:authUser'))
  ```

### **7. Error Handling Testing**
- [ ] Try login with wrong email
- [ ] Try login with wrong password
- [ ] Verify appropriate error messages appear
- [ ] AuthDebugger shows error details

### **8. Social Login Testing**
- [ ] Test Google login button
- [ ] Test Facebook login button
- [ ] Test Twitter login button
- [ ] Verify popup opens and authentication completes

### **9. Firebase Console Verification**
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Select project: `ev-rescue-premium`
- [ ] Check Authentication → Users for test user
- [ ] Check Firestore → users collection for profile data

### **10. Network Monitoring**
- [ ] Open Developer Tools → Network tab
- [ ] Attempt login
- [ ] Look for Firebase API calls:
  - `identitytoolkit.googleapis.com`
  - `firestore.googleapis.com`
- [ ] Verify successful API responses

## 🚨 **Common Issues & Quick Fixes**

### **Issue: "useAuth must be used within an AuthProvider"**
- **Fix:** Ensure AuthProvider wraps the app in `layout.tsx`
- **Check:** All pages using `useAuth()` are client-side components

### **Issue: User not persisting after refresh**
- **Check:** Firebase configuration in `src/lib/firebase.ts`
- **Check:** Browser console for Firebase errors
- **Check:** Network connectivity

### **Issue: Registration fails**
- **Check:** Firebase project settings
- **Check:** Authentication methods enabled
- **Check:** Network tab for API errors

### **Issue: Login fails with correct credentials**
- **Check:** User exists in Firebase Authentication
- **Check:** Email verification status
- **Check:** Password strength requirements

## 📱 **Mobile Testing**
- [ ] Test on mobile device or browser dev tools mobile view
- [ ] Verify responsive design works
- [ ] Test touch interactions
- [ ] Check AuthDebugger on mobile (if visible)

## 🔧 **Debug Commands**

### **Browser Console Commands:**
```javascript
// Check authentication state
console.log('Current user:', firebase.auth().currentUser)

// Check localStorage
console.log('All localStorage:', Object.keys(localStorage))

// Check sessionStorage
console.log('All sessionStorage:', Object.keys(sessionStorage))

// Clear all storage (for testing)
localStorage.clear()
sessionStorage.clear()
```

### **Firebase Console Checks:**
1. **Authentication → Users:** Verify user exists
2. **Firestore → users:** Verify profile document exists
3. **Authentication → Sign-in method:** Verify email/password enabled

## ✅ **Success Criteria**

### **Login System is Working If:**
- [ ] Users can register successfully
- [ ] Users can login with correct credentials
- [ ] Authentication state persists after page refresh
- [ ] User data is stored in Firebase
- [ ] Error handling works for invalid credentials
- [ ] AuthDebugger shows real-time status
- [ ] No console errors during authentication flow

### **Ready for Production If:**
- [ ] All tests pass
- [ ] No console errors
- [ ] Firebase project properly configured
- [ ] Error messages are user-friendly
- [ ] Mobile experience works well
- [ ] Social login functions properly

## 🎯 **Next Steps After Testing**

Once login testing is complete:
1. **Fix any issues found**
2. **Test on different browsers**
3. **Test with real email addresses**
4. **Prepare for production deployment**
5. **Move to app improvements and enhancements**

---

**Note:** The AuthDebugger component will help you monitor the authentication state in real-time during testing. It's only visible in development mode and will not appear in production builds.

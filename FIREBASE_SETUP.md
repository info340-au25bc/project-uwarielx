# Firebase Setup Instructions

## Quick Start (5 minutes)

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Add project" (or "Create a project")
3. Enter project name: `tripweaver` (or any name you want)
4. Disable Google Analytics (not needed for this project)
5. Click "Create project"

### Step 2: Enable Email Authentication
1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Email/Password" option
4. Toggle "Enable" to ON
5. Click "Save"

### Step 3: Enable Firestore Database
1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in test mode" (we'll secure it later)
4. Choose a location (select the closest to you)
5. Click "Enable"

### Step 4: Get Your Configuration
1. Click the gear icon (⚙️) next to "Project Overview" at the top left
2. Click "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon `</>` (it says "Web")
5. Enter app nickname: `tripweaver-web`
6. Click "Register app"
7. You'll see a `firebaseConfig` object - **COPY THIS**

It will look like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB...",
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Step 5: Update Your Code
1. Open `src/firebase.js` in your project
2. Replace the placeholder values with your actual config:
   - Replace `YOUR_API_KEY` with your `apiKey`
   - Replace `YOUR_AUTH_DOMAIN` with your `authDomain`
   - Replace `YOUR_PROJECT_ID` with your `projectId`
   - Replace `YOUR_STORAGE_BUCKET` with your `storageBucket`
   - Replace `YOUR_MESSAGING_SENDER_ID` with your `messagingSenderId`
   - Replace `YOUR_APP_ID` with your `appId`

3. Save the file

### Step 6: Test It
1. Your dev server should automatically reload
2. Click "Sign In" button
3. Try creating a new account
4. You should be able to sign up and sign in!

## Troubleshooting

**"Firebase is not configured"**
- Make sure you replaced ALL placeholder values in `src/firebase.js`

**"Invalid API key"**
- Double-check you copied the exact API key from Firebase console
- Make sure there are no extra spaces

**Still not working?**
- Check the browser console (F12) for detailed error messages
- Make sure you enabled Email/Password authentication in Firebase console
- Try refreshing the page

## Security Note
For production, you should:
1. Use environment variables (create a `.env` file)
2. Add proper Firestore security rules
3. Restrict API key usage in Firebase console

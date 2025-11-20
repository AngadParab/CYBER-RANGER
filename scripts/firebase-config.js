// scripts/firebase-config.js

// Import the core functions needed
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";

// NEW: Import Authentication and Firestore SDKs
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRMJNDa0__NPI7p9-3LIeX2q228liz0F8",
    authDomain: "cyber-ranger.firebaseapp.com",
    projectId: "cyber-ranger",
    storageBucket: "cyber-ranger.firebasestorage.app",
    messagingSenderId: "783225495647",
    appId: "1:783225495647:web:7efb25367c38d388963bea",
    measurementId: "G-8YCKF4F33Z"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize all services
const analytics = getAnalytics(app);
const auth = getAuth(app);      // Authentication service
const db = getFirestore(app);   // Firestore database service


// EXPORT the services so they can be imported and used in other files (like login.js, news.js, etc.)
export {
    app,
    analytics,
    auth,   // Exporting Authentication for login/logout functionality
    db      // Exporting Firestore for data fetching and saving (in admin panel)
};
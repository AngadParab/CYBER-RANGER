// scripts/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
// 1. ADD THIS IMPORT
import { getStorage } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRMJNDa0__NPI7p9-3LIeX2q228liz0F8",
    authDomain: "cyber-ranger.firebaseapp.com",
    projectId: "cyber-ranger",
    storageBucket: "cyber-ranger.firebasestorage.app",
    messagingSenderId: "783225495647",
    appId: "1:783225495647:web:7efb25367c38d388963bea",
    measurementId: "G-8YCKF4F33Z"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
// 2. INITIALIZE STORAGE
const storage = getStorage(app);

// 3. EXPORT STORAGE
export { app, analytics, auth, db, storage };
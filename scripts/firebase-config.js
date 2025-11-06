
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: "AIzaSyDRMJNDa0__NPI7p9-3LIeX2q228liz0F8",
    authDomain: "cyber-ranger.firebaseapp.com",
    projectId: "cyber-ranger",
    storageBucket: "cyber-ranger.firebasestorage.app",
    messagingSenderId: "783225495647",
    appId: "1:783225495647:web:7efb25367c38d388963bea",
    measurementId: "G-8YCKF4F33Z"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);

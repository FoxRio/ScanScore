// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2P9ItUBpR-LMBHrH2uou5Ak0TI84EjX8",
  authDomain: "scanscore-6cbf7.firebaseapp.com",
  projectId: "scanscore-6cbf7",
  storageBucket: "scanscore-6cbf7.appspot.com",
  messagingSenderId: "202414410142",
  appId: "1:202414410142:web:1f5e4c19704348f118ae8f",
  measurementId: "G-MEJJ1GDDDT"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export the services for use in your components
export { auth, db, storage };
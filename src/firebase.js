// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDYF4ER5lbQB0yA1Vrq0dcHlud16KtsyhE",
  authDomain: "info340project-432e9.firebaseapp.com",
  projectId: "info340project-432e9",
  storageBucket: "info340project-432e9.firebasestorage.app",
  messagingSenderId: "13478388916",
  appId: "1:13478388916:web:acc93b89d5b9fe12a1e3e1",
  measurementId: "G-K716NZPG78"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;


// const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5AOgl9OUSTPxFxXVcZTA4ggY9BIH3ASs",
  authDomain: "mern-real-estate-a23f0.firebaseapp.com",
  projectId: "mern-real-estate-a23f0",
  storageBucket: "mern-real-estate-a23f0.appspot.com",
  messagingSenderId: "712120595921",
  appId: "1:712120595921:web:6317fba382d5df2a5f9cf0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

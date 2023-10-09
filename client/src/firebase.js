// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-real-estate-a23f0.firebaseapp.com",
  projectId: "mern-real-estate-a23f0",
  storageBucket: "mern-real-estate-a23f0.appspot.com",
  messagingSenderId: "712120595921",
  appId: "1:712120595921:web:6317fba382d5df2a5f9cf0",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

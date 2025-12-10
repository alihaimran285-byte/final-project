// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ✅ YAHAN APNI ACTUAL FIREBASE CONFIGURATION PASTE KAREIN
const firebaseConfig = {
 apiKey: "AIzaSyBtMwyk2SraV6cqvhXbMZQj22-rK4I3e7k",
  authDomain: "school-managemment-system.firebaseapp.com",
  projectId: "school-managemment-system",
  storageBucket: "school-managemment-system.firebasestorage.app",
  messagingSenderId: "20532689266",
  appId: "1:20532689266:web:4986abf67be2ec819c05eb",
  measurementId: "G-5TBP4EREXR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
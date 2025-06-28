// src/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyAW_6QHfk661SXao9MLX9lF-CQD5sNSE30",
    authDomain: "movie-ticket-booking-47dbd.firebaseapp.com",
    projectId: "movie-ticket-booking-47dbd",
    storageBucket: "movie-ticket-booking-47dbd.firebasestorage.app",
    databaseURL: "https://movie-ticket-booking-47dbd-default-rtdb.asia-southeast1.firebasedatabase.app",
    messagingSenderId: "485104805815",
    appId: "1:485104805815:web:5358bc6b5cb2922e0d2a32",
    measurementId: "G-FK2SSZGM78"
  };

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getDatabase(app);
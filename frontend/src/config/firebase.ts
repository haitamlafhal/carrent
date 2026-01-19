// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, getAuth } from 'firebase/auth'; // Added getAuth
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyClJ7FdTVi1QpHkYSptoP2-m30sA9-K6xY",
    authDomain: "rented-208a6.firebaseapp.com",
    projectId: "rented-208a6",
    storageBucket: "rented-208a6.appspot.com",
    messagingSenderId: "65667586852",
    appId: "1:65667586852:web:e4116be0d9f27c120bf1b1",
    measurementId: "G-1DW6ECHEC6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
// Robust initialization to handle version discrepancies
let auth;

try {
    // Try to use persistence if available
    if (typeof getReactNativePersistence === 'function') {
        auth = initializeAuth(app, {
            persistence: getReactNativePersistence(AsyncStorage)
        });
    } else {
        // Fallback if function is missing
        console.warn("getReactNativePersistence not found, falling back to default auth");
        auth = getAuth(app);
    }
} catch (e) {
    console.error("Auth initialization error:", e);
    auth = getAuth(app);
}

export { auth };

// Initialize services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;

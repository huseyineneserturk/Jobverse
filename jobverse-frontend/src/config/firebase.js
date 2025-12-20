// Firebase Configuration for Jobverse Frontend
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC1W9uA_8gEwCwBfjLp1c-v3rTdpW199a0",
    authDomain: "jobverse-5a9ef.firebaseapp.com",
    projectId: "jobverse-5a9ef",
    storageBucket: "jobverse-5a9ef.firebasestorage.app",
    messagingSenderId: "525243359228",
    appId: "1:525243359228:web:f15081a54b4df21f8c9c79",
    measurementId: "G-BPJX5ZEHNN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase services
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

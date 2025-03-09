// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCvFG2ycSrbws5g3RAilDpc_PwRjf9MoA",
  authDomain: "submission-9a664.firebaseapp.com",
  projectId: "submission-9a664",
  storageBucket: "submission-9a664.firebasestorage.app",
  messagingSenderId: "1085882626452",
  appId: "1:1085882626452:web:942abdda801c47b26b5f81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
// firebase-init.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDPpjIi7FprXIRPBHMS1aCE5dWRbYO4C8E",
  authDomain: "yuju-wall.firebaseapp.com",
  projectId: "yuju-wall",
  storageBucket: "yuju-wall.firebasestorage.app",
  messagingSenderId: "1046860516937",
  appId: "1:1046860516937:web:96b9baa9df4e807f2bb998"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

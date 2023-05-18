import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "chat-app-e5b32.firebaseapp.com",
  projectId: "chat-app-e5b32",
  storageBucket: "chat-app-e5b32.appspot.com",
  messagingSenderId: "864333004147",
  appId: "1:864333004147:web:3f2b4eba2d61f2785e1906",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);

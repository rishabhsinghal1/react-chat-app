import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCKPSdm_wLybRhCtcxN9slNWXjaY-4gweQ",
  authDomain: "real-time-chat-applicati-af791.firebaseapp.com",
  projectId: "real-time-chat-applicati-af791",
  storageBucket: "real-time-chat-applicati-af791.appspot.com",
  messagingSenderId: "907012371855",
  appId: "1:907012371855:web:c82ec17dd18c4814c607fa"
};

export const app = initializeApp(firebaseConfig);
// app.use(cors);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
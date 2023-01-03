import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsyqJV1Ec4iAun-bUg5XdUxKy2jNyaGes",
  authDomain: "tcl-54-smart-shopping-list.firebaseapp.com",
  projectId: "tcl-54-smart-shopping-list",
  storageBucket: "tcl-54-smart-shopping-list.appspot.com",
  messagingSenderId: "709830815934",
  appId: "1:709830815934:web:2200c35d32c7c264fbeeef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

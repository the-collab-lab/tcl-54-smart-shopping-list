import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyAQorM_Dw72ZnhI8z9pAWPTvGfOMx1cVuU',
	authDomain: 'tcl-54-knead-to-buy.firebaseapp.com',
	projectId: 'tcl-54-knead-to-buy',
	storageBucket: 'tcl-54-knead-to-buy.appspot.com',
	messagingSenderId: '717284945941',
	appId: '1:717284945941:web:4f6caadc7dcb45df709e1c',
	// measurementId: "G-4C84VKJMJZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

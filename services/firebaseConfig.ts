// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCZxaMwlWNmSAW-0hE5AAtcvCCoLLP9qF4",
    authDomain: "verva-to-do-list.firebaseapp.com",
    projectId: "verva-to-do-list",
    storageBucket: "verva-to-do-list.firebasestorage.app",
    messagingSenderId: "491635168586",
    appId: "1:491635168586:web:f1308e8c84f91c24569db3",
    measurementId: "G-JGYLN5NDSW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();

export default app;

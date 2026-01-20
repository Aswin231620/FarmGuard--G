
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyACzyxpCZO7s_E0p12BDYvC_0Hw5QUan_o",
    authDomain: "farmguard-3dbdb.firebaseapp.com",
    projectId: "farmguard-3dbdb",
    storageBucket: "farmguard-3dbdb.firebasestorage.app",
    messagingSenderId: "54844454481",
    appId: "1:54844454481:web:ef54b8ad3506cc5f812a70"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;

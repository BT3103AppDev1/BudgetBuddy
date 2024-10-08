// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAN-vVW46wKoqjR2WfhKoc7G2KwbjSsb6k",
  authDomain: "budgetbuddy-190c9.firebaseapp.com",
  projectId: "budgetbuddy-190c9",
  storageBucket: "budgetbuddy-190c9.appspot.com",
  messagingSenderId: "923067373606",
  appId: "1:923067373606:web:fa85b8338713ccef936ee7",
  measurementId: "G-31CY8FVMSB",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth and set persistence
const auth = getAuth(firebaseApp);
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export default firebaseApp;
export const storage = getStorage(firebaseApp);

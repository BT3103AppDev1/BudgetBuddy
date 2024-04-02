import firebase from "firebase/compat/app";

const firebaseConfig = {
    apiKey: "AIzaSyAN-vVW46wKoqjR2WfhKoc7G2KwbjSsb6k",
    authDomain: "budgetbuddy-190c9.firebaseapp.com",
    projectId: "budgetbuddy-190c9",
    storageBucket: "budgetbuddy-190c9.appspot.com",
    messagingSenderId: "923067373606",
    appId: "1:923067373606:web:fa85b8338713ccef936ee7",
    measurementId: "G-31CY8FVMSB",
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase;


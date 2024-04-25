import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
import firebaseApp from "./firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Create the Vue app instance
const app = createApp(App);

// Initialize Firebase
const auth = getAuth(firebaseApp);
let hasInitialized = false;

onAuthStateChanged(auth, (user) => {
  if (!hasInitialized) {
    hasInitialized = true;
    if (user) {
      console.log("User is signed in");
      app.config.globalProperties.$currentUser = user;
    } else {
      console.log("User is signed out");
      app.config.globalProperties.$currentUser = null;
    }
    app.use(router).mount("#app");
  }
});

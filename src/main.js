import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/index.js";
//import firebase from 'firebase';
//import firebaseui from 'firebaseui';

// Create the Vue app instance
const app = createApp(App);

// Use Vue Router
app.use(router);

// Mount the app
app.mount("#app");

<template>
    <sidebar/>
    <div class="navigate-back" @click="navigateBack()">
        <ion-icon name="arrow-back"></ion-icon>
        <span>Edit User Profile</span>
    </div>

    <div class="user-profile">
        <h2>User Profile</h2>
        <img :src="userPicture || '@/assets/profile-user.png'" alr="User Profile Picture"/>

        <div class="form-group">
            <label for="username">Username</label>
            <input
                type="text"
                id="name"
                required
                class="input-field"
            />
        </div>

        <div class="form-group">
            <label for="email">Email</label>
            <input
                type="text"
                id="name"
                required
                class="input-field"
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="text"
                id="name"
                required
                class="input-field"
            />
        </div>

        <div class="form-group">
            <label for="confirmpw">Confirm Password</label>
            <input
                type="text"
                id="name"
                required
                class="input-field"
            />
        </div>

        <div class="button-container">
            <button class="btn" @click="editProfile()">Save</button>
        </div>

    </div>

</template>

<script>
import firebase from "@/uifire.js";
//import 'firebase/compat/auth'
import firebaseApp from "@/firebase.js";
import sidebar from "../components/sidebar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "editProfile",
  components: {
    sidebar,
  },
  data() {
    return {
      user: null,
      userEmail: "nothing",
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        this.username = user.displayName;
        this.userPicture = user.photoURL;
      }
    });
  },
  methods: {
    navigateBack() {
      this.$router.back();
    },
  }
};
</script>

<style scoped>
.navigate-back {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    position: fixed; /* Position the container fixed to the viewport */
    top: 5%; /* Position it at the top */
    left: 20%; 
    width: 50%;
    z-index: 999; /* Ensure it's above other content */
    font-size: 20px;
    cursor: pointer;
}
.navigate-back ion-icon {
    margin-right: 20px;
    width: 30px;
    height: 30px;
}
.user-profile {
    max-width: 600px; /* Adjust the width as needed */
    margin: 100px auto 0; /* This centers your form on the page */
    padding: 2rem;
    background-color: #fff; /* Use color from your design */
    border-radius: 10px; /* Rounded corners */
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* subtle shadow */
}
.user-profile h2 {
  margin-bottom: 1.5rem;
  color: #333; /* Use color from your design */
  text-align: center;
}
.user-profile img {
    margin-top: -10px;
    margin-bottom: 20px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666; /* Use color from your design */
}
.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd; /* Use color from your design */
  border-radius: 5px;
  font-size: 1rem;
}
.btn {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 25px;
  color: white;
  margin-top: 20px;
  width: 100%;
  padding: 2%;
  background-color: #474745;
  cursor: pointer;
}

.btn:hover {
  text-decoration: underline;
  font-weight: 900;
}

.button-container {
  display: flex;
  justify-content: center;
}
</style>
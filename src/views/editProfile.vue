<template>
  <sidebar />
  <div class="navigate-back" @click="navigateBack()">
    <ion-icon name="arrow-back"></ion-icon>
    <span>Edit User Profile</span>
  </div>

  <div class="user-profile">
    <h2>User Profile</h2>
    <!--
    <div>
      <input ref="file" type="file" accept="image/*">
      <img :src="userPicture || '@/assets/profile-user.png'" alt="User Profile Picture"/>
      <h5 @click="openFileInput">Edit Profile Picture</h5>
    </div> -->

    <div class="input">
      <div>
        <img class="profile-user-img img-circle" :src="profilePictureUrl ? profilePictureUrl : userPicture" alt="User Profile Picture">
      </div>
      <input id="fileInput" @change="handleFileChange" ref="fileInput" type="file" class="d-none">
    </div>


    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" id="username" v-model="username" required class="input-field" />
    </div>

    <div class="button-container">
      <button class="btn" @click="editProfile">Save</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import firebase from "@/uifire.js";
import firebaseApp from "@/firebase.js";
import sidebar from "../components/sidebar.vue";
import { getAuth, onAuthStateChanged, updateEmail, updatePassword, updateProfile } from "firebase/auth";
import { ref } from 'vue';
import { toastController } from "@ionic/core";

export default {
  name: "editProfile",
  components: {
    sidebar,
  },
  data() {
    return {
      user: null,
      username: "",
      email: "nothing",
      errorMessage: "",
      src: this.defaultSrc,
      file: null,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.username = user.displayName;
        this.email = user.email;
        this.userPicture = user.photoURL;
      }
    });
  },
  methods: {
    navigateBack() {
      this.$router.back();
    },
    async editProfile() {
      alert('editProfile method called')
      //check if all required fields are filled in
      if (!this.username || !this.email) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }
      try {
        const user = this.user;
        if (this.username !== user.displayName) {
          await updateProfile(user, {
            displayName: this.username
          });
        }
        this.message = "Profile updated successfully";
        this.$router.push('/userProfile');
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
  },
  setup() {
    const fileInput = ref(null);
    const openFileInput = () => {
      fileInput.value.click();
    };
    const profilePictureUrl = ref(null);
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      profilePictureUrl.value = URL.createObjectURL(file);
      
      const formData = new FormData();
      formData.append('profile_picture', file);
      axios.post('/api/upload-profile-image', formData)
      .then((response) => {
        toastController.success('Image uploaded successfully!');
      })
    };
    return {
      fileInput,
      openFileInput,
      profilePictureUrl,
      handleFileChange,
    };
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
  width: 15%;
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
  width: 150px;
  height: 150px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666; /* Use color from your design */
}
.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd; /* Use color from your design */
  border-radius: 5px;
  font-size: 1rem;
  margin-left: -15px;
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

.btn:hover, h5:hover {
  text-decoration: underline;
  font-weight: 900;
}

.button-container {
  display: flex;
  justify-content: center;
}
h5 {
  margin-top: -15px;
  font-size: 15px;
  cursor: pointer;
  color: blue;
}
.error-message {
  color: red;
}
.profile-user-img:hover {
  cursor: pointer;
}
.input [type="file"] {
  margin-bottom: 20px;
  margin-left: 80px;;
}
</style>

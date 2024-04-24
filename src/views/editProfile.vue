<template>
  <sidebar />
  <div class="navigate-back" @click="navigateBack()">
    <ion-icon name="arrow-back"></ion-icon>
    <span>Edit User Profile</span>
  </div>

  <div class="user-profile">
    <h2>User Profile</h2>
    <div class="input">
      <div>
        <img
          @click="openFileInput"
          class="profile-user-img img-circle"
          :src="profilePictureUrl || defaultProfilePicture"
          alt="User Profile Picture"
        />
      </div>
      <input
        id="fileInput"
        @change="handleFileChange"
        ref="fileInput"
        type="file"
        class="d-none"
      />
    </div>

    <div class="form-group">
      <label for="username">Username</label>
      <input
        type="text"
        id="username"
        v-model="username"
        required
        class="input-field"
      />
    </div>

    <div class="button-container">
      <button class="btn" @click="editProfile">Save</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import sidebar from "../components/sidebar.vue";
import firebaseApp from "../firebase.js";

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
      defaultProfilePicture: "assets/profile-user.png",
      profilePictureUrl: null,
      storage: getStorage(firebaseApp),
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.username = user.displayName;
        this.email = user.email;
        this.profilePictureUrl = user.photoURL || this.defaultProfilePicture;
        console.log("Profile Picture URL:", this.profilePictureUrl);
      }
    });
  },
  methods: {
    navigateBack() {
      this.$router.back();
    },
    async editProfile() {
      if (!this.username || !this.email) {
        this.errorMessage = "Please fill in all fields.";
        return;
      }
      try {
        if (this.username !== this.user.displayName) {
          console.log("Updating display name...");
          await updateProfile(this.user, {
            displayName: this.username,
          });
        } else {
          console.log("Username is the same as the current display name.");
        }

        if (
          this.profilePictureUrl &&
          this.profilePictureUrl !== this.user.photoURL
        ) {
          console.log("Updating profile picture...");
          // Upload the image to Firebase Storage
          const imageRef = storageRef(
            this.storage,
            `profile_pictures/${this.user.uid}`
          );
          await uploadBytes(imageRef, this.image);

          // Get the download URL of the uploaded image
          const downloadURL = await getDownloadURL(imageRef);

          // Update user profile with new profile picture URL
          await updateProfile(this.user, {
            photoURL: downloadURL,
          });

          console.log("Profile picture updated successfully");
        } else {
          console.log("Profile picture is the same as the current one");
        }
        this.message = "Profile updated successfully";
        this.$router.push("/userProfile");
      } catch (error) {
        console.error("Error updating profile:", error);
        this.errorMessage = error.message;
      }
    },
    // Method to handle file input change
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.image = file;
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profilePictureUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
  },
  setup() {
    const fileInput = ref(null);
    const openFileInput = () => {
      fileInput.value.click();
    };
    const profilePictureUrl = ref(null);
    return {
      fileInput,
      openFileInput,
      profilePictureUrl,
    };
  },
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
.btn:hover,
h5:hover {
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
  margin-left: 80px;
}
</style>

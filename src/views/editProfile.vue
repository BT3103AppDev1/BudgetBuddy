<template>
  <div class="editProfilePageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
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
      } else {
        this.$router.push("/");
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

          const imageRef = storageRef(
            this.storage,
            `profile_pictures/${this.user.uid}`
          );
          await uploadBytes(imageRef, this.image);

          const downloadURL = await getDownloadURL(imageRef);

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
.editProfilePageContainer {
  display: flex;
  align-items: start;
}

.sidebar {
  flex: 0 0 290px;
}

.maincontent {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.navigate-back {
  display: flex;
  align-items: center;
  position: fixed;
  top: 5%;
  left: 300px;
  font-size: 20px;
  cursor: pointer;
}
.navigate-back ion-icon {
  margin-right: 20px;
  width: 30px;
  height: 30px;
}
.user-profile {
  max-width: 600px;
  margin: 100px auto 0;
  padding: 2rem;
  width: 80%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.user-profile h2 {
  margin-bottom: 1.5rem;
  color: #333;
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
  color: #666;
}
.form-group input[type="text"],
.form-group input[type="password"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  margin-left: -15px;
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease,
    box-shadow 0.3s ease-in-out;
  background-color: #a5a5a5;
  color: white;
  text-decoration: none;
}
.btn:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(88, 88, 88);
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

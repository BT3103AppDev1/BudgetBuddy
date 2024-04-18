<template>
  <sidebar />
  <div class="navigate-back" @click="navigateBack()">
    <ion-icon name="arrow-back"></ion-icon>
    <span>Edit User Profile</span>
  </div>

  <div class="user-profile">
    <h2>User Profile</h2>
    <div>
      <img
        :src="userPicture || '@/assets/profile-user.png'"
        alt="User Profile Picture"
      />
      <h5 @click="openFilePicker">Edit Profile Picture</h5>
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

    <div class="form-group">
      <label for="email">Email</label>
      <input
        type="text"
        id="email"
        v-model="email"
        required
        class="input-field"
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <div class="input-field-container">
        <input
          :type="passwordInputType"
          v-model="password"
          required
          class="input-field"
        />
        <button class="input-group-text" @click.prevent="toggleInput">
          <ion-icon :name="passwordIcon"></ion-icon>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label for="confirmpw">Confirm Password</label>
      <div class="input-field-container">
        <input
          :type="confirmPasswordInputType"
          v-model="confirmPassword"
          required
          class="input-field"
        />
        <button
          class="input-group-text"
          @click.prevent="toggleConfirmPasswordInput"
        >
          <ion-icon :name="confirmPasswordIcon"></ion-icon>
        </button>
      </div>
      <p v-if="password !== confirmPassword" class="error-message">
        Passwords do not match!
      </p>
    </div>

    <div class="button-container">
      <button class="btn" @click="editProfile">Save</button>
      <p v-if="message">{{ message }}</p>
      <div class="button-container">
        <button class="btn" @click="editProfile()">Save</button>
        <p v-if="message">{{ message }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "@/uifire.js";
import firebaseApp from "@/firebase.js";
import sidebar from "../components/sidebar.vue";
import {
  getAuth,
  onAuthStateChanged,
  updateEmail,
  updatePassword,
  updateProfile,
} from "firebase/auth";

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
      showPassword: false,
      passwordInputType: "password",
      confirmPasswordInputType: "password",
      passwordIcon: "eye",
      confirmPasswordIcon: "eye",
    };
  },
  computed: {
    passwordFieldType() {
      return this.showPassword ? "text" : "password";
    },
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
    toggleInput() {
      this.passwordInputType =
        this.passwordInputType === "password" ? "text" : "password";
      this.passwordIcon = this.passwordIcon === "eye" ? "eye-off" : "eye";
    },
    toggleConfirmPasswordInput() {
      this.confirmPasswordInputType =
        this.confirmPasswordInputType === "password" ? "text" : "password";
      this.confirmPasswordIcon =
        this.confirmPasswordIcon === "eye" ? "eye-off" : "eye";
    },
    async editProfile() {
      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match!";
        return;
      }
      try {
        const user = this.user;
        if (this.username !== user.displayName) {
          await updateProfile(user, {
            displayName: this.username,
          });
        }
        if (this.email !== user.email) {
          await updateEmail(user, this.email);
        }
        if (this.password) {
          await updatePassword(user, this.password);
        }
        this.message = "Profile updated successfully";
        this.$router.back();
      } catch (error) {
        this.errorMessage = error.message;
      }
    },
    openFilePicker() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.addEventListener("change", (event) => {
        const file = event.target.files[0]; // Get the first selected file
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.userPicture = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
      input.click();
    },
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
  margin: 0 auto;
  flex-grow: 1;
}

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

.btn:hover {
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
.input-field {
  padding-right: 40px; /* Adjust this value based on your button's width */
}
.input-group-text {
  position: absolute;
  top: 50%;
  right: 10px; /* Adjust this value based on your desired position */
  transform: translateY(-50%);
}
</style>

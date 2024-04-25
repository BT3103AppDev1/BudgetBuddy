<template>
  <div class="userProfilePageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <div class="user-profile">
        <h2>User Profile</h2>
        <img
          :src="userPicture || '@/assets/profile-user.png'"
          alt="User Profile Picture"
        />

        <div class="form-group">
          <label for="username">Username</label>
          <p>{{ username }}</p>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <p>{{ userEmail }}</p>
        </div>
        <br />
        <div class="button-container">
          <button class="btn" @click="editProfile()">Edit Profile</button>
        </div>
      </div>
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import Logout from "@/components/Logout.vue";
import sidebar from "../components/sidebar.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "userProfile",
  components: {
    Logout,
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
    editProfile() {
      this.$router.push("/editProfile");
    },
  },
};
</script>

<style scoped>
.userProfilePageContainer {
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

.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
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
  height: 200px;
  width: 200px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}
p {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
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
  background-color: rgb(176, 176, 176);
  color: white;
  text-decoration: none;
}

.btn:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(97, 97, 97);
}

.button-container {
  display: flex;
  justify-content: center;
}
</style>

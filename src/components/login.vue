<template>
  <div class="login-container">
    <h1>BudgetBuddy Login</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="loginForm.username" required>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="loginForm.password" required>
      </div>
      <button type="submit">Log In</button>
    </form>
  </div>
</template>

<script>

import firebase from "@/firebase";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginError: false,
      loginErrorMessage: ''
    };
  },
  methods: {
    async handleLogin() {
      this.loginError = false;
      try {
        await firebase.auth().signInWithEmailAndPassword(this.loginForm.username, this.loginForm.password);
        // Redirect or do something upon successful login
        this.$router.push({ name: 'dashboard' }); // Adjust route as necessary
      } catch (error) {
        this.loginError = true;
        this.loginErrorMessage = error.message;
      }
    }
  }
};
</script>

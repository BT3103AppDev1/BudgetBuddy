<template>
    <div class="signup-container">
      <h1>Sign Up</h1>
      <form @submit.prevent="handleSignUp">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="signupForm.email" required>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="signupForm.password" required>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p v-if="signupError" class="error">{{ signupErrorMessage }}</p>
    </div>
  </template>
  
  <script>
  import firebase from '@/firebase'; // Adjust the path as necessary
  
  export default {
    name: "SignUp",
    data() {
      return {
        signupForm: {
          email: '',
          password: ''
        },
        signupError: false,
        signupErrorMessage: ''
      };
    },
    methods: {
      async handleSignUp() {
        this.signupError = false;
        try {
          const { user } = await firebase.auth().createUserWithEmailAndPassword(this.signupForm.email, this.signupForm.password);
          console.log("User created successfully with email:", user.email);
          // Redirect or do something upon successful signup, e.g., redirect to a login page or home page
          this.$router.push({ name: 'home' }); // Adjust route as necessary
        } catch (error) {
          this.signupError = true;
          this.signupErrorMessage = error.message;
        }
      }
    }
  }
  </script>
<template>
    <div class="dashpage">
        <h1>Welcome to Your Dashboard</h1>
        <p>Email: {{ userEmail }}</p>
        <Logout :user="user" />
    </div>
</template>
  
<script>
import firebase from '@/uifire.js';
//import 'firebase/compat/auth'
import firebaseApp from '@/firebase.js';
import Logout from '@/components/Logout.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

  
export default {
    name: "dashboardPage",
    components: {
        Logout
    },

    data() {
        return {
            user: null,
            userEmail: 'nothing',
        };
    },
    mounted() {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                this.user = user;
                this.userEmail = user.email;
            }
        })
    }

};
</script>
  
<style scoped>
  .dashpage {
    text-align: center;
    margin-bottom: 20px;
  }
  
  button {
    background-color: #f44336; /* Red */
    color: white;
    border: none;
    cursor: pointer;
    padding: 10px 20px;
    margin-top: 20px;
}

button:hover {
  background-color: #d32f2f;
}
</style>
  
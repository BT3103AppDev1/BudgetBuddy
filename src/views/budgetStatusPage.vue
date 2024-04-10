<template>
    <sidebar />
    <budgetStatus></budgetStatus>
    <Logout :user="user" />
  </template>
  
  <script>
  import sidebar from "../components/sidebar.vue";
  import budgetStatus from "../components/budgetStatus.vue";
  import Logout from "@/components/Logout.vue";
  import { getAuth, onAuthStateChanged } from "firebase/auth";
  export default {
    name: "budgetStatusPage",
    components: {
      budgetStatus,
      sidebar,
      Logout,
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
        }
      });
    },
  };
  </script>
  
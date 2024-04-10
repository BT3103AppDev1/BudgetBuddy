<template>
  <sidebar />
  <transactionHistory></transactionHistory>
  <Logout :user="user" />
</template>

<script>
import sidebar from "../components/sidebar.vue";
import transactionHistory from "../components/transactionHistory.vue";
import Logout from "@/components/Logout.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  name: "addBudgetPage",
  components: {
    transactionHistory,
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

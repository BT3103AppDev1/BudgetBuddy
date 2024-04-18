<template>
  <div class="container">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <transactionHistory></transactionHistory>
      <Logout :user="user" />
    </div>
  </div>
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

<style>
.container {
  display: flex;
  align-items: start;
}

.maincontent {
  margin: 0 auto;
  flex-grow: 1;
}
</style>

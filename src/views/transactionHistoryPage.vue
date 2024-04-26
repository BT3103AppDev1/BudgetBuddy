<template>
  <div class="transacHistPageContainer">
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
      } else {
        this.$router.push("/");
      }
    });
  },
};
</script>

<style>
.transacHistPageContainer {
  display: flex;
  align-items: start;
  justify-content: flex-start;
}

.sidebar {
  flex: 0 0 290px;
  padding: 0;
  margin: 0;
}

.maincontent {
  margin: 0 auto;
  flex-grow: 1;
}
</style>

<template>
  <div class="viewSchedTransacPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <viewScheduledTransactions></viewScheduledTransactions>
      <br>
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import viewScheduledTransactions from "../components/viewScheduledTransactions.vue";
import Logout from "@/components/Logout.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export default {
  name: "viewScheduledTransactionsPage",
  components: {
    viewScheduledTransactions,
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
.viewSchedTransacPageContainer {
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
</style>

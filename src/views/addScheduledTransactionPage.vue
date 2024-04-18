<template>
  <div class="addSchedTransacPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <addScheduledTransaction></addScheduledTransaction>
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import addScheduledTransaction from "../components/addScheduledTransaction.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logout from "@/components/Logout.vue";

export default {
  name: "addScheduledTransactionPage",
  components: {
    sidebar,
    addScheduledTransaction,
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
.addSchedTransacPageContainer {
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

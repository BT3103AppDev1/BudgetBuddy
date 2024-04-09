<template>
  <div class="addSchedTranscPageContainer">
    <sidebar />
    <addScheduledTransaction></addScheduledTransaction>
    <Logout :user="user" />
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
.addSchedTranscPageContainer {
  text-align: center;
  margin-bottom: 20px;
}
</style>

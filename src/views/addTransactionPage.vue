<template>
  <div class="addTranscPageContainer">
    <sidebar />
    <addTransaction />
    <Logout :user="user" />
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import addTransaction from "../components/addTransaction.vue";
import Logout from "@/components/Logout.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "addTransactionPage",
  components: {
    addTransaction,
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
.addTranscPageContainer {
  text-align: center;
  margin-bottom: 20px;
}
</style>

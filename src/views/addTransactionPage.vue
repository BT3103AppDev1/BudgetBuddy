<template>
  <div class="addTranscPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <addTransaction />
      <Logout :user="user" />
    </div>
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
      } else {
        this.$router.push("/");
      }
    });
  },
};
</script>

<style>
.addTranscPageContainer {
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

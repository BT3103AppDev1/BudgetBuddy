
import ViewScheduledTransactions from '@/components/viewScheduledTransactions.vue';
<template>
    <sidebar />
    <viewScheduledTransactions></viewScheduledTransactions>
    <Logout :user="user" />
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

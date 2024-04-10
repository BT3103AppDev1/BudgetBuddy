<template>
  <div class="addBudgetPageContainer">
    <sidebar />
    <addBudget />
    <Logout :user="user" />
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import addBudget from "../components/addBudget.vue";
import Logout from "@/components/Logout.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  name: "addBudgetPage",
  components: {
    addBudget,
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
.addBudgetPageContainer {
  text-align: center;
  margin-bottom: 20px;
}
</style>

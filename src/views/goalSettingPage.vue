<template>
  <div class="goalSettingPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <goalSetting />
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import Logout from "@/components/Logout.vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import goalSetting from "../components/goalSetting.vue";
export default {
  name: "goalSettingPage",
  components: {
    goalSetting,
    sidebar,
    Logout,
  },
  data() {
    return {
      user: null,
      userEmail: "nothing",
      allGoals: [],
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

  watch: {
    $route(to, from) {
      if (to.name === "goalSettingPage" && from.name !== to.name) {
        this.fetchGoals();
      }
    },
  },
};
</script>

<style>
.goalSettingPageContainer {
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

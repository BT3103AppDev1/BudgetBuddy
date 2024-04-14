<template>
  <sidebar />
  <goalSetting />
  <Logout :user="user" />
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

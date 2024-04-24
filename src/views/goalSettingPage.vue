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
        //this.fetchAllBudgets();
      }
    });
  },
  /*
  methods: {
    async fetchAllBudgets() {
      const db = getFirestore(firebaseApp);
      const userId = this.user.uid;
      const budgetsCol = collection(db, "users", userId, "budgets");
      try {
        const querySnapshot = await getDocs(budgetsCol);
        this.allGoals = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log("All Goals/Budgets:", this.allGoals);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    }
  },
  */

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

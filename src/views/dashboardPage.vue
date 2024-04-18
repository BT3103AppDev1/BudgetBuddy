<template>
  <div class="dashboardPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <h1>Welcome to Your Dashboard</h1>
      <p>Email: {{ userEmail }}</p>
      <pieChart :transactions="rawTransactions" />
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logout from "@/components/Logout.vue";
import Sidebar from "@/components/sidebar.vue";
import PieChart from "@/components/pieChart.vue";

export default {
  name: "DashboardPage",
  components: {
    Logout,
    Sidebar,
    PieChart,
  },
  data() {
    return {
      user: null,
      userEmail: "nothing",
      rawTransactions: [], // This will hold the transactions from Firestore
    };
  },

  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
        this.username = user.displayName;
        this.fetchTransactions();
      }
    });
  },

  methods: {
    async fetchTransactions() {
      const db = getFirestore();
      const transactionsCol = collection(db, "transactions");
      const querySnapshot = await getDocs(transactionsCol);

      // Process and store each transaction from the querySnapshot
      this.rawTransactions = querySnapshot.docs.map((doc) => doc.data());
    },
  },
};
</script>

<style scoped>
.dashboardPageContainer {
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

button {
  background-color: #f44336; /* Red */
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px 20px;
  margin-top: 20px;
}

button:hover {
  background-color: #d32f2f;
}
</style>

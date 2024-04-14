<template>
  <sidebar />
  <div class="dashpage">
    <h1>Welcome to Your Dashboard</h1>
    <p>Email: {{ userEmail }}</p>
    <!-- Pass the transactions to the pieChart component -->
    <pieChart :transactions="rawTransactions" />
    <Logout :user="user" />
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
.dashpage {
  text-align: center;
  margin-bottom: 20px;
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

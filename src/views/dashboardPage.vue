<template>
  <div class="dashboardPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <h1>Welcome to your dashboard, {{ this.username }}!</h1>
      <!-- Filter Section -->
      <div>
        <input type="date" v-model="startDate" />
        <input type="date" v-model="endDate" />
        <button @click="applyFilters">Apply Filters</button>
      </div>
      
      <pie-chart :transactions="filteredTransactions" />
      <logout :user="user" />
    </div>
  </div>

  
</template>

<script>
import firebaseApp from "../firebase.js";
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
      filteredTransactions: [], // This will hold the transactions after applying filters
      startDate: null,
      endDate: null,
      selectedCategory: "",
      username: "",
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
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (user) {
        console.log("User ID:", user.uid); // Make sure you can retrieve the user ID
      }
      if (!user) {
        console.error("No user logged in!");
        return;
      }
      const userId = user.uid;
      const db = getFirestore();
      const transactionsCol = collection(db, "users", userId, "transactions");
      const querySnapshot = await getDocs(transactionsCol);

      // Process and store each transaction from the querySnapshot
      this.rawTransactions = querySnapshot.docs.map((doc) => doc.data());
      this.applyFilters(); // Apply filters immediately after fetching to init the view
    },
  
    applyFilters() {
    let filtered = this.rawTransactions;

    if (this.startDate && this.endDate) {
      const start = new Date(this.startDate).getTime();
      const end = new Date(this.endDate).getTime();
      filtered = filtered.filter(tx => {
        const txDate = new Date(tx.date).getTime();
        return txDate >= start && txDate <= end;
      });
    }
    this.filteredTransactions = filtered;
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

.maincontent input[type="date"], .maincontent select {
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
}

.maincontent button {
  padding: 5px 10px;
  background-color: #4CAF50;
  color: white;
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

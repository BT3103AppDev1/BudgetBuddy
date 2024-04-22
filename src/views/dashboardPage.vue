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
      <pieChart :transactions="filteredTransactions" />
      <div class="dashboard-columns">
        <div class="recent-transactions">
          <h2>Recent Transactions</h2>
          <ul>
            <li
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="transaction-item"
            >
              <div class="transaction-details">
                <h3 class="transaction-name">{{ transaction.name }}</h3>
                <p class="transaction-date">{{ transaction.date }}</p>
                <p class="transaction-category">{{ transaction.category }}</p>
              </div>
              <div
                class="transaction-amount"
                :class="{
                  negative: transaction.amount < 0,
                  positive: transaction.amount >= 0,
                }"
              >
                {{ transaction.amount.toFixed(2) }}
              </div>
            </li>
          </ul>
        </div>

        <div class="recent-budgets">
          <h2>Recent Budgets</h2>
          <goalSetting :goals="recentBudgets" :limit="2" :showAddButton="false" />
        </div>
      </div>
        <Logout :user="user" />
    </div>
  </div>

  
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logout from "@/components/Logout.vue";
import Sidebar from "@/components/sidebar.vue";
import PieChart from "@/components/pieChart.vue";
import goalSetting from "@/components/goalSetting.vue"; 


export default {
  name: "DashboardPage",
  components: {
    Logout,
    Sidebar,
    PieChart,
    goalSetting,
  },
  data() {
    return {
      user: null,
      username: "",
      userEmail: "nothing",
      rawTransactions: [], // This will hold the transactions from Firestore
      recentTransactions: [],
      recentBudgets: [],
      filteredTransactions: [],
      startDate: null,
      endDate: null,
      loadingChart: false,
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
        this.fetchGoals().then(() => {
            console.log("Recent Budgets in Dashboard:", this.recentBudgets);
          });
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
      const transQueryAll = query(transactionsCol, orderBy("date", "desc"));
      const transQueryRecent = query(transactionsCol, orderBy("date", "desc"), limit(5));

      try {
        const allSnapshot = await getDocs(transQueryAll);

        this.rawTransactions = allSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          category: doc.data().category,
          date: doc.data().date
        }));
        console.log("All Transactions:", this.rawTransactions);



        const recentSnapshot = await getDocs(transQueryRecent);
        this.recentTransactions = recentSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          category: doc.data().category,
          date: doc.data().date
        }));
        


        this.applyFilters();
      } catch (error) {
          console.error("Error fetching transactions:", error);
      }
    },

    async fetchGoals() {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user) {
        console.error("No user logged in!");
        return;
      }
      const userId = user.uid;
      const budgetsCol = collection(db, "users", userId, "budgets");
      const budgetsQuery = query(budgetsCol, orderBy("endDate", "asc"), limit(2));

      try {
        const snapshot = await getDocs(budgetsQuery);
        this.recentBudgets = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Recent Budgets:", this.recentBudgets);
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
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
    
    beforeRouteLeave(to, from, next) {
      if (this.loadingChart) {
        this.destroyChart();
      }
      next();
    },
  },

  watch: {
    '$route' (to, from) {
      if (to.name === 'dashboardPage' && from.name !== to.name) {
        this.fetchTransactions();
        this.createChart();
        this.fetchGoals();
      }
    }
  },

  computed: {
  displayedGoals() {
    return this.recentGoals.slice(0, 2);  // This ensures only two goals are displayed, regardless of the length of recentGoals
  }
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

.transaction-item {
  background-color: #f0f0f0; /* Light grey background */
  border-radius: 10px; /* Rounded corners */
  padding: 15px; /* Padding inside the bubble */
  margin-bottom: 10px; /* Space between items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-columns {
  display: flex;
  justify-content: space-between; /* Adjusts the space distribution */
  width: 100%; /* Ensures the flex container spans the full width of its parent */
}

.recent-transactions, .recent-budgets {
  flex: 1; /* Each takes half of the available space */
  margin: 0 10px; /* Adds spacing between the columns */
  box-sizing: border-box; /* Includes padding and border in the element's total width and height */
  min-width: 0; /* Prevents flex items from growing beyond their flex basis when content is too wide */
}

.transaction-item, .budget-item {
  box-sizing: border-box; /* Includes padding and border in the element's total width and height */
}

</style>

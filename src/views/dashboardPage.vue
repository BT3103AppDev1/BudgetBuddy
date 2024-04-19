<template>
  <div class="dashboardPageContainer">
    <div class="sidebar">
      <sidebar />
    </div>
    <div class="maincontent">
      <h1>Welcome to your dashboard, {{ this.username }}!</h1>
      <pieChart :transactions="rawTransactions" />
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
      recentTransactions: [],
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
      } catch (error) {
          console.error("Error fetching transactions:", error);
      }
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

<template>
  <div class="analytics-container">
    <div class="spendings-container">
      <h2>Top Spendings</h2>
      <div class="filter-buttons">
        <button
          @click="setFilter('week')"
          :class="{ active: currentFilter === 'week' }"
        >
          Week
        </button>
        <button
          @click="setFilter('month')"
          :class="{ active: currentFilter === 'month' }"
        >
          Month
        </button>
        <button
          @click="setFilter('year')"
          :class="{ active: currentFilter === 'year' }"
        >
          Year
        </button>
      </div>
      <div v-if="filteredTransactions.length > 0" class="top-spendings-list">
        <ul>
          <li
            v-for="(transaction, index) in filteredTransactions"
            :key="index"
            class="spending-item"
          >
            <div class="spending-details">
              <h3 class="spending-name">{{ transaction.name }}</h3>
              <p class="spending-date">{{ transaction.date }}</p>
              <p class="spending-amount">{{ -transaction.amount }}</p>
            </div>
          </li>
        </ul>
      </div>
      <p v-else>No transactions available.</p>
    </div>
  </div>
</template>

<script>
import {
  startOfWeek,
  startOfMonth,
  startOfYear,
  endOfWeek,
  endOfMonth,
  endOfYear,
  parseISO,
} from "date-fns";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      transactions: [],
      filteredTransactions: [],
      currentFilter: "week",
    };
  },
  async mounted() {
    await this.fetchTransactions();
    this.setFilter(this.currentFilter);
  },
  methods: {
    async fetchTransactions() {
      const db = getFirestore(firebaseApp);
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;

      if (!user) {
        console.error("No user logged in!");
        return;
      }

      const userId = user.uid;
      const transactionsCol = collection(db, "users", userId, "transactions");
      const q = query(transactionsCol, orderBy("date", "desc"), limit(50));

      try {
        const querySnapshot = await getDocs(q);
        this.transactions = querySnapshot.docs.map((doc) => doc.data());
        console.log("Fetched transactions:", this.transactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },
    setFilter(filterType) {
      this.currentFilter = filterType;
      this.filterTransactions();
    },
    filterTransactions() {
      const now = new Date();
      const startOfPeriod = {
        week: startOfWeek(now),
        month: startOfMonth(now),
        year: startOfYear(now),
      };
      const endOfPeriod = {
        week: endOfWeek(now),
        month: endOfMonth(now),
        year: endOfYear(now),
      };
      const start = startOfPeriod[this.currentFilter];
      const end = endOfPeriod[this.currentFilter];

      this.filteredTransactions = this.transactions
        .filter((t) => {
          const date = parseISO(t.date);
          return date >= start && date <= end;
        })
        .sort((a, b) => a.amount - b.amount)
        .slice(0, 3);
    },
  },
};
</script>

<style scoped>
.filter-buttons {
  justify-content: space-between;
  margin-bottom: 20px;
}

.filter-buttons button {
  padding: 10px 20px;
  border: none;
  background-color: #8e8e8e;
  cursor: pointer;
  border-radius: 5px;
}

.filter-buttons button:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(148, 148, 148);
}

.filter-buttons button.active {
  background-color: #332f2f;
}
.spendings-container {
  max-width: 600px;
  margin: auto;
}

.top-spendings-list {
  list-style: none;
  padding: 0;
}

.top-spendings-list ul {
  list-style: none;
  padding: 0;
}

.spending-item {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.spending-details {
  text-align: center;
}

.spending-amount {
  font-size: 1rem;
  font-weight: bold;
}
</style>

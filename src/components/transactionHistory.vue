<template>
  <div class="filter-options">
    <select v-model="selectedFilter">
      <option value="category">Filter by Category</option>
      <option value="date">Filter by Date</option>
    </select>

    <!-- Dropdown for Category -->
    <select v-model="selectedCategory" v-if="selectedFilter === 'category'">
      <option value="">Select a Category</option>
      <option value="transport">Transport</option>
      <option value="shopping">Shopping</option>
      <option value="food">Food</option>
      <option value="others">Others</option>
    </select>

    <!-- Dropdown for Date Filtering Options -->
    <select v-model="selectedDateFilter" v-if="selectedFilter === 'date'">
      <option value="">Select a Date Range</option>
      <option value="today">Today</option>
      <option value="last7Days">Last 7 Days</option>
      <option value="lastMonth">Last Month</option>
    </select>
  </div>
  <div class="transaction-history-page">
    <div class="transaction-list">
      <ul>
        <li
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-icon"><!-- Icon based on category --></div>
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
      <router-link
        to="/addTransaction"
        tag="button"
        class="add-transaction-btn"
      >
        Add New Transaction
      </router-link>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      transactions: [],
      selectedFilter: "",
      selectedCategory: "",
      selectedDateFilter: "",
    };
  },
  mounted() {
    this.fetchTransactions();
  },
  methods: {
    fetchTransactions() {
      const query = collection(db, "transactions");
      onSnapshot(
        query,
        (querySnapshot) => {
          this.transactions = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              name: doc.data().name,
              amount: doc.data().amount,
              category: doc.data().category,
              currency: doc.data().currency,
              date: doc.data().date,
              description: doc.data().description,
            }))
            .sort((a, b) => {
              // Convert date strings to Date objects
              const dateA = new Date(a.date);
              const dateB = new Date(b.date);
              // Sort in descending order (latest first)
              return dateB - dateA;
            });
        },
        (error) => {
          console.error("Error getting documents: ", error);
        }
      );
    },
  },
  computed: {
    filteredTransactions() {
      let filtered = this.transactions;

      if (this.selectedFilter === "category" && this.selectedCategory) {
        filtered = filtered.filter(
          (transaction) => transaction.category === this.selectedCategory
        );
      } else if (this.selectedFilter === "date") {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today

        let startDate;

        switch (this.selectedDateFilter) {
          case "today":
            startDate = today;
            break;
          case "last7Days":
            startDate = new Date(new Date().setDate(today.getDate() - 7));
            break;
          case "lastMonth":
            startDate = new Date(new Date().setMonth(today.getMonth() - 1));
            break;
        }

        if (startDate) {
          filtered = filtered.filter((transaction) => {
            const transactionDate = new Date(transaction.date);
            return transactionDate >= startDate && transactionDate <= today;
          });
        }
      }

      return filtered;
    },
  },
};
</script>

<style scoped>
.transaction-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.transaction-item {
  background-color: #f9f9f9; /* Light grey background */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px; /* Space between items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-name {
  font-size: 1rem; /* Large font size for visibility */
  color: #333; /* Dark text for contrast */
  font-weight: 500; /* Medium weight for the transaction name */
}

.transaction-date,
.transaction-category {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}

.transaction-amount {
  font-size: 1rem;
  color: #333;
  font-weight: bold; /* Bold weight for the amount */
}

.add-transaction-btn {
  background-color: #5cb85c; /* Example: a green button */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: block; /* Center button in the container */
  width: max-content;
  margin: 10px auto; /* Centering button */
}

.positive {
  color: #5cb85c; /* Green color for positive amounts */
}

.negative {
  color: #ff3860; /* Red color for negative amounts */
}
</style>

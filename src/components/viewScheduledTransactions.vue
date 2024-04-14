<template>
  <div class="filter-options">
    <select v-model="selectedFilter">
      <option value="category">Filter by Category</option>
      <option value="recurrence">Filter by Recurrence</option>
    </select>

    <!-- Dropdown for Category -->
    <select v-model="selectedCategory" v-if="selectedFilter === 'category'">
      <option value="">Select a Category</option>
      <option value="income">income</option>
      <option value="allowance">allowance</option>
      <option value="expenses">expenses</option>
      <option value="subscriptions">subscriptions</option>
      <option value="others">others</option>
    </select>

    <!-- Dropdown for Recurrence Options -->
    <select v-model="selectedRecurrence" v-if="selectedFilter === 'recurrence'">
      <option value="">Select a Recurrence Range</option>
      <option value="monthly">Monthly</option>
      <option value="yearly">Yearly</option>
    </select>
  </div>
  <div class="view-scheduled-transactions-page">
    <div class="scheduled-transactions-list">
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
            <p class="transaction-recurrence">{{ transaction.recurrence }}</p>
            <p class="transaction-category">{{ transaction.category }}</p>
          </div>
          <div
            class="transaction-amount"
            :class="{
              negative: transaction.amount < 0,
              positive: transaction.amount >= 0,
            }"
          >
            {{ transaction.amount | transaction.currency }}
          </div>
        </li>
      </ul>
      <router-link
        to="/addScheduledTransaction"
        tag="button"
        class="add-sched-transaction-btn"
      >
        Add New Scheduled Transaction
      </router-link>
    </div>
  </div>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      scheduledTransactions: [],
      selectedFilter: "",
      selectedCategory: "",
      selectedRecurrence: "",
    };
  },
  mounted() {
    this.fetchScheduledTransactions();
  },
  methods: {
    fetchScheduledTransactions() {
      const query = collection(db, "scheduledTransaction");
      onSnapshot(
        query,
        (querySnapshot) => {
          this.scheduledTransactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().schedTransactionName, // Make sure this field exists in your Firestore documents
            amount: doc.data().schedTransactionAmount, // Make sure this field exists in your Firestore documents
            category: doc.data().schedTransactionsCategory, // Make sure this field exists in your Firestore documents
            currency: doc.data().schedTransactionsCurrency, // Make sure this field exists in your Firestore documents
            date: doc.data().schedTransactionsDate, // Make sure this field exists in your Firestore documents
            recurrence: doc.data().schedTransactionsRecurrence, // Make sure this field exists in your Firestore documents
          }));
        },
        (error) => {
          console.error("Error getting documents: ", error);
        }
      );
    },
  },
  computed: {
    filteredTransactions() {
      let filtered = this.scheduledTransactions;

      if (this.selectedFilter === "category" && this.selectedCategory) {
        filtered = filtered.filter(
          (transaction) => transaction.category === this.selectedCategory
        );
      } else if (
        this.selectedFilter === "recurrence" &&
        this.selectedRecurrence
      ) {
        filtered = filtered.filter(
          (transaction) => transaction.recurrence === this.selectedRecurrence
        );
        //   const today = new Date();
        //   today.setHours(0, 0, 0, 0); // Set to start of today

        //   let startDate;

        //   switch (this.selectedDateFilter) {
        //     case 'today':
        //       startDate = today;
        //       break;
        //     case 'last7Days':
        //       startDate = new Date(new Date().setDate(today.getDate() - 7));
        //       break;
        //     case 'lastMonth':
        //       startDate = new Date(new Date().setMonth(today.getMonth() - 1));
        //       break;
        //   }

        //   if (startDate) {
        //     filtered = filtered.filter(transaction => {
        //       const transactionDate = new Date(transaction.date);
        //       return transactionDate >= startDate && transactionDate <= today;
        //     });
        //   }
      }

      return filtered;
    },
  },
};
</script>

<style scoped>
.scheduled-transactions-list {
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

.transaction-date {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}

.transaction-recurrence {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}

.transaction-category {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}

.transaction-amount {
  font-size: 1rem;
  color: #333;
  font-weight: bold; /* Bold weight for the amount */
}

.add-sched-transaction-btn {
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

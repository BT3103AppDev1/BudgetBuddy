<template>
  <div class="filter-options">
    <select v-model="selectedFilter">
      <option value="category">Filter by Category</option>
      <option value="recurrence">Filter by Recurrence</option>
    </select>

    <!-- Dropdown for Category -->
    <select v-model="selectedCategory" v-if="selectedFilter === 'category'">
      <option value="">Select a Category</option>
      <option value="income">Income</option>
      <option value="allowance">Allowance</option>
      <option value="expenses">Expenses</option>
      <option value="subscriptions">Subscriptions</option>
      <option value="others">Others</option>
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
          <div class="transaction-details">
            <h3 class="transaction-name">{{ transaction.name }}</h3>
            <p class="transaction-date">{{ transaction.date }}</p>
            <p class="transaction-recurrence">
              {{ transaction.recurrence }} {{ transaction.category }}
            </p>
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
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      auth: null,
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
      const transactionQuery = collection(
        db,
        "users",
        userId,
        "scheduledTransaction"
      );
      onSnapshot(
        transactionQuery,
        (querySnapshot) => {
          this.scheduledTransactions = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              name: doc.data().schedTransactionName, // Make sure this field exists in your Firestore documents
              amount: doc.data().schedTransactionAmount, // Make sure this field exists in your Firestore documents
              category: doc.data().schedTransactionsCategory, // Make sure this field exists in your Firestore documents
              currency: doc.data().schedTransactionsCurrency, // Make sure this field exists in your Firestore documents
              date: doc.data().schedTransactionsDate, // Make sure this field exists in your Firestore documents
              recurrence: doc.data().schedTransactionsRecurrence, // Make sure this field exists in your Firestore documents
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
  width: auto;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
  height: 100px;
}

.transaction-amount {
  align-items: flex-end;
  font-size: 1rem;
  font-weight: bold;
}

.transaction-name,
.transaction-date,
.transaction-recurrence {
  width: 100%;
  margin: 0;
  padding: 5px;
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

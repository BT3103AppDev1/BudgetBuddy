<template>
  <div class="transaction-history-page">
    <div class="transaction-list">
      <ul>
        <li
          v-for="transaction in transactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-icon"><!-- Icon based on category --></div>
          <div class="transaction-details">
            <h3 class="transaction-name">{{ transaction.name }}</h3>
            <p class="transaction-date">{{ transaction.date }}</p>
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
          this.transactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            name: doc.data().name, // Make sure this field exists in your Firestore documents
            amount: doc.data().amount, // Make sure this field exists in your Firestore documents
            category: doc.data().category, // Make sure this field exists in your Firestore documents
            currency: doc.data().currency, // Make sure this field exists in your Firestore documents
            date: doc.data().date, // Make sure this field exists in your Firestore documents
            description: doc.data().description, // Make sure this field exists in your Firestore documents
          }));
        },
        (error) => {
          console.error("Error getting documents: ", error);
        }
      );
    },
  },
};
</script>

<style scoped>
.transaction-history-container {
  display: flex;
}

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

.transaction-date {
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

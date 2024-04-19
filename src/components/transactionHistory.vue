<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div class="transaction-history-page">
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
    <div class="transaction-list">
      <ul>
        <li
          v-for="transaction in filteredTransactions"
          :key="transaction.id"
          class="transaction-item"
        >
          <div class="transaction-details">
            <h3 class="transaction-name">{{ transaction.name }}</h3>
            <p class="transaction-date">{{ transaction.date }}</p>
            <p class="transaction-category">{{ transaction.category }}</p>
          </div>
          <div class="transaction-actions">
            <i class="fas fa-pencil-alt" @click="enableTransactionEdit(transaction)"></i>
            <i class="fas fa-trash" @click="deleteTransaction(transaction.id)"></i>
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
      <div v-if="editingTransactionId" class="overlay">
          <div class="edit-transaction-form">
            <h2>Edit Transaction</h2>
            <input v-model="editedTransactionDetails.name" placeholder="Transaction Name" />
            <input v-model="editedTransactionDetails.amount" type="number" placeholder="Amount" />
            <select v-model="editedTransactionDetails.category">
              <option value="transport">Transport</option>
              <option value="shopping">Shopping</option>
              <option value="food">Food</option>
              <option value="others">Others</option>
            </select>
            <input v-model="editedTransactionDetails.date" type="date" />
            <button @click="updateTransaction" class="save-btn">Save Changes</button>
            <button @click="cancelTransactionEdit" class="cancel-btn">Cancel</button>
          </div>
        </div>
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
import { onSnapshot, collection } from "firebase/firestore";
import {
  getFirestore,
  doc,
  updateDoc,
  deleteDoc,
  FieldValue,
  deleteField,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      auth: null,
      editingTransactionId: null,
      editedTransactionDetails: {},
      transactions: [],
      selectedFilter: "",
      selectedCategory: "",
      selectedDateFilter: "",
    };
  },
  mounted() {
    this.fetchTransactions();
  },
  created() {
    this.auth = getAuth(firebaseApp); // Initialize Firebase Auth here
  },
  methods: {
    fetchTransactions() {
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
      const query = collection(db, "users", userId, "transactions");
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
    enableTransactionEdit(transaction) {
      this.editingTransactionId = transaction.id;
      this.editedTransactionDetails = { ...transaction };
    },
    cancelTransactionEdit() {
      this.editingTransactionId = null;
    },
    async deleteTransaction(transactionId) {
      const auth = getAuth(firebaseApp);
      const db = getFirestore(firebaseApp);
      const user = auth.currentUser;
      if (user) {
        console.log("User ID:", user.uid); // Make sure you can retrieve the user ID
      }
      if (!user) {
        console.error("No user logged in!");
        return;
      }
      const userId = user.uid;
      const transactionDocRef = doc(db, 'users', userId, 'transactions', transactionId);

      try {
        await deleteDoc(transactionDocRef);
        this.fetchTransactions(); // Refresh the list
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    },
    async updateTransaction() {
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
      if (!this.editingTransactionId) return;

      const db = getFirestore(firebaseApp);
      const transactionDocRef = doc(db, 'users', userId, 'transactions', this.editingTransactionId);

      const updates = {
        ...this.editedTransactionDetails,
        currency: deleteField(), // This line will remove the 'currency' field from the document
      };
      try {
        await updateDoc(transactionDocRef, updates);
        this.editingTransactionId = null; // Reset editing mode
        this.fetchTransactions(); // Refresh the list
        this.editedTransactionDetails = {}; // Clear the form
      } catch (error) {
        console.error("Error updating transaction:", error);
      }
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
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.edit-transaction-form {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.edit-transaction-form input, .edit-transaction-form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.edit-transaction-form button {
  padding: 10px 20px;
  margin-right: 10px;
  background-color: lightgrey;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.edit-transaction-form button {
  background-color: grey;
}


.edit-transaction-form button.save-btn:hover {
  background-color: #45a049;
}

.edit-transaction-form button.cancel-btn:hover {
  background-color: #f44336;
}
.transaction-history-page {
  display: flex;
  flex-direction: column;
  justify-content: start;
}



.transaction-list {
  margin: 0;
  padding: 0;
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
.transaction-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 1.2rem;
}

.transaction-actions i {
  cursor: pointer;
  margin: 0 10px;
}

.transaction-actions i:hover {
  color: darkred; /* For delete icon */
  color: darkblue; /* For edit icon */
}


.transaction-name,
.transaction-date,
.transaction-category {
  width: 100%; /* Ensures the text elements take up the full width of the .transaction-details container */
  margin: 0; /* Removes any default margins */
  display: block; /* Display as block elements */
  padding: 5px;
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
  margin: 8px auto; /* Centering button */
}

.positive {
  color: #5cb85c; /* Green color for positive amounts */
}

.negative {
  color: #ff3860; /* Red color for negative amounts */
}
</style>

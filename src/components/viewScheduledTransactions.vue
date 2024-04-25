<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div class="scheduled-transaction-history-page">
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
          <div class="transaction-actions">
            <i class="fas fa-pencil-alt" @click="enableScheduledTransactionEdit(transaction)"></i>
            <i class="fas fa-trash" @click="deleteScheduledTransaction(transaction.id)"></i>
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
      <div v-if="editingScheduledTransactionId" class="overlay">
          <div class="edit-transaction-form">
            <h2>Edit Scheduled Transaction</h2>
            <input v-model="editedScheduledTransactionDetails.name" placeholder="Scheduled Transaction Name" />
            <input v-model="editedScheduledTransactionDetails.amount" type="number" placeholder="Amount" />
            <select v-model="editedTransactionDetails.category">
              <option value="income">Income</option>
              <option value="allowance">Allowance</option>
              <option value="expenses">Expenses</option>
              <option value="subscriptions">Subscriptions</option>
              <option value="others">Others</option>
            </select>
            <input v-model="editedTransactionDetails.date" type="date" />
            <button @click="updateScheduledTransaction" class="save-btn">Save Changes</button>
            <button @click="cancelScheduledTransactionEdit" class="cancel-btn">Cancel</button>
          </div>
        </div>
        <br>
      <router-link
        to="/addScheduledTransaction"
        tag="button"
        class="add-sched-transaction-btn"
      >
        Add New Scheduled Transaction
      </router-link>
    </div>
  </div>
</div>
</template>

<script>
import {
  getFirestore,
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  FieldValue,
  deleteField,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      auth: null,
      editingScheduledTransactionId: null,
      editedScheduledTransactionDetails: {},
      scheduledTransactions: [],
      selectedFilter: "",
      selectedCategory: "",
      selectedRecurrence: "",
    };
  },
  mounted() {
    this.fetchScheduledTransactions();
  },
  created() {
    this.auth = getAuth(firebaseApp); // Initialize Firebase Auth here
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
    enableScheduledTransactionEdit(scheduledTransaction) {
      this.editingScheduledTransactionId = scheduledTransaction.id;
      this.editedScheduledTransactionDetails = { ...scheduledTransaction };
    },
    cancelScheduledTransactionEdit() {
      this.editingScheduledTransactionId = null;
    },
    async deleteScheduledTransaction(scheduledTransactionId) {
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
      const scheduledTransactionDocRef = doc(db, 'users', userId, 'scheduledTransaction', scheduledTransactionId);

      try {
        await deleteDoc(scheduledTransactionDocRef);
        this.fetchScheduledTransactions(); // Refresh the list
      } catch (error) {
        console.error("Error deleting scheduled transaction:", error);
      }
    },
    async updateScheduledTransaction() {
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
      if (!this.editingScheduledTransactionId) return;

      const db = getFirestore(firebaseApp);
      const scheduledTransactionDocRef = doc(db, 'users', userId, 'scheduledTransaction', this.editingScheduledTransactionId);

      const updates = {
        ...this.editedScheduledTransactionDetails,
        currency: deleteField(), // This line will remove the 'currency' field from the document
      };
      try {
        await updateDoc(scheduledTransactionDocRef, updates);
        this.editingScheduledTransactionId = null; // Reset editing mode
        this.fetchScheduledTransactions(); // Refresh the list
        this.editedScheduledTransactionDetails = {}; // Clear the form
      } catch (error) {
        console.error("Error updating scheduled transaction:", error);
      }
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

.scheduled-transaction-history-page {
  display: flex;
  flex-direction: column;
  justify-content: start;
}
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
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease-in-out;
  background-color: #4CAF50; /* A green shade */
  color: white;
  text-decoration: none;
}

.add-sched-transaction-btn:hover {
  box-shadow: 3px 3px grey;
  background-color:rgb(0, 119, 0); /* Darker shade on hover */
}

.positive {
  color: #5cb85c; /* Green color for positive amounts */
}

.negative {
  color: #ff3860; /* Red color for negative amounts */
}
</style>

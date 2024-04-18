<template>
  <div class="schedule-transactions-container">
    <h1>Schedule Transactions</h1>
    <form
      id="submitScheduledTransaction"
      @submit.prevent="saveScheduledTransac"
    >
      <!-- Transaction Name Input -->
      <div class="input-group">
        <label for="schedTransactionName">Transaction Name *</label>
        <input
          type="text"
          id="schedTransactionName"
          v-model="scheduledTransaction.schedTransactionName"
          required
          class="input-field"
        />
      </div>

      <!-- Amount Input -->
      <div class="input-group">
        <label for="schedTransactionAmount"
          >Amount (Include negative sign if it is subtracting from account)
          *</label
        >
        <input
          type="number"
          id="schedTransactionAmount"
          step="0.01"
          v-model="scheduledTransaction.schedTransactionAmount"
          required
        />
      </div>

      <!-- Category Select -->
      <div class="input-group">
        <label for="schedTransactionsCategory">Category *</label>
        <select
          id="schedTransactionsCategory"
          v-model="scheduledTransaction.schedTransactionsCategory"
          required
        >
          <option disabled value="">Please select one</option>
          <option value="income">Income</option>
          <option value="allowance">Allowance</option>
          <option value="expenses">Expenses</option>
          <option value="subscriptions">Subscriptions</option>
          <option value="others">Others</option>
          <!-- Correct the values for each option -->
        </select>
      </div>

      <!-- Start Date Picker -->
      <div class="input-group">
        <label for="schedTransactionsDate">Start Date *</label>
        <input
          type="date"
          id="schedTransactionsDate"
          v-model="scheduledTransaction.schedTransactionsDate"
          required
        />
      </div>

      <!-- Recurrence Select -->
      <div class="input-group">
        <label for="schedTransactionsRecurrence">Recurrence *</label>
        <select
          id="schedTransactionsRecurrence"
          v-model="scheduledTransaction.recurrence"
          required
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <!-- more options -->
        </select>
      </div>

      <!-- Submit Button -->
      <div class="button-container">
        <button type="submit" class="btn">Add Scheduled Transaction</button>
      </div>
    </form>
    <router-link
      to="/viewScheduledTransactions"
      tag="button"
      class="view-sched-transaction-btn"
    >
      View Scheduled Transactions
    </router-link>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      auth: null,
      scheduledTransaction: {
        schedTransactionName: "",
        schedTransactionAmount: null,
        schedTransactionsCategory: "",
        schedTransactionsDate: "",
        schedTransactionsRecurrence: "",
      },
    };
  },

  methods: {
    async saveScheduledTransac() {
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
      const schedTransactionsRef = collection(
        db,
        "users",
        userId,
        "scheduledTransaction"
      );

      // Process the form data here, such as sending it to a server or updating local state
      console.log(this.scheduledTransaction);

      alert(
        "Saving data for Scheduled Transaction : " +
          this.scheduledTransaction.schedTransactionName +
          " " +
          this.scheduledTransaction.schedTransactionAmount
      );
      try {
        const docRef = await addDoc(schedTransactionsRef, {
          schedTransactionName: this.scheduledTransaction.schedTransactionName,
          schedTransactionAmount:
            this.scheduledTransaction.schedTransactionAmount,
          schedTransactionsCategory:
            this.scheduledTransaction.schedTransactionsCategory,
          schedTransactionsDate:
            this.scheduledTransaction.schedTransactionsDate,
          schedTransactionsRecurrence:
            this.scheduledTransaction.schedTransactionsRecurrence,
        });
        console.log("Document written with ID: ", docRef.id);
        console.log("Document written with ID: ", docRef.id);
        this.scheduledTransaction = {
          schedTransactionName: "",
          schedTransactionAmount: null,
          schedTransactionsCategory: "",
          schedTransactionsDate: "",
          schedTransactionsRecurrence: "",
        };
        this.$emit("added");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
  },
};
</script>

<style scoped>
.schedule-transactions-container {
  max-width: 600px; /* Adjust the width as needed */
  margin: 0 auto; /* This centers your form on the page */
  padding: 2rem;
  background-color: #fff; /* Use color from your design */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* subtle shadow */
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666; /* Use color from your design */
}
.input-group {
  margin-bottom: 1rem;
}

.input-field, /* Apply same styles for all input types */
    input[type="number"],
    input[type="date"],
    select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd; /* Use color from your design */
  border-radius: 5px;
  font-size: 1rem;
}
.btn {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 25px;
  color: white;
  margin-top: 20px;
  width: 100%;
  padding: 2%;
  background-color: #474745;
  cursor: pointer;
}

.btn:hover {
  text-decoration: underline;
  font-weight: 900;
}

.button-container {
  display: flex;
  justify-content: center;
}

.view-sched-transaction-btn {
  font-family: "Roboto", sans-serif;
  text-transform: uppercase;
  font-size: 16px; /* Adjusted for better fit */
  color: white;
  margin-top: 20px;
  padding: 10px 20px; /* Adjust padding as needed */
  cursor: pointer;
  text-decoration: none; /* Removes underline from links */
  display: inline-block; /* Helps with alignment */
  border: none;
  border-radius: 5px;
  background-color: #5cb85c; /* Different color to distinguish */
}
.view-sched-transaction-btn:hover {
  background-color: #4cae4c; /* Darker shade for hover */
  text-decoration: underline;
  font-weight: 700;
}

/* Add responsive styles as necessary */
</style>

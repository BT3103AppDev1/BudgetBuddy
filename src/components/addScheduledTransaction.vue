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
        <label for="schedTransactionAmount">Amount *</label>
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

      <!-- Currency Select -->
      <div class="input-group">
        <label for="schedTransactionsCurrency">Currency *</label>
        <select
          id="schedTransactionsCurrency"
          v-model="scheduledTransaction.schedTransactionsCurrency"
          required
        >
          <option value="SGD">SGD - Singapore Dollar</option>
          <!-- more options -->
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
          <option value="monthly">Yearly</option>
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
const db = getFirestore(firebaseApp);

export default {
  data() {
    return {
      scheduledTransaction: {
        schedTransactionName: "",
        schedTransactionAmount: null,
        schedTransactionsCategory: "",
        schedTransactionsCurrency: "",
        schedTransactionsDate: "",
        schedTransactionsRecurrence: "",
      },
    };
  },

  methods: {
    async saveScheduledTransac() {
      // Process the form data here, such as sending it to a server or updating local state
      console.log(this.scheduledTransaction);
      let schedTransactionName = document.getElementById(
        "schedTransactionName"
      ).value;
      let schedTransactionAmount = +document.getElementById(
        "schedTransactionAmount"
      ).value;
      let schedTransactionsCategory = document.getElementById(
        "schedTransactionsCategory"
      ).value;
      let schedTransactionsCurrency = document.getElementById(
        "schedTransactionsCurrency"
      ).value;
      let schedTransactionsDate = document.getElementById(
        "schedTransactionsDate"
      ).value;
      let schedTransactionsRecurrence = document.getElementById(
        "schedTransactionsRecurrence"
      ).value;

      alert(
        "Saving data for Scheduled Transaction : " +
          schedTransactionName +
          " " +
          schedTransactionAmount
      );
      try {
        const docRef = await addDoc(collection(db, "scheduledTransaction"), {
          schedTransactionName: schedTransactionName,
          schedTransactionAmount: schedTransactionAmount,
          schedTransactionsCategory: schedTransactionsCategory,
          schedTransactionsCurrency: schedTransactionsCurrency,
          schedTransactionsDate: schedTransactionsDate,
          schedTransactionsRecurrence: schedTransactionsRecurrence,
        });
        console.log("Document written with ID: ", docRef.id);
        this.scheduledTransaction = {
          schedTransactionName: "",
          schedTransactionAmount: null,
          schedTransactionsCategory: "",
          schedTransactionsCurrency: "",
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

/* Add responsive styles as necessary */
</style>

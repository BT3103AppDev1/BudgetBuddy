<template>
  <div class="schedule-transactions-container">
    <h1>Schedule Transactions</h1>
    <form id="submitScheduledTransaction">
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
      <button type="button" v-on:click="saveScheduledTransac">
        Add Scheduled Transaction
      </button>
    </form>
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

.input-group {
  margin-bottom: 1rem;
}

.input-field, /* Apply same styles for all input types */
    input[type="number"],
    input[type="date"],
    select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem; /* Ensure the font size is consistent */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #333; /* Adjust the color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #555; /* Darker shade for hover state */
}

/* Add responsive styles as necessary */
</style>

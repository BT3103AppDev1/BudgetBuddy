<template>
  <div class="schedule-transactions-container">
    <h1>Schedule Transactions</h1>
    <form
      id="submitScheduledTransaction"
      @submit.prevent="saveScheduledTransac"
    >
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
        </select>
      </div>

      <div class="input-group">
        <label for="schedTransactionsDate">Start Date *</label>
        <input
          type="date"
          id="schedTransactionsDate"
          v-model="scheduledTransaction.schedTransactionsDate"
          required
        />
      </div>

      <div class="input-group">
        <label for="schedTransactionsRecurrence">Recurrence *</label>
        <select
          id="schedTransactionsRecurrence"
          v-model="scheduledTransaction.schedTransactionsRecurrence"
          required
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <br />

      <div class="button-container">
        <button type="submit" class="btn">Add Scheduled Transaction</button>
      </div>
    </form>
  </div>
  <br /><br />
  <router-link
    to="/viewScheduledTransactions"
    tag="button"
    class="view-sched-transaction-btn"
  >
    View Scheduled Transactions
  </router-link>
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
        console.log("User ID:", user.uid);
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

      console.log(this.scheduledTransaction);

      alert(
        "Saving data for Scheduled Transaction : " +
          this.scheduledTransaction.schedTransactionName +
          ": " +
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
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}
.input-group {
  margin-bottom: 1rem;
}

.input-field,
input[type="number"],
input[type="date"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
}
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease,
    box-shadow 0.3s ease-in-out;
  background-color: #4caf50;
  color: white;
}

.btn:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(0, 119, 0);
}

.button-container {
  display: flex;
  justify-content: center;
}

.view-sched-transaction-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease,
    box-shadow 0.3s ease-in-out;
  background-color: #7e7e7e;
  color: white;
  text-decoration: none;
}
.view-sched-transaction-btn:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(51, 51, 51);
}
</style>

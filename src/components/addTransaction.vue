<template>
  <div class="add-transaction">
    <form id="transactionform">
      <h2>Add Transaction</h2>

      <div class="form-group">
        <label for="amount">Amount *</label>
        <input
          type="number"
          id="amount"
          v-model="transaction.amount"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <input type="text" id="description" v-model="transaction.description" />
      </div>

      <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" v-model="transaction.category" required>
          <option value="NIL"></option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="food">Food</option>
          <!-- Add more categories here -->
        </select>
      </div>

      <div class="form-group">
        <label for="currency">Currency *</label>
        <select id="currency" v-model="transaction.currency" required>
          <option value="NIL"></option>
          <option value="SGD">SGD - Singapore Dollar</option>
          <option value="USD">USD - US Dollar</option>
          <!-- Add more currencies here -->
        </select>
      </div>

      <div class="form-group">
        <label for="date">Date *</label>
        <input type="date" id="date" v-model="transaction.date" required />
      </div>

      <button type="button" v-on:click="saveAddTransac">Add Transaction</button>
    </form>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
const db = getFirestore(firebaseApp);
export default {
  data() {
    return {
      transaction: {
        amount: null,
        description: "",
        category: "",
        currency: "",
        date: "",
      },
    };
  },
  methods: {
    async saveAddTransac() {
      // Process the form data here, such as sending it to a server or updating local state
      console.log(this.transaction);
      let amount = document.getElementById("amount").value;
      let description = document.getElementById("description").value;
      let category = document.getElementById("category").value;
      let currency = document.getElementById("currency").value;
      let date = document.getElementById("date").value;

      alert("Saving data for Transaction : " + category + " " + amount);
      try {
        const docRef = await setDoc(doc(db, "transactions", description), {
          amount: amount,
          description: description,
          category: category,
          currency: currency,
          date: date,
        });
        console.log(docRef);
        document.getElementById("transactionform").reset();
        this.$emit("added");
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    },
  },
};
</script>

<style scoped>
/* You can adjust the values below to match your design exactly */
.add-transaction {
  max-width: 600px; /* Adjust the width as needed */
  margin: 0 auto; /* This centers your form on the page */
  padding: 2rem;
  background-color: #fff; /* Use color from your design */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* subtle shadow */
}

.add-transaction h2 {
  margin-bottom: 1.5rem;
  color: #333; /* Use color from your design */
  text-align: center;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666; /* Use color from your design */
}

.form-group input[type="number"],
.form-group input[type="text"],
.form-group select,
.form-group input[type="date"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd; /* Use color from your design */
  border-radius: 5px;
  font-size: 1rem;
}

.form-group button {
  width: 100%;
  padding: 1rem;
  border: none;
  background-color: #333; /* Use color from your design */
  color: white; /* Text color */
  font-size: 1.1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.form-group button:hover {
  background-color: #555; /* Darken button on hover */
}

/* Adjust this path to wherever your icons are coming from */
.form-group select {
  background-image: url("path-to-your-icon.svg");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  -moz-appearance: none;
  -webkit-appearance: none;
  appearance: none; /* To remove default arrow from select */
}

/* If you want to show an error message, you can style it like this */
.error-message {
  color: #ff3860; /* Error color */
  margin-top: 0.5rem;
}

/* Add responsiveness if needed */
@media (max-width: 768px) {
  .add-transaction {
    padding: 1rem;
  }
}
</style>

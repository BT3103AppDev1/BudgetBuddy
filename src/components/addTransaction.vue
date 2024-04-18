<template>
  <div class="add-transaction">
    <form id="transactionform" @submit.prevent="saveAddTransac">
      <h1>Add Transaction</h1>

      <div class="form-group">
        <label for="name">Transaction Name *</label>
        <input
          type="text"
          id="name"
          v-model="transaction.name"
          required
          class="input-field"
        />
      </div>

      <div class="form-group">
        <label for="amount"
          >Amount (Include negative sign if it is subtracting from account)
          *</label
        >
        <input
          type="number"
          id="amount"
          step="0.01"
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
          <option value="food">Others</option>
          <!-- Add more categories here -->
        </select>
      </div>

      <div class="form-group">
        <label for="date">Date *</label>
        <input type="date" id="date" v-model="transaction.date" required />
      </div>

      <div class="form-group">
        <label for="budgetTakenFrom">Budget Taken From</label>
        <select id="budgetTakenFrom" v-model="selectedBudget">
          <option disabled value="">Select a budget</option>
          <option
            v-for="budget in budgets"
            :key="budget.id"
            :value="budget.name"
          >
            {{ budget.name }}
          </option>
        </select>
      </div>

      <div class="button-container">
        <button type="submit" class="btn">Add Transaction</button>
      </div>
    </form>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore } from "firebase/firestore";
import { doc, setDoc, addDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore(firebaseApp);
export default {
  data() {
    return {
      auth: null,
      transaction: {
        name: "",
        amount: null,
        description: "",
        category: "",
        date: "",
      },
      budgets: [],
      selectedBudget: "",
    };
  },
  created() {
    this.auth = getAuth(firebaseApp); // Initialize Firebase Auth here
  },
  mounted() {
    this.fetchBudgets();
  },

  methods: {
    async saveAddTransac() {
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

      const transactionsRef = collection(db, "users", userId, "transactions");

      try {
        const docRef = await addDoc(transactionsRef, {
          name: this.transaction.name,
          amount: this.transaction.amount,
          description: this.transaction.description,
          category: this.transaction.category,
          date: this.transaction.date,
          budgetTakenFrom: this.selectedBudget,
        });
        console.log("Document written with ID:", docRef.id);
        // Reset the transaction object
        this.transaction = {
          name: "",
          amount: null,
          description: "",
          category: "",
          date: "",
        };
        this.$emit("added");
      } catch (error) {
        console.error("Error adding document:", error);
      }
    },

    async fetchBudgets() {
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
      const budgetsRef = collection(db, "users", userId, "budgets");

      const querySnapshot = await getDocs(budgetsRef);
      this.budgets = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
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
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: auto;
}

.add-transaction h2 {
  margin-bottom: 1.5rem;
  color: #333; /* Use color from your design */
  text-align: center;
}

.form-group {
  width: 100%;
  margin-bottom: 1rem; /* Adjust this value to increase or decrease the space between form groups */
  display: flex;
  flex-direction: column;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666; /* Use color from your design */
}

.form-group input[type="number"],
.form-group input[type="text"],
.form-group input[type="date"],
.form-group select {
  width: 100%;
  padding: 10px;
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

Adjust this path to wherever your icons are coming from .form-group select {
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

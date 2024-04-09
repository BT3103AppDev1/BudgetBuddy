<template>
  <div class="add-budget-container">
    <h1>Add Budget</h1>
    <form id="submitBudget">
      <!-- Amount Input -->
      <div class="input-group">
        <label for="name">Budget Name *</label>
        <input
          type="text"
          id="name"
          v-model="budget.name"
          required
          class="input-field"
        />
      </div>
      <!-- Amount Input -->
      <div class="input-group">
        <label for="amount">Amount *</label>
        <input type="number" id="amount" v-model="budget.amount" required />
      </div>

      <!-- Category Select -->
      <div class="input-group">
        <label for="category">Category *</label>
        <select id="category" v-model="budget.category" required>
          <option disabled value="">Please select one</option>
          <option value="transport">Transport</option>
          <option value="shopping">Shopping</option>
          <option value="food">Food</option>
          <option value="others">Others</option>
          <!-- more options -->
        </select>
      </div>

      <!-- Currency Select -->
      <div class="input-group">
        <label for="currency">Currency *</label>
        <select id="currency" v-model="budget.currency" required>
          <option disabled value="">Please select currency</option>
          <option value="SGD">SGD - Singapore Dollar</option>
          <option value="USD">USD - US Dollar</option>
          <!-- more options -->
        </select>
      </div>

      <!-- Date Range Picker or Two Date Inputs -->
      <div class="input-group">
        <label for="startDate">Start Date *</label>
        <input type="date" id="startDate" v-model="budget.startDate" required />
      </div>
      <div class="input-group">
        <label for="endDate">End Date *</label>
        <input type="date" id="endDate" v-model="budget.endDate" required />
      </div>

      <!-- Submit Button -->
      <button type="button" v-on:click="saveAddBudget">Add Budget</button>
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
      budget: {
        name: "",
        amount: null,
        category: "",
        currency: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async saveAddBudget() {
      console.log(this.budget);
      let name = document.getElementById("name").value;
      let amount = +document.getElementById("amount").value;
      let category = document.getElementById("category").value;
      let currency = document.getElementById("currency").value;
      let startDate = document.getElementById("startDate").value;
      let endDate = document.getElementById("endDate").value;

      alert("Saving data for Budget : " + name);
      try {
        const docRef = await addDoc(collection(db, "budgets"), {
          name: name,
          amount: amount,
          category: category,
          currency: currency,
          startDate: startDate,
          endDate: endDate,
        });
        console.log("Document written with ID: ", docRef.id);
        this.budget = {
          name: "",
          amount: null,
          category: "",
          currency: "",
          startDate: "",
          endDate: "",
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
.add-budget-container {
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
.input-field,
input[type="number"],
input[type="date"],
select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd; /* Use color from your design */
  border-radius: 5px;
  font-size: 1rem;
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

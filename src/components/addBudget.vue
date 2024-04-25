<template>
  <div class="add-budget-container">
    <h1>Add Budget</h1>
    <form id="submitBudget" @submit.prevent="saveAddBudget">
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
        <input
          type="number"
          id="amount"
          step="0.01"
          v-model="budget.amount"
          required
        />
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
      <br>
      <div class="button-container">
        <button type="submit" class="btn">Add Budget</button>
      </div>
      <br> 
    </form>
    
  </div>
  <br><br>
  <router-link to="/goalSetting" class="view-budgets-btn">View All Budgets</router-link>
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
      budget: {
        name: "",
        amount: null,
        category: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  created() {
    this.auth = getAuth(firebaseApp);
  },
  methods: {
    async saveAddBudget() {
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
      const budgetRef = collection(db, "users", userId, "budgets");
      console.log(this.budget);
      let name = document.getElementById("name").value;
      let amount = +document.getElementById("amount").value;
      let category = document.getElementById("category").value;
      let startDate = document.getElementById("startDate").value;
      let endDate = document.getElementById("endDate").value;

      alert("Saving data for Budget : " + name);
      try {
        const docRef = await addDoc(budgetRef, {
          name: name,
          amount: amount,
          category: category,
          startDate: startDate,
          endDate: endDate,
        });
        console.log("Document written with ID: ", docRef.id);
        this.budget = {
          name: "",
          amount: null,
          category: "",
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

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 20px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease-in-out;
  background-color: #4CAF50; /* A green shade */
  color: white;
}

.btn:hover {
  box-shadow: 3px 3px grey;
  background-color:rgb(0, 119, 0); /* Darker shade on hover */
}

.button-container {
  display: flex;
  justify-content: center;
}
.view-budgets-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 15px;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease-in-out;
  background-color: #7b7b7b; /* A green shade */
  color: white;
  text-decoration: none; /* Removes underline */

}

.view-budgets-btn:hover {
  box-shadow: 3px 3px grey;
  background-color:rgb(69, 69, 69); /* Darker shade on hover */
}

/* Add responsive styles as necessary */
</style>

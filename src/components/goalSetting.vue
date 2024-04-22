<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
  <div class="budget-tracker">
    <div class="budget" v-for="budget in displayedGoals" :key="budget.id">
      <div class="budget-header">
        <h3>{{ budget.name}} <i class="fas fa-pencil-alt edit-icon" @click="enableEditMode(budget)"></i></h3>
        <span>{{ budget.startDate }} - {{ budget.endDate }}</span>
      </div>
      <div class="budget-details">
        <span>${{ (budget.remaining ?? 0).toFixed(2) }} Remaining </span>
        <div class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{
              width: progressWidth(budget),
              backgroundColor: progressBarColor(budget),
            }"
          ></div>
        </div>
        <span
          >${{ (budget.spent ?? 0).toFixed(2) }} of ${{
            (budget.amount ?? 0).toFixed(2)
          }}</span
        >
        <p v-if="budget.remaining < 0" class="over-limit-warning">
          You've exceeded the limit!
        </p>
        <p v-if="budget.remaining > 0" class="below-limit-warning">
          You are left with ${{ budget.remaining.toFixed(2) }}!
        </p>
      </div>
    </div>
    <div v-if="editingBudgetId" class="overlay"></div>
    <div v-if="editingBudgetId" class="edit-budget-form">
      <h2>Edit your budget</h2>
      <input
        v-model="editedBudgetDetails.name"
        type="text"
        placeholder="Budget Name"
      />
      <input
        v-model="editedBudgetDetails.amount"
        type="number"
        placeholder="Total Amount"
      />
      <input v-model="editedBudgetDetails.startDate" type="date" />
      <input v-model="editedBudgetDetails.endDate" type="date" />
      <!-- ... other fields as needed ... -->
      <button @click="updateBudget" class="save-btn">Save Changes</button>
      <span @click="cancelEditMode" class="cancel-btn">x</span>
      <button @click="deleteBudget" class="delete-btn">Delete Budget</button>
    </div>
    <router-link v-if="showAddButton" to="/addBudget" tag="button" class="add-budget-btn">
      Add New Budget
    </router-link>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import {
  getFirestore,
  where,
  query,
  doc,
  collection,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export default {
  props: {
    showAddButton: {
      type: Boolean,
      default: true  // By default, show the button
    },
    budgets: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: Infinity
    }
  },
  
  data() {
    return {
      auth: null,
      budgets: [], // Array to store budget data from Firestore
      editingBudgetId: null,
      editedBudgetDetails: {},
    };
  },
  

  async mounted() {
    await this.fetchBudgets();
    await this.calculateSpentAmounts();
  },
  computed: {
    displayedGoals() {
      return this.budgets.slice(0, this.limit);
    },

    computedBudgets() {
      return this.budgets.map((budget) => {
        const amount = Number(budget.amount) || 0;
        const spent = Number(budget.spent) || 0;
        const remaining = amount - spent;
        return {
          ...budget,
          remaining: remaining,
          spent: spent,
        };
      });
    },
  },

  methods: {
    progressWidth(budget) {
      const percentage = (budget.spent / budget.amount) * 100;
      return `${Math.min(percentage, 100)}%`;
    },
    progressBarColor(budget) {
      const percentage = (budget.spent / budget.amount) * 100;
      const hue = 120 - percentage * 1.2;
      const color = `hsl(${hue}, 100%, 50%)`; // Ensure the HSL value is correct
      return color;
    },
    enableEditMode(budget) {
      this.editingBudgetId = budget.id;
      this.editedBudgetDetails = { ...budget }; // Make a shallow copy to edit
    },

    cancelEditMode() {
      this.editingBudgetId = null;
      this.editedBudgetDetails = {};
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
      const db = getFirestore(firebaseApp);
      const budgetsCol = collection(db, "users", userId, "budgets");
      try {
        const querySnapshot = await getDocs(budgetsCol);
        this.budgets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: Number(doc.data().amount),
          startDate: doc.data().startDate,
          endDate: doc.data().endDate,
          category: doc.data().category,
        }));
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    },
    async deleteBudget() {
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
      if (!this.editingBudgetId) return;

      const db = getFirestore(firebaseApp);
      const budgetDocRef = doc(
        db,
        "users",
        userId,
        "budgets",
        this.editingBudgetId
      );

      try {
        await deleteDoc(budgetDocRef); // Firebase function to delete a document

        // Remove the budget from the local state to update UI
        this.budgets = this.budgets.filter(
          (budget) => budget.id !== this.editingBudgetId
        );

        this.editingBudgetId = null; // Close the edit form
        this.editedBudgetDetails = {}; // Reset edited details
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    },

    async updateBudget() {
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
      if (!this.editingBudgetId) return;

      const db = getFirestore(firebaseApp);
      const budgetDocRef = doc(
        db,
        "users",
        userId,
        "budgets",
        this.editingBudgetId
      );

      const currentBudget = this.budgets.find(
        (b) => b.id === this.editingBudgetId
      );

      const updates = {
        ...this.editedBudgetDetails,
        amount: Number(this.editedBudgetDetails.amount),
      };

      updates.remaining = updates.amount + (currentBudget.spent ?? 0);

      try {
        await updateDoc(budgetDocRef, updates);

        const index = this.budgets.findIndex(
          (budget) => budget.id === this.editingBudgetId
        );
        if (index !== -1) {
          this.budgets[index] = {
            ...this.budgets[index],
            ...updates,
            remaining: updates.remaining,
          };
        }
        await this.calculateSpentAmounts();

        this.editingBudgetId = null;
        this.editedBudgetDetails = {};
      } catch (error) {
        console.error("Error updating budget:", error);
      }
    },

    async calculateSpentAmounts() {
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

      const db = getFirestore(firebaseApp);
      const transactionsCol = collection(db, "users", userId, "transactions");

      for (let i = 0; i < this.budgets.length; i++) {
        let budget = this.budgets[i];
        const q = query(
          transactionsCol,
          where("budgetTakenFrom", "==", budget.name),
          where("date", ">=", budget.startDate),
          where("date", "<=", budget.endDate)
        );
        const querySnapshot = await getDocs(q);
        const spentAmount = querySnapshot.docs.reduce((total, doc) => {
          return total + Number(doc.data().amount); // Ensure amount is a number
        }, 0);

        // Directly assign updated values
        budget.spent = -spentAmount; // Set the spent amount for the budget
        budget.remaining = budget.amount + spentAmount; // Calculate the remaining amount
        // Notify Vue about the change
        this.budgets[i] = { ...budget };
      }
      //this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
.budget-tracker {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.budget {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #f8f8f8;
  border-radius: 6px;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.1);
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e7e7e7;
}

.budget-header h3 {
  font-size: 1.2rem;
  color: #333;
}

.budget-details {
  text-align: left;
}

.progress-bar-container {
  background-color: #e7e7e7;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-bar {
  height: 20px;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.over-limit-warning {
  color: #f44336;
  font-weight: bold;
}

.add-budget-btn {
  padding: 0.8rem 2rem;
  background-color: #5cb85c;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
.edit-budget-form {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  z-index: 1000; /* Make sure it's above other elements */
}


.edit-icon {
  cursor: pointer;
  color: gray; /* Adjust the color to match your design */
  margin-left: 10px; /* Space out the icon from the budget name */
  margin-bottom: 8px;
  vertical-align: middle; /* Aligns the icon with the middle of the text */
}

.edit-icon:hover {
  color: darkgray; /* Darker shade for hover effect */
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999; /* Overlay below the form */
}

.add-budget-btn:hover {
  background-color: #4cae4c;
}

/* Utility class for overspending */
.budget-overspent .progress-bar {
  background-color: #f44336;
}

/* Utility class for budget close to limit */
.budget-close .progress-bar {
  background-color: #ffeb3b;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.save-btn:hover {
  background-color: green;
}

.edit-budget-form input[type="text"],
.edit-budget-form input[type="number"],
.edit-budget-form input[type="date"] {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.cancel-btn {
  position: absolute;
  top: 10px;  
  right: 10px; 
  padding: 5px 8px; 
  font-size: 20px;
  cursor: pointer;
  color: #333;
  border: none;
  background: transparent;
  border-radius: 50%; 
}

.cancel-btn:hover {
  background-color: gray; /* Red background on hover */
  color: white; /* White text on hover */
}

.edit-budget-form button {
  padding: 0.8rem 2rem;
  background-color: lightgray;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
}
/* .edit-btn {
  padding: 10px 20px; 
  background-color: gray;
  color: white; 
  border: none; 
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px; 
  transition: background-color 0.3s; 
}  */

/* .edit-btn:hover {
  background-color: darkgray;
} */

</style>

<template>
  <div class="budget-tracker">
    <div class="budget" v-for="budget in budgets" :key="budget.id">
      <div class="budget-header">
        <h3>{{ budget.name }}</h3>
        <span>{{ budget.startDate }} - {{ budget.endDate }}</span>
      </div>
      <div class="budget-details">
        <span>${{ budget.remaining }} Remaining </span>
        <div class="progress-bar-container">
          <div
            class="progress-bar"
            :style="{
              width: progressWidth(budget),
              backgroundColor: progressBarColor(budget),
            }"
          ></div>
        </div>
        <span>${{ budget.spent }} of ${{ budget.amount }}</span>
        <p v-if="budget.remaining < 0" class="over-limit-warning">
          You've exceeded the limit!
        </p>
        <button @click="enableEditMode(budget)">Edit</button>
      </div>
    </div>
    <div v-if="editingBudgetId" class="overlay"></div>
    <div v-if="editingBudgetId" class="edit-budget-form">
      <input v-model="editedBudgetDetails.name" type="text" placeholder="Budget Name">
      <input v-model="editedBudgetDetails.amount" type="number" placeholder="Total Amount">
      <input v-model="editedBudgetDetails.startDate" type="date">
      <input v-model="editedBudgetDetails.endDate" type="date">
      <!-- ... other fields as needed ... -->
      <button @click="updateBudget">Save Changes</button>
      <button @click="cancelEditMode">Cancel</button>
      <button @click="deleteBudget" class="delete-btn">Delete Budget</button>
    </div>
    <router-link to="/addBudget" tag="button" class="add-budget-btn">
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

export default {
  data() {
    return {
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
    computedBudgets() {
      return this.budgets.map(budget => ({
        ...budget,
        remaining: budget.amount - budget.spent
      }));
    }

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
      const db = getFirestore(firebaseApp);
      const budgetsCol = collection(db, "budgets"); // Replace with your budgets collection name
      try {
        const querySnapshot = await getDocs(budgetsCol);
        this.budgets = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          amount: doc.data().amount,
          startDate: doc.data().startDate,
          endDate: doc.data().endDate,
          category: doc.data().category,
          //spent: doc.data().spent || 0,
          //remaining: doc.data().amount,
        }));
      } catch (error) {
        console.error("Error fetching budgets:", error);
      }
    },
  async deleteBudget() {
    if (!this.editingBudgetId) return;

    const db = getFirestore(firebaseApp);
    const budgetDocRef = doc(db, 'budgets', this.editingBudgetId);

    try {
      await deleteDoc(budgetDocRef); // Firebase function to delete a document

      // Remove the budget from the local state to update UI
      this.budgets = this.budgets.filter(budget => budget.id !== this.editingBudgetId);

      this.editingBudgetId = null; // Close the edit form
      this.editedBudgetDetails = {}; // Reset edited details
    } catch (error) {
      console.error("Error deleting budget:", error);
    }
  },

  async updateBudget() {
    if (!this.editingBudgetId) return;

    const db = getFirestore(firebaseApp);
    const budgetDocRef = doc(db, 'budgets', this.editingBudgetId);

    const currentBudget = this.budgets.find(b => b.id === this.editingBudgetId);
    //const newRemaining = this.editedBudgetDetails.amount - currentBudget.spent;

    const updates = {
      ...this.editedBudgetDetails,
      //remaining: newRemaining  // explicitly updating remaining
    };
    
    try {

        await updateDoc(budgetDocRef, updates);

        const index = this.budgets.findIndex(budget => budget.id === this.editingBudgetId);
        if (index !== -1) {
            this.budgets[index] = {
                ...this.budgets[index],
                ...updates,
                //remaining: newRemaining
            };
        }

        this.editingBudgetId = null;
        this.editedBudgetDetails = {};
    } catch (error) {
        console.error("Error updating budget:", error);
    }
  },

  async calculateSpentAmounts() {
      const db = getFirestore(firebaseApp);
      const transactionsCol = collection(db, "transactions");

      for (let i = 0; i < this.budgets.length; i++) {
        let budget = this.budgets[i];
        const q = query(
          transactionsCol,
          where("budgetTakenFrom", "==", budget.name)
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
      this.$forceUpdate();
    },
  }
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

</style>

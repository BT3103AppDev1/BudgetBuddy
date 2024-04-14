<template>
  <div class="budget-tracker">
    <div class="budget" v-for="budget in budgets" :key="budget.id">
      <div class="budget-header">
        <h3>{{ budget.name }}</h3>
        <span>{{ budget.startDate }} - {{ budget.endDate }}</span>
      </div>
      <div class="budget-details">
        <span>Remaining ${{ budget.remaining }}</span>
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
      </div>
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
  collection,
  getDocs,
} from "firebase/firestore";

export default {
  data() {
    return {
      budgets: [], // Array to store budget data from Firestore
    };
  },
  async mounted() {
    await this.fetchBudgets();
    await this.calculateSpentAmounts();
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
          spent: 0,
          remaining: doc.data().amount,
        }));
      } catch (error) {
        console.error("Error fetching budgets:", error);
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
</style>

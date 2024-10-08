<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
  />
  <div class="budget-tracker">
    <div class="budget" v-for="budget in displayedGoals" :key="budget.id">
      <div class="budget-header">
        <h3 @click="toggleTransactions(budget)" class="budget-name">
          {{ budget.name }}
          <i
            class="fas fa-pencil-alt edit-icon"
            @click.stop="enableEditMode(budget)"
          ></i>
        </h3>
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
      <div class="transactions-overlay" v-if="budget.showTransactions">
        <div class="transactions-content">
          <h3>Transactions for {{ budget.name }}</h3>
          <ul v-if="budget.transactions.length > 0" class="transaction-list">
            <li
              v-for="transaction in budget.transactions"
              :key="transaction.id"
            >
              {{ transaction.name }} {{ transaction.date }} ${{
                -transaction.amount
              }}
              {{ transaction.description }}
            </li>
          </ul>
          <p v-else>No transactions found for this budget!</p>
          <button @click="budget.showTransactions = false">Close</button>
        </div>
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
      <button @click="updateBudget" class="save-btn">Save Changes</button>
      <span @click="cancelEditMode" class="cancel-btn">x</span>
      <button @click="deleteBudget" class="delete-btn">Delete Budget</button>
    </div>
    <router-link
      v-if="showAddButton"
      to="/addBudget"
      tag="button"
      class="add-budget-btn"
    >
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
      default: true,
    },
    budgets: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number,
      default: Infinity,
    },
  },

  data() {
    return {
      auth: null,
      budgets: [],
      editingBudgetId: null,
      editedBudgetDetails: {},
      transactions: [],
      showTransactions: false,
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
      const color = `hsl(${hue}, 100%, 50%)`;
      return color;
    },
    enableEditMode(budget) {
      this.editingBudgetId = budget.id;
      this.editedBudgetDetails = { ...budget };
    },

    cancelEditMode() {
      this.editingBudgetId = null;
      this.editedBudgetDetails = {};
    },
    async fetchBudgets() {
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
        console.log("User ID:", user.uid);
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
        await deleteDoc(budgetDocRef);

        this.budgets = this.budgets.filter(
          (budget) => budget.id !== this.editingBudgetId
        );

        this.editingBudgetId = null;
        this.editedBudgetDetails = {};
      } catch (error) {
        console.error("Error deleting budget:", error);
      }
    },

    async updateBudget() {
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
        console.log("User ID:", user.uid);
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
          return total + Number(doc.data().amount);
        }, 0);

        budget.spent = -spentAmount;
        budget.remaining = budget.amount + spentAmount;

        this.budgets[i] = { ...budget };
      }
    },
    toggleTransactions(budget) {
      if (!budget.transactions) {
        this.fetchTransactions(budget).then((transactions) => {
          console.log(transactions);
          if (this.transactions) {
            this.transactions = Array.isArray(transactions) ? transactions : [];
            budget.showTransactions = true;
          } else {
            console.error("Error", transactions);
          }
        });
      } else {
        budget.showTransactions = !budget.showTransactions;
      }
    },
    async fetchTransactions(budget) {
      const auth = getAuth(firebaseApp);
      let transactions = [];
      if (!auth.currentUser) {
        console.error("No user logged in!");
        return;
      }

      const userId = auth.currentUser.uid;
      const db = getFirestore(firebaseApp);
      const transactionsCol = collection(db, "users", userId, "transactions");
      const budgetQuery = query(
        transactionsCol,
        where("budgetTakenFrom", "==", budget.name)
      );

      try {
        const querySnapshot = await getDocs(budgetQuery);
        transactions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          date: doc.data().date,
          amount: doc.data().amount,
          description: doc.data().description,
        }));
        console.log(transactions);

        budget.transactions = transactions;
        budget.showTransactions = true;
      } catch (error) {
        console.error("Failed to fetch transactions for budget:", error);
        return [];
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
  text-decoration: none;
}

.add-budget-btn:hover {
  box-shadow: 3px 3px grey;
  background-color: rgb(0, 119, 0);
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
  z-index: 1000;
}

.edit-icon {
  cursor: pointer;
  color: gray;
  margin-left: 10px;
  margin-bottom: 8px;
  vertical-align: middle;
}

.edit-icon:hover {
  color: darkgray;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 999;
}

.add-budget-btn:hover {
  background-color: #4cae4c;
}

.budget-overspent .progress-bar {
  background-color: #f44336;
}

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
  background-color: gray;
  color: white;
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
.transactions-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.transactions-content {
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 11;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
}

.transactions-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 40%;
  max-height: 80vh;
  overflow-y: auto;
}

.transaction-list {
  list-style-type: none;
  padding: 0;
  text-align: center;
}

.transaction-list li {
  margin-bottom: 10px;
}

.transactions-overlay h3 {
  margin-bottom: 15px;
}

.transactions-overlay button {
  margin-top: 10px;
  padding: 10px 20px;
  border: none;
  background-color: #d9534f;
  color: white;
  cursor: pointer;
  border-radius: 5px;
}

.transactions-overlay button:hover {
  background-color: #c9302c;
}

.budget-header h3 {
  font-size: 1.2rem;
  color: #181819;
  text-decoration: underline;
  cursor: pointer;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.budget-header h3:hover {
  color: #4e2a8e;
}
</style>

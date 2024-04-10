<template>
    <div class="budget-status-page">
    <div class="budget-list">
      <ul>
        <li
          v-for="budget in budgets"
          :key="budget.id"
          class="budget-item"
        >
          <div class="transaction-icon"><!-- Icon based on category --></div>
          <div class="budget-details">
            <h3 class="budget-name">{{ budget.name }}</h3>
            <p class="budget-start-date">{{ budget.startDate }}</p>
            <p class="budget-end-date">{{ budget.endDate }}</p>
          </div>
        </li>
      </ul>
      <router-link
        to="/addBudget"
        tag="button"
        class="add-budget-btn"
      >
        Add New Budget
      </router-link>
    </div>
  </div>
</template>

<script>
import firebaseApp from "../firebase.js";
import { getFirestore, onSnapshot, collection } from "firebase/firestore";
const db = getFirestore(firebaseApp);

export default {
    data() {
        return {
            budgets: [],
        };
    },
    mounted(){
        this.fetchBudgets();
    },
    methods: {
        fetchBudgets() {
            const query = collection(db, "budgets");
            onSnapshot(
                query,
                (querySnapshot) => {
                    this.budgets = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        name: doc.data().name,
                        startDate: doc.data().startDate,
                        endDate: doc.data().endDate,
                        currency: doc.data().currency,
                        amount: doc.data().amount,
                        category: doc.data().category,
                    }));
                },
                (error) => {
                    console.error("Error getting budgets: ", error);
                }
            );
        },
    },
}
</script>

<style scoped>
.budget-page-container {
  display: flex;
}

.budget-list {
  margin: 0;
  padding: 0;
  list-style-type: none;
}

.budget-details {
  justify-content: center;
}

.budget-item {
  background-color: #f9f9f9; /* Light grey background */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px; /* Space between items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.budget-name {
  font-size: 1rem; /* Large font size for visibility */
  color: #333; /* Dark text for contrast */
  font-weight: 500; /* Medium weight for the transaction name */
  justify-content: center;
}

.budget-start-date {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}
.budget-end-date {
  font-size: 0.8rem;
  color: #666; /* Lighter text for the date */
}

.budget-amount {
  font-size: 1rem;
  color: #333;
  font-weight: bold; /* Bold weight for the amount */
}

.add-budget-btn {
  background-color: #5cb85c; /* Example: a green button */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: block; /* Center button in the container */
  width: max-content;
  margin: 10px auto; /* Centering button */
}


</style>
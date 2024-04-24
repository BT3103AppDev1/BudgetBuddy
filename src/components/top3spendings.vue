<template>
  <div>
    <h2>Top 3 Spendings</h2>
    <div class="topSpendings">
      <ul>
        <li
          v-for="(spending, index) in topSpendings"
          :key="index"
          class="transaction-item"
        >
          <div class="transaction-details">
            <h3 class="transaction-name">{{ spending.name }}</h3>
            <p class="transaction-date">{{ spending.date }}</p>
            <p class="transaction-amt">{{ spending.amount }}</p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getFirestore, collection, getDocs } from "firebase/firestore";
import firebaseApp from "../firebase.js";
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      topSpendings: [],
    };
  },
  async mounted() {
    await this.fetchAndComputeTopSpendings();
  },
  methods: {
    async fetchAndComputeTopSpendings() {
      try {
        const db = getFirestore(firebaseApp);
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
        const transactionsCol = collection(db, "users", userId, "transactions");
        const querySnapshot = await getDocs(transactionsCol);

        const aggregatedSpendings = {};
        querySnapshot.forEach((doc) => {
          const transaction = doc.data();
          const dateParts = transaction.date.split("-"); // Split date string by '-'
          const year = dateParts[0];
          const month = dateParts[1];
          const day = dateParts[2];
          const formattedDate = `${year}-${month}-${day}`; // Reformat date if needed
          const name = transaction.name;

          if (!aggregatedSpendings[formattedDate]) {
            aggregatedSpendings[formattedDate] = {
              totalAmount: 0,
              transactions: [],
            };
          }
          aggregatedSpendings[formattedDate].totalAmount += transaction.amount;
          aggregatedSpendings[formattedDate].transactions.push({
            name: transaction.name,
            amount: transaction.amount,
          });
        });

        const spendingsArray = Object.keys(aggregatedSpendings).map((date) => {
          const formattedDate = formatDate(date);
          return {
            date: formattedDate,
            totalAmount: aggregatedSpendings[date].totalAmount,
            transactions: aggregatedSpendings[date].transactions,
          };
        });

        // Function to format date string to "YYYY-MM-DD" format
        function formatDate(dateString) {
          const dateParts = dateString.split("-");
          const year = dateParts[0];
          const month = dateParts[1].padStart(2, "0"); // Ensure month is zero-padded
          const day = dateParts[2].padStart(2, "0"); // Ensure day is zero-padded
          return `${year}-${month}-${day}`;
        }

        this.topSpendings = spendingsArray
          .sort((a, b) => b.amount - a.amount)
          .slice(0, 3);
      } catch (error) {
        console.error("Error fetching and computing top spendings:", error);
      }
    },
  },
};
</script>

<style scoped>
.spendingList {
  margin: 0;
  padding: 0;
}

.transaction-item {
  background-color: #f9f9f9; /* Light grey background */
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px; /* Space between items */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: auto;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex: 1;
  height: 100px;
}

.transaction-amount {
  align-items: flex-end;
  font-size: 1rem;
  font-weight: bold;
}
</style>

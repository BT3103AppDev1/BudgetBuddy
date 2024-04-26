<template>
  <div class="analyticsPageContainer">
    <div class="sidebar">
      <Sidebar />
    </div>
    <div class="maincontent">
      <div class="linechart">
        <line-chart
          v-if="chartData.datasets.length > 0"
          :chart-data="chartData"
          :options="chartOptions"
        />
      </div>
      <div class="top3">
        <top3spendings />
      </div>
      <Logout :user="user" />
    </div>
  </div>
</template>

<script>
import lineChart from "@/components/lineChart.vue";
import {
  getFirestore,
  collection,
  query,
  getDocs,
  orderBy,
} from "firebase/firestore";
import firebaseApp from "../firebase.js";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Logout from "@/components/Logout.vue";
import Sidebar from "@/components/sidebar.vue";
import top3spendings from "@/components/top3spendings.vue";

export default {
  components: {
    lineChart,
    Logout,
    Sidebar,
    top3spendings,
  },
  data() {
    return {
      user: null,
      chartData: {
        labels: [],
        datasets: [],
      },
      chartOptions: {
        plugins: {
          title: {
            display: true,
            text: "Total Spendings Per Month",
            font: {
              size: 16,
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: true,
      },
    };
  },
  async mounted() {
    await this.fetchAndProcessTransactions();
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        this.user = user;
        this.userEmail = user.email;
      } else {
        this.$router.push("/");
      }
    });
  },
  methods: {
    async fetchAndProcessTransactions() {
      const db = getFirestore(firebaseApp);
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
      const transactionsRef = collection(db, "users", userId, "transactions");

      try {
        const q = query(transactionsRef, orderBy("date"));
        const querySnapshot = await getDocs(q);

        let transactionsByMonth = {};

        querySnapshot.forEach((doc) => {
          const transaction = doc.data();
          const month = transaction.date.substring(0, 7);

          if (!transactionsByMonth[month]) {
            transactionsByMonth[month] = 0;
          }

          transactionsByMonth[month] += -transaction.amount;
        });

        const chartLabels = Object.keys(transactionsByMonth);
        const chartDataPoints = Object.values(transactionsByMonth);

        this.chartData = {
          labels: chartLabels,
          datasets: [
            {
              label: "Amount Spent",
              data: chartDataPoints,
              fill: false,
              borderColor: "rgb(75, 192, 192)",
              tension: 0.1,
            },
          ],
        };
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    },
  },
};
</script>

<style>
.analyticsPageContainer {
  display: flex;
  align-items: start;
}

.sidebar {
  flex: 0 0 290px;
}

.maincontent {
  margin: 0 auto;
  flex-grow: 1;
}

.maincontent input[type="date"],
.maincontent select {
  padding: 5px;
  margin-right: 10px;
  border: 1px solid #ccc;
}

.maincontent button {
  padding: 5px 10px;
  background-color: #4caf50;
  color: white;
}

.linechart {
  width: 80%;
  margin: 0 auto;
}
</style>

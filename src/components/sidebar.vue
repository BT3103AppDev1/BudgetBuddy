<template>
  <div class="sidebar">
    <h2>BudgetBuddy</h2>
    <nav>
      <ul class="menu">
        <li class="item" :class="{ active: $route.path === '/dashboardPage' }">
          <ion-icon name="list-circle"></ion-icon>
          <router-link to="/dashboardPage">Dashboard</router-link>
        </li>
        <li class="item" :class="{ active: $route.path === '/analyticsPage' }">
          <ion-icon name="analytics-outline"></ion-icon>
          <router-link to="/analyticsPage">Analytics</router-link>
        </li>
        <li class="item" :class="{ active: $route.path === '/addTransaction' }">
          <ion-icon name="card"></ion-icon>
          <router-link to="/addTransaction">Add Transaction</router-link>
        </li>
        <li class="item" :class="{ active: $route.path === '/addBudget' }">
          <ion-icon name="chatbubble-ellipses"></ion-icon>
          <router-link to="/addBudget">Add Budget</router-link>
        </li>
        <li
          class="item"
          :class="{ active: $route.path === '/addScheduledTransaction' }"
        >
          <ion-icon name="alarm"></ion-icon>
          <router-link to="/addScheduledTransaction"
            >Add Scheduled Transactions</router-link
          >
        </li>
        <li
          class="item"
          :class="{ active: $route.path === '/transactionHistory' }"
        >
          <ion-icon name="calendar"></ion-icon>
          <router-link to="/transactionHistory"
            >Transaction History</router-link
          >
        </li>
        <li
          class="item"
          :class="{ active: $route.path === '/viewScheduledTransactions' }"
        >
          <ion-icon name="alarm"></ion-icon>
          <router-link to="/viewScheduledTransactions"
            >View Scheduled Transactions</router-link
          >
        </li>
        <li class="item" :class="{ active: $route.path === '/goalSetting' }">
          <ion-icon name="chatbubble-ellipses"></ion-icon>
          <router-link to="/goalSetting">View Budgets</router-link>
        </li>
        <li class="item" :class="{ active: $route.path === '/userProfile' }">
          <ion-icon name="person-circle"></ion-icon>
          <router-link to="/userProfile">User Profile</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "sidebar",
};
</script>

<style scoped>
.sidebar {
  width: 290px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #ffffff;
  overflow: hidden;
  transition: all 0.5s linear;
}
.menu {
  position: relative;
  list-style: none;
  padding: 0;
}
.menu a {
  color: #474745;
  text-decoration: none;
}
.menu li {
  padding: 20px;
  margin: 8px 0;
  border-radius: 8px;
  transition: all 0.5s ease-in-out;
  list-style: none;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.menu li:hover {
  background: #c5c4c458;
}
.menu .item.active {
  background-color: #c5c4c458;
}
ion-icon {
  color: #959ba2;
  height: 20px;
  width: 20px;
  margin-right: 5px;
}
</style>

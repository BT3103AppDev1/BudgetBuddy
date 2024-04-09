<template>
  <div class="sidebar">
    <nav>
      <ul>
        <li>
          <router-link to="/dashboardPage">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/addTransaction">Add Transaction</router-link>
        </li>
        <li>
          <router-link to="/addBudget">Add Budget</router-link>
        </li>
        <li>
          <router-link to="/addScheduledTransaction"
            >Add Scheduled Transaction</router-link
          >
        </li>
        <li>
          <router-link to="/transactionHistory"
            >Transaction History</router-link
          >
        </li>
        <!-- Other sidebar items -->
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: "sidebar",
  // You can include props or data here if needed
};
</script>

<style scoped>
/* Basic sidebar styles */
.sidebar {
  width: 250px; /* or however wide you want it */
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #f5f5f5; /* Light grey background */
  /* Additional styling */
}

.sidebar ul {
  list-style-type: none;
  padding: 0;
}

.sidebar li {
  padding: 10px;
  border-bottom: 1px solid #ddd; /* Light grey border */
}

/* Style the active route */
.router-link-active {
  background-color: #e0e0e0; /* Slightly darker grey */
}
</style>

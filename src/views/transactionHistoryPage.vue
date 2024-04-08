<template>
  <sidebar />
  <transactionHistory></transactionHistory>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import transactionHistory from "../components/transactionHistory.vue";
export default {
  name: "addBudgetPage",
  components: {
    transactionHistory,
    sidebar,
  },
};
</script>

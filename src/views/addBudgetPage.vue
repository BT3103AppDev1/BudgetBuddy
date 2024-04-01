<template>
  <sidebar />
  <addBudget></addBudget>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import addBudget from "../components/addBudget.vue";

export default {
  name: "addBudgetPage",
  components: {
    addBudget,
    sidebar,
  },
};
</script>

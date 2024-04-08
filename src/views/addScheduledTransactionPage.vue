<template>
  <sidebar />
  <addScheduledTransaction></addScheduledTransaction>
</template>

<script>
import sidebar from "../components/sidebar.vue";
import addScheduledTransaction from "../components/addScheduledTransaction.vue";

export default {
  name: "addScheduledTransactionPage",
  components: {
    sidebar,
    addScheduledTransaction,
  },
};
</script>

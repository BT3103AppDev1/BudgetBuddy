<template>
  <div class="add-transaction">
    <form @submit.prevent="submitForm">
      <h2>Add Transaction</h2>

      <div class="form-group">
        <label for="amount">Amount *</label>
        <input
          type="number"
          id="amount"
          v-model="transaction.amount"
          required
        />
      </div>

      <div class="form-group">
        <label for="description">Description (Optional)</label>
        <input type="text" id="description" v-model="transaction.description" />
      </div>

      <div class="form-group">
        <label for="category">Category *</label>
        <select id="category" v-model="transaction.category" required>
          <option value="shopping">Shopping</option>
          <option value="food">Food</option>
          <!-- Add more categories here -->
        </select>
      </div>

      <div class="form-group">
        <label for="currency">Currency *</label>
        <select id="currency" v-model="transaction.currency" required>
          <option value="SGD">SGD - Singapore Dollar</option>
          <!-- Add more currencies here -->
        </select>
      </div>

      <div class="form-group">
        <label for="date">Date *</label>
        <input type="date" id="date" v-model="transaction.date" required />
      </div>

      <button type="submit">Add Transaction</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transaction: {
        amount: null,
        description: "",
        category: null,
        currency: null,
        date: null,
      },
    };
  },
  methods: {
    submitForm() {
      // Process the form data here, such as sending it to a server or updating local state
      console.log(this.transaction);
    },
  },
};
</script>

<style></style>

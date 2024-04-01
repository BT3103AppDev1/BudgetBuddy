<template>
  <div class="add-budget-container">
    <h1>Add Budget</h1>
    <form @submit.prevent="submitBudget">
      <!-- Amount Input -->
      <div class="input-group">
        <label for="amount">Amount *</label>
        <input type="number" id="amount" v-model="budget.amount" required />
      </div>

      <!-- Category Select -->
      <div class="input-group">
        <label for="category">Category *</label>
        <select id="category" v-model="budget.category" required>
          <option disabled value="">Please select one</option>
          <option value="food">Food</option>
          <option value="transport">Transport</option>
          <!-- more options -->
        </select>
      </div>

      <!-- Currency Select -->
      <div class="input-group">
        <label for="currency">Currency *</label>
        <select id="currency" v-model="budget.currency" required>
          <option value="SGD">SGD - Singapore Dollar</option>
          <!-- more options -->
        </select>
      </div>

      <!-- Date Range Picker or Two Date Inputs -->
      <div class="input-group">
        <label for="startDate">Start Date *</label>
        <input type="date" id="startDate" v-model="budget.startDate" required />
      </div>
      <div class="input-group">
        <label for="endDate">End Date *</label>
        <input type="date" id="endDate" v-model="budget.endDate" required />
      </div>

      <!-- Submit Button -->
      <button type="submit">Add Budget</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      budget: {
        amount: null,
        category: "",
        currency: "",
        startDate: "",
        endDate: "",
      },
    };
  },
  methods: {
    async submitBudget() {
      // Here you would interact with Firebase
      // Example: this.$firestore.collection('budgets').add(this.budget);
      // After successful submission, you might want to reset the form or navigate the user
      // Example: this.$router.push({ name: 'GoalSetting' });
    },
  },
};
</script>

<style scoped>
.add-budget-container {
  max-width: 600px; /* Adjust the width as needed */
  margin: 0 auto; /* This centers your form on the page */
  padding: 2rem;
  background-color: #fff; /* Use color from your design */
  border-radius: 10px; /* Rounded corners */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* subtle shadow */
}

.input-group {
  margin-bottom: 1rem;
}

input[type="number"],
input[type="date"],
select {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 1rem;
  background-color: #333; /* Adjust the color */
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #555; /* Darker shade for hover state */
}

/* Add responsive styles as necessary */
</style>

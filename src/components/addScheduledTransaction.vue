<template>
    <div class="schedule-transactions-container">
        <h1>Schedule Transactions</h1>
        <form @submit.prevent="submitScheduledTransaction">
            
            <!-- Transaction Name Input -->
            <div class="input-group">
                <label for="transaction-name">Transaction Name *</label>
                <input type="text" id="transaction-name" v-model="scheduledTransaction.name" required class="input-field" />
            </div>
            
            <!-- Amount Input -->
            <div class="input-group">
                <label for="amount">Amount *</label>
        <input type="number" id="amount" v-model="scheduledTransaction.amount" required />
    </div>
    
    <!-- Category Select -->
    <div class="input-group">
        <label for="category">Category *</label>
        <select id="category" v-model="scheduledTransaction.category" required>
        <option disabled value="">Please select one</option>
        
        <option value="income">Income</option>
        <!-- more options -->
        </select>
    </div>
    
    <!-- Currency Select -->
    <div class="input-group">
        <label for="currency">Currency *</label>
        <select id="currency" v-model="scheduledTransaction.currency" required>
        <option value="SGD">SGD - Singapore Dollar</option>
        <!-- more options -->
        </select>
    </div>
    
    <!-- Start Date Picker -->
    <div class="input-group">
        <label for="start-date">Start Date *</label>
        <input type="date" id="start-date" v-model="scheduledTransaction.startDate" required />
    </div>
    
    <!-- Recurrence Select -->
    <div class="input-group">
        <label for="recurrence">Recurrence *</label>
        <select id="recurrence" v-model="scheduledTransaction.recurrence" required>
        <option value="monthly">Monthly</option>
        <!-- more options -->
        </select>
    </div>
    
    <!-- Submit Button -->
    <button type="submit">Add Scheduled Transaction</button>
    </form>
</div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        scheduledTransaction: {
          transactionName: "",
          amount: null,
          category: "",
          currency: "",
          startDate: "",
          recurrence: "",
        },
      };
    },
    methods: {
      submitScheduledTransaction() {
        // Handle the form submission, e.g., save to a database or state management
        console.log(this.scheduledTransaction);
        // Additional logic after successful submission
      },
    },
  };
  </script>

<style scoped>
    .schedule-transactions-container {
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

    .input-field, /* Apply same styles for all input types */
    input[type="number"],
    input[type="date"],
    select {
        width: 100%;
        padding: 0.5rem;
        margin-top: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 1rem; /* Ensure the font size is consistent */
        box-sizing: border-box; /* Include padding and border in the element's total width and height */
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
    
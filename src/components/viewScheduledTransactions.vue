<template>
    <div class="scheduled-transactions-container">
      <h1>View Scheduled Transactions</h1>
      <!-- <div v-if="loading">Loading transactions...</div>
      <div v-if="error" class="error">{{ error }}</div> -->
      <!-- <div v-if="!loading && transactions.length"> -->
        <ul class="transactions-list">
          <li v-for="transaction in scheduledTransactions" :key="transaction.id">
            <h2>{{ transaction.name }} ({{ transaction.currency }})</h2>
            <p>Amount: {{ transaction.amount }}</p>
            <p>Category: {{ transaction.category }}</p>
            <p>Date: {{ transaction.date }}</p>
            <p>Recurrence: {{ transaction.recurrence }}</p>
          </li>
        </ul>
        <router-link
            to="/addScheduledTransaction"
            tag="button"
            class="add-sched-transaction-btn"
        >
            Add New Scheduled Transaction
        </router-link>
    </div>
      <div v-if="!loading && !transactions.length">
        <p>No scheduled transactions found.</p>
      </div>
    <!-- </div> -->
  </template>
  
  <script>
  import { getFirestore, collection, query, onSnapshot } from "firebase/firestore";
  import firebaseApp from "../firebase.js";
  
  const db = getFirestore(firebaseApp);
  
  export default {
    data() {
      return {
        scheduledTransactions: [],
        loading: true,
        error: null
      };
    },
    mounted() {
      this.fetchScheduledTransactions();
    },
    methods: {
      fetchScheduledTransactions() {
        const query = collection(db, "scheduledTransaction");
        onSnapshot(
            query,
            (querySnapshot) => {
                this.scheduledTransactions = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().schedTransactionName, // Make sure this field exists in your Firestore documents
                    amount: doc.data().schedTransactionAmount, // Make sure this field exists in your Firestore documents
                    category: doc.data().schedTransactionsCategory, // Make sure this field exists in your Firestore documents
                    currency: doc.data().schedTransactionsCurrency, // Make sure this field exists in your Firestore documents
                    date: doc.data().schedTransactionsDate, // Make sure this field exists in your Firestore documents
                    recurrence: doc.data().schedTransactionsRecurrence, // Make sure this field exists in your Firestore documents
                }));
        //   this.loading = false;
        }, (error) => {
            console.error("Error getting documents: ", error);
        });
      }
    }
  };
  </script>
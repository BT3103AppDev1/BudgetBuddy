import { createRouter, createWebHistory } from "vue-router";
import loginPage from "@/views/loginPage.vue";
import dashboardPage from "@/views/dashboardPage.vue";
import addTransactionPage from "@/views/addTransactionPage.vue";
import addBudgetPage from "@/views/addBudgetPage.vue";
import addScheduledTransactionPage from "@/views/addScheduledTransactionPage.vue";
import viewScheduledTransactionsPage from "@/views/viewScheduledTransactionsPage.vue";
import transactionHistoryPage from "@/views/transactionHistoryPage.vue";
import userProfile from "@/views/userProfile.vue";
import editProfile from "@/views/editProfile.vue";
import goalSettingPage from "@/views/goalSettingPage.vue";

const routes = [
  {
    path: "/",
    name: "loginPage",
    component: loginPage,
  },
  {
    path: "/dashboardPage",
    name: "dashboardPage",
    component: dashboardPage,
  },
  {
    path: "/addTransaction",
    name: "addTransactionPage",
    component: addTransactionPage,
  },
  {
    path: "/addBudget",
    name: "addBudgetPage",
    component: addBudgetPage,
  },

  {
    path: "/addScheduledTransaction",
    name: "addScheduledTransactionPage",
    component: addScheduledTransactionPage,
  },

  {
    path: "/viewScheduledTransactions",
    name: "viewScheduledTransactionsPage",
    component: viewScheduledTransactionsPage,
  },

  {
    path: "/transactionHistory",
    name: "transactionHistoryPage",
    component: transactionHistoryPage,
  },
  {
    path: "/goalSetting",
    name: "goalSettingPage",
    component: goalSettingPage,
  },
  {
    path: "/userProfile",
    name: "userProfile",
    component: userProfile,
  },
  {
    path: "/editProfile",
    name: "editProfile",
    component: editProfile,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

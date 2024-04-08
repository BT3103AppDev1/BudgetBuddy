import { createRouter, createWebHistory } from "vue-router";
import loginPage from "@/views/loginPage.vue";
// import signUpPage from "@/views/signUpPage.vue";
import dashboardPage from "@/views/dashboardPage.vue";
import addTransactionPage from "@/views/addTransactionPage.vue";
import addBudgetPage from "@/views/addBudgetPage.vue";
import addScheduledTransactionPage from "@/views/addScheduledTransactionPage.vue";

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
  // {
  //   path: "/signUp",
  //   name: "signUpPage",
  //   component: signUpPage,
  // },
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/login.vue";
// import signUpPage from "@/views/signUpPage.vue";
import addTransactionPage from "@/views/addTransactionPage.vue";
import addBudgetPage from "@/views/addBudgetPage.vue";
import addScheduledTransactionPage from "@/components/addScheduledTransaction.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
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

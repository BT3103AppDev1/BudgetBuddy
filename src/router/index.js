import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/login.vue";
import addTransactionPage from "@/views/addTransactionPage.vue";
import addBudgetPage from "@/views/addBudgetPage.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

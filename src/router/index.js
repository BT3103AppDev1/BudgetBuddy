import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/login.vue";
import addTransactionPage from "@/views/addTransactionPage.vue";

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
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

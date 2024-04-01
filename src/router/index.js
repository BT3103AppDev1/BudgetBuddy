import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

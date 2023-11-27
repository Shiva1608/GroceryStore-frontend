import Vue from "vue";
import VueRouter from "vue-router";
import ManagerHome from "../views/ManagerHome.vue";
import CustomerHome from "../views/CustomerHome.vue";
import Cart from "../views/Cart.vue";
import LoginSignup from "../views/LoginSignup.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "LoginSignup",
    component: LoginSignup,
  },
  {
    path: "/manager",
    name: "ManagerHome",
    component: ManagerHome,
  },
  {
    path: "/customer",
    name: "CustomerHome",
    component: CustomerHome,
  },
  {
    path: "/cart",
    name: "Cart",
    component: Cart,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

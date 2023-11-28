import Vue from "vue";
import VueRouter from "vue-router";
import ManagerHome from "../views/ManagerHome.vue";
import CustomerHome from "../views/CustomerHome.vue";
import Cart from "../views/Cart.vue";
import LoginSignup from "../views/LoginSignup.vue";
import Admin from "../views/Admin.vue";

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
    beforeEnter: (to, from, next) => {
      if (
        (localStorage.getItem("auth-token") ? true : false) &&
        localStorage.getItem("role") === "manager"
      ) {
        next();
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        next("/");
      }
    },
    component: ManagerHome,
  },
  {
    path: "/customer",
    name: "CustomerHome",
    beforeEnter: (to, from, next) => {
      if (
        (localStorage.getItem("auth-token") ? true : false) &&
        localStorage.getItem("role") === "customer"
      ) {
        next();
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        next("/");
      }
    },
    component: CustomerHome,
  },
  {
    path: "/cart",
    name: "Cart",
    beforeEnter: (to, from, next) => {
      if (
        (localStorage.getItem("auth-token") ? true : false) &&
        localStorage.getItem("role") === "customer"
      ) {
        next();
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        next("/");
      }
    },
    component: Cart,
  },
  {
    path: "/admin",
    name: "Admin",
    beforeEnter: (to, from, next) => {
      if (
        (localStorage.getItem("auth-token") ? true : false) &&
        localStorage.getItem("role") === "admin"
      ) {
        next();
      } else {
        localStorage.removeItem("email");
        localStorage.removeItem("auth-token");
        localStorage.removeItem("role");
        next("/");
      }
    },
    component: Admin,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;

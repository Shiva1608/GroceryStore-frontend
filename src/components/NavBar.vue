<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h1 style="font-size: 40px" class="navbar-brand">
        {{ title | capitalize }}'s Dashboard
      </h1>
    </div>

    <v-spacer></v-spacer>
    <div v-if="role === 'manager'">
      <v-btn
        text
        class="ma-2 white--text"
        :loading="isWaiting"
        :disabled="isWaiting"
        @click="download('download-stock')"
      >
        <span>Stock</span>
      </v-btn>
      <v-btn
        text
        class="ma-2 white--text"
        :loading="isWaiting1"
        :disabled="isWaiting1"
        @click="download('download-sales')"
      >
        <span>Sales</span>
      </v-btn>
    </div>
    <div v-if="role === 'customer' && $route.path !== '/cart'">
      <router-link to="/cart"
        ><v-btn text><span>Cart</span> </v-btn>
      </router-link>
    </div>
    <div v-if="role === 'customer' && $route.path === '/cart'">
      <router-link to="/customer"
        ><v-btn text><span>Home</span> </v-btn>
      </router-link>
    </div>
    <div v-if="role === 'admin' && $route.path === '/approval'">
      <router-link to="/admin">
        <v-btn text>
          <span class="mr-2">Home</span>
        </v-btn>
      </router-link>
    </div>
    <div v-if="role === 'admin' && $route.path !== '/approval'">
      <router-link to="/approval">
        <v-btn text>
          <span class="mr-2">Store Approval</span>
        </v-btn>
      </router-link>
    </div>
    <v-btn text @click="logout">
      <span class="mr-2">Logout</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
import axios from "axios";
export default {
  name: "FrontendNavBar",

  data() {
    return {
      isWaiting: false,
      isWaiting1: false,
    };
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
  },

  mounted() {},

  methods: {
    logout() {
      localStorage.removeItem("email");
      localStorage.removeItem("role");
      localStorage.removeItem("auth-token");
      window.location = "/";
    },
    async download(work) {
      if (work === "download-stock") {
        this.isWaiting = true;
      } else {
        this.isWaiting1 = true;
      }
      const res = await axios.get(`http://127.0.0.1:5000/${work}`, {
        headers: {
          "Authentication-Token": localStorage.getItem("auth-token"),
        },
      });
      if (res.status === 200) {
        const taskId = res.data.id;
        const interval = setInterval(async () => {
          const csv_res1 = await fetch(
            `http://127.0.0.1:5000/get-csv/${taskId}`
          );
          if (csv_res1.ok) {
            if (work === "download-stock") {
              this.isWaiting = false;
            } else {
              this.isWaiting1 = false;
            }
            clearInterval(interval);
            window.location.href = `http://127.0.0.1:5000/get-csv/${taskId}`;
          } else {
            clearInterval(interval);
            if (work === "download-stock") {
              this.isWaiting = false;
            } else {
              this.isWaiting1 = false;
            }
          }
        }, 2000);
      }
    },
  },
  filters: {
    capitalize: function (data) {
      var capitalized = [];
      data.split(" ").forEach((word) => {
        capitalized.push(
          word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        );
      });
      return capitalized.join(" ");
    },
  },
};
</script>

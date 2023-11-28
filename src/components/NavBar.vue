<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <h1 style="font-size: 40px" class="navbar-brand">
        {{ title | capitalize }}'s Dashboard
      </h1>
    </div>

    <v-spacer></v-spacer>
    <div v-if="role === 'manager'">
      <v-btn text>
        <span>Summary</span>
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
    <v-btn text @click="logout">
      <span class="mr-2">Logout</span>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  name: "FrontendNavBar",

  data() {
    return {};
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

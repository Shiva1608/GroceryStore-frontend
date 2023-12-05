<template>
  <v-container>
    <NavBar :title="email.split('@')[0]" :role="role" />
    <br />
    <h1 style="text-align: center" v-if="info.length > 0">Pending Signups</h1>
    <h1 style="text-align: center" v-if="info.length === 0">
      No Pending Signups !
    </h1>
    <br />
    <v-row align="center" justify="center">
      <br />
      <v-col
        align="center"
        justify="center"
        cols="12"
        v-for="user in info"
        :key="user.email"
      >
        <v-card elevation="5" class="mb-2" outlined max-width="800">
          <v-card-title class="pb-0"
            >USERNAME : {{ user.username }}</v-card-title
          >
          <v-card-title>EMAIL : {{ user.email }}</v-card-title>
          <v-card-actions class="justify-end pt-0 mb-4 pb-4 mr-4">
            <v-btn
              large
              type="submit"
              color="error"
              @click="disapprove(user.email)"
              >Disaprove</v-btn
            >
            <v-btn
              large
              type="submit"
              color="success"
              @click="approve(user.email)"
              >Approve</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
export default {
  name: "FrontendAdmin",
  components: { NavBar },
  data() {
    return {
      email: "",
      tab: 0,
      info: "",
      role: "",
    };
  },

  mounted() {
    this.loader();
  },

  methods: {
    async loader() {
      this.email = localStorage.getItem("email");
      this.role = localStorage.getItem("role");
      try {
        const response = await axios.get("http://127.0.0.1:5000/admin", {
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        });
        console.log(response);
        this.info = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async approve(email) {
      try {
        const response = await axios.patch(
          "http://127.0.0.1:5000/admin?action=1",
          { email: email },
          {
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        console.log(response);
        if (response.data.status === "success") {
          this.loader();
        }
      } catch (err) {
        console.log(err);
      }
    },
    async disapprove(email) {
      try {
        const response = await axios.patch(
          "http://127.0.0.1:5000/admin?action=0",
          { email: email },
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        console.log(response);
        if (response.data.status === "success") {
          this.loader();
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

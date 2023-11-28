<template>
  <div>
    <v-container>
      <NavBar :title="email.split('@')[0]" :role="role" />
      <v-tabs v-model="subTab" centered>
        <v-tab :key="'category'">Category Changes</v-tab>
        <v-tab :key="'product'">Product Changes</v-tab>
      </v-tabs>
      <br />
      <v-tabs-items v-model="subTab">
        <v-tab-item :key="'category'">
          <v-row v-for="cat in changesCat" :key="cat.id">
            <v-col cols="2"></v-col>
            <v-col cols="8">
              <v-card class="mb-4" outlined elevation="10">
                <v-card-title class="mb-0 pb-2"
                  >Category Name : {{ checker(cat.category_id) }}
                </v-card-title>
                <v-card-title
                  class="pt-1"
                  v-if="cat.add === false && cat.delete === false"
                  >New Name : {{ cat.category_name }}</v-card-title
                >
                <v-card-text v-if="cat.add === true"
                  ><v-btn outlined color="primary">NEW</v-btn></v-card-text
                >
                <v-card-text v-if="cat.delete === true"
                  ><v-btn outlined color="primary">DELETE</v-btn></v-card-text
                >
                <v-card-title
                  class="pb-2 pt-1"
                  v-if="cat.add === false && cat.delete === false"
                  ><v-btn outlined color="primary">EDIT</v-btn></v-card-title
                >
                <v-card-actions class="justify-end pt-0 mb-2 pb-2 mr-4">
                  <v-btn
                    large
                    type="submit"
                    color="error"
                    @click="disapprove(cat.id)"
                    >Disaprove</v-btn
                  >
                  <v-btn
                    large
                    type="submit"
                    color="success"
                    @click="approve(cat.id)"
                    >Approve</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-tab-item>
        <!-- <v-tab-item :key="'product'">
        <v-row>
          <v-col v-for="change in productChanges" :key="change.id">
            <v-card>
              <v-card-title>{{ change.username }}</v-card-title>
            </v-card>
          </v-col>
        </v-row>
      </v-tab-item> -->
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
export default {
  name: "FrontendStoreApproval",
  components: { NavBar },
  data() {
    return {
      email: "",
      role: "",
      changesCat: [],
      cats: [],
      subTab: "category",
    };
  },

  mounted() {
    this.loader();
  },

  methods: {
    async loader() {
      try {
        this.email = localStorage.getItem("email");
        this.role = localStorage.getItem("role");
        this.pendingCats();
      } catch (err) {
        console.log(err);
      }
    },
    async pendingCats() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/adminitems?for=cat",
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        for (let i of response.data) {
          for (let j of i.changes) {
            this.changesCat.push(j);
          }
        }
        this.cats = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    checker(cat_id) {
      for (let i of this.cats) {
        if (i.category_id === cat_id) {
          return i.category_name;
        }
      }
    },
    async disapprove(cat_id) {
      const response = await axios.delete(
        `http://127.0.0.1:5000/adminitems?for=cat&id=${cat_id}`,
        {
          headers: {},
        }
      );
      if (response.data.status === "success") {
        window.location = "/approval";
      }
    },
    async approve(cat_id) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:5000/adminitems?for=cat&id=${cat_id}`,
          {
            headers: {},
          }
        );
        if (response.data.status === "success") {
          window.location = "/approval";
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

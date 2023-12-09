<template>
  <div>
    <v-container>
      <NavBar :title="email.split('@')[0]" :role="role" />
      <br />
      <h1
        class="mt-16"
        style="text-align: center"
        v-if="changesCat.length === 0 && changesProd.length === 0"
      >
        No Pending Approvals for Store !
      </h1>
      <v-tabs v-model="subTab" centered v-else>
        <v-tab :key="'category'"
          ><v-badge
            v-if="changesCat.length > 0"
            color="red"
            :content="changesCat.length"
            >Category Changes
          </v-badge>
          <div v-else>Category Changes</div></v-tab
        >
        <v-tab :key="'product'"
          ><v-badge
            v-if="changesProd.length > 0"
            color="green"
            :content="changesProd.length"
          >
            Product Changes
          </v-badge>
          <div v-else>Category Changes</div></v-tab
        >
      </v-tabs>
      <br />
      <v-tabs-items v-model="subTab">
        <v-tab-item :key="'category'">
          <h1
            class="mt-16"
            style="text-align: center"
            v-if="changesCat.length === 0"
          >
            No Pending Category Approvals for Store !
          </h1>
          <div v-else>
            <v-row v-for="(cat, index) in changesCat" :key="index">
              <v-col cols="0" lg="2" md="2"></v-col>
              <v-col cols="12" lg="8" md="8">
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
          </div>
        </v-tab-item>
        <v-tab-item :key="'product'">
          <h1
            class="mt-16"
            style="text-align: center"
            v-if="changesProd.length === 0"
          >
            No Pending Product Approvals for Store !
          </h1>
          <div v-else>
            <v-row v-for="(prod, index) in changesProd" :key="index">
              <v-col cols="0" lg="2" md="2"></v-col>
              <v-col cols="12" lg="8" md="8">
                <v-card class="mb-4" outlined elevation="10">
                  <v-card-title class="pt-2 mt-2"
                    >Name : {{ prod.product_name }}</v-card-title
                  >
                  <v-card-title class="pt-2 mt-0"
                    >Price : {{ prod.product_price }}</v-card-title
                  >
                  <v-card-title class="pt-2 mt-0"
                    >Unit : {{ prod.product_unit }}</v-card-title
                  >
                  <v-card-title class="pt-2 mt-0"
                    >Quantity : {{ prod.product_quantity }}</v-card-title
                  >
                  <v-card-text v-if="prod.add === true"
                    ><v-btn outlined color="primary">NEW</v-btn></v-card-text
                  >
                  <v-card-text v-if="prod.delete === true"
                    ><v-btn outlined color="primary">DELETE</v-btn></v-card-text
                  >
                  <v-card-title
                    class="pb-2 pt-1"
                    v-if="prod.add === false && prod.delete === false"
                    ><v-btn outlined color="primary">EDIT</v-btn></v-card-title
                  >
                  <v-card-actions class="justify-end pt-0 mb-2 pb-2 mr-4">
                    <v-btn
                      large
                      type="submit"
                      color="error"
                      @click="disapprove1(prod.id)"
                      >Disaprove</v-btn
                    >
                    <v-btn
                      large
                      type="submit"
                      color="success"
                      @click="approve1(prod.id)"
                      >Approve</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-tab-item>
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
      prods: [],
      changesProd: [],
    };
  },

  mounted() {
    this.email = localStorage.getItem("email");
    this.role = localStorage.getItem("role");
    this.loader();
  },

  methods: {
    async loader() {
      try {
        this.pendingCats();
        this.pendingProds();
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
    async pendingProds() {
      try {
        const response = await axios.get(
          "http://127.0.0.1:5000/adminitems?for=prod",
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        for (let i of response.data) {
          for (let j of i.changes) {
            this.changesProd.push(j);
          }
        }
        this.prods = response.data;
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
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        }
      );
      console.log(response);
      if (response.data.status === "success") {
        console.log(response);
        window.location = "/approval";
      }
    },
    async approve(cat_id) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:5000/adminitems?for=cat&id=${cat_id}`,
          null,
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        console.log(response);
        if (response.data.status === "success") {
          console.log(response);
          window.location = "/approval";
        }
      } catch (err) {
        console.log(err);
      }
    },
    async disapprove1(prod_id) {
      const response = await axios.delete(
        `http://127.0.0.1:5000/adminitems?for=prod&id=${prod_id}`,
        {
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        }
      );
      if (response.data.status === "success") {
        window.location = "/approval";
      }
    },
    async approve1(prod_id) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:5000/adminitems?for=prod&id=${prod_id}`,
          null,
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
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

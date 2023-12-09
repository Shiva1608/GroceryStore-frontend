<template>
  <v-container>
    <NavBar :title="email.split('@')[0]" :role="role" />
    <br />
    <h1 v-if="items.length > 0" style="text-align: center">CART</h1>
    <h1 v-if="items.length === 0" style="text-align: center">
      NO ITEMS IN CART!
    </h1>
    <router-link v-if="items.length === 0" to="/customer"
      ><h3 style="text-align: center">Continue shopping ?</h3></router-link
    >
    <br />
    <v-data-table
      v-if="items.length > 0"
      :headers="headers"
      :items="items"
      class="elevation-5 overflow-x-auto"
      hide-default-footer
      ><template v-slot:item="{ item, index }">
        <tr>
          <td align="center">{{ index + 1 }}.</td>
          <td align="center">{{ item.product.product_name }}</td>
          <td align="center">
            {{ item.product.product_unit.split("/")[0] }}.
            {{ item.product.product_price }}
          </td>
          <td align="center">
            {{ item.quantity }} {{ item.product.product_unit.split("/")[1] }}s
          </td>
          <td align="center">
            {{ item.product.product_unit.split("/")[0] }}.
            {{ item.quantity * item.product.product_price }}
          </td>
          <v-btn
            icon
            large
            rounded
            @click="deleteCartItem(item.product.product_id)"
          >
            <v-icon class="red--text text--darken-2">mdi-delete</v-icon>
          </v-btn>
        </tr>
      </template></v-data-table
    >
    <br />
    <v-row v-if="items.length > 0">
      <v-col cols="2" lg="6" md="5"></v-col>
      <v-col cols="6" lg="4" md="4"
        ><h3 class="pt-3">TOTAL : Rs.{{ total }} /-</h3></v-col
      >
      <v-col cols="4" lg="2" md="3"
        ><v-btn x-large color="primary" rounded @click="placeOrder">
          Place Order
        </v-btn></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import axios from "axios";
export default {
  name: "FrontendCart",
  components: { NavBar },
  data() {
    return {
      items: [],
      total: 0,
      headers: [
        { text: "Item no.", sortable: false, value: "index", align: "center" },
        {
          text: "Product Name",
          align: "center",
          sortable: false,
          value: "item.product.product_name",
        },
        {
          text: "Price",
          sortable: false,
          value: "item.product.product_price",
          align: "center",
        },
        {
          text: "Quantity",
          sortable: false,
          align: "center",
          value: "item.quantity",
        },
        {
          text: "Total",
          align: "center",
          sortable: false,
        },
      ],
      email: "",
      role: "",
    };
  },

  mounted() {
    this.loader();
  },

  methods: {
    loader: function () {
      this.email = localStorage.getItem("email");
      this.role = localStorage.getItem("role");
      axios
        .get("http://127.0.0.1:5000/cart/" + this.email, {
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        })
        .then((res) => {
          this.total = 0;
          this.items = res.data;
          this.items.forEach((item) => {
            this.total +=
              parseInt(item.quantity) * parseInt(item.product.product_price);
          });
        });
    },
    deleteCartItem: function (prod_id) {
      axios
        .delete(
          "http://127.0.0.1:5000/cart/" + this.email + "?prod_id=" + prod_id,
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.loader();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    placeOrder: async function () {
      try {
        const res = await axios.patch(
          "http://127.0.0.1:5000/cart/" + this.email,
          null,
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        console.log(res);
        window.location = "/customer";
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

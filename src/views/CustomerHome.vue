<template>
  <div>
    <NavBar :title="email.split('@')[0]" :role="role" />
    <br />
    <v-container>
      <input
        class="form-control"
        type="search"
        v-model="searchQuery"
        placeholder="Search"
        aria-label="Search"
        style="width: 500px"
      />
      <br />
      <br />
      <v-row v-for="cat in categories" :key="cat.category_id">
        <h1
          class="mb-2 mt-0 ml-0"
          v-if="!cat.isInputVisible && showCategory(cat.category_id)"
        >
          {{ cat.category_name }}
        </h1>
        <v-col
          v-for="prod in filteredProducts(cat.category_id)"
          :key="prod.product_id"
          :cols="getColumns(2)"
        >
          <v-card
            class="pa-0 mb-4"
            elevation="15"
            outlined
            shaped
            max-width="300"
          >
            <v-card-title>
              <h3>{{ prod.product_name }}</h3>
            </v-card-title>
            <v-card-text class="pb-0">
              <h5 class="text-h6">
                Price : {{ prod.product_price }} {{ prod.product_unit }}
              </h5>
            </v-card-text>
            <v-btn
              v-if="checkCart(prod.product_id) && prod.product_quantity > 0"
              class="ml-4 mb-4 mt-2"
              color="success"
              @click="toggleAddToCart(prod)"
            >
              Buy Now
            </v-btn>
            <v-btn
              v-if="prod.product_quantity === 0"
              class="ml-4 mb-4 mt-2"
              color="error"
            >
              Out of Stock
            </v-btn>
            <v-btn
              v-if="!checkCart(prod.product_id)"
              class="ml-4 mb-4 mt-2"
              color="error"
            >
              In cart
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <router-link to="/cart"
      ><v-btn
        class="cart-button"
        fab
        dark
        x-large
        elevation="30"
        color="primary"
      >
        <v-icon>mdi-cart</v-icon>
      </v-btn>
    </router-link>

    <v-dialog
      persistent
      v-model="dialog"
      width="500"
      transition="dialog-top-transition"
    >
      <v-form ref="form" lazy-validation @submit.prevent>
        <v-card>
          <v-card-title class="text-h4 grey lighten-2"
            >Add {{ cart_item.name }} to Cart</v-card-title
          >
          <v-card-text class="mt-4 pb-2">
            <v-text-field
              v-model="cart_item.quantity"
              label="Enter quantity"
              required
              type="number"
              min="1"
              :rules="rules"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end pt-0 pb-3">
            <v-btn type="button" color="error" @click="closeDialog">
              Close
            </v-btn>
            <v-btn type="button" color="primary" @click="addToCart">
              Add to cart
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
export default {
  name: "FrontendCustomerHome",
  components: { NavBar },
  data() {
    return {
      categories: [],
      dialog: false,
      role: "",
      searchQuery: "",
      cart: [],
      email: "",
      products: [],
      cart_item: {
        id: "",
        name: "",
        available: "",
        quantity: "",
      },
      rules: [
        (value) => !!value || "Required!",
        (value) => value > 0 || "Should be greater than 0!",
        (value) => value <= this.cart_item.available || "Limit exceeded!",
      ],
    };
  },

  mounted() {
    this.loader();
  },

  computed: {
    filteredProducts() {
      return (categoryId) => {
        const categoryProducts = this.products.filter(
          (prod) => prod.category_id === categoryId
        );
        return categoryProducts.filter((prod) => {
          const productNameMatch = prod.product_name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
          const categoryNameMatch = this.categories
            .find((cat) => cat.category_id === categoryId)
            .category_name.toLowerCase()
            .includes(this.searchQuery.toLowerCase());
          return productNameMatch || categoryNameMatch;
        });
      };
    },
  },

  methods: {
    async loader() {
      this.email = localStorage.getItem("email");
      this.role = localStorage.getItem("role");
      try {
        const res = await axios.get(
          "http://127.0.0.1:5000/cart/" + this.email,
          {
            headers: {
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        );
        this.cart = res.data;
        const response = await axios.get("http://127.0.0.1:5000/categories", {
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        });
        this.categories = response.data.map((cat) => ({
          ...cat,
          isInputVisible: false,
        }));
        const resp = await axios.get("http://127.0.0.1:5000/products", {
          headers: {
            "Authentication-Token": localStorage.getItem("auth-token"),
          },
        });
        this.products = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    showCategory(categoryId) {
      const category = this.categories.find(
        (cat) => cat.category_id === categoryId
      );
      return (
        category &&
        category.category_name
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase())
      );
    },
    checkCart: function (prod_id) {
      return !this.cart.some((item) => item.product_id === prod_id);
    },
    getColumns(num) {
      const screenWidth = this.$vuetify.breakpoint.width;
      if (num === 2) {
        if (screenWidth < 600) {
          return 12; // Extra small screens
        } else if (screenWidth < 960) {
          return 6; // Small screens
        } else if (screenWidth < 1280) {
          return 4; // Medium screens
        } else {
          return 3; // Large screens
        }
      } else if (num === 0) {
        if (screenWidth < 600) {
          return 6; // Extra small screens
        } else if (screenWidth < 960) {
          return 4; // Small screens
        } else if (screenWidth < 1280) {
          return 3; // Medium screens
        } else {
          return 3; // Large screens
        }
      } else if (num === 1) {
        if (screenWidth < 600) {
          return 6; // Extra small screens
        } else if (screenWidth < 960) {
          return 8; // Small screens
        } else if (screenWidth < 1280) {
          return 9; // Medium screens
        } else {
          return 9; // Large screens
        }
      }
    },
    toggleAddToCart: function (prod) {
      this.dialog = true;
      this.cart_item.id = prod.product_id;
      this.cart_item.available = prod.product_quantity;
      this.cart_item.name = prod.product_name;
    },
    closeDialog: function () {
      this.dialog = false;
      for (let i in this.cart_item) {
        this.cart_item[i] = null;
      }
    },
    addToCart: function () {
      if (!this.$refs.form.validate()) {
        return;
      }
      axios
        .post(
          "http://127.0.0.1:5000/cart/" + this.email,
          {
            prod_id: this.cart_item.id,
            quantity: this.cart_item.quantity,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Authentication-Token": localStorage.getItem("auth-token"),
            },
          }
        )
        .then((res) => {
          console.log(res);
          this.dialog = false;
          for (let i in this.cart_item) {
            this.cart_item[i] = null;
          }
          this.loader();
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style scoped>
.cart-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>

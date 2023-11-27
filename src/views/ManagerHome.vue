<template>
  <div>
    <NavBar />
    <br />
    <v-container>
      <v-row v-for="cat in categories" :key="cat.category_id">
        <h1 class="mb-2 mt-0 ml-0" v-if="!cat.isInputVisible">
          {{ cat.category_name }}
          <v-btn icon large rounded @click="toggle(cat)">
            <v-icon class="blue--text text--darken-2">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon large rounded @click="deleteCat(cat.category_id)">
            <v-icon class="red--text text--darken-2">mdi-delete</v-icon>
          </v-btn>
        </h1>
        <div v-if="cat.isInputVisible">
          <v-row>
            <v-col :cols="getColumns(0)">
              <v-text-field
                style="width: 100%"
                v-model="cat.category_name"
                placeholder="Type something"
              />
            </v-col>
            <v-col class="pt-7" :cols="getColumns(1)">
              <v-btn icon rounded @click="toggleInput(cat)">
                <v-icon class="green--text">mdi-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-col
          v-for="prod in cat.products"
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
              <h5 class="text-h6">Available : {{ prod.product_quantity }}</h5>
            </v-card-text>
            <v-btn
              class="ml-0 pl-4 mb-2"
              color="primary"
              large
              plain
              @click="toggleEditProduct(prod)"
            >
              Edit
            </v-btn>
            <v-btn
              class="ml-2 pl-0 mb-2"
              color="error"
              plain
              large
              @click="removeProduct(prod.product_id)"
            >
              Delete
            </v-btn>
          </v-card>
        </v-col>
        <hr />
      </v-row>

      <!-- This is the Floating plus button -->
      <v-btn
        fab
        dark
        x-large
        elevation="30"
        color="primary"
        @click="toggleOptions"
        :class="{ 'rotate-transition': showOptions }"
        class="plus-button"
      >
        <v-icon>{{ showOptions ? "mdi-close" : "mdi-plus" }}</v-icon>
      </v-btn>

      <!-- This is the floating button transition -->
      <transition name="fade">
        <div v-if="showOptions" class="options">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                dark
                large
                color="teal"
                @click="openDialog(1)"
              >
                <v-icon>mdi-tag</v-icon>
              </v-btn>
            </template>
            <span>Create Category</span>
          </v-tooltip>

          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                dark
                large
                color="orange"
                @click="openDialog(0)"
              >
                <v-icon>mdi-package-variant</v-icon>
              </v-btn>
            </template>
            <span>Create Product</span>
          </v-tooltip>
        </div>
      </transition>
    </v-container>

    <!-- This is dialog of product creation -->
    <v-dialog
      persistent
      v-model="dialog"
      width="500"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-card-title class="text-h4 grey lighten-2"
          >Create Product</v-card-title
        >
        <v-card-text class="mt-4 pb-2">
          <v-form ref="form" lazy-validation @submit.prevent>
            <v-select
              :items="categories"
              item-text="category_name"
              item-value="category_id"
              v-model="selected"
              label="Category name"
            ></v-select>
            <v-text-field
              v-model="new_product.name"
              label="Enter the new product name here"
              required
              :rules="rules"
            ></v-text-field>
            <v-text-field
              v-model="new_product.price"
              label="Product Price"
              type="number"
              required
              :rules="number_rules"
            ></v-text-field>
            <v-select
              :items="units"
              v-model="new_product.unit"
              label="Product Unit"
            ></v-select>
            <v-text-field
              v-model="new_product.quantity"
              label="Product quantity"
              required
              type="number"
              :rules="number_rules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end pt-0 pb-3">
          <v-btn type="button" color="error" @click="closeDialog(0)">
            Close
          </v-btn>
          <v-btn type="button" color="primary" @click="createProduct()">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- This is dialog of category creation -->
    <v-dialog
      persistent
      v-model="dialog2"
      width="500"
      transition="dialog-top-transition"
    >
      <v-form ref="form" lazy-validation @submit.prevent>
        <v-card>
          <v-card-title class="text-h4 grey lighten-2"
            >Create Category</v-card-title
          >
          <v-card-text class="mt-4 pb-2">
            <v-text-field
              v-model="new_category.name"
              label="Enter the new category name here"
              required
              :rules="rules"
            ></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="justify-end pt-0 pb-3">
            <v-btn type="button" color="error" @click="closeDialog(1)">
              Close
            </v-btn>
            <v-btn type="button" color="primary" @click="createCategory">
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- This is dialog of product editing -->
    <v-dialog
      persistent
      v-model="dialog3"
      width="500"
      transition="dialog-top-transition"
    >
      <v-card>
        <v-card-title class="text-h4 grey lighten-2"
          >Edit Product - {{ edit_product.product_name }}</v-card-title
        >
        <v-card-text class="mt-4 pb-2">
          <v-form ref="form" lazy-validation @submit.prevent>
            <v-text-field
              v-model="edit_product.price"
              label="Product Price"
              type="number"
              required
              :rules="number_rules"
            ></v-text-field>
            <v-select
              :items="units"
              v-model="edit_product.unit"
              label="Product Unit"
            ></v-select>
            <v-text-field
              v-model="edit_product.quantity"
              label="Product quantity"
              required
              type="number"
              :rules="number_rules"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions class="justify-end pt-0 pb-3">
          <v-btn type="button" color="error" @click="closeDialog(2)">
            Close
          </v-btn>
          <v-btn type="button" color="primary" @click="patchProduct">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import NavBar from "@/components/NavBar.vue";
export default {
  name: "ManagerHome",
  components: { NavBar },
  data() {
    return {
      dialog: false,
      rules: [(value) => !!value || "Required!"],
      categories: null,
      showOptions: false,
      fab: false,
      isInputVisible: false,
      dialog2: false,
      dialog3: false,
      selected: null,
      units: ["Rs/kg", "Rs/dozen", "Rs/litre", "Rs/piece"],
      number_rules: [(value) => value > 0 || "Should be greater than 0!"],
      new_category: {
        name: "",
      },
      new_product: {
        name: "",
        unit: "",
        price: "",
        quantity: "",
      },
      edit_product: {
        product_id: "",
        product_name: "",
        unit: "",
        price: "",
        quantity: "",
      },
    };
  },
  mounted() {
    this.loader();
  },
  methods: {
    loader: async function () {
      try {
        const response = await axios.get("http://127.0.0.1:5000/categories");
        this.categories = response.data.map((cat) => ({
          ...cat,
          isInputVisible: false,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    closeDialog: function (num) {
      if (num === 0) {
        this.selected = null;
        this.dialog = false;
      } else if (num === 1) {
        this.dialog2 = false;
      } else if (num === 2) {
        this.dialog3 = false;
        for (let i in this.edit_product) {
          this.edit_product[i] = null;
        }
      }
    },
    patchCategory: function (cat_id, cat_name) {
      try {
        axios
          .patch(
            "http://127.0.0.1:5000/categories/" +
              cat_id +
              "?new_cat=" +
              cat_name
          )
          .then((response) => {
            console.log(response);
            this.loader();
          });
      } catch (error) {
        console.log(error);
      }
    },
    toggleInput: function (cat) {
      this.isInputVisible = !this.isInputVisible;
      this.patchCategory(cat.category_id, cat.category_name);
    },
    toggle: function (cat) {
      cat.isInputVisible = !cat.isInputVisible;
    },
    openDialog: function (num) {
      if (num === 0) {
        this.dialog = true;
      } else if (num === 1) {
        this.dialog2 = true;
      }
    },
    toggleOptions: function () {
      this.showOptions = !this.showOptions;
    },
    createCategory: function () {
      if (!this.$refs.form.validate()) {
        return;
      }
      try {
        axios
          .post("http://127.0.0.1:5000/categories", this.new_category, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((response) => {
            this.loader();
            console.log(response);
            this.dialog2 = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    createProduct: function () {
      if (!this.$refs.form.validate()) {
        if (this.selected === null) {
          return;
        }
      }
      try {
        axios
          .post(
            "http://127.0.0.1:5000/products/" + this.selected,
            this.new_product,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          )
          .then((response) => {
            this.loader();
            console.log(response);
            this.selected = null;
            this.dialog = false;
          });
      } catch (error) {
        console.log(error);
      }
    },
    deleteCat: function (cat_id) {
      try {
        axios
          .delete("http://127.0.0.1:5000/categories/" + cat_id)
          .then((response) => {
            console.log(response);
            this.loader();
          });
      } catch (error) {
        console.log(error);
      }
    },
    removeProduct: function (prod) {
      axios
        .delete("http://127.0.0.1:5000/products?product_id=" + prod)
        .then((res) => {
          console.log(res);
          this.loader();
        });
    },
    toggleEditProduct: function (prod) {
      this.dialog3 = true;
      this.edit_product.product_name = prod.product_name;
      this.edit_product.product_id = prod.product_id;
      this.edit_product.price = prod.product_price;
      this.edit_product.unit = prod.product_unit;
      this.edit_product.quantity = prod.product_quantity;
    },
    patchProduct: function () {
      axios
        .put(
          "http://127.0.0.1:5000/products?product_id=" +
            this.edit_product.product_id,
          this.edit_product,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          console.log(response);
          this.loader();
          this.dialog3 = false;
        });
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
  },
};
</script>

<style scoped>
.rotate-transition-enter-active,
.rotate-transition-leave-active {
  transition: transform 0.5s;
}
.rotate-transition-enter,
.rotate-transition-leave-to {
  transform: rotate(180deg);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.options {
  position: fixed;
  bottom: 100px;
  right: 28px;
  display: flex;
  flex-direction: column;
}

.plus-button {
  position: fixed;
  right: 20px;
  bottom: 20px;
}
</style>

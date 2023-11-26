<template>
  <div>
    <NavBar />
    <br />
    <v-container class="grey lighten-5">
      <v-row v-for="cat in categories" :key="cat.category_id" no-gutters>
        <h1 class="mb-2 mt-4 ml-0" v-if="!cat.isInputVisible">
          {{ cat.category_name }}
          <v-btn icon rounded @click="toggle(cat)">
            <v-icon class="blue--text text--darken-2">mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon rounded @click="deleteCat(cat.category_id)">
            <v-icon class="red--text text--darken-2">mdi-delete</v-icon>
          </v-btn>
        </h1>
        <div v-if="cat.isInputVisible">
          <v-row>
            <v-col cols="3">
              <v-text-field
                style="width: 100%"
                v-model="cat.category_name"
                placeholder="Type something"
              />
            </v-col>
            <v-col cols="9" style="margin-top: 1.5%">
              <v-btn icon rounded @click="toggle(cat)">
                <v-icon class="green--text">mdi-check</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-col v-for="prod in cat.products" :key="prod.product_id" cols="3">
          <v-card class="pa-2" outlined tile> {{ prod.product_name }} </v-card>
        </v-col>
      </v-row>
      <v-btn
        fab
        dark
        color="primary"
        @click="toggleOptions"
        :class="{ 'rotate-transition': showOptions }"
        class="plus-button"
      >
        <v-icon>{{ showOptions ? "mdi-close" : "mdi-plus" }}</v-icon>
      </v-btn>

      <transition name="fade">
        <div v-if="showOptions" class="options">
          <v-tooltip left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                fab
                dark
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
              :rules="rules"
            ></v-text-field>
            <v-select
              :items="units"
              v-model="new_product.unit"
              label="Category name"
            ></v-select>
            <v-text-field
              v-model="new_product.quantity"
              label="Product quantity"
              required
              type="number"
              :rules="rules"
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
      selected: null,
      units: ["Rs/kg", "Rs/dozen", "Rs/litre", "Rs/piece"],
      new_category: {
        name: "",
      },
      new_product: {
        name: "",
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
    toggleInput: function () {
      this.isInputVisible = !this.isInputVisible;
      // this.patchCategory(cat_id, cat_name);
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
  bottom: 80px;
  right: 20px;
  display: flex;
  flex-direction: column;
}

.plus-button {
  position: absolute;
  right: 20px;
  bottom: 20px;
}
</style>
<template>
  <v-container fill-height>
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="pa-0 mb-4" elevation="15" shaped max-width="600">
          <v-tabs v-model="tab" centered>
            <v-tab :key="0">Login</v-tab>
            <v-tab :key="1">Signup</v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item :key="0">
              <v-form ref="login" @submit.prevent>
                <br />
                <v-card-text class="mt-4 pb-2">
                  <v-text-field
                    v-model="login.email"
                    label="Email"
                    :rules="[rules.email]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="login.password"
                    label="Password"
                    type="password"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-card-text style="color: crimson" class="pt-0 pl-0 pb-0">{{
                    error
                  }}</v-card-text>
                </v-card-text>
                <v-card-actions class="justify-end pt-0 mb-4 pb-4 mr-4">
                  <v-btn large type="submit" color="primary" @click="loginCheck"
                    >Login</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-tab-item>

            <v-tab-item :key="1">
              <v-form ref="signup" @submit.prevent>
                <v-card-text class="mt-4 pb-4">
                  <v-text-field
                    v-model="signup.username"
                    label="Username"
                    :rules="[rules.required]"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="signup.email"
                    label="Email"
                    :rules="[rules.email]"
                    required
                  ></v-text-field>
                  <v-select
                    v-model="signup.role"
                    :items="roles"
                    label="Role"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="signup.password"
                    label="Password"
                    :rules="password"
                    type="password"
                    required
                  ></v-text-field>
                </v-card-text>
                <v-card-text style="color: crimson" class="pt-0 pb-0">{{
                  error2
                }}</v-card-text>
                <v-card-actions class="justify-end pt-0 mb-4 pb-4 mr-4">
                  <v-btn
                    large
                    type="submit"
                    color="primary"
                    @click="signupCheck"
                    >Signup</v-btn
                  >
                </v-card-actions>
              </v-form>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "LoginSignup",
  data() {
    return {
      tab: 0,
      login: {
        email: "",
        password: "",
      },
      signup: {
        username: "",
        email: "",
        role: "",
        password: "",
      },
      error: "",
      error2: "",
      rules: {
        email: (value) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        required: (value) => !!value || "Required.",
      },
      password: [
        (value) => !!value || "Password is required",
        (value) =>
          (value && value.length >= 8) ||
          "Password must be at least 8 characters",
        (value) =>
          /^(?=.*[A-Z])/.test(value) ||
          "Password must contain at least one uppercase letter",
        (value) =>
          /^(?=.*[a-z])/.test(value) ||
          "Password must contain at least one lowercase letter",
        (value) =>
          /^(?=.*\d)/.test(value) ||
          "Password must contain at least one number",
        (value) =>
          /^(?=.*[@$!%*?&])/.test(value) ||
          "Password must contain at least one special character (@, $, !, %, *, ?, &)",
      ],
      roles: ["Customer", "Manager"],
    };
  },
  methods: {
    async loginCheck() {
      if (!this.$refs.login.validate()) {
        return;
      }
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/user-login",
          this.login,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data.message === "Success") {
          this.error = "";
          localStorage.setItem("auth-token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("email", response.data.email);
          const role = response.data.role;
          if (role === "manager") {
            window.location = "/manager";
          } else if (role === "customer") {
            window.location = "/customer";
          }
        } else {
          this.error = response.data.error;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async signupCheck() {
      if (!this.$refs.signup.validate()) {
        return;
      }
      try {
        const response = await axios.post(
          "http://127.0.0.1:5000/user-signup",
          this.signup,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
        if (response.data.message === "Success") {
          this.error2 = "";
          localStorage.setItem("auth-token", response.data.token);
          localStorage.setItem("role", response.data.role);
          localStorage.setItem("email", response.data.email);
          const role = response.data.role;
          if (role === "manager") {
            window.location = "/manager";
          } else if (role === "customer") {
            window.location = "/customer";
          }
        } else {
          this.error2 = response.data.error;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

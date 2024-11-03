<script>
import NavBarPreLogin from "@/components/NavBarPreLogin.vue";
import FooterPreLogin from "@/components/FooterPreLogin.vue";
import { auth } from "@/firebase";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { db } from "@/firebase"; // adjust the path based on your setup
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
export default {
  data() {
    return {
      accountType: "customer",
      customer: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        bio: "",
      },
      contractor: {
        firstName: "",
        lastName: "",
        companyName: "",
        companyEmail: "",
        password: "",
        confirmPassword: "",
        storeAddress: "",
        postalCode: "",
      },
      errors: {},
      passwordVisible: false,
      confirmPasswordVisible: false,
      passwordCVisible: false,
      confirmPasswordCVisible: false,
      passwordStrength: "",
      passwordCStrength: "",
    };
  },
  methods: {
    toggleFields() {
      this.errors = {}; // Clear errors when switching account types
    },
    togglePasswordVisibility(field) {
      if (field === "password") {
        this.passwordVisible = !this.passwordVisible;
      } else if (field === "confirmPassword") {
        this.confirmPasswordVisible = !this.confirmPasswordVisible;
      } else if (field === "passwordC") {
        this.passwordCVisible = !this.passwordCVisible;
      } else if (field === "confirmPasswordC") {
        this.confirmPasswordCVisible = !this.confirmPasswordCVisible;
      }
    },
    updateStrengthIndicator() {
      const strength = this.checkPasswordStrength(this.customer.password);
      this.passwordStrength = strength;
    },
    updateStrengthIndicatorC() {
      const strength = this.checkPasswordStrength(this.contractor.password);
      this.passwordCStrength = strength;
    },
    checkPasswordStrength(password) {
      // Add your password strength logic here (e.g., length, characters)
      if (password.length < 6) {
        return "Weak";
      } else if (password.length < 12) {
        return "Medium";
      } else {
        return "Strong";
      }
    },
    checkPasswordMatch() {
      this.errors.confirmPassword =
        this.customer.password !== this.customer.confirmPassword
          ? "Passwords do not match"
          : "";
    },
    checkPasswordMatchC() {
      this.errors.confirmPasswordC =
        this.contractor.password !== this.contractor.confirmPassword
          ? "Passwords do not match"
          : "";
    },
    registerUser() {
      this.errors = {};
      if (!this.customer.firstName)
        this.errors.firstName = "First name is required";
      if (!this.customer.lastName)
        this.errors.lastName = "Last name is required";
      if (!this.customer.email) this.errors.email = "Email is required";
      if (!this.customer.password)
        this.errors.password = "Password is required";
      if (this.customer.password !== this.customer.confirmPassword)
        this.errors.confirmPassword = "Passwords do not match";

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.customer.email && !emailPattern.test(this.customer.email)) {
        this.errors.email = "Invalid email format";
      }

      if (Object.keys(this.errors).length === 0) {
        createUserWithEmailAndPassword(
          auth,
          this.customer.email,
          this.customer.password
        )
          .then(async (credential) => {
            const user = credential.user;
            console.log("User registered:", user);
            const userData = {
              firstName: this.customer.firstName,
              lastName: this.customer.lastName,
              email: this.customer.email,
              role: "customer",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
              bio: "No bio available yet. Please edit your profile to update bio...",
            };
            await setDoc(doc(db, "users", user.uid), userData);
            console.log("User data saved to Firestore:");
            alert("You have successfully created an account! Please login.");
            await signOut(auth);
            this.resetCustomerForm();
            this.$router.push("/login");
          })
          .catch((error) => {
            console.log("Error creating user:", error.message);
          });
      }
    },
    registerUserC() {
      this.errors = {};
      if (!this.contractor.firstName)
        this.errors.firstNameC = "First name is required";
      if (!this.contractor.lastName)
        this.errors.lastNameC = "Last name is required";
      if (!this.contractor.companyName)
        this.errors.companyName = "Company name is required";
      if (!this.contractor.companyEmail)
        this.errors.companyEmail = "Company email is required";
      if (!this.contractor.storeAddress)
        this.errors.storeAddress = "Company address is required";
      if (!this.contractor.postalCode)
        this.errors.postalCode = "Company postal code is required";
      if (!this.contractor.password)
        this.errors.passwordC = "Password is required";
      if (this.contractor.password !== this.contractor.confirmPassword)
        this.errors.confirmPasswordC = "Passwords do not match";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (
        this.contractor.companyEmail &&
        !emailPattern.test(this.contractor.companyEmail)
      ) {
        this.errors.companyEmail = "Invalid email format";
      }

      if (Object.keys(this.errors).length === 0) {
        // Register contractor with Firebase Auth
        createUserWithEmailAndPassword(
          auth,
          this.contractor.companyEmail,
          this.contractor.password
        )
          .then(async (credential) => {
            const user = credential.user;
            console.log("Contractor registered:", user);

            // Prepare data to store in Firestore
            const contractorData = {
              firstName: this.contractor.firstName,
              lastName: this.contractor.lastName,
              companyName: this.contractor.companyName,
              businessEmail: this.contractor.companyEmail, // companyEmail is the business email
              phoneNumber: this.contractor.phoneNumber || "", // Default to empty string if not provided
              certsAndAwards: this.contractor.certsAndAwards || [],
              portfolioImages: [],
              rating: 0,
              reviewCount: 0,
              searchComposite: `${this.contractor.companyName
                .toLowerCase()
                .replace(/ /g, "_")}_0_singapore`,
              services: this.contractor.services || [],
              storeAddress: this.contractor.storeAddress || "",
              postalCode: this.contractor.postalCode || "",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };

            // Add the contractor data to Firestore
            await setDoc(doc(db, "contractors", user.uid), contractorData);
            console.log("Contractor data saved to Firestore:", contractorData);

            const userData = {
              firstName: this.contractor.firstName,
              lastName: this.contractor.lastName,
              email: this.contractor.companyEmail,
              role: "contractor",
              createdAt: serverTimestamp(),
              lastLogin: serverTimestamp(),
            };

            await setDoc(doc(db, "users", user.uid), userData);
            console.log("User data saved to Firestore:", userData);

            alert("You have successfully created a contractor account!");

            await signOut(auth);

            this.resetContractorForm();

            this.$router.push("/login");
          })
          .catch((error) => {
            console.log("Error creating contractor:", error.message);
          });
      }
    },
    resetCustomerForm() {
      this.customer = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      };
      this.passwordStrength = "";
    },
    resetContractorForm() {
      this.contractor = {
        firstName: "",
        lastName: "",
        companyName: "",
        companyEmail: "",

        password: "",
        confirmPassword: "",
      };
      this.passwordCStrength = "";
    },
  },
  components: {
    NavBarPreLogin,
    FooterPreLogin,
  },
  mounted() {
    this.toggleFields();
  },
};
</script>

<template>
  <NavBarPreLogin></NavBarPreLogin>
  <div class="page-wrapper">
  <div class="container-fluid p-0">
    <div class="row g-0 vh-100">
      <div class="col-lg-6 col-12 form-container">
        <div class="scrollable-container">
        <div class="registration-form">
          <h2 class="mb-4 text-center">Create an Account</h2>
          <form
            @submit.prevent="
              accountType === 'customer' ? registerUser() : registerUserC()
            "
          >
            <div class="mb-3">
              <label for="accountType" class="form-label">Account Type</label>
              <select
                class="form-select"
                id="accountType"
                v-model="accountType"
                @change="toggleFields"
              >
                <option value="customer" selected>Customer</option>
                <option value="contractor">Contractor</option>
              </select>
              <div class="error" v-if="errors.accountType">
                {{ errors.accountType }}
              </div>
            </div>

            <div v-if="accountType === 'customer'" id="customerFields">
              <div class="mb-3 row">
                <div class="col-md-6">
                  <label for="firstName" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control mb-3 mb-md-0"
                    v-model="customer.firstName"
                    placeholder="Enter your first name"
                    required
                  />
                  <div class="error" v-if="errors.firstName">
                    {{ errors.firstName }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="lastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="customer.lastName"
                    placeholder="Enter your last name"
                    required
                  />
                  <div class="error" v-if="errors.lastName">
                    {{ errors.lastName }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  type="email"
                  class="form-control"
                  v-model="customer.email"
                  placeholder="Enter your email"
                  required
                />
                <div class="error" v-if="errors.email">{{ errors.email }}</div>
              </div>

              <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="passwordVisible ? 'text' : 'password'"
                    class="form-control"
                    v-model="customer.password"
                    placeholder="Enter your password"
                    required
                    @input="updateStrengthIndicator()"
                    ref="passwordField"
                  />
                  <span
                    class="input-group-text show-password"
                    @click="togglePasswordVisibility('password')"
                  >
                    <i
                      :class="
                        passwordVisible
                          ? 'fa-solid fa-eye-slash'
                          : 'fa-solid fa-eye'
                      "
                      id="eye-icon-password"
                    ></i>
                  </span>
                </div>
                <div class="strength-indicator" v-if="passwordStrength">
                  {{ passwordStrength }}
                </div>
                <div class="error" v-if="errors.password">
                  {{ errors.password }}
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPassword" class="form-label"
                  >Confirm Password</label
                >
                <div class="input-group">
                  <input
                    :type="confirmPasswordVisible ? 'text' : 'password'"
                    class="form-control"
                    v-model="customer.confirmPassword"
                    placeholder="Confirm your password"
                    required
                    @input="checkPasswordMatch()"
                    ref="confirmPasswordField"
                  />
                  <span
                    class="input-group-text show-password"
                    @click="togglePasswordVisibility('confirmPassword')"
                  >
                    <i
                      :class="
                        confirmPasswordVisible
                          ? 'fa-solid fa-eye-slash'
                          : 'fa-solid fa-eye'
                      "
                      id="eye-icon-confirmPassword"
                    ></i>
                  </span>
                </div>
                <div class="error" v-if="errors.confirmPassword">
                  {{ errors.confirmPassword }}
                </div>
              </div>

              <div class="d-grid mb-3">
                <button
                  class="btn register-btn"
                  type="button"
                  @click="registerUser"
                >
                  Create Account
                </button>
              </div>

              <!-- 
    <div class="d-grid mb-3">
        <button class="btn google-login" type="button">
            <i class="fa-brands fa-google"></i>&nbsp;Continue with Google
        </button>
    </div> -->
            </div>
            <div v-if="accountType === 'contractor'" id="contractorFields">
              <div class="mb-3 row">
                <div class="col-md-6">
                  <label for="firstNameC" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control mb-3 mb-md-0"
                    v-model="contractor.firstName"
                    placeholder="Enter your first name"
                    required
                  />
                  <div class="error" v-if="errors.firstNameC">
                    {{ errors.firstNameC }}
                  </div>
                </div>

                <div class="col-md-6">
                  <label for="lastNameC" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="contractor.lastName"
                    placeholder="Enter your last name"
                    required
                  />
                  <div class="error" v-if="errors.lastNameC">
                    {{ errors.lastNameC }}
                  </div>
                </div>
              </div>

              <div class="mb-3">
                <label for="companyName" class="form-label">Company Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="contractor.companyName"
                  placeholder="Enter your company name"
                  required
                />
                <div class="error" v-if="errors.companyName">
                  {{ errors.companyName }}
                </div>
              </div>

              <div class="mb-3">
                <label for="companyAddress" class="form-label"
                  >Company Address</label
                >
                <input
                  type="text"
                  class="form-control"
                  v-model="contractor.storeAddress"
                  placeholder="Enter your company address"
                  required
                />
                <div class="error" v-if="errors.storeAddress">
                  {{ errors.storeAddress }}
                </div>
              </div>

              <div class="mb-3">
                <label for="postalCode" class="form-label">Postal Code</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="contractor.postalCode"
                  placeholder="Enter your company postal code"
                  required
                />
                <div class="error" v-if="errors.postalCode">
                  {{ errors.postalCode }}
                </div>
              </div>

              <div class="mb-3">
                <label for="companyEmail" class="form-label"
                  >Company Email</label
                >
                <input
                  type="email"
                  class="form-control"
                  v-model="contractor.companyEmail"
                  placeholder="Enter your company email"
                  required
                />
                <div class="error" v-if="errors.companyEmail">
                  {{ errors.companyEmail }}
                </div>
              </div>

              <div class="mb-3">
                <label for="passwordC" class="form-label">Password</label>
                <div class="input-group">
                  <input
                    :type="passwordCVisible ? 'text' : 'password'"
                    class="form-control"
                    v-model="contractor.password"
                    placeholder="Enter your password"
                    required
                    @input="updateStrengthIndicatorC()"
                    ref="passwordCField"
                  />
                  <span
                    class="input-group-text show-password"
                    @click="togglePasswordVisibility('passwordC')"
                  >
                    <i
                      :class="
                        passwordCVisible
                          ? 'fa-solid fa-eye-slash'
                          : 'fa-solid fa-eye'
                      "
                      id="eye-icon-passwordC"
                    ></i>
                  </span>
                </div>
                <div class="strength-indicator" v-if="passwordCStrength">
                  {{ passwordCStrength }}
                </div>
                <div class="error" v-if="errors.passwordC">
                  {{ errors.passwordC }}
                </div>
              </div>

              <div class="mb-3">
                <label for="confirmPasswordC" class="form-label"
                  >Confirm Password</label
                >
                <div class="input-group">
                  <input
                    :type="confirmPasswordCVisible ? 'text' : 'password'"
                    class="form-control"
                    v-model="contractor.confirmPassword"
                    placeholder="Confirm your password"
                    required
                    @input="checkPasswordMatchC()"
                    ref="confirmPasswordCField"
                  />
                  <span
                    class="input-group-text show-password"
                    @click="togglePasswordVisibility('confirmPasswordC')"
                  >
                    <i
                      :class="
                        confirmPasswordCVisible
                          ? 'fa-solid fa-eye-slash'
                          : 'fa-solid fa-eye'
                      "
                      id="eye-icon-confirmPasswordC"
                    ></i>
                  </span>
                </div>
                <div class="error" v-if="errors.confirmPasswordC">
                  {{ errors.confirmPasswordC }}
                </div>
              </div>

              <div class="d-grid mb-3">
                <button
                  class="btn register-btn"
                  type="button"
                  @click="registerUserC"
                >
                  Create Account
                </button>
              </div>
            </div>
          </form>
        </div>
        </div>
      </div>

      <!-- Carousel Section -->
      
      <div
        id="carouselExample"
        class="carousel slide col-lg-6 col-12 carousel-container vh-100"
        data-bs-ride="carousel"
      >
        <div class="carousel-inner h-100">
          <div class="carousel-item active position-relative h-100">
            <img
              src="../assets/register1.jpg"
              class="d-block w-100 h-100"
              alt="Slide 1"
            />
            <div class="carousel-caption">
              <h2>Register as a Customer</h2>
              <p style="font-size: 22px">
                Have an account? <br />
                <span><a href="/login">Click here to Login</a></span>
              </p>
            </div>
          </div>
          <div class="carousel-item position-relative h-100">
            <img
              src="../assets/register2.jpg"
              class="d-block w-100 h-100"
              alt="Slide 2"
            />
            <div class="carousel-caption">
              <h2>Register as a Contractor</h2>
              <p style="font-size: 22px">
                Interested in joining us? <br />
                <span><a href="/login">Click here to Login</a></span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  <FooterPreLogin></FooterPreLogin>
</template>

<style scoped>
.page-wrapper {
  padding-top: 130px; /* Navbar height */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.container-fluid {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.full-height-row {
  flex: 1;
  min-height: calc(100vh - 80px); /* Subtract navbar height */
}

.form-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.scrollable-container {
  max-height: calc(100vh - 0px); /* Adjust based on your needs */
  overflow-y: auto;
  padding: 2rem 1rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

.registration-form {
  padding: 40px;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 15px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: auto;
}

.carousel-container {
  height: calc(100vh - 80px); /* Subtract navbar height */
}

.carousel,
.carousel-inner,
.carousel-item {
  height: 100%;
}

.carousel-item img {
  height: 100%;
  width: 100%;
  object-fit: cover;
}

/* Keep all your existing styles */
.form-label {
  font-weight: bold;
}

.form-control {
  border-radius: 5px;
}

.register-btn {
  background-color: #007bff;
  color: #fff;
  border-radius: 5px;
  margin-bottom: 10px;
  border: none;
}

.register-btn:hover {
  background-color: #0056b3;
  color: #fff;
}

.error {
  color: red;
  font-size: 0.875rem;
}

.strength-indicator {
  height: 5px;
  border-radius: 5px;
  transition: width 0.3s;
}

.strength-weak {
  background-color: red;
  width: 33%;
}

.strength-medium {
  background-color: orange;
  width: 66%;
}

.strength-strong {
  background-color: green;
  width: 100%;
}

.show-password {
  cursor: pointer;
}

.carousel-caption {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.3);
  padding: 10px;
  border-radius: 5px;
}

.carousel-caption p {
  font-size: 1.5rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #fff;
  line-height: 1;
}

.carousel-caption a {
  font-size: 1rem;
  color: #fff;
  text-decoration: underline;
}

.carousel-caption a:hover {
  color: #fff;
  text-decoration: underline;
}

@media (max-width: 991px) {
  .carousel-container {
    display: none;
  }
  
  .form-container {
    width: 100%;
  }

  .scrollable-container {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .page-wrapper {
    padding-top: 130px;
  }

  .full-height-row {
    min-height: calc(100vh - 0px);
  }

  .carousel-control-prev,
  .carousel-control-next {
    display: none;
  }
  
  .registration-form {
    padding: 20px;
  }

  .scrollable-container {
    max-height: calc(100vh - 0px);
  }
}

@media (max-width: 375px) {
  .registration-form {
    padding: 15px;
  }
}
</style>

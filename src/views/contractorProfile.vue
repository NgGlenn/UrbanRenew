<script>
import LogedInLayout from "@/components/LogedInLayout.vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, arrayUnion  } from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";

export default {
  data() {
    return {
      userName: "",
      userEmail: "",
      defaultImage: "",
      companyName: "",
      servicesOffered: [], // Store services as an array
      newServiceItem: "",
      address: "",
      postalCode: "",
      phone: "",
      certificatesAndAwards: [], // Store awards as an array
      newCertItem: "",
      showEditProfileModal: false,
      showUpdatePasswordModal: false,
      updateFirstName: "",
      updateLastName: "",
      updatedEmail: "",
      tempEmail: "",
      newPassword: "",
      confirmPassword: "",
      updatedServicesOffered: [], // Store updated services as an array
      updatedCertificatesAndAwards: [], // Store updated awards as an array
      loading: true, // Set loading to true initially
    };
  },

  methods: {
  addCertItem() {
    if (this.newCertItem.trim()) {
      this.updatedCertificatesAndAwards.push(this.newCertItem.trim());
      this.newCertItem = ""; // Clear input after adding
    }
  },
  // Method to delete a certificate/award by index
  deleteCertItem(index) {
    this.updatedCertificatesAndAwards.splice(index, 1);
  },
  addServiceItem() {
    if (this.newServiceItem.trim()) {
      this.updatedServicesOffered.push(this.newServiceItem.trim());
      this.newServiceItem = ""; // Clear input after adding
    }
  },
  // Method to delete a service by index
  deleteServiceItem(index) {
    this.updatedServicesOffered.splice(index, 1);
  },
  openEditProfileModal() {
    // Populate temporary fields with existing data
    const names = this.userName.split(/\s+/).filter(Boolean);
    this.updateFirstName = names.length > 1 ? names.slice(0, -1).join(" ") : names[0];
    this.updateLastName = names.length > 1 ? names[names.length - 1] : "";
    this.updatedCompanyName = this.companyName;
    this.updatedServicesOffered = [...this.servicesOffered]; // Copy the original arrays here
    this.updatedCertificatesAndAwards = [...this.certificatesAndAwards];
    this.updatedAddress = this.address || "";
    this.updatedPostalCode = this.postalCode || "";
    this.updatedPhone = this.phone || "";
    this.showEditProfileModal = true;
  },
  saveProfile: async function () {
    // Assign updated values to main state fields
    this.userName = `${this.updateFirstName} ${this.updateLastName}`;
    this.companyName = this.updatedCompanyName;
    this.servicesOffered = [...this.updatedServicesOffered]; // Update main state with modified values
    this.certificatesAndAwards = [...this.updatedCertificatesAndAwards];
    this.address = this.updatedAddress;
    this.postalCode = this.updatedPostalCode;
    this.phone = this.updatedPhone;
    this.showEditProfileModal = false;

    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const contractorDocRef = doc(db, "contractors", user.uid);

      try {
        // Update user information
        await updateDoc(userDocRef, {
          firstName: this.updateFirstName,
          lastName: this.updateLastName,
          email: this.userEmail, // Keep the existing email
        });

        // Update contractor information
        await updateDoc(contractorDocRef, {
          firstName: this.updateFirstName,
          lastName: this.updateLastName,
          companyName: this.updatedCompanyName,
          phoneNumber: this.updatedPhone,
          postalCode: this.updatedPostalCode,
          services: this.servicesOffered, // Save the final array directly
          certsAndAwards: this.certificatesAndAwards, // Save the final array directly
          storeAddress: this.updatedAddress,
        });

        alert("Profile updated successfully.");
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
      }
    } else {
      console.error("User not authenticated. Cannot update profile.");
    }
  },
    // addService() {
    //   this.updatedServicesOffered.push("");
    // },
    // removeService(index) {
    //   this.updatedServicesOffered.splice(index, 1);
    // },
    // addAward() {
    //   this.updatedCertificatesAndAwards.push("");
    // },
    // removeAward(index) {
    //   this.updatedCertificatesAndAwards.splice(index, 1);
    // },
    openUpdatePasswordModal() {
      this.showUpdatePasswordModal = true;
    },
    async updatePassword() {
      this.passwordError = "";

      // Basic validation
      if (this.newPassword !== this.confirmPassword) {
        this.passwordError = "Passwords do not match.";
        return;
      }
      if (this.newPassword.length < 6) {
        this.passwordError = "Password must be at least 6 characters long.";
        return;
      }

      // Reauthenticate before updating password
      try {
        const user = auth.currentUser;
        if (!user) {
          this.passwordError = "User not authenticated. Please log in again.";
          return;
        }

        // Assuming user’s current email and password are available
        const credential = EmailAuthProvider.credential(
          user.email,
          this.currentPassword // Add a field for the current password if needed
        );
        await reauthenticateWithCredential(user, credential);

        // Update password
        await updatePassword(user, this.newPassword);

        alert("Password updated successfully.");
        this.currentPassword = "";
        this.newPassword = "";
        this.confirmPassword = "";
        this.showUpdatePasswordModal = false;
      } catch (error) {
        console.error("Error updating password:", error);
        this.passwordError = error.message;
      }
    },
  },
  mounted() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          this.userName = `${userData.firstName} ${userData.lastName}`;
          this.userEmail = userData.email;

          // Check if the user is a contractor
          if (userData.role === "contractor") {
            const contractorDoc = doc(db, "contractors", user.uid);
            const contractorSnap = await getDoc(contractorDoc);

            if (contractorSnap.exists()) {
              const contractorData = contractorSnap.data();
              this.companyName = contractorData.companyName || "N/A";
              this.phone = contractorData.phoneNumber || "N/A";
              this.postalCode = contractorData.postalCode || "N/A";
              this.address = contractorData.storeAddress || "N/A";
              this.servicesOffered = contractorData.services?.length
                ? contractorData.services
                : ["None"];
              this.certificatesAndAwards = contractorData.certsAndAwards?.length
                ? contractorData.certsAndAwards
                : ["None"];
            } else {
              console.error("No contractor document for user ID:", user.uid);
            }
          } else {
            // Redirect to customer profile if the role is not contractor
            this.$router.push("/customerProfile");
          }
          this.loading = false;
        } else {
          console.error("No user document for user ID:", user.uid);
        }
      } else {
        console.log("User not logged in. Redirecting to login page.");
        this.$router.push("/login");
      }
    });
  },
  components: {
    LogedInLayout,
  },
};
</script>

<template>
  <LogedInLayout>
    <div v-if="loading"></div>
    <div v-else>
      <div class="container mt-5">
        <div class="row">
          <!-- Left Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="text-center mb-3">
                <img
                  src="https://via.placeholder.com/150"
                  alt="User Profile"
                  class="rounded-circle profile-image mb-3"
                />
                <h5 class="card-title">
                  <i class="fas fa-user-circle"></i> {{ userName }}
                </h5>
                <p class="card-text">
                  <i class="fas fa-envelope icon"></i>{{ userEmail }}
                </p>
                <div class="button-container">
                  <button
                    class="btn btn-primary me-2"
                    @click="openEditProfileModal"
                  >
                    Edit Profile
                  </button>
                  <button
                    class="btn btn-secondary"
                    @click="openUpdatePasswordModal"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
            <div class="card mb-4">
              <div class="card-header">Company Information</div>
              <div class="card-body">
                <h5 class="card-title">
                  <i class="fas fa-info-circle"></i> About
                </h5>
                <!-- About Section Title -->

                <h6 class="">Company Name:</h6>
                <!-- Company Name -->
                <p class="text-muted">{{ companyName }}</p>
                <!-- Placeholder for company name -->

                <h6>Services Offered:</h6>
                <!-- Services Offered Section -->
                <ul class="list-unstyled">
                  <li
                    v-for="(service, index) in servicesOffered"
                    :key="index"
                    class="text-muted"
                  >
                    <i class="fas fa-check-circle"></i> {{ service }}
                  </li>
                </ul>

                <h6>Store Location:</h6>
                <!-- Store Location Section -->
                 <p class="text-muted">{{ address }}, S{{ postalCode }}</p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query={{ storeLocation }}"
                  target="_blank"
                  class="text-primary hover-text-decoration-underline"
                >
                  <i class="fas fa-map-marker-alt"></i> View on Google Maps
                </a>

                <hr />

                <h5 class="mt-4">
                  <i class="fas fa-address-card"></i> Contact Info
                </h5>

                <h6 class="">
                  <i class="fas fa-phone-alt"></i> Phone: {{ phone }}
                </h6>

                <h6 class="">
                  <i class="fas fa-envelope"></i> Email: {{ userEmail }}
                </h6>

                <hr />

                <h5 class="mt-4">
                  <i class="fas fa-trophy"></i> Certificates & Awards
                </h5>
                <!-- Certificates & Awards Section Title -->

                <ul class="list-unstyled">
                  <li
                    v-for="(award, index) in certificatesAndAwards"
                    :key="index"
                    class="text-muted"
                  >
                    <i class="fas fa-award"></i> {{ award }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-md-6">
            <div class="card mb-4">
              <div class="card-header">Past Renovation Projects</div>
              <div class="card-body">
                <div class="transaction-item">
                  <p class="bio-placeholder">No past projects available.</p>
                </div>
              </div>
            </div>
            <div class="card mb-4 review-card">
              <div class="card-header">Reviews</div>
              <div class="card-body">
                <div class="review-item mb-4 border-bottom pb-3">
                  <div class="d-flex align-items-center">
                    <img
                      src="../assets/home_testi3.jpg"
                      alt="John Doe"
                      class="rounded-circle me-2"
                      style="width: 50px; height: 50px"
                    />
                    <!-- Increased image size -->
                    <div class="flex-grow-1">
                      <h6 class="mb-0 text-muted">John Doe</h6>
                      <!-- Changed to h6 for smaller text -->
                      <div class="rating">
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-warning">&#9733;</span>
                        <span class="text-muted">&#9733;</span>
                      </div>
                    </div>
                  </div>
                  <p class="mt-2 small text-muted">
                    <!-- Added margin start (ms) for indentation -->
                    Great experience! The service was fantastic and I would
                    highly recommend it to others.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Profile Modal -->
      <div v-if="showEditProfileModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Edit Profile</h5>
          <input
            type="text"
            v-model="updateFirstName"
            class="form-control mb-2"
            placeholder="First Name"
          />
          <input
            type="text"
            v-model="updateLastName"
            class="form-control mb-2"
            placeholder="Last Name"
          />
          <input
            type="text"
            v-model="updatedCompanyName"
            class="form-control mb-2"
            placeholder="Company Name"
          />

          <input
            type="text"
            v-model="updatedAddress"
            class="form-control mb-2"
            placeholder="Full Address"
          />
          <input
            type="text"
            v-model="updatedPostalCode"
            class="form-control mb-2"
            placeholder="Postal Code"
          />
          <input
            type="text"
            v-model="updatedPhone"
            class="form-control mb-2"
            placeholder="Phone"
          />
          <hr />
          <h6>Services</h6>
          <div id="itemList">
            <!-- Display each service with an "X" to delete -->
            <div
              class="item"
              v-for="(service, index) in updatedServicesOffered"
              :key="index"
            >
              {{ service }}
              <span class="remove" @click="deleteServiceItem(index)">X</span>
            </div>
          </div>

          <!-- Input field and button to add new services -->
          <div class="input-group">
            <input
              type="text"
              id="newItem"
              class="form-control mb-2"
              v-model="newServiceItem"
              placeholder="Add service/certificate"
            />
            <button
              class="buttonEditProfile"
              @click="addServiceItem"
              id="addServiceItem"
            >
              Add
            </button>
          </div>
          <hr />
          <h6>Certificates & Awards</h6>
          <div id="itemList">
            <!-- Display each certificate/award with an "X" to delete -->
            <div
              class="item"
              v-for="(award, index) in updatedCertificatesAndAwards"
              :key="index"
            >
              {{ award }}
              <span class="remove" @click="deleteCertItem(index)">X</span>
            </div>
          </div>

          <!-- Input field and button to add new certificates/awards -->
          <div class="input-group">
            <input
              type="text"
              id="newItem"
              class="form-control mb-2"
              v-model="newCertItem"
              placeholder="Add service/certificate"
            />
            <button
              class="buttonEditProfile"
              @click="addCertItem"
              id="addCertItem"
            >
              Add
            </button>
          </div>
          <hr />
          <button class="btn btn-primary" @click="saveProfile">Save</button>
          <button
            class="btn btn-secondary"
            @click="showEditProfileModal = false"
          >
            Cancel
          </button>
        </div>
      </div>

      <!-- Update Password Modal -->
      <div v-if="showUpdatePasswordModal" class="modal-overlay">
        <div class="modal-content">
          <h5>Update Password</h5>
          <input
            type="password"
            v-model="currentPassword"
            class="form-control mb-2"
            placeholder="Current Password"
          />
          <input
            type="password"
            v-model="newPassword"
            class="form-control mb-2"
            placeholder="New Password"
          />
          <input
            type="password"
            v-model="confirmPassword"
            class="form-control mb-2"
            placeholder="Confirm Password"
          />

          <div v-if="passwordError" class="alert alert-danger mt-2">
            {{ passwordError }}
          </div>
          <button class="btn btn-primary" @click="updatePassword">
            Update
          </button>
          <button class="btn btn-secondary" @click="handleCancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </LogedInLayout>
  <!-- <div v-else class="loading-spinner">Please Login to account...</div> -->
</template>

<style scoped>
body {
  background-color: #f7fbfc;
}
.card {
  background-color: #ffffff;
  border: none;
  margin-bottom: 30px;
  width: 100%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}
.bio-placeholder {
  color: #6c757d;
}
.review-card {
  background-color: #ffffff;
}
.profile-image {
  width: 150px;
  height: 150px;
  border: 3px solid #769fcd;
}
.button-container {
  margin-top: 10px;
}
.container {
  margin-top: 50px;
}
.card-header {
  background-color: #769fcd;
  color: white;
  font-weight: bold;
}
h6 {
  font-weight: bold;
}
.text-center {
  padding-top: 30px;
}
.btn-primary {
  background-color: #007bff;
  border: none;
}
.btn-primary:hover {
  background-color: #0056b3;
}
.btn-secondary {
  background-color: #6c757d;
  border: none;
}
.btn-secondary:hover {
  background-color: #5a6268;
}
.icon {
  font-size: 18px;
  margin-right: 8px;
}
.transaction-item {
  margin-bottom: 15px;
}

/* Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  max-height: 100vh; /* Adjust based on your design */
  overflow-y: auto; /* Enable vertical scrolling */
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  width: 400px;
  text-align: center;
}
.modal-content h5 {
  color: #769fcd;
  margin-bottom: 15px;
}
.modal-content .btn {
  width: 100%;
  margin-bottom: 10px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 5px 0;
}
.remove {
  cursor: pointer;
  color: red;
  font-weight: bold;
}
.input-group {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
</style>
